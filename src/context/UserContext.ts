"use client"
import { coinInfo, msgInfo, userInfo } from '@/utils/types';
import { createContext } from 'react';

const UserContext = createContext({
    user: {} as userInfo,
    setUser: (value: userInfo) => { },
    login: false,
    setLogin: (value: boolean) => { },
    isLoading: false,
    setIsLoading: (value: boolean) => { },
    swapLoading: false,
    setSwapLoading: (value: boolean) => { },
    imageUrl: '/*.png',
    setImageUrl: (value: string) => { },
    isCreated: false,
    setIsCreated: (value: boolean) => { },
    messages: [] as msgInfo[],
    setMessages: (value: msgInfo[]) => { },
    // coinData: {} as coinInfo,
    // setCoinData: (value: coinInfo) => { },
    coinId: "",
    setCoinId: (value: string) => { },
    newMsg: {} as msgInfo,
    setNewMsg: (value: msgInfo) => { },
    solPrice: 0,
    setSolPrice: (value: number) => { },
    profileEditModal: false,
    setProfileEditModal: (value: boolean) => { },
    postReplyModal: false,
    setPostReplyModal: (value: boolean) => { },
    updateCoin: false,
    setUpdateCoin: (value: boolean) => { },
    buyWowGoModalState: false,
    setBuyWowGoModalState: (value: boolean) => { },

})

export default UserContext;