"use client"

import { coinInfo } from "@/utils/types";
import { getCoinsInfo } from "@/utils/util";
import { FC, useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

interface TokenDataProps {
  setData: React.Dispatch<React.SetStateAction<coinInfo[]>>;
}

interface FilterType {
  id: string;
  text: string;
}

const TokenFilterText = [
  { id: "all token", text: "All Token" },
  { id: "presale", text: "Presale" },
  { id: "live tokens", text: "Live Tokens" },
  { id: "popular", text: "Popular" },
];

const TokenDataFilterText = [
  { id: "all token", text: "All Token" },
  { id: "most recent", text: "Most Recent" },
  { id: "last trade", text: "Last Trade" },
  { id: "most popular", text: "Creation time" },
]

const FilterListButton: FC<TokenDataProps> = ({ setData }) => {
  const menuDropdown = useRef<HTMLDivElement | null>(null);
  const [tokenFilter, setTokenFilter] = useState<FilterType>();
  const [tokenDataFilter, setTokenDataFilter] = useState<FilterType>();
  const [tokenFilterModalState, setTokenFilterModalState] = useState<boolean>(false);
  const [tokenDataFilterModalState, setTokenDataFilterModalState] = useState<boolean>(false);
  const [originData, setOriginData] = useState<coinInfo[]>([])

  const getData = async () => {
    const coins = await getCoinsInfo();
    if (coins) {
      coins.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setOriginData(coins)
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleTokenFilterSelection = (e: FilterType) => {
    let sortedData = [...originData]; // Create a new array to prevent direct state mutation
    setTokenFilter(e);
    setTokenFilterModalState(false);

    // Adjust the filtering conditions based on the selected filter
    if (e.id === "all token") {
      sortedData = originData; // No filtering, just return the original data
    } else if (e.id === "presale") {
      sortedData = sortedData.filter(
        (item) => item.status === 0 || item.status === 1 || item.status === 2 // Filter for presale
      );
    } else if (e.id === "live tokens") {
      sortedData = sortedData.filter(
        (item) => item.status === 3 || item.status === 5 // Filter for live tokens
      );
    } else if (e.id === "popular") {
      sortedData = sortedData.filter(
        (item) => item.status === 5 // Filter for popular tokens
      );
    }

    setData(sortedData); // Update state with the filtered or original data
  };

  const handleTokenDataFilterSelection = (e: FilterType) => {
    let sortedData = [...originData]; // Create a new array to prevent direct state mutation
    setTokenDataFilter(e);
    setTokenDataFilterModalState(false);

    if (e.id === "all token") {
      sortedData = [...originData]; // No filtering, just return the original data
    } else if (e.id === "most recent" || e.id === "last trade") {
      sortedData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (e.id === "most popular") {
      sortedData = sortedData.filter((item) => item.status === 3 || item.status === 5); // Filter for trading
      sortedData.sort((a, b) => b.marketcap - a.marketcap); // Sort by market cap for popularity
    }
    setData(sortedData);
  };

  useEffect(() => {
    setTokenFilter({ id: "all token", text: "All Token" });
    setTokenDataFilter({ id: "all token", text: "All Token" });
    setTokenFilterModalState(false);
    setTokenDataFilterModalState(false);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuDropdown.current && !menuDropdown.current.contains(event.target as Node)) {
        setTokenFilterModalState(false);
        setTokenDataFilterModalState(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuDropdown]);

  return (
    <div ref={menuDropdown} className="flex xs:flex-row flex-col justify-end items-center gap-3 w-full">
      <div className="flex flex-row justify-center items-center relative">
        <div onClick={() => setTokenFilterModalState(true)} className="flex flex-row justify-center items-center gap-2 bg-[#FFFFFC] px-4 py-3 rounded-[8px] text-[#2B35E1] cursor-pointer shadow-sm">
          <p className="font-semibold text-base duration-300">{tokenFilter?.text}</p>
          <FaChevronDown className={`${tokenFilterModalState ? "rotate-180" : "rotate-0"} duration-300`} />
        </div>
        <div className={`${tokenFilterModalState ? "h-[144px] py-3" : "h-0"} absolute top-12 left-0 flex flex-col justify-start items-center gap-2 w-full px-2 rounded-lg bg-[#FFFFFC] shadow-sm object-cover overflow-hidden duration-300`}>
          {TokenFilterText.map((item: FilterType, index: number) => (
            <div key={index} onClick={() => handleTokenFilterSelection(item)} className="w-full h-full flex flex-col text-[#2B35E1] cursor-pointer">
              {item?.text}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-row justify-center items-center relative">
        <div onClick={() => setTokenDataFilterModalState(true)} className="flex flex-row justify-center items-center gap-2 bg-[#FFFFFC] px-4 py-3 rounded-[8px] text-[#2B35E1] cursor-pointer shadow-sm">
          <p className="font-semibold text-base duration-300">{tokenDataFilter?.text}</p>
          <FaChevronDown className={`${tokenDataFilterModalState ? "rotate-180" : "rotate-0"} duration-300`} />
        </div>
        <div className={`${tokenDataFilterModalState ? "h-[144px] py-3" : "h-0"} absolute top-12 left-0 flex flex-col justify-start items-center gap-2 w-full px-2 rounded-lg bg-[#FFFFFC] shadow-sm object-cover overflow-hidden duration-300`}>
          {TokenDataFilterText.map((item: FilterType, index: number) => (
            <div key={index} onClick={() => handleTokenDataFilterSelection(item)} className="w-full h-full flex flex-col text-[#2B35E1] cursor-pointer">
              {item?.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterListButton;
