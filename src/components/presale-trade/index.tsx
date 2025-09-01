"use client";

import { PTradeForm } from "./PTradeForm";
import UserContext from "@/context/UserContext";
import { coinInfo } from "@/utils/types";
import { getCoinInfo } from "@/utils/util";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { FaCopy } from "react-icons/fa6";
import { successAlert } from "../others/ToastGroup";
import { TokenDescription } from "../trading/TokenDescription";
import Image from "next/image";
import PresaleIcon from "@/../public/assets/images/presale.png"
import { RiShare2Fill } from "react-icons/ri";
import SuccessImg from "@/../public/assets/images/success.png"
import FailedImg from "@/../public/assets/images/failed.png"
import { useSocket } from "@/contexts/SocketContext";
import Spinner from "../loadings/Spinner";

export default function PresaleTrade() {
  const { setCoinId, setIsLoading, updateCoin, isLoading } = useContext(UserContext);
  const { newPresaleBuyTx, presaleCompleteSocket, distributeSocket, distributeStartSocket, distributeCompleteSocket, refundSocket, refundStartSocket, refundCompleteSocket } = useSocket();
  const pathname = usePathname();
  const [param, setParam] = useState<string>('');
  const [coin, setCoin] = useState<coinInfo>({} as coinInfo);
  const [copySuccess, setCopySuccess] = useState<string>(null);
  const [distributeComplete, setDistributeComplete] = useState<boolean>(false);
  const router = useRouter()

  const mainTokenData = {
    price: 0,
    changeIn24h: 0,
    liquidity: 0
  }

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
        console.log("parameter   ===>", parameter)
        const data = await getCoinInfo(parameter);
        console.log("data  --->", data)
        setCoin(data);
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
    if (distributeComplete) {
      setIsLoading(true);
      const timeoutId = setTimeout(() => {
        handleToRouter(`/trading/${coin?.token}`);
      }, 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [distributeComplete, coin]);

  useEffect(() => {
    const updateCoinData = (socketData: any) => {
      if (socketData?.token === param) {
        setCoin(socketData);
        if (socketData.status === 3 || socketData.status === 5) {
          setDistributeComplete(true); // Flag to navigate
        }
      }
    };

    if (newPresaleBuyTx?.token === param) updateCoinData(newPresaleBuyTx);
    if (presaleCompleteSocket?.token === param) updateCoinData(presaleCompleteSocket);
    if (distributeSocket?.token === param) updateCoinData(distributeSocket);
    if (distributeStartSocket?.token === param) updateCoinData(distributeStartSocket);
    if (distributeCompleteSocket?.token === param) {
      updateCoinData(distributeCompleteSocket);
      setDistributeComplete(true);
    }
    if (refundSocket?.token === param) updateCoinData(refundSocket);
    if (refundStartSocket?.token === param) updateCoinData(refundStartSocket);
    if (refundCompleteSocket?.token === param) updateCoinData(refundCompleteSocket);
  }, [newPresaleBuyTx, presaleCompleteSocket, distributeSocket, distributeStartSocket, distributeCompleteSocket, refundSocket, refundStartSocket, refundCompleteSocket]);


  return (
    <div className="flex flex-col gap-5 mx-auto px-3 pt-10 pb-20 w-full">
      <div onClick={() => handleToRouter("/")} className="flex flex-row items-center gap-2 pb-2 w-[100px] text-[#9CA3AF] text-sm cursor-pointer">
        <IoIosArrowBack />
        Back
      </div>
      <div className="flex flex-row justify-between items-center w-full">
        <div className="flex flex-row justify-start items-center gap-4 w-full">
          <Image src={coin?.url ? coin?.url : PresaleIcon} alt="toekn image" width={20} height={20} className="rounded-full flex flex-col object-cover overflow-hidden w-7 h-7" />
          <p className="font-bold text-[#090603] text-[24px]">{coin?.name || "Token"} {coin?.gameName ? ` / ${coin.gameName}` : ""}</p>
          <p className="bg-[#090603] px-3 py-1 rounded-full text-[16px] text-white">{coin?.ticker || "TICKER"}</p>

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
      <div className="flex md3:flex-row flex-col gap-4 w-full">
        {/* trading view chart  */}
        <div className="px-2 w-full">
          <TokenDescription coin={coin} mainToken={mainTokenData} />
        </div>
        <div className="flex flex-col gap-4 mx-auto px-2 w-full max-w-[300px] 2xs:max-w-[420px] rounded-lg">
          {coin?.status === 0 &&
            <PTradeForm coin={coin}></PTradeForm>
          }

          {coin?.status === 1 &&
            <div className="flex flex-col relative bg-transparent rounded-lg w-full max-w-[410px] font-semibold text-white">
              <div className={`flex flex-col gap-6 bg-[#FFFFFC] p-4 rounded-b-[24px] rounded-tr-[24px] shadow-sm`}>
                <div className="flex flex-col w-full h-full min-h-[200px] justify-center items-center">
                  <Image src={SuccessImg} alt="SuccessImg" width={100} height={100} className="w-full max-w-[100px] h-full max-h-[100px]" />
                </div>
                <div className="w-full text-[#090603] text-lg sm:text-xl text-center">Congratulations to all [{coin?.name || "Token"}{coin?.gameName && ` / ${coin.gameName}`}] adopters!</div>
                <div className="flex flex-col w-full justify-center items-center text-[#4B5563]">
                  <div className="text-xs sm:text-sm w-full text-center text-[#2B35E1]">{coin?.name || "Token"} is distributing to users!</div>
                  <div className="text-xs sm:text-sm w-full text-center">This token is transitioning from presale to live trading.</div>
                  <div className="text-xs sm:text-sm font-bold w-full text-center">Hang tight, trading will begin shortly.</div>
                </div>
              </div>
            </div>
          }

          {(coin?.status === 2 || coin?.status === 4) &&
            <div className="flex flex-col relative bg-transparent rounded-lg w-full max-w-[410px] font-semibold text-white">
              <div className={`flex flex-col gap-6 bg-[#FFFFFC] p-4 rounded-b-[24px] rounded-tr-[24px] shadow-sm`}>
                <div className="flex flex-col w-full h-full min-h-[200px] justify-center items-center">
                  <Image src={FailedImg} alt="FailedImg" width={100} height={100} className="w-full max-w-[100px] h-full max-h-[100px]" />
                </div>
                <div className="w-full text-[#090603] text-lg sm:text-xl text-center">We're sorry, [{coin?.name || "Token"} {coin?.gameName ? ` / ${coin.gameName}` : ""}] won't proceed to trading</div>
                <div className="flex flex-col w-full justify-center items-center text-[#4B5563]">
                  {coin?.status === 2 &&
                    <div className="text-xs sm:text-sm w-full text-center text-[#2B35E1]">{coin?.name || "Token"} is refunding to users!</div>
                  }
                  {coin?.status === 4 &&
                    <div className="text-xs sm:text-sm w-full text-center text-[#2B35E1]">Presale failed, refund was finished.</div>
                  }
                  <div className="text-xs sm:text-sm w-full text-center">Unfortunately, this token has not met the necessary requirements to proceed to live trading.</div>
                  <div className="text-xs sm:text-sm font-bold w-full text-center">Every presale purchase will be refunded.</div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
      {isLoading && <Spinner />}
    </div>
  );
}
