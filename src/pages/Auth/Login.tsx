import { Form, Formik } from "formik";
import { CgSpinner } from "react-icons/cg";
import { useState } from "react";
import * as Yup from "yup";

import { PasswordField } from "../../components";
import { useNavigate } from "react-router-dom";


const Login = () => {
    const [loading, setLoading] = useState<boolean>(false)

    const navigate = useNavigate();

    const formValidationSchema = Yup.object().shape({
        email: Yup.string().email().required("Email is required"),
        password: Yup.string().required("Password is required"),
    });

    const submitForm = (values: any) => {
        console.log(values, "values")
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            navigate("/dashboard")
        }, 3000)
    }

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
                            window.scrollTo(0, 0)
                            console.log(values, "often")
                            submitForm(values)
                        }}
                    >
                        {({
                            handleSubmit,
                            handleChange,
                            // dirty,
                            // isValid,
                            // setFieldValue,
                            errors,
                            touched,
                            // setFieldTouched,
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
                                        {/* <p className="text-primary text-left text-xs mt-1.5 font-medium cursor-pointer">Forgot Password?</p> */}
                                        {errors.password && touched.password ? (
                                            <div className='text-red-500 text-xs'>{errors.password}</div>
                                        ) : null}
                                    </div>

                                    <button
                                        className="bg-red-600 border-none mt-5 text-white rounded-lg p-3 cursor-pointer w-full h-11.5 flex justify-center"
                                        type="submit"
                                    >
                                        <p className='text-white text-sm  text-center  font-medium'>{loading ? <CgSpinner className=" animate-spin text-lg  " /> : 'Login'}</p>
                                    </button>

                                </div>


                            </Form>
                        )}
                    </Formik>
                </div>

            </div>

        </div>

    )

}

export default Login