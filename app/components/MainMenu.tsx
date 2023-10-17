"use client";
import { useState, useEffect } from 'react';
import { useAccount, useNetwork, useContractRead, useContractWrite } from 'wagmi';
import { parseEther } from 'viem';
import {
  SismoConnectResponse,
  AuthRequest,
  ClaimRequest,
  SismoConnectButton,
  VaultConfig,
  VerifiedAuth,
  VerifiedClaim,
  AuthType,
  ClaimType,
  SismoConnectConfig,
} from "@sismo-core/sismo-connect-react";
import { AUTHS, CONFIG } from "../config/sismoConfig";
import DaoCard from "./DaoCard";
import CreateDao from "./CreateDao";
import { Button } from '@nextui-org/react';
import { signMessage } from "../utils/signMessage";
import { DAO_REGISTRY_ADDRESS, DAO_REGISTRY_ABI } from '../constants/daoRegistry';

const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

type ConfigDao = {
  tokenPrice: string;
  sismo: { groupId: string };
}

const MainMenu: React.FC = () => {
  const [allDaos, setAllDaos] = useState<any>(null);
  
  const { address } = useAccount();
  const { chain } = useNetwork();  

  const { data: dao } = useContractRead({
    address: DAO_REGISTRY_ADDRESS,
    abi: DAO_REGISTRY_ABI,
    functionName: 'configOf',
    args: [
      1
    ]
  });
  
  const fetchAllDaos = async () => {
    
  }

  
  const fetchMetadata = async (uri: string) => {
    let response = await fetch(buildIpfsGateway(uri));
    if (response.ok && allDaos?.length === 1) {
      console.log(response);
      response = await response.json();
      setAllDaos([{...allDaos?.[0], name: response.name, media: buildIpfsGateway(response.image)}]);
    } else {
      return null;
    }
  }
  
  const buildIpfsGateway = (uri: string) => {
    if (!uri) return;
    return "https://ipfs.io/ipfs/" + uri.substring(7);
  }
  
  useEffect(() => {
    if (dao) {
      fetchMetadata(dao[3]);
      setAllDaos([{
        tokenPrice: dao[0], 
        sismoGroupId: dao[1], 
        tba: dao[2], 
        uri: dao[3],
        id: 1
      }]);
    }
  }, [dao]);

  return (
    <>
      <CreateDao />
      
      { (allDaos ?? []).map(dao => (
        <DaoCard dao={dao} key={dao.id} />
      ))}
      
         
    </>
  );
}

export default MainMenu;
