"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  FileText,
  Download,
  Share2,
  Clock,
  User,
  Eye,
  Star,
  Tag,
  FolderClosed,
  Lock,
  Users,
  Globe,
  History,
} from "lucide-react"
import { useAdminContext } from "@/contexts/adminContext"
import { Document } from "@/lib/types/document"


interface DocumentDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  document: Document
}

export function DocumentDetailsDialog({ open, onOpenChange, document }: DocumentDetailsDialogProps) {
  const { categories, tags, users, setIsShareModalOpen, setIsVersionModalOpen } = useAdminContext()
  const [activeTab, setActiveTab] = useState("overview")

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getAccessTypeIcon = (accessType: string) => {
    switch (accessType) {
      case "private":
        return <Lock className="h-4 w-4 text-red-500" />
      case "public":
        return <Globe className="h-4 w-4 text-green-500" />
      case "group":
        return <Users className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  const getTagNames = (tagIds: string[]) => {
    return tagIds.map((tagId) => {
      const tag = tags.find((t) => t.id === tagId)
      return tag ? tag.name : tagId
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {document.title}
          </DialogTitle>
          <DialogDescription>{document.description}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="versions">Version History</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Document Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Type:</span>
                    <Badge variant="outline">{document.mimeType}</Badge>
                  </div>
                  {/* <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Size:</span>
                    <span>{document.size}</span>
                  </div> */}
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Category:</span>
                    <div className="flex items-center gap-1">
                      <FolderClosed className="h-3.5 w-3.5" />
                      <span>{document.categoryName}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Current Version:</span>
                    <span>v{document.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Access Type:</span>
                    <div className="flex items-center gap-1">
                      {getAccessTypeIcon(document.accessType)}
                      <span className="capitalize">{document.accessType}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Stats & Metadata</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Views:</span>
                    </div>
                    <span>{document.view}</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Rating:</span>
                    </div>
                    <div className="flex text-yellow-400">
                      {document.rating.toFixed(1)}
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="ml-0.5 h-3.5 w-3.5"
                          fill={i < Math.floor(document.rating) ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Owner:</span>
                    </div>
                    <span>{document.createdByName}</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Created:</span>
                    </div>
                    <span>{formatDate(document.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Last Modified:</span>
                    </div>
                    <span>{formatDate(document.updated_at)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {getTagNames(document.tags).map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsShareModalOpen(true)
                  onOpenChange(false)
                }}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setIsVersionModalOpen(true)
                  onOpenChange(false)
                }}
              >
                <History className="mr-2 h-4 w-4" />
                Upload New Version
              </Button>
            </div>
          </TabsContent>

          {/* <TabsContent value="versions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Version History</CardTitle>
                <CardDescription>Track changes and previous versions of this document</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {document.versionHistory
                    .slice()
                    .reverse()
                    .map((version) => (
                      <div key={version.version} className="flex items-start gap-4 pb-4 border-b last:border-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                          <History className="h-4 w-4" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">Version {version.version}</p>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Download className="mr-2 h-3.5 w-3.5" />
                                Download
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Eye className="mr-2 h-3.5 w-3.5" />
                                View
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{version.changes}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Updated by {getUserName(version.updatedBy)}</span>
                            <span>{formatDate(version.updatedAt)}</span>
                            <span>Size: {version.fileSize}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                onClick={() => {
                  setIsVersionModalOpen(true)
                  onOpenChange(false)
                }}
              >
                <History className="mr-2 h-4 w-4" />
                Upload New Version
              </Button>
            </div>
          </TabsContent> */}

          {/* <TabsContent value="audit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Audit Log</CardTitle>
                <CardDescription>Track all activities related to this document</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {document.versionHistory
                    .slice()
                    .reverse()
                    .map((version) => (
                      <div key={version.version} className="flex items-start gap-4 pb-4 border-b last:border-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                          <User className="h-4 w-4" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">
                            {getUserName(version.updatedBy)} {version.version === 1 ? "created" : "updated"} the
                            document
                          </p>
                          <p className="text-sm text-muted-foreground">{version.changes}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(version.updatedAt)}</p>
                        </div>
                      </div>
                    ))}

                  <div className="flex items-start gap-4 pb-4 border-b">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      <Eye className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Document viewed by multiple users</p>
                      <p className="text-sm text-muted-foreground">Total views: {document.views}</p>
                    </div>
                  </div>

                  {document.sharedWith.length > 0 && (
                    <div className="flex items-start gap-4 pb-4 border-b">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        <Share2 className="h-4 w-4" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">Document shared with users</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {document.sharedWith.map((userId) => (
                            <Badge key={userId} variant="outline">
                              {getUserName(userId)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent> */}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
