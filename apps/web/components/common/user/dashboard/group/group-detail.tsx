import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Document, Group, Member } from "@/lib/types/group";
import { convertBytesToMB } from "@/lib/utils";
import { FileText, Plus, Search, UserPlus, Users, X, Trash2, Image, FileTextIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface GroupDetailProps {
  group: Group;
  documents: Document[];
  members: Member[];
  onBack: () => void;
  onShowInviteDialog: () => void;
  onRemoveMember: (memberId: string) => void;
  onDeleteGroup: (groupId: string) => void;
}

export function GroupDetail({ group, documents, members, onBack, onShowInviteDialog, onRemoveMember, onDeleteGroup }: GroupDetailProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const router = useRouter();

  const getRoleText = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Quản trị viên';
      case 'MEMBER': return 'Thành viên';
      default: return 'Thành viên';
    }
  };

  const getFileIcon = (mimeType: string) => {
    switch (mimeType) {
      case "application/pdf":
        return { icon: <FileText size={20} />, label: "PDF", bgColor: "bg-red-100", textColor: "text-red-700" };
      case "text/plain":
      case "application/msword":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return { icon: <FileText size={20} />, label: "DOCX", bgColor: "bg-blue-100", textColor: "text-blue-700" };
      case "image/jpeg":
      case "image/png":
      case "image/gif":
        return { icon: <Image size={20} />, label: "IMAGE", bgColor: "bg-green-100", textColor: "text-green-700" };
      default:
        return { icon: <FileTextIcon size={20} />, label: "Khác", bgColor: "bg-amber-100", textColor: "text-amber-700" };
    }
  };

  const handleDeleteGroup = () => {
    if (deleteConfirmText === group.name) {
      onDeleteGroup(group.id);
      setIsDeleteDialogOpen(false);
      setDeleteConfirmText("");
    }
  };

  const handleViewDocumentClick = (e: React.MouseEvent, doc: Document) => {
        e.preventDefault();
        router.push(`/doc/${doc.id}`);
    };

  const canDeleteGroup = deleteConfirmText === group.name;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={onBack}>
          ← Quay lại
        </Button>
        {group.isAdmin && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Chỉnh sửa nhóm
            </Button>
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa nhóm
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xác nhận xóa nhóm</AlertDialogTitle>
                </AlertDialogHeader>
                <div className="space-y-4">
                  <div>
                    Bạn có chắc chắn muốn xóa nhóm "{group.name}" không?
                  </div>
                  <div className="text-red-600 font-medium">
                    ⚠️ Hành động này không thể hoàn tác và sẽ:
                  </div>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <div>• Xóa vĩnh viễn tất cả {group.documentCount} tài liệu trong nhóm</div>
                    <div>• Loại bỏ {group.memberCount} thành viên khỏi nhóm</div>
                    <div>• Xóa toàn bộ dữ liệu và lịch sử nhóm</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-2">
                      Để xác nhận, vui lòng nhập tên nhóm: {group.name}
                    </div>
                    <Input
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="Nhập tên nhóm để xác nhận"
                    />
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setDeleteConfirmText("")}>
                    Hủy
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteGroup}
                    disabled={!canDeleteGroup}
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Xóa nhóm vĩnh viễn
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{group.name}</CardTitle>
              <CardDescription>{group.description}</CardDescription>
            </div>
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
                    {documents.map((doc) => {
                      const { icon, label, bgColor, textColor } = getFileIcon(doc.mimeType);
                      return (
                        <div key={doc.id} className="flex items-center justify-between p-4 hover:bg-muted/50">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-md flex items-center justify-center ${bgColor} ${textColor}`}>
                              {icon}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{doc.title}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{label}</span>
                                <span>•</span>
                                <span>Tải lên bởi {doc.createdBy.name}</span>
                                <span>•</span>
                                <span>{convertBytesToMB(doc.fileSize)} MB</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">                      
                            <Button variant="ghost" size="sm" onClick={(e) => handleViewDocumentClick(e, doc)}>
                              Xem
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => window.location.href = doc.fileUrl}>
                              Tải xuống
                            </Button>
                          </div>
                        </div>
                      );
                    })}
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
                            {getRoleText(member.role)}
                          </Badge>
                          {group.isAdmin && member.role !== "ADMIN" && (
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onRemoveMember(member.user_id)}>
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
  );
}