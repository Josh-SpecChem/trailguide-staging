// components/DocumentSearch.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

// Define the type for product documents
interface Document {
    name: string;
    url: string;
}

interface Product {
    name: string;
    documents: Document[];
}

const productDocuments: Product[] = [
    {
        name: "Orange Peel",
        documents: [
            { name: "Technical Data Sheet", url: "/docs/orange-peel-tech.pdf" },
            { name: "Safety Data Sheet", url: "/docs/orange-peel-safety.pdf" },
        ],
    },
    {
        name: "SpecBlast",
        documents: [
            { name: "Technical Data Sheet", url: "/docs/specblast-tech.pdf" },
            { name: "Safety Data Sheet", url: "/docs/specblast-safety.pdf" },
        ],
    },
    {
        name: "Cure & Seal 25",
        documents: [
            { name: "Technical Data Sheet", url: "/docs/cure-seal-25-tech.pdf" },
            { name: "Safety Data Sheet", url: "/docs/cure-seal-25-safety.pdf" },
            { name: "Sell Sheet", url: "/docs/cure-seal-25-sell.pdf" },
        ],
    },
    {
        name: "PaveCure Rez",
        documents: [
            { name: "Technical Data Sheet", url: "/docs/pavecure-rez-tech.pdf" },
            { name: "Safety Data Sheet", url: "/docs/pavecure-rez-safety.pdf" },
        ],
    },
    {
        name: "Aqua Shine",
        documents: [
            { name: "Technical Data Sheet", url: "/docs/aqua-shine-tech.pdf" },
            { name: "Safety Data Sheet", url: "/docs/aqua-shine-safety.pdf" },
        ],
    },
    {
        name: "Crystal Shine",
        documents: [
            { name: "Technical Data Sheet", url: "/docs/crystal-shine-tech.pdf" },
            { name: "Safety Data Sheet", url: "/docs/crystal-shine-safety.pdf" },
        ],
    },
    {
        name: "Quartz Floor Hardener",
        documents: [
            { name: "Technical Data Sheet", url: "/docs/quartz-floor-hardener-tech.pdf" },
            { name: "Safety Data Sheet", url: "/docs/quartz-floor-hardener-safety.pdf" },
        ],
    },
    {
        name: "SpecFilm",
        documents: [
            { name: "Technical Data Sheet", url: "/docs/specfilm-tech.pdf" },
            { name: "Safety Data Sheet", url: "/docs/specfilm-safety.pdf" },
        ],
    },
    {
        name: "Bio Strip WB",
        documents: [
            { name: "Technical Data Sheet", url: "/docs/bio-strip-wb-tech.pdf" },
            { name: "Safety Data Sheet", url: "/docs/bio-strip-wb-safety.pdf" },
        ],
    },
    {
        name: "Clean Lift 20/20",
        documents: [
            { name: "Technical Data Sheet", url: "/docs/clean-lift-2020-tech.pdf" },
            { name: "Safety Data Sheet", url: "/docs/clean-lift-2020-safety.pdf" },
        ],
    },
    {
        name: "SC Multipurpose Grout",
        documents: [
            { name: "Technical Data Sheet", url: "/docs/sc-multipurpose-grout-tech.pdf" },
            { name: "Safety Data Sheet", url: "/docs/sc-multipurpose-grout-safety.pdf" },
        ],
    },
    {
        name: "PolyFix",
        documents: [
            { name: "Technical Data Sheet", url: "/docs/polyfix-tech.pdf" },
            { name: "Safety Data Sheet", url: "/docs/polyfix-safety.pdf" },
        ],
    },
    {
        name: "SpecHard",
        documents: [
            { name: "Technical Data Sheet", url: "/docs/spechard-tech.pdf" },
            { name: "Safety Data Sheet", url: "/docs/spechard-safety.pdf" },
        ],
    },
    {
        name: "RepCon V/O",
        documents: [
            { name: "Technical Data Sheet", url: "/docs/repcon-vo-tech.pdf" },
            { name: "Safety Data Sheet", url: "/docs/repcon-vo-safety.pdf" },
        ],
    },
    {
        name: "SpecPatch 30",
        documents: [
            { name: "Technical Data Sheet", url: "/docs/specpatch-30-tech.pdf" },
            { name: "Safety Data Sheet", url: "/docs/specpatch-30-safety.pdf" },
        ],
    },
    {
        name: "Rapid Flex CJ",
        documents: [
            { name: "Technical Data Sheet", url: "/docs/rapid-flex-cj-tech.pdf" },
            { name: "Safety Data Sheet", url: "/docs/rapid-flex-cj-safety.pdf" },
        ],
    },
    {
        name: "SpecEtch",
        documents: [
            { name: "Technical Data Sheet", url: "/docs/specetch-tech.pdf" },
            { name: "Safety Data Sheet", url: "/docs/specetch-safety.pdf" },
        ],
    },
    {
        name: "All Shield EX",
        documents: [
            { name: "Technical Data Sheet", url: "/docs/all-shield-ex-tech.pdf" },
            { name: "Safety Data Sheet", url: "/docs/all-shield-ex-safety.pdf" },
        ],
    },
    // Additional products can be added here
];

export default function DocumentSearch() {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        // Filter suggestions based on query
        if (query.length > 0) {
            setSuggestions(
                productDocuments.filter((product) =>
                    product.name.toLowerCase().includes(query.toLowerCase())
                )
            );
        } else {
            setSuggestions([]);
            setSelectedProduct(null);
        }
    }, [query]);

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-xl font-bold text-center mb-8">Find Your Documents</h1>

            {/* Search Input */}
            <div className="relative max-w-xl mx-auto mb-8">
                <Input
                    type="text"
                    placeholder="Search for a product..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full p-4 rounded-md border border-gray-300"
                />
                {/* Suggestions Dropdown */}
                {suggestions.length > 0 && (
                    <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
                        {suggestions.map((product) => (
                            <button
                                key={product.name}
                                onClick={() => {
                                    setSelectedProduct(product);
                                    setQuery(product.name);
                                    setSuggestions([]);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                            >
                                {product.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Document Display Section */}
            {selectedProduct && (
                <div className="max-w-xl mx-auto mt-4 p-4 bg-gray-100 rounded-md shadow-md">
                    <h2 className="text-xl font-semibold mb-4">{selectedProduct.name} Documents</h2>
                    <ul className="space-y-2">
                        {selectedProduct.documents.map((doc) => (
                            <li key={doc.name}>
                                <Link href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                    {doc.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}