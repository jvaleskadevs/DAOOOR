"use client";
import "../styles/DaoCard.module.css";
import { useState, useEffect } from 'react';
import { useContractWrite, useAccount } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { Card, CardHeader, CardFooter, Image, Button, Link } from "@nextui-org/react";
import { SismoConnectButton } from "@sismo-core/sismo-connect-react";
import { AUTHS, CONFIG } from "../config/sismoConfig";
import { signMessage } from "../utils/signMessage";
import { DAO_REGISTRY_ADDRESS, DAO_REGISTRY_ABI } from '../constants/daoRegistry';
const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

type Props = {
  dao: ConfigDao;
}

const DaoCard = ({ dao }: Props) => {
  console.log(dao);
  // sismo bytes response, we will send it to our contract for ZK verification
  const [responseBytes, setResponseBytes] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const { address } = useAccount();

  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: DAO_REGISTRY_ADDRESS,
    abi: DAO_REGISTRY_ABI,
    functionName: 'joinDAO',
    args: [
      4,//dao?.id?.toString() ?? '',
      1,
      responseBytes ?? ADDRESS_ZERO
    ]
  });

  const joinDao = async (daoId: string) => {
    //write?.({ value: parseEther("0.001") });
    if (responseBytes || dao.tokenPrice == 0) {
      write?.();
    } else {
      write?.({ value: parseEther("0.001") });
    }
  }
  
  const fetchMetadata = async (uri: string) => {
    let response = await fetch(buildIpfsGateway(dao.uri));
    if (response.ok) {
      console.log(response);
      response = await response.json();
      console.log(response);
      setMetadata({
        name: response.name, 
        media: buildIpfsGateway(response.image)
      });
    }
  }
  
  const buildIpfsGateway = (uri: string) => {
    if (!uri) return;
    return "https://ipfs.io/ipfs/" + uri.substring(7);
  }
  
  useEffect(() => {
    if (dao) fetchMetadata(dao.uri);
  }, [dao]);

  return (
  <Card className="max-w-md mb-8">
    <CardHeader>
      <div className="flex flex-row w-full items-center justify-between">
        <h1 className="text-xl font-semibold">{metadata?.name}</h1>
        <Image
          radius="full"
          size="sm"
          width="36"
          height="36"
          alt="governance"
          src={metadata?.media}
        />
      </div>
    </CardHeader>
    <Image
      removeWrapper
      alt={metadata?.name}
      className="z-0 w-full h-full object-cover"
      src={metadata?.media}
    />    
    <CardFooter>
      <div className="flex flex-grow items-center gap-2">
        <div className="flex flex-col">
          <p className="text-tiny text-black/60">Membership Price:</p>
          <p>{formatEther(dao?.tokenPrice) + " MATIC"}</p>
        </div>
      </div>
      
      { dao?.sismoGroupId && !responseBytes && (
        <SismoConnectButton 
          config={CONFIG}
          auths={AUTHS}
          claims={[{ groupId: dao.sismoGroupId }]}
          signature={{ message: signMessage(address!) }}
          onResponseBytes={(responseBytes: string) => {
            setResponseBytes(responseBytes);
          }}
          text={"Join w/ Sismo"}
          overrideStyle={{background: "black"}}
        />
      )}
      
      <Button
        radius="lg" 
        size="lg"
        className="bg-black text-white text-xl p-8 ml-2"
        onClick={() => joinDao()}
      >Join</Button>
    </CardFooter>
  </Card>
  );
}

export default DaoCard;
