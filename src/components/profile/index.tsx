"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { errorAlert, successAlert } from "@/components/others/ToastGroup";
import UserContext from "@/context/UserContext";
import { coinInfo, userInfo, WowgoTokenDataType } from "@/utils/types";
import { getCoinsInfoBy, getTokenPriceAndChange, getUser } from "@/utils/util";
import { useEffect, useState, useContext } from "react";
import { LuFileEdit } from "react-icons/lu";
import { MdContentCopy } from "react-icons/md";
import TestUser from "@/../public/assets/images/user-avatar.png"
import { IoIosArrowBack } from "react-icons/io";
import Spinner from "../loadings/Spinner";
import WowGoTokenIcon from "@/../public/assets/images/wowgo.png"
import { CreatedTokenCard } from "../cards/CreatedTokenCard";
import EditProfile from "./EditProfile";
import { getTokenBalance, quoteMint } from "@/program/web3";
import BuyWowGoModal from "../modals/BuyWowGoModal";
import { PresaleTokenCard } from "../cards/PresaleTokenCard";

export default function ProfilePage() {
  const { setProfileEditModal, profileEditModal, isLoading, setIsLoading, user, buyWowGoModalState, setBuyWowGoModalState } = useContext(UserContext);
  const { publicKey } = useWallet();
  const pathname = usePathname();
  const [param, setParam] = useState<string | null>(null);
  const [userData, setUserData] = useState<userInfo>({} as userInfo);
  const [wowgoTokenData, setWowgoTokenData] = useState<WowgoTokenDataType>();
  const [tokenBal, setTokenBal] = useState<number>(0);
  const [createdCoins, setCreatedCoins] = useState<coinInfo[]>([]);
  const [presaleCoins, setPresaleCoins] = useState<coinInfo[]>([]);
  const [allSeeCreatedToken, setAllSeeCreatedToken] = useState<boolean>();
  const [allSeePresaleCreatedToken, setAllSeePresaleCreatedToken] = useState<boolean>();
  const [copySuccess, setCopySuccess] = useState<string>("");
  const router = useRouter();

  const handleToRouter = (id: string) => {
    if (profileEditModal === true) {
      setProfileEditModal(false); // Close the edit modal if it's open
      return; // Prevent navigation if the modal is open
    }
    if (id.startsWith("http")) {
      window.location.href = id; // For external links
    } else {
      router.push(id); // For internal routing
    }
  };

  const fetchUserData = async (id: string) => {
    setIsLoading(true)
    try {
      const response = await getUser({ id });
      setUserData(response);
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching user:", error);
      setIsLoading(false)
    }
  };

  const fetchCoinsData = async (userId: string) => {
    try {
      const coinsBy: any = await getCoinsInfoBy(userId);
      console.log("coinsBy data ===>", coinsBy)
      const _createdTokenData = coinsBy.created.sort((a: { date: Date; }, b: { date: Date; }) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setCreatedCoins(_createdTokenData);
      setPresaleCoins(coinsBy.presales);

    } catch (error) {
      console.error("Error fetching coins:", error);
    }
  };

  const getWowgoTokenData = async () => {
    const getTokenData = await getTokenPriceAndChange(quoteMint?.toString())
    if (getTokenData && typeof getTokenData === 'object') {
      setWowgoTokenData(getTokenData);
    } else {
      setWowgoTokenData(undefined);
    }
  }

  const getBalance = async () => {
    try {
      const balance = await getTokenBalance(user.wallet, quoteMint.toString());
      console.log("balance", balance)
      setTokenBal(balance ? balance : 0);
    } catch (error) {
      setTokenBal(0);
    }
  }

  useEffect(() => {
    setUserData(user);
  }, [user])

  useEffect(() => {
    const segments = pathname.split("/");
    console.log("segments ==> ", segments)
    const id = segments[segments.length - 1];
    console.log("segments id ==> ", id)
    if (id && id !== param) {
      setParam(id);
      fetchUserData(id);
    }
  }, [pathname]);

  useEffect(() => {
    if (param) {
      getBalance();
      fetchCoinsData(param);
      getWowgoTokenData();
    }
  }, [param]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess("Copied!");
      successAlert("Copied to clipboard!");
    } catch (err) {
      setCopySuccess("Failed to copy!");
      errorAlert("Failed to copy!");
    }
  };

  return (
    <div className="flex flex-col gap-8 px-5 py-10 w-full h-full">
      <div onClick={() => handleToRouter("/")} className="flex flex-row items-center gap-2 pb-2 w-[100px] text-[#9CA3AF] text-sm cursor-pointer">
        <IoIosArrowBack />
        Back
      </div>
      {!profileEditModal ?
        <div className="flex flex-col justify-between items-start gap-4 w-full h-full">
          <div className="justify-start gap-6 grid">
            <div className="flex xs:flex-row flex-col justify-center items-center gap-6 mx-auto">
              <div className="flex flex-col rounded-full w-full">
                <Image
                  src={(user.avatar !== "https://scarlet-extra-cat-880.mypinata.cloud/" && user.avatar !== "" && user.avatar !== undefined && user.avatar !== null && user.avatar) ? userData.avatar : TestUser.src}
                  alt="Avatar"
                  width={104}
                  height={104}
                  className="mx-auto rounded-full w-[104px] h-[104px] object-cover"
                />
              </div>
              <div className="flex flex-col gap-4 w-full h-full font-bold text-[#090603]">
                <div className="flex flex-row justify-center xs:justify-start items-center gap-4 text-4xl">
                  {userData.name ? userData.name : publicKey?.toBase58().slice(0, 6)}
                  <LuFileEdit
                    onClick={() => setProfileEditModal(true)}
                    className="text-[#2B35E1] text-xl cursor-pointer"
                  />
                </div>
                <div className="flex flex-row justify-center items-center gap-4 bg-[#FFFFFC] mx-auto px-2 py-1 rounded-[24px] w-full object-cover overflow-hidden font-semibold text-[#1F2937]">
                  <p className="object-cover overflow-hidden truncate">{userData.wallet ? userData.wallet : publicKey?.toBase58().slice(0, 6) + "..." + publicKey?.toBase58().slice(-4)}</p>
                  <MdContentCopy
                    className="text-[#2B35E1] text-lg cursor-pointer"
                    onClick={() => copyToClipboard(userData.wallet)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-center items-start gap-4 w-full h-full">
            <div className="flex flex-col gap-4 w-full max-w-1/2 h-full">
              <div className="flex flex-col gap-4 bg-[#FFFFFC] p-6 rounded-[24px] w-full h-full">
                <div className="flex flex-col w-full font-semibold text-[#090603] text-[16px]">
                  $WOWGO  Balances
                </div>
                <div className="flex flex-row justify-between items-center gap-3 w-full">
                  <Image src={WowGoTokenIcon} alt="WowGoToken" width={40} height={40} className="flex flex-col w-10" />
                  <div className="flex flex-col w-full h-full font-bold text-[#090603] text-3xl text-start">
                    {
                      (tokenBal !== null || tokenBal !== undefined)
                        ? (() => {
                          const value = tokenBal * wowgoTokenData?.price;

                          if (value >= 1_000_000_000) {
                            return '$' + (value / 1_000_000_000).toFixed(2) + 'B'; // Billions
                          } else if (value >= 1_000_000) {
                            return '$' + (value / 1_000_000).toFixed(2) + 'M'; // Millions
                          } else if (value >= 1_000) {
                            return '$' + (value / 1_000).toFixed(2) + 'k'; // Thousands
                          } else {
                            return '$' + value.toFixed(2); // Less than 1000
                          }
                        })()
                        : "0.00"
                    }
                  </div>
                  <div className="flex flex-col text-[#4B5563] text-sm">
                    {
                      (tokenBal !== null || tokenBal !== undefined || wowgoTokenData?.price !== null || wowgoTokenData?.price !== undefined)
                        ? (() => {
                          const value = tokenBal * wowgoTokenData?.price;

                          if (value >= 1_000_000_000) {
                            return '≈$' + (value / 1_000_000_000).toFixed(2) + 'B'; // Billions
                          } else if (value >= 1_000_000) {
                            return '≈$' + (value / 1_000_000).toFixed(2) + 'M'; // Millions
                          } else if (value >= 1_000) {
                            return '≈$' + (value / 1_000).toFixed(2) + 'k'; // Thousands
                          } else {
                            return '$' + value.toFixed(2); // Less than 1000
                          }
                        })()
                        : "0.00"
                    }
                  </div>
                </div>
                <button
                  onClick={() => setBuyWowGoModalState(true)}
                  className="justify-center items-center bg-[linear-gradient(180deg,_#86B3FD_0%,_#2B35E1_100%)] opacity-100 border-[#86B3FD] border-[3px] rounded-[12px] w-[198px] h-11 font-semibold text-white cursor-pointer"
                >
                  Get $WOWGO
                </button>
              </div>

              {presaleCoins &&
                <div className="flex flex-col gap-4 bg-[#FFFFFC] p-6 rounded-[24px] w-full h-full">
                  <div className="flex flex-col w-full font-semibold text-[#090603] text-[16px]">
                    Tokens ({presaleCoins.length})
                  </div>

                  <div className="flex flex-col justify-between items-center gap-4 w-full h-full">
                    <div className="flex flex-row justify-between items-center w-full text-[#4B5563] text-sm">
                      <div className="flex flex-col w-full h-full text-start">
                        token
                      </div>
                      <div className="flex flex-col min-w-[64px] h-full text-start">
                        mcap
                      </div>
                      <div className="flex flex-col min-w-[64px] h-full text-end">
                        value
                      </div>
                    </div>

                    {
                      allSeePresaleCreatedToken ?
                        <div className="flex flex-col justify-between items-center gap-4 w-full h-full">
                          {presaleCoins?.map((_item: coinInfo, index: number) => (
                            <div key={index} onClick={() => {
                              if (_item.status === 0 || _item.status === 1 || _item.status === 2) {
                                handleToRouter(`/presaletrade/${_item.token
                                  }`);
                              } else if (_item.status === 3 || _item.status === 5) {
                                handleToRouter(`/ trading / ${_item.token}`);
                              }
                            }}
                              className='flex flex-col justify-between items-start w-full cursor-pointer shadow-sm'>
                              <PresaleTokenCard data={_item} wowgoToken={wowgoTokenData} />
                            </div>
                          ))}
                        </div>
                        :
                        <div className="flex flex-col justify-between items-center gap-4 w-full h-full">
                          {presaleCoins?.map((_item: coinInfo, index: number) => (
                            index < 3 && (
                              <div key={index} onClick={() => {
                                if (_item.status === 0 || _item.status === 1 || _item.status === 2) {
                                  handleToRouter(`/presaletrade/${_item.token}`);
                                } else if (_item.status === 3 || _item.status === 5) {
                                  handleToRouter(`/ trading / ${_item.token}`);
                                }
                              }}
                                className='flex flex-col justify-between items-start w-full cursor-pointer shadow-md rounded-xl'>
                                <PresaleTokenCard data={_item} wowgoToken={wowgoTokenData} />
                              </div>
                            )
                          ))}
                        </div>
                    }
                  </div>
                  {presaleCoins.length > 3 &&
                    <button
                      onClick={() => setAllSeePresaleCreatedToken(!allSeePresaleCreatedToken)}
                      className="justify-center items-center mx-auto h-11 font-semibold text-[#2B35E1] cursor-pointer"
                    >
                      {allSeePresaleCreatedToken ? "See Small" : "See More"}
                    </button>
                  }
                </div>
              }
            </div>
            {createdCoins &&
              <div className="flex flex-col gap-4 bg-[#FFFFFC] p-6 rounded-[24px] w-full max-w-1/2 h-full">
                <div className="flex flex-col w-full font-semibold text-[#090603] text-[16px]">
                  Created tokens ({createdCoins?.length})
                </div>

                {allSeeCreatedToken ?
                  <div className="flex flex-col justify-between items-center gap-4 w-full h-full">
                    {createdCoins?.map((_item: coinInfo, index: number) => (
                      <div key={index} onClick={() => {
                        if (_item.status === 0 || _item.status === 1 || _item.status === 2) {
                          handleToRouter(`/presaletrade/${_item.token
                            }`);
                        } else if (_item.status === 3 || _item.status === 5) {
                          handleToRouter(`/ trading / ${_item.token}`);
                        }
                      }}
                        className='flex flex-col justify-between items-start w-full cursor-pointer shadow-sm'>
                        <CreatedTokenCard data={_item} wowgoToken={wowgoTokenData} />
                      </div>
                    ))}
                  </div>
                  :
                  <div className="flex flex-col justify-between items-center gap-4 w-full h-full ">
                    {createdCoins?.map((_item: coinInfo, index: number) => (
                      index < 3 && (
                        <div key={index} onClick={() => {
                          if (_item.status === 0 || _item.status === 1 || _item.status === 2) {
                            handleToRouter(`/presaletrade/${_item.token}`);
                          } else if (_item.status === 3 || _item.status === 5) {
                            handleToRouter(`/ trading / ${_item.token}`);
                          }
                        }}
                          className='flex flex-col justify-between items-start w-full cursor-pointer shadow-sm'>
                          <CreatedTokenCard data={_item} wowgoToken={wowgoTokenData} />
                        </div>
                      )
                    ))}
                  </div>
                }
                {createdCoins.length > 3 &&
                  <button
                    onClick={() => setAllSeeCreatedToken(!allSeeCreatedToken)}
                    className="justify-center items-center mx-auto h-11 font-semibold text-[#2B35E1] cursor-pointer"
                  >
                    {allSeeCreatedToken ? "See Small" : "See More"}
                  </button>
                }
              </div>
            }
          </div>
        </div>
        :
        <EditProfile data={userData} />
      }

      {isLoading && <Spinner />}
      {buyWowGoModalState && <BuyWowGoModal />}
    </div>
  );
}
