"use client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
    Eye,
    ImageIcon,
    ImagePlus,
    Plus,
    Save,
    Trash2,
    Upload,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export default function OcrDocumentTab() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("upload");
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isOcrLoading, setIsOcrLoading] = useState(false);

    const handleFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const selectedFile = e.target.files?.[0];
            if (selectedFile) {
                if (!selectedFile.type.startsWith("image/")) {
                    toast.error("Vui lòng chỉ tải lên hình ảnh");
                    return;
                }

                setFile(selectedFile);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result as string);
                };
                reader.readAsDataURL(selectedFile);

                const fileName = selectedFile.name.replace(/\.[^/.]+$/, "");
                setTitle(fileName);
            }
        },
        []
    );

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();

        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
            // Check if file is an image
            if (!droppedFile.type.startsWith("image/")) {
                toast.error("Vui lòng chỉ tải lên hình ảnh");
                return;
            }
            setFile(droppedFile);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(droppedFile);

            const fileName = droppedFile.name.replace(/\.[^/.]+$/, "");
            setTitle(fileName);
        }
    }, []);

    const performOCR = async () => {
        if (!file) {
            toast.error("Vui lòng chọn một hình ảnh trước khi thực hiện OCR");
            return;
        }

        setIsOcrLoading(true);
        try {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            const base64Image = await new Promise((resolve) => {
                reader.onloadend = () => resolve(reader.result);
            });

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_OCR_API_URL}/ocr`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        image_url: base64Image,
                    }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                setContent(data.response_message);
                toast.success(
                    "OCR thành công! Nội dung đã được thêm vào trường nội dung."
                );
            } else {
                toast.error(
                    `Lỗi OCR: ${response.status} ${response.statusText}`
                );
            }
        } catch (error) {
            toast.error(`Lỗi OCR:`);
        } finally {
            setIsOcrLoading(false);
        }
    };
    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }, []);

    const handleSubmit = async () => {
        if (!file || !title) {
            toast.error("Vui lòng chọn file và nhập tiêu đề");
            return;
        }
        setIsUploading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));

            toast.success("Tải lên tài liệu thành công");

            router.push("/dashboard");
        } catch (error) {
            toast.error("Tải lên tài liệu thất bại");
        } finally {
            setIsUploading(false);
        }
    };

    const resetForm = () => {
        setFile(null);
        setPreview(null);
        setTitle("");
        setDescription("");
        setTags("");
        setIsPrivate(false);
    };
    return (
        <Card>
            <CardHeader>
                <CardTitle>OCR</CardTitle>
                <CardDescription>Nhận diện văn bản từ hình ảnh</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="space-y-4"
                >
                    <TabsList>
                        <TabsTrigger value="upload">
                            <Upload className="h-4 w-4 mr-2" />
                            Tải lên
                        </TabsTrigger>
                        <TabsTrigger value="edit" disabled={!file}>
                            <ImageIcon className="h-4 w-4 mr-2" />
                            Chỉnh sửa thông tin
                        </TabsTrigger>
                        <TabsTrigger value="preview" disabled={!file}>
                            <Eye className="h-4 w-4 mr-2" />
                            Xem trước
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Chọn ảnh</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div
                                    className="border-2 border-dashed rounded-lg p-12 text-center hover:bg-slate-50 transition-colors cursor-pointer"
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onClick={() =>
                                        document
                                            .getElementById("image-upload")
                                            ?.click()
                                    }
                                >
                                    {!file ? (
                                        <div className="flex flex-col items-center">
                                            <ImagePlus className="h-12 w-12 text-slate-400 mb-4" />
                                            <h3 className="text-lg font-medium mb-2">
                                                Kéo thả ảnh vào đây
                                            </h3>
                                            <p className="text-sm text-muted-foreground mb-4">
                                                hoặc click để chọn file
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Hỗ trợ JPG, PNG, GIF, WEBP (tối
                                                đa 10MB)
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <div className="relative w-64 h-64 mb-4">
                                                <Image
                                                    src={
                                                        preview ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt="Preview"
                                                    className="w-full h-full object-contain"
                                                    width={210}
                                                    height={297}
                                                />
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute top-0 right-0"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        resetForm();
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <p className="text-sm font-medium">
                                                {file.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {(
                                                    file.size /
                                                    1024 /
                                                    1024
                                                ).toFixed(2)}{" "}
                                                MB
                                            </p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        id="image-upload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button
                                    variant="ghost"
                                    onClick={resetForm}
                                    disabled={!file}
                                >
                                    Xóa
                                </Button>
                                <Button
                                    onClick={() => setActiveTab("edit")}
                                    disabled={!file}
                                >
                                    Tiếp tục
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="edit" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin ảnh</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
                                    {/* Preview */}
                                    <div className="flex flex-col items-center">
                                        <div className="w-full aspect-square bg-slate-50 rounded-md overflow-hidden mb-2">
                                            <Image
                                                src={
                                                    preview ||
                                                    "/placeholder.svg"
                                                }
                                                alt="Preview"
                                                className="w-full h-full object-contain"
                                                width={315}
                                                height={445}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground text-center">
                                            {file?.name}
                                            <br />
                                            {file &&
                                                (
                                                    file.size /
                                                    1024 /
                                                    1024
                                                ).toFixed(2)}{" "}
                                            MB
                                        </p>
                                    </div>

                                    {/* Form */}
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="title">
                                                Tiêu đề{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="title"
                                                value={title}
                                                onChange={(e) =>
                                                    setTitle(e.target.value)
                                                }
                                                placeholder="Nhập tiêu đề ảnh"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="description">
                                                Mô tả
                                            </Label>
                                            <Textarea
                                                id="description"
                                                value={description}
                                                onChange={(e) =>
                                                    setDescription(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Nhập mô tả cho ảnh"
                                            />
                                        </div>
                                        <Button
                                            onClick={performOCR}
                                            disabled={isOcrLoading || !file}
                                            className="w-full"
                                        >
                                            {isOcrLoading ? (
                                                <>Đang xử lý OCR...</>
                                            ) : (
                                                <>
                                                    <ImageIcon className="h-4 w-4 mr-2" />
                                                    OCR tài liệu
                                                </>
                                            )}
                                        </Button>
                                        <div className="space-y-2">
                                            <Label htmlFor="content">
                                                Nội dung
                                            </Label>
                                            <Textarea
                                                id="content"
                                                value={content}
                                                onChange={(e) =>
                                                    setContent(e.target.value)
                                                }
                                                placeholder="Nhập nội dung cho ảnh"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="tags">Tags</Label>
                                            <Input
                                                id="tags"
                                                value={tags}
                                                onChange={(e) =>
                                                    setTags(e.target.value)
                                                }
                                                placeholder="Nhập tags, phân cách bằng dấu phẩy"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Ví dụ: mạng máy tính, sơ đồ, học
                                                tập
                                            </p>
                                        </div>

                                        <div className="space-y-2"></div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button
                                    variant="outline"
                                    onClick={() => setActiveTab("upload")}
                                >
                                    Quay lại
                                </Button>
                                <Button
                                    onClick={() => setActiveTab("preview")}
                                    disabled={!title}
                                >
                                    Xem trước
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="preview" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Xem trước</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white rounded-md p-4 shadow-sm">
                                        <div className="bg-slate-50 rounded-md overflow-hidden mb-4">
                                            <Image
                                                src={
                                                    preview ||
                                                    "/placeholder.svg"
                                                }
                                                alt={title}
                                                className="w-full h-w-full object-contain"
                                                width={315}
                                                height={445}
                                            />
                                        </div>
                                        <h3 className="text-lg font-medium mb-1">
                                            {title}
                                        </h3>
                                        {description && (
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {description}
                                            </p>
                                        )}

                                        {tags && (
                                            <div className="flex flex-wrap gap-1 mb-2">
                                                {tags
                                                    .split(",")
                                                    .map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200/80"
                                                        >
                                                            {tag.trim()}
                                                        </span>
                                                    ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-sm font-medium mb-2">
                                                Thông tin tải lên
                                            </h3>
                                            <div className="bg-slate-50 rounded-md p-4 space-y-2">
                                                <p className="text-sm">
                                                    <strong>Tên file:</strong>{" "}
                                                    {file?.name}
                                                </p>
                                                <p className="text-sm">
                                                    <strong>Loại file:</strong>{" "}
                                                    {file?.type}
                                                </p>
                                                <p className="text-sm">
                                                    <strong>Kích thước:</strong>{" "}
                                                    {file &&
                                                        (
                                                            file.size /
                                                            1024 /
                                                            1024
                                                        ).toFixed(2)}{" "}
                                                    MB
                                                </p>
                                                <p className="text-sm">
                                                    <strong>
                                                        Quyền truy cập:
                                                    </strong>{" "}
                                                    {"Riêng tư"}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium mb-2">
                                                Xác nhận tải lên
                                            </h3>
                                            <p className="text-sm text-muted-foreground mb-4">
                                                Vui lòng kiểm tra lại thông tin
                                                trước khi tải lên. Bạn có thể
                                                chỉnh sửa thông tin bằng cách
                                                quay lại tab "Chỉnh sửa thông
                                                tin".
                                            </p>
                                            <div className="flex flex-col gap-2">
                                                <Button
                                                    onClick={handleSubmit}
                                                    disabled={isUploading}
                                                    className="w-full"
                                                >
                                                    {isUploading ? (
                                                        <>Đang tải lên...</>
                                                    ) : (
                                                        <>
                                                            <Save className="h-4 w-4 mr-2" />
                                                            Tải lên tài liệu
                                                        </>
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() =>
                                                        setActiveTab("edit")
                                                    }
                                                    disabled={isUploading}
                                                    className="w-full"
                                                >
                                                    Quay lại chỉnh sửa
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
