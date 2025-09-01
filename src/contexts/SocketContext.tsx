/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { createContext, useState, useEffect, useContext } from "react";
import io, { Socket } from "socket.io-client";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from "next/navigation";
import { errorAlert, successAlert } from "@/components/others/ToastGroup";
import { coinInfo, msgInfo, tradeInfo } from "@/utils/types";
import UserContext from "@/context/UserContext";

interface Context {
  socket?: Socket;
  counter?: number;
  randValue?: number;
  setRandValue?: Function;
  userArr?: any[];
  setUserArr?: Function;
  playerNumber?: number;
  setPlayerNumber?: Function;
  isLoading?: boolean;
  setIsLoading?: Function;
  isShowModal?: string;
  setIsShowModal?: Function;
  currentDepositAmount?: number;
  setCurrentDepositAmount?: Function;
  numberDecimals?: number;
  alertState?: AlertState;
  setAlertState?: Function;
  newToken: any[];
  setNewToken: Function;
  newTx: any[];
  setNewTx: Function;
}

const context = createContext<Context>({
  newToken: [],
  setNewToken: undefined,
  newTx: [],
  setNewTx: undefined
});

export const useSocket = () => useContext(context);

const SocketProvider = (props: { children: any }) => {
  const { setCoinId, setNewMsg } = useContext(UserContext)
  const [socket, setSocket] = useState<Socket>();
  const [counter, setCounter] = useState<number>(1);
  const [randValue, setRandValue] = useState<number>(0);
  const [userArr, setUserArr] = useState<any[]>();
  const [playerNumber, setPlayerNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowModal, setIsShowModal] = useState('');
  const [currentDepositAmount, setCurrentDepositAmount] = useState(0);
  const [numberDecimals, setNumberDecimals] = useState(3);
  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: '',
    severity: undefined,
  })
  const [newToken, setNewToken] = useState<any[]>([]);
  const [newTx, setNewTx] = useState<any[]>([]);

  const router = useRouter();
  // const router = useRouter();
  // wallet Info
  const wallet = useWallet();
  const { connection } = useConnection();

  const connectionUpdatedHandler = (data: number) => {
    setCounter(data);
  };

  const createSuccessHandler = (name: string) => {
    console.log("Successfully Create Token Name:", name)
    setAlertState({
      open: true,
      message: 'Success',
      severity: 'success',
    });
    successAlert(`Successfully Created token: ${name}`);
    setIsLoading(false);
  }

  const createFailedHandler = (name: string, mint: string) => {
    console.log("Failed Create Token Name:", name)
    setAlertState({
      open: true,
      message: 'Failed',
      severity: 'error',
    });
    errorAlert(`Failed Create token: ${name}`)
    setIsLoading(false);
  }

  const createMessageHandler = (updateCoinId: string, updateMsg: msgInfo) => {
    console.log("Updated Message", updateCoinId, updateMsg)
    setCoinId(updateCoinId);
    setNewMsg(updateMsg);
  }

  const newTransaction = (data: any, user: any) => {
    console.log("new buy and sell ===>", data, user);

    // Update the `data.holder` with the user._id
    const updatedData = {
      ...data,  // Spread the existing data
      holder: user, // Change the holder to user._id
    };

    console.log("updatedData ==>", updatedData)

    // Update the state with the modified data object
    setNewTx(updatedData);
  };

  // init socket client object
  useEffect(() => {

    const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
      transports: ["websocket"],
    });
    socket.on("connect", async () => {
      console.log(" --@ connected to backend", socket.id);
    });
    socket.on("disconnect", () => {
      console.log(" --@ disconnected from backend", socket.id);
    });
    setSocket(socket);

    return () => {

      socket.off("connect");
      socket.off("disconnect");
      setSocket(undefined);
      // socket?.disconnect();

    };
  }, [router]);

  useEffect(() => {
    socket?.on("connectionUpdated", async (counter: number) => {
      // console.log("--------@ Connection Updated: ", counter);

      connectionUpdatedHandler(counter)
    });

    socket?.on("Creation", () => {
      console.log("--------@ Token Creation: ");

    });
    socket?.on("TokenCreated", async (data: any) => {
      console.log("--------@ Token Created!: ", data.name, data.mint, data.data);

      createSuccessHandler(data.name);
      setCounter((prev) => prev + 1); // Increment counter
      setNewToken(data.data);
    });

    socket?.on("TokenNotCreated", async (name: string, mint: string) => {
      console.log("--------@ Token Not Created: ", name);

      createFailedHandler(name, mint);
    });

    socket?.on("MessageUpdated", async (updateCoinId: string, newMessage: msgInfo) => {
      if (updateCoinId && newMessage) {
        console.log("--------@ Message Updated:", updateCoinId, newMessage)

        createMessageHandler(updateCoinId, newMessage)
      }
    })

    socket?.on("Swap", async (data: any) => {
      console.log("--------@ Swap:", data.data)
      console.log("--------@ Swap:", data.user)

      newTransaction(data.data, data.user)
    })

    return () => {
      socket?.off("Creation", createSuccessHandler);
      socket?.off("TokenCreated", createSuccessHandler);
      socket?.off("TokenNotCreated", createFailedHandler);
      socket?.off("MessageUpdated", createMessageHandler);
      socket?.off("Swap", createMessageHandler);

      socket?.disconnect();
    };
  }, [socket]);

  return (
    <context.Provider
      value={{
        socket,
        counter,
        randValue,
        setRandValue,
        userArr,
        setUserArr,
        playerNumber,
        setPlayerNumber,
        isLoading,
        setIsLoading,
        isShowModal,
        setIsShowModal,
        currentDepositAmount,
        setCurrentDepositAmount,
        numberDecimals,
        alertState,
        setAlertState,
        newToken,
        setNewToken,
        newTx,
        setNewTx
      }}
    >
      {props.children}
    </context.Provider>
  );
};

export interface AlertState {
  open: boolean
  message: string
  severity: 'success' | 'info' | 'warning' | 'error' | undefined
}

export default SocketProvider;