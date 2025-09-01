'use client'

import React from "react";
import Image from "next/image";
import { holderInfo, userInfo } from "@/utils/types";
import UserImage from "@/../public/assets/images/user-avatar.png";

interface TradePropsInfo {
  holder: holderInfo[]; // Array of holders
  curve: string;
  creator: string | userInfo;
}

export const Holders: React.FC<TradePropsInfo> = ({ holder, curve, creator }) => {

  return (
    <div className="flex flex-col justify-start items-start gap-4 bg-[#FFFFFC] shadow-sm p-6 rounded-[24px] w-full max-w-[410px] h-full min-h-[400px]">
      <p className="font-bold text-[#090603] text-[16px] text-start">Token Holders</p>
      <div className="flex flex-col justify-center items-start gap-2 w-full">
        {/* Map through the holder array and render each holder */}
        {holder.map((h, index) => (
          <div key={index} className="flex flex-row justify-start items-center gap-2 w-full">
            {/* Display holder's number */}
            <p className="flex flex-col justify-center items-center bg-[#FDEFC9] rounded-full min-w-5 min-h-5 text-[#4B5563] text-[12px]">
              {index + 1} {/* Display dynamic index */}
            </p>

            {/* Display the avatar */}
            <Image
              src={UserImage} // Use the holder's avatar or fallback to NoImage
              alt="Avatar"
              width={20}
              height={20}
              className="rounded-full object-cover"
            />

            <div className="flex flex-row justify-start items-center gap-2 w-full">
              <p className={`${curve === h.owner ? "text-[#2B35E1]" : "text-[#090603]"} font-semibold text-sm`}>
                {curve === h.owner ? "Bonding Curve" : h?.slice}
              </p>
              {(creator === h.owner ||
                (typeof creator === "object" && "wallet" in creator && creator.wallet === h.owner)) &&
                <p className="px-1 py-0.5 text-[#FCD582] text-[10px] bg-black rounded-full justify-center items-center">Creator</p>
              }
            </div>

            {/* Display token amount */}
            <p className="text-[#4B5563] text-sm">
              {h?.percentage || "39.23"}% {/* Display the token percentage */}
            </p>
          </div>
        ))}

      </div>
    </div>
  );
};
