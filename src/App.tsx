import React, { useState, useEffect } from 'react';
import { LearnerProfile, LearnerId, Lesson, Pet } from './types';
import { INITIAL_PROFILES, INITIAL_PETS } from './data/profiles';
import { CURRICULUM_LESSONS } from './data/curriculum';
import { Header } from './components/Header';
import { MapAdventure } from './components/MapAdventure';
import { ProfileSelector } from './components/ProfileSelector';
import { LessonModal } from './components/LessonModal';
import { EggHatchingModal } from './components/EggHatchingModal';
import { TreehouseStore } from './components/TreehouseStore';
import { MiniGameModal } from './components/MiniGameModal';
import { ParentPortal } from './components/ParentPortal';
import { DiagnosticTestModal } from './components/DiagnosticTestModal';
import { soundService } from './services/soundService';
import { getDefaultSlot } from './components/room/roomLayout';

const STORAGE_KEY = 'read_with_me_profiles_v5';
const LEGACY_STORAGE_KEY = 'read_with_me_profiles_v4';

/**
 * Give every placed item a position. Rooms saved before item positions were
 * persisted only recorded *which* items were placed, so seed those from the
 * default slots rather than dropping them all in the middle of the floor.
 */
const withSeededLayout = (profile: LearnerProfile): LearnerProfile => {
  const existing = profile.placedItemLayout ?? [];
  const known = new Set(existing.map((entry) => entry.itemId));
  const seeded = (profile.placedTreehouseItems ?? [])
    .filter((itemId) => !known.has(itemId))
    .map((itemId) => ({ itemId, ...getDefaultSlot(itemId) }));

  // Drop layout entries for items that are no longer in the room. Reserved
  // ids (the avatar) are prefixed with __ and always survive.
  const placed = new Set(profile.placedTreehouseItems ?? []);
  const kept = existing.filter(
    (entry) => entry.itemId.startsWith('__') || placed.has(entry.itemId)
  );

  return { ...profile, placedItemLayout: [...kept, ...seeded] };
};

export function App() {
  const [profiles, setProfiles] = useState<LearnerProfile[]>(() => {
    const saved =
      localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY);
    if (saved) {
      try {
        const parsed: LearnerProfile[] = JSON.parse(saved);
        return parsed.map((p) => {
          const initP = INITIAL_PROFILES.find((i) => i.id === p.id);
          const isCustom = p.avatar && (p.avatar.startsWith('data:') || p.avatar.startsWith('blob:'));
          const merged = initP ? { ...p, avatar: isCustom ? p.avatar : initP.avatar } : p;
          return withSeededLayout(merged);
        });
      } catch {
        return INITIAL_PROFILES.map(withSeededLayout);
      }
    }
    return INITIAL_PROFILES.map(withSeededLayout);
  });

  const [activeProfileId, setActiveProfileId] = useState<LearnerId>('tru');
  const [activeMapLevel, setActiveMapLevel] = useState<1 | 2 | 3>(1);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [showProfileSelector, setShowProfileSelector] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [hatchedPet, setHatchedPet] = useState<Pet | null>(null);
  const [showTreehouse, setShowTreehouse] = useState(false);
  const [activeMiniGameId, setActiveMiniGameId] = useState<string | null>(null);
  const [showParentPortal, setShowParentPortal] = useState(false);
  const [showDiagnostic, setShowDiagnostic] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  }, [profiles]);

  const handleResetKidsProgress = (childId?: LearnerId) => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (childId && p.id !== childId) return p;
        const fresh = INITIAL_PROFILES.find((i) => i.id === p.id) || p;
        const isCustomAvatar = p.avatar && (p.avatar.startsWith('data:') || p.avatar.startsWith('blob:'));
        return withSeededLayout({
          ...fresh,
          avatar: isCustomAvatar ? p.avatar : fresh.avatar,
        });
      })
    );
    setActiveMapLevel(1);
    soundService.playSuccessChime();
  };

  const currentProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];

  const handleSelectProfile = (id: LearnerId) => {
    setActiveProfileId(id);
    const prof = profiles.find((p) => p.id === id);
    if (prof) {
      setActiveMapLevel(prof.currentMapLevel);
    }
  };

  const handleFinishLesson = (lessonId: number) => {
    const isMilestoneEgg = lessonId % 5 === 0;

    setProfiles((prevProfiles) =>
      prevProfiles.map((p) => {
        if (p.id !== activeProfileId) return p;

        const isNewCompletion = !p.completedLessonIds.includes(lessonId);
        const newCompleted = isNewCompletion
          ? [...p.completedLessonIds, lessonId]
          : p.completedLessonIds;

        const starReward = isMilestoneEgg ? 35 : 15;
        const newStars = p.starGems + (isNewCompletion ? starReward : 5);

        let newPets = [...p.unlockedPets];
        if (isMilestoneEgg && isNewCompletion) {
          const petToHatch = INITIAL_PETS.find((pet) => pet.hatchingLessonId === lessonId);
          if (petToHatch && !p.unlockedPets.some((pet) => pet.id === petToHatch.id)) {
            newPets.push(petToHatch);
            setHatchedPet(petToHatch);
          }
        }

        return {
          ...p,
          completedLessonIds: newCompleted,
          starGems: newStars,
          unlockedPets: newPets,
          learningMinutes: p.learningMinutes + 12,
        };
      })
    );

    setSelectedLesson(null);
  };

  const handleBuyTreehouseItem = (itemId: string, price: number) => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id !== activeProfileId) return p;
        if (p.starGems < price) return p;

        const updatedItems = p.treehouseItems.map((i) =>
          i.id === itemId ? { ...i, unlocked: true } : i
        );

        const alreadyPlaced = p.placedTreehouseItems.includes(itemId);

        return withSeededLayout({
          ...p,
          starGems: p.starGems - price,
          treehouseItems: updatedItems,
          placedTreehouseItems: alreadyPlaced
            ? p.placedTreehouseItems
            : [...p.placedTreehouseItems, itemId],
        });
      })
    );
  };

  const handlePlaceTreehouseItem = (itemId: string) => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id !== activeProfileId) return p;

        const isAlreadyPlaced = p.placedTreehouseItems.includes(itemId);
        const newPlaced = isAlreadyPlaced
          ? p.placedTreehouseItems.filter((id) => id !== itemId)
          : [...p.placedTreehouseItems, itemId];

        // withSeededLayout adds a slot for a newly placed item and prunes the
        // slot of one that was just taken out of the room.
        return withSeededLayout({ ...p, placedTreehouseItems: newPlaced });
      })
    );
  };

  /** Commit a dragged item's new spot in the room. */
  const handleMoveTreehouseItem = (itemId: string, x: number, y: number) => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id !== activeProfileId) return p;

        const layout = p.placedItemLayout ?? [];
        const hasEntry = layout.some((entry) => entry.itemId === itemId);

        return {
          ...p,
          placedItemLayout: hasEntry
            ? layout.map((entry) => (entry.itemId === itemId ? { ...entry, x, y } : entry))
            : [...layout, { itemId, x, y }],
        };
      })
    );
  };

  const handleResetRoomLayout = () => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === activeProfileId ? withSeededLayout({ ...p, placedItemLayout: [] }) : p
      )
    );
    soundService.playSuccessChime();
  };

  const handleEquipItem = (itemId: string, category: 'hat' | 'outfit' | 'accessory') => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id !== activeProfileId) return p;

        let hat = p.equippedHat;
        let outfit = p.equippedOutfit;
        let accessory = p.equippedAccessory;

        if (category === 'hat') {
          hat = hat === itemId ? undefined : itemId;
        } else if (category === 'outfit') {
          outfit = outfit === itemId ? undefined : itemId;
        } else if (category === 'accessory') {
          accessory = accessory === itemId ? undefined : itemId;
        }

        return {
          ...p,
          equippedHat: hat,
          equippedOutfit: outfit,
          equippedAccessory: accessory,
        };
      })
    );
  };

  const handleApplyDiagnostic = (recommendedMapLevel: 1 | 2 | 3) => {
    setActiveMapLevel(recommendedMapLevel);
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === activeProfileId ? { ...p, currentMapLevel: recommendedMapLevel } : p
      )
    );
  };

  const handleToggleSound = () => {
    if (soundEnabled) {
      soundService.stop();
      setSoundEnabled(false);
    } else {
      setSoundEnabled(true);
      soundService.speak('Sound is enabled!');
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col selection:bg-amber-200">
      <Header
        currentProfile={currentProfile}
        onOpenProfileSelector={() => setShowProfileSelector(true)}
        onOpenTreehouse={() => setShowTreehouse(true)}
        onOpenParentPortal={() => setShowParentPortal(true)}
        activeMapLevel={activeMapLevel}
        onChangeMapLevel={(level) => setActiveMapLevel(level)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      <main className="flex-1">
        <MapAdventure
          currentProfile={currentProfile}
          mapLevel={activeMapLevel}
          lessons={CURRICULUM_LESSONS}
          onSelectLesson={(lesson) => setSelectedLesson(lesson)}
        />
      </main>

      {showProfileSelector && (
        <ProfileSelector
          profiles={profiles}
          currentProfileId={activeProfileId}
          onSelectProfile={handleSelectProfile}
          onClose={() => setShowProfileSelector(false)}
        />
      )}

      {selectedLesson && (
        <LessonModal
          lesson={selectedLesson}
          onClose={() => setSelectedLesson(null)}
          onFinishLesson={handleFinishLesson}
        />
      )}

      {hatchedPet && (
        <EggHatchingModal pet={hatchedPet} onClose={() => setHatchedPet(null)} />
      )}

      {showTreehouse && (
        <TreehouseStore
          currentProfile={currentProfile}
          onBuyItem={handleBuyTreehouseItem}
          onPlaceItem={handlePlaceTreehouseItem}
          onMoveItem={handleMoveTreehouseItem}
          onResetRoomLayout={handleResetRoomLayout}
          onEquipItem={handleEquipItem}
          onLaunchMiniGame={(gameId: string) => setActiveMiniGameId(gameId)}
          onClose={() => setShowTreehouse(false)}
        />
      )}

      {activeMiniGameId && (
        <MiniGameModal
          gameId={activeMiniGameId}
          currentProfile={currentProfile}
          onClose={() => setActiveMiniGameId(null)}
        />
      )}

      {showParentPortal && (
        <ParentPortal
          profiles={profiles}
          onUpdateProfile={(updatedProfile) => {
            setProfiles((prev) =>
              prev.map((p) => (p.id === updatedProfile.id ? updatedProfile : p))
            );
          }}
          onResetKidsProgress={handleResetKidsProgress}
          onOpenDiagnostic={() => {
            setShowParentPortal(false);
            setShowDiagnostic(true);
          }}
          onClose={() => setShowParentPortal(false)}
        />
      )}

      {showDiagnostic && (
        <DiagnosticTestModal
          currentProfile={currentProfile}
          onApplyDiagnosticResults={handleApplyDiagnostic}
          onClose={() => setShowDiagnostic(false)}
        />
      )}
    </div>
  );
}

export default App;
