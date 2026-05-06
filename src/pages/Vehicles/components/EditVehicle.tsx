import { HiOutlineXMark } from "react-icons/hi2"
import { CgSpinner } from "react-icons/cg"
import { useState, useEffect, useCallback, useMemo } from "react"
import { toast } from "sonner"
import { vehiclesApi } from "../../../services/vehicles"
import type { VehiclesData, VehiclesReferenceData } from "../../../types/global"

interface EditVehicleProps {
  handleClose: () => void
  vehicleDetails: VehiclesData | null
  onUpdate?: () => void
  usersList: VehiclesReferenceData['users']
}

const EditVehicle = ({ handleClose, vehicleDetails, onUpdate, usersList }: EditVehicleProps) => {
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')
  const [plateNumber, setPlateNumber] = useState('')
  const [color, setColor] = useState('')
  const [vin, setVin] = useState('')
  const [vehicleType, setVehicleType] = useState('')
  const [status, setStatus] = useState('')
  const [seatCapacity, setSeatCapacity] = useState<number | ''>('')
  const [isAc, setIsAc] = useState(false)
  const [userId, setUserId] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleReset = useCallback(() => {
    setMake('')
    setModel('')
    setYear('')
    setPlateNumber('')
    setColor('')
    setVin('')
    setVehicleType('')
    setStatus('')
    setSeatCapacity('')
    setIsAc(false)
    setUserId('')
  }, [])

  useEffect(() => {
    if (vehicleDetails) {
      setMake(vehicleDetails.make)
      setModel(vehicleDetails.model)
      setYear(vehicleDetails.year.toString())
      setPlateNumber(vehicleDetails.plate_number)
      setColor(vehicleDetails.color)
      setVin(vehicleDetails.vin || '')
      setVehicleType(vehicleDetails.vehicle_type)
      setStatus(vehicleDetails.status)
      setSeatCapacity(vehicleDetails.seat_capacity ? Number(vehicleDetails.seat_capacity) : '')
      setIsAc(vehicleDetails.is_ac || false)
      setUserId(vehicleDetails.owner.id.toString())
    } else {
      handleReset()
    }
  }, [vehicleDetails, handleReset])

  const isValid = useMemo(() => {
    return (
      make.trim().length > 0 &&
      model.trim().length > 0 &&
      year.trim().length > 0 && !isNaN(Number(year)) &&
      plateNumber.trim().length > 0 &&
      color.trim().length > 0 &&
      vehicleType.trim().length > 0 &&
      status.trim().length > 0 &&
      seatCapacity !== '' && Number(seatCapacity) > 0 &&
      userId.length > 0
    )
  }, [make, model, year, plateNumber, color, vehicleType, status, seatCapacity, userId])

  const handleSubmit = async () => {
    if (!isValid) {
      toast.error('Please fill all required fields')
      return
    }

    const data = {
      make: make.trim(),
      model: model.trim(),
      year: Number(year),
      plate_number: plateNumber.trim(),
      color: color.trim(),
      vin: vin.trim(),
      vehicle_type: vehicleType.trim(),
      status: status.trim(),
      seat_capacity: Number(seatCapacity),
      is_ac: isAc,
      owner_id: userId,
    }

    if (!vehicleDetails) return

    setSubmitting(true)
    try {
      await vehiclesApi.updateVehicle(vehicleDetails.id, data)
      toast.success('Vehicle updated successfully')
      onUpdate?.()
      handleClose()
    } catch (error: unknown) {
      const message = (error as any)?.response?.data?.message || 'Failed to update vehicle'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-3xl rounded-xl border border-GREY-100 bg-white p-5 md:p-6 shadow-xl mt-10 max-h-[80vh] overflow-y-auto"
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-NEUTRAL-100">Edit Vehicle</h2>
        <button
          type="button"
          onClick={handleClose}
          className="rounded-lg p-1.5 text-GREY-200 hover:bg-GREY-300 hover:text-NEUTRAL-100"
          aria-label="Close vehicle modal"
        >
          <HiOutlineXMark className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-NEUTRAL-100">Make *</span>
          <input
            type="text"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            placeholder="e.g. Toyota"
            className="rounded-lg border border-GREY-100 px-3 py-2.5 text-sm text-NEUTRAL-100 outline-none focus:border-BLUE-400 focus:ring-2 focus:ring-BLUE-400/20"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-NEUTRAL-100">Model *</span>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="e.g. Camry"
            className="rounded-lg border border-GREY-100 px-3 py-2.5 text-sm text-NEUTRAL-100 outline-none focus:border-BLUE-400 focus:ring-2 focus:ring-BLUE-400/20"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-NEUTRAL-100">Year *</span>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value === '' ? '' : e.target.value)}
            placeholder="e.g. 2023"
            className="rounded-lg border border-GREY-100 px-3 py-2.5 text-sm text-NEUTRAL-100 outline-none focus:border-BLUE-400 focus:ring-2 focus:ring-BLUE-400/20"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-NEUTRAL-100">Plate Number *</span>
          <input
            type="text"
            value={plateNumber}
            onChange={(e) => setPlateNumber(e.target.value)}
            placeholder="e.g. ABC-123-XYZ"
            className="rounded-lg border border-GREY-100 px-3 py-2.5 text-sm text-NEUTRAL-100 outline-none focus:border-BLUE-400 focus:ring-2 focus:ring-BLUE-400/20"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-NEUTRAL-100">Color *</span>
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="e.g. Black"
            className="rounded-lg border border-GREY-100 px-3 py-2.5 text-sm text-NEUTRAL-100 outline-none focus:border-BLUE-400 focus:ring-2 focus:ring-BLUE-400/20"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-NEUTRAL-100">VIN</span>
          <input
            type="text"
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            placeholder="e.g. 1HGBH41JXMN109186 (optional)"
            className="rounded-lg border border-GREY-100 px-3 py-2.5 text-sm text-NEUTRAL-100 outline-none focus:border-BLUE-400 focus:ring-2 focus:ring-BLUE-400/20"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-NEUTRAL-100">Vehicle Type *</span>
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            className="rounded-lg border border-GREY-100 bg-white px-3 py-2.5 text-sm text-NEUTRAL-100 outline-none focus:border-BLUE-400 focus:ring-2 focus:ring-BLUE-400/20"
          >
            <option value="">Select type</option>
            <option value="car">Car</option>
            <option value="bike">Bike</option>
            <option value="van">Van</option>
            <option value="truck">Truck</option>
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-NEUTRAL-100">Status *</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-GREY-100 bg-white px-3 py-2.5 text-sm text-NEUTRAL-100 outline-none focus:border-BLUE-400 focus:ring-2 focus:ring-BLUE-400/20"
          >
            <option value="">Select status</option>
            <option value="available">Available</option>
            <option value="on_trip">On Trip</option>
            <option value="under_review">Under Review</option>
            <option value="suspended">Suspended</option>
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-NEUTRAL-100">Seat Capacity *</span>
          <input
            type="number"
            min="1"
            value={seatCapacity}
            onChange={(e) => setSeatCapacity(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="e.g. 5"
            className="rounded-lg border border-GREY-100 px-3 py-2.5 text-sm text-NEUTRAL-100 outline-none focus:border-BLUE-400 focus:ring-2 focus:ring-BLUE-400/20"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-NEUTRAL-100">Air Conditioning</span>
          <div className="flex items-center gap-3 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="is_ac"
                checked={isAc === true}
                onChange={() => setIsAc(true)}
                className="w-4 h-4 text-BLUE-100 border-GREY-100 focus:ring-BLUE-400"
              />
              <span className="text-sm text-NEUTRAL-100">Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="is_ac"
                checked={isAc === false}
                onChange={() => setIsAc(false)}
                className="w-4 h-4 text-BLUE-100 border-GREY-100 focus:ring-BLUE-400"
              />
              <span className="text-sm text-NEUTRAL-100">No</span>
            </label>
          </div>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-NEUTRAL-100">Owner *</span>
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="rounded-lg border border-GREY-100 bg-white px-3 py-2.5 text-sm text-NEUTRAL-100 outline-none focus:border-BLUE-400 focus:ring-2 focus:ring-BLUE-400/20"
          >
            <option value="">Select owner</option>
            {usersList.map((user) => (
              <option key={user.id} value={user.id.toString()}>
                {user.name || `User ${user.id}`}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={handleClose}
          className="rounded-lg border border-GREY-100 px-4 py-2 text-sm font-medium text-NEUTRAL-100 hover:bg-GREY-300 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isValid || submitting}
          className="rounded-lg bg-BLUE-100 px-4 py-2 text-sm font-medium text-white hover:bg-BLUE-300 disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-2"
        >
          {submitting ? <CgSpinner className='animate-spin text-lg text-white' /> : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

export default EditVehicle