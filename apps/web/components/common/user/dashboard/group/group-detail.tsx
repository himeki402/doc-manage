import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Document, Group, Member } from "@/lib/types/group"
import { convertBytesToMB } from "@/lib/utils";
import { FileText, Plus, Search, UserPlus, Users, X } from "lucide-react";

interface GroupDetailProps {
  group: Group;
  documents: Document[];
  members: Member[];
  onBack: () => void
  onShowInviteDialog: () => void
  onRemoveMember: (memberId: string) => void
}

export function GroupDetail({ group, documents, members, onBack, onShowInviteDialog, onRemoveMember }: GroupDetailProps) {
  const getRoleText = (role: string) => {
    switch (role) {
      case 'OWNER': return 'Chủ nhóm'
      case 'ADMIN': return 'Quản trị viên'
      case 'MEMBER': return 'Thành viên'
      default: return 'Thành viên'
    }
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={onBack}>
          ← Quay lại
        </Button>
        {group.isAdmin && (
          <Button variant="outline" size="sm">
            Chỉnh sửa nhóm
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{group.name}</CardTitle>
              <CardDescription>{group.description}</CardDescription>
            </div>
            {group.isAdmin && (
              <Button onClick={onShowInviteDialog}>
                <UserPlus className="mr-2 h-4 w-4" /> Mời thành viên
              </Button>
            )}
          </div>
          <div className="flex items-center text-sm text-muted-foreground mt-2">
            <div className="flex items-center mr-4">
              <Users className="h-4 w-4 mr-1" />
              <span>{group.memberCount} thành viên</span>
            </div>
            <div className="flex items-center mr-4">
              <FileText className="h-4 w-4 mr-1" />
              <span>{group.documentCount} tài liệu</span>
            </div>
            <div>Ngày tạo: {new Date(group.created_at).toLocaleDateString("vi-VN")}</div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="documents">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
              <TabsTrigger
                value="documents"
                className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary"
              >
                Tài liệu
              </TabsTrigger>
              <TabsTrigger
                value="members"
                className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary"
              >
                Thành viên
              </TabsTrigger>
            </TabsList>
            <TabsContent value="documents" className="p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Tìm kiếm tài liệu..." className="pl-9" />
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Thêm tài liệu
                </Button>
              </div>
              <div className="rounded-md border">
                <ScrollArea className="h-[400px]">
                  <div className="divide-y">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 hover:bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-md flex items-center justify-center ${
                              doc.mimeType === "application/pdf"
                                ? "bg-red-100 text-red-700"
                                : doc.mimeType === "text/plain"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            <FileText size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{doc.title}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{doc.mimeType === "application/pdf" ? "PDF" : doc.mimeType === "text/plain" ? "DOCX" : "Khác"}</span>
                              <span>•</span>
                              <span>Tải lên bởi {doc.createdBy.name}</span>
                              <span>•</span>
                              <span>{convertBytesToMB(doc.fileSize)} MB</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            Xem
                          </Button>
                          <Button variant="ghost" size="sm">
                            Tải xuống
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
            <TabsContent value="members" className="p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Tìm kiếm thành viên..." className="pl-9" />
                </div>
                {group.isAdmin && (
                  <Button onClick={onShowInviteDialog}>
                    <UserPlus className="mr-2 h-4 w-4" /> Mời thành viên
                  </Button>
                )}
              </div>
              <div className="rounded-md border">
                <ScrollArea className="h-[400px]">
                  <div className="divide-y">
                    {members.map((member) => (
                      <div key={member.user_id} className="flex items-center justify-between p-4 hover:bg-muted/50">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={member.user.avatar || "/placeholder.svg"} alt={member.user.name} />
                            <AvatarFallback>{member.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{member.user.name}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{member.user?.email || "Không có email"}</span>
                              <span>•</span>
                              <span>Tham gia: {new Date(member.joined_at).toLocaleDateString("vi-VN")}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={
                              member.role === "ADMIN"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-gray-50 text-gray-700 border-gray-200"
                            }
                          >
                            {member.role}
                          </Badge>
                          {group.isAdmin && member.role !== "ADMIN" && (
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}