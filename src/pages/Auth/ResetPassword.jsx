import { Button, Input } from "antd";
import Form from "antd/es/form/Form";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "../../redux/features/Auth/authApi";
import Swal from "sweetalert2";
import { EyeTwoTone, EyeInvisibleOutlined, KeyOutlined } from "@ant-design/icons";
import bg from "../../assets/images/bg-reset-pass.svg";
import { IoArrowBackCircle } from "react-icons/io5";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const onFinish = async (values) => {
    try {
      // const token = sessionStorage.getItem("resend-token")
      // // Call the API endpoint "/auth/reset-password"
      // await resetPassword({
      //   // id: email,
      //   token,
      //   data: values,
      // }).unwrap();

      // Swal.fire({
      //   icon: "success",
      //   title: "Password Updated!!",
      //   showConfirmButton: false,
      //   timer: 1000,
      // });

      // sessionStorage.removeItem("verify-token");
      navigate("/auth");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed !!",
        text:
          (error.message ||
            error?.data?.message ||
            "Something went wrong.") +
          " Please try again later.",
      });
    }
  };

  return (
    <>
      <div className="hidden sm:flex w-1/2 justify-center items-center border-e">
        <img
          src={bg}
          alt="description"
          className="max-h-full max-w-full object-cover"
        />
      </div>

      {/* Right half - outlet content */}
      <div className="sm:w-1/2 flex justify-center items-center">
        <div className="rounded-[16px] max-w-2xl w-full border-2 shadow">
          <div className="w-full px-14 py-[80px]">
            <div className="pb-6 space-y-2">
              <div className="flex items-center gap-1 text-2xl text-1">
                <button onClick={() => { navigate(-1) }} className="hover:brightness-110 hover:scale-105 transition-transform duration-200">
                  <IoArrowBackCircle />
                </button>

                <h3 className="font-bold">Set new password</h3>
              </div>
              <p className="">
                Please check your email. We have sent a code to contact@gmail.com
              </p>
            </div>
            <Form
              name="reset_password"
              layout="vertical"
              initialValues={{
                remember: true,
              }}
              requiredMark={false}
              onFinish={onFinish}
            >
              <Form.Item
                name="password"
                className="text-base"
                rules={[
                  {
                    required: true,
                    message: "Password is required!",
                  },
                ]}
              >
                <Input.Password
                  prefix={<KeyOutlined className="text-[#29712D] me-3" />}
                  placeholder="New password"
                  className="rounded-md border border-gray-500/50 bg-gray-100"
                  size="large"
                  name="password"
                  iconRender={(visible) =>
                    visible ? (
                      <EyeTwoTone style={{ color: "#29712D" }} />
                    ) : (
                      <EyeInvisibleOutlined style={{ color: "#29712D" }} />
                    )
                  }
                />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                className="text-base"
                rules={[
                  {
                    required: true,
                    message: "Password is required!",
                  },
                ]}
              >
                <Input.Password
                  prefix={<KeyOutlined className="text-[#29712D] me-3" />}
                  placeholder="Confirm new password"
                  className="rounded-md border border-gray-500/50 bg-gray-100"
                  size="large"
                  name="password"
                  iconRender={(visible) =>
                    visible ? (
                      <EyeTwoTone style={{ color: "#29712D" }} />
                    ) : (
                      <EyeInvisibleOutlined style={{ color: "#29712D" }} />
                    )
                  }
                />
              </Form.Item>
              <div className="w-full flex justify-center pt-4">
                <Button
                  loading={isLoading}
                  size="large"
                  htmlType="submit"
                  className="w-full bg-1 text-white rounded-full"
                >
                  Confirm
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;

