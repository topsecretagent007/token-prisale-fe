"use client";

import { FC, useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { coinInfo } from "@/utils/types";
import FilterListButton from "../others/FilterListButton";

interface TokenDataProps {
  firstData: coinInfo[];
  tokenData: coinInfo[];
  setData: React.Dispatch<React.SetStateAction<coinInfo[]>>;
}

const FilterList: FC<TokenDataProps> = ({ firstData, tokenData, setData }) => {
  const [token, setToken] = useState("");

  const searchToken = (value: string) => {
    if (!value.trim()) {
      setData(tokenData); // Reset to original list if input is empty
      return;
    }

    const filteredData = tokenData.filter((item) =>
      Object.keys(item).some((key) => {
        const propertyValue = item[key as keyof coinInfo];

        // Only check string, number, or date properties
        if (typeof propertyValue === "string" || typeof propertyValue === "number" || propertyValue instanceof Date) {
          return propertyValue.toString().toLowerCase().includes(value.toLowerCase());
        }

        return false;
      })
    );

    setData(filteredData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setToken(value);
    searchToken(value); // Trigger filtering on each input change
  };

  return (
    <div className="flex flex-col gap-4 px-2 pt-4 w-full h-full text-[#fdd52f]">
      <div className="flex flex-row justify-between items-center gap-4 w-full h-full">
        <div className="flex flex-row justify-start items-center gap-4">
          <p className="font-semibold text-[#090603] text-xl">
            Token
          </p>
          <div className="flex flex-row items-center gap-1 bg-[#FFFFFC] pl-2 border-[#E5E7EB] border-[1px] rounded-[8px] w-full max-w-[420px] object-cover overflow-hidden text-[#9CA3AF] text-sm">
            <BiSearchAlt className="text-2xl" />
            <input
              type="text"
              value={token}
              placeholder="Search for Token"
              onChange={handleInputChange}
              className="flex flex-col bg-transparent py-1 outline-none w-full min-w-[300px] h-11"
            />
          </div>
        </div>

        <div className="flex md:flex-row flex-col gap-3 mx-auto w-full">
          <FilterListButton setData={setData} />
        </div>
      </div >
    </div >
  );
};

export default FilterList;
