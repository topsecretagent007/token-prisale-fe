"use client"

import React from 'react'
import { AdminSocialData } from '@/config/TextData'

export default function AdminSocialList() {
  return (
    <div className='flex flex-row items-center gap-4 w-[210px] text-[#9CA3AF]'>
      {AdminSocialData.map((item: any, index: number) => {
        return (
          <a href={`${item.url}`} key={index} className='flex flex-col rounded-full text-xl hover:text-white duration-300'>
            {item.icon}
          </a>
        )
      })}
    </div>
  )
}
