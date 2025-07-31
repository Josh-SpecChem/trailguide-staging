"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Navigation } from "lucide-react";

const StickyCta = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="fixed bottom-6 right-6 z-50"
        >
            <Link href="/trail-map-assessment" passHref>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-[#50C878] to-[#3DA35D] text-black uppercase tracking-wide font-semibold px-8 py-4 rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out flex items-center gap-2 focus:outline-none focus:ring-4 focus:ring-[#50C878]"
                >
                    <Navigation className="w-5 h-5 text-black" />
                    Take the Trail Map Assessment
                </motion.button>
            </Link>
        </motion.div>
    );
};

export default StickyCta;