"use client"
import { createContext, useState, useEffect, useContext } from "react";
import io, { Socket } from "socket.io-client";
import { useRouter } from "next/navigation";
import { coinInfo } from "@/utils/types";

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
  newPresaleBuyTx: coinInfo;
  setNewPresaleBuyTx: Function;
  presaleCompleteSocket: coinInfo;
  setPresaleCompleteSocket: Function;
  distributeSocket: coinInfo;
  setDistributeSocket: Function;
  refundSocket: coinInfo;
  setRefundSocket: Function;
  distributeCompleteSocket: coinInfo;
  setDistributeCompleteSocket: Function;
  refundCompleteSocket: coinInfo;
  setRefundCompleteSocket: Function;
  distributeStartSocket: coinInfo;
  setDistributeStartSocket: Function;
  refundStartSocket: coinInfo;
  setRefundStartSocket: Function;
  newSwapTradingSocket: string;
  setNewSwapTradingSocket: Function;
}

const context = createContext<Context>({
  newToken: [],
  setNewToken: undefined,
  newPresaleBuyTx: {
    quoteReserves: 0,
    tokenReserves: 0,
    commit: undefined,
    name: "",
    creator: "",
    ticker: "",
    url: "",
    reserveOne: 0,
    reserveTwo: 0,
    token: "",
    bondingCurve: false,
    status: 0,
    progressPresale: 0
  },
  setNewPresaleBuyTx: undefined,
  presaleCompleteSocket: {
    quoteReserves: 0,
    tokenReserves: 0,
    commit: undefined,
    name: "",
    creator: "",
    ticker: "",
    url: "",
    reserveOne: 0,
    reserveTwo: 0,
    token: "",
    bondingCurve: false,
    status: 0,
    progressPresale: 0
  },
  setPresaleCompleteSocket: undefined,
  distributeSocket: {
    quoteReserves: 0,
    tokenReserves: 0,
    commit: undefined,
    name: "",
    creator: "",
    ticker: "",
    url: "",
    reserveOne: 0,
    reserveTwo: 0,
    token: "",
    bondingCurve: false,
    status: 0,
    progressPresale: 0
  },
  setDistributeSocket: undefined,
  refundSocket: {
    quoteReserves: 0,
    tokenReserves: 0,
    commit: undefined,
    name: "",
    creator: "",
    ticker: "",
    url: "",
    reserveOne: 0,
    reserveTwo: 0,
    token: "",
    bondingCurve: false,
    status: 0,
    progressPresale: 0
  },
  setRefundSocket: undefined,
  distributeCompleteSocket: {
    quoteReserves: 0,
    tokenReserves: 0,
    commit: undefined,
    name: "",
    creator: "",
    ticker: "",
    url: "",
    reserveOne: 0,
    reserveTwo: 0,
    token: "",
    bondingCurve: false,
    status: 0,
    progressPresale: 0
  },
  setDistributeCompleteSocket: undefined,
  refundCompleteSocket: {
    quoteReserves: 0,
    tokenReserves: 0,
    commit: undefined,
    name: "",
    creator: "",
    ticker: "",
    url: "",
    reserveOne: 0,
    reserveTwo: 0,
    token: "",
    bondingCurve: false,
    status: 0,
    progressPresale: 0
  },
  setRefundCompleteSocket: undefined,
  distributeStartSocket: {
    quoteReserves: 0,
    tokenReserves: 0,
    commit: undefined,
    name: "",
    creator: "",
    ticker: "",
    url: "",
    reserveOne: 0,
    reserveTwo: 0,
    token: "",
    bondingCurve: false,
    status: 0,
    progressPresale: 0
  },
  setDistributeStartSocket: undefined,
  refundStartSocket: {
    quoteReserves: 0,
    tokenReserves: 0,
    commit: undefined,
    name: "",
    creator: "",
    ticker: "",
    url: "",
    reserveOne: 0,
    reserveTwo: 0,
    token: "",
    bondingCurve: false,
    status: 0,
    progressPresale: 0
  },
  setRefundStartSocket: undefined,
  newSwapTradingSocket: "",
  setNewSwapTradingSocket: undefined,
});

export const useSocket = () => useContext(context);

const SocketProvider = (props: { children: any }) => {
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
  const [newPresaleBuyTx, setNewPresaleBuyTx] = useState<coinInfo>();
  const [presaleCompleteSocket, setPresaleCompleteSocket] = useState<coinInfo>();
  const [distributeSocket, setDistributeSocket] = useState<coinInfo>();
  const [distributeStartSocket, setDistributeStartSocket] = useState<coinInfo>()
  const [distributeCompleteSocket, setDistributeCompleteSocket] = useState<coinInfo>()
  const [refundSocket, setRefundSocket] = useState<coinInfo>()
  const [refundStartSocket, setRefundStartSocket] = useState<coinInfo>()
  const [refundCompleteSocket, setRefundCompleteSocket] = useState<coinInfo>()
  const [newSwapTradingSocket, setNewSwapTradingSocket] = useState<string>("")

  const router = useRouter();

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

    };
  }, [router]);

  useEffect(() => {
    socket?.on("TokenCreated", async (data: any) => {
      setCounter((prev) => prev + 1); // Increment counter
      setNewToken(data);
    });

    socket?.on("presaleBuy", async (data: any) => {
      setNewPresaleBuyTx(data.data)
    });

    socket?.on("presaleComplete", async (data: any) => {
      setPresaleCompleteSocket(data.data)
    });

    socket?.on("distribute", async (data: any) => {
      setDistributeSocket(data.data)
    });

    socket?.on("distributeStart", async (data: any) => {
      setDistributeStartSocket(data.data)
    });

    socket?.on("refund", async (data: any) => {
      setRefundSocket(data.data)
    });

    socket?.on("refundStart", async (data: any) => {
      setRefundStartSocket(data.data)
    });

    socket?.on("distributeComplete", async (data: any) => {
      setDistributeCompleteSocket(data.data)
    });

    socket?.on("refundComplete", async (data: any) => {
      setRefundCompleteSocket(data.data)
    });

    socket?.on("swap", async (data: any) => {
      setNewSwapTradingSocket(data.mint)
    });

    socket?.on("withdraw", async (data: any) => {

      console.log("--------@ withdraw: ", data);
    });

    return () => {
      socket?.off("TokenCreated");
      socket?.off("presaleBuy");
      socket?.off("presaleComplete");
      socket?.off("distribute");
      socket?.off("distributeStart");
      socket?.off("distributeComplete");
      socket?.off("refund");
      socket?.off("refundStart");
      socket?.off("refundComplete");
      socket?.off("swap");
      socket?.off("withdraw");

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
        newPresaleBuyTx,
        setNewPresaleBuyTx,
        presaleCompleteSocket,
        setPresaleCompleteSocket,
        distributeSocket,
        setDistributeSocket,
        refundSocket,
        setRefundSocket,
        distributeCompleteSocket,
        setDistributeCompleteSocket,
        refundCompleteSocket,
        setRefundCompleteSocket,
        distributeStartSocket,
        setDistributeStartSocket,
        refundStartSocket,
        setRefundStartSocket,
        newSwapTradingSocket,
        setNewSwapTradingSocket,
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