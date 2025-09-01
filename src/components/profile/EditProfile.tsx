'use client'

import UserContext from '@/context/UserContext';
import { userInfo } from '@/utils/types';
import { updateUser, walletConnect } from '@/utils/util';
import { uploadImage } from '@/utils/fileUpload';
import React, { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import { errorAlert, successAlert } from '../others/ToastGroup';
import UserImg from '@/../public/assets/images/user-avatar.png';
import Image from 'next/image';
import { useWallet } from '@solana/wallet-adapter-react';
import { FaEdit } from "react-icons/fa";
import { usePathname } from 'next/navigation';

interface EditProfileProps {
  data: userInfo;
}

const EditProfile: React.FC<EditProfileProps> = ({ data }) => {
  const { setProfileEditModal, setUser, user, isLoading, setIsLoading } = useContext(UserContext);
  const [userName, setUserName] = useState<string>(data.name);
  const [imagePreview, setImagePreview] = useState<string | null>(data.avatar || null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("")
  const pathname = usePathname();
  const wallet = useWallet();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUserName(e.target.value);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }
      const url = URL.createObjectURL(file);
      let _fileName = file.name.length > 18
        ? `${file.name.slice(0, 6)}...${file.name.slice(-6)}`
        : file.name;

      setFileName(_fileName || ''); // Ensure it's always a string
      console.log("url ==>", url)
      setImagePreview(url); // URL.createObjectURL always returns a string
    }
  };

  const sendUpdate = async () => {
    setProfileEditModal(false)
    setIsLoading(true)
    try {
      let uploadedUrl: string = data.avatar || ''; // Ensure it starts as a string

      if (imagePreview && imagePreview !== data.avatar) {
        const uploadResult = await uploadImage(imagePreview);
        uploadedUrl = uploadResult || ''; // If uploadImage returns false, fallback to an empty string
      }

      const updatedUser = {
        name: userName,
        wallet: wallet.publicKey.toBase58(),
        avatar: uploadedUrl,
      };

      const connection = await walletConnect({ data: updatedUser });
      const result = await updateUser(updatedUser);

      if (result.error) {
        errorAlert('Failed to save the data.');
      } else {
        successAlert('Successfully updated.');
        setUser(updatedUser);
        setProfileEditModal(false);
      }
      setIsLoading(false)
    } catch (error) {
      errorAlert('An error occurred while updating your profile.');
      setIsLoading(false)
    }
  };

  useEffect(() => {
    const segments = pathname.split("/");
    const id = segments[segments.length - 1];
    if (id && id !== userId) {
      setUserId(id);
    }
  }, [pathname]);

  return (
    <div className='flex flex-col justify-center items-center gap-8 mx-auto w-full max-w-[625px] h-full'>
      <p className="mt-6 font-bold text-[#090603] text-[24px] text-center">Edit Profile</p>
      <div className="flex flex-col gap-6 bg-[#FFFFFC] p-6 rounded-[24px] w-full text-[#090603]">
        <div className="flex flex-col md:flex-col justify-center gap-3 w-full">
          <p
            className="flex flex-col font-semibold text-[#090603] text-xs"
          >
            Profile Image (Square 1024*1024)
          </p>
          {(imagePreview !== "https://scarlet-extra-cat-880.mypinata.cloud/" && imagePreview !== "" && imagePreview !== undefined && imagePreview !== null && imagePreview) ? (
            <div
              onChange={handleFileChange}
              className="flex flex-row justify-center items-end gap-2 mx-auto rounded-full w-full h-full">
              <Image
                src={imagePreview as string} // Ensure it's a string
                alt="Selected Preview"
                width={144}
                height={144}
                className="flex rounded-full w-[144px] h-[144px] object-cover"
              />
              <FaEdit
                onClick={() => fileInputRef.current?.click()}
                className='text-xl cursor-pointer'
              />
              <input
                id="fileUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
            </div>
          ) : (
            <div

              className="flex flex-row justify-center items-end gap-2 mx-auto rounded-full w-full h-full">
              <Image
                src={UserImg}
                alt="Default Avatar"
                width={144}
                height={144}
                className="flex rounded-full w-[144px] h-[144px] object-cover"
              />
              <FaEdit
                onClick={() => fileInputRef.current?.click()}
                className='text-xl cursor-pointer'
              />
              <input
                id="fileUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1 w-full text-[#090603]">
          <label className="flex flex-col font-semibold text-[#090603] text-xs" htmlFor="name">
            Display Name
          </label>
          <input
            className="bg-transparent p-2 border-[#E5E7EB] border-[1px] rounded-lg outline-none w-full"
            type="text"
            id="name"
            value={userName}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="flex justify-end gap-3 w-full">
        <button
          className="justify-center items-center bg-[linear-gradient(180deg,_#86B3FD_0%,_#2B35E1_100%)] opacity-100 border-[#86B3FD] border-[3px] rounded-[12px] w-[198px] h-11 font-semibold text-white cursor-pointer"
          onClick={sendUpdate}
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
