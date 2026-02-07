import { cn } from "@/lib/utils";

interface WhaleIconProps {
  className?: string;
  size?: number;
}

export function WhaleIcon({ className, size = 24 }: WhaleIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-foreground", className)}
    >
      {/* Whale body */}
      <path
        d="M3 12C3 8 6 5 11 5C16 5 19 7 20 9C21 11 21 13 20 15C19 17 16 19 11 19C6 19 3 16 3 12Z"
        fill="currentColor"
        opacity="0.2"
      />
      <path
        d="M3 12C3 8 6 5 11 5C16 5 19 7 20 9C21 11 21 13 20 15C19 17 16 19 11 19C6 19 3 16 3 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Tail */}
      <path
        d="M3 12C1 10 1 8 2 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 12C1 14 1 16 2 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Water spout */}
      <path
        d="M15 5V3M13 4V2M17 4V2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Eye */}
      <circle cx="16" cy="11" r="1" fill="currentColor" />
    </svg>
  );
}
