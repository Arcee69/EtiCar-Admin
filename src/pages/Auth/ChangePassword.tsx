import { Form, Formik } from "formik";
import { CgSpinner } from "react-icons/cg";
import { useState } from "react";
import * as Yup from "yup";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { PasswordField } from "../../components";
import { changePassword } from "../../services/auth";

const ChangePassword = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const formValidationSchema = Yup.object().shape({
    current_password: Yup.string().required("Current password is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("New password is required"),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required("Password confirmation is required"),
  });

  const submitForm = async (values: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }) => {
    setLoading(true);
    try {
      const response = await changePassword(values);
      if (response.status) {
        toast.success(response.message || "Password changed successfully.");
        navigate("/");
      } else {
        toast.error(response.message || "Failed to change password. Please try again.");
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "An error occurred. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-[#FAFAFA] h-screen flex flex-col justify-center items-center p-4'>
      <div className='w-full md:w-120 bg-white shadow-lg rounded-lg border flex flex-col border-solid border-[#E6E7EC] p-8'>
        <div className='flex flex-col justify-center gap-1 items-center'>
          <p className="text-xl font-medium text-[#101828]">Change Password</p>
          <p className='text-[#828282] text-sm'>Enter your current password and new password</p>
        </div>
        <div className="mt-5">
          <Formik
            initialValues={{
              current_password: "",
              password: "",
              password_confirmation: "",
            }}
            validationSchema={formValidationSchema}
            onSubmit={(values) => {
              window.scrollTo(0, 0);
              submitForm(values);
            }}
          >
            {({
              handleSubmit,
              handleChange,
              errors,
              touched,
              values,
            }) => (
              <Form onSubmit={handleSubmit} className="flex flex-col">
                <div className='flex flex-col gap-6'>
                  <div className="flex flex-col ">
                    <label htmlFor='current_password' className="text-xs font-normal text-[#101828]">Current Password</label>
                    <PasswordField
                      name="current_password"
                      value={values.current_password}
                      placeholder="Enter current password"
                      className="border-[#D0D5DD] outline-none w-full mt-1.5"
                      onChange={handleChange}
                    />
                    {errors.current_password && touched.current_password ? (
                      <div className='text-red-500 text-xs'>{errors.current_password}</div>
                    ) : null}
                  </div>

                  <div className="flex flex-col w-full">
                    <label htmlFor='password' className="text-xs font-normal text-[#101828]">New Password</label>
                    <PasswordField
                      name="password"
                      value={values.password}
                      placeholder="Enter new password"
                      className="border-[#D0D5DD] outline-none w-full mt-1.5"
                      onChange={handleChange}
                    />
                    {errors.password && touched.password ? (
                      <div className='text-red-500 text-xs'>{errors.password}</div>
                    ) : null}
                  </div>

                  <div className="flex flex-col w-full">
                    <label htmlFor='password_confirmation' className="text-xs font-normal text-[#101828]">Confirm New Password</label>
                    <PasswordField
                      name="password_confirmation"
                      value={values.password_confirmation}
                      placeholder="Confirm new password"
                      className="border-[#D0D5DD] outline-none w-full mt-1.5"
                      onChange={handleChange}
                    />
                    {errors.password_confirmation && touched.password_confirmation ? (
                      <div className='text-red-500 text-xs'>{errors.password_confirmation}</div>
                    ) : null}
                  </div>

                  <button
                    className="bg-red-600 border-none mt-5 text-white rounded-lg p-3 cursor-pointer w-full h-11.5 flex justify-center"
                    type="submit"
                    disabled={loading}
                  >
                    <p className='text-white text-sm text-center font-medium'>
                      {loading ? <CgSpinner className="animate-spin text-lg" /> : 'Change Password'}
                    </p>
                  </button>

                 <p className="text-sm flex justify-center mt-0.5">
                    Remember password? <span onClick={() => navigate("/")} className="text-blue-500 hover:underline cursor-pointer ml-1 ">Login here</span>
                  </p>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword