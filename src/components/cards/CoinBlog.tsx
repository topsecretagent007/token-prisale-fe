import { coinInfo, userInfo, WowgoTokenDataType } from "@/utils/types";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NotImage from "@/../public/assets/images/no-image.png"
import KingsIcon from "@/../public/assets/images/king.png";
import PresaleIcon from "@/../public/assets/images/presale.png"
import UserAvatar from "@/../public/assets/images/user-avatar.png";
import { getTokenPriceAndChange } from "@/utils/util";
import { quoteMint } from "@/program/web3";

interface CoinBlogProps {
  coin: coinInfo;
  componentKey: string;
}

export const CoinBlog: React.FC<CoinBlogProps> = ({ coin, componentKey }) => {
  const [timeAgo, setTimeAgo] = useState<string>("0d ago");
  const [wowgoTokenData, setWowgoTokenData] = useState<WowgoTokenDataType>()
  const router = useRouter()

  const handleToProfile = (id: string) => {
    router.push(`/profile/${id}`)
  }

  const getTokenMetadata = async () => {
    const getTokenData = await getTokenPriceAndChange(quoteMint.toString())
    if (getTokenData && typeof getTokenData === 'object') {
      setWowgoTokenData(getTokenData);
    } else {
      setWowgoTokenData(undefined);
    }
  }

  const getTimeAgo = (coinDate: Date) => {
    const pastDate = new Date(coinDate); // Convert the ISO string to a Date object
    const currentDate = new Date(); // Get the current local date and time
    const differenceInMs = currentDate.getTime() - pastDate.getTime(); // Difference in milliseconds

    if (differenceInMs < 1000 * 60 * 60 * 24) {
      // Less than a day
      if (differenceInMs < 1000 * 60) {
        // Less than a minute
        setTimeAgo("Just now");
      } else {
        const _minutesAgo = Math.floor(differenceInMs / (1000 * 60));
        if (_minutesAgo < 60) {
          // Less than an hour
          setTimeAgo(`${_minutesAgo}m ago`);
        } else {
          // Less than an hour
          const minutesAgo = Math.floor(_minutesAgo / 60);
          setTimeAgo(`${minutesAgo}h ago`);
        }
      }
    } else {
      const daysAgo = Math.floor(differenceInMs / (1000 * 60 * 60 * 24)); // Convert ms to days
      setTimeAgo(`${daysAgo}d ago`);
    }
  };

  useEffect(() => {
    getTokenMetadata()
    getTimeAgo(coin.date)
  }, [coin])

  return (
    <div className="flex flex-col justify-between items-center gap-2 rounded-lg h-full object-cover overflow-hidden text-[#fdd52f]">
      <div className="flex flex-row p-3 w-full">
        <div className="relative flex flex-col justify-center items-center px-1 rounded-tl-md w-[181px] h-[181px] overflow-hidden">
          <Image
            src={coin?.url ? coin.url : NotImage}
            alt="image"
            width={181}
            height={181}
            className="flex items-center rounded-lg object-cover"
          />
        </div>
        <div className="flex flex-col gap-1 px-2 py-1 w-full max-w-[193px] h-[181px]">
          <div className="flex flex-col gap-2 w-full h-full">
            <div className="flex flex-row justify-between items-start w-full">
              <div className="w-full font-semibold text-[#090603] text-base">
                {coin?.name} [ {coin?.ticker} ]
              </div>
              {coin?.status === 5 && (
                <Image src={KingsIcon} alt="KingsIcon" width={20} height={20} className="w-5 h-5" />
              )}
              {(coin.status === 0 || coin.status === 1 || coin.status === 2) && (
                <Image src={PresaleIcon} alt="PresaleIcon" width={20} height={20} className="w-5 h-5" />
              )}
            </div>

            <div className="flex flex-row gap-1 text-sm">
              <Image src={UserAvatar} alt="UserAvatar" width={20} height={20} className="rounded-full w-5 h-5" />
              <div onClick={() => handleToProfile((coin?.creator as userInfo)?._id)}>
                <div className="px-1 text-[#090603]">
                  {(coin?.creator as userInfo)?.name ? (coin?.creator as userInfo)?.name : "AWd...Qx3A"}
                </div>
              </div>
            </div>

            <div className="h-[58px] object-cover overflow-hidden text-[#4B5563] text-[12px] break-words">{coin?.description ? coin?.description : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent dapibus non leo sit amet porttitor. Aliquam varius, ipsum et eleifend elementum, lacus turpis cursus ipsum, non egestas urna erat id tortor."}</div>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <div className="flex flex-row justify-between items-center w-full">
              {(coin?.status === 3 || coin?.status === 5) &&
                <div className="flex flex-row items-center gap-2 font-semibold">
                  <p className="text-[#4B5563] text-[10px] text-end">
                    Market <br />
                    Cap
                  </p>
                  <div className="flex flex-col justify-center items-center bg-[linear-gradient(180deg,_#FFF8E8_0%,_#FCD582_100%)] px-2 py-0.5 rounded-full font-bold text-[#090603] text-[10px]">
                    {
                      (coin?.marketcap !== null || coin?.marketcap !== undefined)
                        ? (() => {
                          const value = coin?.marketcap * wowgoTokenData?.price;

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
              }
              <div className="bg-[#EEF4FF] px-2 py-0.5 rounded-full font-bold text-[#090603] text-[10px] ml-auto">
                {timeAgo}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
