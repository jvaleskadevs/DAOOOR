"use client";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import type { NextPage } from 'next';
import Head from 'next/head';
import MainMenu from '../components/MainMenu';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const { address } = useAccount();
  
  return (
    <div className={styles.container}>
      <Head>
        <title>DBA App</title>
        <meta
          content="DBA is a powerful tool for creating and managing DAO bound accounts"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
                
        { address ? <MainMenu /> : <ConnectButton /> }
 
      </main>

      <footer className={styles.footer}>
        <a href="https://rainbow.me" rel="noopener noreferrer" target="_blank">
          Made with 💙 by magical Ankys 👾
        </a>
      </footer>
    </div>
  );
};

export default Home;
