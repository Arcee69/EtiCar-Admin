import { Form, Formik } from "formik";
import { useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { HiOutlineXMark } from "react-icons/hi2";
import { toast } from "sonner";
import * as Yup from "yup";
import type { Vendor } from '../../../types/global'
import { vendorApi } from '../../../services/vendors'

interface UpdateVendorProps {
    handleClose: () => void;
    vendorDetails: Vendor | null;
    onUpdate?: () => void; // Callback to refresh vendor list
}

const UpdateVendor = ({ handleClose, vendorDetails, onUpdate }: UpdateVendorProps) => {
    const [loading, setLoading] = useState(false);

    const formValidationSchema = Yup.object().shape({
        businessName: Yup.string().required("Business Name is required"),
        businessAddress: Yup.string().required("Location is required"),
    });

    const submitForm = async (values: { businessName: string; businessAddress: string }) => {
        if (!vendorDetails?.id) {
            toast.error("Vendor ID is required");
            return;
        }

        const data = {
            business_name: values.businessName,
            business_address: values.businessAddress,
        }

        try {
            setLoading(true);
            await vendorApi.updateVendor(vendorDetails.id, data);
            toast.success("Vendor updated successfully.");
            onUpdate?.(); // Refresh the vendor list
            handleClose();
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
        <div className="bg-white min-w-md p-4 mt-20 h-90 shadow rounded-lg">
            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-NEUTRAL-100">Edit Vendor</h2>
                <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-lg p-1.5 text-GREY-200 cursor-pointer hover:bg-GREY-300 hover:text-NEUTRAL-100"
                    aria-label="Close vendor modal"
                >
                    <HiOutlineXMark className="h-5 w-5" />
                </button>
            </div>
            <div className="mt-5">
                <Formik
                    initialValues={{
                        businessName: vendorDetails?.business_name || "",
                        businessAddress: vendorDetails?.business_address || ""
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
                                    <label htmlFor='businessName' className="text-xs font-normal text-[#101828]">Business Name</label>
                                    <input
                                        name="businessName"
                                        placeholder="Enter business name"
                                        type="text"
                                        value={values.businessName}
                                        onChange={handleChange}
                                        className="rounded-lg border-[#D0D5DD] outline-none w-full mt-1.5 border-solid p-3 border"
                                    />
                                    {errors.businessName && touched.businessName ? (
                                        <div className='text-red-500 text-xs'>{errors.businessName}</div>
                                    ) : null}
                                </div>

                                <div className="flex flex-col ">
                                    <label htmlFor='businessAddress' className="text-xs font-normal text-[#101828]">Business Address</label>
                                    <input
                                        name="businessAddress"
                                        placeholder="Enter business address"
                                        type="text"
                                        value={values.businessAddress}
                                        onChange={handleChange}
                                        className="rounded-lg border-[#D0D5DD] outline-none w-full mt-1.5 border-solid p-3 border"
                                    />
                                    {errors.businessAddress && touched.businessAddress ? (
                                        <div className='text-red-500 text-xs'>{errors.businessAddress}</div>
                                    ) : null}
                                </div>
                            

                                <button
                                    className="bg-NEUTRAL-200 border-none mt-5 text-white rounded-lg p-3 cursor-pointer w-full h-11.5 flex justify-center"
                                    type="submit"
                                    disabled={loading}
                                >
                                    <p className='text-white text-sm text-center font-medium'>
                                        {loading ? <CgSpinner className="animate-spin text-lg" /> : 'Update Vendor'}
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

export default UpdateVendor