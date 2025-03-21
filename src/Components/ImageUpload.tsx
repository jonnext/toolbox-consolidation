import React, { useRef, useState } from "react";
import {
  Camera,
  Upload,
  X,
  AlertCircle,
  File,
  XCircle,
  MessageCircle,
} from "lucide-react";
import FlipBackwardIcon from "../assets/Buttons/flip-backward.svg";
import MessageQuestionCircle from "../assets/Buttons/message-question-circle.svg";
import CheckWhite from "../assets/Buttons/check-white.svg";
import { Button, Tooltip } from "./UI";
import { useFileDragDrop, UploadingFile } from "../hooks/useFileDragDrop";
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE_MB } from "../constants";
import "./ImageUpload.css";

interface FileUploadProps {
  onFileSelect?: (file: File) => void;
  maxSizeMB?: number;
  acceptedFileTypes?: string[];
}

const ImageUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  maxSizeMB = MAX_FILE_SIZE_MB,
  acceptedFileTypes = [...ACCEPTED_FILE_TYPES],
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isReturned, setIsReturned] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    isDragging,
    uploadingFile,
    imagePreview,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    validateAndProcessFile,
    cancelUpload,
    formatFileSize,
  } = useFileDragDrop({
    maxSizeMB,
    acceptedFileTypes,
    onFileSelect: (file) => {
      setIsActive(true);
      onFileSelect?.(file);
    },
  });

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      validateAndProcessFile(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmission = () => {
    setIsCompleted(true);
  };

  const handleReturnToLater = () => {
    setIsReturned(true);
    setIsFocused(false);
  };

  const handleResetFromReview = () => {
    setIsReturned(false);
    setIsFocused(true);
  };

  const renderUploadState = () => {
    if (isCompleted) {
      return (
        <div className="w-full">
          <div className="flex items-center px-4 py-3 border border-green-100 rounded-lg bg-green-50">
            <div className="flex-1">
              <span className="text-[#027A48] font-medium text-sm">
                File uploaded successfully!
              </span>
            </div>
            <button
              className="ml-4 text-[#027A48]"
              onClick={() => setIsCompleted(false)}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      );
    }

    if (isReturned) {
      return (
        <div className="w-full">
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center text-gray-500 text-sm">
              <AlertCircle size={16} className="mr-2" />
              You'll complete this task later
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleResetFromReview}
            >
              Complete now
            </Button>
          </div>
        </div>
      );
    }

    if (uploadingFile) {
      return (
        <div className="w-full">
          <div className="flex items-center px-4 py-3 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center flex-1">
              <div className="p-2 bg-gray-100 rounded mr-3">
                <File size={16} className="text-gray-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-gray-700">
                    {uploadingFile.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatFileSize(uploadingFile.size)}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2">
                  <div
                    className={`h-1.5 rounded-full ${
                      uploadingFile.progress === 100
                        ? "bg-green-500"
                        : "bg-blue-500"
                    }`}
                    style={{ width: `${uploadingFile.progress}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">
                    {uploadingFile.progress}%
                  </span>
                  <button
                    onClick={cancelUpload}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XCircle size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="p-3 bg-gray-100 rounded-full mb-4">
          <Upload className="w-6 h-6 text-gray-500" />
        </div>
        <p className="text-sm font-medium text-gray-700 mb-1">
          {isDragging ? "Drop your file here" : "Upload a file"}
        </p>
        <p className="text-xs text-gray-500 mb-3">
          Drag and drop or click to browse
        </p>
        <p className="text-xs text-gray-400">
          Maximum size: {maxSizeMB}MB (PNG, JPG, PDF, MP4, MP3)
        </p>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full h-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        accept={acceptedFileTypes.join(",")}
        className="hidden"
      />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-medium text-gray-900">
            Upload your first document
          </h2>
          <Tooltip message="Learn more about this task">
            <button className="text-gray-400 hover:text-gray-500">
              <MessageCircle className="w-5 h-5" />
            </button>
          </Tooltip>
        </div>

        {isActive && !isCompleted && !isReturned ? (
          <div className="flex gap-2">
            <Tooltip message="Return to this task later">
              <button
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100"
                onClick={handleReturnToLater}
              >
                <img src={FlipBackwardIcon} alt="Return to later" />
              </button>
            </Tooltip>

            <Button
              variant="primary"
              size="md"
              onClick={handleSubmission}
              leftIcon={<img src={CheckWhite} alt="Complete" />}
            >
              Complete
            </Button>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col mb-4">
        {renderUploadState()}
        {imagePreview && uploadingFile?.progress === 100 && !isCompleted && (
          <div className="mt-4 rounded-lg overflow-hidden shadow-sm">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
