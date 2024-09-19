"use client";
import '@solana/wallet-adapter-react-ui/styles.css';
import dynamic from "next/dynamic";
const WalletMultiButtonDynamic = dynamic(
    async () => (await import ("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
);
const WalletDisconnectButtonDynamic = dynamic(
    async () => (await import ("@solana/wallet-adapter-react-ui")).WalletDisconnectButton,
    { ssr: false}
);

const Wallet = () => {
    return (
        <div className="grid w-full h-full p-6 gap-4 place-items-center">
            <WalletMultiButtonDynamic/>
            <WalletDisconnectButtonDynamic/>
        </div>
    );
}

export default Wallet;