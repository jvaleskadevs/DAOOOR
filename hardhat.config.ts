import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();

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
    zkEVM: {
      url: process.env.ALCHEMY_POLYGON_ZK !== '' ? process.env.ALCHEMY_POLYGON_ZK : 'https://rpc.public.zkevm-test.net',
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  etherscan: {    
    apiKey: {
      zkEVM: process.env.SCAN_ZKEVM
    },
    customChains: [
      {
        network: "zkEVM",
        chainId: 1442,
        urls: {
          apiURL: "https://api-testnet-zkevm.polygonscan.com/api",
          browserURL: "https://testnet-zkevm.polygonscan.com/"
        }
      }
    ]
  }
};

export default config;
