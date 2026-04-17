'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FRAME_COUNT = 40;

const SmileScroll: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [loadProgress, setLoadProgress] = useState(0);

    // Scroll Progress
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Smoothing the scroll progress for buttery frames
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 400,
        damping: 30,
        restDelta: 0.001
    });

    // Map scroll progress to frame index (0-39)
    const frameIndex = useTransform(smoothProgress, [0, 1], [1, FRAME_COUNT]);

    // Text Opacity & Transform mappings
    const titleOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
    const titleY = useTransform(scrollYProgress, [0, 0.15], [0, -30]);

    const text1Opacity = useTransform(scrollYProgress, [0.25, 0.28, 0.38, 0.42], [0, 1, 1, 0]);
    const text1X = useTransform(scrollYProgress, [0.25, 0.28], [-50, 0]);

    const text2Opacity = useTransform(scrollYProgress, [0.52, 0.55, 0.65, 0.68], [0, 1, 1, 0]);
    const text2X = useTransform(scrollYProgress, [0.52, 0.55], [50, 0]);

    const finalOpacity = useTransform(scrollYProgress, [0.82, 0.85, 1], [0, 1, 1]);
    const finalScale = useTransform(scrollYProgress, [0.82, 0.85], [0.9, 1]);

    // Preload Images
    useEffect(() => {
        const loadedImages: HTMLImageElement[] = [];
        let loadedCount = 0;

        for (let i = 1; i <= FRAME_COUNT; i++) {
            const img = new Image();
            const frameNum = i.toString().padStart(3, '0');
            img.src = `/animationframes/ezgif-frame-${frameNum}.jpg`;
            img.onload = () => {
                loadedCount++;
                setLoadProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
                if (loadedCount === FRAME_COUNT) {
                    setIsLoaded(true);
                }
            };
            loadedImages.push(img);
        }
        setImages(loadedImages);
    }, []);

    // Canvas Drawing logic
    useEffect(() => {
        if (!canvasRef.current || images.length === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let frameId: number;

        const render = () => {
            const idx = Math.floor(frameIndex.get()) - 1;
            const safeIdx = Math.max(0, Math.min(idx, FRAME_COUNT - 1));
            const image = images[safeIdx];

            if (image && image.complete) {
                const dpr = window.devicePixelRatio || 1;
                const rect = canvas.getBoundingClientRect();

                if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
                    canvas.width = rect.width * dpr;
                    canvas.height = rect.height * dpr;
                }

                ctx.save();
                ctx.scale(dpr, dpr);

                // Clear Canvas to be completely transparent
                ctx.clearRect(0, 0, rect.width, rect.height);

                // Object-contain behavior
                const canvasRatio = rect.width / rect.height;
                const imageRatio = image.width / image.height;

                // Object-contain behavior for responsive fit
                let drawWidth, drawHeight, offsetX, offsetY;

                if (canvasRatio > imageRatio) {
                    drawHeight = rect.height;
                    drawWidth = rect.height * imageRatio;
                    offsetX = (rect.width - drawWidth) / 2;
                    offsetY = 0;
                } else {
                    drawWidth = rect.width;
                    drawHeight = rect.width / imageRatio;
                    offsetX = 0;
                    offsetY = (rect.height - drawHeight) / 2;
                }

                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
                ctx.restore();
            }

            frameId = requestAnimationFrame(render);
        };

        frameId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(frameId);
    }, [images, frameIndex]);

    return (
        <div ref={containerRef} className="relative h-[150vh] bg-transparent">
            {/* Sticky Canvas Container */}
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
                <canvas
                    ref={canvasRef}
                    className="w-full h-full"
                />

                {/* Narrative Overlays - Neutral Colors (Black/Gray/White) */}
                <div className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-24">

                    {/* 0% - 18%: Main Intro (Left-Aligned) */}
                    <motion.div
                        style={{ opacity: titleOpacity, y: titleY }}
                        className="absolute left-10 md:left-32 top-1/2 -translate-y-1/2 flex flex-col items-start gap-6 max-w-3xl text-left pointer-events-none"
                    >
                        <div className="flex flex-col items-start">
                            <h1 className="text-6xl md:text-8xl font-serif text-[#F8FAFC] leading-snug tracking-wide drop-shadow-2xl" style={{ fontFamily: 'Georgia, serif' }}>
                                Dr. Rohit <br />
                                <span className="text-[#38BDF8] font-semibold text-4xl md:text-6xl drop-shadow-lg">Dental Clinic</span>
                            </h1>
                        </div>

                        <motion.div
                            animate={{ y: [0, 15, 0], opacity: [0.2, 0.6, 0.2] }}
                            transition={{ repeat: Infinity, duration: 3 }}
                            className="mt-12 text-[#14B8A6]"
                        >
                            <ChevronDown size={64} strokeWidth={1} />
                        </motion.div>
                    </motion.div>

                    {/* 25% - 42%: Left Text */}
                    <motion.div
                        style={{ opacity: text1Opacity, x: text1X }}
                        className="absolute left-10 md:left-32 max-w-xl text-left pointer-events-none"
                    >
                        <h2 className="text-5xl md:text-8xl font-serif text-white leading-tight drop-shadow-[0_0_40px_rgba(0,0,0,0.1)]">
                            The journey to your <br />
                            <span className="text-[#14B8A6] drop-shadow-[0_0_20px_rgba(20,184,166,0.5)] font-black">confident smile</span> <br />
                            begins here.
                        </h2>
                    </motion.div>

                    {/* 52% - 68%: Right Text */}
                    <motion.div
                        style={{ opacity: text2Opacity, x: text2X }}
                        className="absolute right-10 md:right-32 max-w-xl text-right pointer-events-none"
                    >
                        <h2 className="text-5xl md:text-8xl font-serif text-white leading-tight drop-shadow-[0_0_40px_rgba(20,184,166,0.2)]">
                            Gentle hands. <br />
                            Advanced tech. <br />
                            <span className="text-[#14B8A6] drop-shadow-[0_0_20px_rgba(20,184,166,0.5)]">High precision.</span>
                        </h2>
                    </motion.div>

                    {/* 82% - 100%: Finale & Testimonials */}
                    <motion.div
                        style={{ opacity: finalOpacity, scale: finalScale }}
                        className="flex flex-col items-center gap-12 pointer-events-none w-full max-w-6xl"
                    >
                        <div className="text-center space-y-4">
                            <h2 className="text-6xl md:text-9xl font-serif text-white drop-shadow-[0_0_50px_rgba(20,184,166,0.3)] leading-tight">
                                Precise. Caring. <br />
                                <span className="text-[#14B8A6]">Perfect.</span>
                            </h2>
                            <p className="text-white/60 font-sans tracking-[0.4em] uppercase text-xs font-black">Trusted by 5000+ Smiling Patients</p>
                        </div>

                        {/* Patient Testimonials Grid - Semi-Transparent clinical design */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-6">
                            {[
                                { name: "Anita S.", text: "Absolutely painless RCT. Dr. Rohit is magic with his hands!", rating: 5 },
                                { name: "Vikram S.", text: "The most advanced clinic I've seen. Truly high-precision work.", rating: 5 },
                                { name: "Rahul M.", text: "Finally found a dentist I'm not afraid of. Highly recommended!", rating: 5 }
                            ].map((test, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.2 }}
                                    className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl"
                                >
                                    <div className="flex gap-1 mb-3 text-[#14B8A6]">
                                        {[...Array(test.rating)].map((_, i) => <span key={i}>★</span>)}
                                    </div>
                                    <p className="text-white/90 text-sm italic mb-4 font-medium leading-relaxed">"{test.text}"</p>
                                    <p className="text-white font-black text-[10px] uppercase tracking-[0.2em] opacity-60">— {test.name}</p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="absolute bottom-12 right-12 flex flex-col gap-6 pointer-events-auto">
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 0 60px rgba(20,184,166,0.8)" }}
                                whileTap={{ scale: 0.98 }}
                                animate={{
                                    boxShadow: ["0 0 20px rgba(20,184,166,0.3)", "0 0 60px rgba(20,184,166,0.6)", "0 0 20px rgba(20,184,166,0.3)"]
                                }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="px-16 py-7 bg-[#14B8A6] text-white font-sans text-2xl font-black rounded-[2.5rem] shadow-2xl shadow-[#14B8A6]/40 transition-all border-4 border-white/20"
                                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                Book Your Consultation
                            </motion.button>
                        </div>
                    </motion.div>

                </div>

                {/* Loading State Overlay - Neutral */}
                <AnimatePresence>
                    {!isLoaded && (
                        <motion.div
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-50 bg-transparent flex flex-col items-center justify-center gap-6"
                        >
                            <div className="relative w-24 h-24">
                                <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
                                <div className="absolute inset-0 border-4 border-t-[#14B8A6] rounded-full animate-spin" />
                            </div>
                            <div className="flex flex-col items-center gap-2 text-white">
                                <p className="font-sans tracking-[0.2em] uppercase text-xs font-black opacity-60">Initializing Clinic Engine</p>
                                <p className="text-[#14B8A6] font-black text-4xl font-serif drop-shadow-[0_0_15px_rgba(20,184,166,0.5)]">{loadProgress}%</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Spacing for scroll triggers */}
            <div className="h-[20vh] pointer-events-none" />
        </div>
    );
};

export default SmileScroll;
