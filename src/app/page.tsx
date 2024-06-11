"use client"
import WalletButton from "../components/WalletButton";
import UploadImageButton from "../components/UploadImageButton";


export default function Home() {
  return (
    <div>
      <h1 className="text-white mb-4 ml-4 mt-2 text-3xl font-semibold">Bitcoin Wallet</h1>
    <div>
      <WalletButton/>
      <UploadImageButton/>
    </div>
    </div>
  )
}
