import Loading from "@/navigation/Loading"
import { formatDateOnly } from "@/utils/convert"

import { useQuery } from "@/utils/dom"
import { initialFormikValues, formValidationSchema } from "@/utils/forms"
import { IUser } from "@/utils/types"
import axios from "axios"
import { FormikValues } from "formik"
import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import nookies from "nookies"

import { UTILITIES_AIRCOMPRESSOR_FORM_DATA } from "@/utils/data"

import UtilitiesAirCompressorHorizontalLabelForm from "@/components/forms/Utilities_Forms/UtilitiesAirCompressorHorizontalLabelForm"
import UtilityHeader from "@/components/UtilityHeader"
import UtilitiesDynamicForm from "@/components/forms/Utilities_Forms/UtilitiesDynamicForm"
import ConfigurableFormSection from "@/components/forms/ConfigurableFormSection"
import api from "@/api/axiosInstance"
import { toast } from "react-toastify"
import PageHeaderWithSearchAndAdd from "@/navigation/PageHeaderWithSearchAndAdd"
interface IManageAirCompressorProps {
  user: IUser | null
}

const ManageConfigurationAirCompressor: React.FunctionComponent<
  IManageAirCompressorProps
> = ({ user }) => {
  const { plantName } = useParams<{ plantName?: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const query = useQuery()
  const token = nookies.get(null).accessToken || ""

  const id = query.get("id")

  const [loading, setLoading] = useState(false)
  const [updateDataById, setUpdateDataById] = useState<any[]>([])
  const [airCompressorLevels, setAirCompressorLevels] = useState<any[]>([])
  const [data, setData] = useState<number | null>(null)
  const [validfrom, setValidFrom] = useState<string | null>(null)
  const [validto, setValidTo] = useState<string | null>(null)
  const [airCompressorItem, setAirCompressorItem] = useState()
  const [showForm, setShowForm] = useState(false)

  const rmInitialDefaultData = initialFormikValues(
    UTILITIES_AIRCOMPRESSOR_FORM_DATA,
  )
  const rmFormValidationSchemaData = formValidationSchema(
    UTILITIES_AIRCOMPRESSOR_FORM_DATA,
  )

  const initialDefaultValueData = initialFormikValues(
    UTILITIES_AIRCOMPRESSOR_FORM_DATA,
  )

  const validationSchema = formValidationSchema(
    UTILITIES_AIRCOMPRESSOR_FORM_DATA,
    [
      {
        key: "AirCompressorLevelItem",
        variables: UTILITIES_AIRCOMPRESSOR_FORM_DATA,
      },
    ],
  )
  const rmDefaultData = airCompressorLevels || []

  const handleCancelForm = () => {
    navigate(`/utilities/air-compressor`)
    console.log(rmDefaultData)
  }

  const handleSubmitForm = async (
    values: FormikValues,
    actions: FormikValues,
  ) => {
    setLoading(true)

    const firstFormBlock = {
      // plantId: parseInt(values.plantId) || 10023,
      plantId: parseInt(values.plantId),
      lineId: parseInt(values.lineId),

      airCompName: values.airCompName,
      airCompIP: values.airCompIP,
      oilType: values.oilType,
      commPrtcl: values.commPrtcl,
      manufacturerName: values.manufacturerName,
      modelNumber: values.modelNumber,
      serialNumber: values.serialNumber,
      manufactureYear: values.manufactureYear,
      compType: values.compType,
      commIdorSlaveId: parseInt(values.commIdorSlaveId),
      dispOrCapacity: parseFloat(values.dispOrCapacity),
      maxWorkingPresRange: parseFloat(values.maxWorkingPresRange),
      minWorkingPresRange: parseFloat(values.minWorkingPresRange),
      motorPower: parseFloat(values.motorPower),
      theorizedVltg: parseFloat(values.theorizedVltg),
      theorizedPhase: parseFloat(values.theorizedPhase),
      theorizedFreq: parseFloat(values.theorizedFreq),
      tankVolume: parseFloat(values.tankVolume),
      rpmComp: parseFloat(values.rpmComp),
      oilQty: parseFloat(values.oilQty),
      // createdBy: user?.email || "system",
      // modifiedBy: user?.email || "system",
    }

    const additionalBlocks =
      values?.AirCompressorLevelItem?.map((item: any) => ({
        // plantId: parseInt(item.plantId) || 10023,
        plantId: parseInt(item.plantId),
        lineId: parseInt(item.lineId),

        airCompName: item.airCompName,
        airCompIP: item.airCompIP,
        oilType: item.oilType,
        commPrtcl: item.commPrtcl,
        manufacturerName: item.manufacturerName,
        modelNumber: item.modelNumber,
        serialNumber: item.serialNumber,
        manufactureYear: item.manufactureYear,
        compType: item.compType,
        commIdorSlaveId: parseInt(item.commIdorSlaveId),
        dispOrCapacity: parseFloat(item.dispOrCapacity),
        maxWorkingPresRange: parseFloat(item.maxWorkingPresRange),
        minWorkingPresRange: parseFloat(item.minWorkingPresRange),
        motorPower: parseFloat(item.motorPower),
        theorizedVltg: parseFloat(item.theorizedVltg),
        theorizedPhase: parseFloat(item.theorizedPhase),
        theorizedFreq: parseFloat(item.theorizedFreq),
        tankVolume: parseFloat(item.tankVolume),
        rpmComp: parseFloat(item.rpmComp),
        oilQty: parseFloat(item.oilQty),
        // createdBy: user?.email || "system",
        // modifiedBy: user?.email || "system",
      })) || []

    const payload = [firstFormBlock, ...additionalBlocks]

    try {
      const response = await api.post("AirCompressor/AddAirComp", payload)
      if (response.status === 200) {
        toast.success("Air Compressor Added Successfully", {
          autoClose: 1000, // 1 second
        })

        setTimeout(() => {
          navigate(`/utilities/air-compressor`)
        }, 1000)
      }
    } catch (error: any) {
      const status = error?.response?.status

      if (status === 401) return

      toast.error("Something went wrong. Please try again.", {
        autoClose: 1000, // 1 second
      })
    } finally {
      setLoading(false)
      actions.setSubmitting(false)
    }
  }

  return (
    <div>
      <UtilityHeader
        onUtilityChange={(utility) => console.log("Utility:", utility)}
      />

      <div className="w-full">
        <div className="rounded border-base-300">
          <PageHeaderWithSearchAndAdd
          title={`Air-Compressor Configuration`}
           />
          <div className=" screen-height-media">
            {loading && <Loading />}
            {/* <UtilitiesAirCompressorHorizontalLabelForm */}
            {/* <UtilitiesDynamicForm
              formType="AirCompressor"
              formVariables={UTILITIES_AIRCOMPRESSOR_FORM_DATA}
              initialDefaultValueData={initialDefaultData}
              rmFormVariables={UTILITIES_AIRCOMPRESSOR_FORM_DATA}
              rmInitialDefaultValues={rmDefaultData}
              formValidationSchemaData={formValidationSchemaData}
              rmFormValidationSchemaData={formValidationSchemaData}
              handleCancelForm={handleCancelForm}
              handleSubmitForm={handleSubmitForm}
            /> */}
            <ConfigurableFormSection
              sectionName="Air Compressor"
              fieldName="AirCompressorLevelItem"
              formVariables={UTILITIES_AIRCOMPRESSOR_FORM_DATA}
              initialValues={{
                ...initialDefaultValueData,
                AreaLevelItem: rmDefaultData.length
                  ? rmDefaultData.map((i) => ({ ...i, isCollapsed: false }))
                  : [],
              }}
              validationSchema={validationSchema}
              collapsedItemCount={2}
              buttonLabel="ADD Air Compressor"
              handleSubmitForm={handleSubmitForm}
              handleCancelForm={handleCancelForm}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageConfigurationAirCompressor






// import Loading from "@/navigation/Loading"
// import { formatDateOnly } from "@/utils/convert"

// import { useQuery } from "@/utils/dom"
// import { initialFormikValues, formValidationSchema } from "@/utils/forms"
// import { IUser } from "@/utils/types"
// import axios from "axios"
// import { FormikValues } from "formik"
// import { useEffect, useState } from "react"
// import { useLocation, useNavigate, useParams } from "react-router-dom"
// import nookies from "nookies"

// import { UTILITIES_AIRCOMPRESSOR_FORM_DATA } from "@/utils/data"

// import UtilitiesAirCompressorHorizontalLabelForm from "@/components/forms/Utilities_Forms/UtilitiesAirCompressorHorizontalLabelForm"
// import UtilityHeader from "@/components/UtilityHeader"
// import UtilitiesDynamicForm from "@/components/forms/Utilities_Forms/UtilitiesDynamicForm"
// import ConfigurableFormSection from "@/components/forms/ConfigurableFormSection"
// import api from "@/api/axiosInstance"
// import { toast } from "react-toastify"
// interface IManageAirCompressorProps {
//   user: IUser | null
// }

// const ManageConfigurationAirCompressor: React.FunctionComponent<
//   IManageAirCompressorProps
// > = ({ user }) => {
//   const { plantName } = useParams<{ plantName?: string }>()
//   const location = useLocation()
//   const navigate = useNavigate()
//   const query = useQuery()
//   const token = nookies.get(null).accessToken || ""

//   const id = query.get("id")

//   const [loading, setLoading] = useState(false)
//   const [updateDataById, setUpdateDataById] = useState<any[]>([])
//   const [airCompressorLevels, setAirCompressorLevels] = useState<any[]>([])
//   const [data, setData] = useState<number | null>(null)
//   const [validfrom, setValidFrom] = useState<string | null>(null)
//   const [validto, setValidTo] = useState<string | null>(null)
//   const [airCompressorItem, setAirCompressorItem] = useState()
//   const [showForm, setShowForm] = useState(false)

//   const rmInitialDefaultData = initialFormikValues(
//     UTILITIES_AIRCOMPRESSOR_FORM_DATA,
//   )
//   const rmFormValidationSchemaData = formValidationSchema(
//     UTILITIES_AIRCOMPRESSOR_FORM_DATA,
//   )

//   const initialDefaultValueData = initialFormikValues(
//     UTILITIES_AIRCOMPRESSOR_FORM_DATA,
//   )

//   const validationSchema = formValidationSchema(
//     UTILITIES_AIRCOMPRESSOR_FORM_DATA,
//     [
//       {
//         key: "AirCompressorLevelItem",
//         variables: UTILITIES_AIRCOMPRESSOR_FORM_DATA,
//       },
//     ],
//   )
//   const rmDefaultData = airCompressorLevels || []

//   const handleCancelForm = () => {
//     navigate(`/utilities/air-compressor`)
//     console.log(rmDefaultData)
//   }

//   const handleSubmitForm = async (
//     values: FormikValues,
//     actions: FormikValues,
//   ) => {
//     setLoading(true)

//     const firstFormBlock = {
//       // plantId: parseInt(values.plantId) || 10023,
//       plantId: parseInt(values.plantId),
//       lineId: parseInt(values.lineId),

//       airCompName: values.airCompName,
//       airCompIP: values.airCompIP,
//       oilType: values.oilType,
//       commPrtcl: values.commPrtcl,
//       manufacturerName: values.manufacturerName,
//       modelNumber: values.modelNumber,
//       serialNumber: values.serialNumber,
//       manufactureYear: values.manufactureYear,
//       compType: values.compType,
//       commIdorSlaveId: parseInt(values.commIdorSlaveId),
//       dispOrCapacity: parseFloat(values.dispOrCapacity),
//       maxWorkingPresRange: parseFloat(values.maxWorkingPresRange),
//       minWorkingPresRange: parseFloat(values.minWorkingPresRange),
//       motorPower: parseFloat(values.motorPower),
//       theorizedVltg: parseFloat(values.theorizedVltg),
//       theorizedPhase: parseFloat(values.theorizedPhase),
//       theorizedFreq: parseFloat(values.theorizedFreq),
//       tankVolume: parseFloat(values.tankVolume),
//       rpmComp: parseFloat(values.rpmComp),
//       oilQty: parseFloat(values.oilQty),
//       // createdBy: user?.email || "system",
//       // modifiedBy: user?.email || "system",
//     }

//     const additionalBlocks =
//       values?.AirCompressorLevelItem?.map((item: any) => ({
//         // plantId: parseInt(item.plantId) || 10023,
//         plantId: parseInt(item.plantId),
//         lineId: parseInt(item.lineId),

//         airCompName: item.airCompName,
//         airCompIP: item.airCompIP,
//         oilType: item.oilType,
//         commPrtcl: item.commPrtcl,
//         manufacturerName: item.manufacturerName,
//         modelNumber: item.modelNumber,
//         serialNumber: item.serialNumber,
//         manufactureYear: item.manufactureYear,
//         compType: item.compType,
//         commIdorSlaveId: parseInt(item.commIdorSlaveId),
//         dispOrCapacity: parseFloat(item.dispOrCapacity),
//         maxWorkingPresRange: parseFloat(item.maxWorkingPresRange),
//         minWorkingPresRange: parseFloat(item.minWorkingPresRange),
//         motorPower: parseFloat(item.motorPower),
//         theorizedVltg: parseFloat(item.theorizedVltg),
//         theorizedPhase: parseFloat(item.theorizedPhase),
//         theorizedFreq: parseFloat(item.theorizedFreq),
//         tankVolume: parseFloat(item.tankVolume),
//         rpmComp: parseFloat(item.rpmComp),
//         oilQty: parseFloat(item.oilQty),
//         // createdBy: user?.email || "system",
//         // modifiedBy: user?.email || "system",
//       })) || []

//     const payload = [firstFormBlock, ...additionalBlocks]

//     try {
//       const response = await api.post("AirCompressor/AddAirComp", payload)
//       if (response.status === 200) {
//         toast.success("Air Compressor Added Successfully", {
//           autoClose: 1000, // 1 second
//         })

//         setTimeout(() => {
//           navigate(`/utilities/air-compressor`)
//         }, 1000)
//       }
//     } catch (error: any) {
//       const status = error?.response?.status

//       if (status === 401) return

//       toast.error("Something went wrong. Please try again.", {
//         autoClose: 1000, // 1 second
//       })
//     } finally {
//       setLoading(false)
//       actions.setSubmitting(false)
//     }
//   }

//   return (
//     <div>
//       <UtilityHeader
//         onUtilityChange={(utility) => console.log("Utility:", utility)}
//       />

//       <div className="w-full">
//         <div className="border rounded border-base-300">
//           <div className="bg-info rounded-t border-b border-base-300 font-bold px-4 py-1">
//             {`Air-Compressor Configuration`}
//           </div>

//           <div className="p-4 bg-neutral screen-height-media">
//             {loading && <Loading />}
//             {/* <UtilitiesAirCompressorHorizontalLabelForm */}
//             {/* <UtilitiesDynamicForm
//               formType="AirCompressor"
//               formVariables={UTILITIES_AIRCOMPRESSOR_FORM_DATA}
//               initialDefaultValueData={initialDefaultData}
//               rmFormVariables={UTILITIES_AIRCOMPRESSOR_FORM_DATA}
//               rmInitialDefaultValues={rmDefaultData}
//               formValidationSchemaData={formValidationSchemaData}
//               rmFormValidationSchemaData={formValidationSchemaData}
//               handleCancelForm={handleCancelForm}
//               handleSubmitForm={handleSubmitForm}
//             /> */}
//             <ConfigurableFormSection
//               sectionName="Air Compressor"
//               fieldName="AirCompressorLevelItem"
//               formVariables={UTILITIES_AIRCOMPRESSOR_FORM_DATA}
//               initialValues={{
//                 ...initialDefaultValueData,
//                 AreaLevelItem: rmDefaultData.length
//                   ? rmDefaultData.map((i) => ({ ...i, isCollapsed: false }))
//                   : [],
//               }}
//               validationSchema={validationSchema}
//               collapsedItemCount={2}
//               buttonLabel="ADD Air Compressor"
//               handleSubmitForm={handleSubmitForm}
//               handleCancelForm={handleCancelForm}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ManageConfigurationAirCompressor
