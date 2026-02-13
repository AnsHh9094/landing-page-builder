import React, { useRef, useState, useEffect, useCallback } from "react";

interface ShinyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    stream?: MediaStream | null;
}

export const ShinyButton: React.FC<ShinyButtonProps> = ({
    children,
    className = "",
    disabled,
    stream = null,
    ...props
}) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const mirrorRef = useRef<HTMLVideoElement>(null);
    const specularVideoRef = useRef<HTMLVideoElement>(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isPressed, setIsPressed] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Attach stream to video elements
    useEffect(() => {
        if (stream) {
            if (videoRef.current) videoRef.current.srcObject = stream;
            if (mirrorRef.current) mirrorRef.current.srcObject = stream;
            if (specularVideoRef.current) specularVideoRef.current.srcObject = stream;
        }
    }, [stream]);

    // Track mouse for light reflection
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const nx = (e.clientX - centerX) / (window.innerWidth / 1.2);
        const ny = (e.clientY - centerY) / (window.innerHeight / 1.2);
        setOffset({
            x: Math.max(-1, Math.min(1, nx)),
            y: Math.max(-1, Math.min(1, ny)),
        });
    }, []);

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [handleMouseMove]);

    const hasCamera = !!stream;

    return (
        <button
            ref={buttonRef}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onMouseLeave={() => {
                setIsPressed(false);
                setIsHovered(false);
            }}
            onMouseEnter={() => setIsHovered(true)}
            disabled={disabled}
            className={`relative group overflow-hidden flex items-center justify-center outline-none isolate cursor-pointer ${className}`}
            style={{
                background: hasCamera ? "#0f172a" : undefined,
                transform: `scale(${isPressed ? 0.95 : 1})`,
                transition:
                    "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.5s ease",
                boxShadow: hasCamera
                    ? isPressed
                        ? `0 4px 8px -4px rgba(0,0,0,0.8), inset 0 15px 30px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.05)`
                        : `
              0 70px 140px -20px rgba(0,0,0,0.6),
              0 40px 80px -30px rgba(0,0,0,0.7),
              0 -5px 30px rgba(255,255,255,1),
              inset 0 0 0 3px rgba(255,255,255,1)
            `
                    : undefined,
            }}
            {...props}
        >
            {hasCamera ? (
                <>
                    {/* Base chrome gradient */}
                    <div
                        className="absolute inset-0 z-0"
                        style={{
                            background:
                                "linear-gradient(135deg, #ffffff 0%, #e2e8f0 12%, #ffffff 25%, #94a3b8 40%, #cbd5e1 50%, #94a3b8 60%, #e2e8f0 75%, #cbd5e1 88%, #ffffff 100%)",
                        }}
                    />

                    {/* Noise texture */}
                    <div
                        className="absolute inset-0 pointer-events-none z-[1] mix-blend-overlay"
                        style={{
                            opacity: 0.25,
                            backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')`,
                            filter: "contrast(200%) brightness(1.3) saturate(0)",
                            backgroundSize: "80px 80px",
                        }}
                    />

                    {/* Webcam refraction layer 1 — environment map */}
                    <div
                        className="absolute inset-[-100px] pointer-events-none z-[2] transition-transform duration-1000 ease-out"
                        style={{
                            transform: `translate(${offset.x * 3}px, ${offset.y * 3}px) scale(1.1)`,
                            filter:
                                "url(#chromatic-aberration) url(#surface-bump) url(#convex-mirror)",
                        }}
                    >
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline
                            className="w-full h-full object-cover scale-x-[-1]"
                            style={{
                                filter: "contrast(1.4) brightness(0.7) saturate(0.3) blur(3px)",
                                mixBlendMode: "multiply",
                                opacity: 0.75,
                            }}
                        />
                    </div>

                    {/* Webcam refraction layer 2 — soft light mirror */}
                    <div
                        className="absolute inset-[-100px] pointer-events-none z-[3] transition-transform duration-500 ease-out"
                        style={{
                            transform: `translate(${offset.x * 5}px, ${offset.y * 5}px) scale(1.15)`,
                            filter: "url(#convex-mirror)",
                        }}
                    >
                        <video
                            ref={mirrorRef}
                            autoPlay
                            muted
                            playsInline
                            className="w-full h-full object-cover scale-x-[-1]"
                            style={{
                                filter: "contrast(1.2) brightness(1.4) saturate(0.4) blur(1px)",
                                mixBlendMode: "soft-light",
                                opacity: 0.65,
                            }}
                        />
                    </div>

                    {/* Moving light bar */}
                    <div
                        className="absolute inset-[-100%] z-[4] pointer-events-none opacity-40 transition-transform duration-500"
                        style={{
                            transform: `rotate(${offset.x * 20}deg) translate(${offset.x * 8}%, ${offset.y * 8}%)`,
                            background:
                                "linear-gradient(115deg, transparent 46%, rgba(255,255,255,0.8) 49.5%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.8) 50.5%, transparent 54%)",
                            mixBlendMode: "overlay",
                        }}
                    />

                    {/* Outer border ring */}
                    <div className="absolute inset-0 rounded-[inherit] border-[2px] border-white/80 z-[7] pointer-events-none" />

                    {/* Inner bevel border */}
                    <div
                        className="absolute inset-[3px] rounded-[inherit] border-[3px] z-[7] pointer-events-none"
                        style={{
                            borderTopColor: "rgba(255,255,255,0.9)",
                            borderLeftColor: "rgba(255,255,255,0.7)",
                            borderRightColor: "rgba(30,41,59,0.3)",
                            borderBottomColor: "rgba(15,23,42,0.6)",
                            boxShadow:
                                "inset 0 4px 8px rgba(255,255,255,0.8), inset 0 -3px 6px rgba(0,0,0,0.3)",
                        }}
                    />

                    {/* Webcam specular highlights */}
                    <div
                        className="absolute inset-[-80px] pointer-events-none z-[8] transition-transform duration-500 ease-out"
                        style={{
                            transform: `translate(${offset.x * 8}px, ${offset.y * 8}px) scale(1.3)`,
                            mixBlendMode: "screen",
                            opacity: 0.3,
                            filter: "url(#convex-mirror)",
                        }}
                    >
                        <video
                            ref={specularVideoRef}
                            autoPlay
                            muted
                            playsInline
                            className="w-full h-full object-cover scale-x-[-1]"
                            style={{
                                filter: "contrast(3) brightness(2.5) saturate(0) blur(30px)",
                            }}
                        />
                    </div>

                    {/* Subtle edge vignette */}
                    <div
                        className="absolute inset-0 z-[9] pointer-events-none mix-blend-multiply opacity-50"
                        style={{
                            background:
                                "radial-gradient(circle, transparent 50%, rgba(0,0,0,0.3) 100%)",
                        }}
                    />

                    {/* Content — metallic text */}
                    <div
                        className="relative z-[10] flex items-center justify-center select-none pointer-events-none"
                        style={{
                            transition: "all 0.3s ease",
                            opacity: isPressed ? 0.4 : 1,
                            transform: `translateY(${isPressed ? "3px" : "0"}) scale(${isPressed ? 0.97 : 1})`,
                        }}
                    >
                        <span
                            className="font-[800] tracking-tight"
                            style={{
                                background:
                                    "linear-gradient(to bottom, #0f172a, #334155, #000000)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                textShadow: "none",
                                filter: `drop-shadow(0px 2px 1px rgba(255,255,255,0.9)) drop-shadow(0px -2px 3px rgba(0,0,0,0.8)) drop-shadow(0px 6px 15px rgba(0,0,0,0.3))`,
                            }}
                        >
                            {children}
                        </span>
                    </div>

                    {/* Top gloss */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/15 via-transparent to-white/10 pointer-events-none z-[12] opacity-50" />
                </>
            ) : (
                /* Normal button look — no camera */
                <div
                    className="relative z-[10] flex items-center justify-center select-none"
                    style={{
                        transition: "all 0.2s ease",
                        opacity: isPressed ? 0.7 : 1,
                        transform: `translateY(${isPressed ? "1px" : "0"})`,
                    }}
                >
                    {children}
                </div>
            )}
        </button>
    );
};
