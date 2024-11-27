import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
} from "@solana/web3.js";
import { NextResponse } from "next/server";

const connection = new Connection(
  "https://rpc.devnet.soo.network/rpc",
  "confirmed"
);

export async function POST(req) {
  try {
    // Await the JSON parsing of the request body
    const { publicKey } = await req.json();
    console.log("Received public key:", publicKey);

    // Validate the public key
    if (!publicKey) {
      return NextResponse.json(
        { error: "Public key is required" },
        { status: 400 }
      );
    }

    // Create a PublicKey instance
    const pubKey = new PublicKey(publicKey);

    // Fetch the balance
    const balance = await connection.getBalance(pubKey);
    const balanceInSol = balance / LAMPORTS_PER_SOL;

    // Log the balance to the console
    console.log(`Balance: ${balanceInSol} SOL`);

    // Send the balance as a JSON response
    return NextResponse.json({ balance: balanceInSol });
  } catch (error) {
    console.error("Error fetching balance:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch balance" },
      { status: 500 }
    );
  }
}
