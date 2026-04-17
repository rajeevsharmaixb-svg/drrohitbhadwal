import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const DentalHeroSection = () => {
    const { scrollYProgress } = useScroll();

    // Transform scroll progress to animation values
    const upperTeethY = useTransform(scrollYProgress, [0, 0.5], [-150, 0]);
    const lowerTeethY = useTransform(scrollYProgress, [0, 0.5], [150, 0]);
    const teethOpacity = useTransform(scrollYProgress, [0, 0.3, 0.5], [0.3, 0.8, 1]);
    const sparkleScale = useTransform(scrollYProgress, [0.4, 0.5, 0.6], [0, 1.5, 1]);
    const sparkleOpacity = useTransform(scrollYProgress, [0.4, 0.5, 0.7], [0, 1, 0]);

    // SVG Components for Teeth (Premium Placeholders)
    const UpperTeeth = () => (
        <svg width="300" height="120" viewBox="0 0 300 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Central Incisors */}
            <path d="M140 10 Q135 5 130 10 L130 80 Q135 90 140 80 Z" fill="#FFFFFF" stroke="#0077B6" strokeWidth="2" />
            <path d="M160 10 Q165 5 170 10 L170 80 Q165 90 160 80 Z" fill="#FFFFFF" stroke="#0077B6" strokeWidth="2" />

            {/* Lateral Incisors */}
            <path d="M115 15 Q110 10 105 15 L105 75 Q110 83 115 75 Z" fill="#F8FAFC" stroke="#0077B6" strokeWidth="1.5" />
            <path d="M185 15 Q190 10 195 15 L195 75 Q190 83 185 75 Z" fill="#F8FAFC" stroke="#0077B6" strokeWidth="1.5" />

            {/* Canines */}
            <path d="M90 20 Q85 15 80 22 L82 70 Q85 78 90 72 Z" fill="#F8FAFC" stroke="#0077B6" strokeWidth="1.5" />
            <path d="M210 20 Q215 15 220 22 L218 70 Q215 78 210 72 Z" fill="#F8FAFC" stroke="#0077B6" strokeWidth="1.5" />

            {/* Premolars */}
            <path d="M65 25 Q60 22 58 28 L60 68 Q63 74 68 68 Z" fill="#F8FAFC" stroke="#0077B6" strokeWidth="1.5" />
            <path d="M235 25 Q240 22 242 28 L240 68 Q237 74 232 68 Z" fill="#F8FAFC" stroke="#0077B6" strokeWidth="1.5" />

            {/* Molars */}
            <path d="M45 30 Q40 28 38 35 L42 65 Q45 70 50 65 Z" fill="#F8FAFC" stroke="#0077B6" strokeWidth="1.5" />
            <path d="M255 30 Q260 28 262 35 L258 65 Q255 70 250 65 Z" fill="#F8FAFC" stroke="#0077B6" strokeWidth="1.5" />

            {/* Gum line */}
            <path d="M30 85 Q150 95 270 85" stroke="#FFB6C1" strokeWidth="3" fill="none" opacity="0.6" />
        </svg>
    );

    const LowerTeeth = () => (
        <svg width="300" height="120" viewBox="0 0 300 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Gum line */}
            <path d="M30 35 Q150 25 270 35" stroke="#FFB6C1" strokeWidth="3" fill="none" opacity="0.6" />

            {/* Central Incisors */}
            <path d="M140 110 Q135 115 130 110 L130 40 Q135 30 140 40 Z" fill="#FFFFFF" stroke="#0077B6" strokeWidth="2" />
            <path d="M160 110 Q165 115 170 110 L170 40 Q165 30 160 40 Z" fill="#FFFFFF" stroke="#0077B6" strokeWidth="2" />

            {/* Lateral Incisors */}
            <path d="M115 105 Q110 110 105 105 L105 45 Q110 37 115 45 Z" fill="#F8FAFC" stroke="#0077B6" strokeWidth="1.5" />
            <path d="M185 105 Q190 110 195 105 L195 45 Q190 37 185 45 Z" fill="#F8FAFC" stroke="#0077B6" strokeWidth="1.5" />

            {/* Canines */}
            <path d="M90 100 Q85 105 80 98 L82 50 Q85 42 90 48 Z" fill="#F8FAFC" stroke="#0077B6" strokeWidth="1.5" />
            <path d="M210 100 Q215 105 220 98 L218 50 Q215 42 210 48 Z" fill="#F8FAFC" stroke="#0077B6" strokeWidth="1.5" />

            {/* Premolars */}
            <path d="M65 95 Q60 98 58 92 L60 52 Q63 46 68 52 Z" fill="#F8FAFC" stroke="#0077B6" strokeWidth="1.5" />
            <path d="M235 95 Q240 98 242 92 L240 52 Q237 46 232 52 Z" fill="#F8FAFC" stroke="#0077B6" strokeWidth="1.5" />

            {/* Molars */}
            <path d="M45 90 Q40 92 38 85 L42 55 Q45 50 50 55 Z" fill="#F8FAFC" stroke="#0077B6" strokeWidth="1.5" />
            <path d="M255 90 Q260 92 262 85 L258 55 Q255 50 250 55 Z" fill="#F8FAFC" stroke="#0077B6" strokeWidth="1.5" />
        </svg>
    );

    const Sparkle = () => (
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 0 L55 45 L100 50 L55 55 L50 100 L45 55 L0 50 L45 45 Z" fill="#FFD700" />
            <circle cx="50" cy="50" r="15" fill="#FFFFFF" opacity="0.8" />
            <circle cx="50" cy="50" r="8" fill="#FFD700" />
        </svg>
    );

    return (
        <div className="relative h-[200vh] bg-gradient-to-b from-[#F8FAFC] to-[#E1F5FE]">
            {/* Sticky Hero Container */}
            <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle, #0077B6 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }} />
                </div>

                {/* Main Content */}
                <div className="relative z-10 text-center px-4">
                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-7xl font-bold text-[#0077B6] mb-4 tracking-tight"
                    >
                        Dr Rohit Dental Clinic
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-xl md:text-2xl text-gray-600 mb-12 font-light"
                    >
                        Braces & Implant Centre
                    </motion.p>

                    {/* Teeth Assembly Animation */}
                    <div className="relative w-full max-w-md mx-auto h-64">
                        {/* Upper Teeth */}
                        <motion.div
                            style={{
                                y: upperTeethY,
                                opacity: teethOpacity
                            }}
                            className="absolute top-0 left-1/2 -translate-x-1/2"
                        >
                            <UpperTeeth />
                        </motion.div>

                        {/* Sparkle Effect */}
                        <motion.div
                            style={{
                                scale: sparkleScale,
                                opacity: sparkleOpacity
                            }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
                        >
                            <Sparkle />
                        </motion.div>

                        {/* Lower Teeth */}
                        <motion.div
                            style={{
                                y: lowerTeethY,
                                opacity: teethOpacity
                            }}
                            className="absolute bottom-0 left-1/2 -translate-x-1/2"
                        >
                            <LowerTeeth />
                        </motion.div>
                    </div>

                    {/* Scroll Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2"
                    >
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-sm text-gray-500 font-medium">Scroll to Discover</span>
                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="w-6 h-10 border-2 border-[#0077B6] rounded-full flex justify-center pt-2"
                            >
                                <div className="w-1 h-2 bg-[#0077B6] rounded-full" />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Equipment Badges (from uploaded images) */}
                <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-8 px-4 flex-wrap">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                        className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-[#0077B6]/20"
                    >
                        <p className="text-sm font-semibold text-[#0077B6]">B-Class Autoclave</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4 }}
                        className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-[#0077B6]/20"
                    >
                        <p className="text-sm font-semibold text-[#0077B6]">Advanced Light Cure</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.6 }}
                        className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-[#0077B6]/20"
                    >
                        <p className="text-sm font-semibold text-[#0077B6]">Piezo Surgery Unit</p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default DentalHeroSection;