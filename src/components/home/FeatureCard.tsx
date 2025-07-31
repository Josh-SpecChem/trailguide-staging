"use client";

import React from "react";
import { motion } from "framer-motion";

interface FeatureCardProps {
    title: string;
    description: string;
    href: string;
    imgSrc: string;
}

export default function FeatureCard({ title, description, href, imgSrc }: FeatureCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="relative flex flex-col overflow-hidden bg-white shadow-md group rounded-2xl"
        >
            {/* Halo Effect */}
            <div className="absolute -inset-2 rounded-2xl z-[-1] opacity-50 blur-lg transition-all duration-300 group-hover:opacity-75"
                style={{
                    background: "radial-gradient(circle, rgba(74,222,128,0.15) 10%, rgba(234,242,238,0.1) 60%)",
                }}
            ></div>

            {/* Image */}
            <div className="flex-shrink-0 overflow-hidden aspect-w-16 aspect-h-9">
                <img
                    className="object-cover w-full h-full transition-all duration-300 transform group-hover:scale-110"
                    src={imgSrc}
                    alt={title}
                />
            </div>

            {/* Text Content */}
            <div className="flex flex-col flex-1 p-6 sm:p-8">
                <p className="flex-1 text-lg font-semibold text-gray-900">{title}</p>
                <p className="text-sm text-gray-600 mt-3">{description}</p>

                <a href={href} className="absolute inset-0" aria-hidden="true"></a>
            </div>
        </motion.div>
    );
}