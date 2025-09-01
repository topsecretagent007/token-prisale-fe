'use client'

import React from 'react';

interface Props {
  newCoin: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function CreateTokenStep2({ newCoin, handleChange }: Props) {
  return (
    <div className='flex flex-col gap-6 w-full max-w-[625px] h-full'>
      <div className='flex flex-col justify-between items-start gap-1 w-full'>
        <label className="font-semibold text-[#090603] text-base">
          Website and Socials (optional)
        </label>
        <p className="text-[#9CA3AF] text-base">
          Add more information about your coin.
        </p>
      </div>
      <div className='flex flex-col gap-4 bg-[#FFFFFC] p-6 rounded-[24px] w-full max-w-[625px] h-full'>
        <div>
          <label htmlFor="website" className="font-semibold text-[#090603] text-xs">
            Website
          </label>
          <div className="flex flex-row border-[#E5E7EB] border-[1px] rounded-lg w-full h-full">
            <input
              type="text"
              id="website"
              value={newCoin.website || ""}
              onChange={handleChange}
              placeholder='Add website URL'
              className={`block w-full p-2.5 rounded-r-lg bg-transparent text-sm text-[#090603] outline-none `}
            />
          </div>
        </div>

        <div>
          <label htmlFor="twitter" className="font-semibold text-[#090603] text-xs">
            X (Twitter)
          </label>
          <div className="flex flex-row border-[#E5E7EB] border-[1px] rounded-lg w-full h-full">
            <input
              type="text"
              id="twitter"
              value={newCoin.twitter || ""}
              onChange={handleChange}
              placeholder='Add X (Twitter) URL'
              className={`block w-full p-2.5 rounded-r-lg bg-transparent text-sm text-[#090603] outline-none`}
            />
          </div>
        </div>

        <div>
          <label htmlFor="telegram" className="font-semibold text-[#090603] text-xs">
            Telegram
          </label>
          <div className="flex flex-row border-[#E5E7EB] border-[1px] rounded-lg w-full h-full">
            <input
              type="text"
              id="telegram"
              value={newCoin.telegram || ""}
              onChange={handleChange}
              placeholder='Add Telegram URL'
              className={`block w-full p-2.5 rounded-r-lg bg-transparent text-sm text-[#090603] outline-none`}
            />
          </div>
        </div>

        <div>
          <label htmlFor="discord" className="font-semibold text-[#090603] text-xs">
            Discord
          </label>
          <div className="flex flex-row border-[#E5E7EB] border-[1px] rounded-lg w-full h-full">
            <input
              type="text"
              id="discord"
              value={newCoin.discord || ""}
              onChange={handleChange}
              placeholder='Add Discord URL'
              className={`block w-full p-2.5 rounded-r-lg bg-transparent text-sm text-[#090603] outline-none`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
