'use client'

import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { coinInfo, userInfo, WowgoTokenDataType } from "@/utils/types";
import UserContext from "@/context/UserContext";
import NoImage from "@/../public/assets/images/no-image.png";
import UserImage from "@/../public/assets/images/user-avatar.png"
import kingImage from "@/../public/assets/images/king.png";
import PresaleIcon from "@/../public/assets/images/presale.png"
import { TbWorld } from "react-icons/tb";
import { FaXTwitter, FaTelegram, FaDiscord } from "react-icons/fa6";

interface TokenDescriptionProps {
  coin: coinInfo;
  mainToken: WowgoTokenDataType;
}

export const TokenDescription: React.FC<TokenDescriptionProps> = ({ coin, mainToken }) => {
  const { solPrice } = useContext(UserContext);
  const [userAvatar, setUserAvatar] = useState<string | userInfo>();

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = NoImage.src; // Fallback to NoImage if the avatar fails to load
  };

  useEffect(() => {
    if (coin) {
      console.log("coin data ===>", coin?.creator)
      setUserAvatar(coin?.creator)
    }
  }, [coin])

  return (
    <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-6 bg-[#FFFFFC] shadow-md p-6 rounded-[24px] w-full h-full">
      <Image src={coin?.url || NoImage} alt="Token Image" width={280} height={280} className="rounded-[16px] object-cover" />
      <div className="flex flex-col justify-center items-start gap-6 w-full h-full px-2 sm:px-5 md:px-0">
        <div className="flex flex-col items-start gap-2 w-full text-[#090603]">
          <div className="flex flex-row justify-between items-center w-full">
            <p className="font-bold text-[20px]">
              {coin?.name || "Token"}
              {coin?.gameName ? ` / ${coin.gameName}` : ""}
            </p>
            {coin?.status === 5 && (
              <Image src={kingImage} alt="King Image" width={20} height={20} className="rounded-lg object-cover" />
            )}
            {(coin?.status === 0 || coin?.status === 1 || coin?.status === 2) && (
              <Image src={PresaleIcon} alt="King Image" width={20} height={20} className="rounded-lg object-cover" />
            )}
          </div>
          <div className="flex flex-row justify-start items-center gap-2">
            <p className="text-[#4B5563] text-sm">by</p>
            <Image
              src={typeof userAvatar === "object" && userAvatar?.avatar ? UserImage : UserImage}
              alt="userAvatar"
              width={24}
              height={24}
              className="w-6 h-6 rounded-full object-cover"
              onError={handleImageError}
            />
            <p className="font-semibold text-[#090603]">
              {typeof userAvatar === "object" && userAvatar?.name ? userAvatar.name : "user"}
            </p>
          </div>
        </div>

        <p className="w-full h-full text-[#4B5563] text-sm">
          {coin?.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent dapibus non leo sit amet porttitor. Aliquam varius, ipsum et eleifend elementum, lacus turpis cursus ipsum, non egestas urna erat id tortor."}
        </p>

        {
          (coin?.gameName && coin?.gameLink) &&
          <div className="flex flex-col justify-start h-full">
            <div className="flex flex-row justify-center items-center gap-3 bg-[#EEF4FF] shadow-sm p-3 rounded-[12px] h-[104px]">
              {coin?.gameImage &&
                <Image src={coin?.gameImage} alt="Token Image" width={94} height={80} className="rounded-[12px] w-[94px] h-[80px] object-cover" />
              }

              <div className="flex flex-col justify-center items-start gap-2">
                <p className="font-bold text-[#1F2937] text-[16px]">{coin?.gameName || "Game Project Name"}</p>
                <a
                  href={coin?.gameLink || "#"} target="_blank" rel="noopener noreferrer"
                  className="flex flex-col justify-center items-center bg-[linear-gradient(180deg,_#86B3FD_0%,_#2B35E1_100%)] border-[#86B3FD] border-[3px] rounded-[12px] w-[177px] h-11 font-semibold text-white cursor-pointer"
                >
                  {coin?.buttonLabel || "Game Start"}
                </a>
              </div>
            </div>
          </div>
        }

        <div className="flex flex-row justify-start items-center gap-2">
          {coin?.website && (
            <a href={coin?.website} target="_blank" rel="noopener noreferrer" className="flex flex-row items-center gap-2 px-3 py-2 rounded-[12px] font-semibold text-[#1F2937] text-sm cursor-pointer bg-[#EEF4FF]">
              <TbWorld className="text-[#090603] text-xl" />
              Website
            </a>
          )}

          {coin?.twitter && (
            <a href={coin?.twitter} target="_blank" rel="noopener noreferrer" className="flex flex-row items-center gap-2 px-3 py-2 rounded-[12px] font-semibold text-[#1F2937] text-sm cursor-pointer bg-[#EEF4FF]">
              <FaXTwitter className="text-[#090603] text-xl" />
              Twitter
            </a>
          )}

          {coin?.telegram && (
            <a href={coin?.telegram} target="_blank" rel="noopener noreferrer" className="flex flex-row items-center gap-2 px-3 py-2 rounded-[12px] font-semibold text-[#1F2937] text-sm cursor-pointer bg-[#EEF4FF]">
              <FaTelegram className="text-xl" />
              Telegram
            </a>
          )}

          {coin?.discord && (
            <a href={coin?.discord} target="_blank" rel="noopener noreferrer" className="flex flex-row items-center gap-2 px-3 py-2 rounded-[12px] font-semibold text-[#1F2937] text-sm cursor-pointer bg-[#EEF4FF]">
              <FaDiscord className="text-[#090603] text-xl" />
              Discord
            </a>
          )}
        </div>

        <div className="flex flex-row justify-between items-center w-full">
          {(coin?.status === 3 || coin?.status === 5) &&
            <div className="flex flex-row justify-start items-center gap-2">
              <p className="font-semibold text-[#4B5563] text-[10px] text-end"> Market<br />Cap</p>
              <p className="flex flex-row items-center gap-2 bg-[radial-gradient(85.4%_100%_at_50.16%_0%,_#FFF8E8_0%,_#FCD582_100%)] px-3 py-1 rounded-full font-semibold text-[#090603] cursor-pointer">
                <div className="flex flex-col justify-center items-center px-2 py-0.5 rounded-full font-bold text-[#090603] text-xs sm:text-base">
                  {
                    (coin?.marketcap !== null || coin?.marketcap !== undefined)
                      ? (() => {
                        const value = coin?.marketcap * mainToken?.price;

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
          <p className="flex flex-col bg-[#EEF4FF] px-2 py-0.5 rounded-full font-semibold text-[#4B5563] text-[12px] ml-auto shadow-sm">
            {coin?.date ?
              new Date(coin.date).toLocaleString() // Converts ISO string to Date and formats it
              : "1 Mar 2025 12:00:00"}
          </p>
        </div>
      </div>
    </div>

  );
};
