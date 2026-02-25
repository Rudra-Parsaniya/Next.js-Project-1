"use client";

import { useEffect, useRef, useState } from "react";

interface Point {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
}

export default function Background() {
    const [points, setPoints] = useState<Point[]>([]);
    const pointRefs = useRef<(HTMLDivElement | null)[]>([]);
    const requestRef = useRef<number | null>(null);
    const mouse = useRef({ x: -1000, y: -1000 });

    // Use a ref for mutable point data to avoid re-renders but keep physics state
    const pointsRef = useRef<Point[]>([]);

    useEffect(() => {
        // 1. Initialize Points
        const count = 80;
        const colors = ["#ffffffff", "#d46facff", "#ffffffff", "#8b77c8ff"]; // Cyan, Emerald, Blue, Violet
        const newPoints: Point[] = [];

        for (let i = 0; i < count; i++) {
            newPoints.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 2, // 2px to 5px
                color: colors[Math.floor(Math.random() * colors.length)],
            });
        }

        setPoints(newPoints);
        pointsRef.current = newPoints;

        // 2. Animation Loop
        const animate = () => {
            pointsRef.current.forEach((point, i) => {
                const el = pointRefs.current[i];
                if (!el) return;

                // Physics
                point.x += point.vx;
                point.y += point.vy;

                // Boundaries (bounce)
                if (point.x <= 0 || point.x >= window.innerWidth) point.vx *= -1;
                if (point.y <= 0 || point.y >= window.innerHeight) point.vy *= -1;

                // Mouse Attraction
                const dx = mouse.current.x - point.x;
                const dy = mouse.current.y - point.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxDist = 250;

                if (dist < maxDist) {
                    const force = (maxDist - dist) / maxDist;
                    const angle = Math.atan2(dy, dx);
                    const strength = 0.8;

                    point.x += Math.cos(angle) * force * strength;
                    point.y += Math.sin(angle) * force * strength;
                }

                // Apply
                el.style.transform = `translate3d(${point.x}px, ${point.y}px, 0)`;
            });

            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        // 3. Event Listeners
        const handleResize = () => {
            // Optional: Reset points or handle wrapping
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {/* Debug: Border to verify container is present */}
            {/* <div className="absolute inset-0 border-4 border-red-500 opacity-20" /> */}

            {/* Gradient Overlay for Mood */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/20 to-zinc-950/80" />

            {points.map((point, i) => (
                <div
                    key={i}
                    ref={(el) => { pointRefs.current[i] = el; }} // Assign ref
                    className="absolute rounded-full shadow-[0_0_10px_currentColor]"
                    style={{
                        left: 0,
                        top: 0,
                        width: `${point.size}px`,
                        height: `${point.size}px`,
                        backgroundColor: point.color,
                        color: point.color,
                        opacity: 0.6,
                        willChange: "transform",
                        transform: `translate3d(${point.x}px, ${point.y}px, 0)`,
                    }}
                />
            ))}
        </div>
    );
}
