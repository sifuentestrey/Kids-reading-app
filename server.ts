import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import {
  TTS_MODELS,
  resolveGeminiVoice,
  synthesizeGeminiSpeech,
} from "./shared/audio";

/**
 * Same two names, same order, as the Netlify function: `GOOGLE_AI_STUDIO_KEY`
 * wins because Netlify's AI Gateway claims `GEMINI_API_KEY` for a token that is
 * not a Google key. Keeping the order identical means a working local setup
 * stays working once deployed.
 */
function getGeminiKey(): string | undefined {
  return (
    process.env.GOOGLE_AI_STUDIO_KEY?.trim() || process.env.GEMINI_API_KEY?.trim() || undefined
  );
}

async function startServer() {
  const app = express();
  // Hosts that run this for us (Render, Fly, Heroku) assign a port and expect the
  // service to listen on it, so an environment variable has to win over the local
  // default or the deployment never becomes reachable.
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Text-to-Speech API Route (Gemini TTS + ElevenLabs Proxy)
  app.post("/api/tts", async (req, res) => {
    try {
      const { text, voiceId, apiKey: clientApiKey, provider } = req.body;

      if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "Missing required field: text" });
      }

      const cleanText = text.trim();

      // 1. Try ElevenLabs if explicitly configured with an API key
      const elevenKey =
        clientApiKey ||
        (req.headers["x-elevenlabs-key"] as string) ||
        process.env.ELEVENLABS_API_KEY;

      if ((provider === "elevenlabs" || (!provider && elevenKey)) && elevenKey) {
        try {
          const targetVoiceId = voiceId || "MF3mGyEYCl7XYWbV9V6O";
          const elevenLabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${targetVoiceId}`;

          const response = await fetch(elevenLabsUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "xi-api-key": elevenKey,
              Accept: "audio/mpeg",
            },
            body: JSON.stringify({
              text: cleanText,
              model_id: "eleven_turbo_v2_5",
              voice_settings: {
                stability: 0.45,
                similarity_boost: 0.8,
                style: 0.2,
                use_speaker_boost: true,
              },
            }),
          });

          if (response.ok) {
            const audioArrayBuffer = await response.arrayBuffer();
            const audioBuffer = Buffer.from(audioArrayBuffer);

            res.setHeader("Content-Type", "audio/mpeg");
            res.setHeader("Cache-Control", "public, max-age=86400");
            return res.send(audioBuffer);
          } else {
            console.warn("ElevenLabs returned non-200, falling back to Gemini TTS");
          }
        } catch (elevenErr) {
          console.warn("ElevenLabs fetch error, falling back to Gemini TTS:", elevenErr);
        }
      }

      // 2. High-Quality Gemini AI Studio TTS. Same helper the Netlify function
      // uses, so the voice cannot differ depending on how the app was deployed.
      const geminiKey = getGeminiKey();
      if (geminiKey) {
        const selectedVoice = resolveGeminiVoice(voiceId);

        for (const model of TTS_MODELS) {
          try {
            const wavBuffer = await synthesizeGeminiSpeech({
              apiKey: geminiKey,
              text: cleanText,
              model,
              voiceName: selectedVoice,
            });

            res.setHeader("Content-Type", "audio/wav");
            res.setHeader("Cache-Control", "public, max-age=86400");
            res.setHeader("X-TTS-Model", model);
            return res.send(wavBuffer);
          } catch (geminiErr) {
            console.warn(
              `Gemini TTS failed on ${model}:`,
              geminiErr instanceof Error ? geminiErr.message : geminiErr
            );
          }
        }
      }

      // 3. Fallback response if neither server TTS API produced audio
      return res.status(200).json({
        success: false,
        fallback: true,
        message: "No server audio key available. Using browser speech synthesis.",
      });
    } catch (err: unknown) {
      console.error("TTS Endpoint Error:", err);
      return res.status(500).json({
        error: "Server internal error on TTS request.",
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.use((_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
