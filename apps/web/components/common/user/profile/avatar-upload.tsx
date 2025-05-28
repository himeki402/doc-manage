import { useState, useRef } from "react";
import { Camera, Check, Upload, X } from "lucide-react";

interface AvatarUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (file: File) => Promise<void>;
}

export default function AvatarUploadModal({ isOpen, onClose, onUpload }: AvatarUploadModalProps) {
    const [isDragOver, setIsDragOver] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.currentTarget === e.target) {
            setIsDragOver(false);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const validateFile = (file: File): boolean => {
        if (!file.type.startsWith('image/')) {
            alert('Vui lòng chọn file ảnh hợp lệ');
            return false;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB
            alert('Kích thước file không được vượt quá 5MB');
            return false;
        }
        return true;
    };

    const handleFileSelect = (file: File) => {
        if (!validateFile(file)) return;

        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            if (e.target?.result) {
                setPreviewUrl(e.target.result as string);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0 && files[0]) {
            handleFileSelect(files[0]);
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        try {
            await onUpload(selectedFile);
            onClose();
            resetModal();
        } catch (error) {
            console.error('Lỗi khi tải lên ảnh:', error);
            alert('Có lỗi xảy ra khi tải lên ảnh. Vui lòng thử lại.');
        } finally {
            setIsUploading(false);
        }
    };

    const resetModal = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setIsDragOver(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleClose = () => {
        if (!isUploading) {
            resetModal();
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Camera className="h-5 w-5 text-blue-500" />
                        Tải lên ảnh đại diện
                    </h2>
                    <button
                        onClick={handleClose}
                        disabled={isUploading}
                        className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {!selectedFile ? (
                        /* Upload Area */
                        <div
                            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer ${
                                isDragOver
                                    ? 'border-blue-500 bg-blue-50 scale-105'
                                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                            }`}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className={`transition-all duration-300 ${isDragOver ? 'scale-110' : ''}`}>
                                <Upload className={`h-12 w-12 mx-auto mb-4 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
                                <h3 className="text-lg font-medium text-gray-700 mb-2">
                                    {isDragOver ? 'Thả file ảnh vào đây' : 'Kéo thả ảnh vào đây'}
                                </h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    hoặc <span className="text-blue-500 font-medium">click để chọn file</span>
                                </p>
                                <p className="text-xs text-gray-400">
                                    Hỗ trợ: JPG, PNG, GIF (Tối đa 5MB)
                                </p>
                            </div>

                            {isDragOver && (
                                <div className="absolute inset-0 bg-blue-500 bg-opacity-10 rounded-lg flex items-center justify-center">
                                    <div className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium">
                                        Thả file tại đây
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Preview Area */
                        <div className="space-y-4">
                            <div className="relative mx-auto w-48 h-48 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg">
                                <img
                                    src={previewUrl ?? ''}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                                    <button
                                        onClick={() => {
                                            setSelectedFile(null);
                                            setPreviewUrl(null);
                                        }}
                                        className="opacity-0 hover:opacity-100 bg-red-500 text-white p-2 rounded-full transition-all duration-300"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="text-center">
                                <p className="text-sm font-medium text-gray-700">{selectedFile.name}</p>
                                <p className="text-xs text-gray-500">
                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Chọn ảnh khác
                            </button>
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileInputChange}
                        className="hidden"
                    />
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={handleClose}
                        disabled={isUploading}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={!selectedFile || isUploading}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isUploading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Đang tải lên...
                            </>
                        ) : (
                            <>
                                <Check className="h-4 w-4" />
                                Tải lên
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}