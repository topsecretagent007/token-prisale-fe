"use client";

import React, { ChangeEvent, useRef, useState } from "react";
import { BsImage } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";

interface ImageUploadProps {
  header: string;
  setFilePreview: (filePreview: string | null) => void;
  type: string;
  setFileUrl: (fileUrl: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  header,
  setFilePreview,
  setFileUrl,
  type,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("No file selected");
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      const fileUrl = URL.createObjectURL(file);
      setImagePreviewUrl(fileUrl); // Set the preview URL
      setFilePreview(fileUrl); // Pass the file URL to the parent
      setFileUrl(fileUrl); // Pass the file URL to the parent
    } else {
      setSelectedFileName("No file selected");
      setImagePreviewUrl(null);
      setFilePreview(null);
      setFileUrl(null);
    }
  };

  const handleClearImage = () => {
    setSelectedFileName("No file selected");
    setImagePreviewUrl(null);
    setFilePreview(null);
    setFileUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input
    }
  };

  return (
    <div className="flex flex-col justify-between gap-6 w-full">
      <div className="flex flex-col justify-between items-start gap-2 w-full">
        <label className="flex flex-row gap-1 font-semibold text-[#090603] text-xs">{header}</label>
        <input
          type="file"
          accept={type}
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col justify-between items-center gap-2 p-3 border-[#E5E7EB] border-[1px] rounded-[8px] w-[200px] h-[200px] cursor-pointer"
        >
          {imagePreviewUrl && (
            <div className="flex flex-row justify-center items-center gap-2 w-full">
              <BsImage className="text-[#090603] text-xl" />
              <div className="bg-transparent w-full max-w-[135px] h-[18px] object-cover overflow-hidden text-[#090603] text-sm text-start break-words">
                {selectedFileName}
              </div>
              <IoMdClose
                className="text-[#C81928] text-xl cursor-pointer"
                onClick={handleClearImage}
              />
            </div>
          )}
          <div className="flex flex-col justify-center items-center w-[176px] h-[150px]">
            {imagePreviewUrl ? (
              <img
                src={imagePreviewUrl}
                alt="Preview"
                className="rounded-md w-full h-full object-contain"
              />
            ) : (
              <div className="flex flex-col justify-center items-center w-full h-full">
                <BsImage className="text-[#9CA3AF] text-xl" />
                <span className="text-[#9CA3AF] text-sm">Insert an Image</span>
                <span className="text-[#9CA3AF] text-xs">or drag and drop it here</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
