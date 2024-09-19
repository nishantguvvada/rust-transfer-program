import {
    Program,
    AnchorProvider,
    setProvider
} from "@coral-xyz/anchor";
import {
    PublicKey
} from "@solana/web3.js";
import IDL from "./IDL.json"; 

export const getProgram = (connection, wallet) => {

    const provider = new AnchorProvider(connection, wallet, { commitment: "confirmed" });
    setProvider(provider);

    const programId = new PublicKey("7Yj4rxGBKhu6Tps9xKQAENtaD5Z5uqFF8wmBHLk7p4Kw");
    const program = new Program(IDL, programId, provider);

    return program;
}