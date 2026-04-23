import { CgSpinner } from "react-icons/cg"
import { HiOutlineXMark } from "react-icons/hi2"
import { Formik, Form } from "formik"
import { useState } from "react"
import * as Yup from "yup"
import { toast } from "sonner"


import type { UsersData } from "../../../types/global"
import { usersApi } from "../../../services/users"

interface UserDetailsProps {
    handleClose: () => void
    userDetails: UsersData | null
    onUpdate?: () => void; // Callback to refresh user list
}

const UpdateUser = ({ handleClose, userDetails, onUpdate }: UserDetailsProps) => {
    const [loading, setLoading] = useState(false);

    const formValidationSchema = Yup.object().shape({
        fullName: Yup.string().required("Full name is required"),
        email: Yup.string().email("Invalid email format").required("Email is required"),
        status: Yup.string()
    });

    const submitForm = async (values: { fullName: string; email: string; status: string }) => {
        const data = {
            full_name: values.fullName,
            email: values.email,
            status: values.status
        }

        try {
            setLoading(true);
            if (userDetails?.id) {
                await usersApi.updateUser(userDetails.id, data);
                toast.success("User updated successfully.");
                onUpdate?.(); // Refresh the user list
                handleClose();
            }
        } catch (error: unknown) {
            const message =
                (error as any)?.response?.data?.message ||
                "An error occurred. Please try again.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="bg-white min-w-md p-4 mt-20 h-110 shadow rounded-lg">
            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-NEUTRAL-100">Edit User</h2>
                <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-lg p-1.5 text-GREY-200 cursor-pointer hover:bg-GREY-300 hover:text-NEUTRAL-100"
                    aria-label="Close user modal"
                >
                    <HiOutlineXMark className="h-5 w-5" />
                </button>
            </div>
            <div className="mt-5">
                <Formik
                    initialValues={{
                        fullName: userDetails?.name || "",
                        email: userDetails?.email || "",
                        status: userDetails?.status || "active"
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
                                    <label htmlFor='fullName' className="text-xs font-normal text-[#101828]">Full Name</label>
                                    <input
                                        name="fullName"
                                        placeholder="Enter full name"
                                        type="text"
                                        value={values.fullName}
                                        onChange={handleChange}
                                        className="rounded-lg border-[#D0D5DD] outline-none w-full mt-1.5 border-solid p-3 border"
                                    />
                                    {errors.fullName && touched.fullName ? (
                                        <div className='text-red-500 text-xs'>{errors.fullName}</div>
                                    ) : null}
                                </div>

                                <div className="flex flex-col ">
                                    <label htmlFor='email' className="text-xs font-normal text-[#101828]">Email</label>
                                    <input
                                        name="email"
                                        placeholder="Enter email"
                                        type="email"
                                        value={values.email}
                                        onChange={handleChange}
                                        className="rounded-lg border-[#D0D5DD] outline-none w-full mt-1.5 border-solid p-3 border"
                                    />
                                    {errors.email && touched.email ? (
                                        <div className='text-red-500 text-xs'>{errors.email}</div>
                                    ) : null}
                                </div>

                                <div className="flex flex-col ">
                                    <label htmlFor="status" className="text-xs font-normal text-[#101828]">Status</label>
                                    <select
                                        name="status"
                                        value={values.status}
                                        onChange={handleChange}
                                        className="rounded-lg border-[#D0D5DD] outline-none w-full mt-1.5 border-solid p-3 border"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>

                                <button
                                    className="bg-NEUTRAL-200 border-none mt-5 text-white rounded-lg p-3 cursor-pointer w-full h-11.5 flex justify-center"
                                    type="submit"
                                    disabled={loading}
                                >
                                    <p className='text-white text-sm text-center font-medium'>
                                        {loading ? <CgSpinner className="animate-spin text-lg" /> : 'Update User'}
                                    </p>
                                </button>

                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default UpdateUser