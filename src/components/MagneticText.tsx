"use client";

import React, { useRef, useState, useCallback, useMemo, createContext, useContext } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

// Context for sharing mouse position
interface MagneticContextValue {
    mouseX: ReturnType<typeof useMotionValue<number>>;
    mouseY: ReturnType<typeof useMotionValue<number>>;
    isHovering: boolean;
}

const MagneticContext = createContext<MagneticContextValue | null>(null);

// Spring configuration for smooth magnetic effect
const springConfig = {
    damping: 25,
    stiffness: 300,
    mass: 0.5,
};

interface MagneticTextProps {
    body: string;
    as?: keyof JSX.IntrinsicElements;
    className?: string;
    children: (tokens: string[]) => React.ReactNode;
}

interface TokenProps {
    body: string;
    className?: string;
}

export function MagneticText({ body, as: Component = "div", className, children }: MagneticTextProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Tokenize the text (split by spaces but preserve them)
    const tokens = useMemo(() => {
        return body.split(/(\s+)/).filter(Boolean);
    }, [body]);

    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            mouseX.set(e.clientX - rect.left);
            mouseY.set(e.clientY - rect.top);
        },
        [mouseX, mouseY]
    );

    const handleMouseEnter = useCallback(() => {
        setIsHovering(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsHovering(false);
        mouseX.set(0);
        mouseY.set(0);
    }, [mouseX, mouseY]);

    const MotionComponent = motion[Component as keyof typeof motion] as typeof motion.div;

    return (
        <MagneticContext.Provider value={{ mouseX, mouseY, isHovering }}>
            <MotionComponent
                ref={containerRef}
                className={className}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {children(tokens)}
            </MotionComponent>
        </MagneticContext.Provider>
    );
}

function Token({ body, className }: TokenProps) {
    const context = useContext(MagneticContext);
    const tokenRef = useRef<HTMLSpanElement>(null);

    const x = useSpring(0, springConfig);
    const y = useSpring(0, springConfig);

    // Calculate distance and apply magnetic effect
    React.useEffect(() => {
        if (!context || !tokenRef.current) return;

        const unsubX = context.mouseX.on("change", (mouseXVal) => {
            if (!tokenRef.current || !context.isHovering) {
                x.set(0);
                return;
            }

            const rect = tokenRef.current.getBoundingClientRect();
            const parentRect = tokenRef.current.parentElement?.getBoundingClientRect();
            if (!parentRect) return;

            const tokenCenterX = rect.left - parentRect.left + rect.width / 2;
            const distance = mouseXVal - tokenCenterX;
            const maxDistance = 150;
            const strength = Math.max(0, 1 - Math.abs(distance) / maxDistance);
            const offset = distance * strength * 0.15;

            x.set(offset);
        });

        const unsubY = context.mouseY.on("change", (mouseYVal) => {
            if (!tokenRef.current || !context.isHovering) {
                y.set(0);
                return;
            }

            const rect = tokenRef.current.getBoundingClientRect();
            const parentRect = tokenRef.current.parentElement?.getBoundingClientRect();
            if (!parentRect) return;

            const tokenCenterY = rect.top - parentRect.top + rect.height / 2;
            const distance = mouseYVal - tokenCenterY;
            const maxDistance = 150;
            const strength = Math.max(0, 1 - Math.abs(distance) / maxDistance);
            const offset = distance * strength * 0.1;

            y.set(offset);
        });

        return () => {
            unsubX();
            unsubY();
        };
    }, [context, x, y]);

    // Reset when not hovering
    React.useEffect(() => {
        if (!context?.isHovering) {
            x.set(0);
            y.set(0);
        }
    }, [context?.isHovering, x, y]);

    return (
        <motion.span
            ref={tokenRef}
            style={{ x, y }}
            className={className}
        >
            {body}
        </motion.span>
    );
}

MagneticText.Token = Token;
