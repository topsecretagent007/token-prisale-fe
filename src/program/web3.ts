import { ComputeBudgetProgram, Connection, Keypair, PublicKey, Transaction, clusterApiUrl } from '@solana/web3.js';
import { Pumpfun } from './pumpfun'
import idl from "./pumpfun.json"
import * as anchor from '@coral-xyz/anchor';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { errorAlert, successAlert } from '@/components/others/ToastGroup';
import { Program } from '@coral-xyz/anchor';
import { SEED_CONFIG } from './seed';
import { launchDataInfo } from '@/utils/types';
import { Decimal, SlippageAmount } from '@/config/TextData';
import { NATIVE_MINT } from '@solana/spl-token';

export const commitmentLevel = "processed";

export const endpoint =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl("devnet");
export const connection = new Connection(endpoint, commitmentLevel);
export const pumpProgramId = new PublicKey(idl.address);
export const pumpProgramInterface = JSON.parse(JSON.stringify(idl));
export const quoteMint = new PublicKey(process.env.NEXT_PUBLIC_QUOTEMINT)


// Send Fee to the Fee destination
export const createToken = async (wallet: WalletContextState, coinData: launchDataInfo) => {

  const provider = new anchor.AnchorProvider(connection, wallet, { preflightCommitment: "confirmed" })
  anchor.setProvider(provider);
  const program = new Program(
    pumpProgramInterface,
    provider
  ) as Program<Pumpfun>;

  // check the connection
  if (!wallet.publicKey || !connection) {
    errorAlert("Wallet Not Connected");
    console.log("Warning: Wallet not connected");
    return "WalletError";
  }

  try {
    const mintKp = Keypair.generate();
    const transaction = new Transaction()
    const updateCpIx = ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 100_000 });
    const updateCuIx = ComputeBudgetProgram.setComputeUnitLimit({ units: 300_000 });
    const [configPda, _] = PublicKey.findProgramAddressSync(
      [Buffer.from(SEED_CONFIG)],
      program.programId
    );

    const configAccount = await program.account.config.fetch(configPda);

    const createIx = await program.methods
      .presaleCreate(
        coinData.name,
        coinData.symbol,
        coinData.uri
      )
      .accounts({
        creator: wallet.publicKey,
        token: mintKp.publicKey,
        quoteMint: quoteMint,
      })
      .preInstructions([
        ComputeBudgetProgram.setComputeUnitLimit({ units: 1_000_000 })
      ])
      .instruction();

    transaction.add(updateCpIx, updateCuIx, createIx);

    transaction.feePayer = wallet.publicKey;
    const blockhash = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash.blockhash;

    transaction.sign(mintKp);

    if (wallet.signTransaction) {
      const signedTx = await wallet.signTransaction(transaction);
      const sTx = signedTx.serialize();
      const signature = await connection.sendRawTransaction(
        sTx,
        {
          preflightCommitment: 'confirmed',
          skipPreflight: false
        }
      );

      const res = await connection.confirmTransaction(
        {
          signature,
          blockhash: blockhash.blockhash,
          lastValidBlockHeight: blockhash.lastValidBlockHeight,
        },
        "confirmed"
      );
      console.log("Successfully initialized.\n Signature: ", signature);
      successAlert("Successfully launched tokens.")
      return { res: res, tokenMint: mintKp };
    }
  } catch (error) {
    console.log("----", error);
    errorAlert("Sorry, the token launch failed")
    return false;
  }
}

export const presaleBuyTx = async (mint: PublicKey, wallet: WalletContextState, amount: number): Promise<any> => {
  // check the connection
  if (!wallet.publicKey || !connection) {
    console.log("Warning: Wallet not connected");
    return;
  }

  const provider = new anchor.AnchorProvider(connection, wallet, { preflightCommitment: "confirmed" })
  anchor.setProvider(provider);
  const program = new Program(
    pumpProgramInterface,
    provider
  ) as Program<Pumpfun>;

  const [configPda] = PublicKey.findProgramAddressSync(
    [Buffer.from(SEED_CONFIG)],
    program.programId
  );

  const configAccount = await program.account.config.fetch(configPda);
  try {
    const transaction = new Transaction()
    const cpIx = ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 100_000 });
    const cuIx = ComputeBudgetProgram.setComputeUnitLimit({ units: 300_000 });

    const swapIx = await program.methods
      .presaleBuy(
        new anchor.BN(amount * Math.pow(10, Number(Decimal)))
      )
      .accounts({
        buyer: wallet.publicKey,
        token: mint,
        quoteMint: quoteMint
      })
      .transaction();

    transaction.add(swapIx)
    transaction.add(cpIx, cuIx)
    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    if (wallet.signTransaction) {
      const signedTx = await wallet.signTransaction(transaction);
      const sTx = signedTx.serialize();

      const signature = await connection.sendRawTransaction(sTx, {
        preflightCommitment: "confirmed",
        skipPreflight: false,
      });
      const blockhash = await connection.getLatestBlockhash();

      const res = await connection.confirmTransaction(
        {
          signature,
          blockhash: blockhash.blockhash,
          lastValidBlockHeight: blockhash.lastValidBlockHeight,
        },
        "confirmed"
      );
      successAlert(`The operation was successful.`);
      return { res, signature };
    }

  } catch (error) {
    console.log("Error in swap transaction", error);
    errorAlert(`The operation was unsuccessful.`);
  }

}

// Swap transaction 
export const swapTx = async (mint: PublicKey, wallet: WalletContextState, amount: number, type: number): Promise<any> => {
  // check the connection
  if (!wallet.publicKey || !connection) {
    console.log("Warning: Wallet not connected");
    return;
  }

  const provider = new anchor.AnchorProvider(connection, wallet, { preflightCommitment: "confirmed" })
  anchor.setProvider(provider);
  const program = new Program(
    pumpProgramInterface,
    provider
  ) as Program<Pumpfun>;

  const [configPda] = PublicKey.findProgramAddressSync(
    [Buffer.from(SEED_CONFIG)],
    program.programId
  );

  const configAccount = await program.account.config.fetch(configPda);

  try {
    const transaction = new Transaction()
    const cpIx = ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 100_000 });
    const cuIx = ComputeBudgetProgram.setComputeUnitLimit({ units: 300_000 });

    const swapIx = await program.methods.swap(
      new anchor.BN(amount * Math.pow(10, Number(Decimal))),
      type,
      new anchor.BN(0),)
      .accounts({
        teamWallet: configAccount?.teamWallet,
        user: wallet.publicKey,
        quoteMint: quoteMint,
        tokenMint: mint,
      })
      .instruction()

    transaction.add(swapIx)
    transaction.add(cpIx, cuIx)
    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    if (wallet.signTransaction) {
      const signedTx = await wallet.signTransaction(transaction);
      const sTx = signedTx.serialize();
      console.log("----", await connection.simulateTransaction(signedTx));
      const signature = await connection.sendRawTransaction(sTx, {
        preflightCommitment: "confirmed",
        skipPreflight: false,
      });
      const blockhash = await connection.getLatestBlockhash();

      const res = await connection.confirmTransaction(
        {
          signature,
          blockhash: blockhash.blockhash,
          lastValidBlockHeight: blockhash.lastValidBlockHeight,
        },
        "confirmed"
      );
      successAlert(`The operation was successful.`);
      return res;
    }

  } catch (error) {
    console.log("Error in swap transaction", error);
    errorAlert(`The operation was unsuccessful.`);
  }
};

export const getTokenBalance = async (walletAddress: string, tokenMintAddress: string) => {
  const wallet = new PublicKey(walletAddress);
  const tokenMint = new PublicKey(tokenMintAddress);

  // Fetch the token account details
  const response = await connection.getTokenAccountsByOwner(wallet, {
    mint: tokenMint
  });

  if (response.value.length == 0) {
    console.log('No token account found for the specified mint address.');
    return;
  }

  // Get the balance
  const tokenAccountInfo = await connection.getTokenAccountBalance(response.value[0].pubkey);
  return tokenAccountInfo.value.uiAmount;
};

export const buyWowgoTokenSwap = async (buyAmount: number, wallet: WalletContextState) => {
  console.log("buyWowgoTokenSwap buyAmount", buyAmount);
  console.log("buyWowgoTokenSwap wallet", wallet.publicKey.toString());

  // check the connection
  if (!wallet.publicKey || !connection) {
    console.log("Warning: Wallet not connected");
    return;
  }

  // Validate that the buyAmount is a valid number
  if (isNaN(buyAmount) || buyAmount <= 0) {
    console.error("Invalid buy amount:", buyAmount);
    return;
  }

  const amount = buyAmount * (10 ** Number(Decimal))

  try {
    console.log("buyWowgoTokenSwap here---->");

    const quoteResponse = await fetch(
      `https://quote-api.jup.ag/v6/quote?inputMint=${NATIVE_MINT}&outputMint=${quoteMint}&amount=${amount}&slippageBps=${SlippageAmount}`

    ).then(res => res.json());

    console.log("quoteResponse ---->", quoteResponse);

    if (quoteResponse.error) {
      console.error("Error fetching quote:", quoteResponse.error);
      return;
    }

    // Get the serialized transactions for the swap
    const { swapTransaction } = await fetch("https://quote-api.jup.ag/v6/swap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quoteResponse,
        userPublicKey: wallet.publicKey.toString(),
        wrapAndUnwrapSol: true,
        dynamicComputeUnitLimit: true,
        prioritizationFeeLamports: "auto",
      }),
    }).then(res => res.json());

    console.log("swapTransaction ---->", swapTransaction);

    if (!swapTransaction) {
      console.error("Error: No swap transaction data received");
      return;
    }

    const transaction = new Transaction()
    const cpIx = ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 100_000 });
    const cuIx = ComputeBudgetProgram.setComputeUnitLimit({ units: 300_000 });

    transaction.add(swapTransaction)
    transaction.add(cpIx, cuIx)
    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    if (wallet.signTransaction) {
      const signedTx = await wallet.signTransaction(transaction);
      const sTx = signedTx.serialize();
      console.log("----", await connection.simulateTransaction(signedTx));
      const signature = await connection.sendRawTransaction(sTx, {
        preflightCommitment: "confirmed",
        skipPreflight: false,
      });
      const blockhash = await connection.getLatestBlockhash();

      const res = await connection.confirmTransaction(
        {
          signature,
          blockhash: blockhash.blockhash,
          lastValidBlockHeight: blockhash.lastValidBlockHeight,
        },
        "confirmed"
      );
      successAlert(`The operation was successful. Signature: ${signature}`);
      return res;
    } else {
      console.error("Wallet not connected or signTransaction is undefined");
      errorAlert("Wallet is not connected");
      return;
    }
  } catch (error) {
    console.error("Error in buyWowgoTokenSwap:", error);
    errorAlert("Failed to process the transaction. Please try again.");
  }
}
