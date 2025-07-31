"use client";

import { useState } from "react";

const milestones = [
    {
        id: 1,
        label: "Awareness",
        description: "Focus on building foundational knowledge and exploring how AI might align with your mission.",
        progress: 20,
    },
    {
        id: 2,
        label: "Experimentation",
        description: "Start experimenting with AI tools and small-scale projects.",
        progress: 40,
    },
    {
        id: 3,
        label: "Adoption",
        description: "AI tools are integrated into workflows. Resources are allocated for scaling initiatives.",
        progress: 60,
    },
    {
        id: 4,
        label: "Optimization",
        description: "Refine AI initiatives to maximize their impact. Collaboration is key.",
        progress: 80,
    },
    {
        id: 5,
        label: "Leadership",
        description: "Lead the way in ethical AI adoption, inspiring others and driving innovation.",
        progress: 100,
    },
];

interface Milestone {
    id: number;
    label: string;
    description: string;
    progress: number;
}

interface ProgressBarProps {
    activeLevel: number;
    milestones: Milestone[];
    onMilestoneClick: (level: number) => void;
}

export default function ProgressBar({ activeLevel, milestones, onMilestoneClick }: ProgressBarProps) {
    const [selectedLevel, setSelectedLevel] = useState(activeLevel);

    const handleClick = (id: number) => {
        setSelectedLevel(id);
        onMilestoneClick(id);
    };

    return (
        <section className="flex flex-col items-center bg-white m-6">
            <h1 className="text-3xl font-bold text-teal mb-4">
                You Are at Level {selectedLevel}
            </h1>
            <p className="text-lg text-dimGray mb-8 text-center">
                Explore the AI Organizational Roadmap and discover what lies ahead.
            </p>

            {/* Progress Bar */}
            <div className="w-full max-w-2xl mb-8 relative">
                {/* Background bar */}
                <div className="relative h-6 bg-tealdark20 rounded-full">
                    <div
                        className="absolute h-6 bg-teal rounded-full transition-all duration-300"
                        style={{ width: `${milestones[selectedLevel - 1]?.progress || 0}%` }}
                    ></div>
                </div>

                {/* Milestone markers */}
                <div className="absolute inset-0 flex justify-between items-center">
                    {milestones.map((milestone) => (
                        <div
                            key={milestone.id}
                            className="relative flex flex-col items-center cursor-pointer"
                            onClick={() => handleClick(milestone.id)}
                        >
                            <div
                                className={`w-10 h-10 flex items-center justify-center rounded-full transition-transform duration-300 ${selectedLevel === milestone.id ? "bg-teal text-black scale-110" : "bg-tealdark20 text-dimGray"
                                    }`}
                            >
                                {milestone.id}
                            </div>
                            <div
                                className={`mt-2 text-sm font-medium text-center ${selectedLevel === milestone.id ? "text-black" : "text-dimGray"
                                    }`}
                            >
                                {milestone.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Active Level Summary */}
            <div className="bg-tealdark20 text-black p-6 rounded-lg shadow-lg max-w-2xl text-center">
                <h2 className="text-xl font-semibold mb-2">
                    Level {selectedLevel}: {milestones[selectedLevel - 1]?.label}
                </h2>
                <p className="text-md">{milestones[selectedLevel - 1]?.description}</p>
            </div>
        </section>
    );
}