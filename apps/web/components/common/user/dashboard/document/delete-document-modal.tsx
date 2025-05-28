import { Document } from "@/lib/types/document";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface DocumentDeleteModalProps {
    document: Document | null;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (document: Document) => void;
}

export default function DocumentDeleteModal({
    document,
    isOpen,
    onClose,
    onConfirm,
}: DocumentDeleteModalProps) {
    if (!document) return null;

    const handleConfirm = () => {
        onConfirm(document);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Xác nhận xóa</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p>
                        Bạn có chắc chắn muốn xóa tài liệu "{document.title}"?
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Hành động này không thể hoàn tác.
                    </p>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button variant="destructive" onClick={handleConfirm}>
                        Xóa
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}