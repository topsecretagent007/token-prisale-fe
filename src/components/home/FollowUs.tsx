'use client'

import { AdminSocialData } from '@/config/TextData'
import UserContext from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import React, { useContext } from 'react'

export default function FollowUs() {
  const { setIsLoading } = useContext(UserContext);
  const router = useRouter()

  const handleToRouter = (id: string) => {
    setIsLoading(true)
    router.push(id)
  }
  return (
    <div className="bg-[#090603] py-20 w-full h-full">
      <div className="z-20 mx-auto w-full max-w-[1240px] h-full">
        <div className="flex flex-row justify-center items-center px-4 w-full h-full">
          <div className="flex flex-col justify-center items-start gap-6 h-full">
            <p className="font-bole text-[#FEFAF0] text-3xl">
              Start your own project today!
            </p>
            <div className="flex flex-row justify-start items-center gap-4">
              <div onClick={() => handleToRouter('/create-coin')} className="flex flex-row justify-center items-center gap-2 bg-gradient-to-b from-[#86B3FD] to-[#2B35E1] px-16 py-3 border-[#86B3FD] border-[3px] rounded-[12px] font-semibold text-white text-xl cursor-pointer">
                Create a Token
              </div>
              <p className="flex flex-row justify-center items-center w-full max-w-[304px] text-[#9CA3AF] text-base">
                Just connect a wallet, create your token, and have fun!
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 w-full max-w-[260px] h-full">
            <div className="flex flex-col justify-center items-center gap-2 bg-[radial-gradient(85.4%_100%_at_50.16%_0%,_#FFF8E8_0%,_#FCD582_100%)] rounded-full w-1 h-[135px]">

            </div>
          </div>
          <div className="flex flex-col items-start gap-4 w-[130px] h-full">
            <p className="text-[#FEFAF0] text-xl">
              Follow Us
            </p>
            <div className="flex flex-col justify-center items-start gap-2 w-full h-full">
              {AdminSocialData.map((item) => (
                <div key={item.id} className="flex flex-row justify-center items-center gap-2">
                  <div className="text-[#FFFFFC] hover:text-white text-base transition-colors duration-300">
                    {item.icon}
                  </div>
                  <p className="text-[#9CA3AF]">
                    {item.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
