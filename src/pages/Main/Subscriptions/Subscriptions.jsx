import React, { useState, useEffect } from "react";
import { Button, Form, Input, InputNumber, Select, Table } from "antd";
import { IoSearch } from "react-icons/io5";

import PageHeading from "../../../Components/PageHeading";

import {
  useDeleteSubscriptionMutation,
  useGetAllSubscriptionsQuery,
  useStoreSubscriptionMutation,
  useUpdateSubscriptionMutation,
} from "../../../redux/features/subscriptions/subscriptionsApi";
import DashboardModal from "../../../Components/DashboardModal";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import LoaderWraperComp from "../../../Components/LoaderWraperComp";

const Subscriptions = () => {
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();

  const [searchQuery, setSearchQuery] = useState({
    keyword: "",
    limit: 10,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});

  const [storeSubscription] = useStoreSubscriptionMutation();
  const [updateSubscription] = useUpdateSubscriptionMutation();
  const [deleteSubscription] = useDeleteSubscriptionMutation();

  // Fetch subscriptions using searchQuery and currentPage
  const { data: response, isLoading, isError } = useGetAllSubscriptionsQuery({
    page: currentPage,
    ...searchQuery,
  });

  const subscriptions = response?.data || [];
  const pagination = response?.pagination || {};

  const columns = [
    {
      title: "Title",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <div className="flex">
          <div
            title={record.status}
            className={`w-2 h-6 me-2 rounded-md ${record.status === "active" ? "bg-green-500" : "bg-red-500"}`}
          ></div>
          {name || "N/A"}
        </div>
      ),
    },
    {
      title: "Days",
      dataIndex: "days",
      key: "days",
      render: (value) => value === 0 ? 0 : value || "N/A",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (value) => value === 0 ? 0 : value || "N/A",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div className="flex gap-x-4">
          <FaEdit
            size={18}
            className="cursor-pointer text-yellow-600"
            title="Edit"
            onClick={() => showModal(record)}
          />
          <FaTrash
            size={18}
            className="cursor-pointer text-red-600"
            title="Delete"
            onClick={() => handleDelete(record._id)}
          />
        </div>
      ),
    },
  ];

  // When searchQuery changes, reset page to 1
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const onSearchFinish = (values) => {
    setSearchQuery({
      keyword: values.keyword || "",
      limit: values.limit || 10,
    });
  };

  const showModal = (record = {}) => {
    setModalData(record);
    setIsModalOpen(true);
    modalForm.setFieldsValue({
      name: record.name || "",
      days: record.days ?? 0,
      price: record.price || 0,
      status: record.status || 'active',
    });
  };

  const onFinish = async (values) => {
    try {
      if (modalData._id) {
        await updateSubscription({ id: modalData._id, payload: values });
        toast.success("Subscription updated successfully.");
      } else {
        await storeSubscription(values);
        toast.success("Subscription added successfully.");
      }
      setIsModalOpen(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed!!",
        text:
          (error.message || error?.data?.message || "Something went wrong.") +
          " Please try again later.",
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this subscription?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteSubscription({ id });
      toast.success("Subscription deleted successfully.");
      setCurrentPage(1);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed!!",
        text:
          (error.message || error?.data?.message || "Something went wrong.") +
          " Please try again later.",
      });
    }
  };

  return (
    <div className="py-[16px]">
      <LoaderWraperComp isError={isError} isLoading={isLoading}>
        <div className="flex gap-2 bg-4">
          <div className="p-2 flex-1 flex justify-between items-center">
            <PageHeading title={""} disbaledBackBtn={true} />

            <Form
              form={form}
              layout="inline"
              initialValues={{ keyword: "", limit: 10 }}
              onFinish={onSearchFinish}
              className="items-center space-x-2"
            >
              <Form.Item name="limit" className="mb-0">
                <InputNumber
                  min={5}
                  max={1000}
                  step={5}
                  placeholder="Limit"
                  className="w-[90px]"
                />
              </Form.Item>

              <Form.Item name="keyword" className="mb-0">
                <Input
                  placeholder="Subscription"
                  className="focus:outline-none outline-none placeholder:text-[#222222] px-3.5 text-sm w-[170px]"
                  allowClear
                  onPressEnter={() => form.submit()}
                />
              </Form.Item>

              <Form.Item className="mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-s-1 ms-1"
                  shape="circle"
                  icon={<IoSearch />}
                />
              </Form.Item>
            </Form>
          </div>

          <Button
            onClick={() => showModal()}
            type="primary"
            className="bg-s-1 rounded-none"
            loading={isLoading}
            style={{ height: 'inherit' }}
          >
            <FaPlus /> Add New
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={subscriptions}
          rowKey={(record) => record._id}
          pagination={{
            current: pagination.currentPage || currentPage,
            pageSize: pagination.itemsPerPage || searchQuery.limit,
            total: pagination.totalCount || 0,
            showSizeChanger: false,
            position: ["bottomCenter"],
            onChange: (page) => setCurrentPage(page),
          }}
          loading={isLoading}
          className="mt-6"
        />

        <DashboardModal setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen}>
          <div className="flex flex-col justify-between text-base">
            <div className="space-y-7">
              <h6 className="font-medium text-center text-xl pb-1">Subscription</h6>
              <Form
                form={modalForm}
                name="edit_subscription"
                layout="vertical"
                requiredMark={false}
                onFinish={onFinish}
                className="space-y-[24px]"
              >
                <Form.Item name="name" label="Title" rules={[{ required: true }]}>
                  <Input
                    size="large"
                    className=""
                    placeholder="Enter subscription title"
                  />
                </Form.Item>
                <Form.Item name="days" label="Valid (Day)" rules={[{ required: true, type: "number", message: "Days are required" }]}>
                  <InputNumber
                    size="large"
                    className="w-full"
                    placeholder="Enter value"
                    min={0}
                  />
                </Form.Item>
                <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                  <InputNumber
                    size="large"
                    className="w-full"
                    placeholder="Enter value"
                    min={0}
                  />
                </Form.Item>
                <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                  <InputNumber
                    size="large"
                    className="w-full"
                    placeholder="Enter value"
                    min={0}
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    size="large"
                    htmlType="submit"
                    className="w-full bg-s-1 text-white rounded-full"
                    loading={isLoading}
                  >
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </DashboardModal>
      </LoaderWraperComp>
    </div>
  );
};

export default Subscriptions;
