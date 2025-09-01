"use client";

import { ChangeEvent, useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { errorAlert } from "@/components/others/ToastGroup";
import { createToken } from "@/program/web3";
import { createCoinInfo, launchDataInfo, metadataInfo } from "@/utils/types";
import { useWallet } from "@solana/wallet-adapter-react";
import { IoIosArrowBack } from "react-icons/io";
import { uploadImage, uploadMetadata } from "@/utils/fileUpload";
import CreateTokenStep1 from "./CreateTokenStep1";
import CreateTokenStep2 from "./CreateTokenStep2";
import CreateTokenStep3 from "./CreateTokenStep3";
import Spinner from "@/components/loadings/Spinner";
import SuccessImage from "@/../public/assets/images/success.png"
import UserContext from "@/context/UserContext";

export default function CreateToken() {
  const { isLoading, setIsLoading } = useContext(UserContext);
  const [newCoin, setNewCoin] = useState<createCoinInfo>({} as createCoinInfo);  // Ensure newCoin is initialized
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [createImageUrl, setCreateImageUrl] = useState<string>("");
  const [createImagePreview, setCreateImagePreview] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1); // Keep track of the current step
  const [tokenCreatedModal, setTokenCreateModal] = useState<boolean>(false)
  const [newTokenMint, setNewTokenMint] = useState<string>("")
  const wallet = useWallet();
  const router = useRouter();
  const [errors, setErrors] = useState({
    name: false,
    ticker: false,
    image: false,
  });

  useEffect(() => {
    // Clear errors when newCoin changes
    setErrors({
      name: !newCoin.name,
      ticker: !newCoin.ticker,
      image: !profileImageUrl,
    });
  }, [newCoin, profileImageUrl]);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleToRouter = (path: string) => {
    setIsLoading(true)
    router.push(path);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewCoin({ ...newCoin, [e.target.id]: e.target.value });
  };

  const validateForm = () => {
    const validationErrors = {
      name: !newCoin.name,
      ticker: !newCoin.ticker,
      description: !newCoin.description,
      image: !profileImageUrl,
    };
    setErrors(validationErrors);
    return !Object.values(validationErrors).includes(true);
  };

  const createCoin = async () => {
    if (!validateForm()) {
      errorAlert("Please fix the errors before submitting.");
      return;
    }
    try {
      setIsLoading(true);
      const uploadedImageUrl = await uploadImage(profileImageUrl);
      if (!uploadedImageUrl) {
        errorAlert("Image upload failed.");
        setIsLoading(false);
        return;
      }
      const uploadedCreateImageUrl = await uploadImage(createImageUrl);

      const jsonData: metadataInfo = {
        name: newCoin.name,
        symbol: newCoin.ticker,
        image: uploadedImageUrl,
        description: newCoin.description,
        presale: newCoin.presale,
        createdOn: "https://test.com",
        twitter: newCoin.twitter || undefined,
        website: newCoin.website || undefined,
        telegram: newCoin.telegram || undefined,
        discord: newCoin.discord || undefined,
        contactEmail: newCoin.contactEmail || undefined,
        contactTelegram: newCoin.contactTelegram || undefined,
        gameName: newCoin.gameName || undefined,
        gameLink: newCoin.gameLink || undefined,
        buttonLabel: newCoin.buttonLabel || undefined,
        gameImage: uploadedCreateImageUrl || undefined,

      };
      const uploadMetadataUrl = await uploadMetadata(jsonData);
      if (!uploadMetadataUrl) {
        errorAlert("Metadata upload failed.");
        setIsLoading(false);
        return;
      }

      const coinData: launchDataInfo = {
        name: newCoin.name,
        symbol: newCoin.ticker,
        uri: uploadMetadataUrl,
        decimals: 6,
        virtualReserves: 2_000_000_000,
        tokenSupply: 1_000_000_000_000,
        presale: newCoin.presale,
      };

      const res = await createToken(wallet, coinData);
      if (res === "WalletError" || !res) {
        errorAlert("Payment failed or was rejected.");
        setIsLoading(false);
        return;
      }
      console.log("created token", res)
      setNewTokenMint(res.tokenMint.publicKey.toString())
      setTokenCreateModal(true)
    } catch (error) {
      errorAlert("An unexpected error occurred.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto px-3 pt-10 pb-16 w-full">
      {!tokenCreatedModal ?
        <div className="flex flex-col gap-3 mx-4 w-full">
          <div onClick={() => handleToRouter("/")} className="flex flex-row items-center gap-2 pb-2 w-[100px] text-[#9CA3AF] text-sm cursor-pointer">
            <IoIosArrowBack />
            Back
          </div>
          <h2 className="font-bold text-[#090603] text-lg xs:text-xl text-center">
            Create a Token
          </h2>
          <div className="gap-4 mx-auto w-full max-w-lg">
            <div className="flex flex-row justify-center items-center gap-3">
              <div className="flex flex-col justify-center items-center bg-[radial-gradient(85.4%_100%_at_50.16%_0%,_#86B3FD_0%,_#2B35E1_100%)] border-[#86B3FD] border-[1px] rounded-full w-8 h-8 font-semibold text-white">
                1
              </div>
              <div className={`${currentStep >= 2 ? "border-t-[#2329B6]" : "border-t-[#FBE7A8]"}  border-t-[2px] w-full max-w-[150px] h-[2px] border-dashed`}></div>
              <div className={`${currentStep >= 2 ? "bg-[radial-gradient(85.4%_100%_at_50.16%_0%,_#86B3FD_0%,_#2B35E1_100%)] text-white border-[#86B3FD] border-[1px]" : "bg-[radial-gradient(85.4%_100%_at_50.16%_0%,_#FFF8E8_0%,_#FCD582_100%)] text-[#9CA3AF]"} flex flex-col justify-center items-center rounded-full w-8 h-8 font-semibold `}>
                2
              </div>
              <div className={`${currentStep >= 3 ? "border-t-[#2329B6]" : "border-t-[#FBE7A8]"}  border-t-[2px] w-full max-w-[150px] h-[2px] border-dashed`}></div>
              <div className={`${currentStep >= 3 ? "bg-[radial-gradient(85.4%_100%_at_50.16%_0%,_#86B3FD_0%,_#2B35E1_100%)] text-white border-[#86B3FD] border-[1px]" : "bg-[radial-gradient(85.4%_100%_at_50.16%_0%,_#FFF8E8_0%,_#FCD582_100%)] text-[#9CA3AF]"} flex flex-col justify-center items-center rounded-full w-8 h-8 font-semibold`}>
                3
              </div>
            </div>
          </div>

          <div className="gap-4 mx-auto w-full max-w-lg">
            {/* Step navigation */}
            {currentStep === 1 && (
              <CreateTokenStep1
                newCoin={newCoin}
                handleChange={handleChange}
                setProfileImagePreview={setProfileImagePreview}
                setProfileImageUrl={setProfileImageUrl}
              />
            )}
            {currentStep === 2 && (
              <CreateTokenStep2
                newCoin={newCoin}
                handleChange={handleChange}
              />
            )}
            {currentStep === 3 && (
              <CreateTokenStep3
                newCoin={newCoin}
                handleChange={handleChange}
                createImage={createImageUrl}
                setCreateImagePreview={setCreateImagePreview}
                setCreateImageUrl={setCreateImageUrl}
              />
            )}
            {/* Next button to switch steps */}
            {currentStep === 1 && (
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={!newCoin.name || !newCoin.ticker || !profileImageUrl}
                  className={`${(!newCoin.name || !newCoin.ticker || !profileImageUrl) ? "opacity-60 cursor-not-allowed" : "opacity-100 cursor-pointer"} justify-center items-center bg-[linear-gradient(180deg,_#86B3FD_0%,_#2B35E1_100%)] border-[#86B3FD] border-[3px] rounded-[12px] w-[198px] h-11 font-semibold text-white`}
                >
                  Next
                </button>
              </div>
            )}
            {currentStep === 2 && (
              <div className="flex justify-between gap-4 mt-6">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-3 h-11 font-semibold text-[#2B35E1]"
                >
                  Skip
                </button>

                <button
                  onClick={() => setCurrentStep(3)}
                  disabled={!newCoin.telegram && !newCoin.twitter && !newCoin.website && !newCoin.discord}
                  className={`${(!newCoin.telegram && !newCoin.twitter && !newCoin.website && !newCoin.discord) ? "opacity-60 cursor-not-allowed" : "opacity-100 cursor-pointer"} justify-center items-center bg-[linear-gradient(180deg,_#86B3FD_0%,_#2B35E1_100%)] border-[#86B3FD] border-[3px] rounded-[12px] w-[198px] h-11 font-semibold text-white`}
                >
                  Next
                </button>
              </div>
            )}
            {currentStep === 3 && (
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => createCoin()}
                  className="justify-center items-center bg-[linear-gradient(180deg,_#86B3FD_0%,_#2B35E1_100%)] opacity-100 border-[#86B3FD] border-[3px] rounded-[12px] w-[198px] h-11 font-semibold text-white cursor-pointer"
                >
                  Create a token
                </button>
              </div>
            )}
          </div>
        </div>
        :
        <div className="flex flex-col justify-center items-center gap-4 w-full h-full min-h-[calc(100vh-515px)]">
          <p className="mt-7 font-bold text-[#090603] text-lg xs:text-xl text-center">
            Token Created
          </p>
          <div className="flex flex-col justify-center items-center gap-4 py-14">
            <Image src={SuccessImage} alt="SuccessImage" width={100} height={100} className="w-[100px] h-[100px]" />
            <div className="font-bold text-[#090603] text-3xl text-center">
              Success! Token Ready
            </div>
            <p className="text-[#9CA3AF] text-sm">Your new token is ready. Keep it safe</p>
          </div>
          <button
            onClick={() => handleToRouter(`/presaletrade/${newTokenMint}`)}
            className="justify-center items-center bg-[linear-gradient(180deg,_#86B3FD_0%,_#2B35E1_100%)] opacity-100 border-[#86B3FD] border-[3px] rounded-[12px] w-[198px] h-11 font-semibold text-white cursor-pointer"
          >
            Go to Token page
          </button>
        </div>
      }
      {isLoading && <Spinner />}
    </div>
  );
}
