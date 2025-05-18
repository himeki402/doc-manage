import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface FilterProps {
    type: string;
    label: string;
    options: string[];
    currentValue: string;
}

export function FilterDropdown({
    type,
    label,
    options,
    currentValue,
}: FilterProps) {
}
