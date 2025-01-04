import React from 'react';
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input } from 'antd';
import { randomUUID } from 'crypto';

type FieldType = {
  courseName?: string;
  price?: number;
  id?: string;
};

const AddCourse = ({ courseContract, provider }: { courseContract: any, provider: any }) => {

  console.log('courseContract', courseContract);
  console.log('provider', provider);

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    console.log('Success:', values);
    const uuid = crypto.randomUUID();
    values.id = uuid;
    const courses = localStorage.getItem('courses') || '[]';
    const coursesArray = JSON.parse(courses);
    coursesArray.push(values);
    localStorage.setItem('courses', JSON.stringify(coursesArray));
    try {
      const result = await courseContract.addCourse(
        values.id,
        values.courseName,
        BigInt(values.price!)
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
    } catch (e: any) {
      console.log('eee', e, typeof e)
      console.log(e.code)
    }
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item<FieldType>
        label="Course Name"
        name="courseName"
        rules={[{ required: true, message: 'Please input course name!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Price"
        name="price"
        rules={[{ required: true, message: 'Please input price!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label={null}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
};

export default AddCourse;