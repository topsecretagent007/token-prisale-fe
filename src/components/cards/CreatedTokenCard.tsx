'use client'

import React from 'react'
import Image from 'next/image'
import { coinInfo, WowgoTokenDataType } from '@/utils/types';
import NoImage from "@/../public/assets/images/no-image.png"
import kingImage from "@/../public/assets/images/king.png";
import PresaleIcon from "@/../public/assets/images/presale.png"

interface CreatedTokenCardProp {
  data: coinInfo;
  wowgoToken: WowgoTokenDataType;
}

export const CreatedTokenCard: React.FC<CreatedTokenCardProp> = ({ data, wowgoToken }) => {

  return (
    <div className='flex flex-row justify-between items-start gap-3 bg-[#FFFFFC] shadow-md p-3 rounded-[12px] w-full h-full'>
      <div className='flex flex-col rounded-[8px] min-w-[78px] h-[78px] object-cover overflow-hidden'>
        <Image src={data?.url || NoImage} alt='TokenImage' width={78} height={78} className='rounded-[8px] w-[78px] h-[78px]' />
      </div>
      <div className='flex flex-col gap-2.5 w-full h-full'>
        <div className='flex flex-row justify-between items-center w-full'>
          <p className="font-bold text-[#090603] text-base">
            {data?.name || "Token"} {data?.gameName ? ` / ${data.gameName}` : ""}
          </p>
          {data?.status === 5 && (
            <Image src={kingImage} alt="King Image" width={20} height={20} className="rounded-lg object-cover" />
          )}
          {(data?.status === 0 || data?.status === 1 || data?.status === 2) && (
            <Image src={PresaleIcon} alt="King Image" width={20} height={20} className="rounded-lg object-cover" />
          )}
        </div>

        <div className="flex flex-row justify-between items-center w-full">
          {(data?.status === 3 || data?.status === 5) &&
            <div className="flex flex-row justify-start items-center gap-3">
              <p className="text-[#4B5563] text-[10px]">Market Cap</p>
              <p className="flex flex-row items-center gap-2 bg-[radial-gradient(85.4%_100%_at_50.16%_0%,_#FFF8E8_0%,_#FCD582_100%)] px-3 py-1 rounded-full font-semibold text-[#090603] cursor-pointer">
                <div className="flex flex-col justify-center items-center px-2 py-0.5 rounded-full font-bold text-[#090603] text-xs">
                  {
                    (data?.marketcap !== null || data?.marketcap !== undefined)
                      ? (() => {
                        const value = data?.marketcap * wowgoToken?.price;

                        if (value >= 1_000_000_000) {
                          return '$' + (value / 1_000_000_000).toFixed(2) + 'B'; // Billions
                        } else if (value >= 1_000_000) {
                          return '$' + (value / 1_000_000).toFixed(2) + 'M'; // Millions
                        } else if (value >= 1_000) {
                          return '$' + (value / 1_000).toFixed(2) + 'k'; // Thousands
                        } else {
                          return '$' + value.toFixed(2); // Less than 1000
                        }
                      })()
                      : "0.00"
                  }
                </div>
              </p>
            </div>
          }
          <p className="bg-[#EEF4FF] px-2 py-0.5 rounded-full font-semibold text-[#4B5563] text-xs ml-auto shadow-sm">
            {data?.date ?
              new Date(data.date).toLocaleString() // Converts ISO string to Date and formats it
              : "1 Mar 2025 12:00:00"}
          </p>
        </div>
      </div>
    </div>
  )
}
