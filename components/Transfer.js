"use client";
import { getProgram } from "@/utils/program";
import { 
    useConnection, 
    useWallet
} from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { useMemo, useState } from "react";
import toast from 'react-hot-toast';
import { BN } from "@coral-xyz/anchor";

const Transfer = () => {
    const [amount, setAmount] = useState();
    const [key, setKey] = useState();
    const [message, setMessage] = useState("");

    const wallet = useWallet();
    const { connection } = useConnection();

    const program = useMemo(()=>{
        if(wallet.publicKey) {
            return getProgram(connection, wallet);
        }
    },[connection, wallet]);

    const transferSol = async () => {
        if(!wallet.publicKey){
            toast.error("Wallet not found");
            return;
        }
        if(!key || !amount){
            toast.error("Receiver's key or amount missing!");
            return;
        }

        const toKey = new PublicKey(key);

        const value = new BN(parseInt(amount));

        try {
            const transaction = await program.methods.transferAmount(
                value
            ).accounts({
                from: wallet.publicKey,
                to: toKey,
                systemProgram: SystemProgram.programId 
            }).transaction();

            console.log("Transaction", transaction);

            // set fee payer
            transaction.feePayer = wallet.publicKey;
            // get latest blockhash
            transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
            // sign transaction
            const signedTx = await wallet.signTransaction(transaction);
            console.log("Signed Transaction", signedTx);
            // send transaction
            const txId = await connection.sendRawTransaction(signedTx.serialize());
            console.log("Transaction ID", txId);
            // confirmTransaction returns a signature
            const signature = await connection.confirmTransaction(txId, "confirmed");
      
            console.log("Transaction signature", txId.slice(0, 5));
            toast.success("Transfer Success!");
            setMessage("Success!");

        } catch(err) {
            toast.error("Transfer Failed!");
            console.log("Error : ", err);
        }

    };

    return (
        <div className="grid w-full h-full p-6 gap-4 place-items-center">
            <label className="block max-w-96  mb-2 text-sm font-medium text-gray-900">Enter Receiver's Public Key</label>
            <input onChange={(e)=>{setKey(e.target.value)}} type="text" className="max-w-96  bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Public Key" required />
            <label className="block max-w-96  mb-2 text-sm font-medium text-gray-900">Enter the amount of SOL</label>
            <input onChange={(e)=>{setAmount(e.target.value)}} type="text" className="max-w-96  bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="SOL" required />
            {amount}
            <button onClick={transferSol} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Transfer</button>
            <label className="block max-w-96  mb-2 text-sm font-medium text-gray-900">{message}</label>
        </div>
        
    );
}

export default Transfer;