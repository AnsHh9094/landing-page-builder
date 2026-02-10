"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import createGlobe, { COBEOptions } from "cobe";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function GlobeFeatureSection() {
  return (
    <section className="py-24 bg-[#020617]">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
              Global Network Coverage
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              Connect securely from anywhere in the world. Our VPN infrastructure spans across continents, providing you with fast and reliable access to protected networks.
            </p>
            <Button className="cursor-target bg-white text-gray-900 hover:bg-gray-200 group">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          <div className="flex justify-center">
            <ErrorBoundary>
              <Globe className="w-full max-w-[500px] aspect-square" />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </section>
  );
}


export function Globe({
  className,
}: {
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);

  // Use refs for animation values to avoid re-renders
  const phi = useRef(0);
  const width = useRef(0);
  const r = useRef(0);

  // Track if component is mounted to handle async initialization
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Initialize width
    if (canvasRef.current) {
      width.current = canvasRef.current.offsetWidth;
    }

    // Handle resize
    const onResize = () => {
      if (canvasRef.current) {
        width.current = canvasRef.current.offsetWidth;
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const onRender = useCallback(
    (state: Record<string, any>) => {
      // Called on every animation frame.
      // state will be an empty object, return is side-effect.
      if (!pointerInteracting.current) {
        phi.current += 0.005;
      }
      state.phi = phi.current + r.current;
      state.width = width.current * 2;
      state.height = width.current * 2;
    },
    []
  );

  useEffect(() => {
    if (!isMounted || !canvasRef.current) return;


    let globe: ReturnType<typeof createGlobe>;

    globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width.current * 2,
      height: width.current * 2,
      phi: 0,
      theta: 0.3,
      dark: 0,
      diffuse: 0.4,
      mapSamples: 16000,
      mapBrightness: 1.0,
      // Darker gray tones
      baseColor: [0.7, 0.72, 0.76],
      markerColor: [0.4, 0.45, 0.55],
      glowColor: [0.6, 0.63, 0.68],
      markers: [
        { location: [14.5995, 120.9842], size: 0.03 },
        { location: [19.076, 72.8777], size: 0.1 },
        { location: [23.8103, 90.4125], size: 0.05 },
        { location: [30.0444, 31.2357], size: 0.07 },
        { location: [39.9042, 116.4074], size: 0.08 },
        { location: [-23.5505, -46.6333], size: 0.1 },
        { location: [19.4326, -99.1332], size: 0.1 },
        { location: [40.7128, -74.006], size: 0.1 },
        { location: [34.6937, 135.5022], size: 0.05 },
        { location: [41.0082, 28.9784], size: 0.06 },
      ],
      onRender: onRender,
    });

    // Fade in
    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = '1';
      }
    });

    return () => {
      if (globe) globe.destroy();
    };
  }, [isMounted, onRender]);

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-2xl bg-transparent",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        className={cn(
          "h-full w-full opacity-0 transition-opacity duration-1000",
          "[contain:layout_paint_size]"
        )}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
          if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
            r.current = delta / 200;
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
            r.current = delta / 200;
          }
        }}
      />
    </div>
  );
}
