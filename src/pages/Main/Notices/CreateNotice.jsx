import { useState, useEffect } from "react";
import { Button, Form, Input, Select, DatePicker, message } from "antd";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { FiCalendar, FiPaperclip, FiX } from "react-icons/fi";
import { MdOutlineCloudUpload } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import {
  useStoreNoticeMutation,
  useUpdateNoticeMutation,
  useGetAllNoticesQuery,
} from "../../../redux/features/notices/noticesApi";
import { useUploadSingleMutation } from "../../../redux/features/upload/uploadApi";
import toast from "react-hot-toast";
import LoaderWraperComp from "../../../Components/LoaderWraperComp";
import dayjs from "dayjs";

const { Option } = Select;
const { TextArea } = Input;

const CreateNotice = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [fileList, setFileList] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedTarget, setSelectedTarget] = useState("");
  const [showEmployeeFields, setShowEmployeeFields] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [storeNotice, { isLoading: isStoring }] = useStoreNoticeMutation();
  const [updateNotice, { isLoading: isUpdating }] = useUpdateNoticeMutation();
  const [uploadSingle] = useUploadSingleMutation();

  // Fetch notice data if editing
  const { data: noticeResponse, isLoading: isFetching } = useGetAllNoticesQuery(
    { id },
    { skip: !isEditMode }
  );

  useEffect(() => {
    if (isEditMode && noticeResponse?.data) {
      const notice = Array.isArray(noticeResponse.data)
        ? noticeResponse.data.find(n => n._id === id)
        : noticeResponse.data;

      if (notice) {
        form.setFieldsValue({
          target: notice.target,
          title: notice.title,
          employeeId: notice.employeeId,
          employeeName: notice.employeeName,
          employeePosition: notice.employeePosition,
          type: notice.type,
          publishDate: notice.publishDate ? dayjs(notice.publishDate) : null,
          body: notice.body,
        });
        setSelectedTarget(notice.target);
        setShowEmployeeFields(notice.target === "individual");

        // Handle existing attachments
        if (notice.attachments && notice.attachments.length > 0) {
          const existingFiles = notice.attachments.map((filename, index) => ({
            uid: `existing-${index}`,
            name: filename,
            status: 'done',
            isExisting: true,
            filename: filename
          }));
          setFileList(existingFiles);
          setUploadedFiles(notice.attachments);
        }
      }
    }
  }, [isEditMode, noticeResponse, form, id]);

  const handleTargetChange = (value) => {
    setSelectedTarget(value);
    setShowEmployeeFields(value === "individual");
    if (value !== "individual") {
      form.setFieldsValue({
        employeeId: undefined,
        employeeName: undefined,
        employeePosition: undefined,
      });
    }
  };

  const handleFileUpload = async (file) => {
    setIsUploading(true);
    try {
      const response = await uploadSingle(file).unwrap();

      if (response.data && response.data.filename) {
        return response.data.filename;
      } else {
        throw new Error("Invalid upload response");
      }
    } catch (error) {
      message.error(`Failed to upload ${file.name}`);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (values, isDraft = false) => {
    try {
      // Upload new files first
      const newFilesToUpload = fileList.filter(f => !f.isExisting && f.originFileObj);
      let newUploadedFilenames = [];

      if (newFilesToUpload.length > 0) {
        setIsUploading(true);
        const uploadPromises = newFilesToUpload.map(file => handleFileUpload(file.originFileObj));
        newUploadedFilenames = await Promise.all(uploadPromises);
        setIsUploading(false);
      }

      // Combine existing and new filenames
      const existingFilenames = fileList
        .filter(f => f.isExisting)
        .map(f => f.filename);

      const allAttachments = [...existingFilenames, ...newUploadedFilenames];

      // Prepare payload
      const payload = {
        title: values.title,
        body: values.body,
        target: values.target,
        type: values.type,
        publishDate: values.publishDate.toISOString(),
        status: isDraft ? 'draft' : 'published',
        attachments: allAttachments,
      };

      // Add employee fields if target is individual
      if (values.target === 'individual') {
        payload.employeeId = values.employeeId;
        payload.employeeName = values.employeeName;
        payload.employeePosition = values.employeePosition;
      }

      if (isEditMode) {
        await updateNotice({ id, payload }).unwrap();
        toast.success(`Notice ${isDraft ? 'saved as draft' : 'updated'} successfully!`);
      } else {
        await storeNotice(payload).unwrap();
        toast.success(`Notice ${isDraft ? 'saved as draft' : 'created'} successfully!`);
      }

      navigate('/notice-board');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type);
      if (!isValidType) {
        message.error(`${file.name}: Only JPG/PNG/PDF files are allowed!`);
        return false;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error(`${file.name}: File must be smaller than 5MB!`);
        return false;
      }
      return true;
    });

    const newFiles = validFiles.map((file, index) => ({
      uid: `new-${Date.now()}-${index}`,
      name: file.name,
      status: 'done',
      originFileObj: file,
      isExisting: false
    }));

    setFileList([...fileList, ...newFiles]);
  };

  const handleRemoveFile = (file) => {
    setFileList(fileList.filter(f => f.uid !== file.uid));
  };

  const targetOptions = [
    { value: "all", label: "All Department" },
    { value: "finance", label: "Finance Department" },
    { value: "sales", label: "Sales Department" },
    { value: "web", label: "Web Department" },
    { value: "database", label: "Database Department" },
    { value: "admin", label: "Admin Department" },
    { value: "hr", label: "HR Department" },
    { value: "individual", label: "Individual" },
  ];

  // 'warning' | 'disciplinary' | 'performance_improvement' | 'appreciation' | 'recognition' | 'attendance' | 'leave_issue' | 'payroll' | 'compensation' | 'contract_update' | 'role_update' | 'advisory' | 'personal_reminder';
  const noticeTypeOptions = [
    { value: "warning", label: "Warning" },
    { value: "disciplinary", label: "Disciplinary Action" },
    { value: "performance_improvement", label: "Performance Improvement" },
    { value: "appreciation", label: "Appreciation" },
    { value: "recognition", label: "Recognition" },
    { value: "attendance", label: "Attendance Issue" },
    { value: "leave_issue", label: "Leave Issue" },
    { value: "payroll", label: "Payroll" },
    { value: "compensation", label: "Compensation Update" },
    { value: "contract_update", label: "Contract Update" },
    { value: "role_update", label: "Role / Position Update" },
    { value: "advisory", label: "Advisory" },
    { value: "personal_reminder", label: "Personal Reminder" },
  ];

  return (
    <div className="py-4 px-6">
      <LoaderWraperComp isLoading={isFetching}>
        <div className="mb-6">
          <button
            onClick={() => navigate('/notice-board')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <IoChevronBackOutline size={20} />
            <span className="text-xl font-medium">
              {isEditMode ? 'Edit Notice' : 'Create a Notice'}
            </span>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <p className="text-xl font-semibold  p-6">Please fill in the details below</p>
          <hr></hr>

          <div className="p-6">
            <Form
              form={form}
              layout="vertical"
              onFinish={(values) => handleSubmit(values, false)}
            >
              {/* Target Department/Individual */}
              <Form.Item
                label={<span className="text-sm font-medium">Target Department(s) or Individual</span>}
                name="target"
                rules={[{ required: true, message: "Please select target" }]}
                className="bg-gray-100 p-4 rounded-md"
              >
                <Select
                  placeholder="Individual"
                  size="large"
                  suffixIcon={<IoChevronForwardOutline className="text-gray-400" />}
                  onChange={handleTargetChange}
                >
                  {targetOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {/* Notice Title */}
              <Form.Item
                label={<span className="text-sm font-medium">Notice Title</span>}
                name="title"
                rules={[{ required: true, message: "Please enter notice title" }]}
              >
                <Input
                  placeholder="Write the Title of Notice"
                  size="large"
                />
              </Form.Item>

              {/* Employee Fields - Show only when Individual is selected */}
              {showEmployeeFields && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <Form.Item
                    label={<span className="text-sm font-medium">Select Employee ID</span>}
                    name="employeeId"
                    rules={[{ required: showEmployeeFields, message: "Required" }]}
                  >
                    <Select
                      placeholder="Select employee designation"
                      size="large"
                      suffixIcon={<IoChevronForwardOutline className="text-gray-400" />}
                    >
                      <Option value="EMP001">EMP001</Option>
                      <Option value="EMP002">EMP002</Option>
                      <Option value="EMP12345">EMP12345</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label={<span className="text-sm font-medium">Employee Name</span>}
                    name="employeeName"
                    rules={[{ required: showEmployeeFields, message: "Required" }]}
                  >
                    <Input
                      placeholder="Enter employee full name"
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item
                    label={<span className="text-sm font-medium">Position</span>}
                    name="employeePosition"
                    rules={[{ required: showEmployeeFields, message: "Required" }]}
                  >
                    <Select
                      placeholder="Select employee department"
                      size="large"
                      suffixIcon={<IoChevronForwardOutline className="text-gray-400" />}
                    >
                      <Option value="Manager">Manager</Option>
                      <Option value="Developer">Developer</Option>
                      <Option value="Software Engineer">Software Engineer</Option>
                      <Option value="Designer">Designer</Option>
                      <Option value="HR">HR</Option>
                    </Select>
                  </Form.Item>
                </div>
              )}

              {/* Notice Type and Publish Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Form.Item
                  label={<span className="text-sm font-medium">Notice Type</span>}
                  name="type"
                  rules={[{ required: true, message: "Please select notice type" }]}
                >
                  <Select
                    placeholder="Select Notice Type"
                    size="large"
                    suffixIcon={<IoChevronForwardOutline className="text-gray-400" />}
                  >
                    {noticeTypeOptions.map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label={<span className="text-sm font-medium">Publish Date</span>}
                  name="publishDate"
                  rules={[{ required: true, message: "Please select publish date" }]}
                >
                  <DatePicker
                    placeholder="Select Publishing Date"
                    size="large"
                    className="w-full py-3.5 rounded-xl"
                    showTime
                    format="YYYY-MM-DD HH:mm"
                    suffixIcon={<FiCalendar className="text-gray-400" size={16} />}
                  />
                </Form.Item>
              </div>

              {/* Notice Body */}
              <Form.Item
                label={<span className="text-sm font-medium">Notice Body</span>}
                name="body"
                rules={[{ required: true, message: "Please enter notice body" }]}
              >
                <TextArea
                  placeholder="Write the details about notice"
                  rows={6}
                  className="resize-none"
                />
              </Form.Item>

              {/* Upload Attachments */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Upload Attachments <span className="text-gray-400 font-normal">(optional)</span>
                </label>

                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-400 transition-colors">
                    <MdOutlineCloudUpload className="mx-auto text-teal-500 mb-2" size={40} />
                    <p className="text-sm text-gray-600">
                      <span className="text-teal-500 font-medium">Upload</span> nominee profile image or drag and drop.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Accepted File Type: jpg, png, pdf
                    </p>
                  </div>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="!hidden"
                  onChange={handleFileChange}
                />

                {/* Display uploaded files */}
                {fileList.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {fileList.map(file => (
                      <div
                        key={file.uid}
                        className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded border border-gray-200"
                      >
                        <div className="flex items-center gap-2">
                          <FiPaperclip className="text-gray-400" size={16} />
                          <span className="text-sm text-gray-700">{file.name}</span>
                          {file.isExisting && (
                            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">Existing</span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(file)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <FiX size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  size="large"
                  onClick={() => navigate('/notice-board')}
                  className="px-8"
                  disabled={isUploading || isStoring || isUpdating}
                >
                  Cancel
                </Button>

                <Button
                  size="large"
                  onClick={() => form.validateFields().then(values => handleSubmit(values, true))}
                  loading={isUploading || isStoring || isUpdating}
                  className="px-8 border-blue-500 text-blue-500 hover:border-blue-600 hover:text-blue-600"
                >
                  Save as Draft
                </Button>

                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  loading={isUploading || isStoring || isUpdating}
                  className="px-8 bg-orange-500 hover:bg-orange-600 border-none"
                >
                  {isEditMode ? 'Update Notice' : 'Publish Notice'}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </LoaderWraperComp>
    </div>
  );
};

export default CreateNotice;