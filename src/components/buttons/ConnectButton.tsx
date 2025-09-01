"use client";
import { FC, useContext, useEffect, useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";
import { successAlert, errorAlert } from "@/components/others/ToastGroup";
import base58 from "bs58";
import UserContext from "@/context/UserContext";
import { confirmWallet, walletConnect } from "@/utils/util";
import { userInfo } from "@/utils/types";
import { useRouter } from "next/navigation";
import { RiExchangeDollarLine } from "react-icons/ri";
import { VscDebugDisconnect } from "react-icons/vsc";
import UserAvatar from "@/../public/assets/images/user-avatar.png"
import { FaChevronDown } from "react-icons/fa";


export const ConnectButton: FC = () => {
  const { user, setUser, login, setLogin, setIsLoading, isLoading } = useContext(UserContext);
  const { publicKey, disconnect, signMessage } = useWallet();
  const { setVisible } = useWalletModal();
  const router = useRouter()

  const tempUser = useMemo(() => user, [user]);

  useEffect(() => {
    const handleClick = async () => {
      if (publicKey && !login) {
        const updatedUser: userInfo = {
          name: publicKey.toBase58().slice(0, 6),
          wallet: publicKey.toBase58(),
          isLedger: false,
        };
        await sign(updatedUser);
      }
    };
    handleClick();

  }, [publicKey, login]); // Removed `connect`, `wallet`, and `disconnect` to prevent unnecessary calls

  const sign = async (updatedUser: userInfo) => {
    try {
      const connection = await walletConnect({ data: updatedUser });
      if (!connection) return;
      if (connection.nonce === undefined) {
        const newUser = {
          name: connection.name,
          wallet: connection.wallet,
          _id: connection._id,
          avatar: connection.avatar,
        };
        setUser(newUser as userInfo);
        setLogin(true);
        return;
      }

      const msg = new TextEncoder().encode(
        `agentland ${connection.nonce}`
      );

      const sig = await signMessage?.(msg);
      const res = base58.encode(sig as Uint8Array);
      const signedWallet = { ...connection, signature: res };
      const confirm = await confirmWallet({ data: signedWallet });

      if (confirm) {
        setUser(confirm);
        setLogin(true);
        setIsLoading(false);
      }
      successAlert("Message signed.");
    } catch (error) {
      errorAlert("Sign-in failed.");
    }
  };

  const logOut = async () => {
    if (typeof disconnect === "function") {
      await disconnect();
    }
    // Initialize `user` state to default value
    setUser({} as userInfo);
    setLogin(false);
    localStorage.clear();
  };

  const handleToProfile = (id: string) => {
    router.push(id)
    setIsLoading(true)
  }

  return (
    <div>
      <button className={`${isLoading ? "" : "z-30"} flex flex-row gap-1 items-center justify-end text-white px-3 py-1 group relative font-semibold cursor-pointer ${(login && publicKey) ? "rounded-full bg-[radial-gradient(85.4%_100%_at_50.16%_0%,_#FFF8E8_0%,_#FCD582_100%)]" : "border-[3px] border-[#86B3FD] bg-gradient-to-b from-[#86B3FD] to-[#2B35E1] rounded-[12px]"}`}>
        {login && publicKey ? (
          <>
            <div className="flex justify-center items-center gap-2 text-[16px] lg:text-md">
              <Image
                src={(user.avatar !== "https://scarlet-extra-cat-880.mypinata.cloud/" && user.avatar !== "" && user.avatar !== undefined && user.avatar !== null && user.avatar) ? user.avatar : UserAvatar}
                alt="Token IMG"
                className="rounded-full w-[35px] h-[35px] object-cover overflow-hidden"
                width={35}
                height={35}
              />
              {user?.name ?
                <div className="w-[92px] object-cover overflow-hidden text-[#090603] truncate">
                  {user.name}
                </div>
                :
                <div className="text-[#090603]">
                  {publicKey.toBase58().slice(0, 4)}....
                  {publicKey.toBase58().slice(-4)}
                </div>
              }
              <FaChevronDown className="text-[#090603] text-lg" />
            </div>
            <div className="hidden group-hover:block right-0 -bottom-[130px] absolute px-3 rounded-lg w-full">
              <ul className="bg-[radial-gradient(85.4%_100%_at_50.16%_0%,_#FFF8E8_0%,_#FCD582_100%)] border-[#2B35E1] shadow-sm border-[1px] rounded-lg object-cover overflow-hidden text-[#2B35E1]">
                <li>
                  <div
                    className="flex flex-row items-center gap-1 hover:bg-[#fdd52f]/30 mb-1 p-2 text-md text-primary-100"
                    onClick={() => handleToProfile(`/profile/${tempUser._id}`)}
                  >
                    <RiExchangeDollarLine />
                    Profile
                  </div>
                </li>
                <li>
                  <div
                    className="flex flex-row items-center gap-1 hover:bg-[#fdd52f]/30 mb-1 p-2 text-md text-primary-100"
                    onClick={() => setVisible(true)}
                  >
                    <RiExchangeDollarLine />
                    Change Wallet
                  </div>
                </li>
                <li>
                  <div
                    className="flex items-center gap-1 hover:bg-[#fdd52f]/10 p-2 text-md text-primary-100"
                    onClick={logOut}
                  >
                    <VscDebugDisconnect />
                    Disconnect
                  </div>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <div
            className="flex flex-row justify-center items-center gap-2 text-white text-base"
            onClick={() => setVisible(true)}
          >
            Connect Wallet
          </div>
        )}
      </button>
    </div>
  );
};
