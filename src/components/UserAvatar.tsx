import Image from "next/image";

const AVATAR_COUNT = 144;

function avatarIndex(seed: string) {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % AVATAR_COUNT + 1;
}

export function UserAvatar({
  name,
  seed,
  size,
  avatarIndex: requestedIndex,
  className = "",
}: {
  name: string;
  seed?: string;
  size: number;
  avatarIndex?: number;
  className?: string;
}) {
  const index = requestedIndex && requestedIndex >= 1 && requestedIndex <= AVATAR_COUNT
    ? requestedIndex
    : avatarIndex(seed ?? name);

  return (
    <Image
      src={`/avatars/${String(index).padStart(3, "0")}.webp`}
      alt={`${name} profile photo`}
      width={size}
      height={size}
      sizes={`${size}px`}
      quality={80}
      className={`shrink-0 rounded-full border border-[#90CAF9] bg-[#E3F2FD] object-cover ${className}`}
    />
  );
}
