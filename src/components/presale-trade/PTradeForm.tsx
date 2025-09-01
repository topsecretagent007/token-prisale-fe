'use client'

import { errorAlert, warningAlert } from "../others/ToastGroup";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import UserContext from "@/context/UserContext";
import { getTokenBalance, presaleBuyTx } from "@/program/web3";
import { coinInfo } from "@/utils/types";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import Image from "next/image";
import WowGoToken from "@/../public/assets/images/wowgo.png";
import NoImage from "@/../public/assets/images/no-image.png";
import { Decimal, PresaleTarget } from "@/config/TextData";

interface TradingFormProps {
  coin: coinInfo;
}

export const PTradeForm: React.FC<TradingFormProps> = ({ coin }) => {
  const { user, swapLoading, setSwapLoading, } = useContext(UserContext);
  const wallet = useWallet();
  const [buyAmount, setBuyAmount] = useState<number>(0);
  const [token, setToken] = useState<string>('');
  const [tokenBal, setTokenBal] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<string>('Loading...');

  const handleBuyInputChange = (e: ChangeEvent<HTMLInputElement> | string) => {
    let val: string;
    if (typeof e === "string") {
      val = e;
    } else {
      val = e.target.value;
    }
    let value = parseFloat(val);

    const k = coin?.quoteReserves * coin?.tokenReserves;

    if (!isNaN(value) && value > 0) {
      setBuyAmount(value);
      const _tokenAmount = k / (coin?.quoteReserves + (value * (10 ** Number(Decimal))));
      const changeTokenAmount = (coin?.tokenReserves - _tokenAmount) / (10 ** Number(Decimal));
      setToken(changeTokenAmount.toFixed(6).toString());

    } else {
      setBuyAmount(0);
      setToken('');
    }
  };

  const handleBuyAmount = (e: number) => {
    let _buyAmount = (buyAmount + e)
    setBuyAmount(_buyAmount)
  }

  const getBalance = async () => {
    try {
      const balance = await getTokenBalance(user.wallet, coin.token);
      setTokenBal(balance ? balance : 0);
    } catch (error) {
      setTokenBal(0);
    }
  }

  const handlTrade = async () => {
    if (user.wallet === undefined || user.wallet === null || user.wallet === "") {
      warningAlert("Connect your wallet!")
      return
    } else {
      setSwapLoading(true)
      try {
        const mint = new PublicKey(coin.token)
        if (coin.status === 0) {
          const data = await presaleBuyTx(mint, wallet, buyAmount)
        } else {

        }
        setBuyAmount(0);
        setSwapLoading(false)
      } catch (err) {
        console.log(err)
        errorAlert(err?.message)
        setSwapLoading(false)
      }
    }
  }

  useEffect(() => {
    getBalance();

    if (!coin?.date) return;

    const countdownInterval = setInterval(() => {
      const target = new Date(coin.date);
      target.setHours(target.getHours() + 48); // ✅ add 48 hours to the target

      const current = new Date();
      const timeDifference = target.getTime() - current.getTime();

      if (timeDifference <= 0) {
        clearInterval(countdownInterval);
        setTimeLeft("Time is up!");
      } else {
        const totalSeconds = Math.floor(timeDifference / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        setTimeLeft(`${hours} hours ${minutes} mins ${seconds} secs`);
      }
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [coin]);

  return (
    <div className="flex flex-col relative bg-transparent rounded-lg w-full max-w-[410px] font-semibold text-white shadow-md">
      {swapLoading &&
        <div className="absolute top-0 left-0 flex flex-col gap-4 bg-black/35 p-6 rounded-lg md:rounded-b-[24px] md:rounded-tr-[24px] shadow-sm w-full h-full min-h-[400px] justify-center items-center backdrop-blur-md z-40">
          <p className="text-[#2B35E1] font-semibold">waiting swap...</p>
          <span className="trade-loader"></span>
        </div>
      }
      <div className={`flex flex-col gap-4 bg-[#FFFFFC] p-6 rounded-lg md:rounded-b-[24px] md:rounded-tr-[24px] shadow-sm`}>
        <div className="flex flex-col gap-2 w-full justify-center items-start">
          <div className="flex flex-row gap-2 justify-between items-center w-full ">
            <p className="text-[#090603] text-base font-semibold">Presale</p>
            <div className="w-full flex flex-col relative justify-center items-start border-[2px] border-[#F4A16F] h-[26px] rounded-full bg-[#FFF8E8] object-cover overflow-hidden">
              <p className="text-black px-4 text-sm z-10">{(((coin?.progressPresale / (10 ** Number(Decimal))) / parseFloat(PresaleTarget)) * 100).toFixed(2)}%</p>
              <div
                className="flex flex-col absolute top-0 left-0 h-[26px] bg-gradient-to-t from-[#FCD582] to-[#FFF8E8]"
                style={{ width: `${(((coin?.progressPresale / (10 ** Number(Decimal))) / parseFloat(PresaleTarget)) * 100).toFixed(2)}%` }}
              ></div>
            </div>
            <p className="text-[#090603] text-sm px-3 py-1 rounded-full bg-[#E5E7EB] justify-center items-center flex flex-row gap-1 font-semibold">
              <Image src={WowGoToken} alt="WowGoToken" width={12} height={12} className="w-4 h-4" />
              {coin?.progressPresale / (10 ** Number(Decimal))}
            </p>
          </div>
          <div className="flex flex-row gap-3 items-center justify-start w-full text-start text-[#4B5563] text-xs">
            Time left: <strong>{timeLeft}</strong>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full h-[190px]">
          <div className="flex flex-col justify-center items-start gap-1 w-full">
            <p className="font-semibold text-[#090603] text-[12px] text-start">You pay</p>
            <div className="flex flex-row items-center gap-3 p-3 border-[#E5E7EB] border-[1px] rounded-lg w-full">
              <Image src={WowGoToken} alt="WowGoToken" width={24} height={24} className="rounded-[4px] w-6 h-6" />
              <input
                type="number"
                id="setTrade"
                value={buyAmount || ''}
                onChange={handleBuyInputChange}
                pattern="\d*"
                className="bg-transparent rounded-l-md outline-none w-full text-[#090603] capitalize"
                placeholder="0.0"
                required
                min={0.001}
                max={95}
              />
              <div className={`flex flex-col bg-[#EEF4FF] text-[#2B35E1] px-3 py-1 rounded-full font-semibold text-center`}>
                $WOWGO
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center items-start gap-1 w-full">
            <p className="font-semibold text-[#090603] text-[12px] text-start">You receive</p>
            <div className="flex flex-row items-center gap-3 p-3 border-[#E5E7EB] border-[1px] rounded-lg w-full h-full">
              <Image src={coin.url || NoImage} alt="WowGoToken" width={24} height={24} className="rounded-[4px] w-6 h-6" />
              <p className="bg-transparent rounded-l-md outline-none w-full text-[#090603] capitalize">{(buyAmount * 10000) || "0.00"}</p>
              <div className={`flex flex-col bg-[#090603] text-white px-3 py-1 rounded-full font-semibold text-center`}>
                $TICKER
              </div>
            </div>
            <p className="mt-1 font-semibold text-[#4B5563] text-[12px] text-start">*Transaction fees may apply. You will receive this token after it graduated from presale period.</p>
          </div>
        </div>

        <div className="flex xs:flex-row flex-col items-center gap-1 mx-auto xs:mx-0 pt-5 pb-2 text-sm text-center">
          <div className="flex flex-row px-5 py-2 border-[#2B35E1] border-[1px] rounded-lg max-w-[100px] font-semibold text-[#2B35E1] cursor-pointer" onClick={() => handleBuyAmount(10)}>+ $10</div>
          <div className="flex flex-row px-5 py-2 border-[#2B35E1] border-[1px] rounded-lg max-w-[100px] font-semibold text-[#2B35E1] cursor-pointer" onClick={() => handleBuyAmount(50)}>+ $50</div>
          <div className="flex flex-row px-5 py-2 border-[#2B35E1] border-[1px] rounded-lg max-w-[100px] font-semibold text-[#2B35E1] cursor-pointer" onClick={() => handleBuyAmount(100)}>+ $100</div>
          <div className="flex flex-row px-4 py-2 max-w-[100px] font-semibold text-[#2B35E1] cursor-pointer" onClick={() => handleBuyAmount(0)}>Reset</div>
        </div>

        <button
          onClick={handlTrade}
          disabled={!buyAmount || buyAmount <= 0}
          className={`${(!buyAmount || buyAmount <= 0) ? "opacity-60 cursor-not-allowed" : "opacity-100 cursor-pointer"} justify-center items-center bg-[linear-gradient(180deg,_#86B3FD_0%,_#2B35E1_100%)] border-[#86B3FD] border-[3px] rounded-[12px] w-full h-11 font-semibold text-white`}
        >
          Buy $TICKER
        </button>
      </div>

    </div >
  );
};
