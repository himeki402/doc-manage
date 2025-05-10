import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Category, NavigationItem } from "./types/category";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDateToDDMMMM(isoDateString: string): string {
    if (!isoDateString) return "01 Jan";
    const date = new Date(isoDateString);
    const day = date.getDate();
    const monthNames: string[] = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    const monthIndex = date.getMonth();
    const month = monthNames[monthIndex];

    return `${day} ${month}`;
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, "-");
}

export function convertCategoryToNavigationItem(
    category: Category
): NavigationItem {
    const item: NavigationItem = {
        title: category.name,
        href: `/category/${category.slug}`,
    };

    if (category.children && category.children.length > 0) {
        item.items = category.children.map(convertCategoryToNavigationItem);
    }

    return item;
}

export function convertCategoriesToNavigation(
    categories: any[]
): NavigationItem[] {
    return categories.map(convertCategoryToNavigationItem);
}

export const hasAuthToken = (): boolean => {
    const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
    return !!token;
};

export function normalizeText(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, "") // Remove special characters
        .replace(/\s+/g, " ") // Normalize whitespace
        .trim();
}

// Extract keywords from text
export function extractKeywords(text: string): string[] {
    const normalized = normalizeText(text);
    // Split into words and filter out common stop words and short words
    const stopWords = new Set([
        "a",
        "an",
        "the",
        "and",
        "or",
        "but",
        "is",
        "are",
        "was",
        "were",
        "in",
        "on",
        "at",
        "to",
        "for",
        "with",
        "by",
        "of",
        "about",
    ]);

    return normalized
        .split(" ")
        .filter((word) => word.length > 2 && !stopWords.has(word));
}

// Find matches in text with surrounding context
export function findMatchesWithContext(
    text: string,
    query: string,
    contextSize = 40
): string[] {
    const normalizedText = text.toLowerCase();
    const normalizedQuery = query.toLowerCase();
    const matches: string[] = [];

    let index = normalizedText.indexOf(normalizedQuery);
    while (index !== -1) {
        // Get context around the match
        const start = Math.max(0, index - contextSize);
        const end = Math.min(
            text.length,
            index + normalizedQuery.length + contextSize
        );

        // Extract the context with the match
        let context = text.substring(start, end);

        // Add ellipsis if we're not at the beginning or end
        if (start > 0) context = "..." + context;
        if (end < text.length) context = context + "...";

        matches.push(context);

        // Find next occurrence
        index = normalizedText.indexOf(normalizedQuery, index + 1);
    }

    return matches;
}

// Calculate search relevance score (simple implementation)
export function calculateRelevance(
    document: {
        name: string;
        description: string;
        content: string;
        tags: string[];
    },
    query: string
): number {
    const normalizedQuery = normalizeText(query);
    const queryTerms = normalizedQuery
        .split(" ")
        .filter((term) => term.length > 2);

    let score = 0;

    // Check title (highest weight)
    const titleMatches = queryTerms.filter((term) =>
        normalizeText(document.name).includes(term)
    ).length;
    score += titleMatches * 10;

    // Check description
    const descMatches = queryTerms.filter((term) =>
        normalizeText(document.description).includes(term)
    ).length;
    score += descMatches * 5;

    // Check content
    const contentMatches = queryTerms.filter((term) =>
        normalizeText(document.content).includes(term)
    ).length;
    score += contentMatches * 3;

    // Check tags
    const tagMatches = queryTerms.filter((term) =>
        document.tags.some((tag) => normalizeText(tag).includes(term))
    ).length;
    score += tagMatches * 7;

    return score;
}
