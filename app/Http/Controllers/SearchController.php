<?php

namespace App\Http\Controllers;

use App\Services\ProductSearchService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SearchController extends Controller
{
    protected ProductSearchService $searchService;

    public function __construct(ProductSearchService $searchService)
    {
        $this->searchService = $searchService;
    }

    /**
     * Get search suggestions.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function suggestions(Request $request): JsonResponse
    {
        $query = $request->input('q', '');

        if (strlen($query) < 2) {
            return response()->json([
                'suggestions' => [],
            ]);
        }

        $suggestions = $this->searchService->getSuggestions($query);
        $recentSearches = $this->searchService->getRecentSearches(auth()->id());

        return response()->json([
            'suggestions' => $suggestions,
            'recent' => $recentSearches,
        ]);
    }

    /**
     * Get popular searches.
     *
     * @return JsonResponse
     */
    public function popular(): JsonResponse
    {
        $popularSearches = $this->searchService->getPopularSearches(10);

        return response()->json([
            'popular' => $popularSearches,
        ]);
    }

    /**
     * Get filter options for products.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function filterOptions(Request $request): JsonResponse
    {
        $categorySlug = $request->input('category');

        $options = $this->searchService->getFilterOptions($categorySlug);

        return response()->json($options);
    }
}
