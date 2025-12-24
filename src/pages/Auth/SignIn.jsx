import { Button, Checkbox, Input } from "antd";
import Form from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { usePostLoginMutation } from "../../redux/features/Auth/authApi";
import Swal from "sweetalert2";
import { setLogin } from "../../redux/features/Auth/authSlice";
import { EyeTwoTone, EyeInvisibleOutlined, MailOutlined, KeyOutlined } from "@ant-design/icons";
import bg from "../../assets/images/bg-login.svg";

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [remember, setRemember] = useState(null);
  const [mutation, { isLoading }] = usePostLoginMutation();

  const onFinish = async (values) => {
    try {
      // Call the login API ("/auth/admin-login")
      const response = await mutation(values).unwrap();
      // Store the token and update Redux state with user details
      localStorage.setItem("token", response?.data?.tokens?.accessToken);
      console.log(response?.data?.tokens?.accessToken);
      dispatch(
        setLogin({
          user: { ...response?.data?.user, _id: response?.data?.user?.id },
          token: response?.data?.tokens?.accessToken,
        })
      );
      // Navigate to the intended route or homepage
      navigate(location.state ? location.state : "/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed!!",
        text:
          (error.message ||
            error?.data?.message ||
            "Something went wrong.") +
          " Please try again later.",
      });
    }
  };

  const rememberHandler = () => {
    setRemember((c) => !c);
    if (remember) {
      sessionStorage.removeItem("remember-me");
    } else {
      sessionStorage.setItem("remember-me", true);
    }
  };

  useEffect(() => {
    setRemember(!!sessionStorage.getItem("remember-me"));
  }, []);

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
            <div className="pb-6 text-center space-y-2">
              <h3 className="font-bold text-2xl text-1">Welcome Back!</h3>
              <p>Please enter your email and password to continue.</p>
            </div>
            <Form
              name="normal_login"
              layout="vertical"
              requiredMark={false}
              initialValues={{}}
              onFinish={onFinish}
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="text-1 me-3" />}
                  placeholder="Enter Your Email"
                  size="large"
                  className="rounded-md border border-gray-500/50 bg-gray-100"
                />
              </Form.Item>
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
                  prefix={<KeyOutlined className="text-1 me-3" />}
                  placeholder="Enter password"
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
              <div className="flex justify-between items-center">
                <Form.Item name="remember" valuePropName="checked">
                  <Checkbox className="text-base text-1">
                    Remember me
                  </Checkbox>
                </Form.Item>
                <Form.Item>
                  <Button
                    onClick={() => navigate("/auth/forgot-password")}
                    type="link"
                    className="font-medium"
                    style={{ color: 'red !important' }}
                  >
                    <span className="text-green-600 underline cursor-pointer hover:text-green-700">Forget password?</span>
                  </Button>
                </Form.Item>
              </div>
              <Form.Item>
                <Button
                  size="large"
                  htmlType="submit"
                  className="w-full bg-1 text-white rounded-full"
                  loading={isLoading}
                >
                  Sign In
                </Button>
              </Form.Item>
              <span className="block text-sm text-gray-600 bg-gray-100 rounded-md px-3 py-2">
                Test login — <span className="font-mono">admin@gmail.com</span> / <span className="font-mono">1qazxsw2</span>
              </span>
            </Form>
          </div>
        </div>
      </div>
    </>

  );
};

export default SignIn;
