'use client'

import React from 'react'
import Image from 'next/image';
import { WowgoTokenDataType } from '@/utils/types';
import NoImage from "@/../public/assets/images/no-image.png"
import WowGoTokenIcon from "@/../public/assets/images/wowgo.png"
import { Decimal } from '@/config/TextData';

interface CreatedTokenCardProp {
  data: any;
  wowgoToken: WowgoTokenDataType;
}

export const PresaleTokenCard: React.FC<CreatedTokenCardProp> = ({ data, wowgoToken }) => {

  return (
    <div className="flex flex-row justify-between items-center w-full text-[#4B5563] text-sm px-3 py-1.5">
      <div className="flex flex-row justify-start items-start gap-3 w-full h-full">
        <Image src={data?.coin?.url || NoImage} alt="" width={32} height={32} className="rounded-[8px] w-8 h-8" />
        <div className="flex flex-col gap-1 w-full h-full">
          <p className="font-bold text-[#090603] text-base text-start">
            {data?.coin?.name || "Token"} {data?.coin?.gameName ? ` / ${data?.coin.gameName}` : ""}
          </p>
          <p className="text-[#4B5563] text-sm text-start justify-start items-center flex flex-row gap-1">
            <Image src={WowGoTokenIcon} alt="WowGoToken" width={12} height={12} className="w-4 h-4" />
            {
              (data?.paid !== null || data?.paid !== undefined)
                ? (() => {
                  const value = data?.paid / (10 ** Number(Decimal));

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
          </p>
        </div>
      </div>
      <div className="flex flex-col min-w-[84px] h-full text-start">
        {
          (data?.amount !== null || data?.amount !== undefined)
            ? (() => {
              const value = data?.amount / (10 ** Number(Decimal));

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
      <div className="flex flex-col min-w-[84px] h-full text-end">
        {
          (data?.paid !== null || data?.paid !== undefined)
            ? (() => {
              const value = data?.paid / (10 ** Number(Decimal)) * wowgoToken?.price;

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
    </div>
  )
}
