'use client';

import { useState } from 'react';
import Header from '../components/Header';
import { useRouter } from 'next/navigation'
import { Contract, ethers } from 'ethers';
import YiDengTokenAbi from '../abis/YiDengToken.json';
import CourseMarketAbi from '../abis/CourseMarket.json';
import { hooks } from '../connections/metaMask';
const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider, useENSNames } = hooks;

export default function BuyToken() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [yiDengAmount, setYiDengAmount] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const { useProvider } = hooks;
  const provider = useProvider();

  const signer = provider?.getSigner();
  //找到合约地址
  const yiDengTokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS
  const courseAddress = process.env.NEXT_PUBLIC_COURSE_ADDRESS
  if (!yiDengTokenAddress || !courseAddress) {
    return <div>合约地址不存在</div>
  }

  const yiDengTokenContract = new ethers.Contract(yiDengTokenAddress, YiDengTokenAbi.abi, signer);
  const courseContract = new ethers.Contract(courseAddress, CourseMarketAbi.abi, signer);

  return (
    <div>
      <Header />

      <div className="container mx-auto p-8">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Swap ETH for YiDeng Token</h2>

          <div className="space-y-4">
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <label className="block text-sm font-medium mb-2">From (ETH)</label>
              <input
                type="number"
                className="w-full p-2 border rounded-md dark:bg-gray-600 dark:border-gray-500"
                placeholder="Enter ETH amount"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  setYiDengAmount(String(Number(e.target.value) * 1000));
                }}
              />
            </div>

            <div className="flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>

            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <label className="block text-sm font-medium mb-2">To (YiDeng Token)</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md dark:bg-gray-600 dark:border-gray-500"
                value={yiDengAmount}
                disabled
                placeholder="YiDeng Token amount"
              />
            </div>

            <button
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={async () => {
                try {
                  if (!price) {
                    setMessage('Please enter an amount');
                    return;
                  }

                  const result = await yiDengTokenContract.buyWithETH({
                    // value: ethers.parseEther(price)
                    value: BigInt(price)
                  });
                  console.log('result', result)
                  const transactionReceipt = await provider?.waitForTransaction(result.hash);
                  console.log('transactionReceipt', transactionReceipt)
                  if (transactionReceipt?.status === 1) {
                    setMessage('Token purchase successful!');
                    setPrice('');
                  } else {
                    setMessage('Transaction failed');
                  }
                } catch (e: any) {
                  console.error('Buy token error:', e);
                  setMessage(e.reason || 'Transaction failed');
                }
              }}
            >
              Swap
            </button>

            {message && (
              <div className={`text-center p-2 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>


    </div>
  );
}