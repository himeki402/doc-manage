
import { Document } from "@/lib/types/document"
import { calculateRelevance, findMatchesWithContext } from "@/lib/utils"


export interface SearchResult {
  document: Document
  relevance: number
  matches: {
    field: string
    contexts: string[]
  }[]
}

export class SearchService {
  private documents: Document[] = []

  constructor(documents: Document[]) {
    this.documents = documents
  }

  updateDocuments(documents: Document[]) {
    this.documents = documents
  }

  search(
    query: string,
    options: {
      includeContent?: boolean
      includeMetadata?: boolean
      limit?: number
    } = {},
  ): SearchResult[] {
    if (!query.trim()) return []

    const { includeContent = true, includeMetadata = true, limit = 20 } = options

    // Calculate relevance for each document
    const results: SearchResult[] = this.documents.map((document) => {
      const relevance = calculateRelevance(
        {
          name: document.title, 
          description: document.description || "",
          content: document.content || "",
          tags: document.tags || [],
        },
        query
      )

      const matches: SearchResult["matches"] = []

      // Find matches in title and description if metadata is included
      if (includeMetadata) {
        const titleMatches = findMatchesWithContext(document.title, query)
        if (titleMatches.length > 0) {
          matches.push({
            field: "title",
            contexts: titleMatches,
          })
        }

        const descriptionMatches = findMatchesWithContext(document.description || "", query)
        if (descriptionMatches.length > 0) {
          matches.push({
            field: "description",
            contexts: descriptionMatches,
          })
        }
      }

      // Find matches in content if content is included
      if (includeContent) {
        const contentMatches = findMatchesWithContext(document.content || "", query)
        if (contentMatches.length > 0) {
          matches.push({
            field: "content",
            contexts: contentMatches,
          })
        }
      }

      return {
        document,
        relevance,
        matches,
      }
    })

    // Filter out documents with no matches and sort by relevance
    return results
      .filter((result) => result.matches.length > 0)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, limit)
  }
}
