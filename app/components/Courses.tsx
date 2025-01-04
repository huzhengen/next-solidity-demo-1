'use client'

import React, { useEffect, useState } from 'react';
import { Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import Image from "next/image";
import { useRouter } from 'next/navigation';

interface DataType {
  id: string;
  name: string;
  description: string;
  price: number;
  hasCourse: boolean;
}

const Courses = ({
  accounts, courseContract, provider, courseAddress, yiDengTokenContract
}: {
  accounts: any;
  courseContract: any;
  provider: any;
  courseAddress: any;
  yiDengTokenContract: any;
}) => {
  const [coursesWithStatus, setCoursesWithStatus] = useState<DataType[]>([]);
  const [courses, setCourses] = useState<DataType[]>([]);
  const router = useRouter();
  const columns: TableProps<DataType>['columns'] = [
    {
      title: '课程名称',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: '是否购买',
      dataIndex: 'hasCourse',
      key: 'hasCourse',
      render: (text) => <span>{text ? '已购买' : '未购买'}</span>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {record.hasCourse ? <span>已购买</span> : <a onClick={() => buyCourse(record)}>购买</a>}
          <a onClick={() => approveToken(record)}>授权 token</a>
        </Space>
      ),
    },
  ];

  const buyCourse = async (record: DataType) => {
    console.log('buyCourse')
    try {
      if (!accounts) { return }

      const result = await courseContract.purchaseCourse(record.id);
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
      console.log('eee', e, typeof e)
      console.log(e.code)
    }
  }

  const approveToken = async (record: DataType) => {
    console.log('approveToken')
    try {
      const result = await yiDengTokenContract.approve(
        courseAddress,
        // BigInt(100*1000000)
        record.price
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
    } catch (e: any) {
      console.log('eee', e, typeof e)
      console.log(e.code)
    }
  }

  const getCourses = async () => {
    const response = await fetch('/api/courses');
    const data = await response.json();
    setCourses(data)
    console.log('data- courses', data);
  }


  useEffect(() => {
    getCourses()

    if (accounts && courses) {


      // const getCoursesWithStatus = async () => {
      //   // const result = await courseContract.hasCourse(accounts[0], '1');
      //   const coursesWithStatus = await Promise.all(coursesArray.map(async (course: any) => {
      //     const hasCourse = await courseContract.hasCourse(accounts[0], course.id);
      //     return {
      //       ...course,
      //       hasCourse,
      //     };
      //   }))
      //   console.log('coursesWithStatus', coursesWithStatus)
      //   setCoursesWithStatus(coursesWithStatus)
      // }
      // // return

      // getCoursesWithStatus()

    }
  }, [accounts])

  return (
    // <Table<DataType> columns={columns} rowKey="id" dataSource={coursesWithStatus} />
    <div className="max-w-4xl mx-auto flex gap-10">
      {courses.map((course: any) => (
        <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-md mb-6"
          key={course.id} onClick={() => router.push(`/courses/${course.id}`)}>
          <div className="p-6 flex-1">
            <Image className="cursor-pointer" src="/courseImage.avif" alt="course1" width={500} height={500} />
            <h2 className="text-2xl font-bold mt-2 cursor-pointer">{course.name}</h2>
            <p className="text-gray-700 mt-2 cursor-pointer">{course.description}</p>
            <p className="text-gray-700 mt-2 cursor-pointer">{course.price} ETH</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Courses;
