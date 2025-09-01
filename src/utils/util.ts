import axios, { AxiosRequestConfig } from 'axios';
import { coinInfo, holderInfo, msgInfo, replyInfo, userInfo } from './types';
import { PublicKey } from '@solana/web3.js';
import { pumpProgramId } from '@/program/web3';
import { BACKEND_URL } from '@/config/TextData';

const JWT = process.env.NEXT_PUBLIC_PINATA_PRIVATE_KEY;

const headers: Record<string, string> = {
  'ngrok-skip-browser-warning': 'true'
};

const config: AxiosRequestConfig = {
  headers
};

export const test = async () => {
  const res = await fetch(`${BACKEND_URL}`);
  const data = await res.json();
  console.log(data);
};

export const getUser = async ({ id }: { id: string }): Promise<any> => {
  try {
    const response = await axios.get(`${BACKEND_URL}/user/${id}`, config);
    return response.data;
  } catch (err) {
    return { error: 'error setting up the request' };
  }
};

export const updateUser = async (data: userInfo): Promise<any> => {
  try {
    const response = await axios.post(`${BACKEND_URL}/user/update/`, data, config);
    return response.data;
  } catch (err) {
    return { error: 'error setting up the request' };
  }
};

export const walletConnect = async ({ data }: { data: userInfo }): Promise<any> => {
  try {
    const response = await axios.post(`${BACKEND_URL}/user/`, data);
    return response.data;
  } catch (err) {
    return { error: 'error setting up the request' };
  }
};

export const confirmWallet = async ({ data }: { data: userInfo }): Promise<any> => {
  try {
    const response = await axios.post(`${BACKEND_URL}/user/confirm`, data, config);
    return response.data;
  } catch (err) {
    return { error: 'error setting up the request' };
  }
};

export const getCoinsInfo = async (): Promise<coinInfo[]> => {
  try {
    const res = await axios.get(`${BACKEND_URL}/coin`, config);
    return res.data;
  } catch (error) {
    console.error('Error fetching coin info:', error);
  }
};

export const getCoinsInfoBy = async (id: string): Promise<coinInfo[]> => {
  try {
    const res = await axios.get<any>(`${BACKEND_URL}/coin/user/${id}`, config);
    return res.data;
  } catch (error) {
    console.error('Error fetching coin info:', error);
  }
};

export const getCoinInfo = async (data: string): Promise<any> => {
  try {
    const response = await axios.get(`${BACKEND_URL}/coin/token/${data}`);
    return response.data;
  } catch (err) {
    return { error: 'error setting up the request' };
  }
};

export const getUserInfo = async (data: string): Promise<any> => {
  try {
    const response = await axios.get(`${BACKEND_URL}/user/${data}`, config);
    return response.data;
  } catch (err) {
    return { error: 'error setting up the request' };
  }
};

export const getMessageByCoin = async (data: string): Promise<msgInfo[]> => {
  try {
    console.log('data:', data);
    const response = await axios.get(`${BACKEND_URL}/feedback/coin/${data}`, config);
    console.log('messages:', response.data);
    return response.data;
  } catch (err) {
    return [];
  }
};

export const getCoinTrade = async (data: string): Promise<any> => {
  try {
    const response = await axios.get(`${BACKEND_URL}/cointrade/${data}`, config);
    return response.data;
  } catch (err) {
    return { error: 'error setting up the request' };
  }
};

export const postReply = async (data: replyInfo) => {
  console.log("data ==> ", data)
  try {
    const response = await axios.post(`${BACKEND_URL}/feedback/`, data, config);
    return response.data;
  } catch (err) {
    return { error: 'error setting up the request' };
  }
};

// ================== Get Holders ===========================
export const findHolders = async (mint: string) => {
  let page = 1;
  let allOwners: holderInfo[] = [];

  while (true) {
    const response = await fetch(
      process.env.NEXT_PUBLIC_SOLANA_RPC ||
      'https://devnet.helius-rpc.com/?api-key=44b7171f-7de7-4e68-9d08-eff1ef7529bd',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'getTokenAccounts',
          id: 'helius-test',
          params: {
            page,
            limit: 1000,
            displayOptions: {},
            mint,
          },
        }),
      }
    );

    const data = await response.json();

    if (!data.result || data.result.token_accounts.length === 0) break;

    // Add this logic to compute total amount
    const totalAmount = data.result.token_accounts.reduce(
      (acc, account) => acc + Number(account.amount),
      0
    );

    data.result.token_accounts.forEach((account) => {
      const amount = Number(account.amount);
      const percentage = ((amount / totalAmount) * 100).toFixed(2); // 2 decimal places

      allOwners.push({
        slice: account.owner.slice(0, 3) + `...` + account.owner.slice(-4),
        owner: account.owner,
        amount: Number(account.amount), // Ensure amount is a number
        account: account.account,
        percentage: Number(percentage), // Ensure percentage is a number
      });
    });

    page++;
  }

  return allOwners;
};

export const getTokenAtaBeforeMigration = async () => {

  const globalVault = PublicKey.findProgramAddressSync(
    [Buffer.from("global")],
    pumpProgramId
  )[0]
  return globalVault
}

export const getSolPriceInUSD = async () => {
  try {
    // Fetch the price data from CoinGecko
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
    const solPriceInUSD = response.data.solana.usd;
    return solPriceInUSD;
  } catch (error) {
    console.error('Error fetching SOL price:', error);
    throw error;
  }
};

export const uploadImage = async (url: string) => {
  const res = await fetch(url);
  const blob = await res.blob();

  const imageFile = new File([blob], "image.png", { type: "image/png" });
  const resData = await pinFileToIPFS(imageFile);
  if (resData) {
    return `https://gateway.pinata.cloud/ipfs/${resData.IpfsHash}`;
  } else {
    return false;
  }
};


export const pinFileToIPFS = async (blob: File) => {
  try {
    const data = new FormData();
    data.append("file", blob);
    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${JWT}`,
      },
      body: data,
    });
    const resData = await res.json();
    return resData;
  } catch (error) {
    console.log(error);
  }
};

export const getTokenPriceAndChange = async (tokenMint: string) => {
  try {
    const options = {
      method: 'GET',
      headers: {
        'X-API-KEY': process.env.NEXT_PUBLIC_BIRDEYE_KEY!
      }
    };
    await sleep(70)
    // Fetch the token price
    const response = await fetch(`https://public-api.birdeye.so/defi/price?address=${tokenMint}`, options);
    // Check if the response is ok
    if (!response.ok) {
      console.error("Error fetching token price: ", response.statusText);
      return 0; // Return 0 if the fetch fails
    }
    const data = await response.json();
    console.log("birdeye data ===> ", data.data)
    // Check for the expected structure and return the price
    if (data && data.data && typeof data.data.value === 'number') {
      return { price: data.data.value, changeIn24h: data.data.priceChange24h, liquidity: data.data.liquidity }; // Return the price as a number
    } else {
      console.error("Unexpected response structure:", data);
      return { price: 1, changeIn24h: 0, liquidity: 10000 }; // Return 0 if the structure is not as expected
    }
  } catch (error) {
    console.error("Error fetching token price:", error);
    return { price: 1, changeIn24h: 0, liquidity: 10000 }; // Return 0 on any other error
  }
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
