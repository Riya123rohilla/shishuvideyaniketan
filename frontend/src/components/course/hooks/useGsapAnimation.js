import { useEffect, useRef } from 'react';

/**
 * Hook for hero entrance animation
 */
export const useHeroAnimation = () => {
    const heroRef = useRef(null);
    const headingRef = useRef(null);
    const searchRef = useRef(null);
    const chipsRef = useRef(null);
    return { heroRef, headingRef, searchRef, chipsRef };
};

/**
 * Hook for staggered card entrance animation
 */
export const useCardsAnimation = () => {
    const containerRef = useRef(null);
    return containerRef;
};

/**
 * Hook for filter panel slide animation
 */
export const useFilterAnimation = (isOpen) => {
    const filterRef = useRef(null);
    useEffect(() => {
        if (filterRef.current) {
            // Ensure element is simply visible without animation when open
            filterRef.current.style.transform = 'none';
        }
    }, [isOpen]);
    return filterRef;
};

/**
 * Hook for modal animation
 */
export const useModalAnimation = (isOpen) => {
    const overlayRef = useRef(null);
    const contentRef = useRef(null);
    useEffect(() => {
        if (overlayRef.current && contentRef.current) {
            overlayRef.current.style.opacity = isOpen ? '1' : '0';
        }
    }, [isOpen]);
    return { overlayRef, contentRef };
};

/**
 * Hook for tab indicator animation
 */
export const useTabAnimation = (activeIndex, tabsRef) => {
    const indicatorRef = useRef(null);
    useEffect(() => {
        if (tabsRef.current && indicatorRef.current) {
            const tabs = tabsRef.current.querySelectorAll('[role="tab"]');
            const activeTab = tabs[activeIndex];
            if (activeTab) {
                indicatorRef.current.style.left = activeTab.offsetLeft + 'px';
                indicatorRef.current.style.width = activeTab.offsetWidth + 'px';
            }
        }
    }, [activeIndex, tabsRef]);
    return indicatorRef;
};

/**
 * Utility for hover card animation
 */
export const cardHoverAnimation = {
    onMouseEnter: () => {},
    onMouseLeave: () => {},
};
