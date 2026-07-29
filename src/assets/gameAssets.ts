// Central Game Asset Sprite Registry with Real 2D/Isometric Game Assets and Kenney.nl / OpenGameArt CC0 Sprite Image URLs

import cabinBg from './images/treehouse_cabin_bg_1785177869250.jpg';
import bedSprite from './images/cozy_bed_asset_1785177880926.jpg';
import couchSprite from './images/cozy_couch_asset_1785177891183.jpg';
import teddyBearSprite from './images/teddy_bear_asset_1785177922326.jpg';
import avatarSprite from './images/avatar_learner_asset_1785177900475.jpg';
import bunnySprite from './images/pet_bunny_asset_1785177912010.jpg';
import bookshelfSprite from './images/bookshelf_asset_1785177948111.jpg';
import telescopeSprite from './images/telescope_asset_1785177959483.jpg';
import trainSprite from './images/wooden_train_asset_1785177970664.jpg';
import owlSprite from './images/pet_owl_asset_1785177981626.jpg';
import foxSprite from './images/pet_fox_asset_1785177993570.jpg';

export const getProxiedImageUrl = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    if (!url.includes('corsproxy.io')) {
      return `https://corsproxy.io/?url=${encodeURIComponent(url)}`;
    }
  }
  return url;
};

export const GAME_BACKGROUNDS = {
  woodCabinInterior: cabinBg,
  // High quality wood cabin texture fallback asset
  woodCabinTexture: getProxiedImageUrl('https://images.unsplash.com/photo-1546484475-7f7bd55792da?auto=format&fit=crop&w=1200&q=80'),
};

export const FURNITURE_SPRITES: Record<string, string> = {
  treehouse_bed: bedSprite,
  comfy_couch: couchSprite,
  bookshelf_nook: bookshelfSprite,
  star_telescope: telescopeSprite,
  stuffed_bear: teddyBearSprite,
  wooden_train: trainSprite,
  phonics_desk: getProxiedImageUrl('https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80'),
  secret_tent: getProxiedImageUrl('https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=600&q=80'),
  treehouse_hammock: getProxiedImageUrl('https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=600&q=80'),
  potted_plant: getProxiedImageUrl('https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80'),
  retro_tv: getProxiedImageUrl('https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80'),
  lava_lamp: getProxiedImageUrl('https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80'),
  neon_star: getProxiedImageUrl('https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80'),
  glowing_aquarium: getProxiedImageUrl('https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=600&q=80'),
  retro_jukebox: getProxiedImageUrl('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80'),
  rainbow_rug: getProxiedImageUrl('https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=600&q=80'),
};

export const PET_SPRITES: Record<string, string> = {
  bunny: bunnySprite,
  owl: owlSprite,
  fox: foxSprite,
  dragon: getProxiedImageUrl('https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80'),
};

export const AVATAR_SPRITE = avatarSprite;
