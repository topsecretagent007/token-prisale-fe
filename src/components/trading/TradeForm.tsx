'use client';

import { ChangeEvent, useContext, useEffect, useState } from "react";
import Image from "next/image";
import UserContext from "@/context/UserContext";
import { errorAlert, warningAlert } from "../others/ToastGroup";
import { getTokenBalance, swapTx } from "@/program/web3";
import { coinInfo } from "@/utils/types";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useSocket } from "@/contexts/SocketContext";
import WowGoToken from "@/../public/assets/images/wowgo.png";
import { Decimal } from "@/config/TextData";

interface TradingFormProps {
  coin: coinInfo;
}

export const TradeForm: React.FC<TradingFormProps> = ({ coin }) => {
  const { counter } = useSocket();
  const { swapLoading, setSwapLoading } = useContext(UserContext)
  const [buyAmount, setBuyAmount] = useState<number>(0);
  const [sellAmount, setSellAmount] = useState<number>(0);
  const [tradeType, setTradeType] = useState<number>(0);
  const [tokenBal, setTokenBal] = useState<number>(0);
  const { user } = useContext(UserContext);
  const wallet = useWallet();

  // Accepts either a ChangeEvent or a direct number value
  const handleInputChange = (e: ChangeEvent<HTMLInputElement> | number) => {
    let inpurValue: number;
    if (typeof e === "number") {
      inpurValue = e;
    } else {
      const value = e.target.value;
      inpurValue = parseFloat(value);
    }
    console.log("inpurValue--->", inpurValue)

    const k = coin?.quoteReserves * coin?.tokenReserves;
    console.log("k--->", k)

    if (!isNaN(inpurValue) && inpurValue > 0) {
      if (tradeType === 0) {
        setBuyAmount(inpurValue);
        const _tokenAmount = k / (coin?.quoteReserves + (inpurValue * (10 ** Number(Decimal))));
        console.log("_tokenAmount --->", _tokenAmount)

        const changeTokenAmount = (coin?.tokenReserves - _tokenAmount) / (10 ** Number(Decimal));
        console.log("changeTokenAmount --->", changeTokenAmount)

        setSellAmount(changeTokenAmount);
      } else {
        setSellAmount(inpurValue);
        const _solAmount = k / (coin?.tokenReserves + (inpurValue * (10 ** Number(Decimal))));
        const changeSolAmount = (coin?.quoteReserves - _solAmount) / (10 ** Number(Decimal));
        setBuyAmount(changeSolAmount);
      }
    } else {
      setBuyAmount(0);
      setSellAmount(0);
    }
  };

  const handleBuyAmount = (e: number) => {
    let _buyAmount = (buyAmount + e)
    handleInputChange(_buyAmount)
  }

  const handleSellAmount = (e: number) => {
    console.log("tokenBal", tokenBal)
    if (tokenBal === 0) {
      errorAlert("you dont have token.")
    }
    let _sellAmount = ((tokenBal / 100) * e);
    console.log("_sellAmount", _sellAmount)
    handleInputChange(_sellAmount)
  }

  const getBalance = async () => {
    try {
      const balance = await getTokenBalance(user.wallet, coin.token);
      console.log("balance", balance)
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
        let _amount = tradeType === 0 ? buyAmount : sellAmount;

        const data = await swapTx(mint, wallet, _amount, tradeType)
        setBuyAmount(0);
        setSellAmount(0);
        setSwapLoading(false)
      } catch (err) {
        console.log(err.data)
        errorAlert("Failed to swap!")
        setSwapLoading(false)
      }
    }
  }

  useEffect(() => {
    getBalance();
    console.log("socket coin  ==>", coin)
  }, [coin])

  useEffect(() => {
    console.log("socket  ==>", counter)
  }, [counter])

  useEffect(() => {
    setBuyAmount(0)
    setSellAmount(0)
  }, [tradeType])

  return (
    <div className="relative flex flex-col bg-transparent rounded-lg w-full max-w-[410px] font-semibold text-white">
      {swapLoading &&
        <div className="absolute top-0 left-0 flex flex-col gap-4 bg-black/35 p-6 rounded-lg md:rounded-b-[24px] md:rounded-tr-[24px] shadow-sm w-full h-full min-h-[400px] justify-center items-center backdrop-blur-md z-40">
          <p className="text-[#2B35E1] font-semibold">waiting swap...</p>
          <span className="trade-loader"></span>
        </div>
      }
      <div className="flex flex-row justify-start">
        <button className={`rounded-t-[24px] py-3 w-[133px] text-[#090603] ${tradeType === 0 ? 'bg-[#FFFFFC]' : 'bg-transparent'}`
        } onClick={() => setTradeType(0)}> Buy</button >
        <button className={`rounded-t-[24px] py-3 w-[133px] text-[#090603] ${tradeType === 1 ? 'bg-[#FFFFFC]' : 'bg-transparent'}`} onClick={() => setTradeType(1)}>
          Sell
        </button>
      </div >
      <div className={`${tradeType === 1 && "rounded-tl-[24px]"} flex flex-col gap-4 bg-[#FFFFFC] p-6 rounded-b-[24px] rounded-tr-[24px] shadow-sm`}>
        <div className="flex flex-col gap-2 w-full h-[190px]">
          <div className="flex flex-col justify-center items-start gap-1 w-full">
            <p className="font-semibold text-[#090603] text-[12px] text-start">You pay</p>
            <div className="flex flex-row items-center gap-3 p-3 border-[#E5E7EB] border-[1px] rounded-lg w-full">
              <Image src={tradeType === 0 ? WowGoToken : coin?.url} alt="WowGoToken" width={23} height={20} className="rounded-[4px] w-6 h-6" />
              <input
                type="number"
                id="setTrade"
                value={tradeType === 0 ? buyAmount || '' : sellAmount || ''}
                onChange={handleInputChange}
                pattern="\d*"
                className="bg-transparent rounded-l-md outline-none w-full text-[#090603] capitalize"
                placeholder="0.0"
                required
              />
              <div className={`${tradeType === 0 ? "bg-[#EEF4FF] text-[#2B35E1]" : "bg-[#090603] text-white"} flex flex-col  px-3 py-1 rounded-full font-semibold text-center`}>
                {tradeType === 0 ? '$WOWGO' : '$TICKER'}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center items-start gap-1 w-full">
            <p className="font-semibold text-[#090603] text-[12px] text-start">You receive</p>
            <div className="flex flex-row items-center gap-3 p-3 border-[#E5E7EB] border-[1px] rounded-lg w-full h-full">
              <Image src={tradeType === 0 ? coin?.url : WowGoToken} alt="WowGoToken" width={24} height={20} className="rounded-[4px] w-6 h-6" />
              <p className="bg-transparent rounded-l-md outline-none w-full text-[#090603] capitalize">{tradeType === 0 ? sellAmount : buyAmount}</p>
              <div className={`${tradeType === 0 ? "bg-[#090603] text-white" : "bg-[#EEF4FF] text-[#2B35E1]"} flex flex-col px-3 py-1 rounded-full font-semibold text-center`}>
                {tradeType === 0 ? '$TICKER' : '$WOWGO'}
              </div>
            </div>
            <p className="mt-1 font-semibold text-[#4B5563] text-[12px] text-start">*Transaction fees may apply.</p>
          </div>
        </div>

        {
          tradeType === 0 ? (
            <div className="flex xs:flex-row flex-col items-center gap-1 mx-auto xs:mx-0 py-2 text-sm text-center">
              <div className="flex flex-row px-5 py-2 border-[#2B35E1] border-[1px] rounded-lg max-w-[100px] font-semibold text-[#2B35E1] cursor-pointer" onClick={() => handleBuyAmount(10)}>+ $10</div>
              <div className="flex flex-row px-5 py-2 border-[#2B35E1] border-[1px] rounded-lg max-w-[100px] font-semibold text-[#2B35E1] cursor-pointer" onClick={() => handleBuyAmount(50)}>+ $50</div>
              <div className="flex flex-row px-5 py-2 border-[#2B35E1] border-[1px] rounded-lg max-w-[100px] font-semibold text-[#2B35E1] cursor-pointer" onClick={() => handleBuyAmount(100)}>+ $100</div>
              <div className="flex flex-row px-4 py-2 max-w-[100px] font-semibold text-[#2B35E1] cursor-pointer" onClick={() => setBuyAmount(0)}>Reset</div>
            </div>
          ) : (
            <div className="flex xs:flex-row flex-col items-center gap-1 mx-auto xs:mx-0 py-2 text-sm text-center">
              <button className="flex flex-row px-5 py-2 border-[#2B35E1] border-[1px] rounded-lg max-w-[100px] font-semibold text-[#2B35E1] cursor-pointer" onClick={() => handleSellAmount(10)}>10%</button>
              <button className="flex flex-row px-5 py-2 border-[#2B35E1] border-[1px] rounded-lg max-w-[100px] font-semibold text-[#2B35E1] cursor-pointer" onClick={() => handleSellAmount(50)}>50%</button>
              <button className="flex flex-row px-5 py-2 border-[#2B35E1] border-[1px] rounded-lg max-w-[100px] font-semibold text-[#2B35E1] cursor-pointer" onClick={() => handleSellAmount(100)}>100%</button>
              <button className="flex flex-row px-4 py-2 max-w-[100px] font-semibold text-[#2B35E1] cursor-pointer" onClick={() => handleSellAmount(0)}>Reset</button>
            </div>
          )}

        <button
          onClick={handlTrade}
          disabled={tradeType === 0 ? (!buyAmount || buyAmount <= 0) : (!sellAmount || sellAmount <= 0)}
          className={`${tradeType === 0 ? (!buyAmount || buyAmount <= 0) : (!sellAmount || sellAmount <= 0) ? "opacity-60 cursor-not-allowed" : "opacity-100 cursor-pointer"} justify-center items-center bg-[linear-gradient(180deg,_#86B3FD_0%,_#2B35E1_100%)] border-[#86B3FD] border-[3px] rounded-[12px] w-full h-11 font-semibold text-white`}
        >
          Connect Wallet to Trade
        </button>
      </div>
    </div >
  );
};
