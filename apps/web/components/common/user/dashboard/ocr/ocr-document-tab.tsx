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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { OCR_ENDPOINT } from "@/lib/constants";
import { useDashboardContext } from "@/contexts/dashboardContext";
import { AccessType } from "@/lib/types/document";
import {
    Eye,
    ImageIcon,
    ImagePlus,
    Plus,
    Save,
    Trash2,
    Upload,
    Check,
    X,
    Tag,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import documentApi from "@/lib/apis/documentApi";

export default function OcrDocumentTab() {
    const router = useRouter();
    const { categories, groups, tags } = useDashboardContext();
    const [activeTab, setActiveTab] = useState("upload");
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [accessType, setAccessType] = useState<AccessType>("PRIVATE");
    const [groupId, setGroupId] = useState<string>("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
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

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }, []);

    const handleAddTag = () => {
        const trimmedInput = tagInput.trim();
        if (!trimmedInput) return;

        const tag = tags.find(
            (t) => t.name.toLowerCase() === trimmedInput.toLowerCase()
        );
        if (tag && !selectedTags.includes(tag.id)) {
            setSelectedTags([...selectedTags, tag.id]);
            setTagInput("");
            setErrors((prev) => ({ ...prev, tags: "" }));
        } else {
            setErrors((prev) => ({
                ...prev,
                tags: tag ? "Thẻ đã được chọn" : "Thẻ không tồn tại",
            }));
        }
    };

    const handleRemoveTag = (tagId: string) => {
        setSelectedTags(selectedTags.filter((id) => id !== tagId));
    };

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

            const response = await fetch(`${OCR_ENDPOINT}/ocr`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    image_url: base64Image,
                }),
            });

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

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!file) newErrors.file = "Vui lòng chọn hình ảnh";
        if (!title.trim()) newErrors.title = "Tiêu đề là bắt buộc";
        if (!description.trim()) newErrors.description = "Mô tả là bắt buộc";
        if (!categoryId) newErrors.category = "Vui lòng chọn danh mục";
        if (accessType === "GROUP" && !groupId)
            newErrors.groupId = "Vui lòng chọn nhóm";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error("Vui lòng điền đầy đủ thông tin");
            return;
        }

        setIsUploading(true);
        try {
            const formDataToSend = new FormData();

            if (file) {
                formDataToSend.append("file", file);
            }
            formDataToSend.append("title", title.trim());
            formDataToSend.append("description", description.trim());
            formDataToSend.append("accessType", accessType);
            formDataToSend.append("categoryId", categoryId);
            if (selectedTags.length > 0) {
                selectedTags.forEach((tagId) => {
                    formDataToSend.append("tagIds[]", tagId);
                });
            }
            if (accessType === "GROUP" && groupId) {
                formDataToSend.append("groupId", groupId);
            }
            const newDocument =
                await documentApi.uploadImageDocument(formDataToSend);
            if (!newDocument) {
                throw new Error("Không thể tạo tài liệu");
            }
            toast.success("Tài liệu đã được tải lên thành công");
        } catch (error: any) {
            console.error("Error uploading document:", error);
            toast.error(
                error.response?.data?.message || "Không thể tải lên tài liệu"
            );
        } finally {
            setIsUploading(false);
        }
    };

    const resetForm = () => {
        setFile(null);
        setPreview(null);
        setTitle("");
        setDescription("");
        setContent("");
        setCategoryId("");
        setSelectedTags([]);
        setTagInput("");
        setAccessType("PRIVATE");
        setGroupId("");
        setErrors({});
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold mb-2">Tải lên tài liệu ảnh</h2>
                <p className="text-muted-foreground">
                    Tải lên và quản lý tài liệu học tập của bạn
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>OCR</CardTitle>
                    <CardDescription>
                        Nhận diện văn bản từ hình ảnh
                    </CardDescription>
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
                                                    Hỗ trợ JPG, PNG, GIF, WEBP
                                                    (tối đa 10MB)
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
                                    <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
                                        <div className="flex flex-col items-center">
                                            <div className="w-full aspect-square bg-slate-50 rounded-md overflow-hidden mb-2">
                                                <Image
                                                    src={
                                                        preview ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt="Preview"
                                                    className="w-full h-full object-contain"
                                                    width={200}
                                                    height={200}
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

                                        <div className="space-y-4">
                                            {/* Title */}
                                            <div className="space-y-2">
                                                <Label htmlFor="title">
                                                    Tiêu đề
                                                </Label>
                                                <Input
                                                    id="title"
                                                    value={title}
                                                    onChange={(e) =>
                                                        setTitle(e.target.value)
                                                    }
                                                    placeholder="Nhập tiêu đề tài liệu"
                                                    required
                                                />
                                                {errors.title && (
                                                    <p className="text-sm text-destructive">
                                                        {errors.title}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Description */}
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
                                                    placeholder="Nhập mô tả về tài liệu"
                                                    rows={3}
                                                />
                                                {errors.description && (
                                                    <p className="text-sm text-destructive">
                                                        {errors.description}
                                                    </p>
                                                )}
                                            </div>

                                            {/* OCR Button */}
                                            <div className="space-y-2">
                                                <Label>Nhận diện văn bản</Label>
                                                <Button
                                                    onClick={performOCR}
                                                    disabled={
                                                        isOcrLoading || !file
                                                    }
                                                    className="w-full"
                                                    variant="outline"
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
                                            </div>

                                            {/* Content */}
                                            <div className="space-y-2">
                                                <Label htmlFor="content">
                                                    Nội dung
                                                </Label>
                                                <Textarea
                                                    id="content"
                                                    value={content}
                                                    className="min-h-[150px]"
                                                    onChange={(e) =>
                                                        setContent(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Nội dung từ OCR sẽ hiển thị ở đây hoặc bạn có thể nhập thủ công"
                                                />
                                            </div>

                                            {/* Category and Tags */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="category">
                                                        Danh mục
                                                    </Label>
                                                    <Select
                                                        value={categoryId}
                                                        onValueChange={
                                                            setCategoryId
                                                        }
                                                    >
                                                        <SelectTrigger id="category">
                                                            <SelectValue placeholder="Chọn danh mục" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {categories.map(
                                                                (category) => (
                                                                    <SelectItem
                                                                        key={
                                                                            category.id
                                                                        }
                                                                        value={
                                                                            category.id
                                                                        }
                                                                    >
                                                                        {
                                                                            category.name
                                                                        }
                                                                    </SelectItem>
                                                                )
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.category && (
                                                        <p className="text-sm text-destructive">
                                                            {errors.category}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="tags">
                                                        Thẻ
                                                    </Label>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            id="tags"
                                                            value={tagInput}
                                                            onChange={(e) => {
                                                                setTagInput(
                                                                    e.target
                                                                        .value
                                                                );
                                                                setErrors(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        tags: "",
                                                                    })
                                                                );
                                                            }}
                                                            placeholder="Nhập tên thẻ"
                                                            onKeyDown={(e) => {
                                                                if (
                                                                    e.key ===
                                                                    "Enter"
                                                                ) {
                                                                    e.preventDefault();
                                                                    handleAddTag();
                                                                }
                                                            }}
                                                        />
                                                        <Button
                                                            type="button"
                                                            onClick={
                                                                handleAddTag
                                                            }
                                                            disabled={
                                                                !tagInput.trim()
                                                            }
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    {errors.tags && (
                                                        <p className="text-sm text-destructive">
                                                            {errors.tags}
                                                        </p>
                                                    )}

                                                    {/* Available tags */}
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {tags.map((tag) => (
                                                            <Badge
                                                                key={tag.id}
                                                                variant={
                                                                    selectedTags.includes(
                                                                        tag.id
                                                                    )
                                                                        ? "default"
                                                                        : "outline"
                                                                }
                                                                className="cursor-pointer"
                                                                onClick={() => {
                                                                    if (
                                                                        selectedTags.includes(
                                                                            tag.id
                                                                        )
                                                                    ) {
                                                                        setSelectedTags(
                                                                            selectedTags.filter(
                                                                                (
                                                                                    id
                                                                                ) =>
                                                                                    id !==
                                                                                    tag.id
                                                                            )
                                                                        );
                                                                    } else {
                                                                        setSelectedTags(
                                                                            [
                                                                                ...selectedTags,
                                                                                tag.id,
                                                                            ]
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                {tag.name}
                                                            </Badge>
                                                        ))}
                                                    </div>

                                                    {/* Selected tags */}
                                                    {selectedTags.length >
                                                        0 && (
                                                        <div className="mt-2">
                                                            <Label>
                                                                Thẻ đã chọn
                                                            </Label>
                                                            <div className="flex flex-wrap gap-2 mt-1">
                                                                {selectedTags.map(
                                                                    (tagId) => {
                                                                        const tag =
                                                                            tags.find(
                                                                                (
                                                                                    t
                                                                                ) =>
                                                                                    t.id ===
                                                                                    tagId
                                                                            );
                                                                        return (
                                                                            <Badge
                                                                                key={
                                                                                    tagId
                                                                                }
                                                                                variant="secondary"
                                                                                className="flex items-center gap-1"
                                                                            >
                                                                                {tag?.name ||
                                                                                    tagId}
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    className="h-4 w-4 rounded-full p-0 ml-1"
                                                                                    onClick={() =>
                                                                                        handleRemoveTag(
                                                                                            tagId
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <span className="sr-only">
                                                                                        Xóa
                                                                                    </span>

                                                                                    ×
                                                                                </Button>
                                                                            </Badge>
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Access Type */}
                                            <div className="space-y-2">
                                                <Label>Quyền truy cập</Label>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    <div
                                                        className={`flex items-center gap-2 p-3 rounded-md border cursor-pointer ${
                                                            accessType ===
                                                            "PRIVATE"
                                                                ? "border-primary bg-primary/5"
                                                                : "border-input"
                                                        }`}
                                                        onClick={() =>
                                                            setAccessType(
                                                                "PRIVATE"
                                                            )
                                                        }
                                                    >
                                                        <div
                                                            className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                                                accessType ===
                                                                "PRIVATE"
                                                                    ? "bg-primary"
                                                                    : "border border-input"
                                                            }`}
                                                        >
                                                            {accessType ===
                                                                "PRIVATE" && (
                                                                <Check className="h-3 w-3 text-primary-foreground" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium">
                                                                Riêng tư
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                Chỉ bạn mới có
                                                                thể xem
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className={`flex items-center gap-2 p-3 rounded-md border cursor-pointer ${
                                                            accessType ===
                                                            "GROUP"
                                                                ? "border-primary bg-primary/5"
                                                                : "border-input"
                                                        }`}
                                                        onClick={() =>
                                                            setAccessType(
                                                                "GROUP"
                                                            )
                                                        }
                                                    >
                                                        <div
                                                            className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                                                accessType ===
                                                                "GROUP"
                                                                    ? "bg-primary"
                                                                    : "border border-input"
                                                            }`}
                                                        >
                                                            {accessType ===
                                                                "GROUP" && (
                                                                <Check className="h-3 w-3 text-primary-foreground" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium">
                                                                Nhóm
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                Chỉ nhóm được
                                                                chọn
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Group Selection */}
                                            {accessType === "GROUP" && (
                                                <div className="space-y-2">
                                                    <Label htmlFor="group">
                                                        Nhóm{" "}
                                                        <span className="text-red-500">
                                                            *
                                                        </span>
                                                    </Label>
                                                    <Select
                                                        value={groupId}
                                                        onValueChange={(
                                                            value
                                                        ) => {
                                                            setGroupId(value);
                                                            setErrors(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    groupId: "",
                                                                })
                                                            );
                                                        }}
                                                    >
                                                        <SelectTrigger id="group">
                                                            <SelectValue placeholder="Chọn nhóm" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {groups.map(
                                                                (group) => (
                                                                    <SelectItem
                                                                        key={
                                                                            group.id
                                                                        }
                                                                        value={
                                                                            group.id
                                                                        }
                                                                    >
                                                                        {
                                                                            group.name
                                                                        }
                                                                    </SelectItem>
                                                                )
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.groupId && (
                                                        <p className="text-red-500 text-sm">
                                                            {errors.groupId}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
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
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="text-sm font-medium mb-2">
                                                    Thông tin tải lên
                                                </h3>
                                                <div className="bg-slate-50 rounded-md p-4 space-y-2">
                                                    <p className="text-sm">
                                                        <strong>
                                                            Tên file:
                                                        </strong>{" "}
                                                        {file?.name}
                                                    </p>
                                                    <p className="text-sm">
                                                        <strong>
                                                            Tiêu đề:
                                                        </strong>{" "}
                                                        {title ||
                                                            "Chưa đặt tiêu đề"}
                                                    </p>
                                                    {description && (
                                                        <p className="text-sm">
                                                            <strong>
                                                                Mô tả:
                                                            </strong>{" "}
                                                            {description}
                                                        </p>
                                                    )}
                                                    {content && (
                                                        <div className="mt-4">
                                                            <h4 className="text-sm font-medium mb-2">
                                                                Nội dung OCR:
                                                            </h4>
                                                            <div className="bg-slate-50 rounded-md p-3 text-sm max-h-40 overflow-y-auto">
                                                                {content}
                                                            </div>
                                                        </div>
                                                    )}
                                                    <p className="text-sm">
                                                        <strong>
                                                            Loại file:
                                                        </strong>{" "}
                                                        {file?.type}
                                                    </p>
                                                    <p className="text-sm">
                                                        <strong>
                                                            Kích thước:
                                                        </strong>{" "}
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
                                                            Danh mục:
                                                        </strong>{" "}
                                                        {categories.find(
                                                            (c) =>
                                                                c.id ===
                                                                categoryId
                                                        )?.name ||
                                                            "Chưa phân loại"}
                                                    </p>
                                                    {selectedTags.length >
                                                        0 && (
                                                        <div className="flex flex-wrap gap-1 mb-2 text-sm">
                                                            <strong>
                                                                Thẻ:
                                                            </strong>{" "}
                                                            {selectedTags.map(
                                                                (tagId) => {
                                                                    const tag =
                                                                        tags.find(
                                                                            (
                                                                                t
                                                                            ) =>
                                                                                t.id ===
                                                                                tagId
                                                                        );
                                                                    return (
                                                                        <Badge
                                                                            key={
                                                                                tagId
                                                                            }
                                                                            variant="secondary"
                                                                            className="flex items-center gap-1"
                                                                        >
                                                                            <Tag className="h-3 w-3" />
                                                                            {tag?.name ||
                                                                                tagId}
                                                                        </Badge>
                                                                    );
                                                                }
                                                            )}
                                                        </div>
                                                    )}
                                                    <p className="text-sm">
                                                        <strong>
                                                            Quyền truy cập:
                                                        </strong>{" "}
                                                        {accessType ===
                                                        "PRIVATE"
                                                            ? "Riêng tư"
                                                            : "Nhóm"}
                                                    </p>
                                                    {accessType === "GROUP" &&
                                                        groupId && (
                                                            <p className="text-sm">
                                                                <strong>
                                                                    Nhóm:
                                                                </strong>{" "}
                                                                {
                                                                    groups.find(
                                                                        (g) =>
                                                                            g.id ===
                                                                            groupId
                                                                    )?.name
                                                                }
                                                            </p>
                                                        )}
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-medium mb-2">
                                                    Xác nhận tải lên
                                                </h3>
                                                <p className="text-sm text-muted-foreground mb-4">
                                                    Vui lòng kiểm tra lại thông
                                                    tin trước khi tải lên. Bạn
                                                    có thể chỉnh sửa thông tin
                                                    bằng cách quay lại tab
                                                    "Chỉnh sửa thông tin".
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
        </div>
    );
}
