"use client";

import { useState } from "react";

// Define prop types
interface SearchBarProps {
    onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
    const [query, setQuery] = useState("");

    return (
        <div className="flex items-center space-x-3">
            <input
                type="text"
                placeholder="Search resources..."
                className="px-4 py-2 border rounded-lg w-full"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    onSearch(e.target.value);
                }}
            />
        </div>
    );
};

// ✅ Ensure there is only ONE export default
export default SearchBar;