import { useEffect, useRef, useState } from 'react';

function useScrollSpy(
    ids: string[],
    offset = 80,
    debounceMs = 100,
    onActiveChange?: (id: string | null) => void
) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                const scrollPos = window.scrollY + offset;

                const visibleSections = ids
                    .map((id) => {
                        const el = document.getElementById(id);
                        if (!el) return null;
                        const top = el.offsetTop;
                        return scrollPos >= top ? id : null;
                    })
                    .filter(Boolean);

                const lastVisible = visibleSections.at(-1) || null;

                if (lastVisible !== activeId) {
                    setActiveId(lastVisible);
                    if (onActiveChange) {
                        onActiveChange(lastVisible);
                    }
                }
            }, debounceMs);
        };

        handleScroll(); // run on mount
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [ids, offset, debounceMs, onActiveChange, activeId]);

    return activeId;
}

export default useScrollSpy;