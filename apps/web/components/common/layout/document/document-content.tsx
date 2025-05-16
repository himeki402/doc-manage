"use client";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Document as DocumentType } from "@/lib/types/document";
import { useState, useRef, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import debounce from "lodash.debounce";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

const DOCUMENT_OPTIONS = {
    disableAutoFetch: false,
    disableStream: false,
    disableRange: false,
    cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
    standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
    cMapPacked: true,
};

interface DocumentContentProps {
    document: DocumentType;
}

export function DocumentContent({ document }: DocumentContentProps) {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [highlightedPages, setHighlightedPages] = useState<number[]>([]);
    const [inputPage, setInputPage] = useState<string>("1");
    const [isSearching, setIsSearching] = useState(false);
    const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
    const observer = useRef<IntersectionObserver | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const textContents = useRef<string[]>([]);

    const onDocumentLoadSuccess = async ({
        numPages,
    }: {
        numPages: number;
    }) => {
        setNumPages(numPages);
        setPageNumber(1);
        setInputPage("1");
        pageRefs.current = Array(numPages).fill(null);
        try {
            const loadingTask = pdfjs.getDocument({
                url: document.fileUrl,
                ...DOCUMENT_OPTIONS,
            });
            const pdf = await loadingTask.promise;
            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent({
                    disableNormalization: false,
                });
                textContents.current[i - 1] = textContent.items
                    .map((item: any) => item.str)
                    .join(" ");
            }
        } catch (error) {
            console.error("Error loading text content:", error);
        }
    };

    const onDocumentLoadError = (error: Error) => {
        console.error("Error while loading PDF:", error);
    };

    const searchInPDF = async () => {
        if (!searchText || !document.fileUrl || !numPages) return;

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        setIsSearching(true);

        try {
            const matchedPages: number[] = [];
            for (let i = 0; i < textContents.current.length; i++) {
                if (signal.aborted) {
                    console.log("Search was aborted");
                    break;
                }

                const text = textContents.current[i];
                if (
                    text &&
                    text.toLowerCase().includes(searchText.toLowerCase())
                ) {
                    matchedPages.push(i + 1);
                }
            }

            setHighlightedPages(matchedPages);
            if (matchedPages.length > 0) {
                const page = matchedPages[0];
                if (typeof page === "number") {
                    setPageNumber(page);
                    setInputPage(page.toString());
                    if (pageRefs.current[page - 1]) {
                        pageRefs.current[page - 1]?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                        });
                    }
                }
            } else {
                alert("Không tìm thấy văn bản: " + searchText);
                setHighlightedPages([]);
            }
        } catch (error: any) {
            if (error.name === "AbortError") {
                console.log("Search was aborted");
            } else {
                console.error("Error searching in PDF:", error);
                alert("Lỗi khi tìm kiếm trong PDF. Vui lòng thử lại.");
            }
        } finally {
            setIsSearching(false);
        }
    };

    const debouncedSearch = useMemo(
        () => debounce(searchInPDF, 500),
        [searchText, document.fileUrl, numPages]
    );

    const handlePageInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const newPage = parseInt(inputPage) || 1;
            const validPage = Math.max(1, Math.min(newPage, numPages || 1));
            setPageNumber(validPage);
            setInputPage(validPage.toString());
            if (pageRefs.current[validPage - 1]) {
                pageRefs.current[validPage - 1]?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        }
    };

    const downloadPDF = () => {
        // if (!document.fileUrl) return;
        // const link = document.createElement('a');
        // link.href = document.fileUrl;
        // link.download = document.fileName || 'document.pdf';
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);
    };

    useEffect(() => {
        if (!numPages || pageRefs.current.length === 0) return;

        observer.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const index = pageRefs.current.indexOf(
                        entry.target as HTMLDivElement
                    );
                    if (entry.isIntersecting && index >= 0) {
                        const newPage = index + 1;
                        setPageNumber(newPage);
                        setInputPage(newPage.toString());
                    }
                });
            },
            { threshold: 0.5 }
        );

        pageRefs.current.forEach((ref) => {
            if (ref) observer.current?.observe(ref);
        });

        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [numPages]);

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [debouncedSearch]);

    return (
        <div className="w-full h-full p-5">
            <div className="sticky top-14 bg-white z-10 p-6 border border-gray-300 flex justify-between items-center gap-2.5">
                <button
                    onClick={downloadPDF}
                    disabled={!document.fileUrl}
                    className={`px-4 py-2 rounded text-white border-none cursor-pointer ${
                        !document.fileUrl
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-green-600"
                    }`}
                >
                    Download
                </button>

                <div className="flex gap-2.5 items-center">
                    {numPages && (
                        <>
                            <input
                                type="number"
                                min="1"
                                max={numPages}
                                value={inputPage}
                                onChange={(e) => setInputPage(e.target.value)}
                                onKeyUp={handlePageInput}
                                className="w-15 p-2 border border-gray-300 rounded text-center appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                onWheel={(e) => e.currentTarget.blur()}
                                aria-label="Nhập số trang"
                            />
                            <span>/ {numPages}</span>
                        </>
                    )}
                </div>

                <div className="flex gap-2.5">
                    <div className="relative">
                        <input
                            type="text"
                            className="w-48 pl-3 pr-10 py-2 border border-gray-300 rounded"
                            placeholder="Tìm kiếm..."
                            onChange={(e) => setSearchText(e.target.value)}
                            value={searchText}
                            onKeyUp={(e) =>
                                e.key === "Enter" && debouncedSearch()
                            }
                            aria-label="Tìm kiếm văn bản trong PDF"
                        />
                        <Search
                            className={`absolute right-3 top-2.5 h-5 w-5 ${
                                isSearching
                                    ? "text-blue-600 animate-pulse"
                                    : "text-gray-400 hover:text-gray-600"
                            } cursor-pointer`}
                            onClick={debouncedSearch}
                        />
                    </div>
                </div>
            </div>

            {/* Nội dung PDF */}
            <div className="mt-2.5 border border-gray-300 rounded overflow-auto h-[calc(100%-70px)]">
                {document.fileUrl ? (
                    <Document
                        file={document.fileUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading={<div className="p-5">Đang tải PDF...</div>}
                        error={
                            <div className="p-5">
                                Lỗi khi tải PDF. Vui lòng thử lại.
                            </div>
                        }
                        options={DOCUMENT_OPTIONS}
                    >
                        {Array.from(
                            { length: numPages || 0 },
                            (_, i) => i + 1
                        ).map((page) => (
                            <div
                                key={page}
                                ref={(el) => {
                                    pageRefs.current[page - 1] = el;
                                }}
                                className="mb-5 pb-2.5 border-b border-gray-200"
                            >
                                <Page
                                    pageNumber={page}
                                    renderTextLayer={
                                        page === pageNumber ||
                                        highlightedPages.includes(page)
                                    }
                                    renderAnnotationLayer={true}
                                    width={Math.min(
                                        window.innerWidth - 40,
                                        800
                                    )}
                                    loading={
                                        <div className="p-4 text-gray-500">
                                            Đang tải trang {page}...
                                        </div>
                                    }
                                    customTextRenderer={(textItem: any) => {
                                        if (
                                             highlightedPages.includes(page) &&
                                                searchText
                                        ) {
                                            const regex = new RegExp(
                                                `(${searchText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
                                                "gi"
                                            );
                                            const parts =
                                                textItem.str.split(regex);
                                            return parts.map(
                                                    (part: string, index: number) =>
                                                        part.toLowerCase() ===
                                                        searchText.toLowerCase() ? (
                                                            <mark
                                                                key={index}
                                                                className="bg-yellow-300"
                                                            >
                                                                {part}
                                                            </mark>
                                                        ) : (
                                                            part
                                                        )
                                                );
                                        }
                                        return textItem.str;
                                    }}
                                />
                            </div>
                        ))}
                    </Document>
                ) : (
                    <div className="p-5">Không tìm thấy file PDF.</div>
                )}
            </div>
        </div>
    );
}
