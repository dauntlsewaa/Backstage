
import { useEffect, useState} from 'react'
import { Form, Card, Button, Input,  Table, Modal, Popconfirm } from 'antd'
import {  EditOutlined, DeleteOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { reqTradeMarkList, reqAddOrUpdateTradeMark, reqDeleteTradeMark } from '@api/trademark'




import { message, Upload, Spin } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';


export default function Trademark() {
  //存储品牌的数据
  const [trademarkData, setTrademarkData] = useState([])
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
  //修改和添加的标识符
  const [isModalOpen, setIsModalOpen] = useState(false);

  //上传图片加载标识
  const [loading, setLoading] = useState(false);
  // const [imageUrl, setImageUrl] = useState<string>();
  //添加和修改的需要携带的参数
  const [addAParams, setAddAParams] = useState<any>({
    id: "",
    tmName: "",
    logoUrl: "",
  })

  //加载中状态标识
  const [tableLoading, setTableLoading] = useState<any>(false)

  /* 添加和修改按钮的回调 */
  const showModal: any = (row: any) => {
    //开启对话框
    setIsModalOpen(true);
    //判断添加清空数据
    if (row.id) {
      form.setFieldsValue(row)
      setAddAParams(row)
    } else {
      form.setFieldsValue({})
      form.resetFields()
      setAddAParams({})
    }
  };
  //对话框确认按钮的回调   添加和修改品牌数据
  const handleOk = async () => {
    //关闭对话框
    setIsModalOpen(false);
    const tmName = form.getFieldsValue().tmName
    const logoUrl = form.getFieldsValue().logoUrl
    // console.log(logoUrl);

    setAddAParams({ tmName, logoUrl })

    //请求添加数据
    await reqAddOrUpdateTradeMark(addAParams)

    //判断
    if (addAParams.id) {
      //再次请求更新数据
      getTrademarkList(current, pageSize);
    } else {
      //再次请求更新数据
      getTrademarkList(1, pageSize);
    }
  };

  //删除品牌数据
  const deleteTrademark = async (row: any) => {
    const result = await reqDeleteTradeMark(row.id)
    console.log(result);
    //再次请求更新数据
    getTrademarkList(current, pageSize);
    message.success('删除成功');
  }
  /* 对话框取消按钮的回调 */
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  //挂载生命周期
  useEffect(() => {
    getTrademarkList(current, pageSize);
  }, [])

  //获取品牌数据的函数
  const getTrademarkList = async (page: number, pageSize: number) => {
    setTableLoading(true)
    const result = await reqTradeMarkList(page, pageSize)
    setTableLoading(false)
    setTrademarkData(result.records)
    setTotal(result.total)
    setCurrent(result.current)
    setPageSize(result.size)
  }



  /* 表格需要用到的数据 */
  const columns: any = [
    {
      title: '序号',
      render: (text: any, records: any, index: any) => {
        return index + 1
      },
      align: 'center',
      width: '80px',
      key: 'index',
    },
    {
      title: '品牌名称',
      dataIndex: 'tmName',
      key: 'tmName',
    },
    {
      title: '品牌LOGO',
      key: 'logoUrl',
      render: (trademark: any) => {
        return (
          <img src={trademark.logoUrl} alt='' width={80} />
        )
      },

    },
    {
      title: '操作',
      key: 'action',
      render: (row: any) => (
        <div>
          <Button className="hospital-btn" type="primary" size="middle" icon={<EditOutlined />} onClick={() => { showModal(row) }} />
          {/* 气泡框 */}
          <Popconfirm
            title={`你确定要删除${row.tmName}吗`}
            onConfirm={() => { deleteTrademark(row) }}
            onCancel={cancel as any}
            okText="确定"
            cancelText="取消"
          >
            <Button className="hospital-btn" type="primary" size="middle" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },

  ];

  // 当前页码发送变化触发的事件
  const getTmList = (page: any, size: any) => {
    //整理参数
    setCurrent(page)
    setPageSize(size)
    //  再次
    getTrademarkList(page, size);

  }

  /* 获取base64路径的事件回调 */
  const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };
  /* 上传文件前的事件回调 */
  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('你能上传 JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片必须小于2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  /* 上传状态改变的事件回调 */
  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {

    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {

      getBase64(info.file.originFileObj as RcFile, url => {
        setLoading(false);
        //重新赋值
        const { id, tmName, logoUrl } = addAParams
        console.log(id, tmName, logoUrl);

        console.log(form.getFieldsValue().tmName, id, info.fileList[0].response.data);

        setAddAParams({ tmName: form.getFieldsValue().tmName, id: id, logoUrl: info.fileList[0].response.data })

      });
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  //删除气泡框回调
  const cancel = (e: React.MouseEvent<HTMLElement>) => {
    console.log(e);
    message.error('取消删除');
  };
  /* 加载图标 */
  const antIcon = <LoadingOutlined style={{ fontSize: 13 }} spin />

  return (
    <Card>
      {/* <Form style={{ marginTop: 20 }}>
        <Form.Item> */}
      <Button
        type="primary"
        htmlType="submit"
        style={{ marginRight: 20 }}
        onClick={showModal}
      >
        添加
      </Button>
      {/* </Form.Item>
      </Form> */}
      <Spin indicator={antIcon} style={{ fontSize: 18 }} spinning={tableLoading} delay={100} tip="加载中......" size="large" ></Spin>
      <Table
        style={{ marginTop: '20px' }}
        bordered
        columns={columns}
        dataSource={trademarkData}
        pagination={

          {
            current,
            showQuickJumper: true,
            defaultPageSize: 5,
            hideOnSinglePage: true,
            pageSize,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20, 30],
            showTotal: (total) => `共${total}条`,
            total,
            onChange: getTmList,
            onShowSizeChange: getTmList,
            position: [bottom],

          }
        }
      />
      {/* 对话框 */}
      <Modal title="添加品牌" visible={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={[]}>
        {/* 表单 */}
        <Form form={form} style={{ marginTop: 20 }}>
          {/* 品牌名称输入框 */}
          <Form.Item
            label="品牌名称"
            name="tmName"
            rules={[{ required: true, message: '必须要输入品牌名称!' }]}
            initialValue=""
          >
            <Input />
          </Form.Item>
          {/* 品牌logo输入框 */}
          <Form.Item
            label="品牌LOGO"
            name="logoUrl"
            rules={[{ required: true, message: '必须要上传一个图片!' }]}
          >
            {/* 上传组件 */}
            <Upload
              name="file"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="/dev-api/admin/product/upload"
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {addAParams.logoUrl ? <img src={addAParams.logoUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary"></Button>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}
