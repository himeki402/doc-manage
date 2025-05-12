"use client"

import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AccessType } from "@/lib/types/document"
import { useAdminContext } from "@/contexts/adminContext"


export function DocumentsFilters() {
  const { filters, setFilters, categories, tags, groups } = useAdminContext()

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

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filters:</span>
      </div>

      <div className="flex flex-wrap gap-3">
        <Select value={filters.accessType} onValueChange={handleAccessTypeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Access Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Access Types</SelectItem>
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
            <SelectItem value="all">All Categories</SelectItem>
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
            <SelectItem value="all">All Tags</SelectItem>
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
            <SelectItem value="all">All Groups</SelectItem>
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
          onClick={() =>
            setFilters({
              accessType: "all",
              category: "all",
              tag: "all",
              group: "all",
            })
          }
        >
          Reset Filters
        </Button>
      </div>
    </div>
  )
}
