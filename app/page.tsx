'use client'

import YiDengTokenAbi from './abis/YiDengToken.json';
import CourseMarketAbi from './abis/CourseMarket.json';
import { hooks } from './connections/metaMask';
import { Contract, ethers } from 'ethers';
import { useEffect, useState } from 'react';
// import { InfoContract, InfoContract__factory } from '@/abis/types';
const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider, useENSNames } = hooks;
import AddCourse from './components/AddCourse';
import Courses from "./components/Courses";
import Header from "./components/Header";

export default function Home() {
  const { useProvider } = hooks;
  const provider = useProvider();

  const signer = provider?.getSigner();
  //找到合约地址
  const yiDengTokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS
  const courseAddress = process.env.NEXT_PUBLIC_COURSE_ADDRESS
  if (!yiDengTokenAddress || !courseAddress) {
    return <div>合约地址不存在</div>
  }

  // const contract = InfoContract__factory.connect(address, signer!);
  const yiDengTokenContract = new ethers.Contract(yiDengTokenAddress, YiDengTokenAbi.abi, signer);
  const courseContract = new ethers.Contract(courseAddress, CourseMarketAbi.abi, signer);

  const accounts = useAccounts();
  // console.log('accounts', accounts);

  const [isPending, setPending] = useState(false);
  const [ethValue, setEthValue] = useState(0);
  const [ydValue, setYdValue] = useState(0);
  const [balance, setBalance] = useState('')

  const getBalance = async () => {
    if (accounts && accounts.length > 0) {
      // console.log('getBalance');
      const data = await yiDengTokenContract.balanceOf(accounts[0]);
      // console.log('balance', data);
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

    // const handleEvent = (param1, param2, event) => {
    //   try {
    //     console.log('Event received:', { param1, param2, event });
    //     getBalance()
    //   } catch (error) {
    //     console.error('Error handling event:', error);
    //   }
    // };

    // try {
    //   // contract.on('DepositMade', handleEvent);
    // } catch (error) {
    //   console.error('Error setting up event listener:', error);
    // }

    return () => {
      try {
        // contract.off('DepositMade', handleEvent);
      } catch (error) {
        console.error('Error removing event listener:', error);
      }
    };
  }, [yiDengTokenContract])


  useEffect(() => {
    // console.log('isPending: ', isPending);
  }, [isPending]);

  return (
    <div className="">
      <Header />


      <p>余额: {balance}</p>
      <button
        onClick={async () => {
          try {
            const result = await yiDengTokenContract.distributeInitialTokens(
              '0x22808912E21FE9923ab421741eDD99C611A2661C',
              '0xe62ccea036A9F23a861A126D22f54c1E9370f577',
              '0x7889F7fF21541D48F059EE982D8615c851a56C4d',
            );
            console.log('result', result);

            const transactionReceipt = await provider?.waitForTransaction(result.hash);

            console.log(
              '监听当前hash挖掘的收据交易状态【为1代表交易成功、为0代表交易失败】transactionReceipt.status：',
              transactionReceipt?.status,
            );
            console.log(
              '监听当前hash挖掘的收据交易event事件日志transactionReceipt.logs：',
              transactionReceipt?.logs,
            );

            if (transactionReceipt?.status === 1 && transactionReceipt.logs.length !== 0) {
              setPending(false);
            }
          } catch (e) {
            console.log('初始代币分发-error', e)
          }
        }}
      >
        初始代币分发
      </button>
      <br></br>
      <Courses accounts={accounts} courseContract={courseContract} provider={provider}
        courseAddress={courseAddress} yiDengTokenContract={yiDengTokenContract} />
      <br></br>
      <button onClick={async () => {
        try {
          if (!accounts) { return }
          const result = await courseContract.hasCourse(accounts[0], '1');
          console.log('result', result);

        } catch (e: any) {
          console.log('eee', e, typeof e)
          console.log(e.code)
        }
      }}>是否有课程</button>



      <p>{isPending ? 'loading' : 'loaded'}</p>
    </div>
  );
}
