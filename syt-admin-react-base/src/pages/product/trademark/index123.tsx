import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Table,
  Pagination,
  Modal,
  Form,
  Input,
  Upload,
} from "antd"; // 引入antd组件
import {
  PlusOutlined,
  FormOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from "@ant-design/icons"; // 引入antd icon图标
import type { UploadChangeParam } from "antd/es/upload";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";

import { reqTradeMarkList, reqAddOrUpdateTradeMark, reqDeleteTradeMark } from '@/api/trademark/index'

// import "./css/index.less";

const { Column, ColumnGroup } = Table;

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

export default function Trademark() {
  const [currentPage, setCurrentPage] = useState<number>(1); // 当前页码
  const [pageSize, setPageSize] = useState<number>(3); // 每页条数
  const [trademarkList, setTrademarkList] = useState<any>([]); // 品牌数据
  const [traTotal, setTraTotal] = useState<any>(0); // 品牌数据总数
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // dialog对话框状态
  const [loading, setLoading] = useState(false); // loading
  const [traParams, setTraParams] = useState<any>({
    id: "",
    tmName: "",
    logoUrl: "",
  }); // 添加或修改品牌的参数

  useEffect(() => {
    getTrademarkList(currentPage, pageSize); // 获取品牌数据
  }, []);

  // 获取品牌数据
  const getTrademarkList = async (page: number, limit: number) => {
    const result = await reqTradeMarkList(page, limit);
    setTrademarkList(result.records);
    setTraTotal(result.total);
  };

  // 添加品牌按钮的回调
  const addTrademark = () => {
    setIsModalOpen(true);
    setTraParams({
      id: "",
      tmName: "",
      logoUrl: "",
    });
  };

  // dialog对话框取消或关闭时的回调
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // dialog对话框确定按钮的回调
  const handleOk = (data: any) => {
    return async function () {
      await reqAddOrUpdateTradeMark(data);
      getTrademarkList(data.id ? currentPage : 1, pageSize);
      !data.id && setCurrentPage(1);
      setIsModalOpen(false);
    };
  };

  // 获取添加品牌参数 --> 获取品牌名称
  const inputChange = (event: any) => {
    traParams.tmName = event.target.value;
    setTraParams({ ...traParams });
  };

  // 获取添加品牌参数 --> 获取品牌LOGO
  const handleChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setLoading(false);
        traParams.logoUrl = info.file.response.data;
        setTraParams({ ...traParams });
      });
    }
  };

  // 修改品牌按钮的回调
  const updateTrademark = (trademark: any) => {
    return function () {
      setTraParams(trademark);
      setIsModalOpen(true);
    };
  };

  // 展示图片
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  // 删除品牌的回调
  const deleteTrademark = (trademark: any) => {
    return async () => {
      await reqDeleteTradeMark(trademark.id);
      setIsModalOpen(false);
      getTrademarkList(
        trademarkList.length <= 1 ? currentPage - 1 : currentPage,
        pageSize
      );
      trademarkList.length <= 1 && setCurrentPage(currentPage - 1);
    };
  };

  return (
    <div className="container">
      <Card>
        {/* 添加按钮 */}
        <Button
          className="addBtn"
          type="primary"
          onClick={addTrademark}
          icon={<PlusOutlined />}
        >
          添加
        </Button>
        {/* 品牌列表 */}
        <Table
          rowKey={(trademark) => trademark.id}
          dataSource={trademarkList}
          style={{ margin: "20px 0" }}
          bordered
          tableLayout="fixed"
          pagination={false}
        >
          <Column title="序号" width="80px" align="center"
            render={(text: any, records: any, index: any) => {
              return index + 1
            }} />
          <Column title="品牌名称" dataIndex="tmName" />
          <Column
            title="品牌LOGO"
            dataIndex="logoUrl"
            render={(logoUrl) => (
              <img
                key={logoUrl}
                src={logoUrl}
                style={{ width: "80px", height: "60px" }}
              />
            )}
          />
          <Column
            title="操作"
            render={(logoUrl, record) => (
              <>
                <Button
                  type="primary"
                  icon={<FormOutlined />}
                  style={{
                    marginRight: "10px",
                    backgroundColor: "orange",
                    border: "none",
                  }}
                  onClick={updateTrademark(record)}
                ></Button>
                <Button
                  type="primary"
                  icon={<DeleteOutlined />}
                  style={{ backgroundColor: "red", border: "none" }}
                  onClick={deleteTrademark(record)}
                ></Button>
              </>
            )}
          />
        </Table>
        {/* 分页器 */}
        <Pagination
          total={traTotal}
          current={currentPage}
          pageSize={pageSize}
          pageSizeOptions={[3, 5, 7, 10]}
          showSizeChanger
          showQuickJumper
          showTotal={(total) => `共 ${total} 条`}
          onChange={(page, limit) => {
            setCurrentPage(page);
            setPageSize(limit);
            getTrademarkList(page, limit);
          }}
        />
        {/* dialog对话框 */}
        <Modal
          title="添加品牌"
          visible={isModalOpen}
          onOk={handleOk(traParams)}
          onCancel={handleCancel}
        >
          <Form
            name="basic"
            labelCol={{ span: 4 }}
            initialValues={{ remember: true }}
            autoComplete="off"
          >
            <Form.Item
              label="品牌名称"
              rules={[{ required: true, message: "请输入品牌名称" }]}
            >
              <Input value={traParams.tmName} onChange={inputChange} />
            </Form.Item>
            <Form.Item label="品牌LOGO">
              <Upload
                name="file"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="/dev-api/admin/product/upload"
                onChange={handleChange}
              >
                {traParams.logoUrl ? (
                  <img
                    src={traParams.logoUrl}
                    alt="avatar"
                    style={{ width: "100%" }}
                  />
                ) : (
                  uploadButton
                )}
              </Upload>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
}
