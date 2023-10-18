"use client";
import { useState, useEffect, createRef } from 'react';
import { useAccount, useNetwork, useContractWrite } from 'wagmi';
import { NFTStorage } from 'nft.storage';
import { DAO_REGISTRY_ADDRESS, DAO_REGISTRY_ABI } from '../constants/daoRegistry';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link, Avatar} from "@nextui-org/react";

const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

const CreateDao = () => {
  //const [dao, setDao] = useState<ConfigDao | null>(null);
  
  const [name, setName] = useState<string>('');
  const [desc, setDesc] = useState<string>('');
  const [image, setImage] = useState<string>(
    'https://ipfs.io/ipfs/bafybeie7mwtxl6hnwp2ijauqoj7cnjvlcyoic64aai3cfn7v3wuf2r5bxa/black_square.png'
  );
  const [daoUri, setDaoUri] = useState<string>('');
  const [membershipPrice, setMembershipPrice] = useState<any>('');
  const [sismoGroupId, setSismoGroupId] = useState<string>('');
  
  const { address } = useAccount();
  const { chain } = useNetwork();
  
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  
  const inputRef = createRef();
  
  const { data, isError, isLoading, isSuccess, write } = useContractWrite({
    address: DAO_REGISTRY_ADDRESS,
    abi: DAO_REGISTRY_ABI,
    functionName: 'createDAO', 
    args: [
      daoUri,
      membershipPrice ?? 0,
      sismoGroupId ?? ADDRESS_ZERO
    ]
  });
  
  const onImageInputChange = (e) => {
    e.preventDefault();
    
    const reader = new FileReaderSync();
    
    setImage(reader.readAsDataURL(e.target.files[0]));
  }
  
  const toIPFS = async () => {
    setI
    try { 
      const client = new NFTStorage({ 
        token: process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN
      });
      if (!image) return;
      const metadata = await client.store({
        name: name,
        description: desc,
        image: image,
        seller_fee_basis_points: "7.7",
        seller_fee_recipient: address // calc tba address!?
      });
      console.log(metadata);
      
      setDaoUri(metadata.url);
    } catch (err) {
      console.log(err);
    }
    // black square metadata CID for testing purposes
    // ipfs://bafyreieq3nmxr2lqrr573rtfpmwllukd7vrclqcjhycnzqwe34qpvyg47e/metadata.json
  }
  
  const onCreate = async (onClose) => {
    if (!name || !desc || !image) return;
    onClose();
    await toIPFS();
  }
  
  useEffect(() => {
    if (daoUri) write?.();
  }, [daoUri]);
  
  useEffect(() => {
    // do something
  }, [isSuccess]);
  
  return (
  <>
    <Button
      size="lg"
      color="secondary"
      onPress={onOpen}
      radius="sm"
      //disabled={isLoading || !write}
      className="bg-black text-lg font-medium text-white mb-2"
    >
      Create DAO
    </Button>
    
    <Modal 
      isOpen={isOpen} 
      onOpenChange={onOpenChange}
      placement="top-center"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Create DAO</ModalHeader>
            <ModalBody>
              <Avatar
                src={image}
                className="w-20 h-20 text-large mx-auto cursor-pointer"
                onClick={() => inputRef.current?.click()}
              />
              <input
                type="file"
                multiple={false}
                accept={"image/*"}
                ref={inputRef}
                onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}
                className="hidden"
                value={''}
              />             
              <Input
                /*
                endContent={
                  <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                */
                label="Name"
                placeholder="A cool name for your DAO"
                type="text"
                variant="bordered"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
              <Input
                /*
                endContent={
                  <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                */
                label="Description"
                placeholder="Tell us something about your DAO"
                type="text"
                variant="bordered"
                onChange={(e) => setDesc(e.target.value)}
                value={desc}
              />

              <Input
                /*
                endContent={
                  <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                */
                label="Membership price (wei)"
                placeholder="The price every member must pay to join the DAO"
                type="number"
                variant="bordered"
                onChange={(e) => setMembershipPrice(e.target.value.toString())}
                value={typeof membershipPrice === Number ? membershipPrice : ''}
              />
              <Input
                /*
                endContent={
                  <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                */
                label="Sismo Group ID"
                placeholder="The group ID of your Sismo data source, if any"
                type="text"
                variant="bordered"
                onChange={(e) => setSismoGroupId(e.target.value)}
                value={sismoGroupId}
              />
              <div className="flex py-2 px-1 justify-between">
                <Checkbox
                  classNames={{
                    label: "text-small text-default-500",
                  }}
                >
                  Remember me
                </Checkbox>
                <Link href="#" size="sm" className="text-default-500">
                  Learn more
                </Link>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="bordered" onPress={onClose}>
                Close
              </Button>
              <Button
                className="bg-black text-white"
                onPress={() => onCreate(onClose)}
              >
                Create
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
    
    { isError && <p>{isError.error}</p> }
    { data && <p className="overflow-x-hidden">Tx Hash: {data.txHash}</p> }
  </>
  );
}

export default CreateDao;
