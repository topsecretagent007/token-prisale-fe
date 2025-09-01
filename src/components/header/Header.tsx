"use client"
import { FC, useContext, useEffect, useState } from "react";
import { ConnectButton } from "../buttons/ConnectButton";
import { useRouter } from "next/navigation";
import { PROGRAM_ID_IDL } from "@/program/programId";
import { AgentsLandListener } from "@/program/logListeners/AgentsLandListener";
import { connection } from "@/program/web3";
import { SwapInfo } from "@/utils/types";
import Image from "next/image";
import Logo from "@/../public/assets/logo-light.png"
import UserContext from "@/context/UserContext";
import { useSocket } from "@/contexts/SocketContext";
import BuyWowGoModal from "../modals/BuyWowGoModal";
import { useWallet } from "@solana/wallet-adapter-react";

interface coinInfo {
  creator: string;
  name: string;
  url: string;
  ticker: string;
  reserveOne: number;
  reserveTwo: number;
  token: string;
  commit: string;
  marketcap?: number;
  quoteReserves?: number;
  tokenReservests: any[];
}

const Header: FC = () => {
  const { updateCoin, setUpdateCoin, setIsLoading, buyWowGoModalState, setBuyWowGoModalState } = useContext(UserContext);
  const { newToken } = useSocket();
  const router = useRouter()
  const { publicKey } = useWallet();

  const handleToRouter = (id: string) => {
    setIsLoading(true)
    setCurrentPage(id);
    router.push(id)
  }
  const [latestCreatedToken, setLatestCreatedToken] = useState<coinInfo | null>(null);
  const [latestSwapInfo, setLatestSwapInfo] = useState<SwapInfo>(undefined);
  const [currentPage, setCurrentPage] = useState<string>("/");

  useEffect(() => {
    const path = window.location.pathname;
    console.log("path--->", path);
    setCurrentPage(path);
  }, []);

  useEffect(() => {
    if (newToken) {
      if (newToken && typeof newToken === 'object') {
        console.log("newToken ===>", newToken)
        setLatestCreatedToken(newToken as unknown as coinInfo);
        setTimeout(() => {
          setLatestCreatedToken(null);
        }, 3000);
      }
    }
  }, [newToken]);

  useEffect(() => {
    const listener = new AgentsLandListener(connection);

    listener.setProgramLogsCallback('Launch', (basicTokenInfo: any) => {
      const newCoinInfo: coinInfo = {
        creator: basicTokenInfo.creator,
        name: basicTokenInfo.metadata.name,
        url: basicTokenInfo.metadata.json.image ?? basicTokenInfo.metadata.uri,
        ticker: basicTokenInfo.metadata.symbol,
        reserveOne: 0,
        reserveTwo: 0,
        token: basicTokenInfo.mintAddress,
        commit: '',
        marketcap: 0,
        quoteReserves: 0,
        tokenReservests: [],

      };
      console.log("new coin info: ", newCoinInfo)
      setLatestCreatedToken(newCoinInfo);

      setTimeout(() => {
        setLatestCreatedToken(undefined);
      }, 3000);
    });

    listener.setProgramLogsCallback('Swap', (swapInfo: SwapInfo) => {

      console.log(swapInfo)
      setLatestSwapInfo(swapInfo);
      setUpdateCoin(!updateCoin)

      setTimeout(() => {
        setLatestSwapInfo(undefined);
      }, 3000);
    })

    const subId = listener.subscribeProgramLogs(PROGRAM_ID_IDL.toBase58());

    return () => {
      connection.removeOnLogsListener(subId);
    }
  }, []);

  return (
    <div className="flex flex-col justify-center items-center bg-[#090603] w-full h-[80px]">
      <div className="container">
        <div className="flex flex-row justify-between items-center px-5 w-full h-full">
          <div className="flex flex-row items-center gap-8">
            <Image src={Logo} alt="Logo" width={64} height={64} onClick={() => handleToRouter('/')} className="flex flex-col justify-center items-center w-16 h-16 cursor-pointer" />
            <div className="flex flex-row justify-start items-center gap-4">
              <div onClick={() => setBuyWowGoModalState(true)} className="font-semibold text-white hover:text-[#FCD582] text-base cursor-pointer">
                Get $WOWGO
              </div>
            </div>
            {/* {latestSwapInfo &&
              <div>
                <div className="flex flex-col gap-1 px-4 py-2 border-[#fdd52f] border-[1px] rounded-md font-medium">
                  <div className="flex flex-col gap-1">
                    <span className="text-[#fdd52f] text-[12px]">
                      <strong className={`${latestSwapInfo.direction === "Sold" ? "text-green-600" : "text-red-600"}`}>{`${latestSwapInfo.direction === "Sold" ? "Buy" : "Sell"}`}</strong>: {new PublicKey(latestSwapInfo.creator).toBase58().slice(0, 9)}...
                      {new PublicKey(latestSwapInfo.creator).toBase58().slice(-9)}
                    </span>
                    <div className="flex flex-row items-center gap-2 w-full">
                      <Image src={latestSwapInfo.mintUri} alt="latestSwapInfo" width={30} height={30} style={{ width: '30px', height: '30px', marginRight: '10px', borderRadius: '50%' }} />
                      <span className="text-[#fdd52f] text-[12px]">{`${(latestSwapInfo.solAmountInLamports / LAMPORTS_PER_SOL)} SOL of ${latestSwapInfo.mintSymbol}`}</span>
                    </div>
                  </div>
                </div>
              </div>
            }
            {latestCreatedToken &&
              <div>
                <div className="flex flex-col px-4 py-2 border-[#fdd52f] border-[1px] rounded-md font-medium">
                  <div className="flex flex-col gap-1">
                    <span className="text-[#fdd52f] text-[12px]">
                      <strong className="font-bold text-[13px] text-green-600">New: </strong>
                      {latestCreatedToken.name}
                    </span>
                    <div className="flex flex-row items-center gap-2 w-full">
                      <Image src={latestCreatedToken?.url} alt="latestCreatedToken" width={30} height={30} style={{ width: '30px', height: '30px', marginRight: '10px', borderRadius: '50%' }} />
                      <span className="text-[#fdd52f] text-[12px]">{`${new Date().toDateString()}`}</span>
                    </div>
                  </div>
                </div>
              </div>
            } */}
          </div>

          <div className="flex flex-row items-center gap-6">
            {publicKey &&
              <div onClick={() => handleToRouter('/create-coin')} className="flex flex-col justify-center items-center font-semibold text-[#FCD582] text-base cursor-pointer">
                Create a Token
              </div>
            }
            <ConnectButton></ConnectButton>
          </div>
        </div>
      </div>
      {buyWowGoModalState && <BuyWowGoModal />}
    </div>
  );
};

export default Header;
