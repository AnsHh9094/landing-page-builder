import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
    onLoadingComplete?: () => void;
}

const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
    const [progress, setProgress] = useState(0);
    const [text, setText] = useState("");
    const fullText = "WHALESCALE";

    // Matrix/Decrypt effect characters
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

    useEffect(() => {
        // Faster progress bar: ~1.5s total
        const duration = 1500;
        const intervalTime = 30;
        const steps = duration / intervalTime;
        const increment = 100 / steps;

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                // Add some randomness but keep it fast
                return Math.min(prev + increment * (0.8 + Math.random() * 0.4), 100);
            });
        }, intervalTime);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        // Snappier decrypt effect
        let iteration = 0;
        const interval = setInterval(() => {
            setText(
                fullText
                    .split("")
                    .map((letter, index) => {
                        if (index < iteration) {
                            return fullText[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join("")
            );

            if (iteration >= fullText.length) {
                clearInterval(interval);
            }

            iteration += 1 / 2; // Faster reveal
        }, 40);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (progress >= 100) {
            // Short delay before exit to register 100%
            const timeout = setTimeout(() => {
                onLoadingComplete?.();
            }, 300);
            return () => clearTimeout(timeout);
        }
    }, [progress, onLoadingComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{
                opacity: 0,
                y: -20,
                filter: "blur(10px)",
                transition: { duration: 0.6, ease: "easeInOut" }
            }}
        >
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900/40 via-black to-black opacity-80" />

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />

            <div className="relative z-10 flex flex-col items-center gap-6">
                {/* Whale Logo Container */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative"
                >
                    {/* Subtle Glow behind logo */}
                    <div className="absolute -inset-8 bg-white/5 blur-2xl rounded-full animate-pulse-slow" />

                    {/* Custom Whale SVG */}
                    <svg
                        width="120"
                        height="120"
                        viewBox="0 0 100 100"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                    >
                        {/* Stylized Whale Body - Abstracted form based on the concept */}
                        <path
                            d="M85 45C85 65 65 80 45 80C35 80 25 75 20 65C18 60 15 55 10 58C8 59 5 62 4 65L8 50C6 45 10 40 15 38C20 30 30 20 50 20C70 20 85 30 85 45Z"
                            fill="currentColor"
                        />
                        {/* Belly Stripes (Negative space effect) */}
                        <path
                            d="M30 45 L50 65"
                            stroke="black"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                        <path
                            d="M40 38 L60 58"
                            stroke="black"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                        <path
                            d="M50 31 L70 51"
                            stroke="black"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                        {/* Eye */}
                        <circle cx="70" cy="38" r="2" fill="black" />
                    </svg>
                </motion.div>

                {/* Decrypting Text */}
                <div className="h-10 overflow-hidden flex items-center justify-center">
                    <h1
                        className="text-4xl md:text-5xl font-black tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-300 to-gray-600 font-['UnifrakturMaguntia']"
                    >
                        {text}
                    </h1>
                </div>

                {/* Minimal Progress Line */}
                <div className="w-48 h-[2px] bg-gray-900 rounded-full overflow-hidden mt-2">
                    <motion.div
                        className="h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "linear" }}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default LoadingScreen;
