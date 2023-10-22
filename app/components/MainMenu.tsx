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
import { apollo, allDAOEventsQuery } from "../clients/apolloGraphClient";
import { gql } from '@apollo/client'

const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";


const MainMenu: React.FC = () => {
  const [allDaos, setAllDaos] = useState<any>(null);
  
  const { address } = useAccount();
  const { chain } = useNetwork();  

  
  const fetchAllDaos = async () => {
    apollo
      .query({
        query: gql(allDAOEventsQuery),
      })
      .then(async (data) => {
        console.log(data.data);
        const contracts: any[] = [];
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
            id: (dao as any)[0],
            tba: (dao as any)[1], 
            gov: (dao as any)[2],
            uri: (dao as any)[3],
            tokenPrice: (dao as any)[4], 
            sismoGroupId: (dao as any)[5]
        }))
        
        setAllDaos(daos);
      })
      .catch((err) => {
        console.log('Error fetching data: ', err)
    });
  }

  useEffect(() => {
    fetchAllDaos();
  }, []);

  return (
    <>
      <h2 className="text-2xl font-semibold max-w-md w-full items-start ml-[-64px] pb-6">Create a DAO</h2>
      <p className="text-lg font-thin max-w-md pb-8">Create a DAO in less than 2 minutes and setup a treasury controlled
       by governance for your online community like the real hackers. Let´s h**** go!</p>
      
      <CreateDao />
      
      <h2 className="text-2xl font-semibold max-w-md w-full items-start py-8 pt-12 ml-[-64px]">Recently created DAOs</h2>
      <p className="text-lg font-thin max-w-md pb-8">Join a DAO, some are free, while others are not. Enjoy private communities with Sismo ZKPs. Let´s h**** go!</p>
      
      { (allDaos ?? []).toReversed().map(dao => (
        <DaoCard dao={dao} key={dao.id} />
      ))}       
    </>
  );
}

export default MainMenu;
