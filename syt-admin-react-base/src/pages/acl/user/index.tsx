
import { Card, Form, Input, Button, Table, Tooltip, message, Tag, Space } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined, UserAddOutlined } from "@ant-design/icons";

import { reqUserList } from '@/api/acl/users'

import { useEffect, useState } from 'react'

function User() {

  // 表单实例对象
  const [form] = Form.useForm();
  // 当前页码
  const [current, setCurrent] = useState(1);
  // 每页条数
  const [pageSize, setPageSize] = useState(5);
  // 总页码数
  const [total, setTotal] = useState(20);
  // 设置分页器位置
  const [bottom, setBottom] = useState<any>('bottomLeft');
  // 角色列表数据
  const [userData, setUserData] = useState<any>([])

  useEffect(() => {
    getUserData(current, pageSize)
  }, [])

  // 获取列表渲染数据
  const getUserData = async (page: number, limit: number) => {
    const { username } = form.getFieldsValue()
    let result = await reqUserList(current, pageSize, username)
    setTotal(result.total)
    setUserData(result.items)
  }

  // 查询按钮回调
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  // 清空按钮回调
  const reset = (values: any) => {
    console.log('reset:', values);
  }
  // 列
  const columns: any = [
    {
      title: '序号',
      render: (text: any, records: any, index: any) => {
        return index + 1
      },
      align: 'center',
      width: '80px'
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '用户昵称',
      key: 'nickName',
      dataIndex: 'nickName'
    },
    {
      title: '角色列表',
      key: 'action',
      dataIndex: 'roleName'
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate'
    },
    {
      title: '更新时间',
      dataIndex: 'gmtModified'
    },
    {
      title: '操作',
      key: 'action',
      render: (row: any) => (
        <div>
          <Button className="hospital-btn" type="ghost" size="middle" icon={<UserAddOutlined />} />
          <Button className="hospital-btn" type="primary" size="middle" icon={<EditOutlined />} />
          <Button className="hospital-btn" type="primary" size="middle" danger icon={<DeleteOutlined />} />
        </div>
      ),
    },
  ];


  // 当前页码发送变化触发的事件
  const getHospitalList = () => {

  }

  return (
    <Card style={{ minHeight: "calc(100vh - 4rem)" }}>
      <Form
        style={{ marginBottom: '20px' }}
        form={form}
        layout="inline"
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: '请输入用户名!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item >
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />} className="hospital-btn mb">
            查询
          </Button>
          <Button onClick={reset}>清空</Button>
        </Form.Item>
      </Form>
      <Button className="hospital-btn mb" type="primary">添加</Button>
      <Button className="hospital-btn mb">批量删除</Button>
      {/* 表格数据 */}
      <Table
        style={{ marginTop: '20px' }}
        rowSelection={{
          type: 'checkbox',
        }}
        bordered
        columns={columns}
        dataSource={userData}

        pagination={

          {
            current,
            showQuickJumper: true,
            pageSize,
            showSizeChanger: true,
            pageSizeOptions: [2, 5, 7],
            showTotal: (total) => `共${total}条`,
            total,
            onChange: getHospitalList,
            onShowSizeChange: getHospitalList,
            position: [bottom]

          }
        } />
    </Card>
  );
}

export default User;
