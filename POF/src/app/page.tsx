'use client';

import Image from "next/image";
import { ConnectButton, MediaRenderer, TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react";
import thirdwebIcon from "@public/thirdweb.svg";
import { useState } from "react";
import { client } from "./client";
import { defineChain, getContract, toEther } from "thirdweb";
import { getContractMetadata } from "thirdweb/extensions/common";
import { claimTo, getActiveClaimCondition, getTotalClaimedSupply, nextTokenIdToMint } from "thirdweb/extensions/erc721";

export default function Home() {
  const account = useActiveAccount();
  const chain = defineChain(30732);
  const [quantity, setQuantity] = useState(1);

  const contract = getContract({
    client: client,
    chain: chain,
    address: "0x7B73dEAB25252b557c409894f1f5b1008E752fbb"
  });

  const { data: contractMetadata, isLoading: isContractMetadataLoading } = useReadContract(getContractMetadata, { contract });
  const { data: claimedSupply, isLoading: isClaimedSupplyLoading } = useReadContract(getTotalClaimedSupply, { contract });
  const { data: totalNFTSupply, isLoading: isTotalSupplyLoading } = useReadContract(nextTokenIdToMint, { contract });
  const { data: claimCondition } = useReadContract(getActiveClaimCondition, { contract });

  const getPrice = (quantity: number) => {
    const total = quantity * parseInt(claimCondition?.pricePerToken.toString() || "1");
    return toEther(BigInt(total));
  }

  return (
    <main className="bg-zinc-950 min-h-screen flex items-center justify-center px-4 py-10">
      <div className="bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900 rounded-3xl shadow-xl max-w-lg w-full p-8 space-y-8 text-center">
        <Header />

        <ConnectButton client={client} chain={chain} />

        <div className="space-y-4">
          {isContractMetadataLoading ? (
            <p className="text-white">Loading metadata...</p>
          ) : (
            <>
              <MediaRenderer
                client={client}
                src={contractMetadata?.image}
                className="w-80 h-80 rounded-xl border border-indigo-700 shadow-lg object-cover mx-auto"
              />
              <h2 className="text-3xl font-semibold text-white mt-4">
                {contractMetadata?.name}
              </h2>
              <p className="text-yellow-300 text-sm mt-2">
                {contractMetadata?.description}
              </p>
            </>
          )}

          {isClaimedSupplyLoading || isTotalSupplyLoading ? (
            <p className="text-white">Loading supply data...</p>
          ) : (
            <p className="text-lg text-white font-bold mt-2">
              Total Frens Minted: {claimedSupply?.toString()}/{totalNFTSupply?.toString()}
            </p>
          )}
        </div>

        <TransactionButton
          className="bg-purple-600 hover:bg-purple-500 transition text-white font-medium px-6 py-2 rounded-lg shadow-lg"
          transaction={() => claimTo({
            contract: contract,
            to: account?.address || "",
            quantity: BigInt(quantity),
          })}
          onTransactionConfirmed={() => {
            alert("NFT Claimed!");
            setQuantity(1);
          }}
        >
          {`Join Frens (${getPrice(quantity)} MOVE)`}
        </TransactionButton>
      </div>
    </main>
  );
}

function Header() {
  return (
    <header className="flex flex-col items-center space-y-4">
      <Image
        src={thirdwebIcon}
        alt="Thirdweb Icon"
        width={150}
        height={150}
        className="drop-shadow-lg filter drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]"
      />
      <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 tracking-tight">
        Onchain Friends NFT
      </h1>
    </header>
  );
}
