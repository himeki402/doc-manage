import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Category, NavigationItem } from "./types/category";
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

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

export function formatDateToFullOptions(isoDateString: string): string {
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
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
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
        .find((row) => row.startsWith("accessToken="))
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

export function formatTimeAgo(date: string): string {
    try {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            throw new Error('Invalid date');
        }
        return formatDistanceToNow(parsedDate, { addSuffix: true, locale: vi });
    } catch (error) {
        console.error('Error parsing date:', error);
        return 'Không xác định';
    }
}

export function convertBytesToMB(bytes: number): number {
  const mb = bytes / (1024 * 1024);
  return Number(mb.toFixed(2));
}
