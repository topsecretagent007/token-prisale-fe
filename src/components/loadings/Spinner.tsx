'use client'

import { FC } from "react";
import Image from "next/image";
import Logo from "@/../public/assets/logo-light.png"

const Spinner: FC = () => {
  return (
    <>
      <div className="z-50 fixed w-screen h-screen">
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-20 backdrop-blur-lg">
          <div className="relative flex flex-col items-center">
            <div className="flex flex-col justify-center items-center gap-4 bg-transparent h-full font-raleway text-center">
              <Image src={Logo} alt="Logo" width={140} height={140} className="rounded-full" />
              <span className="loader"></span>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default Spinner;

