import { HiOutlineXMark } from 'react-icons/hi2';
import { useState } from 'react';
import { toast } from 'sonner';
import { CgSpinner } from 'react-icons/cg';
import { vehiclesApi } from '../../../services/vehicles';
import type { VehiclesReferenceData } from '../../../types/global';

interface CreateVehicleProps {
  handleClose: () => void;
  onUpdate?: () => void;
  usersList: VehiclesReferenceData['users'];
}

const CreateVehicle = ({ handleClose, onUpdate, usersList }: CreateVehicleProps) => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [color, setColor] = useState('');
  const [vin, setVin] = useState('');
  const [userId, setUserId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isValid =
    make.trim().length > 0 &&
    model.trim().length > 0 &&
    year.trim().length > 0 && !isNaN(Number(year)) &&
    plateNumber.trim().length > 0 &&
    color.trim().length > 0 &&
    vin.trim().length > 0 &&
    userId.length > 0;

  const handleSubmit = async () => {
    if (!isValid) {
      toast.error('Please fill all required fields');
      return;
    }

    const data = {
        make: make.trim(),
        model: model.trim(),
        year: Number(year),
        plate_number: plateNumber.trim(),
        color: color.trim(),
        vin: vin.trim(),
        owner_id: userId,
    }

    console.log("data: ", data)

    setSubmitting(true);
    try {
      await vehiclesApi.createVehicleItem(data);
      toast.success('Vehicle created successfully');
      onUpdate?.();
      handleClose();
    } catch (error: unknown) {
      const message = (error as any)?.response?.data?.message || 'Failed to create vehicle';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-3xl rounded-xl border border-GREY-100 bg-white p-5 md:p-6 shadow-xl mt-10 max-h-[65vh] overflow-y-auto"
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-NEUTRAL-100">Create Vehicle</h2>
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
            placeholder="e.g. 2020"
            className="rounded-lg border border-GREY-100 px-3 py-2.5 text-sm text-NEUTRAL-100 outline-none focus:border-BLUE-400 focus:ring-2 focus:ring-BLUE-400/20"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-NEUTRAL-100">Plate Number *</span>
          <input
            type="text"
            value={plateNumber}
            onChange={(e) => setPlateNumber(e.target.value)}
            placeholder="e.g. LAG-234-XY"
            className="rounded-lg border border-GREY-100 px-3 py-2.5 text-sm text-NEUTRAL-100 outline-none focus:border-BLUE-400 focus:ring-2 focus:ring-BLUE-400/20"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-NEUTRAL-100">Color *</span>
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="e.g. Silver"
            className="rounded-lg border border-GREY-100 px-3 py-2.5 text-sm text-NEUTRAL-100 outline-none focus:border-BLUE-400 focus:ring-2 focus:ring-BLUE-400/20"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-NEUTRAL-100">VIN *</span>
          <input
            type="text"
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            placeholder="e.g. ABC123456789"
            className="rounded-lg border border-GREY-100 px-3 py-2.5 text-sm text-NEUTRAL-100 outline-none focus:border-BLUE-400 focus:ring-2 focus:ring-BLUE-400/20"
          />
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
          {submitting ? <CgSpinner className='animate-spin text-lg text-white' /> : 'Create Vehicle'}
        </button>
      </div>
    </div>
  );
};

export default CreateVehicle;
