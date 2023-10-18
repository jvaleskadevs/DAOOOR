"use client";
import { useState, useEffect } from 'react';
import { useAccount, useNetwork, useContractRead, useContractWrite, readContracts } from 'wagmi';
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
import { apollo, recentEventsQuery } from "../clients/apolloGraphClient";
import { gql } from '@apollo/client'

const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

type ConfigDao = {
  tokenPrice: string;
  sismo: { groupId: string };
}

const MainMenu: React.FC = () => {
  const [allDaos, setAllDaos] = useState<any>(null);
  
  const { address } = useAccount();
  const { chain } = useNetwork();  
/*
  const { data: dao } = useContractRead({
    address: DAO_REGISTRY_ADDRESS,
    abi: DAO_REGISTRY_ABI,
    functionName: 'configOf',
    args: [
      1
    ]
  });
*/  
  const getDAORegistry = async () => {
  
  }
  
  const fetchAllDaos = async () => {
    apollo
      .query({
        query: gql(recentEventsQuery),
      })
      .then(async (data) => {
        console.log(data.data);
        const contracts = [];
        data.data.daocreateds?.map((dao) => {
          const contract = {
            address: DAO_REGISTRY_ADDRESS,
            abi: DAO_REGISTRY_ABI,
            functionName: 'configOf',
            args: [
              dao.daoId
            ]
          };
          contracts.push(contract);
        });
        const response = await readContracts({ contracts });
        console.log(response);
        
        const daos = (response ?? [])
          .map(res => res.result)
          .map(dao => ({
            id: dao[2],
            tokenPrice: dao[0], 
            sismoGroupId: dao[1], 
            tba: dao[2], 
            uri: dao[3]     
        }))
        
        setAllDaos(daos);
      })
      .catch((err) => {
        console.log('Error fetching data: ', err)
    });
  }

/*  
  const fetchMetadata = async (uri: string) => {
    let response = await fetch(buildIpfsGateway(uri));
    if (response.ok && allDaos?.length === 1) {
      console.log(response);
      response = await response.json();
      setAllDaos([{
        ...allDaos?.[0], 
        name: response.name, 
        media: buildIpfsGateway(response.image)
      }]);
    } else {
      return null;
    }
  }
  
  const buildIpfsGateway = (uri: string) => {
    if (!uri) return;
    return "https://ipfs.io/ipfs/" + uri.substring(7);
  }
*/  
  useEffect(() => {
    fetchAllDaos();
  }, []);

  return (
    <>
      <h2 className="text-2xl font-semibold max-w-md w-full items-start ml-[-64px] pb-6">Create a DAO</h2>
      <p className="text-lg font-thin max-w-md pb-8">Create a DAO in less than 2 minutes and setup a treasury controlled
       by governance for your online community like the real hackers. Let's h**** go!</p>
      
      <CreateDao />
      
      <h2 className="text-2xl font-semibold max-w-md w-full items-start py-8 pt-12 ml-[-64px]">Recently created DAOs</h2>
      <p className="text-lg font-thin max-w-md pb-8">Join a DAO, some are free, while others are not. Enjoy private communities with Sismo ZKPs. Let's h**** go!</p>
      
      { (allDaos ?? []).map(dao => (
        <DaoCard dao={dao} key={dao.id} />
      ))}       
    </>
  );
}

export default MainMenu;
