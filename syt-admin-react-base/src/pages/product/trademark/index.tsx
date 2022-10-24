
import React, { useEffect, useState } from 'react'
import { Form, Card, Button, Input, Space, Table, Tooltip } from 'antd'
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { reqTradeMarkList, reqAddOrUpdateTradeMark, reqDeleteTradeMark } from '@/api/trademark/index'


export default function Trademark() {
  //存储品牌的数据
  // const [trademarkData, setTrademarkData] = useState([])
  //分页相关的状态
  // const [total, setTotal] = useState<number>(0);
  // const [pageSize, setPageSize] = useState<number>(5)
  // const [page, setPage] = useState<number>(1)
  useEffect(() => {
    getTrademarkList(1, 5);
  }, [])//eslint-disable-line
  //获取医院设置列表数据的函数
  async function getTrademarkList(page: number, pageSize: number) {
    const result = await reqTradeMarkList(page, pageSize)
    console.log(result);

    // setTrademarkData(result.data)
    // setTotal(result.total)
  }
  // const [form] = Form.useForm();
  // const onFinish = (values: any) => {
  //   console.log('Finish:', values);
  // };

  // const columns: ColumnsType = [
  //   {
  //     title: '序号',
  //     render: (text, records, index) => {
  //       return index + 1
  //     },
  //     align: "center",
  //     width: 80
  //   },
  //   {
  //     title: '品牌名称',
  //     dataIndex: 'name',
  //   },
  //   {
  //     title: '品牌LOGO',
  //     dataIndex: 'hoscode',
  //   },
  //   {
  //     title: '操作',
  //     render: () => {
  //       return (
  //         <Space>
  //           <Tooltip title="">
  //             <Button icon={<EditOutlined />} type='primary'></Button>
  //           </Tooltip>
  //           <Tooltip title="">
  //             <Button icon={<DeleteOutlined />} type='primary' danger></Button>
  //           </Tooltip>
  //         </Space>
  //       )
  //     },
  //     fixed: "right",
  //     width: 120,
  //     align: 'center'
  //   },
  // ];
  return (
    <Card>
      <Form style={{ marginTop: 20 }}>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginRight: 10 }}
          >
            添加
          </Button>
        </Form.Item>
      </Form>
      <Table
      // columns={columns}
      // dataSource={trademarkData}
      // bordered
      // scroll={{ x: 1500 }}
      // rowKey='id'
      // pagination={{
      //   total,
      //   pageSize,
      //   showSizeChanger: true,
      //   pageSizeOptions: [2, 5, 10],
      //   showQuickJumper: true,
      //   onChange: function (page, pageSize) {
      //     setPage(page)
      //     setPageSize(pageSize)
      //     getTrademarkList(page, pageSize);
      //   },
      //   showTotal: function (total) {
      //     return `总共${total}条`
      //   }
      // }}
      />
    </Card>
  )
}
