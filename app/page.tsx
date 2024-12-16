'use client'
import Image from "next/image";
import MetaMaskCard from "./components/connectorCards/MetaMaskCard";
import YiDengTokenAbi from './abis/YiDengToken.json';
import CourseMarketAbi from './abis/CourseMarket.json';
import { hooks } from './connections/metaMask';
import { Contract, ethers } from 'ethers';
import { useEffect, useState } from 'react';
// import { InfoContract, InfoContract__factory } from '@/abis/types';
const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider, useENSNames } = hooks;

export default function Home() {
  const { useProvider } = hooks;
  const provider = useProvider();

  const signer = provider?.getSigner();
  console.log('process.env.tokenAddress', process.env)
  //找到合约地址
  const yiDengTokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS
  const courseAddress = process.env.NEXT_PUBLIC_COURSE_ADDRESS
  if (!yiDengTokenAddress || !courseAddress) {
    return <div>合约地址不存在</div>
  }

  // const contract = InfoContract__factory.connect(address, signer!);
  const yiDengTokenContract = new ethers.Contract(yiDengTokenAddress, YiDengTokenAbi, signer);
  const courseContract = new ethers.Contract(courseAddress, CourseMarketAbi, signer);

  const accounts = useAccounts();
  console.log('accounts', accounts);

  const [isPending, setPending] = useState(false);
  const [ethValue, setEthValue] = useState(0);
  const [ydValue, setYdValue] = useState(0);
  const [balance, setBalance] = useState('')

  const getBalance = async () => {
    if (accounts && accounts.length > 0) {
      console.log('getBalance');
      const data = await yiDengTokenContract.balanceOf(accounts[0]);
      console.log('balance', data);
      setBalance(data.toString());
    }
  }

  useEffect(() => {
    if (accounts && accounts?.length > 0) {
      getBalance()
    }
  }, [yiDengTokenAddress, yiDengTokenContract])

  useEffect(() => {
    if (!provider || !signer) return;

    const handleEvent = (param1, param2, event) => {
      try {
        console.log('Event received:', { param1, param2, event });
        getBalance()
      } catch (error) {
        console.error('Error handling event:', error);
      }
    };

    try {
      // contract.on('DepositMade', handleEvent);
    } catch (error) {
      console.error('Error setting up event listener:', error);
    }

    return () => {
      try {
        // contract.off('DepositMade', handleEvent);
      } catch (error) {
        console.error('Error removing event listener:', error);
      }
    };
  }, [yiDengTokenContract])


  useEffect(() => {
    console.log('isPending: ', isPending);
  }, [isPending]);

  return (
    <div className="">
      <header className="flex justify-between items-center">
        <h1>Next.js</h1>

        <MetaMaskCard />
      </header>
    </div>
  );
}
