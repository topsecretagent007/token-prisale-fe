"use client";

import { useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import UserContext from "@/context/UserContext";
import { useSocket } from "@/contexts/SocketContext";
import { TokenDescription } from "@/components/trading/TokenDescription";
import { TradeForm } from "@/components/trading/TradeForm";
import { TradingChart } from "@/components/TVChart/TradingChart";
import { successAlert } from "../others/ToastGroup";
import { Holders } from "./Holder";
import Spinner from "../loadings/Spinner";
import { coinInfo, holderInfo, WowgoTokenDataType } from "@/utils/types";
import { findHolders, getCoinInfo, getTokenAtaBeforeMigration, getTokenPriceAndChange } from "@/utils/util";
import { IoIosArrowBack } from "react-icons/io";
import { FaCopy } from "react-icons/fa6";
import KingImage from "@/../public/assets/images/king.png";
import { RiShare2Fill } from "react-icons/ri";
import { quoteMint } from "@/program/web3";

export default function TradingPage() {
  const { coinId, setCoinId, isLoading, setIsLoading, updateCoin, setUpdateCoin } = useContext(UserContext);
  const { newSwapTradingSocket, setNewSwapTradingSocket } = useSocket();
  const pathname = usePathname();
  const [param, setParam] = useState<string>('');
  const [coin, setCoin] = useState<coinInfo>({} as coinInfo);
  const [holders, setHolders] = useState<holderInfo[]>([])
  const [copySuccess, setCopySuccess] = useState<string>(null);
  const [curceAddress, setCurveAddress] = useState<string>("")
  const [wowgoTokenData, setWowgoTokenData] = useState<WowgoTokenDataType>()
  const router = useRouter()
  const wallet = useWallet();

  const copyToClipBoard = async (copyMe: string) => {
    try {
      await navigator.clipboard.writeText(copyMe);
      setCopySuccess('Copied!');
      successAlert("Copied!")
    }
    catch (err) {
      setCopySuccess('Failed to copy!');
    }
  };

  const handleToRouter = (id: string) => {
    setIsLoading(true);
    router.push(id);
  };

  const getData = (pathname: string) => {
    setIsLoading(true)
    try {
      const fetchData = async () => {
        // Split the pathname and extract the last segment
        const segments = pathname.split("/");
        const parameter = segments[segments.length - 1];
        setParam(parameter);
        setCoinId(parameter);
        const data = await getCoinInfo(parameter);
        console.log("token data", data)
        setCoin(data);
        const curveData = await getTokenAtaBeforeMigration();
        setCurveAddress(curveData.toString())
        const holderData = await findHolders(data.token)
        holderData.sort((a, b) => b.percentage - a.percentage);
        setHolders(holderData)
        const getTokenData = await getTokenPriceAndChange(quoteMint.toString())
        if (getTokenData && typeof getTokenData === 'object') {
          setWowgoTokenData(getTokenData);
        } else {
          setWowgoTokenData(undefined);
        }
        setIsLoading(false)
      }
      fetchData();
    } catch (error) {
      setIsLoading(false)
    }
  }

  const getUpdatedData = (e: string) => {
    try {
      const fetchData = async () => {
        const data = await getCoinInfo(e);
        const curveData = await getTokenAtaBeforeMigration();
        setCurveAddress(curveData.toString())
        setCoin(data);
        const holderData = await findHolders(data.token)
        holderData.sort((a, b) => b.percentage - a.percentage);
        setHolders(holderData)
        const getTokenData = await getTokenPriceAndChange(quoteMint.toString())
        if (getTokenData && typeof getTokenData === 'object') {
          setWowgoTokenData(getTokenData);
        } else {
          setWowgoTokenData(undefined);
        }
        setNewSwapTradingSocket('')
        setIsLoading(false)
      }
      fetchData();
    } catch (error) {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getData(pathname)
  }, [pathname, updateCoin]);

  useEffect(() => {
    console.log("newSwapTradingSocket getdata  --->", newSwapTradingSocket)
    console.log("coin.token getdata  --->", coin.token)

    if (newSwapTradingSocket === coin.token) {
      console.log("newSwapTradingSocket geeeeeeee  --->")
      getUpdatedData(newSwapTradingSocket)
    }
  }, [newSwapTradingSocket])

  return (
    <div className="flex flex-col gap-5 mx-auto px-3 pt-10 pb-20 w-full">
      <div onClick={() => handleToRouter("/")} className="flex flex-row items-center gap-2 pb-2 w-[100px] text-[#9CA3AF] text-sm cursor-pointer">
        <IoIosArrowBack />
        Back
      </div>
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-row justify-between items-center w-full">
          <div className="flex flex-row justify-start items-center gap-4 w-full">
            <Image src={coin?.url || KingImage} alt="KingImage" width={20} height={20} className="rounded-full flex flex-col object-cover overflow-hidden w-7 h-7" />
            <p className="font-bold text-[#090603] text-[24px]">{coin?.name || "Token"} {coin?.gameName ? ` / ${coin.gameName}` : ""}</p>
            <p className="bg-[#090603] px-3 py-1 rounded-full text-[16px] text-white">{coin?.ticker || "TICKER"}</p>

            <div className="flex flex-row justify-center items-center gap-2">
              <p className="w-10 font-semibold text-[#4B5563] text-[10px] text-end">Market<br />Cap</p>
              <p className="flex flex-row items-center gap-2 bg-[radial-gradient(85.4%_100%_at_50.16%_0%,_#FFF8E8_0%,_#FCD582_100%)] px-3 py-1 rounded-full font-semibold text-[#090603] cursor-pointer">
                {(coin?.status === 3 || coin?.status === 5) &&
                  <div className="flex flex-col justify-center items-center px-2 py-0.5 rounded-full font-bold text-[#090603] text-xs sm:text-base">
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
                }
              </p>
            </div>

            <div className="flex flex-row justify-center items-center gap-2">
              <p className="w-10 font-semibold text-[#4B5563] text-[10px] text-end">Virtual<br />Liquidity</p>
              <p className="flex flex-row items-center gap-2 bg-[radial-gradient(85.4%_100%_at_50.16%_0%,_#FFF8E8_0%,_#FCD582_100%)] px-3 py-1 rounded-full font-semibold text-[#090603] cursor-pointer">
                $45.14k
              </p>
            </div>

            <div className="flex flex-row justify-center items-center gap-2">
              <p className="w-10 font-semibold text-[#4B5563] text-[10px] text-end">Contract<br />Address</p>
              <p className="flex flex-row items-center gap-2 bg-[#FFFFFC] shadow-sm px-3 py-1 rounded-full font-semibold text-[#1F2937] text-[12px]">
                {coin?.token?.toString().slice(0, 5)}...{coin?.token?.toString().slice(-4)}
                <FaCopy onClick={(e) => copyToClipBoard(coin?.token)} className="text-[#2B35E1] text-[12px] cursor-pointer" />
              </p>
            </div>
          </div>

          <div onClick={(e) => copyToClipBoard(coin?.token)} className="flex flex-row justify-center items-center gap-2 bg-[#FFFFFC] shadow-sm px-4 py-3 rounded-[12px] text-[#2B35E1] cursor-pointer">
            <RiShare2Fill className="text-xl" />
            <p className="font-semibold text-base">Share</p>
          </div>
        </div>

        <div className="flex flex-row gap-4 px-2 w-full">
          <TradingChart param={coin}></TradingChart>
          <TradeForm coin={coin}></TradeForm>
        </div>
        <div className="flex flex-row gap-4 px-2 w-full">
          <TokenDescription coin={coin} mainToken={wowgoTokenData} />
          <Holders holder={holders} curve={curceAddress} creator={coin?.creator} />
        </div>
      </div>
      {isLoading && <Spinner />}
    </div >
  );
}
