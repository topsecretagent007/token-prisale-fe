'use client'

import React from 'react';
import ImageUpload from '../upload/ImageUpload';

interface Props {
  newCoin: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setProfileImagePreview: (fileName: string | null) => void;
  setProfileImageUrl: (fileUrl: string) => void;
}

export default function CreateTokenStep1({
  newCoin,
  handleChange,
  setProfileImagePreview,
  setProfileImageUrl
}: Props) {
  return (
    <div className='flex flex-col gap-4 bg-[#FFFFFC] p-6 rounded-[24px] w-full max-w-[625px] h-full'>
      <div>
        <label htmlFor="name" className="flex flex-row gap-1 mb-1 font-semibold text-[#090603] text-xs">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={newCoin?.name || ""}
          onChange={handleChange}
          placeholder="Enter token or project name"
          className={`block w-full px-3 py-2.5 rounded-lg bg-transparent text-sm text-[#090603] outline-none border-[#E5E7EB] border-[1px]`}
        />
      </div>

      <div>
        <label
          htmlFor="ticker"
          className="flex flex-row gap-1 mb-1 font-semibold text-[#090603] text-xs"
        >
          Ticker (Max 6 characters)
        </label>
        <input
          id="ticker"
          type="text"
          maxLength={6}
          value={newCoin?.ticker || ""}
          onChange={handleChange}
          placeholder="Enter ticker"
          className={`block w-full px-3 py-2.5 rounded-lg bg-transparent text-sm text-[#090603] outline-none border-[#E5E7EB] border-[1px]`}
        />
      </div>

      <div>
        <label htmlFor="description" className="flex flex-row gap-1 mb-1 font-semibold text-[#090603] text-xs">
          Description (Max 250 characters)
        </label>
        <textarea
          id="description"
          rows={2}
          maxLength={250}
          value={newCoin?.description || ""}
          onChange={handleChange}
          placeholder="Describe your token or project"
          className={`block w-full p-2.5 min-h-[110px] rounded-lg bg-transparent text-sm text-[#090603] outline-none border-[#E5E7EB] border-[1px]`}
        />
      </div>

      <ImageUpload
        header="Image (Square 1024*1024)"
        setFilePreview={(fileName) => setProfileImagePreview(fileName)}
        setFileUrl={(fileUrl) => setProfileImageUrl(fileUrl)}
        type="image/*"
      />
    </div>
  );
}
