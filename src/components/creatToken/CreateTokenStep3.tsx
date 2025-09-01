'use client'

import React from 'react'
import Image from 'next/image';
import ImageUpload from '../upload/ImageUpload';
import TestImage from '@/../public/assets/images/no-image.png'


interface Props {
  newCoin: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  createImage: string | "";
  setCreateImagePreview: (fileName: string | null) => void;
  setCreateImageUrl: (fileUrl: string) => void;
}

export default function CreateTokenStep3({
  newCoin,
  handleChange,
  createImage,
  setCreateImagePreview,
  setCreateImageUrl
}: Props) {
  return (
    <div className='flex flex-col gap-6 w-full max-w-[625px] h-full'>
      <div className='flex flex-col justify-between items-start gap-1 w-full'>
        <label className="font-semibold text-[#090603] text-base">
          Media Addons (optional)
        </label>
        <p className="text-[#9CA3AF] text-base">
          Add more media about your information.
        </p>
        <p className="px-2 py-0.5 rounded-full text-[#9CA3AF] text-grey-600 text-base">
          *Media Addons are subject to review prior to publication
        </p>
      </div>

      <div className='flex flex-col gap-4 bg-[#FFFFFC] p-6 rounded-[24px] w-full max-w-[625px] h-full'>
        <p className="mb-2 font-bold text-[#090603] text-[20px]">
          Your Contact
        </p>
        <div>
          <label htmlFor="contactEmail" className="font-semibold text-[#090603] text-xs">
            Email
          </label>
          <div className="flex flex-row border-[#E5E7EB] border-[1px] rounded-lg w-full h-full">
            <input
              type="text"
              id="contactEmail"
              value={newCoin.contactEmail || ""}
              onChange={handleChange}
              placeholder='Enter your Email'
              className={`block w-full p-2.5 rounded-r-lg bg-transparent text-sm text-[#090603] outline-none `}
            />
          </div>
        </div>

        <div>
          <label htmlFor="contactTelegram" className="font-semibold text-[#090603] text-xs">
            Telegram
          </label>
          <div className="flex flex-row border-[#E5E7EB] border-[1px] rounded-lg w-full h-full">
            <input
              type="text"
              id="contactTelegram"
              value={newCoin.contactTelegram || ""}
              onChange={handleChange}
              placeholder='Enter your Telegram'
              className={`block w-full p-2.5 rounded-r-lg bg-transparent text-sm text-[#090603] outline-none`}
            />
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-4 bg-[#FFFFFC] p-6 rounded-[24px] w-full max-w-[625px] h-full'>
        <div>
          <label htmlFor="gameName" className="font-semibold text-[#090603] text-xs">
            Game Project Name
          </label>
          <div className="flex flex-row border-[#E5E7EB] border-[1px] rounded-lg w-full h-full">
            <input
              type="text"
              id="gameName"
              value={newCoin.gameName || ""}
              onChange={handleChange}
              placeholder='Enter game project name'
              className={`block w-full p-2.5 rounded-r-lg bg-transparent text-sm text-[#090603] outline-none `}
            />
          </div>
        </div>

        <div>
          <label htmlFor="gameLink" className="font-semibold text-[#090603] text-xs">
            Link
          </label>
          <div className="flex flex-row border-[#E5E7EB] border-[1px] rounded-lg w-full h-full">
            <input
              type="text"
              id="gameLink"
              value={newCoin.gameLink || ""}
              onChange={handleChange}
              placeholder='Add link URL'
              className={`block w-full p-2.5 rounded-r-lg bg-transparent text-sm text-[#090603] outline-none`}
            />
          </div>
        </div>

        <div>
          <label htmlFor="buttonLabel" className="font-semibold text-[#090603] text-xs">
            Label on button
          </label>
          <div className="flex flex-row border-[#E5E7EB] border-[1px] rounded-lg w-full h-full">
            <input
              type="text"
              id="buttonLabel"
              value={newCoin.buttonLabel || ""}
              onChange={handleChange}
              placeholder='Enter label on button'
              className={`block w-full p-2.5 rounded-r-lg bg-transparent text-sm text-[#090603] outline-none`}
            />
          </div>
        </div>

        <ImageUpload
          header="Image (Square 1024*1024)"
          setFilePreview={(fileName) => setCreateImagePreview(fileName)}
          setFileUrl={(fileUrl) => setCreateImageUrl(fileUrl)}
          type="image/*"
        />

        <div className='flex flex-col gap-4 w-full h-full'>
          <p className="w-full font-semibold text-[#090603] text-xs">Preview</p>
          <div className='flex flex-row gap-3 bg-[#EEF4FF] mx-auto p-3 rounded-[12px] w-full max-w-[310px] h-[104px]'>
            <Image src={TestImage} alt='createImage' className='rounded-[8px] w-[94px] h-20 object-cover overflow-hidden' />
            <div className='flex flex-col gap-2 w-full h-full'>
              <p className='font-bold text-[#1F2937]'>{newCoin.gameName || "Test Name"}</p>
              <div
                // href={newCoin.gameLink || ""}
                className="flex justify-center items-center bg-[linear-gradient(180deg,_#86B3FD_0%,_#2B35E1_100%)] opacity-100 border-[#86B3FD] border-[3px] rounded-[12px] w-[177px] h-11 font-semibold text-white cursor-pointer fle-col"
              >
                {newCoin.buttonLabel || "Test Label"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
