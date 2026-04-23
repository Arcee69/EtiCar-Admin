import { HiOutlineXMark } from "react-icons/hi2"
import type { Users } from "../../../types/global"


interface UserDetailsProps {
    handleClose: () => void
    userDetails: Users | null
}

const UserDetails = ({ handleClose, userDetails }: UserDetailsProps) => {

    if (!userDetails) return null


    return (
        <div className="bg-white min-w-2xl p-4 mt-10 h-120 overflow-y-auto shadow-xl rounded-lg">
            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-NEUTRAL-100">User Details</h2>
                <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-lg p-1.5 text-GREY-200 cursor-pointer hover:bg-GREY-300 hover:text-NEUTRAL-100"
                    aria-label="Close user modal"
                >
                    <HiOutlineXMark className="h-5 w-5" />
                </button>
            </div>

            <div className="space-y-6">
                {/* Status Badge */}
                <div className="flex flex-wrap gap-2">
                    <span className={`inline-flex capitalize items-center px-3 py-1 rounded-full text-xs font-medium ${userDetails.status === 'active' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-500 border border-red-200'}`}>
                        {userDetails.status}
                    </span>
                </div>

                {/* User ID */}
                <section>
                    <h3 className="text-sm font-medium text-GREY-200 uppercase tracking-wider">User ID</h3>
                    <div className="bg-GREY-50 rounded-lg p-4">
                        <code className="text-NEUTRAL-100 text-sm font-mono block break-all">{userDetails.id}</code>
                    </div>
                </section>

                {/* User Information */}
                <section>
                    <h3 className="text-sm font-medium text-GREY-200 uppercase tracking-wider mb-3">User Information</h3>
                    <div className="bg-GREY-50 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Name</span>
                            <span className="text-NEUTRAL-100 text-sm font-medium">{userDetails.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Email</span>
                            <span className="text-NEUTRAL-100 text-sm">{userDetails.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Phone</span>
                            <span className="text-NEUTRAL-100 text-sm">{userDetails.phone}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Vehicles</span>
                            <span className="text-NEUTRAL-100 text-sm font-medium">{userDetails.vehicles_count}</span>
                        </div>
                    </div>
                </section>

                {/* Verification Status */}
                <section>
                    <h3 className="text-sm font-medium text-GREY-200 uppercase tracking-wider mb-3">Verification Status</h3>
                    <div className="bg-GREY-50 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Email Verified</span>
                            <span className={`inline-flex capitalize items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${userDetails.email_verified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {userDetails.email_verified ? 'Verified' : 'Not Verified'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Phone Verified</span>
                            <span className={`inline-flex capitalize items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${userDetails.phone_verified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {userDetails.phone_verified ? 'Verified' : 'Not Verified'}
                            </span>
                        </div>
                    </div>
                </section>

                {/* Timestamps */}
                <section>
                    <h3 className="text-sm font-medium text-GREY-200 uppercase tracking-wider mb-3">Timeline</h3>
                    <div className="bg-GREY-50 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Registered On</span>
                            <span className="text-NEUTRAL-100 text-sm">{userDetails.registered_at}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Last Updated</span>
                            <span className="text-NEUTRAL-100 text-sm">{userDetails.updated_at}</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default UserDetails
