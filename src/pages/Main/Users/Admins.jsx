import { useState, useEffect } from "react";
import { Button, Input, InputNumber, Select, Form, Table } from "antd";
import { IoSearch } from "react-icons/io5";

import { useAddAdminMutation, useDeleteAdminMutation, useGetAllAdminQuery, useUpdateAdminMutation } from "../../../redux/features/Users/usersApi";

import PageHeading from "../../../Components/PageHeading";

import LoaderWraperComp from "../../../Components/LoaderWraperComp";
import { FaUsers } from "react-icons/fa";
import { FaPlus, FaToggleOff, FaToggleOn, FaTrash } from "react-icons/fa6";
import DashboardModal from "../../../Components/DashboardModal";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const { Option } = Select;

const Admins = () => {
  const [searchQuery, setSearchQuery] = useState({
    keyword: "",
    limit: 10,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const { data: usersData, isLoading, isError } = useGetAllAdminQuery({
    page: currentPage,
    limit: searchQuery.limit,
    keyword: searchQuery.keyword,
  });

  // Form instance
  const [form] = Form.useForm();

  // Reset page to 1 on searchQuery change (except initial load)
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // When currentPage changes, fetch users is handled automatically by RTK Query hook

  // Handle form submit (enter or button click)
  const onFinish = (values) => {
    setSearchQuery({
      keyword: values.keyword?.trim() || "",
      role: "admin",
      limit: values.limit || 10,
    });
  };



  const [modalForm] = Form.useForm();
  const [modalData, setModalData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = (record = {}) => {
    setModalData(record);
    setIsModalOpen(true);
    modalForm.setFieldsValue({
      name: record.name || "",
      email: record.email || "",
      role: record.role || "",
    });
  };

  const [addAdmin] = useAddAdminMutation();
  const [updateAdmin] = useUpdateAdminMutation();
  const [deleteAdmin] = useDeleteAdminMutation();
  const submitForm = async (values) => {
    try {
      await addAdmin(values);
      toast.success("Admin added successfully.");
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

  const updateRole = async (payload) => {
    try {
      const res = await updateAdmin(payload);

      // If backend sends something like { success: false, message: "..." }
      if (res?.error || res?.success === false) {
        toast.error(res?.error.data?.message || "Failed to update admin.");
        return;
      }

      toast.success("Admin updated successfully.");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed!!",
        text:
          (error?.response?.data?.message ||
            error?.message ||
            "Something went wrong.") + " Please try again later.",
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this admin?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteAdmin(id);
      toast.success("Admin deleted successfully.");
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


  const columns = [
    {
      title: "User ID",
      key: "_id",
      render: (record) => (
        <div className="flex">
          <div
            title={record.status}
            className={`w-2 h-6 me-2 rounded-md ${record.status === "active"
              ? "bg-green-500"
              : record.status === "delete"
                ? "bg-black"
                : "bg-red-500"
              }`}
          ></div>
          {record._id || "N/A"}
        </div>
      ),
    },
    {
      title: <span className="capitalize">Name</span>,
      dataIndex: "name",
      key: "name",
      render: (text) => text || "N/A",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => text || "N/A",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (text) => text || "N/A",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (text, record) => {
        const isAdmin = record.role === "admin";
        const newRole = isAdmin ? "sub_admin" : "admin";
        const buttonLabel = "Make him " + (isAdmin ? "Sub Admin" : "Admin");

        return (
          <button
            onClick={() => updateRole({ userId: record._id, role: newRole })}
            className="text-blue-600 hover:underline"
            title={buttonLabel}
          >
            {text}
          </button>
        )
      },
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div className="flex gap-x-4 items-center">
          {record.status === 'active' ? (
            <FaToggleOn
              size={20}
              className="cursor-pointer text-green-600"
              title="Active"
              onClick={() => updateRole({ userId: record._id, status: 'inactive' })}
            />
          ) : (
            <FaToggleOff
              size={20}
              className="cursor-pointer text-gray-400"
              title="Inactive"
              onClick={() => updateRole({ userId: record._id, status: 'active' })}
            />
          )}
          <FaTrash
            size={18}
            className="cursor-pointer text-red-600 hover:text-red-800"
            title="Delete"
            onClick={() => handleDelete(record._id)}
          />
        </div>
      )
    },
  ];

  return (
    <div className="py-[16px]">
      <LoaderWraperComp isError={isError} isLoading={isLoading}>
        <div className="rounded-lg border-2 border-gray-200 shadow-sm p-4 mb-8">
          <div className="flex items-center space-x-4">
            {/* Icon Container */}
            <div className="w-12 h-12 bg-s-1 rounded-lg flex items-center justify-center">
              <FaUsers className="w-6 h-6 text-white" />
            </div>

            {/* Text Content */}
            <div>
              <h3 className="text-3xl font-bold text-s-1">Total Admin</h3>
              <p className="text-lg font-semibold text-s-2">{usersData?.pagination?.totalCount || 0}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2 bg-4 mb-4">
          <div className="p-2 flex flex-1 justify-between items-center">
            <PageHeading title={"All Admin's List"} disbaledBackBtn={true} />

            {/* Filters Form */}
            <Form
              form={form}
              layout="inline"
              className="flex items-center gap-x-2"
              initialValues={{
                limit: searchQuery.limit,
                role: searchQuery.role,
                keyword: searchQuery.keyword,
              }}
              onFinish={onFinish}
            >
              <Form.Item
                name="limit"
                rules={[
                  {
                    type: "number",
                    min: 5,
                    max: 1000,
                    transform: (value) => Number(value),
                  },
                ]}
              >
                <InputNumber
                  min={5}
                  max={1000}
                  step={5}
                  placeholder="Limit"
                  className="w-[90px]"
                />
              </Form.Item>

              {/* <Form.Item name="role" noStyle>
              <Select
                placeholder="Select Role"
                allowClear
                style={{ width: 140 }}
              >
                <Option value="">Select Role</Option>
                <Option value="admin">Admin</Option>
                <Option value="customer">Customer</Option>
                <Option value="mechanic">Mechanic</Option>
                <Option value="tow_truck">Tow Truck</Option>
              </Select>
            </Form.Item> */}

              <Form.Item name="keyword" noStyle>
                <Input
                  placeholder="User Name/Email/ID/Phone"
                  className="focus:outline-none outline-none placeholder:text-[#222222] px-3.5 text-sm w-[170px]"
                  allowClear
                />
              </Form.Item>

              <Form.Item noStyle>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-s-1"
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

        {/* <UserListTable
          pagination={usersData?.pagination}
          data={usersData?.data}
          setCurrentPage={setCurrentPage}
        /> */}

        <Table
          loading={false}
          columns={columns}
          dataSource={usersData?.data?.map((item, index) => ({
            ...item,
            key: index + 1,
          }))}
          pagination={
            usersData?.pagination && {
              position: ["bottomCenter"],
              showQuickJumper: true,
              showSizeChanger: false,
              total: usersData?.pagination?.totalCount,
              current: usersData?.pagination?.currentPage,
              pageSize: usersData?.pagination?.itemsPerPage,
              onChange: (page) => setCurrentPage(page),
            }
          }
        />

        <DashboardModal setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen}>
          <div className="flex flex-col justify-between text-base">
            <div className="space-y-7">
              <h6 className="font-medium text-center text-xl pb-1">Admin or Sub Admin</h6>
              <Form
                form={modalForm}
                name="edit_promo"
                layout="vertical"
                requiredMark={false}
                onFinish={submitForm}
                className="space-y-[24px]"
              >
                <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                  <Input
                    size="large"
                    className=""
                    placeholder="Enter admin name"
                  />
                </Form.Item>
                <Form.Item name="email" label="Email"
                  rules={[
                    { required: true, message: "Please enter your email" },
                    { type: "email", message: "Please enter a valid email" },
                  ]}
                >
                  <Input
                    size="large"
                    className="w-full"
                    placeholder="Enter admin email"
                  />
                </Form.Item>
                <Form.Item name="role" label="Role" rules={[{ required: true }]}>
                  <Select
                    size="middle"
                    className="w-full h-10"
                    placeholder="Select admin role"
                    options={[
                      { label: "Root Admin", value: "admin" },
                      { label: "Sub Admin", value: "sub_admin" },
                    ]}
                  />
                </Form.Item>
                <Form.Item name="password" label="Password" rules={[{ required: true, message: "Password is required" }]}>
                  <Input.Password
                    size="middle"
                    className="p-2"
                    placeholder="Enter a password"
                  />
                </Form.Item>
                <Form.Item name="confirmPassword" label="Confirm Password" rules={[{ required: true, message: "Confirm Password is required" }]}>
                  <Input.Password
                    size="middle"
                    className="p-2"
                    placeholder="Confirm the password"
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

export default Admins;
