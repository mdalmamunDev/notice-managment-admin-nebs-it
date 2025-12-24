import { useState, useEffect } from "react";
import { Button, Form, Input, Select, DatePicker, Table, Tag, Switch } from "antd";
import { FiEdit2, FiEye } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdAdd } from "react-icons/md";


import {
  useDeleteNoticeMutation,
  useGetAllNoticesQuery,
  useUpdateNoticeMutation,
} from "../../../redux/features/notices/noticesApi";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import LoaderWraperComp from "../../../Components/LoaderWraperComp";
import DashboardModal from "../../../Components/DashboardModal";

const { Option } = Select;

const Notices = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);

  const [searchQuery, setSearchQuery] = useState({
    department: "",
    employeeName: "",
    status: "",
    publishedDate: "",
    limit: 10,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const [deleteNotice] = useDeleteNoticeMutation();
  const [updateNotice] = useUpdateNoticeMutation();

  const { data: response, isLoading, isError, refetch } = useGetAllNoticesQuery({
    page: currentPage,
    ...searchQuery,
  });

  const notices = response?.data || [];
  const pagination = response?.pagination || {};

  // Calculate active and draft notices
  const activeNotices = notices.filter(n => n.status === 'Published').length;
  const draftNotices = notices.filter(n => n.status === 'Draft').length;

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this notice?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteNotice({ id });
      toast.success("Notice deleted successfully.");
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

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Published' ? 'Unpublished' : 'Published';
      await updateNotice({ id, payload: { status: newStatus } });
      toast.success(`Notice ${newStatus.toLowerCase()} successfully`);
      refetch();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (title) => (
        <span className="font-medium text-gray-800">{title || "N/A"}</span>
      ),
    },
    {
      title: "Notice Type",
      dataIndex: "noticeType",
      key: "noticeType",
      render: (type) => (
        <span className="text-gray-600">{type || "N/A"}</span>
      ),
    },
    {
      title: "Departments/Individual",
      dataIndex: "department",
      key: "department",
      render: (department) => (
        <span className="text-blue-600 font-medium">{department || "N/A"}</span>
      ),
    },
    {
      title: "Published On",
      dataIndex: "publishedOn",
      key: "publishedOn",
      render: (date) => (
        <span className="text-gray-600">
          {date ? new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "N/A"}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === 'Published' ? 'green' : status === 'Draft' ? 'orange' : 'default'}>
          {status || "N/A"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div className="flex gap-x-2 items-center">
          <Button 
            onClick={() => showModal(record)} 
            type="text" 
            shape="circle"
            title="View"
            icon={<FiEye className="text-gray-600" size={18} />}
          />
          <Button 
            onClick={() => handleEdit(record)} 
            type="text" 
            shape="circle"
            title="Edit"
            icon={<FiEdit2 className="text-gray-600" size={16} />}
          />
          <Button 
            type="text" 
            shape="circle"
            title="More"
            icon={<BsThreeDotsVertical className="text-gray-600" size={16} />}
          />
          <div className="flex items-center gap-2 ml-2">
            <span className="text-xs text-gray-500">
              {record.status === 'Published' ? 'Published' : 'Unpublished'}
            </span>
            <Switch 
              size="small"
              checked={record.status === 'Published'}
              onChange={() => handleToggleStatus(record._id, record.status)}
            />
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleFilter = () => {
    const values = form.getFieldsValue();
    setSearchQuery({
      department: values.department || "",
      employeeName: values.employeeName || "",
      status: values.status || "",
      publishedDate: values.publishedDate ? values.publishedDate.format('YYYY-MM-DD') : "",
      limit: 10,
    });
  };

  const handleResetFilters = () => {
    form.resetFields();
    setSearchQuery({
      department: "",
      employeeName: "",
      status: "",
      publishedDate: "",
      limit: 10,
    });
  };

  const showModal = (record = {}) => {
    setModalData(record);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    // Navigate to edit page or open edit modal
    console.log("Edit notice:", record);
  };

  const rowSelection = {
    selectedRowKeys: selectedRows,
    onChange: (selectedRowKeys) => {
      setSelectedRows(selectedRowKeys);
    },
  };

  return (
    <div className="py-4">
      <LoaderWraperComp isError={isError} isLoading={isLoading}>
        {/* Header Section */}
        <div className="bg-white rounded-lg p-6 mb-4">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Notice Management</h2>
              <div className="flex gap-4 text-sm">
                <span className="text-green-600 font-medium">Active Notices: {activeNotices}</span>
                <span className="text-gray-400">|</span>
                <span className="text-orange-500 font-medium">Draft Notice: {draftNotices}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                type="primary" 
                className="bg-orange-500 hover:bg-orange-600 border-orange-500"
                icon={<MdAdd size={20} />}
                onClick={() => showModal()}
              >
                Create Notice
              </Button>
              <Button 
                className="border-orange-500 text-orange-500 hover:border-orange-600 hover:text-orange-600"
                icon={<FiEdit2 size={16} />}
              >
                All Draft Notice
              </Button>
            </div>
          </div>

          {/* Filter Section */}
          <Form
            form={form}
            layout="inline"
            className="gap-2"
          >
            <span className="text-sm text-gray-600">Filter by:</span>
            
            <Form.Item name="department" className="mb-0">
              <Select
                placeholder="Departments or individuals"
                className="w-[200px]"
                allowClear
                onChange={handleFilter}
              >
                <Option value="all">All Department</Option>
                <Option value="finance">Finance</Option>
                <Option value="sales">Sales Team</Option>
                <Option value="hr">HR</Option>
                <Option value="database">Database Team</Option>
                <Option value="admin">Admin</Option>
              </Select>
            </Form.Item>

            <Form.Item name="employeeName" className="mb-0">
              <Input
                placeholder="Employee Id or Name"
                className="w-[180px]"
                allowClear
                onChange={handleFilter}
              />
            </Form.Item>

            <Form.Item name="status" className="mb-0">
              <Select
                placeholder="Status"
                className="w-[120px]"
                allowClear
                onChange={handleFilter}
              >
                <Option value="Published">Published</Option>
                <Option value="Unpublished">Unpublished</Option>
                <Option value="Draft">Draft</Option>
              </Select>
            </Form.Item>

            <Form.Item name="publishedDate" className="mb-0">
              <DatePicker 
                placeholder="Published on"
                className="w-[160px]"
                onChange={handleFilter}
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <Button 
                onClick={handleResetFilters}
                className="text-blue-600 hover:text-blue-700"
                type="link"
              >
                Reset Filters
              </Button>
            </Form.Item>
          </Form>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg">
          <Table
            columns={columns}
            dataSource={notices}
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
          />
        </div>
      </LoaderWraperComp>
    </div>
  );
};

export default Notices;