"use client";
import { useState, useEffect } from 'react';
import { useAccount, useNetwork, useContractWrite } from 'wagmi';
import { DAO_REGISTRY_ADDRESS, DAO_REGISTRY_ABI } from '../constants/daoRegistry';
import { Button } from '@nextui-org/react';

const CreateDao = () => {
  const [dao, setDao] = useState<ConfigDao | null>(null);
  
  const { address } = useAccount();
  const { chain } = useNetwork();
  
  const { data, isError, isLoading, write } = useContractWrite(
    {
      addressOrName: DAO_REGISTRY_ADDRESS,
      contractInterface: DAO_REGISTRY_ABI
    },
    'createDAO', 
    {
      args: [
        dao?.daoUri,
        dao?.tokenPrice,
        dao?.sismoGroupId
      ]
    }
  );
  
  return (
  <>
    <Button
      size="lg"
      color="secondary"
      onClick={() => write?.()}
      radius="sm"
      //disabled={isLoading || !write}
      className="bg-gray-800 text-lg font-medium text-gray-200 mb-2"
    >
      Create DAO
    </Button>
    
    { isError && <p>{isError.error}</p> }
    { data && <p className="overflow-x-hidden">Tx Hash: {data.txHash}</p> }
  </>
  );
}

export default CreateDao;
