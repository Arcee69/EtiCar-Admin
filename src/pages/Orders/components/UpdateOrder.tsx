import { HiOutlineXMark } from "react-icons/hi2";
import { Formik, Form } from "formik";
import { CgSpinner } from "react-icons/cg";
import * as Yup from "yup";
import { toast } from "sonner";
import { useState } from "react";
import { ordersApi } from "../../../services/orders";

import type { Orders } from "../../../types/global";

interface OrderDetailsProps {
    handleClose: () => void
    orderDetails: Orders | null
    onUpdate?: () => void; // Callback to refresh order list
}

const UpdateOrder = ({ handleClose, orderDetails, onUpdate }: OrderDetailsProps) => {

    const [loading, setLoading] = useState(false);

    const formValidationSchema = Yup.object().shape({
        status: Yup.string().required("Status is required"),
        notes: Yup.string()
    });

    const submitForm = async (values: { status: string; notes: string }) => {
        if (!orderDetails?.id) {
            toast.error("Order ID is required");
            return;
        }

        try {
            setLoading(true);
            await ordersApi.updateOrder(orderDetails.id, { status: values.status, notes: values.notes });
            toast.success("Order updated successfully.");
            onUpdate?.();
            handleClose();
        } catch (error: unknown) {
            const message =
                (error as any)?.response?.data?.message ||
                "Failed to update order. Please try again.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    // Get allowed status transitions or default to common statuses
    const availableStatuses = orderDetails?.allowed_status_transitions?.length 
        ? orderDetails.allowed_status_transitions
        : [] //['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

    return (
        <div className="bg-white min-w-md p-4 mt-20 h-100 shadow rounded-lg">
            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-NEUTRAL-100">Update Order Status</h2>
                <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-lg p-1.5 text-GREY-200 cursor-pointer hover:bg-GREY-300 hover:text-NEUTRAL-100"
                    aria-label="Close order modal"
                >
                    <HiOutlineXMark className="h-5 w-5" />
                </button>
            </div>

            <div className="mt-5">
                <Formik
                    initialValues={{
                        status: orderDetails?.status || "pending",
                        notes: orderDetails?.notes || ""
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
                                    <label htmlFor="status" className="text-xs font-normal text-[#101828]">Status</label>
                                    <select
                                        name="status"
                                        value={values.status}
                                        onChange={handleChange}
                                        className="rounded-lg border-[#D0D5DD] outline-none w-full mt-1.5 border-solid p-3 border"
                                    >
                                        {availableStatuses.map((status) => (
                                            <option key={status} value={status}>
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.status && touched.status ? (
                                        <div className='text-red-500 text-xs'>{errors.status}</div>
                                    ) : null}
                                </div>

                                <div className="flex flex-col ">
                                    <label htmlFor="notes" className="text-xs font-normal text-[#101828]">Notes (Optional)</label>
                                    <textarea
                                        name="notes"
                                        value={values.notes}
                                        onChange={handleChange}
                                        className="rounded-lg border-[#D0D5DD] outline-none w-full mt-1.5 border-solid p-3 border"
                                        rows={3}
                                        placeholder="Add any notes about this status change"
                                    />
                                </div>

                                <button
                                    className="bg-NEUTRAL-200 border-none mt-5 text-white rounded-lg p-3 cursor-pointer w-full h-11.5 flex justify-center"
                                    type="submit"
                                    disabled={loading}
                                >
                                    <p className='text-white text-sm text-center font-medium'>
                                        {loading ? <CgSpinner className="animate-spin text-lg" /> : 'Update Order'}
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

export default UpdateOrder