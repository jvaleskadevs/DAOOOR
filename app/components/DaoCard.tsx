"use client";
import { useState } from 'react';
import { useContractWrite, useAccount } from 'wagmi';
import { parseEther } from 'viem';
import { Card, CardHeader, CardFooter, Image, Button } from "@nextui-org/react";
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
  const { address } = useAccount();

  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: DAO_REGISTRY_ADDRESS,
    abi: DAO_REGISTRY_ABI,
    functionName: 'joinDAO',
    args: [
      1,
      1,
      responseBytes ?? ADDRESS_ZERO
    ]
  });

  const joinDao = async (daoId: string) => {
    //write?.({ value: parseEther("0.001") });
    if (responseBytes) {
      write?.();
    } else {
      write?.({ value: parseEther("0.001") });
    }
  }

  return (
  <Card className="max-w-md">
    <CardHeader>
      <h1>{dao?.name}</h1>
    </CardHeader>
    <Image
      removeWrapper
      alt={dao?.name}
      className="z-0 w-full h-full object-cover"
      src={dao?.media}
    />    
    <CardFooter>
      <div className="flex flex-grow items-center gap-2">
        <div className="flex flex-col">
          <p className="text-tiny text-black/60">Membership Price:</p>
          <p>{Number(dao?.tokenPrice) / (10 ** 18).toString() + " MATIC"}</p>
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
        />
      )}
      
      <Button
        radius="full" 
        size="sm"
        className=""
        onClick={() => joinDao()}
      >Join</Button>
    </CardFooter>
  </Card>
  );
}

export default DaoCard;
