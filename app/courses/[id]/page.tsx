'use client'
import React, { Fragment, useEffect, useState } from 'react';
import Image from "next/image";
import Header from '@/app/components/Header';
import { useParams, useRouter } from 'next/navigation';
import { Contract, ethers } from 'ethers';
import YiDengTokenAbi from '../../abis/YiDengToken.json';
import CourseMarketAbi from '../../abis/CourseMarket.json';
import nftAbi from '../../abis/nft.json';
import { hooks } from '../../connections/metaMask';
const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider, useENSNames } = hooks;

type CourseType = {
  id: string;
  uuid: string;
  name: string;
  description: string;
  price: string;
  hasCourse: boolean;
}

const Course = () => {
  const { id } = useParams();
  const [course, setCourse] = useState<CourseType>({
    id: '',
    uuid: '',
    name: '',
    description: '',
    price: '',
    hasCourse: false,
  });
  const [hasCourse, setHasCourse] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const accounts = useAccounts();
  const router = useRouter();

  const { useProvider } = hooks;
  const provider = useProvider();

  const signer = provider?.getSigner();

  const yiDengTokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS
  const courseAddress = process.env.NEXT_PUBLIC_COURSE_ADDRESS
  const nftAddress = process.env.NEXT_PUBLIC_NFT_ADDRESS

  if (!yiDengTokenAddress || !courseAddress || !nftAddress) {
    return <div>合约地址不存在</div>
  }

  const yiDengTokenContract = new ethers.Contract(yiDengTokenAddress, YiDengTokenAbi.abi, signer);
  const courseContract = new ethers.Contract(courseAddress, CourseMarketAbi.abi, signer);
  const nftContract = new ethers.Contract(nftAddress, nftAbi.abi, signer);

  const getCourse = async () => {
    if (!accounts) { return }

    const response = await fetch(`/api/courses/${id}`);
    const data = await response.json();
    console.log('getCourse data', data);
    try {
      console.log('getCourse accounts', accounts);
      const result = await courseContract.hasCourse(accounts[0], data.uuid);
      console.log('getCourse result', result);
      setHasCourse(result);
      data.hasCourse = result
      setCourse(data);
    } catch (e: any) {
      console.log('getCourse eee', e, typeof e)
      console.log(e.code)
    }
  }


  const approveToken = async (record: CourseType) => {
    console.log('approveToken')
    try {
      if (!record) { return }
      console.log('approveToken record price', BigInt(record.price));
      const result = await yiDengTokenContract.approve(
        courseAddress,
        // BigInt(record.price),
        BigInt(3000),
      );
      console.log('approveToken result', result);

      const transactionReceipt = await provider?.waitForTransaction(result.hash);

      console.log(
        'approveToken 监听当前hash挖掘的收据交易状态【为1代表交易成功、为0代表交易失败】transactionReceipt.status：',
        transactionReceipt?.status,
      );
      console.log(
        'approveToken 监听当前hash挖掘的收据交易event事件日志transactionReceipt.logs：',
        transactionReceipt?.logs,
      );
    } catch (e: any) {
      console.log('approveToken eee', e, typeof e)
      console.log(e.code)
    }
  }

  const buyCourse = async (record: CourseType) => {
    console.log('buyCourse')
    try {
      if (!accounts) { return }

      const result = await courseContract.purchaseCourse(record.uuid);
      console.log('buyCourse result', result);

      const transactionReceipt = await provider?.waitForTransaction(result.hash);

      console.log(
        'buyCourse 监听当前hash挖掘的收据交易状态【为1代表交易成功、为0代表交易失败】transactionReceipt.status：',
        transactionReceipt?.status,
      );
      console.log(
        'buyCourse 监听当前hash挖掘的收据交易event事件日志transactionReceipt.logs：',
        transactionReceipt?.logs,
      );
    } catch (e: any) {
      console.log('buyCourse eee', e, typeof e)
      console.log(e.code)
    }
  }

  const createNFT = async (course: CourseType) => {
    console.log('createNFT')
    try {
      if (!accounts) { return }
      console.log('accounts', accounts)

      const result = await nftContract.mintCertificate(
        accounts[0], course.uuid,
        'https://teal-urgent-junglefowl-47.mypinata.cloud/ipfs/bafkreibbriusrwvtaakytbdozr3xaevc5klmotdjy4mlo4ij5p7kf75nea'
      );

      //  'https://teal-urgent-junglefowl-47.mypinata.cloud/ipfs/bafkreiafdcn66xrqkmv3eimjkdcic3pifn767ut3w7bg72wkiau7irvqxa'

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
    } catch (e: any) {
      console.log('createNFT eee', e, typeof e)
      console.log(e.code)
    }
  }

  useEffect(() => {
    if (accounts && accounts[0].includes('923')) {
      setIsAdmin(true)
    } else {
      setIsAdmin(false)
    }
    getCourse();
  }, [id, accounts]);

  return (
    <div>
      <Header />
      <div className="container mx-auto flex gap-8 p-8">
        <div className="w-1/3">
          <Image
            src="/courseImage.avif"
            alt="Course image"
            width={400}
            height={300}
            className="rounded-lg shadow-lg"
          />
        </div>

        <div className="w-2/3 flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{course?.name}</h1>

          <p className="text-gray-600 dark:text-gray-300">
            {course?.description}
          </p>

          <div className="text-2xl font-semibold">
            Price: <span className="text-green-600 dark:text-green-400">{course?.price}</span>
          </div>

          <div className="flex gap-4 mt-4">
          <button
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => {
                router.push('/buyToken')
              }}
            >
              Buy Token
            </button>

            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => approveToken(course)}
            >
              Approve Token
            </button>

            {hasCourse ? (
              <button
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                onClick={() => console.log('view course')}
              >
                View Course
              </button>
            ) : (
              <button
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                onClick={() => buyCourse(course)}
              >
                Buy Course
              </button>
            )}
            {isAdmin && <button
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              onClick={() => createNFT(course)}
            >
              Create NFT
            </button>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Course
