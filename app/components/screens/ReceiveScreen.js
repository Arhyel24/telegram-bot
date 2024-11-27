"use client";
import React, { useEffect, useState } from "react";
import QrCode from "qrcode";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { ArrowLeft, ArrowLeftCircleIcon, InfoIcon, Wallet } from "lucide-react";

const ReceiveScreen = ({ changeUistate, wallet }) => {
  const [qrCodeData, setQrCodeData] = useState(null);
  const SIZE = 200;

  useEffect(() => {
    const generateQrCode = async () => {
      try {
        const qrCodeDataUrl = await QrCode.toDataURL(wallet, {
          width: SIZE,
        });
        setQrCodeData(qrCodeDataUrl);
      } catch (error) {
        console.error("Error generating QR code: ", error);
        toast.error("Failed to generate QR code");
      }
    };

    generateQrCode();
  }, [wallet]);

  // function sliceWalletAddress(address) {
  //   if (!address) address = "00000000000000000000000000000000000000000";
  //   const start = address.slice(0, 8);
  //   const end = address.slice(-8);
  //   return `${start}...${end}`;
  // }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(wallet);
      toast.success("Copied");
    } catch (error) {
      console.error("Error copying text: ", error);
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between py-4">
      <div className="flex items-center w-full px-4 py-2 mb-4">
        <button onClick={() => changeUistate("dashboard")}>
          <ArrowLeft />
        </button>
        <h1 className="dark:text-white text-xl font-semibold ml-4">Receive</h1>
      </div>
      <div className="flex flex-col items-center w-full space-y-8">
        <div className="dark:bg-gray-800 flex gap-2 items-center text-gray-400 p-4 rounded-lg w-11/12">
          <InfoIcon />
          <p>
            To receive tokens, please scan the QR code or copy your wallet
            address below.
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg">
          {/* <Image src={qrCodeData} alt={walletAddress} width={192} /> */}
          <Image src={qrCodeData} alt={wallet} width={SIZE} height={SIZE} />
        </div>
        <div className="dark:bg-gray-800 border-2 text-gray-400 text-center p-2 rounded-lg w-[80%] flex items-center">
          {/* <i className="fa-solid fa-wallet text-gray-400 ml-2"></i> */}
          <Wallet />
          <input
            type="text"
            value={wallet}
            readOnly
            className="bg-transparent text-center w-full"
          />
        </div>
      </div>
      <div className="flex justify-around w-11/12 mt-8">
        <button
          onClick={handleCopy}
          className="w-full bg-green-500 text-black py-2 px-8 rounded-full"
        >
          Copy
        </button>
      </div>
    </div>
  );
};

export default ReceiveScreen;
