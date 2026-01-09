/**
 * Utility for managing filter preferences in localStorage
 */

const STORAGE_KEYS = {
    VIEW_MODE: 'productViewMode',
    SORT_PREFERENCE: 'productSortPreference',
    PER_PAGE: 'productPerPage',
    COLLAPSED_SECTIONS: 'filterCollapsedSections',
};

export const FilterPreferences = {
    /**
     * Get view mode preference
     */
    getViewMode(): 'grid' | 'list' {
        if (typeof window === 'undefined') return 'grid';
        const saved = localStorage.getItem(STORAGE_KEYS.VIEW_MODE);
        return (saved as 'grid' | 'list') || 'grid';
    },

    /**
     * Save view mode preference
     */
    setViewMode(mode: 'grid' | 'list'): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem(STORAGE_KEYS.VIEW_MODE, mode);
    },

    /**
     * Get sort preference
     */
    getSortPreference(): string {
        if (typeof window === 'undefined') return 'newest';
        return localStorage.getItem(STORAGE_KEYS.SORT_PREFERENCE) || 'newest';
    },

    /**
     * Save sort preference
     */
    setSortPreference(sort: string): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem(STORAGE_KEYS.SORT_PREFERENCE, sort);
    },

    /**
     * Get per page preference
     */
    getPerPage(): number {
        if (typeof window === 'undefined') return 24;
        const saved = localStorage.getItem(STORAGE_KEYS.PER_PAGE);
        return saved ? parseInt(saved, 10) : 24;
    },

    /**
     * Save per page preference
     */
    setPerPage(perPage: number): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem(STORAGE_KEYS.PER_PAGE, perPage.toString());
    },

    /**
     * Get collapsed filter sections
     */
    getCollapsedSections(): Record<string, boolean> {
        if (typeof window === 'undefined') return {};
        const saved = localStorage.getItem(STORAGE_KEYS.COLLAPSED_SECTIONS);
        return saved ? JSON.parse(saved) : {};
    },

    /**
     * Save collapsed filter sections
     */
    setCollapsedSections(sections: Record<string, boolean>): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem(STORAGE_KEYS.COLLAPSED_SECTIONS, JSON.stringify(sections));
    },

    /**
     * Clear all filter preferences
     */
    clearAll(): void {
        if (typeof window === 'undefined') return;
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
    },
};
