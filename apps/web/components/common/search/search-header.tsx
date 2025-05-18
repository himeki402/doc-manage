"use client";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface Filters {
  categoryId?: string;
  length?: string;
  fileType?: string;
  dateUploaded?: string;
}

interface SearchHeaderProps {
  query: string;
  filters: Filters;
  resultsCount: number;
  viewMode?: "list" | "grid";
  onViewModeChange?: (mode: "list" | "grid") => void;
}

export default function SearchHeader({
  query,
  filters,
  resultsCount,
  viewMode = "grid",
  onViewModeChange,
}: SearchHeaderProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const categoryOptions = ["All", "Books", "Academic", "Educational", "Business"];
  const lengthOptions = [
    "Any length",
    "Short (<50 pages)",
    "Medium (50-200 pages)",
    "Long (>200 pages)",
  ];
  const fileTypeOptions = ["Any file", "PDF", "DOCX", "EPUB", "PPT"];
  const dateOptions = [
    "Any time",
    "Last 24 hours",
    "Last week",
    "Last month",
    "Last year",
  ];
  const languageOptions = [
    "Any language",
    "English",
    "Vietnamese",
    "Spanish",
    "French",
  ];

  const handleFilterChange = (filterType: keyof Filters, value: string) => {
    const newFilters = {
      ...filters,
      [filterType]: value === "All" || value.includes("Any") ? "" : value,
    };
    setOpenDropdown(null);
  };

  const clearAllFilters = () => {
   
  };

  const FilterDropdown = ({
    type,
    label,
    options,
    currentValue,
  }: {
    type: keyof Filters;
    label: string;
    options: string[];
    currentValue?: string;
  }) => {
    const isOpen = openDropdown === type;

    return (
      <div className="relative">
        <button
          className={`flex items-center justify-between px-3 py-2 border rounded-md text-sm ${
            isOpen ? "border-blue-500" : "border-gray-300"
          }`}
          onClick={() => setOpenDropdown(isOpen ? null : type)}
        >
          <span>{currentValue || label}</span>
          <ChevronDown className="ml-2 h-4 w-4" />
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
            {options.map((option) => (
              <div
                key={option}
                className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                onClick={() => handleFilterChange(type, option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full">

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <FilterDropdown
          type="categoryId"
          label="Danh mục"
          options={categoryOptions}
          currentValue={filters.categoryId}
        />
        <FilterDropdown
          type="length"
          label="Kích thước"
          options={lengthOptions}
          currentValue={filters.length}
        />
        <FilterDropdown
          type="fileType"
          label="Loại file"
          options={fileTypeOptions}
          currentValue={filters.fileType}
        />
        <FilterDropdown
          type="dateUploaded"
          label="Ngày đăng tải"
          options={dateOptions}
          currentValue={filters.dateUploaded}
        />
        <button
          onClick={clearAllFilters}
          className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 flex items-center"
        >
          Xóa bộ lọc
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="text-gray-600">
          <span className="font-medium">{(resultsCount || 0).toLocaleString()}</span>{" "}
          kết quả cho "<span className="font-medium">{query || "All"}</span>"
        </div>
        <div className="flex gap-2">
          <button
            className={`p-2 border rounded ${
              viewMode === "list" ? "bg-gray-100 border-gray-500" : "border-gray-300"
            }`}
            onClick={() => onViewModeChange?.("list")}
          >
            <div className="flex flex-col gap-1">
              <div className="w-4 h-0.5 bg-gray-500"></div>
              <div className="w-4 h-0.5 bg-gray-500"></div>
              <div className="w-4 h-0.5 bg-gray-500"></div>
            </div>
          </button>
          <button
            className={`p-2 border rounded ${
              viewMode === "grid" ? "bg-gray-100 border-gray-500" : "border-gray-300"
            }`}
            onClick={() => onViewModeChange?.("grid")}
          >
            <div className="grid grid-cols-2 gap-1">
              <div className="w-1.5 h-1.5 bg-gray-500"></div>
              <div className="w-1.5 h-1.5 bg-gray-500"></div>
              <div className="w-1.5 h-1.5 bg-gray-500"></div>
              <div className="w-1.5 h-1.5 bg-gray-500"></div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}