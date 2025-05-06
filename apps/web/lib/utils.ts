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

export function convertCategoryToNavigationItem(category: Category): NavigationItem {
    const item: NavigationItem = {
        title: category.name,
        href: `/category/${category.slug}`,
    };

    if (category.children && category.children.length > 0) {
        item.items = category.children.map(convertCategoryToNavigationItem);
    }

    return item;
}

export function convertCategoriesToNavigation(categories: any[]): NavigationItem[] {
    return categories.map(convertCategoryToNavigationItem);
}

export const hasAuthToken = (): boolean => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1];
    return !!token; 
  };