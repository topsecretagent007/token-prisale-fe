import { PublicKey } from "@solana/web3.js"
import BN from "bn.js";

export type ChartTable = {
  table: {
    open: number;
    high: number;
    low: number;
    close: number;
    time: number;
  }[];
};

export type Chart = {
  time: number;
  opens: number[];
  highs: number[];
  lows: number[];
  closes: number[];
};

export interface userInfo {
  _id?: string;
  name: string;
  wallet: string;
  avatar?: string;
  isLedger?: Boolean;
  signature?: string;
}

export interface metadataInfo {
  name: string,
  symbol: string,
  image: string,
  description: string,
  presale: number,
  createdOn: string,
  twitter?: string,
  website?: string,
  telegram?: string,
  discord?: string,
  contactEmail?: string,
  contactTelegram?: string,
  gameName?: string,
  gameLink?: string,
  buttonLabel?: string,
  gameImage?: string,
}

export interface coinInfo {
  quoteReserves: number;
  tokenReserves: number;
  commit: any;
  _id?: string;
  name: string;
  creator: string | userInfo;
  ticker: string;
  url: string;
  reserveOne: number;
  reserveTwo: number;
  token: string;
  tokenSupply?: number;
  marketcap?: number;
  presale?: number;
  replies?: number;
  description?: string;
  twitter?: string;
  website?: string;
  telegram?: string;
  discord?: string,
  contactEmail?: string,
  contactTelegram?: string,
  gameName?: string,
  gameLink?: string,
  buttonLabel?: string,
  gameImage?: string,
  date?: Date;
  bondingCurve: boolean;
  status: number;
  progressPresale: number;
}

export interface createCoinInfo {
  name: string,
  ticker: string,
  url: string,
  description: string,
  presale: number,
  tokenSupply: number,
  virtualReserves: number,
  twitter?: string,
  website?: string,
  telegram?: string,
  discord?: string,
  contactEmail?: string,
  contactTelegram?: string,
  gameName?: string,
  gameLink?: string,
  buttonLabel?: string,
  gameImage?: string,

}

export interface launchDataInfo {
  presale: number;
  virtualReserves: number;
  tokenSupply: number;
  name: string,
  symbol: string,
  uri: string,
  decimals: number
}
export interface msgInfo {
  coinId: string | coinInfo;
  sender: string | userInfo;
  time: Date;
  img?: string;
  msg: string;
}

export interface tradeInfo {
  creator: string | coinInfo;
  record: recordInfo[];
}

export interface holderInfo {
  account: string;
  owner: string;
  percentage: number;
  amount: number;
  slice: string
}

export interface recordInfo {
  swapDirection: number;
  holder: userInfo;
  time: Date;
  amount: number;
  tokenAmount: number;
  price: number;
  tx: string;
  amountIn: number;
  amountOut: number;
}
export interface CharTable {
  table: {
    time: number;
    low: number;
    high: number;
    open: number;
    close: number;
    volume: number;
  }[];
}
export interface Bar {
  time: number;
  low: number;
  high: number;
  open: number;
  close: number;
  volume: number;
}
export interface replyInfo {
  coinId: string;
  sender: string;
  msg: string;
  img?: string;
}
export interface PeriodParamsInfo {
  from: number;
  to: number;
  countBack: number;
  firstDataRequest: boolean;
}

export type SwapInfo = {
  creator: string;
  solAmountInLamports: number;
  direction: "Bought" | "Sold";
  mintAddress: string;
  mintName: string;
  mintSymbol: string;
  mintUri: string;
};

export type WowgoTokenDataType = {
  price: number;
  changeIn24h: number;
  liquidity: number;
}
