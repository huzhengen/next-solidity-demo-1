'use client'

import React, { useEffect, useState } from 'react';
import { Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import Image from "next/image";
import Header from '@/app/components/Header';

const Course = () => {

  return (
    <div>
      <Header />
      <div className="container mx-auto flex gap-8 p-8">
        <div className="w-1/3">
          <Image
            src="/course-placeholder.jpg"
            alt="Course image"
            width={400}
            height={300}
            className="rounded-lg shadow-lg"
          />
        </div>

        <div className="w-2/3 flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Course Name</h1>

          <p className="text-gray-600 dark:text-gray-300">
            Course description goes here. This is a detailed explanation of what the course contains and what students will learn.
          </p>

          <div className="text-2xl font-semibold">
            Price: <span className="text-green-600 dark:text-green-400">0.1 ETH</span>
          </div>

          <div className="flex gap-4 mt-4">
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => console.log('Approve clicked')}
            >
              Approve
            </button>

            <button
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              onClick={() => console.log('Buy clicked')}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Course
