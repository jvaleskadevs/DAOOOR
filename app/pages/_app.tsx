import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { useEffect, useState } from 'react';
import { NextUIProvider } from '@nextui-org/react';
import { getDefaultWallets, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import type { AppProps } from 'next/app';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  arbitrum,
  goerli,
  mainnet,
  optimism,
  polygon,
  polygonMumbai,
  base,
  zora,
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    polygonMumbai,/*
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    zora,*/
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [goerli, polygonMumbai] : []),
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function MyApp({ Component, pageProps }: AppProps) {
  const [isReady, setIsReady] = useState<boolean>(false);
  useEffect(() => {
    setIsReady(true);
  }, []);
  return (
    <NextUIProvider>
      { isReady && (
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: 'black',
            accentColorForeground: 'white'
          })}
          chains={chains}
        >
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
      )}
    </NextUIProvider>
  );
}

export default MyApp;
