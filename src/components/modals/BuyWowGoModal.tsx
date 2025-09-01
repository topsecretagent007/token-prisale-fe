'use client'

import React, { useContext, useEffect, useState } from 'react'
import Image from 'next/image'
import { FaAngleDown } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import DogImage from "@/../public/assets/images/dog.png"
import TokenImage from "@/../public/assets/images/wowgo.png"
import SolImage from "@/../public/assets/images/sol.png"
import UserContext from '@/context/UserContext';
import { WowgoTokenDataType } from '@/utils/types';
import { getTokenPriceAndChange } from '@/utils/util';
import { buyWowgoTokenSwap, quoteMint } from '@/program/web3';
import { useWallet } from '@solana/wallet-adapter-react';
import { errorAlert, warningAlert } from '../others/ToastGroup';

export default function BuyWowGoModal() {
  const { setBuyWowGoModalState, solPrice, setIsLoading } = useContext(UserContext);
  const [inputAmount, setInputAmount] = useState<number>(0); // State to handle the input value
  const [tokenAmount, setTokenAmount] = useState<number>(0)
  const [wowgoTokenData, setWowgoTokenData] = useState<WowgoTokenDataType>();
  const wallet = useWallet();

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputAmount(Number(e.target.value));
    const _tokenAmount = (Number(e.target.value) * solPrice) / wowgoTokenData?.price;
    setTokenAmount(_tokenAmount)
  };

  const getWowgoTokenData = async () => {
    const getTokenData = await getTokenPriceAndChange(quoteMint?.toString())
    if (getTokenData && typeof getTokenData === 'object') {
      setWowgoTokenData(getTokenData);
    } else {
      setWowgoTokenData(undefined);
    }
  }

  const buyWowgoToken = async () => {
    console.log("buy wowgo token")
    if (!wallet.publicKey) {
      warningAlert("Connect your wallet!")
      return
    }

    if (inputAmount <= 0) {
      warningAlert("Please input sol amount!")
      return
    }

    setIsLoading(true)
    try {
      const data = await buyWowgoTokenSwap(inputAmount, wallet)
      setInputAmount(0);
      setTokenAmount(0);
      setIsLoading(false)
    } catch (err) {
      console.log(err.data)
      errorAlert("Failed to swap!")
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getWowgoTokenData();
  }, [])

  return (
    <div className='z-40 fixed inset-0 flex justify-center items-center bg-[#090603]/80 backdrop-blur-md w-full'>
      <div className="relative flex flex-col gap-6 bg-[radial-gradient(85.4%_100%_at_50.16%_0%,_#FFF8E8_0%,_#FCD582_100%)] p-6 border-[#FCD582] border-[4px] rounded-[32px] w-full max-w-[300px] sm:max-w-[442px] text-[#0B0E0C]">
        <div onClick={() => setBuyWowGoModalState(false)} className='top-0 right-[-60px] absolute flex flex-col justify-center items-center bg-[#FFFFFC] border-[#FCD582] border-[4px] rounded-full w-11 h-11 text-xl cursor-pointer'>
          <IoClose />
        </div>

        <div className='flex flex-row justify-center items-center gap-5 w-full h-full'>
          <Image src={DogImage} alt='DogImage' width={44} height={44} className='w-11 h-11' />
          <div className='relative flex flex-row justify-between items-center gap-2 bg-[#FEFAF0] shadow-sm px-4 py-3 rounded-[12px] w-full h-full'>
            <p className="font-bold text-[#292E2C] text-[32px]">BUY</p>
            <Image src={TokenImage} alt='TokenImage' width={44} height={44} className='w-11 h-11' />
            <p className="font-bold text-[#292E2C] text-[32px]">$WOWGO</p>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center gap-3 w-full h-full">
          <div className="flex flex-col justify-start items-start gap-2 w-full">
            <p className="w-full font-bold text-[#0B0E0C] text-[12px] text-start">You pay</p>
            <div className='flex flex-row justify-between items-center gap-3 w-full h-full'>
              <div className='flex flex-row justify-center items-center gap-2 bg-[#FEFAF0] shadow-sm p-2 rounded-[8px] min-w-[96px]'>
                <Image src={SolImage} alt='SolImage' width={20} height={20} className='w-5 h-5' />
                <p className="font-bold text-[#0B0E0C] text-sm">SOL</p>
                <FaAngleDown />
              </div>
              <div className='flex flex-row justify-center items-center gap-2 bg-[#FEFAF0] shadow-sm p-2 rounded-[8px] w-full'>
                <Image src={SolImage} alt='SolImage' width={20} height={20} className='w-5 h-5' />
                <input
                  type='number'
                  value={inputAmount} // Bind the input value to the state
                  onChange={handleInputChange} // Update the state when input changes
                  placeholder='0.00'
                  className='bg-transparent outline-none w-full'
                />
                <p className="font-bold text-[#0B0E0C] text-sm">SOL</p>
                <FaAngleDown className='min-w-[14px]' />
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-start items-start gap-2 w-full">
            <p className="w-full font-bold text-[#0B0E0C] text-[12px] text-start">You receive</p>
            <div className='flex flex-row justify-between items-center gap-3 shadow-sm w-full h-full'>
              <div className='flex flex-row justify-center items-center gap-2 bg-[#FEFAF0] px-2 py-3 rounded-[8px] w-full'>
                <Image src={TokenImage} alt='TokenImage' width={20} height={20} className='w-5 h-5' />
                <div className='flex flex-col w-full font-bold'>
                  {tokenAmount}
                </div>
                <p className="font-bold text-[#0B0E0C] text-sm">$WOWGO</p>
              </div>
            </div>
          </div>
        </div>

        <div className='flex flex-col justify-center items-center gap-2 w-full h-full'>
          <button
            onClick={() => buyWowgoToken()}
            className="justify-center items-center bg-[linear-gradient(180deg,_#86B3FD_0%,_#2B35E1_100%)] opacity-100 border-[#86B3FD] border-[3px] rounded-[12px] w-full h-11 font-semibold text-white cursor-pointer"
          >
            Buy $WOWGO
          </button>
          <p className="w-full font-semibold text-[#292E2C] text-[12px] text-center">
            *Transaction fees may apply.
          </p>
        </div>
      </div>
    </div>
  )
}
