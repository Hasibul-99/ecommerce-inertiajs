import React, { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import { FiSearch, FiX, FiClock, FiTrendingUp, FiPackage, FiTag, FiUser } from 'react-icons/fi';
import axios from 'axios';

interface Suggestion {
    type: 'product' | 'category' | 'vendor';
    id: number;
    name: string;
    slug?: string;
    price?: number;
}

interface SearchBarProps {
    initialQuery?: string;
    placeholder?: string;
    showPopular?: boolean;
    onSearch?: (query: string) => void;
}

export default function SearchBar({
    initialQuery = '',
    placeholder = 'Search products, categories, vendors...',
    showPopular = true,
    onSearch,
}: SearchBarProps) {
    const [query, setQuery] = useState(initialQuery);
    const [showDropdown, setShowDropdown] = useState(false);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [popularSearches, setPopularSearches] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    // Load popular searches on mount
    useEffect(() => {
        if (showPopular) {
            fetchPopularSearches();
        }
    }, [showPopular]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch suggestions when query changes
    useEffect(() => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        if (query.length >= 2) {
            setLoading(true);
            debounceTimeout.current = setTimeout(() => {
                fetchSuggestions(query);
            }, 300);
        } else {
            setSuggestions([]);
            setSelectedIndex(-1);
        }

        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, [query]);

    const fetchSuggestions = async (searchQuery: string) => {
        try {
            const response = await axios.get('/api/search/suggestions', {
                params: { q: searchQuery },
            });
            setSuggestions(response.data.suggestions || []);
            setRecentSearches(response.data.recent || []);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch suggestions:', error);
            setLoading(false);
        }
    };

    const fetchPopularSearches = async () => {
        try {
            const response = await axios.get('/api/search/popular');
            setPopularSearches(response.data.popular || []);
        } catch (error) {
            console.error('Failed to fetch popular searches:', error);
        }
    };

    const handleSearch = (searchQuery?: string) => {
        const finalQuery = searchQuery || query;
        if (finalQuery.trim()) {
            if (onSearch) {
                onSearch(finalQuery);
            } else {
                router.get('/products', { search: finalQuery }, {
                    preserveState: true,
                    preserveScroll: true,
                });
            }
            setShowDropdown(false);
        }
    };

    const handleSuggestionClick = (suggestion: Suggestion) => {
        if (suggestion.type === 'product' && suggestion.slug) {
            router.get(`/product/${suggestion.slug}`);
        } else if (suggestion.type === 'category' && suggestion.slug) {
            router.get('/products', { category: suggestion.slug });
        } else if (suggestion.type === 'vendor') {
            router.get('/products', { vendors: [suggestion.id] });
        }
        setShowDropdown(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showDropdown) return;

        const totalItems = suggestions.length + recentSearches.length + (query.length === 0 ? popularSearches.length : 0);

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : prev));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
                    handleSuggestionClick(suggestions[selectedIndex]);
                } else if (selectedIndex >= suggestions.length && selectedIndex < suggestions.length + recentSearches.length) {
                    const recentQuery = recentSearches[selectedIndex - suggestions.length];
                    handleSearch(recentQuery);
                } else {
                    handleSearch();
                }
                break;
            case 'Escape':
                setShowDropdown(false);
                break;
        }
    };

    const getSuggestionIcon = (type: string) => {
        switch (type) {
            case 'product':
                return <FiPackage className="text-blue-600" />;
            case 'category':
                return <FiTag className="text-purple-600" />;
            case 'vendor':
                return <FiUser className="text-green-600" />;
            default:
                return <FiSearch className="text-gray-400" />;
        }
    };

    const formatPrice = (cents?: number) => {
        if (!cents) return '';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setShowDropdown(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                {query && (
                    <button
                        onClick={() => {
                            setQuery('');
                            setSuggestions([]);
                            inputRef.current?.focus();
                        }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <FiX />
                    </button>
                )}
            </div>

            {showDropdown && (query.length >= 2 || recentSearches.length > 0 || popularSearches.length > 0) && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                    {/* Suggestions */}
                    {suggestions.length > 0 && (
                        <div className="border-b border-gray-200">
                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Suggestions</div>
                            {suggestions.map((suggestion, index) => (
                                <button
                                    key={`${suggestion.type}-${suggestion.id}`}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className={'w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 ' + (index === selectedIndex ? 'bg-gray-100' : '')}
                                >
                                    {getSuggestionIcon(suggestion.type)}
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{suggestion.name}</p>
                                        <p className="text-xs text-gray-500 capitalize">{suggestion.type}</p>
                                    </div>
                                    {suggestion.price && (
                                        <span className="text-sm font-semibold text-blue-600">{formatPrice(suggestion.price)}</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Recent Searches */}
                    {recentSearches.length > 0 && query.length < 2 && (
                        <div className="border-b border-gray-200">
                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                                <FiClock /> Recent Searches
                            </div>
                            {recentSearches.map((search, index) => (
                                <button
                                    key={`recent-${index}`}
                                    onClick={() => handleSearch(search)}
                                    className={'w-full px-4 py-2 text-left hover:bg-gray-50 text-sm text-gray-700 ' + (index + suggestions.length === selectedIndex ? 'bg-gray-100' : '')}
                                >
                                    {search}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Popular Searches */}
                    {popularSearches.length > 0 && query.length < 2 && (
                        <div>
                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                                <FiTrendingUp /> Popular Searches
                            </div>
                            {popularSearches.map((search, index) => (
                                <button
                                    key={`popular-${index}`}
                                    onClick={() => handleSearch(search)}
                                    className={'w-full px-4 py-2 text-left hover:bg-gray-50 text-sm text-gray-700 ' + (index + suggestions.length + recentSearches.length === selectedIndex ? 'bg-gray-100' : '')}
                                >
                                    {search}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="px-4 py-6 text-center text-gray-500 text-sm">
                            Searching...
                        </div>
                    )}

                    {/* No Results */}
                    {!loading && query.length >= 2 && suggestions.length === 0 && (
                        <div className="px-4 py-6 text-center text-gray-500 text-sm">
                            No results found for "{query}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
