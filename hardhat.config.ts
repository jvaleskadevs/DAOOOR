import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
//import "@openzeppelin/hardhat-upgrades";
import * as dotenv from "dotenv";
dotenv.config();

/** @type import('hardhat/config').HardhatUserConfig */
const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1,
      },
      viaIR: true
    }
  },
  networks: {
    // testnets
    zkEVM: {
      url: process.env.ALCHEMY_POLYGON_ZK !== '' ? process.env.ALCHEMY_POLYGON_ZK : 'https://rpc.public.zkevm-test.net',
      accounts: [process.env.PRIVATE_KEY]
    },
    mumbai: {
      url: process.env.ALCHEMY_POLYGON_MUMBAI !== '' ? process.env.ALCHEMY_POLYGON_MUMBAI : 'https://rpc.ankr.com/polygon_mumbai',
      accounts: [process.env.PRIVATE_KEY]
    },
    scrollSepolia: {
      url: "https://sepolia-rpc.scroll.io/",
      accounts: [process.env.PRIVATE_KEY],
    },
    mantleTestnet: {
      url: 'https://rpc.testnet.mantle.xyz/',
      accounts: [process.env.PRIVATE_KEY],
    }
  },
  etherscan: {    
    apiKey: {
      zkEVM: process.env.SCAN_ZKEVM,
      polygonMumbai: process.env.SCAN_MUMBAI,
      mantleTestnet: 'abc',
      scrollSepolia: process.env.SCAN_SCROLL ?? 'abc',
    },
    customChains: [
      {
        network: "zkEVM",
        chainId: 1442,
        urls: {
          apiURL: "https://api-testnet-zkevm.polygonscan.com/api",
          browserURL: "https://testnet-zkevm.polygonscan.com/"
        }
      },
      {
        network: 'scrollSepolia',
        chainId: 534351,
        urls: {
          apiURL: 'https://api-sepolia.scrollscan.dev/api',//'https://sepolia-blockscout.scroll.io/api',
          browserURL: 'https://sepolia.scrollscan.dev/'// 'https://sepolia-blockscout.scroll.io/',
        },
      },
      {
        network: "mantleTestnet",
        chainId: 5001,
        urls: {
          apiURL: "https://explorer.testnet.mantle.xyz/api",
          browserURL: "https://explorer.testnet.mantle.xyz/",
        },
      }
    ]
  }
};

export default config;
