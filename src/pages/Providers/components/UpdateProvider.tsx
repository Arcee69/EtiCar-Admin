import { Form, Formik } from "formik"
import { useState } from "react"
import { CgSpinner } from "react-icons/cg"
import { HiOutlineXMark } from "react-icons/hi2"
import { toast } from "sonner"
import * as Yup from "yup"
import type { ProvidersData } from "../../../types/global"
import { providersApi } from "../../../services/providers"

interface UpdateProviderProps {
  handleClose: () => void
  selectedProvider: ProvidersData | null
  onUpdate?: () => void
}

interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
}

const UpdateProvider = ({ handleClose, selectedProvider, onUpdate }: UpdateProviderProps) => {
  const [loading, setLoading] = useState(false)

  const formValidationSchema = Yup.object().shape({
    business_name: Yup.string().required("Business Name is required"),
    business_address: Yup.string().required("Business Address is required"),
    cac_number: Yup.string().nullable(),
    service_area_id: Yup.number().nullable(),
    latitude: Yup.number().nullable(),
    longitude: Yup.number().nullable(),
    phone: Yup.string().required("Phone number is required"),
    services: Yup.array().of(Yup.string()).min(1, "At least one service is required"),
    city: Yup.string().required("City is required"),
    is_online: Yup.boolean(),
    is_open: Yup.boolean(),
  })

  if (!selectedProvider) return null

  // Parse service_types or services array from provider data
  const initialServices = Array.isArray(selectedProvider.service_types)
    ? selectedProvider.service_types
    : Array.isArray(selectedProvider.services)
    ? selectedProvider.services
    : []

  const submitForm = async (values: {
    business_name: string
    business_address: string
    cac_number: string
    phone: string
    services: string[]
    city: string
    is_online: boolean
    is_open: boolean
  }) => {
    if (!selectedProvider.id) {
      toast.error("Provider ID is required")
      return
    }

    // Build payload - include only non-empty values
    const rawPayload = {
      business_name: values.business_name,
      business_address: values.business_address,
      cac_number: values.cac_number || undefined,
    //   service_area_id: values.service_area_id || undefined,
    //   latitude: values.latitude || undefined,
    //   longitude: values.longitude || undefined,
      phone: values.phone,
      service_types: values.services,
      city: values.city,
      is_online: values.is_online,
      is_open: values.is_open,
    }

    const data = Object.fromEntries(
      Object.entries(rawPayload).filter((entry) => entry[1] !== null && entry[1] !== undefined && entry[1] !== '')
    )

    try {
      setLoading(true)
      await providersApi.updateProvider(selectedProvider.id, data)
      toast.success("Provider updated successfully.")
      onUpdate?.()
      handleClose()
    } catch (error) {
      const message = (error as ApiError)?.response?.data?.message || "An error occurred. Please try again."
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white min-w-md p-4 mt-10 max-h-[85vh] overflow-y-auto shadow rounded-lg">
      <div className="mb-5 flex items-center justify-between sticky top-0 bg-white z-10">
        <h2 className="text-lg font-semibold text-NEUTRAL-100">Edit Provider</h2>
        <button
          type="button"
          onClick={handleClose}
          className="rounded-lg p-1.5 text-GREY-200 cursor-pointer hover:bg-GREY-300 hover:text-NEUTRAL-100"
          aria-label="Close provider modal"
        >
          <HiOutlineXMark className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-5">
        <Formik
          initialValues={{
            business_name: selectedProvider.business_name || "",
            business_address: selectedProvider.business_address || "",
            cac_number: selectedProvider.cac_number || "",
            // service_area_id: selectedProvider.service_area_id ?? null,
            // latitude: selectedProvider.latitude ?? null,
            // longitude: selectedProvider.longitude ?? null,
            phone: selectedProvider.phone || "",
            services: initialServices,
            city: selectedProvider.city || "",
            is_online: selectedProvider.is_online ?? true,
            is_open: selectedProvider.is_open ?? true,
          }}
          validationSchema={formValidationSchema}
          onSubmit={(values) => {
            window.scrollTo(0, 0)
            submitForm(values)
          }}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            errors,
            touched,
            values,
            setFieldValue,
          }) => (
            <Form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* Business Name */}
              <div className="flex flex-col">
                <label htmlFor='business_name' className="text-xs font-normal text-[#101828]">
                  Business Name
                </label>
                <input
                  name="business_name"
                  placeholder="Enter business name"
                  type="text"
                  value={values.business_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="rounded-lg border-[#D0D5DD] outline-none w-full mt-1.5 border-solid p-3 border"
                />
                {errors.business_name && touched.business_name ? (
                  <div className='text-red-500 text-xs'>{errors.business_name}</div>
                ) : null}
              </div>

              {/* Business Address */}
              <div className="flex flex-col">
                <label htmlFor='business_address' className="text-xs font-normal text-[#101828]">
                  Business Address
                </label>
                <input
                  name="business_address"
                  placeholder="Enter business address"
                  type="text"
                  value={values.business_address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="rounded-lg border-[#D0D5DD] outline-none w-full mt-1.5 border-solid p-3 border"
                />
                {errors.business_address && touched.business_address ? (
                  <div className='text-red-500 text-xs'>{errors.business_address}</div>
                ) : null}
              </div>

              {/* CAC Number */}
              <div className="flex flex-col">
                <label htmlFor='cac_number' className="text-xs font-normal text-[#101828]">
                  CAC Registration Number
                </label>
                <input
                  name="cac_number"
                  placeholder="e.g. RC123456"
                  type="text"
                  value={values.cac_number}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="rounded-lg border-[#D0D5DD] outline-none w-full mt-1.5 border-solid p-3 border"
                />
              </div>

              {/* Service Area ID */}
              {/* <div className="flex flex-col">
                <label htmlFor='service_area_id' className="text-xs font-normal text-[#101828]">
                  Service Area ID
                </label>
                <input
                  name="service_area_id"
                  placeholder="Enter service area ID"
                  type="number"
                  value={values.service_area_id ?? ''}
                  onChange={(e) => setFieldValue('service_area_id', e.target.value ? Number(e.target.value) : null)}
                  onBlur={handleBlur}
                  className="rounded-lg border-[#D0D5DD] outline-none w-full mt-1.5 border-solid p-3 border"
                />
              </div> */}

              {/* Coordinates */}
              {/* <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label htmlFor='latitude' className="text-xs font-normal text-[#101828]">
                    Latitude
                  </label>
                  <input
                    name="latitude"
                    placeholder="Latitude"
                    type="number"
                    step="any"
                    value={values.latitude ?? ''}
                    onChange={(e) => setFieldValue('latitude', e.target.value ? Number(e.target.value) : null)}
                    onBlur={handleBlur}
                    className="rounded-lg border-[#D0D5DD] outline-none w-full mt-1.5 border-solid p-3 border"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor='longitude' className="text-xs font-normal text-[#101828]">
                    Longitude
                  </label>
                  <input
                    name="longitude"
                    placeholder="Longitude"
                    type="number"
                    step="any"
                    value={values.longitude ?? ''}
                    onChange={(e) => setFieldValue('longitude', e.target.value ? Number(e.target.value) : null)}
                    onBlur={handleBlur}
                    className="rounded-lg border-[#D0D5DD] outline-none w-full mt-1.5 border-solid p-3 border"
                  />
                </div>
              </div> */}

              {/* Phone */}
              <div className="flex flex-col">
                <label htmlFor='phone' className="text-xs font-normal text-[#101828]">
                  Phone Number
                </label>
                <input
                  name="phone"
                  placeholder="Enter phone number"
                  type="text"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="rounded-lg border-[#D0D5DD] outline-none w-full mt-1.5 border-solid p-3 border"
                />
                {errors.phone && touched.phone ? (
                  <div className='text-red-500 text-xs'>{errors.phone}</div>
                ) : null}
              </div>

              {/* Services/Types */}
              <div className="flex flex-col">
                <label htmlFor='services' className="text-xs font-normal text-[#101828]">
                  Service Types (one per line)
                </label>
                <textarea
                  name="services"
                  placeholder="Enter services, one per line&#10;e.g. Mechanic&#10;Electrical"
                  value={values.services.join('\n')}
                  onChange={(e) => {
                    const servicesArray = e.target.value
                      .split('\n')
                      .map(s => s.trim())
                      .filter(Boolean)
                    setFieldValue('services', servicesArray)
                  }}
                  rows={4}
                  className="rounded-lg border-[#D0D5DD] outline-none w-full mt-1.5 border-solid p-3 border resize-none"
                />
                {errors.services && touched.services ? (
                  <div className='text-red-500 text-xs'>{errors.services}</div>
                ) : null}
              </div>

              {/* City */}
              <div className="flex flex-col">
                <label htmlFor='city' className="text-xs font-normal text-[#101828]">
                  City
                </label>
                <input
                  name="city"
                  placeholder="Enter city"
                  type="text"
                  value={values.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="rounded-lg border-[#D0D5DD] outline-none w-full mt-1.5 border-solid p-3 border"
                />
                {errors.city && touched.city ? (
                  <div className='text-red-500 text-xs'>{errors.city}</div>
                ) : null}
              </div>

              {/* Status Toggles */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 rounded-lg border border-GREY-100">
                  <label htmlFor="is_online" className="text-sm text-NEUTRAL-100">
                    Online Status
                  </label>
                  <input
                    type="checkbox"
                    name="is_online"
                    checked={values.is_online}
                    onChange={(e) => setFieldValue('is_online', e.target.checked)}
                    className="w-5 h-5 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-GREY-100">
                  <label htmlFor="is_open" className="text-sm text-NEUTRAL-100">
                    Open for Business
                  </label>
                  <input
                    type="checkbox"
                    name="is_open"
                    checked={values.is_open}
                    onChange={(e) => setFieldValue('is_open', e.target.checked)}
                    className="w-5 h-5 rounded"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                className="bg-NEUTRAL-200 border-none mt-5 text-white rounded-lg p-3 cursor-pointer w-full h-11.5 flex justify-center"
                type="submit"
                disabled={loading}
              >
                <p className='text-white text-sm text-center font-medium flex items-center gap-2'>
                  {loading ? <CgSpinner className="animate-spin text-lg" /> : 'Update Provider'}
                </p>
              </button>

            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default UpdateProvider
