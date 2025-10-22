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
import api from "@/api/axiosInstance"
import { UTILITIES_BOILER_FORM_DATA } from "@/utils/data"

import UtilityHeader from "@/components/UtilityHeader"
import ConfigurableFormSection from "@/components/forms/ConfigurableFormSection"
import { toast } from "react-toastify"
import PageHeaderWithSearchAndAdd from "@/navigation/PageHeaderWithSearchAndAdd"
interface IManageBoilerProps {
  user: IUser | null
}

const ManageConfigurationBoiler: React.FunctionComponent<
  IManageBoilerProps
> = ({ user }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const query = useQuery()
  const token = nookies.get(null).accessToken || ""

  const id = query.get("id")

  const [loading, setLoading] = useState(false)
  const [updateDataById, setUpdateDataById] = useState<any[]>([])
  const [boilerLevels, setBoilerLevels] = useState<any[]>([])
  const [data, setData] = useState<number | null>(null)
  const [validfrom, setValidFrom] = useState<string | null>(null)
  const [validto, setValidTo] = useState<string | null>(null)
  const [boilerItem, setBoilerItem] = useState()
  const [showForm, setShowForm] = useState(false)

  // const formValidationSchemaData = formValidationSchema(OPERATION_NEXUS_LINE_CONFIGURATION_FORM_DATA)
  const rmInitialDefaultData = initialFormikValues(UTILITIES_BOILER_FORM_DATA)

  const rmFormValidationSchemaData = formValidationSchema(
    UTILITIES_BOILER_FORM_DATA,
  )

  const initialDefaultValueData = initialFormikValues(
    UTILITIES_BOILER_FORM_DATA,
  )

  const validationSchema = formValidationSchema(UTILITIES_BOILER_FORM_DATA, [
    {
      key: "BoilerLevelItem",
      variables: UTILITIES_BOILER_FORM_DATA,
    },
  ])

  const rmDefaultData = boilerLevels || []

  const handleCancelForm = () => {
    navigate(`/utilities/boiler`)
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

      boilerName: values.boilerName,
      boilerIP: values.boilerIP,
      commPrtcl: values.commPrtcl,
      manufacturerName: values.manufacturerName,
      modelNumber: values.modelNumber,
      serialNumber: values.serialNumber,
      manufactureYear: values.manufactureYear,
      surfaceArea: values.surfaceArea,
      boilerHoresePower: values.boilerHoresePower,
      fuelType: values.fuelType,
      inputCapacity: values.inputCapacity,
      outputCapacity: values.outputCapacity,
      nationalBoardNo: values.nationalBoardNo,
      asmeCodeStamp: values.asmeCodeStamp,
      commIdorSlaveId: parseInt(values.commIdorSlaveId),
      maxAllowWorkPressure: parseFloat(values.maxAllowWorkPressure),
      temperature: parseFloat(values.temperature),
      pressure: parseFloat(values.pressure),

      // createdBy: user?.email || "system",
      // modifiedBy: user?.email || "system",
    }

    const additionalBlocks =
      values?.BoilerLevelItem?.map((item: any) => ({
        // plantId: parseInt(item.plantId) || 10023,
        plantId: parseInt(item.plantId),
        lineId: parseInt(item.lineId),

        boilerName: item.boilerName,
        boilerIP: item.boilerIP,
        commPrtcl: item.commPrtcl,
        manufacturerName: item.manufacturerName,
        modelNumber: item.modelNumber,
        serialNumber: item.serialNumber,
        manufactureYear: item.manufactureYear,
        surfaceArea: item.surfaceArea,
        boilerHoresePower: item.boilerHoresePower,
        fuelType: item.fuelType,
        inputCapacity: item.inputCapacity,
        outputCapacity: item.outputCapacity,
        nationalBoardNo: item.nationalBoardNo,
        asmeCodeStamp: item.asmeCodeStamp,
        commIdorSlaveId: parseInt(item.commIdorSlaveId),
        maxAllowWorkPressure: parseFloat(item.maxAllowWorkPressure),
        temperature: parseFloat(item.temperature),
        pressure: parseFloat(item.pressure),
        // createdBy: user?.email || "system",
        // modifiedBy: user?.email || "system",
      })) || []

    const payload = [firstFormBlock, ...additionalBlocks]

    try {
      const response = await api.post("/Boilers/AddBoilers", payload)
      if (response.status === 200) {
        toast.success("Boiler Added Successfully", {
          autoClose: 1000, // 1 second
        })

        setTimeout(() => {
          navigate(`/utilities/boiler`)
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
          title={`Boiler Configuration`}
          />
          <div className=" screen-height-media">
            {loading && <Loading />}

            <ConfigurableFormSection
              sectionName="Boiler"
              fieldName="BoilerLevelItem"
              formVariables={UTILITIES_BOILER_FORM_DATA}
              initialValues={{
                ...initialDefaultValueData,
                LevelItem: rmDefaultData.length
                  ? rmDefaultData.map((i) => ({ ...i, isCollapsed: false }))
                  : [],
              }}
              validationSchema={validationSchema}
              collapsedItemCount={2}
              buttonLabel="Add Boiler"
              handleSubmitForm={handleSubmitForm}
              handleCancelForm={handleCancelForm}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageConfigurationBoiler






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
// import api from "@/api/axiosInstance"
// import { UTILITIES_BOILER_FORM_DATA } from "@/utils/data"

// import UtilityHeader from "@/components/UtilityHeader"
// import ConfigurableFormSection from "@/components/forms/ConfigurableFormSection"
// import { toast } from "react-toastify"
// interface IManageBoilerProps {
//   user: IUser | null
// }

// const ManageConfigurationBoiler: React.FunctionComponent<
//   IManageBoilerProps
// > = ({ user }) => {
//   const location = useLocation()
//   const navigate = useNavigate()
//   const query = useQuery()
//   const token = nookies.get(null).accessToken || ""

//   const id = query.get("id")

//   const [loading, setLoading] = useState(false)
//   const [updateDataById, setUpdateDataById] = useState<any[]>([])
//   const [boilerLevels, setBoilerLevels] = useState<any[]>([])
//   const [data, setData] = useState<number | null>(null)
//   const [validfrom, setValidFrom] = useState<string | null>(null)
//   const [validto, setValidTo] = useState<string | null>(null)
//   const [boilerItem, setBoilerItem] = useState()
//   const [showForm, setShowForm] = useState(false)

//   // const formValidationSchemaData = formValidationSchema(OPERATION_NEXUS_LINE_CONFIGURATION_FORM_DATA)
//   const rmInitialDefaultData = initialFormikValues(UTILITIES_BOILER_FORM_DATA)

//   const rmFormValidationSchemaData = formValidationSchema(
//     UTILITIES_BOILER_FORM_DATA,
//   )

//   const initialDefaultValueData = initialFormikValues(
//     UTILITIES_BOILER_FORM_DATA,
//   )

//   const validationSchema = formValidationSchema(UTILITIES_BOILER_FORM_DATA, [
//     {
//       key: "BoilerLevelItem",
//       variables: UTILITIES_BOILER_FORM_DATA,
//     },
//   ])

//   const rmDefaultData = boilerLevels || []

//   const handleCancelForm = () => {
//     navigate(`/utilities/boiler`)
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

//       boilerName: values.boilerName,
//       boilerIP: values.boilerIP,
//       commPrtcl: values.commPrtcl,
//       manufacturerName: values.manufacturerName,
//       modelNumber: values.modelNumber,
//       serialNumber: values.serialNumber,
//       manufactureYear: values.manufactureYear,
//       surfaceArea: values.surfaceArea,
//       boilerHoresePower: values.boilerHoresePower,
//       fuelType: values.fuelType,
//       inputCapacity: values.inputCapacity,
//       outputCapacity: values.outputCapacity,
//       nationalBoardNo: values.nationalBoardNo,
//       asmeCodeStamp: values.asmeCodeStamp,
//       commIdorSlaveId: parseInt(values.commIdorSlaveId),
//       maxAllowWorkPressure: parseFloat(values.maxAllowWorkPressure),
//       temperature: parseFloat(values.temperature),
//       pressure: parseFloat(values.pressure),

//       // createdBy: user?.email || "system",
//       // modifiedBy: user?.email || "system",
//     }

//     const additionalBlocks =
//       values?.BoilerLevelItem?.map((item: any) => ({
//         // plantId: parseInt(item.plantId) || 10023,
//         plantId: parseInt(item.plantId),
//         lineId: parseInt(item.lineId),

//         boilerName: item.boilerName,
//         boilerIP: item.boilerIP,
//         commPrtcl: item.commPrtcl,
//         manufacturerName: item.manufacturerName,
//         modelNumber: item.modelNumber,
//         serialNumber: item.serialNumber,
//         manufactureYear: item.manufactureYear,
//         surfaceArea: item.surfaceArea,
//         boilerHoresePower: item.boilerHoresePower,
//         fuelType: item.fuelType,
//         inputCapacity: item.inputCapacity,
//         outputCapacity: item.outputCapacity,
//         nationalBoardNo: item.nationalBoardNo,
//         asmeCodeStamp: item.asmeCodeStamp,
//         commIdorSlaveId: parseInt(item.commIdorSlaveId),
//         maxAllowWorkPressure: parseFloat(item.maxAllowWorkPressure),
//         temperature: parseFloat(item.temperature),
//         pressure: parseFloat(item.pressure),
//         // createdBy: user?.email || "system",
//         // modifiedBy: user?.email || "system",
//       })) || []

//     const payload = [firstFormBlock, ...additionalBlocks]

//     try {
//       const response = await api.post("/Boilers/AddBoilers", payload)
//       if (response.status === 200) {
//         toast.success("Boiler Added Successfully", {
//           autoClose: 1000, // 1 second
//         })

//         setTimeout(() => {
//           navigate(`/utilities/boiler`)
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
//           <div className="bg-info rounded-t border-b border-base-300 font-bold px-4 py-1 ">
//             {`Boiler Configuration`}
//           </div>

//           <div className="p-4 bg-neutral screen-height-media">
//             {loading && <Loading />}

//             <ConfigurableFormSection
//               sectionName="Boiler"
//               fieldName="BoilerLevelItem"
//               formVariables={UTILITIES_BOILER_FORM_DATA}
//               initialValues={{
//                 ...initialDefaultValueData,
//                 LevelItem: rmDefaultData.length
//                   ? rmDefaultData.map((i) => ({ ...i, isCollapsed: false }))
//                   : [],
//               }}
//               validationSchema={validationSchema}
//               collapsedItemCount={2}
//               buttonLabel="Add Boiler"
//               handleSubmitForm={handleSubmitForm}
//               handleCancelForm={handleCancelForm}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ManageConfigurationBoiler
