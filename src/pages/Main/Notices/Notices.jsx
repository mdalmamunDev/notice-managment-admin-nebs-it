import { useState, useEffect } from "react";
import { Button, Form, Input, Select, DatePicker, Tag, Checkbox } from "antd";
import { FiEdit2, FiEye, FiCalendar, FiPaperclip } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdAdd } from "react-icons/md";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);

  const [searchQuery, setSearchQuery] = useState({
    target: "",
    keyword: "",
    status: "",
    publishDate: "",
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
  const activeNotices = notices.filter(n => n.status === 'published').length;
  const draftNotices = notices.filter(n => n.status === 'draft').length;

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
      refetch();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed!!",
        text: (error.message || error?.data?.message || "Something went wrong.") + " Please try again later.",
      });
    }
  };

  const handleStatusClick = async (notice) => {
    const statusMap = {
      'published': 'unpublished',
      'unpublished': 'draft',
      'draft': 'published'
    };
    
    const newStatus = statusMap[notice.status] || 'published';
    
    try {
      await updateNotice({ id: notice._id, payload: { status: newStatus } }).unwrap();
      toast.success(`Notice status changed to ${newStatus}`);
      refetch();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleFilter = () => {
    const values = form.getFieldsValue();
    setSearchQuery({
      target: values.target || "",
      keyword: values.keyword || "",
      status: values.status || "",
      publishDate: values.publishDate ? values.publishDate.format('YYYY-MM-DD') : "",
      limit: 10,
    });
  };

  const handleResetFilters = () => {
    form.resetFields();
    setSearchQuery({
      target: "",
      keyword: "",
      status: "",
      publishDate: "",
      limit: 10,
    });
  };

  const showModal = (record = {}) => {
    setModalData(record);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    navigate(`/notice-board/edit/${record._id}`);
  };

  const handleCreateNotice = () => {
    navigate('/notice-board/create');
  };

  const handleViewDrafts = () => {
    form.setFieldsValue({ status: 'draft' });
    handleFilter();
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(notices.map(notice => notice._id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const totalPages = Math.ceil((pagination.totalCount || 0) / (pagination.itemsPerPage || 10));

  const targetStyles = {
    all: {
      text: "All Department",
      style: "text-gray-800",
    },
    finance: {
      text: "Finance",
      style: "text-emerald-700",
    },
    sales: {
      text: "Sales Team",
      style: "text-orange-700",
    },
    web: {
      text: "Web Team",
      style: "text-sky-700",
    },
    database: {
      text: "Database Team",
      style: "text-violet-700",
    },
    admin: {
      text: "Admin",
      style: "text-slate-800",
    },
    individual: {
      text: "Individual",
      style: "text-pink-700",
    },
    hr: {
      text: "HR",
      style: "text-teal-700",
    },
  };

  const statusStyles = {
    published: {
      text: "Published",
      style: "bg-green-100 text-green-700 border-0",
    },
    unpublished: {
      text: "Unpublished",
      style: "bg-red-100 text-red-700 border-0",
    },
    draft: {
      text: "Draft",
      style: "bg-yellow-100 text-yellow-800 border-0",
    },
  };

  return (
    <div className="py-4 px-6">
      <LoaderWraperComp isError={isError} isLoading={isLoading}>
        {/* header */}
        <div className="mb-4">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Notice Management</h2>
              <div className="flex gap-3 text-sm">
                <span className="text-green-600">Active Notices: <span className="font-semibold">{activeNotices}</span></span>
                <span className="text-gray-300">|</span>
                <span className="text-orange-500">Draft Notice: <span className="font-semibold">{draftNotices}</span></span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                type="primary"
                className="bg-orange-500 hover:bg-orange-600 border-none h-10 px-5 flex items-center gap-2"
                onClick={handleCreateNotice}
              >
                <MdAdd size={20} />
                Create Notice
              </Button>
              <Button
                className="border-orange-500 text-orange-500 hover:border-orange-600 hover:text-orange-600 h-10 px-5 flex items-center gap-2"
                onClick={handleViewDrafts}
              >
                <FiEdit2 size={16} />
                All Draft Notice
              </Button>
            </div>
          </div>

          {/* filter sec */}
          <Form form={form} layout="inline" className="flex items-center justify-end">
            <span className="text-sm text-gray-600 font-medium pe-4">Filter by:</span>

            <Form.Item name="keyword" className="mb-0">
              <Input
                placeholder="Title, Employee Id or Name"
                className="w-[160px] h-8"
                allowClear
                onPressEnter={handleFilter}
              />
            </Form.Item>
            
            <Form.Item name="target" className="mb-0">
              <Select
                placeholder="Select Target"
                className="w-[220px]"
                suffixIcon={<IoChevronForwardOutline className="text-gray-400" />}
                allowClear
                onChange={handleFilter}
              >
                {Object.entries(targetStyles).map(([key, value]) => (
                  <Option key={key} value={key}>{value.text}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="status" className="mb-0">
              <Select
                placeholder="Select Status"
                className="w-[140px]"
                suffixIcon={<IoChevronForwardOutline className="text-gray-400" />}
                allowClear
                onChange={handleFilter}
              >
                {Object.entries(statusStyles).map(([key, value]) => (
                  <Option key={key} value={key}>{value.text}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="publishDate" className="mb-0">
              <DatePicker
                placeholder="Published on"
                className="w-[160px] h-8"
                suffixIcon={<FiCalendar className="text-gray-400" size={14} />}
                onChange={handleFilter}
              />
            </Form.Item>

            <Button
              onClick={handleResetFilters}
              className="border-blue-500 text-blue-500 hover:border-blue-600 hover:text-blue-600 px-4"
              type="text"
            >
              Reset Filters
            </Button>
          </Form>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="ps-6 text-left">
                    <Checkbox
                      onChange={handleSelectAll}
                      checked={selectedRows.length === notices.length && notices.length > 0}
                      indeterminate={selectedRows.length > 0 && selectedRows.length < notices.length}
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Target</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Published On</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : notices.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      No notices found
                    </td>
                  </tr>
                ) : (
                  notices.map((notice) => (
                    <tr key={notice._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <Checkbox
                          checked={selectedRows.includes(notice._id)}
                          onChange={() => handleSelectRow(notice._id)}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-800">{notice.title || "N/A"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600 capitalize">{notice.type?.replace(/_/g, ' ') || "N/A"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={"text-sm font-medium " + (targetStyles[notice.target]?.style || 'text-gray-700')}>
                          {targetStyles[notice.target]?.text || notice.target || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {notice.publishDate
                            ? new Date(notice.publishDate).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })
                            : "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Tag 
                          className={"text-xs px-3 py-1 rounded-full cursor-pointer hover:opacity-80 transition-opacity " + (statusStyles[notice.status]?.style || 'bg-gray-200 text-gray-700')}
                          onClick={() => handleStatusClick(notice)}
                          title="Click to change status"
                        >
                          {statusStyles[notice.status]?.text || notice.status || "N/A"}
                        </Tag>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => showModal(notice)}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                            title="View"
                          >
                            <FiEye size={18} />
                          </button>
                          <button
                            onClick={() => handleEdit(notice)}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                            title="Edit"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(notice._id)}
                            className="text-gray-500 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <BsThreeDotsVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 py-6 border-t border-gray-200">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <IoChevronBackOutline size={16} className="text-gray-600" />
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const pageNum = index + 1;
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded border transition-colors ${
                      currentPage === pageNum
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                return <span key={pageNum} className="text-gray-400">...</span>;
              }
              return null;
            })}

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <IoChevronForwardOutline size={16} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Notice Details Modal */}
        <DashboardModal 
          setIsModalOpen={setIsModalOpen} 
          isModalOpen={isModalOpen} 
          width="800px" 
          maxWidth="95%"
        >
          <div className="text-base space-y-6">
            <h6 className="font-semibold text-2xl text-center text-gray-800 mb-4">Notice Details</h6>

            <div className="space-y-5">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs font-medium text-gray-500 mb-2">Title</p>
                <p className="text-lg font-semibold text-gray-900">{modalData?.title || "N/A"}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 mb-2">Notice Type</p>
                  <p className="text-sm text-gray-800 capitalize">{modalData?.type?.replace(/_/g, ' ') || "N/A"}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 mb-2">Target</p>
                  <p className={"text-sm font-medium " + (targetStyles[modalData?.target]?.style || 'text-gray-800')}>
                    {targetStyles[modalData?.target]?.text || modalData?.target || "N/A"}
                  </p>
                </div>
              </div>

              {modalData?.target === 'individual' && (
                <div className="grid grid-cols-3 gap-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Employee ID</p>
                    <p className="text-sm font-semibold text-gray-800">{modalData?.employeeId || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Employee Name</p>
                    <p className="text-sm font-semibold text-gray-800">{modalData?.employeeName || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Position</p>
                    <p className="text-sm font-semibold text-gray-800">{modalData?.employeePosition || "N/A"}</p>
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">Notice Body</p>
                <div className="bg-white p-4 rounded-lg border border-gray-200 text-sm leading-relaxed whitespace-pre-wrap min-h-[120px]">
                  {modalData?.body || "No content available."}
                </div>
              </div>

              {modalData?.creator && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 mb-2">Created By</p>
                  <div className="flex items-center gap-3">
                    <img 
                      src={modalData.creator.profileImage || '/default-avatar.png'} 
                      alt={modalData.creator.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{modalData.creator.name}</p>
                      <p className="text-xs text-gray-500">{modalData.creator.email}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 mb-2">Status</p>
                  <Tag 
                    className={"text-xs px-3 py-1 rounded-full cursor-pointer hover:opacity-80 " + (statusStyles[modalData?.status]?.style || 'bg-gray-200 text-gray-700')}
                    onClick={() => {
                      handleStatusClick(modalData);
                      setIsModalOpen(false);
                    }}
                    title="Click to change status"
                  >
                    {statusStyles[modalData?.status]?.text || modalData?.status || "N/A"}
                  </Tag>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 mb-2">Published On</p>
                  <p className="text-sm text-gray-700">
                    {modalData?.publishDate 
                      ? new Date(modalData.publishDate).toLocaleString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : "N/A"}
                  </p>
                </div>
              </div>

              {modalData?.attachments && modalData.attachments.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-3">Attachments ({modalData.attachments.length})</p>
                  <div className="space-y-2">
                    {modalData.attachments.map((filename, index) => (
                      <a
                        key={index}
                        href={`${import.meta.env.VITE_IMAGE_URL}/${filename}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 px-4 py-3 rounded-lg border border-gray-200 transition-colors"
                      >
                        <FiPaperclip className="text-blue-500" size={16} />
                        <span className="text-sm text-gray-700 flex-1">{filename}</span>
                        <span className="text-xs text-gray-400">View</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button 
                type="default" 
                onClick={() => setIsModalOpen(false)}
                className="px-6"
              >
                Close
              </Button>
              <Button
                type="primary"
                className="bg-blue-600 px-6"
                onClick={() => {
                  setIsModalOpen(false);
                  handleEdit(modalData);
                }}
              >
                Edit Notice
              </Button>
            </div>
          </div>
        </DashboardModal>
      </LoaderWraperComp>
    </div>
  );
};

export default Notices;