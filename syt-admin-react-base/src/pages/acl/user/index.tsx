
import { Card, Form, Input, Button, Table, Tooltip, message, Tag, Space, Modal, Popconfirm, Checkbox } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined, UserAddOutlined } from "@ant-design/icons";

import { reqUserList, reqAddUser, reqFindId, reqClear, reqUserData, reqAssign } from '@/api/acl/users'

import { useEffect, useMemo, useState } from 'react'

function User() {

  // 表单实例对象
  const [form] = Form.useForm();
  // 对话框表单实例对象
  const [UserForm] = Form.useForm();
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
  // 多选选中的角色id
  const [selectedId, setSelectedId] = useState<any>([])
  // 点击修改按钮的角色id
  const [userId, setUserId] = useState<any>('')
  // 添加||修改
  let [isShow, setIsShow] = useState(false)
  // 角色列表
  let [allocation, setAllocation] = useState<any>([])
  // 已有角色列表
  let [userList, setUserList] = useState<any>([])
  //  返回的所有数据
  let [userInfo, setUserInfo] = useState<any>([])
  const CheckboxGroup = Checkbox.Group;

  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);
  let Show
  let user

  // 对话框
  const [isModalOpen, setIsModalOpen] = useState<any>(false);

  useEffect(() => {
    getUserData(current, pageSize)
  }, [])


  // 获取列表渲染数据
  const getUserData = async (page: number, limit: number) => {
    const { username } = form.getFieldsValue()
    let result = await reqUserList(current, pageSize, username)

    // 更新页码
    setCurrent(page);
    setPageSize(limit);

    setTotal(result.total)
    setUserData(result.items)
  }

  // 查询按钮回调
  const onFinish = (values: any) => {
    getUserData(current, pageSize)
  };

  // 清空按钮回调
  const reset = (values: any) => {
    form.resetFields();
    getUserData(1, 5)
  }

  // 复选框触发的事件
  const rowSelection = {
    // 全选&单选
    onChange: async (selectedRowKeys: any[]) => {
      setSelectedId(selectedRowKeys)
      await reqClear(selectedId)
      message.success('批量删除成功')
    }
  };

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
      render: (row: any, rec: any, index: number) => (
        <>
          <Button className="hospital-btn" type="primary" size="middle" icon={<UserAddOutlined />} onClick={updateUser(row)} />
          <Button className="hospital-btn" type="primary" size="middle" icon={<EditOutlined onClick={showModal(row)} />} />
          <Popconfirm
            title={`您确定删除${row.username}吗？`}
            onConfirm={deleteUser(row.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button className="hospital-btn" type="primary" size="middle" danger icon={<DeleteOutlined />} />
          </Popconfirm>

        </>
      ),
    },
  ];

  // 对话框显示
  const showModal: any = (row: any) => {

    return () => {
      setAllocation([])
      setIsModalOpen(true);
      UserForm.setFieldsValue({ username: '', nickName: '', password: '' })
      setIsShow(true)
      if (row.id) {
        setUserId(row.id)
        UserForm.setFieldsValue(row)
        setIsShow(false)
      }

    }
  };

  // 对话框确定回调
  const handleOk: any = async () => {


    if (allocation.length) {
      let data = {
        userId: userId,
        roleId: userInfoId.join(':')
      }
      await reqAssign(data)
      message.success('分配角色成功')

    } else {
      let data = UserForm.getFieldsValue()
      data.id = userId
      await reqAddUser(data)
      message.success(data.id ? '修改成功' : '添加成功')

    }
    getUserData(current, pageSize)
    setIsModalOpen(false);


  };
  // 对话框取消回调
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // 根据id删除角色
  const deleteUser = (id: number) => {
    return async () => {
      await reqFindId(id)
      message.success('删除成功')
      getUserData(current, pageSize)
    }
  }

  // 获取角色列表数据
  const updateUser = (row: any) => {
    return async () => {
      setIsModalOpen(true);
      setUserId(row.id)
      UserForm.setFieldsValue(row)
      let result = await reqUserData(row.id)
      setUserInfo(result.allRolesList)
      setAllocation(result.allRolesList.map((item: any) => item.roleName))
      setUserList(result.assignRoles.map((item: any) => item.roleName))
    }
  }
  // 对话框担单选
  const onBox = (list: any[]) => {
    setUserList(list);
    setIndeterminate(!!list.length && list.length < allocation.length);
    setCheckAll(list.length === allocation.length);
  };
  // 对话框多选
  const onCheckAllChange = (e: any) => {
    setUserList(e.target.checked ? allocation : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  // 计算勾选角色id
  const userInfoId = useMemo(() => {
    return userInfo.reduce((per: any, next: any) => {
      userList.forEach((val: any) => {
        if (next.roleName === val) {
          per.push(next.id)
        }
      })
      return per
    }, [])
  }, [userList])



  // 判断是添加还是修改页面
  if (isShow) {
    Show = <Form.Item
      label="用户密码"
      name="password"
      rules={[{ required: true, message: '请输入密码' }]}
    >
      <Input.Password />
    </Form.Item>
  }
  // 判断角色分配页面
  if (allocation.length) {
    user = <Form.Item
      label="角色列表"
    >

      <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
        全选
      </Checkbox>
      <CheckboxGroup options={allocation} value={userList} onChange={onBox} key='index' />

    </Form.Item>

  } else {
    user = <>
      <Form.Item
        label="用户昵称"
        name="nickName"
        rules={[{ required: true, message: '请输入用户昵称' }]}
      >
        <Input />
      </Form.Item>
      {Show}
    </>
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
      <Button className="hospital-btn mb" type="primary" onClick={showModal()}>添加</Button>
      <Button className="hospital-btn mb" disabled={!selectedId.length}>批量删除</Button>
      {/* 表格数据 */}
      <Table
        style={{ marginTop: '20px' }}
        rowSelection={rowSelection}
        bordered
        columns={columns}
        dataSource={userData}
        rowKey="id"
        pagination={
          {
            current,
            showQuickJumper: true,
            pageSize,

            showSizeChanger: true,
            pageSizeOptions: [2, 5, 7],
            showTotal: (total) => `共${total}条`,
            total,
            onChange: getUserData,
            onShowSizeChange: getUserData,
            position: [bottom]
          }
        } />


      {/* 对话框 */}
      <Modal title={userId ? "修改用户" : "添加用户"} visible={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={900} >
        <Form
          name="addUser"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          initialValues={{ remember: true }}
          form={UserForm}

        >
          <Form.Item
            label="用户名称"
            name="username"
            rules={[{ required: true, message: '请输入用户名称' }]}
          >
            <Input disabled={allocation.length ? true : false} />
          </Form.Item>
          {user}
        </Form>
      </Modal>

    </Card>
  );
}

export default User;
