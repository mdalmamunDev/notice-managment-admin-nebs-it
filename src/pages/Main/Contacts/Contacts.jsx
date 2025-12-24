import { useState, useEffect } from "react";
import { Button, Form, Input, InputNumber, Table, Tag } from "antd";
import { IoSearch } from "react-icons/io5";

import PageHeading from "../../../Components/PageHeading";

import {
  useDeleteContactMutation,
  useGetAllContactsQuery,
  useUpdateContactMutation,
  useMarkAsReadMutation,
} from "../../../redux/features/contacts/contactsApi";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import LoaderWraperComp from "../../../Components/LoaderWraperComp";
import { FaEnvelopeOpen, FaEnvelope } from "react-icons/fa6";
import DashboardModal from "../../../Components/DashboardModal";

const Contacts = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);

  const [searchQuery, setSearchQuery] = useState({
    keyword: "",
    limit: 10,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const [deleteContact] = useDeleteContactMutation();
  const [updateContact] = useUpdateContactMutation();
  const [markAsRead] = useMarkAsReadMutation();

  const { data: response, isLoading, isError, refetch } = useGetAllContactsQuery({
    page: currentPage,
    ...searchQuery,
  });

  const contacts = response?.data || [];
  const pagination = response?.pagination || {};

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this message?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteContact({ id });
      toast.success("Message deleted successfully.");
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

  const handleMarkAsRead = async (id) => {
    try {
      await updateContact({ id, payload: { isRead: true } });
      toast.success("Marked as read");
      refetch();
      // Update modal data if it's the current opened message
      if (modalData._id === id) {
        setModalData(prev => ({ ...prev, isRead: true }));
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleBulkMarkAsRead = async () => {
    if (selectedRows.length === 0) {
      toast.error("Please select messages to mark as read");
      return;
    }

    try {
      await markAsRead({ ids: selectedRows });
      toast.success(`${selectedRows.length} messages marked as read`);
      setSelectedRows([]);
      refetch();
    } catch (error) {
      toast.error("Failed to mark messages as read");
    }
  };

  const columns = [
    {
      title: "User Name",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <div className="flex items-center">
          <div
            title={record.isRead ? "Read" : "Unread"}
            className={`w-2 h-6 me-2 rounded-md ${record.isRead ? "bg-gray-400" : "bg-blue-500"}`}
          ></div>
          <span className={record.isRead ? "text-gray-600" : "font-semibold"}>
            {name || "N/A"}
          </span>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => (
        <span className="text-blue-600">{email}</span>
      ),
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      render: (message, record) => {
        if (!message) return "N/A";
        const truncated = message.length > 80 ? message.slice(0, 80) + "..." : message;
        return (
          <span className={record.isRead ? "text-gray-600" : "font-medium"}>
            {truncated}
          </span>
        );
      },
    },
    // {
    //   title: "Status",
    //   dataIndex: "isRead",
    //   key: "isRead",
    //   render: (isRead) => (
    //     <Tag color={isRead ? "green" : "orange"}>
    //       {isRead ? "Read" : "Unread"}
    //     </Tag>
    //   ),
    // },
    {
      title: "Ago",
      dataIndex: "ago",
      key: "ago",
      // render: (createdAt) => new Date(createdAt).toLocaleDateString(),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div className="flex gap-x-3 items-center">
          <Button 
            onClick={() => showModal(record)} 
            type="text" 
            shape="circle"
            title="View Details"
          >
            <FaEnvelopeOpen className="text-blue-600" size={18} />
          </Button>
          <Button
            onClick={() => handleMarkAsRead(record._id)}
            type="text"
            shape="circle"
            title="Mark as Read"
            disabled={record.isRead}
          >
            <FaEnvelope className={record.isRead ? "text-gray-400" : "text-green-600"} size={16} />
          </Button>
          <FaTrash
            size={16}
            className="cursor-pointer text-red-500 hover:text-red-700"
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
    // Mark as read when opening the modal
    if (!record.isRead) {
      handleMarkAsRead(record._id);
    }
  };

  const rowSelection = {
    selectedRowKeys: selectedRows,
    onChange: (selectedRowKeys) => {
      setSelectedRows(selectedRowKeys);
    },
  };

  return (
    <div className="py-[16px]">
      <LoaderWraperComp isError={isError} isLoading={isLoading}>
        <div className="flex gap-2 bg-4">
          <div className="p-2 flex-1 flex justify-between items-center">
            <PageHeading title={"Contact Messages"} disbaledBackBtn={true} />

            <div className="flex items-center gap-3">
              {selectedRows.length > 0 && (
                <Button
                  type="primary"
                  className="bg-green-600"
                  onClick={handleBulkMarkAsRead}
                >
                  Mark {selectedRows.length} as Read
                </Button>
              )}
              
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
                    placeholder="Search by name, email or message"
                    className="focus:outline-none outline-none placeholder:text-[#222222] px-3.5 text-sm w-[250px]"
                    allowClear
                    onPressEnter={() => form.submit()}
                  />
                </Form.Item>

                <Form.Item className="mb-0">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="bg-blue-600 ms-1"
                    shape="circle"
                    icon={<IoSearch />}
                  />
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={contacts}
          rowKey={(record) => record._id}
          rowSelection={rowSelection}
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

        {/* Contact Message Details Modal */}
        <DashboardModal 
          setIsModalOpen={setIsModalOpen} 
          isModalOpen={isModalOpen} 
          width="700px" 
          maxWidth="90%"
        >
          <div className="text-base space-y-6">
            <h6 className="font-semibold text-2xl text-center text-gray-800">Message Details</h6>

            {/* Sender Information */}
            <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-lg">
                    {modalData?.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    {modalData?.name || "Unknown User"}
                  </h4>
                  <p className="text-sm text-blue-600">{modalData?.email || "N/A"}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Tag color={modalData?.isRead ? "green" : "orange"}>
                      {modalData?.isRead ? "Read" : "Unread"}
                    </Tag>
                    <span className="text-xs text-gray-500">
                      {modalData?.createdAt ? new Date(modalData.createdAt).toLocaleString() : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Content */}
            <div className="bg-gray-50 p-5 rounded-lg border shadow-sm">
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-600 mb-2">Message</p>
                <div className="bg-white p-4 rounded-md border text-sm leading-relaxed whitespace-pre-wrap min-h-[120px]">
                  {modalData?.message || "No message content."}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <Tag 
                    color={modalData?.isRead ? "green" : "orange"} 
                    className="mt-1"
                  >
                    {modalData?.isRead ? "Read" : "Unread"}
                  </Tag>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600">Received</p>
                  <p className="text-sm text-gray-700 mt-1">
                    {modalData?.createdAt ? new Date(modalData.createdAt).toLocaleString() : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between gap-3 pt-4">
              <Button 
                type="default" 
                onClick={() => setIsModalOpen(false)}
                className="flex-1"
              >
                Close
              </Button>
              <div className="flex gap-2">
                {!modalData?.isRead && (
                  <Button
                    type="primary"
                    className="bg-green-600"
                    onClick={() => {
                      handleMarkAsRead(modalData._id);
                      setIsModalOpen(false);
                    }}
                  >
                    Mark as Read
                  </Button>
                )}
                <Button
                  danger
                  onClick={() => {
                    setIsModalOpen(false);
                    handleDelete(modalData._id);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </DashboardModal>
      </LoaderWraperComp>
    </div>
  );
};

export default Contacts;