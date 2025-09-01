"use client"

import React from 'react'
import Image from 'next/image'
import { FooterWildGo, FooterWildZoo, FooterWowGo } from '@/config/TextData'
import Logo from '@/../public/assets/images/logo.png'
import AdminSocialList from '../others/AdminSocialList'

export default function Footer() {
  return (
    <div className='relative flex flex-col justify-center items-center bg-[#090603] py-10 border-[#1F2937] border-t-[1px] w-full h-full'>
      <div className='mx-auto px-5 w-full max-w-[1240px] h-full'>
        <div className='flex flex-col justify-center items-start gap-8 w-full h-full'>
          <Image src={Logo} alt='Logo' width={80} height={80} className='w-20 h-20' />
          <div className='flex flex-col md:flex-row gap-2 justify-between items-center w-full h-full'>
            <div className='flex flex-row justify-between md:justify-start items-start gap-20 w-full h-full'>
              <div className='flex flex-col justify-center items-start gap-1'>
                <p className='font-semibold text-[#F9FAFB] text-[12px]'>WildZOO</p>
                <div className='flex flex-col justify-center items-start gap-1 text-[#9CA3AF] text-sm'>
                  {FooterWildZoo.map((item) => (
                    <p key={item.id} className='text-[#9CA3AF] text-[12px] hover:text-white transition-colors duration-300 cursor-pointer'>
                      {item.name}
                    </p>
                  ))}
                </div>
              </div>

              <div className='flex flex-col justify-center items-start gap-1'>
                <p className='font-semibold text-[#F9FAFB] text-[12px]'>WOWGO</p>
                <div className='flex flex-col justify-center items-start gap-1 text-[#9CA3AF] text-sm'>
                  {FooterWowGo.map((item) => (
                    <p key={item.id} className='text-[#9CA3AF] text-[12px] hover:text-white transition-colors duration-300 cursor-pointer'>
                      {item.name}
                    </p>
                  ))}
                </div>
              </div>

              <div className='flex flex-col justify-center items-start gap-1'>
                <p className='font-semibold text-[#F9FAFB] text-[12px]'>WILDGO Ecosystem</p>
                <div className='flex flex-col justify-center items-start gap-1 text-[#9CA3AF] text-sm'>
                  {FooterWildGo.map((item) => (
                    <p key={item.id} className='text-[#9CA3AF] text-[12px] hover:text-white transition-colors duration-300 cursor-pointer'>
                      {item.name}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            <div className='flex flex-row md:flex-col justify-between md:justify-center items-center md:items-start w-full md:w-[180px] gap-14 h-full'>
              <AdminSocialList />
              <div className='flex flex-col justify-center items-start gap-1 text-[#9CA3AF] text-sm'>
                <p className='text-[#9CA3AF] text-[12px]'>Media & Investor</p>
                <p className='text-[#9CA3AF] text-[12px]'>contact@wildcoin.ai</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
