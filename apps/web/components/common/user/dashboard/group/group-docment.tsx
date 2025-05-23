"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText, FolderIcon, Plus, Search, Share2, Users, UserPlus, X } from "lucide-react"

// Dữ liệu mẫu cho các nhóm
const GROUPS_DATA = [
  {
    id: "1",
    name: "Nhóm học Mạng máy tính",
    description: "Nhóm chia sẻ tài liệu học tập môn Mạng máy tính",
    members: 8,
    documentCount: 24,
    createdAt: "2023-05-15",
    isOwner: true,
  },
  {
    id: "2",
    name: "Nhóm đồ án Công nghệ phần mềm",
    description: "Nhóm làm đồ án môn Công nghệ phần mềm",
    members: 5,
    documentCount: 18,
    createdAt: "2023-06-10",
    isOwner: true,
  },
  {
    id: "3",
    name: "Nhóm nghiên cứu AI",
    description: "Nhóm nghiên cứu và chia sẻ tài liệu về Trí tuệ nhân tạo",
    members: 12,
    documentCount: 35,
    createdAt: "2023-04-20",
    isOwner: false,
  },
  {
    id: "4",
    name: "Nhóm học An toàn thông tin",
    description: "Nhóm chia sẻ tài liệu học tập môn An toàn thông tin",
    members: 6,
    documentCount: 15,
    createdAt: "2023-07-05",
    isOwner: false,
  },
]

// Dữ liệu mẫu cho tài liệu trong nhóm
const GROUP_DOCUMENTS = [
  {
    id: "1",
    title: "Giáo trình Mạng máy tính",
    type: "PDF",
    uploadedBy: "Nguyễn Văn A",
    uploadedAt: "2023-05-20",
    size: "8.5 MB",
  },
  {
    id: "2",
    title: "Bài giảng Giao thức TCP/IP",
    type: "PDF",
    uploadedBy: "Trần Thị B",
    uploadedAt: "2023-06-05",
    size: "5.2 MB",
  },
  {
    id: "3",
    title: "Bài tập Mạng không dây",
    type: "DOCX",
    uploadedBy: "Lê Văn C",
    uploadedAt: "2023-06-15",
    size: "1.8 MB",
  },
  {
    id: "4",
    title: "Tài liệu tham khảo Bảo mật mạng",
    type: "PDF",
    uploadedBy: "Phạm Thị D",
    uploadedAt: "2023-07-01",
    size: "12.3 MB",
  },
  {
    id: "5",
    title: "Slide Định tuyến mạng",
    type: "PPTX",
    uploadedBy: "Hoàng Văn E",
    uploadedAt: "2023-07-10",
    size: "6.7 MB",
  },
]

// Dữ liệu mẫu cho thành viên nhóm
const GROUP_MEMBERS = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    role: "Chủ nhóm",
    joinedAt: "2023-05-15",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Trần Thị B",
    email: "tranthib@example.com",
    role: "Quản trị viên",
    joinedAt: "2023-05-16",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Lê Văn C",
    email: "levanc@example.com",
    role: "Thành viên",
    joinedAt: "2023-05-20",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "Phạm Thị D",
    email: "phamthid@example.com",
    role: "Thành viên",
    joinedAt: "2023-06-01",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    name: "Hoàng Văn E",
    email: "hoangvane@example.com",
    role: "Thành viên",
    joinedAt: "2023-06-10",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export function GroupDocumentTab() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [showCreateGroupDialog, setShowCreateGroupDialog] = useState(false)
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupDescription, setNewGroupDescription] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")

  // Lọc nhóm theo từ khóa tìm kiếm
  const filteredGroups = GROUPS_DATA.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Xử lý tạo nhóm mới
  const handleCreateGroup = () => {
    // Xử lý logic tạo nhóm mới ở đây
    console.log("Tạo nhóm mới:", { name: newGroupName, description: newGroupDescription })
    setNewGroupName("")
    setNewGroupDescription("")
    setShowCreateGroupDialog(false)
  }

  // Xử lý mời thành viên
  const handleInviteMember = () => {
    // Xử lý logic mời thành viên ở đây
    console.log("Mời thành viên:", { email: inviteEmail, groupId: selectedGroup })
    setInviteEmail("")
    setShowInviteDialog(false)
  }

  return (
    <div className="space-y-4">
      {/* Header và tìm kiếm */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">Nhóm tài liệu</h2>
          <p className="text-muted-foreground">Quản lý và truy cập tài liệu theo nhóm</p>
        </div>
        <div className="flex gap-2 items-start">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm nhóm..."
              className="pl-9 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={showCreateGroupDialog} onOpenChange={setShowCreateGroupDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Tạo nhóm mới
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tạo nhóm mới</DialogTitle>
                <DialogDescription>Tạo một nhóm mới để chia sẻ và quản lý tài liệu cùng nhau.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="group-name">Tên nhóm</Label>
                  <Input
                    id="group-name"
                    placeholder="Nhập tên nhóm"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="group-description">Mô tả</Label>
                  <Textarea
                    id="group-description"
                    placeholder="Nhập mô tả về nhóm"
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateGroupDialog(false)}>
                  Hủy
                </Button>
                <Button onClick={handleCreateGroup}>Tạo nhóm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Danh sách nhóm hoặc chi tiết nhóm */}
      {selectedGroup ? (
        <GroupDetail
          group={GROUPS_DATA.find((g) => g.id === selectedGroup)!}
          documents={GROUP_DOCUMENTS}
          members={GROUP_MEMBERS}
          onBack={() => setSelectedGroup(null)}
          onShowInviteDialog={() => setShowInviteDialog(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGroups.map((group) => (
            <Card key={group.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-start">
                  <span className="truncate">{group.name}</span>
                  {group.isOwner && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      Chủ nhóm
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="line-clamp-2">{group.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{group.members} thành viên</span>
                  </div>
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    <span>{group.documentCount} tài liệu</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex justify-between">
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4 mr-1" /> Chia sẻ
                </Button>
                <Button variant="default" size="sm" onClick={() => setSelectedGroup(group.id)}>
                  Xem chi tiết
                </Button>
              </CardFooter>
            </Card>
          ))}

          {filteredGroups.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center p-8 text-center bg-muted/50 rounded-lg">
              <FolderIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Không tìm thấy nhóm nào</h3>
              <p className="text-muted-foreground mt-2 mb-4">
                {searchTerm
                  ? `Không tìm thấy nhóm nào phù hợp với "${searchTerm}"`
                  : "Bạn chưa tham gia nhóm nào. Hãy tạo nhóm mới để bắt đầu."}
              </p>
              <Button onClick={() => setShowCreateGroupDialog(true)}>
                <Plus className="mr-2 h-4 w-4" /> Tạo nhóm mới
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Dialog mời thành viên */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mời thành viên</DialogTitle>
            <DialogDescription>Mời thành viên tham gia nhóm của bạn.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="Nhập email người dùng"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleInviteMember}>Gửi lời mời</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Component hiển thị chi tiết nhóm
interface GroupDetailProps {
  group: (typeof GROUPS_DATA)[0]
  documents: typeof GROUP_DOCUMENTS
  members: typeof GROUP_MEMBERS
  onBack: () => void
  onShowInviteDialog: () => void
}

function GroupDetail({ group, documents, members, onBack, onShowInviteDialog }: GroupDetailProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={onBack}>
          ← Quay lại
        </Button>
        {group.isOwner && (
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
            {group.isOwner && (
              <Button onClick={onShowInviteDialog}>
                <UserPlus className="mr-2 h-4 w-4" /> Mời thành viên
              </Button>
            )}
          </div>
          <div className="flex items-center text-sm text-muted-foreground mt-2">
            <div className="flex items-center mr-4">
              <Users className="h-4 w-4 mr-1" />
              <span>{group.members} thành viên</span>
            </div>
            <div className="flex items-center mr-4">
              <FileText className="h-4 w-4 mr-1" />
              <span>{group.documentCount} tài liệu</span>
            </div>
            <div>Ngày tạo: {new Date(group.createdAt).toLocaleDateString("vi-VN")}</div>
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
                              doc.type === "PDF"
                                ? "bg-red-100 text-red-700"
                                : doc.type === "DOCX"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            <FileText size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{doc.title}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{doc.type}</span>
                              <span>•</span>
                              <span>Tải lên bởi {doc.uploadedBy}</span>
                              <span>•</span>
                              <span>{doc.size}</span>
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
                {group.isOwner && (
                  <Button onClick={onShowInviteDialog}>
                    <UserPlus className="mr-2 h-4 w-4" /> Mời thành viên
                  </Button>
                )}
              </div>
              <div className="rounded-md border">
                <ScrollArea className="h-[400px]">
                  <div className="divide-y">
                    {members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-4 hover:bg-muted/50">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{member.name}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{member.email}</span>
                              <span>•</span>
                              <span>Tham gia: {new Date(member.joinedAt).toLocaleDateString("vi-VN")}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={
                              member.role === "Chủ nhóm"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : member.role === "Quản trị viên"
                                  ? "bg-purple-50 text-purple-700 border-purple-200"
                                  : "bg-gray-50 text-gray-700 border-gray-200"
                            }
                          >
                            {member.role}
                          </Badge>
                          {group.isOwner && member.role !== "Chủ nhóm" && (
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
