'use client';

import { useState } from 'react';
import Header from '../components/Header';
import { useRouter } from 'next/navigation'
import { Contract, ethers } from 'ethers';
import YiDengTokenAbi from '../abis/YiDengToken.json';
import CourseMarketAbi from '../abis/CourseMarket.json';
import { hooks } from '../connections/metaMask';
const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider, useENSNames } = hooks;

export default function CreateCourse() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setMessage('');

    const response = await fetch('/api/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description, price: Number(price) }),
    });

    if (response.ok) {
      const data = await response.json();
      try {
        const result = await courseContract.addCourse(
          data.uuid,
          data.name,
          BigInt(data.price!)
        );
        // const result = await courseContract.addCourse('2', 'course2', 1);

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
        setMessage(`Course created with ID: ${data.id}`);
        setName('');
        setDescription('');
        setPrice('');
        router.push('/');
      } catch (e: any) {
        console.log('eee', e, typeof e, JSON.stringify(e))
        console.log(e.code)
        setMessage(`Error: ${e.reason}`);
      }
    } else {
      const errorData = await response.json();
      setMessage(`Error: ${errorData.message}`);
    }
  };

  return (
    <div>
      <Header />

      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create New Course</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Course Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              id="price"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Course
          </button>
        </form>

        {message && (
          <div className="mt-4 text-center text-sm">
            {message}
          </div>
        )}
      </div>

    </div>
  );
}