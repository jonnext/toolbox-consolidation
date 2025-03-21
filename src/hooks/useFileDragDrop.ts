import { useState, useEffect, useRef, DragEvent } from "react";

interface FileDragDropConfig {
  maxSizeMB?: number;
  acceptedFileTypes?: string[];
  onFileSelect?: (file: File) => void;
}

export interface UploadingFile {
  name: string;
  size: number;
  progress: number;
  type: string;
}

export const useFileDragDrop = ({
  maxSizeMB = 5,
  acceptedFileTypes = ["image/png", "image/jpeg", "image/jpg"],
  onFileSelect,
}: FileDragDropConfig = {}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFile, setUploadingFile] = useState<UploadingFile | null>(
    null
  );
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout>();

  // Clean up resources when the component unmounts
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length) {
      validateAndProcessFile(files[0]);
    }
  };

  const validateAndProcessFile = (file: File) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File size should be less than ${maxSizeMB}MB`);
      return false;
    }

    if (!acceptedFileTypes.includes(file.type)) {
      alert("Invalid file type");
      return false;
    }

    if (file.type.startsWith("image/")) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    setUploadingFile({
      name: file.name,
      size: file.size,
      progress: 0,
      type: file.type.split("/")[1].toUpperCase(),
    });

    // Simulate upload progress
    let progress = 0;
    progressIntervalRef.current = setInterval(() => {
      progress += 5;
      if (progress <= 100) {
        setUploadingFile((prev) => (prev ? { ...prev, progress } : null));
        if (progress === 100) {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
          }
          onFileSelect?.(file);
        }
      }
    }, 300);

    return true;
  };

  const cancelUpload = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    setUploadingFile(null);
  };

  return {
    isDragging,
    uploadingFile,
    imagePreview,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    validateAndProcessFile,
    cancelUpload,
    formatFileSize,
  };
};
