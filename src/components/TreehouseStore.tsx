import React, { useState } from 'react';
import { LearnerProfile, TreehouseItem, Pet } from '../types';
import { Sparkles, Home, Gamepad2, Shirt, X, Volume2, Check, Lock, Palette, Plus, Minus, Tag, RotateCcw } from 'lucide-react';
import { soundService } from '../services/soundService';
import { AvatarImage } from './AvatarImage';
import { TreehouseRoomStage } from './room/TreehouseRoomStage';

interface TreehouseStoreProps {
  currentProfile: LearnerProfile;
  onBuyItem: (itemId: string, price: number) => void;
  onPlaceItem: (itemId: string) => void;
  onEquipItem: (itemId: string, category: 'hat' | 'outfit' | 'accessory') => void;
  onLaunchMiniGame: (gameId: string) => void;
  onClose: () => void;
}

export const TreehouseStore: React.FC<TreehouseStoreProps> = ({
  currentProfile,
  onBuyItem,
  onPlaceItem,
  onEquipItem,
  onLaunchMiniGame,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'room' | 'wardrobe' | 'decor' | 'minigames'>('room');
  const [roomCategoryFilter, setRoomCategoryFilter] = useState<'all' | 'furniture' | 'toy' | 'decor'>('all');
  const [wardrobeCategory, setWardrobeCategory] = useState<'all' | 'hat' | 'outfit' | 'accessory'>('all');
  const [activeSpeechText, setActiveSpeechText] = useState<string>(
    `Welcome inside ${currentProfile.name}'s Treehouse! Tap any furniture, toy, or pet to inspect!`
  );

  // Unboxing Modal State
  const [unboxedItem, setUnboxedItem] = useState<TreehouseItem | null>(null);

  const handlePurchaseAndUnbox = (item: TreehouseItem) => {
    soundService.playSuccessChime();
    soundService.speak(`Unboxing ${item.name}! Yay!`);
    onBuyItem(item.id, item.price);
    setUnboxedItem(item);
  };

  // Helper to find item details
  const getItem = (id?: string): TreehouseItem | undefined =>
    currentProfile.treehouseItems.find((i) => i.id === id);

  const equippedHatItem = getItem(currentProfile.equippedHat);
  const equippedOutfitItem = getItem(currentProfile.equippedOutfit);
  const equippedAccessoryItem = getItem(currentProfile.equippedAccessory);

  const placedItems = currentProfile.placedTreehouseItems
    .map((id) => getItem(id))
    .filter((item): item is TreehouseItem => item !== undefined);

  const handleRoomItemClick = (title: string, text: string) => {
    soundService.playPopSound();
    setActiveSpeechText(`"${title}" — ${text}`);
    soundService.speak(text);
  };

  // Fixed 2.5D Room Slot Coordinates (left %, top %, zIndex, scale/style)
  const itemSlotCoordinates: Record<string, { left: string; top: string; zIndex: number; scale?: string }> = {
    // Ceiling & High Wall
    fairy_lights: { left: '50%', top: '6%', zIndex: 40 },
    disco_ball: { left: '50%', top: '16%', zIndex: 42 },
    treehouse_hammock: { left: '50%', top: '26%', zIndex: 18 },
    
    // Wall Nooks
    bookshelf_nook: { left: '14%', top: '28%', zIndex: 15 },
    star_telescope: { left: '85%', top: '32%', zIndex: 16 },

    // Middle/Back Floor
    treehouse_bed: { left: '16%', top: '54%', zIndex: 20 },
    secret_tent: { left: '82%', top: '56%', zIndex: 22 },
    
    // Main Floor Areas
    rainbow_rug: { left: '50%', top: '72%', zIndex: 10 },
    comfy_couch: { left: '28%', top: '68%', zIndex: 25 },
    phonics_desk: { left: '20%', top: '80%', zIndex: 35 },
    stuffed_bear: { left: '36%', top: '78%', zIndex: 32 },
    wooden_train: { left: '68%', top: '82%', zIndex: 36 },
    potted_plant: { left: '88%', top: '75%', zIndex: 33 },
  };

  // 2.5D Coordinates for Unlocked Pets roaming the floor
  const petCoordinates = [
    { left: '38%', top: '66%', zIndex: 28 },
    { left: '62%', top: '70%', zIndex: 29 },
    { left: '78%', top: '68%', zIndex: 31 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-amber-50 rounded-3xl border-4 border-amber-400 shadow-2xl p-4 sm:p-6 my-auto max-h-[96vh] flex flex-col overflow-y-auto">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b-2 border-amber-200 pb-3 mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-3xl sm:text-4xl animate-bounce-subtle">🪵</span>
            <div>
              <h2 className="text-xl sm:text-3xl font-display font-extrabold text-amber-950 leading-tight">
                {currentProfile.name}'s Treehouse Sanctuary
              </h2>
              <p className="text-xs sm:text-sm text-amber-800 font-medium">
                2.5D Room • Custom Furniture • Clothes Closet • Arcade Games
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 bg-yellow-300 border-2 border-yellow-500 text-yellow-950 px-3 py-1.5 rounded-full font-display font-extrabold text-xs sm:text-sm shadow-inner">
              <Sparkles className="w-4 h-4 text-amber-700 fill-amber-500 animate-pulse" />
              <span>{currentProfile.starGems} Star Gems</span>
            </div>

            <button
              onClick={() => {
                soundService.playBoopSound();
                onClose();
              }}
              className="p-2 bg-amber-200 hover:bg-amber-300 active:scale-95 text-amber-950 rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-3 mb-4 bg-amber-200/60 p-1.5 rounded-2xl border border-amber-300 overflow-x-auto">
          <button
            onClick={() => {
              soundService.playPopSound();
              setActiveTab('room');
            }}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'room'
                ? 'bg-amber-600 text-white shadow-md scale-102'
                : 'text-amber-900 hover:bg-amber-300/60'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Treehouse 2.5D Room</span>
          </button>

          <button
            onClick={() => {
              soundService.playPopSound();
              setActiveTab('wardrobe');
            }}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'wardrobe'
                ? 'bg-amber-600 text-white shadow-md scale-102'
                : 'text-amber-900 hover:bg-amber-300/60'
            }`}
          >
            <Shirt className="w-4 h-4" />
            <span>Clothes Closet</span>
          </button>

          <button
            onClick={() => {
              soundService.playPopSound();
              setActiveTab('decor');
            }}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'decor'
                ? 'bg-amber-600 text-white shadow-md scale-102'
                : 'text-amber-900 hover:bg-amber-300/60'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Furniture Shop</span>
          </button>

          <button
            onClick={() => {
              soundService.playPopSound();
              setActiveTab('minigames');
            }}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'minigames'
                ? 'bg-amber-600 text-white shadow-md scale-102'
                : 'text-amber-900 hover:bg-amber-300/60'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Arcade Games</span>
          </button>
        </div>

        {/* TAB 1: VISUAL 2.5D INTERIOR TREEHOUSE ROOM CANVAS */}
        {activeTab === 'room' && (
          <div className="space-y-4">
            {/* Interactive 2.5D Graphical Treehouse Room Stage */}
            <TreehouseRoomStage
              currentProfile={currentProfile}
              placedItems={placedItems}
              equippedHatItem={equippedHatItem}
              equippedOutfitItem={equippedOutfitItem}
              equippedAccessoryItem={equippedAccessoryItem}
              onItemClick={handleRoomItemClick}
            />

            {/* Interactive Speech Banner */}
            <div className="bg-amber-100 border-2 border-amber-300 rounded-2xl p-3 flex items-center gap-3 shadow-sm">
              <Volume2 className="w-5 h-5 text-amber-700 shrink-0 animate-pulse" />
              <p className="text-xs sm:text-sm font-display font-bold text-amber-950">
                {activeSpeechText}
              </p>
            </div>

            {/* Quick Placed Items Management Strip */}
            <div className="bg-white border-2 border-amber-200 rounded-2xl p-3 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-display font-bold text-amber-950">
                <span>Placed Room Objects ({placedItems.length})</span>
                <button
                  onClick={() => setActiveTab('decor')}
                  className="text-amber-700 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Get More Furniture</span>
                </button>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {placedItems.length > 0 ? (
                  placedItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        soundService.playPopSound();
                        onPlaceItem(item.id);
                      }}
                      className="flex items-center gap-1.5 bg-amber-100 hover:bg-red-100 text-amber-950 hover:text-red-950 px-2.5 py-1 rounded-xl border border-amber-300 text-xs font-bold transition-colors whitespace-nowrap shrink-0 group"
                      title="Click to remove from room"
                    >
                      <span>{item.icon}</span>
                      <span>{item.name}</span>
                      <Minus className="w-3 h-3 text-red-600 opacity-60 group-hover:opacity-100" />
                    </button>
                  ))
                ) : (
                  <span className="text-xs text-amber-800 font-medium italic">No furniture placed yet! Go to Furniture Shop to buy and place items!</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CLOTHES CLOSET / AVATAR WARDROBE */}
        {activeTab === 'wardrobe' && (
          <div className="space-y-4">
            {/* Closet Header & Interactive Mannequin */}
            <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-amber-100 border-3 border-purple-300 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5 shadow-sm">
              
              {/* Center Dressing Stand */}
              <div className="relative group">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-purple-400 shadow-2xl bg-purple-500 overflow-hidden flex items-center justify-center shrink-0">
                  <AvatarImage
                    avatar={currentProfile.avatar}
                    name={currentProfile.name}
                    equippedHatIcon={equippedHatItem?.icon}
                    equippedOutfitIcon={equippedOutfitItem?.icon}
                    equippedAccessoryIcon={equippedAccessoryItem?.icon}
                    fallbackTextSize="text-6xl"
                  />
                </div>

                {/* Mirror Sparkles */}
                <span className="absolute -top-1 -right-1 text-2xl animate-pulse">✨</span>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 bg-purple-600 text-white font-display font-extrabold text-[11px] px-3 py-0.5 rounded-full mb-1">
                  <Shirt className="w-3.5 h-3.5" />
                  <span>DRESS-UP CLOSET</span>
                </div>
                <h3 className="font-display font-black text-xl sm:text-2xl text-purple-950">
                  {currentProfile.name}'s Fashion Studio
                </h3>
                <p className="text-xs text-purple-900 mt-0.5">
                  Unlock hats, costumes, capes, and glasses with Star Gems earned from phonics lessons!
                </p>

                {/* Currently Wearing Badges */}
                <div className="mt-3 flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                  <div className="text-xs font-bold text-purple-950 bg-white/90 px-3 py-1 rounded-xl border border-purple-300 shadow-sm flex items-center gap-1.5">
                    <span>Hat:</span>
                    <span className="text-purple-700">{equippedHatItem ? `${equippedHatItem.icon} ${equippedHatItem.name}` : 'None'}</span>
                  </div>
                  <div className="text-xs font-bold text-purple-950 bg-white/90 px-3 py-1 rounded-xl border border-purple-300 shadow-sm flex items-center gap-1.5">
                    <span>Outfit:</span>
                    <span className="text-purple-700">{equippedOutfitItem ? `${equippedOutfitItem.icon} ${equippedOutfitItem.name}` : 'None'}</span>
                  </div>
                  <div className="text-xs font-bold text-purple-950 bg-white/90 px-3 py-1 rounded-xl border border-purple-300 shadow-sm flex items-center gap-1.5">
                    <span>Accessory:</span>
                    <span className="text-purple-700">{equippedAccessoryItem ? `${equippedAccessoryItem.icon} ${equippedAccessoryItem.name}` : 'None'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Wardrobe Sub-Filter Tabs */}
            <div className="flex items-center gap-2 bg-purple-200/50 p-1.5 rounded-2xl border border-purple-300">
              {(['all', 'hat', 'outfit', 'accessory'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setWardrobeCategory(cat)}
                  className={`flex-1 py-1.5 px-3 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all ${
                    wardrobeCategory === cat
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-purple-900 hover:bg-purple-200'
                  }`}
                >
                  {cat === 'all' ? 'All Clothes' : `${cat}s`}
                </button>
              ))}
            </div>

            {/* Clothes Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[380px] overflow-y-auto pr-1">
              {currentProfile.treehouseItems
                .filter((i) => ['hat', 'outfit', 'accessory'].includes(i.category))
                .filter((i) => wardrobeCategory === 'all' || i.category === wardrobeCategory)
                .map((item) => {
                  const isUnlocked = item.unlocked;
                  const canAfford = currentProfile.starGems >= item.price;
                  const isEquipped =
                    currentProfile.equippedHat === item.id ||
                    currentProfile.equippedOutfit === item.id ||
                    currentProfile.equippedAccessory === item.id;

                  return (
                    <div
                      key={item.id}
                      className={`bg-white border-3 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-md transition-all ${
                        isEquipped ? 'border-purple-500 bg-purple-50' : 'border-amber-300 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-4xl p-2.5 bg-purple-100 rounded-2xl border border-purple-200 shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-display font-bold text-sm text-slate-900">
                              {item.name}
                            </h4>
                            <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.2 bg-purple-100 text-purple-800 rounded">
                              {item.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{item.description}</p>
                          {!isUnlocked && (
                            <div className="flex items-center gap-1 text-xs font-bold text-amber-700 mt-1">
                              <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
                              <span>{item.price} Star Gems</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isUnlocked ? (
                          <button
                            onClick={() => {
                              soundService.playPopSound();
                              onEquipItem(item.id, item.category as 'hat' | 'outfit' | 'accessory');
                            }}
                            className={`font-display font-bold text-xs px-3.5 py-2 rounded-xl border transition-all flex items-center gap-1.5 ${
                              isEquipped
                                ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-700 shadow-md'
                                : 'bg-purple-100 hover:bg-purple-200 text-purple-950 border-purple-300'
                            }`}
                          >
                            {isEquipped ? <Check className="w-4 h-4" /> : null}
                            <span>{isEquipped ? 'Wearing' : 'Wear Item'}</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              if (canAfford) {
                                handlePurchaseAndUnbox(item);
                              } else {
                                soundService.playBoopSound();
                                soundService.speak(`Need ${item.price - currentProfile.starGems} more Star Gems!`);
                              }
                            }}
                            className={`font-display font-bold text-xs px-3.5 py-2 rounded-xl border transition-all flex items-center gap-1.5 ${
                              canAfford
                                ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600 shadow-md active:scale-95'
                                : 'bg-slate-200 text-slate-500 border-slate-300 cursor-not-allowed'
                            }`}
                          >
                            {canAfford ? (
                              <>
                                <Sparkles className="w-3.5 h-3.5 fill-current" />
                                <span>Unlock</span>
                              </>
                            ) : (
                              <>
                                <Lock className="w-3.5 h-3.5" />
                                <span>Locked</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* TAB 3: FURNITURE & DECOR SHOP */}
        {activeTab === 'decor' && (
          <div className="space-y-4">
            {/* Sub-filters for Room Items */}
            <div className="flex items-center gap-2">
              {(['all', 'furniture', 'toy', 'decor'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setRoomCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl font-display font-bold text-xs capitalize transition-all ${
                    roomCategoryFilter === cat
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[400px] overflow-y-auto pr-1">
              {currentProfile.treehouseItems
                .filter((i) => ['furniture', 'toy', 'decor'].includes(i.category))
                .filter((i) => roomCategoryFilter === 'all' || i.category === roomCategoryFilter)
                .map((item) => {
                  const isUnlocked = item.unlocked;
                  const isPlaced = currentProfile.placedTreehouseItems.includes(item.id);
                  const canAfford = currentProfile.starGems >= item.price;

                  return (
                    <div
                      key={item.id}
                      className="bg-white border-3 border-amber-300 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-md hover:border-amber-500 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-4xl p-2.5 bg-amber-100 rounded-2xl border border-amber-200 shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-sm text-slate-900">
                            {item.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{item.description}</p>
                          {!isUnlocked && (
                            <div className="flex items-center gap-1 text-xs font-bold text-amber-700 mt-1">
                              <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
                              <span>{item.price} Star Gems</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isUnlocked ? (
                          <button
                            onClick={() => {
                              soundService.playPopSound();
                              onPlaceItem(item.id);
                            }}
                            className={`font-display font-bold text-xs px-3.5 py-2 rounded-xl border transition-all ${
                              isPlaced
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : 'bg-amber-200 hover:bg-amber-300 text-amber-950 border-amber-400'
                            }`}
                          >
                            {isPlaced ? 'In Room' : 'Place'}
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              if (canAfford) {
                                handlePurchaseAndUnbox(item);
                              } else {
                                soundService.playBoopSound();
                                soundService.speak(`Need ${item.price - currentProfile.starGems} more Star Gems!`);
                              }
                            }}
                            className={`font-display font-bold text-xs px-3.5 py-2 rounded-xl border transition-all flex items-center gap-1 ${
                              canAfford
                                ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600 shadow-md active:scale-95'
                                : 'bg-slate-200 text-slate-500 border-slate-300 cursor-not-allowed'
                            }`}
                          >
                            {canAfford ? 'Unlock' : <Lock className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* TAB 4: MINI-GAMES */}
        {activeTab === 'minigames' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentProfile.treehouseItems
              .filter((i) => i.category === 'minigame')
              .map((item) => (
                <div
                  key={item.id}
                  className="bg-white border-3 border-amber-300 rounded-3xl p-5 flex flex-col justify-between shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-5xl p-3 bg-amber-100 rounded-2xl border border-amber-200 shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-lg text-slate-900">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-600">{item.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      soundService.playPopSound();
                      onLaunchMiniGame(item.id);
                    }}
                    className="w-full bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-display font-bold text-sm py-2.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Gamepad2 className="w-4 h-4" />
                    <span>Launch Game</span>
                  </button>
                </div>
              ))}
          </div>
        )}

        {/* UNBOXING GIFT BOX CELEBRATION MODAL */}
        {unboxedItem && (
          <div className="fixed inset-0 z-60 bg-amber-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            <div className="relative bg-gradient-to-b from-amber-100 to-amber-200 border-4 border-amber-400 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl space-y-4 animate-bounce-subtle">
              <div className="relative mx-auto w-28 h-28 flex items-center justify-center">
                <span className="text-7xl animate-bounce">🎁</span>
                <span className="absolute -top-2 -right-2 text-3xl animate-ping">✨</span>
                <span className="absolute -bottom-2 -left-2 text-3xl animate-ping">🌟</span>
              </div>

              <div>
                <span className="bg-amber-600 text-yellow-200 font-display font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                  NEW UNLOCKED ITEM!
                </span>
                <h3 className="font-display font-black text-2xl text-amber-950 mt-2">
                  {unboxedItem.name}
                </h3>
                <p className="text-xs font-bold text-amber-800 mt-1">
                  {unboxedItem.description}
                </p>
              </div>

              <div className="p-4 bg-white/90 border-2 border-amber-300 rounded-2xl flex items-center justify-center gap-3">
                <span className="text-5xl">{unboxedItem.icon}</span>
              </div>

              <button
                onClick={() => {
                  soundService.playPopSound();
                  soundService.speak(`Ready to use ${unboxedItem.name}!`);
                  setUnboxedItem(null);
                  setActiveTab('room');
                }}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-display font-extrabold text-sm rounded-2xl shadow-xl transition-all"
              >
                Go to Treehouse Room!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
