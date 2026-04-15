import { Form, Formik } from "formik";
import { CgSpinner } from "react-icons/cg";
import { useState } from "react";
import * as Yup from "yup";
import { toast } from "sonner";

import { PasswordField } from "../../components";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { setCredentials } from "../../store/slices/authSlice";
import { loginAdmin } from "../../services/auth";


const Login = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const formValidationSchema = Yup.object().shape({
        email: Yup.string().email("Enter a valid email").required("Email is required"),
        password: Yup.string().required("Password is required"),
    });

    const submitForm = async (values: { email: string; password: string }) => {
        setLoading(true);
        try {
            const response = await loginAdmin(values);
            if (response.status) {
                dispatch(setCredentials({
                    token: response.data.token,
                    user: response.data.user,
                    role: response.data.role,
                    permissions: response.data.permissions,
                }));
                toast.success(response.message || "Login successful.");
                navigate("/dashboard");
            } else {
                toast.error(response.message || "Login failed. Please try again.");
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
                    <p className="text-xl font-medium text-[#101828]">Welcome back!</p>
                    <p className='text-[#828282] text-sm'>Sign in to access</p>
                </div>
                <div className="mt-5">
                    <Formik
                        initialValues={{
                            email: "",
                            password: ""
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
                                        <label htmlFor='email' className="text-xs font-normal text-[#101828]">Email</label>
                                        <input
                                            name="email"
                                            placeholder="youremail@domain.com"
                                            type="text"
                                            value={values.email}
                                            onChange={handleChange}
                                            className="rounded-lg border-[#D0D5DD] outline-none w-full mt-1.5 border-solid p-3 border"
                                        />
                                        {errors.email && touched.email ? (
                                            <div className='text-red-500 text-xs'>{errors.email}</div>
                                        ) : null}
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <label htmlFor='password' className="text-xs font-normal text-[#101828]">Password</label>
                                        <PasswordField
                                            name="password"
                                            value={values.password}
                                            placeholder="Password"
                                            className="border  rounded-lg border-[#D0D5DD] mt-1.5"
                                            onChange={handleChange}
                                        />
                                        <p className="text-sm flex justify-end  mt-0.5">
                                            Forgot password? <span onClick={() => navigate("/change-password")} className="text-blue-500 hover:underline cursor-pointer ml-1 ">Reset here</span>
                                        </p>
                                        {errors.password && touched.password ? (
                                            <div className='text-red-500 text-xs'>{errors.password}</div>
                                        ) : null}
                                    </div>

                                    <button
                                        className="bg-red-600 border-none mt-5 text-white rounded-lg p-3 cursor-pointer w-full h-11.5 flex justify-center"
                                        type="submit"
                                        disabled={loading}
                                    >
                                        <p className='text-white text-sm text-center font-medium'>
                                            {loading ? <CgSpinner className="animate-spin text-lg" /> : 'Login'}
                                        </p>
                                    </button>

                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default Login;
