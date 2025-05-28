import { Document } from "@/lib/types/document";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface DocumentEditModalProps {
    document: Document | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (document: Document) => void;
}

export default function DocumentEditModal({
    document,
    isOpen,
    onClose,
    onSave,
}: DocumentEditModalProps) {
    if (!document) return null;

    const handleSave = () => {
        // Logic lưu sẽ được implement ở component cha
        onSave(document);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa tài liệu</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label
                            htmlFor="title"
                            className="text-right text-sm font-medium"
                        >
                            Tiêu đề
                        </label>
                        <Input
                            id="title"
                            defaultValue={document.title}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label
                            htmlFor="description"
                            className="text-right text-sm font-medium"
                        >
                            Mô tả
                        </label>
                        <Textarea
                            id="description"
                            defaultValue={document.description}
                            className="col-span-3 min-h-28"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label
                            htmlFor="access"
                            className="text-right text-sm font-medium"
                        >
                            Quyền truy cập
                        </label>
                        <Select defaultValue={document.accessType}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Chọn quyền truy cập" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PUBLIC">Công khai</SelectItem>
                                <SelectItem value="PRIVATE">Riêng tư</SelectItem>
                                <SelectItem value="GROUP">Nhóm</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button onClick={handleSave}>Lưu thay đổi</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}