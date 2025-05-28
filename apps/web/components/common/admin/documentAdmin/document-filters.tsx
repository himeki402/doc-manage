"use client"

import { Filter, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AccessType } from "@/lib/types/document"
import { useAdminContext } from "@/contexts/adminContext"
import { useState, useEffect, useCallback } from "react"

export function DocumentsFilters() {
  const { filters, setFilters, categories, tags, groups } = useAdminContext()
  const [searchInput, setSearchInput] = useState(filters.search)

  // Debounced search function
  const debouncedSearch = useCallback(
    (searchValue: string) => {
      const timer = setTimeout(() => {
        if (searchValue !== filters.search) {
          setFilters({ search: searchValue })
        }
      }, 500)
      return timer
    },
    [filters.search, setFilters]
  )

  // Handle search input changes
  useEffect(() => {
    const timer = debouncedSearch(searchInput)
    return () => clearTimeout(timer)
  }, [searchInput, debouncedSearch])

  // Update search input when filters.search changes externally
  useEffect(() => {
    if (filters.search !== searchInput) {
      setSearchInput(filters.search)
    }
  }, [filters.search])

  const handleAccessTypeChange = (value: string) => {
    setFilters({
      accessType: value as AccessType | "all",
    })
  }

  const handleCategoryChange = (value: string) => {
    setFilters({
      category: value,
    })
  }

  const handleTagChange = (value: string) => {
    setFilters({
      tag: value,
    })
  }

  const handleGroupChange = (value: string) => {
    setFilters({
      group: value,
    })
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
  }

  const clearSearch = () => {
    setSearchInput("")
  }

  const resetAllFilters = () => {
    setSearchInput("")
    setFilters({
      accessType: "all",
      category: "all",
      tag: "all",
      group: "all",
      search: "",
    })
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm tài liệu theo tiêu đề, mô tả..."
          value={searchInput}
          onChange={handleSearchChange}
          className="pl-10 pr-10"
        />
        {searchInput && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Lọc:</span>
        </div>

        <div className="flex flex-wrap gap-3">
          <Select value={filters.accessType} onValueChange={handleAccessTypeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Access Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Quyền truy cập</SelectItem>
              <SelectItem value="PRIVATE">Private</SelectItem>
              <SelectItem value="PUBLIC">Public</SelectItem>
              <SelectItem value="GROUP">Group</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.tag} onValueChange={handleTagChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả thẻ</SelectItem>
              {tags.map((tag) => (
                <SelectItem key={tag.id} value={tag.id}>
                  {tag.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.group} onValueChange={handleGroupChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả nhóm</SelectItem>
              {groups.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={resetAllFilters}
          >
            Đặt lại tất cả
          </Button>
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchInput || 
        filters.accessType !== "all" || 
        filters.category !== "all" || 
        filters.tag !== "all" || 
        filters.group !== "all") && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Đang lọc:</span>
          
          {searchInput && (
            <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
              <Search className="h-3 w-3" />
              <span>"{searchInput}"</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="h-4 w-4 p-0 ml-1"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          {filters.accessType !== "all" && (
            <div className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm">
              <span>{filters.accessType}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters({ accessType: "all" })}
                className="h-4 w-4 p-0 ml-1"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          {filters.category !== "all" && (
            <div className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm">
              <span>{categories.find(c => c.id === filters.category)?.name || filters.category}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters({ category: "all" })}
                className="h-4 w-4 p-0 ml-1"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          {filters.tag !== "all" && (
            <div className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm">
              <span>{tags.find(t => t.id === filters.tag)?.name || filters.tag}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters({ tag: "all" })}
                className="h-4 w-4 p-0 ml-1"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          {filters.group !== "all" && (
            <div className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm">
              <span>{groups.find(g => g.id === filters.group)?.name || filters.group}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters({ group: "all" })}
                className="h-4 w-4 p-0 ml-1"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}