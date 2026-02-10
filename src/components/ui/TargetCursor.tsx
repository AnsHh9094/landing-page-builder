import { useEffect, useRef, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import './TargetCursor.css';

interface TargetCursorProps {
    targetSelector?: string;
    spinDuration?: number;
    hideDefaultCursor?: boolean;
    hoverDuration?: number;
    parallaxOn?: boolean;
}

const TargetCursor = ({
    targetSelector = '.cursor-target',
    spinDuration = 3,
    hideDefaultCursor = true,
    hoverDuration = 0.3,
    parallaxOn = true
}: TargetCursorProps) => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const cornersRef = useRef<HTMLDivElement[]>([]);
    const spinTl = useRef<gsap.core.Timeline | null>(null);
    const dotRef = useRef<HTMLDivElement>(null);
    const mousePos = useRef({ x: 0, y: 0 });

    const isActiveRef = useRef(false);
    const targetCornerPositionsRef = useRef<{ x: number; y: number }[] | null>(null);
    const activeStrengthRef = useRef({ current: 0 });

    const isMobile = useMemo(() => {
        if (typeof window === 'undefined') return false;
        const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const isSmallScreen = window.innerWidth <= 768;
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
        const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
        const isMobileUserAgent = mobileRegex.test(userAgent.toLowerCase());
        return (hasTouchScreen && isSmallScreen) || isMobileUserAgent;
    }, []);

    const constants = useMemo(
        () => ({
            borderWidth: 4,
            cornerSize: 16
        }),
        []
    );

    useEffect(() => {
        if (isMobile || !cursorRef.current) return;

        if (hideDefaultCursor) {
            document.body.classList.add('cursor-hidden');
        }

        const cursor = cursorRef.current;
        const corners = cornersRef.current;

        let activeTarget: HTMLElement | null = null;
        let currentLeaveHandler: (() => void) | null = null;
        let resumeTimeout: ReturnType<typeof setTimeout> | null = null;
        let animationFrameId: number;

        const cleanupTarget = (target: HTMLElement) => {
            if (currentLeaveHandler) {
                target.removeEventListener('mouseleave', currentLeaveHandler);
            }
            currentLeaveHandler = null;
        };

        // Initialize cursor position
        gsap.set(cursor, {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        });

        // Create spin animation
        const createSpinTimeline = () => {
            if (spinTl.current) {
                spinTl.current.kill();
            }
            spinTl.current = gsap
                .timeline({ repeat: -1 })
                .to(cursor, { rotation: '+=360', duration: spinDuration, ease: 'none' });
        };

        createSpinTimeline();

        // Smooth cursor follow using animation frame
        const updateCursor = () => {
            if (!cursor) return;

            const currentX = gsap.getProperty(cursor, 'x') as number;
            const currentY = gsap.getProperty(cursor, 'y') as number;

            // Smooth interpolation
            const newX = currentX + (mousePos.current.x - currentX) * 0.15;
            const newY = currentY + (mousePos.current.y - currentY) * 0.15;

            gsap.set(cursor, { x: newX, y: newY });

            // Update corners when targeting an element
            if (isActiveRef.current && targetCornerPositionsRef.current && corners.length === 4) {
                const strength = activeStrengthRef.current.current;
                if (strength > 0) {
                    corners.forEach((corner, i) => {
                        if (!corner || !targetCornerPositionsRef.current) return;

                        const targetX = targetCornerPositionsRef.current[i].x - newX;
                        const targetY = targetCornerPositionsRef.current[i].y - newY;

                        const currentCornerX = gsap.getProperty(corner, 'x') as number;
                        const currentCornerY = gsap.getProperty(corner, 'y') as number;

                        const finalX = currentCornerX + (targetX - currentCornerX) * 0.2;
                        const finalY = currentCornerY + (targetY - currentCornerY) * 0.2;

                        gsap.set(corner, { x: finalX, y: finalY });
                    });
                }
            }

            animationFrameId = requestAnimationFrame(updateCursor);
        };

        animationFrameId = requestAnimationFrame(updateCursor);

        const moveHandler = (e: MouseEvent) => {
            mousePos.current.x = e.clientX;
            mousePos.current.y = e.clientY;
        };
        window.addEventListener('mousemove', moveHandler);

        const scrollHandler = () => {
            if (!activeTarget || !cursorRef.current) return;
            const elementUnderMouse = document.elementFromPoint(mousePos.current.x, mousePos.current.y);
            const isStillOverTarget =
                elementUnderMouse &&
                (elementUnderMouse === activeTarget || (elementUnderMouse as HTMLElement).closest(targetSelector) === activeTarget);
            if (!isStillOverTarget && currentLeaveHandler) {
                currentLeaveHandler();
            }
        };
        window.addEventListener('scroll', scrollHandler, { passive: true });

        const mouseDownHandler = () => {
            if (!dotRef.current || !cursorRef.current) return;
            gsap.to(dotRef.current, { scale: 0.5, duration: 0.15, ease: 'power2.out' });
            gsap.to(cursorRef.current, { scale: 0.9, duration: 0.15, ease: 'power2.out' });
        };

        const mouseUpHandler = () => {
            if (!dotRef.current || !cursorRef.current) return;
            gsap.to(dotRef.current, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' });
            gsap.to(cursorRef.current, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' });
        };

        window.addEventListener('mousedown', mouseDownHandler);
        window.addEventListener('mouseup', mouseUpHandler);

        const enterHandler = (e: MouseEvent) => {
            const directTarget = e.target as HTMLElement;
            let current: HTMLElement | null = directTarget;
            let target: HTMLElement | null = null;

            while (current && current !== document.body) {
                if (current.matches(targetSelector)) {
                    target = current;
                    break;
                }
                current = current.parentElement;
            }

            if (!target || !cursorRef.current || corners.length !== 4) return;
            if (activeTarget === target) return;

            if (activeTarget) {
                cleanupTarget(activeTarget);
            }
            if (resumeTimeout) {
                clearTimeout(resumeTimeout);
                resumeTimeout = null;
            }

            activeTarget = target;

            // Stop spinning when targeting
            gsap.killTweensOf(cursorRef.current, 'rotation');
            spinTl.current?.pause();
            gsap.to(cursorRef.current, { rotation: 0, duration: 0.2, ease: 'power2.out' });

            const rect = target.getBoundingClientRect();
            const { borderWidth, cornerSize } = constants;
            const cursorX = gsap.getProperty(cursorRef.current, 'x') as number;
            const cursorY = gsap.getProperty(cursorRef.current, 'y') as number;

            // Calculate corner positions relative to cursor
            targetCornerPositionsRef.current = [
                { x: rect.left - borderWidth, y: rect.top - borderWidth },
                { x: rect.right + borderWidth - cornerSize, y: rect.top - borderWidth },
                { x: rect.right + borderWidth - cornerSize, y: rect.bottom + borderWidth - cornerSize },
                { x: rect.left - borderWidth, y: rect.bottom + borderWidth - cornerSize }
            ];

            isActiveRef.current = true;

            gsap.to(activeStrengthRef.current, {
                current: 1,
                duration: hoverDuration,
                ease: 'power2.out'
            });

            // Animate corners to target positions
            corners.forEach((corner, i) => {
                if (!corner || !targetCornerPositionsRef.current) return;
                gsap.to(corner, {
                    x: targetCornerPositionsRef.current[i].x - cursorX,
                    y: targetCornerPositionsRef.current[i].y - cursorY,
                    duration: 0.3,
                    ease: 'power3.out'
                });
            });

            const leaveHandler = () => {
                isActiveRef.current = false;
                targetCornerPositionsRef.current = null;
                activeStrengthRef.current.current = 0;
                activeTarget = null;

                // Animate corners back to default positions
                const { cornerSize } = constants;
                const positions = [
                    { x: -cornerSize * 1.5, y: -cornerSize * 1.5 },
                    { x: cornerSize * 0.5, y: -cornerSize * 1.5 },
                    { x: cornerSize * 0.5, y: cornerSize * 0.5 },
                    { x: -cornerSize * 1.5, y: cornerSize * 0.5 }
                ];

                corners.forEach((corner, index) => {
                    if (!corner) return;
                    gsap.to(corner, {
                        x: positions[index].x,
                        y: positions[index].y,
                        duration: 0.4,
                        ease: 'power3.out'
                    });
                });

                // Resume spinning after a delay
                resumeTimeout = setTimeout(() => {
                    if (!activeTarget && cursorRef.current && spinTl.current) {
                        spinTl.current.kill();
                        spinTl.current = gsap
                            .timeline({ repeat: -1 })
                            .to(cursorRef.current, { rotation: '+=360', duration: spinDuration, ease: 'none' });
                    }
                    resumeTimeout = null;
                }, 100);

                cleanupTarget(target!);
            };

            currentLeaveHandler = leaveHandler;
            target.addEventListener('mouseleave', leaveHandler);
        };

        window.addEventListener('mouseover', enterHandler, { passive: true });

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('mousemove', moveHandler);
            window.removeEventListener('mouseover', enterHandler);
            window.removeEventListener('scroll', scrollHandler);
            window.removeEventListener('mousedown', mouseDownHandler);
            window.removeEventListener('mouseup', mouseUpHandler);

            if (activeTarget) {
                cleanupTarget(activeTarget);
            }

            spinTl.current?.kill();
            document.body.classList.remove('cursor-hidden');

            isActiveRef.current = false;
            targetCornerPositionsRef.current = null;
            activeStrengthRef.current.current = 0;
        };
    }, [targetSelector, spinDuration, constants, hideDefaultCursor, isMobile, hoverDuration, parallaxOn]);

    if (isMobile) {
        return null;
    }

    return (
        <div ref={cursorRef} className="target-cursor-wrapper">
            <div ref={dotRef} className="target-cursor-dot" />
            <div ref={el => { if (el) cornersRef.current[0] = el; }} className="target-cursor-corner corner-tl" />
            <div ref={el => { if (el) cornersRef.current[1] = el; }} className="target-cursor-corner corner-tr" />
            <div ref={el => { if (el) cornersRef.current[2] = el; }} className="target-cursor-corner corner-br" />
            <div ref={el => { if (el) cornersRef.current[3] = el; }} className="target-cursor-corner corner-bl" />
        </div>
    );
};

export default TargetCursor;
