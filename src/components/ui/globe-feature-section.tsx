"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import createGlobe, { COBEOptions } from "cobe";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export default function GlobeFeatureSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground leading-tight">
              Global Network Coverage
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Connect securely from anywhere in the world. Our VPN infrastructure spans across continents, providing you with fast and reliable access to protected networks.
            </p>
            <Button className="bg-foreground text-background hover:bg-foreground/90 group">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          <div className="flex justify-center">
            <Globe className="w-full max-w-[500px] aspect-square" />
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
  const [mounted, setMounted] = useState(false);
  
  let phi = 0;
  let width = 0;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const [r, setR] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fixed globe configuration - consistent light gray colors
  const config: COBEOptions = {
    width: 800,
    height: 800,
    onRender: () => {},
    devicePixelRatio: 2,
    phi: 0,
    theta: 0.3,
    dark: 0,
    diffuse: 0.6,
    mapSamples: 16000,
    mapBrightness: 2,
    // Light gray colors - visible on both light and dark backgrounds
    baseColor: [0.92, 0.93, 0.95],
    markerColor: [0.5, 0.55, 0.65],
    glowColor: [0.85, 0.87, 0.9],
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
  };

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value ? "grabbing" : "grab";
    }
  };

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      setR(delta / 200);
    }
  };

  const onRender = useCallback(
    (state: Record<string, number>) => {
      if (!pointerInteracting.current) phi += 0.005;
      state.phi = phi + r;
      state.width = width * 2;
      state.height = width * 2;
    },
    [r]
  );

  const onResize = () => {
    if (canvasRef.current) {
      width = canvasRef.current.offsetWidth;
    }
  };

  useEffect(() => {
    if (!mounted) return;
    
    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvasRef.current!, {
      ...config,
      width: width * 2,
      height: width * 2,
      onRender,
    });

    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = "1";
      }
    });
    return () => {
      window.removeEventListener("resize", onResize);
      globe.destroy();
    };
  }, [mounted, onRender]);

  if (!mounted) {
    return (
      <div className={cn("relative flex items-center justify-center overflow-hidden rounded-2xl bg-background", className)}>
        <div className="h-full w-full animate-pulse bg-muted/50" />
      </div>
    );
  }

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
          "h-full w-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]",
          // Feather the edges so it visually melts into the background
          "[mask-image:radial-gradient(circle_at_center,#000_65%,transparent_80%)]",
          "[-webkit-mask-image:radial-gradient(circle_at_center,#000_65%,transparent_80%)]"
        )}
        onPointerDown={(e) =>
          updatePointerInteraction(
            e.clientX - pointerInteractionMovement.current
          )
        }
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
    </div>
  );
}
