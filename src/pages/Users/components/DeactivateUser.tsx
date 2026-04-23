import { HiOutlineXMark } from "react-icons/hi2"
import { useState } from "react"
import { toast } from "sonner"
import { usersApi } from "../../../services/users"
import type { Users } from "../../../types/global"
import { CgSpinner } from "react-icons/cg"


interface DeactivateUserProps {
    handleClose: () => void
    userDetails: Users | null
    onUpdate?: () => void; // Callback to refresh user list 
}

const DeactivateUser = ({ handleClose, userDetails, onUpdate }: DeactivateUserProps) => {
    const [loading, setLoading] = useState(false)

    const handleDeactivate = async () => {
        if (!userDetails) return
        setLoading(true)
        try {
            await usersApi.deactivateUser(userDetails.id)
            toast.success("User deactivated successfully")
            onUpdate?.()
            handleClose()
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to deactivate user")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white max-w-md p-4 mt-20 h-55 shadow rounded-lg">
            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-NEUTRAL-100">Deactivate User</h2>
                <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-lg p-1.5 text-GREY-200 cursor-pointer hover:bg-GREY-300 hover:text-NEUTRAL-100"
                    aria-label="Close vendor modal"
                >
                    <HiOutlineXMark className="h-5 w-5" />
                </button>
            </div>

               {/* Confirmation Message */}
            <div className="bg-GREY-100 rounded-lg p-3 mb-4">
                <p className="text-sm text-NEUTRAL-100">
                    Are you sure you want to deactivate this user? They will no longer be able to access the platform.
                </p>
            </div>

            {/* Action Button */}
            <div className="flex items-center justify-end gap-5">
                <button
                    className="bg-red-500 hover:bg-red-600 border-none text-white rounded-lg p-3 cursor-pointer w-auto h-11.5 flex justify-center transition-colors"
                    onClick={handleDeactivate}
                    disabled={loading}
                >
                    <p className='text-white text-sm text-center font-medium flex items-center gap-2'>
                        {loading ? <CgSpinner className="animate-spin text-lg" /> : "Deactivate"}
                    </p>
                </button>

                {/* Cancel Button */}
                <button
                    className="bg-white border border-GREY-100 text-NEUTRAL-100 rounded-lg p-3 cursor-pointer w-auto h-11.5 flex justify-center transition-colors hover:bg-GREY-100"
                    onClick={handleClose}
                    disabled={loading}
                >
                    <p className='text-NEUTRAL-100 text-sm text-center font-medium'>
                        Cancel
                    </p>
                </button>
            </div>
        </div>
    )
}

export default DeactivateUser