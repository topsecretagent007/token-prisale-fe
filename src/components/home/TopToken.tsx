"use client"

import { FC, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";
import UserContext from "@/context/UserContext";
import { coinInfo, userInfo } from "@/utils/types";
import KingImg from "@/../public/assets/images/logo.png"
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import KingsIcon from "@/../public/assets/images/king.png";
import PresaleIcon from "@/../public/assets/images/presale.png"
import UserAvatar from "@/../public/assets/images/user-avatar.png";
import { Decimal } from "@/config/TextData";

const TopToken: FC<{ data: coinInfo[] }> = ({ data }) => {
  const { setIsLoading } = useContext(UserContext);
  const [daysAgo, setDaysAgo] = useState<string>("0d ago");
  const [topTokenData, setTopTokenData] = useState<coinInfo>({} as coinInfo);
  const router = useRouter();
  const { setVisible } = useWalletModal();
  const { publicKey } = useWallet();

  const limiteSolAmount: string | undefined = process.env.NEXT_PUBLIC_LIMITE_SOLAMOUNT;

  const handleToRouter = (id: string) => {
    setIsLoading(true)
    router.push(id)
  }

  const getDaysAgo = (coinDate: Date) => {
    const pastDate = new Date(coinDate); // Convert the ISO string to a Date object
    const currentDate = new Date(); // Get the current local date and time
    const differenceInMs = currentDate.getTime() - pastDate.getTime(); // Difference in milliseconds

    if (differenceInMs < 1000 * 60 * 60 * 24) {
      // Less than a day
      if (differenceInMs < 1000 * 60) {
        // Less than a minute
        setDaysAgo("Just now");
      } else {
        const _minutesAgo = Math.floor(differenceInMs / (1000 * 60));
        if (_minutesAgo < 60) {
          // Less than an hour
          setDaysAgo(`${_minutesAgo}m ago`);
        } else {
          // Less than an hour
          const minutesAgo = Math.floor(_minutesAgo / 60);
          setDaysAgo(`${minutesAgo}h ago`);
        }
      }
    } else {
      const daysAgo = Math.floor(differenceInMs / (1000 * 60 * 60 * 24)); // Convert ms to days
      setDaysAgo(`${daysAgo}d ago`);
    }
  };

  const getTopToken = (data: coinInfo[]) => {
    let sortedData = [...data]; // Create a new array to prevent direct state mutation

    sortedData.sort((a, b) => b.marketcap - a.marketcap);

    console.log("sortedData ==> ", sortedData[0])
    setTopTokenData(sortedData[0])
    getDaysAgo(sortedData[0].date)
  }

  useEffect(() => {
    console.log("data ==> ", data)
    if (Array.isArray(data) && data.length > 0) {
      getTopToken(data)
    }
  }, [data])

  return (
    <div className="px-2 w-full h-full">
      <div className="flex flex-row justify-center items-end gap-10 w-full h-full">
        <div className="flex flex-col justify-center items-start gap-4 px-4 w-full max-w-[410px] text-[#fdd52f]">
          <div className="flex flex-row items-center font-extrabold text-[#090603] text-xl">
            Play, Earn, and Evolve in the Wildest Web3 Zoo
          </div>
          <p className="text-[#4B5563] text-sm">
            Raise virtual pets, unlock rare species, and earn rewards through gameplay. <br />
            Join a new frontier where fun meets the blockchain.
          </p>
          <div className="flex flex-row items-center gap-2">
            {!publicKey ?
              <div onClick={() => setVisible(true)} className="group relative flex flex-row justify-end items-center gap-1 bg-gradient-to-b from-[#86B3FD] to-[#2B35E1] px-4 py-2 border-[#86B3FD] border-[3px] rounded-[12px] font-semibold text-white cursor-pointer">
                Connect Wallet
              </div>
              :
              <div onClick={() => handleToRouter('/create-coin')} className="flex flex-row items-center gap-1 bg-[#FFFFFC] px-5 py-2.5 rounded-[12px] font-semibold text-[#2B35E1] cursor-pointer shadow-md">
                Create a Token
              </div>
            }
          </div>
        </div>
        <div
          onClick={() => {
            if (topTokenData.status === 0 || topTokenData.status === 1 || topTokenData.status === 2) {
              handleToRouter(`/presaletrade/${topTokenData.token}`);
            } else if (topTokenData.status === 3 || topTokenData.status === 5) {
              handleToRouter(`/trading/${topTokenData.token}`);
            }
          }}
          className="flex xs:flex-row flex-col justify-center items-start gap-2 bg-[#FFFFFC] p-6 rounded-[12px] w-full max-w-[624px] h-full object-cover overflow-hidden cursor-pointer"
        >
          <div className="flex flex-col justify-center items-center w-full max-w-[280px] h-[160px] xs:h-[280px]">
            <Image
              src={topTokenData?.url ? topTokenData.url : KingImg}
              alt="TestTokenImg"
              width={280}
              height={280}
              className="flex flex-col rounded-lg w-[160px] xs:w-[280px] max-h-[160px] xs:max-h-[280px] object-cover overflow-hidden" />
          </div>
          <div className="flex flex-col justify-between items-start px-1 w-full max-w-[272px] h-[160px] xs:h-[280px] object-cover overflow-hidden">
            <div className="flex flex-col gap-2 w-full h-full">
              <div className="flex flex-row justify-between items-start w-full">
                <p className="font-bold text-[#090603] text-lg">Name : {topTokenData.name ? topTokenData.name : "WildGo"}</p>
                {topTokenData?.status === 5 && (
                  <Image src={KingsIcon} alt="KingsIcon" width={20} height={20} className="w-5 h-5" />
                )}
                {(topTokenData.status === 0 || topTokenData.status === 1 || topTokenData.status === 2) && (
                  <Image src={PresaleIcon} alt="PresaleIcon" width={20} height={20} className="w-5 h-5" />
                )}
              </div>

              <div className="flex flex-row justify-start items-center gap-2 w-full h-6 text-[#b2af93] text-lg">
                <p className="font- text-[#4B5563] text-sm">By</p>
                <Image src={UserAvatar} alt="UserAvatar" width={20} height={20} className="rounded-full w-5 h-5" />
                <p className="font- text-[#090603] text-sm">{(topTokenData?.creator as userInfo)?.name ? (topTokenData?.creator as userInfo)?.name : "AWd...Qx3A"}</p>
              </div>
              <div className="h-24 font-semibold text-xl">Description : <br /> <p className="flex flex-col px-2 w-full h-full object-cover overflow-hidden text-[#4B5563] text-sm break-words">{topTokenData.description ? topTokenData.description : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent dapibus non leo sit amet porttitor. Aliquam varius, ipsum et eleifend elementum, lacus turpis cursus ipsum, non egestas urna erat id tortor."}</p></div>
            </div>

            <div className="flex flex-col gap-1 w-full">
              <div className="flex flex-row justify-between items-end w-full">
                <div className="flex flex-row items-center gap-2 font-semibold">
                  <p className="text-[#4B5563] text-[10px] text-end">
                    Market <br />
                    Cap
                  </p>
                  {(topTokenData?.status === 0 || topTokenData?.status === 1 || topTokenData?.status === 2) &&
                    <div className="flex flex-col justify-center items-center bg-[linear-gradient(180deg,_#FFF8E8_0%,_#FCD582_100%)] px-2 py-0.5 rounded-full font-bold text-[#090603] text-base">
                      {
                        (topTokenData?.progressPresale !== null || topTokenData?.progressPresale !== undefined)
                          ? (() => {
                            const value = topTokenData?.progressPresale / (10 ** Number(Decimal));

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
                  }

                  {(topTokenData?.status === 3 || topTokenData?.status === 5) &&
                    <div className="flex flex-col justify-center items-center bg-[linear-gradient(180deg,_#FFF8E8_0%,_#FCD582_100%)] px-2 py-0.5 rounded-full font-bold text-[#090603] text-base">
                      {
                        (topTokenData?.marketcap !== null || topTokenData?.marketcap !== undefined)
                          ? (() => {
                            const value = topTokenData?.marketcap / (10 ** Number(Decimal));

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
                  }
                </div>

                <div className="bg-[#EEF4FF] px-2 py-0.5 rounded-full font-bold text-[#090603] text-[12px]">
                  {daysAgo}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopToken;
