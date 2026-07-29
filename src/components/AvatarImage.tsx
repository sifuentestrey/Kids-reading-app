import React from 'react';

interface AvatarImageProps {
  avatar: string;
  name: string;
  className?: string;
  fallbackTextSize?: string;
  equippedHatIcon?: string;
  equippedOutfitIcon?: string;
  equippedAccessoryIcon?: string;
}

export const AvatarImage: React.FC<AvatarImageProps> = ({
  avatar,
  name,
  className = 'w-full h-full object-cover',
  fallbackTextSize = 'text-3xl',
  equippedHatIcon,
  equippedOutfitIcon,
  equippedAccessoryIcon,
}) => {
  const isExternal = avatar.startsWith('http://') || avatar.startsWith('https://');
  const imageUrl = isExternal && !avatar.includes('corsproxy.io')
    ? `https://corsproxy.io/?url=${encodeURIComponent(avatar)}`
    : avatar;

  const isImage = avatar.startsWith('/') || isExternal || avatar.startsWith('data:') || avatar.includes('.');

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Hat / Headwear Overlay */}
      {equippedHatIcon && (
        <div className="absolute -top-3 z-20 text-2xl drop-shadow-md animate-bounce-subtle pointer-events-none select-none">
          {equippedHatIcon}
        </div>
      )}

      {/* Main Avatar Image or Text */}
      {isImage ? (
        <img
          src={imageUrl}
          alt={name}
          className={className}
          referrerPolicy="no-referrer"
        />
      ) : (
        <span className={fallbackTextSize}>{avatar}</span>
      )}

      {/* Outfit Badge Overlay */}
      {equippedOutfitIcon && (
        <div className="absolute -bottom-1 -left-1 z-20 text-lg bg-amber-400 border border-white rounded-full p-0.5 shadow-sm select-none">
          {equippedOutfitIcon}
        </div>
      )}

      {/* Accessory Overlay */}
      {equippedAccessoryIcon && (
        <div className="absolute -bottom-1 -right-1 z-20 text-lg bg-indigo-500 border border-white rounded-full p-0.5 shadow-sm select-none">
          {equippedAccessoryIcon}
        </div>
      )}
    </div>
  );
};
