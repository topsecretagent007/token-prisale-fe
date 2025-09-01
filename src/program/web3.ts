import { ComputeBudgetProgram, Connection, Keypair, PublicKey, Transaction, clusterApiUrl } from '@solana/web3.js';
import { Pumpfun } from './pumpfun'
import idl from "./pumpfun.json"
import * as anchor from '@coral-xyz/anchor';
import { WalletContextState, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { errorAlert, successAlert } from '@/components/others/ToastGroup';
import { Program } from '@coral-xyz/anchor';
import { SEED_CONFIG } from './seed';
import { launchDataInfo } from '@/utils/types';

export const commitmentLevel = "processed";

export const endpoint =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl("devnet");
// export const decimals = process.env.NEXT_PUBLIC_TEST_DECIMALS;
export const connection = new Connection(endpoint, commitmentLevel);
export const pumpProgramId = new PublicKey(idl.address);
export const pumpProgramInterface = JSON.parse(JSON.stringify(idl));


// Send Fee to the Fee destination
export const createToken = async (wallet: WalletContextState, coinData: launchDataInfo) => {

  const provider = new anchor.AnchorProvider(connection, wallet, { preflightCommitment: "confirmed" })
  anchor.setProvider(provider);
  const program = new Program(
    pumpProgramInterface,
    provider
  ) as Program<Pumpfun>;

  console.log('========Fee Pay==============');

  // check the connection
  if (!wallet.publicKey || !connection) {
    errorAlert("Wallet Not Connected");
    console.log("Warning: Wallet not connected");
    return "WalletError";
  }

  try {
    console.log("coinData--->", wallet, coinData)

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
      // .launch(
      //   coinData.decimals,
      //   new anchor.BN(coinData.tokenSupply),
      //   new anchor.BN(coinData.virtualReserves),
      //   coinData.name,
      //   coinData.symbol,
      //   coinData.uri
      // )
      .launch(
        coinData.name,
        coinData.symbol,
        coinData.uri
      )
      .accounts({
        creator: wallet.publicKey,
        token: mintKp.publicKey,
        teamWallet: configAccount.teamWallet,
      })
      .instruction();

    console.log("createIx--->", createIx)


    transaction.add(updateCpIx, updateCuIx, createIx);

    const swapIx = await program.methods.swap(
      new anchor.BN(coinData.presale * Math.pow(10, 9)),
      0,
      new anchor.BN(0),)
      .accounts({
        user: wallet.publicKey,
        tokenMint: mintKp.publicKey,
        teamWallet: configAccount.teamWallet,
      })
      .instruction()

    transaction.add(swapIx)

    transaction.feePayer = wallet.publicKey;
    const blockhash = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash.blockhash;

    transaction.sign(mintKp);
    console.log("--------------------------------------");
    console.log(transaction);

    if (wallet.signTransaction) {
      const signedTx = await wallet.signTransaction(transaction);
      const sTx = signedTx.serialize();
      console.log('----', await connection.simulateTransaction(signedTx));
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
      return res;
    }
  } catch (error) {
    console.log("----", error);
    errorAlert("Sorry, the token launch failed")
    return false;
  }
};

// Swap transaction
export const swapTx = async (mint: PublicKey, wallet: WalletContextState, amount: string, type: number): Promise<any> => {
  console.log('========trade swap==============');

  console.log("swapTx mint ==>", mint.toBase58())
  console.log("swapTx wallet ==>", wallet)
  console.log("swapTx amount ==>", amount)
  console.log("swapTx type ==>", type)

  // check the connection
  if (!wallet.publicKey || !connection) {
    console.log("Warning: Wallet not connected");
    return;
  }

  const provider = new anchor.AnchorProvider(connection, wallet, { preflightCommitment: "confirmed" })
  console.log("provider    ======   >", provider)
  anchor.setProvider(provider);
  const program = new Program(
    pumpProgramInterface,
    provider
  ) as Program<Pumpfun>;

  const [configPda] = PublicKey.findProgramAddressSync(
    [Buffer.from(SEED_CONFIG)],
    program.programId
  );

  console.log("program    ======   >", configPda)


  const configAccount = await program.account.config.fetch(configPda);
  console.log("configAccount ===>", configAccount)
  try {
    const transaction = new Transaction()
    const cpIx = ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 100_000 });
    const cuIx = ComputeBudgetProgram.setComputeUnitLimit({ units: 300_000 });

    console.log("configPda ===>", configPda)

    let _decimal = type == 0 ? 9 : 6;
    const swapIx = await program.methods.swap(
      new anchor.BN(parseFloat(amount) * Math.pow(10, _decimal)),
      type,
      new anchor.BN(0),)
      .accounts({
        user: wallet.publicKey,
        tokenMint: mint,
        teamWallet: configAccount?.teamWallet,
      })
      .instruction()

    console.log("swapIx ===>", swapIx)

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
      return { res, signature };
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

  // Convert the balance from integer to decimal format

  return tokenAccountInfo.value.uiAmount;
};
