import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Client } from "@solflare-wallet/utl-sdk";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { publicKey } = await req.json();
  console.log("Received t public key:", publicKey);

  // Validate the public key
  if (!publicKey) {
    return NextResponse.json(
      { error: "Public key is required" },
      { status: 400 }
    );
  }
  try {
    const rpcEndpoint = "https://rpc.devnet.soo.network/rpc"; // Replace with your RPC endpoint
    const solanaConnection = new Connection(rpcEndpoint);

    const pubKey = new PublicKey(publicKey);

    const filters = [
      {
        dataSize: 165, // Size of account (bytes)
      },
      {
        memcmp: {
          offset: 32, // Location of our query in the account (bytes)
          bytes: pubKey, // Our search criteria, a base58 encoded string
        },
      },
    ];

    const accounts = await solanaConnection.getParsedProgramAccounts(
      TOKEN_PROGRAM_ID,
      { filters: filters }
    );

    // Use Promise.all to wait for all token fetches to complete
    const tokens = await Promise.all(
      accounts.map(async (account) => {
        // Parse the account data
        const parsedAccountInfo = account.account.data;
        const mintAddress = parsedAccountInfo["parsed"]["info"]["mint"];
        const tokenBalance =
          parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];

        const mint = new PublicKey(mintAddress);
        const utl = new Client();

        // Fetch the mint information
        const token = await utl.fetchMint(mint);

        // console.log(token);

        return {
          name: token?.name || "Unknown Token",
          img: token?.logoURI || null,
          symbol: token?.symbol || "Unknown",
          mint: mint.toString(),
          tokenBalance,
        };
      })
    );
    // console.log(tokens);

    return NextResponse.json({ tokens });
  } catch (error) {
    console.error("Error fetching tokens:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch tokens" },
      { status: 500 }
    );
  }
}
