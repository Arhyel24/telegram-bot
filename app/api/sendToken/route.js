import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  clusterApiUrl,
  Keypair,
} from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";
import { NextResponse } from "next/server";

// Use 'mainnet-beta' for mainnet
const SOLANA_NETWORK = "devnet";

export async function POST(request) {
  try {
    const {
      senderSecretKey,
      recipientAddress,
      amount,
      tokenMintAddress,
      decimals,
    } = await request.json();

    if (!senderSecretKey || !recipientAddress || !amount) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Connect to the Solana network
    const connection = new Connection(
      "https://rpc.devnet.soo.network/rpc",
      "confirmed"
    );

    // Load the sender's keypair
    const senderKeypair = Keypair.fromSecretKey(
      Uint8Array.from(senderSecretKey)
    );

    // Recipient's PublicKey
    const recipientPublicKey = new PublicKey(recipientAddress);

    let signature;

    // Check if we're sending an SPL token or native SOL
    if (tokenMintAddress) {
      const mintPublicKey = new PublicKey(tokenMintAddress);

      // Get or create associated token accounts for sender and recipient
      const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        senderKeypair,
        mintPublicKey,
        senderKeypair.publicKey
      );
      const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        senderKeypair,
        mintPublicKey,
        recipientPublicKey
      );

      // Create and send transaction for SPL token transfer
      const transaction = new Transaction().add(
        transfer(
          senderTokenAccount.address,
          recipientTokenAccount.address,
          senderKeypair.publicKey,
          amount * decimals
        )
      );

      signature = await connection.sendTransaction(transaction, [
        senderKeypair,
      ]);
      await connection.confirmTransaction(signature, "confirmed");
    } else {
      // Create and send transaction for native SOL transfer
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: senderKeypair.publicKey,
          toPubkey: recipientPublicKey,
          lamports: amount * Math.pow(10, 9), // 1 SOL = 10^9 lamports
        })
      );

      signature = await connection.sendTransaction(transaction, [
        senderKeypair,
      ]);
      await connection.confirmTransaction(signature, "confirmed");
    }

    return NextResponse.json({ signature });
  } catch (error) {
    console.error("Transaction failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
