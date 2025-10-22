import Loading from "@/navigation/Loading"
import { formatDateOnly } from "@/utils/convert"
import { EDGE_DEVICE_FORM_DATA } from "@/utils/data"
import { useQuery } from "@/utils/dom"
import { initialFormikValues, formValidationSchema } from "@/utils/forms"
import { IUser } from "@/utils/types"

import { FormikValues } from "formik"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import api from "@/api/axiosInstance"
import { toast } from "react-toastify"
import ConfigurableFormSection from "@/components/forms/ConfigurableFormSection"
import PageHeaderWithSearchAndAdd from "@/navigation/PageHeaderWithSearchAndAdd"

interface IManageEdgeDeviceConfigurationProps {
  user: IUser | null
}

const ManageEdgeDeviceConfiguration: React.FunctionComponent<
  IManageEdgeDeviceConfigurationProps
> = ({ user }) => {
  const navigate = useNavigate()
  const query = useQuery()

  const id = query.get("id")
  const [loading, setLoading] = useState(false)
  const [edgeDeviceLevels] = useState<any[]>([])
  const [updateDataById, setUpdateDataById] = useState<any[]>([])

  const initialDefaultValueData = initialFormikValues(EDGE_DEVICE_FORM_DATA)

  const validationSchema = formValidationSchema(EDGE_DEVICE_FORM_DATA, [
    {
      key: "EdgeLevelItem",
      variables: EDGE_DEVICE_FORM_DATA,
    },
  ])
  const rmDefaultData = edgeDeviceLevels || []

  const updateData: { [key: string]: any } = updateDataById[0]

  const formatDateTypeUpdate =
    updateData !== undefined
      ? updateData.ValidFrom && updateData.ValidTo
        ? {
            ValidFrom: formatDateOnly(updateData.ValidFrom),
            ValidTo: formatDateOnly(updateData.ValidTo),
          }
        : {}
      : {}

  const initialDefaultData =
    Object.assign({}, updateData, formatDateTypeUpdate) ||
    initialDefaultValueData

  const handleCancelForm = () => {
    navigate("/edge-devices")
  }

  const handleSubmitForm = async (
    values: FormikValues,
    actions: FormikValues,
  ) => {
    console.log("Original Form Values:", values)
    setLoading(true)
    console.log("Original Form Values:", values)
    console.log(
      "Selected assetId type:",
      typeof values.assetId,
      "value:",
      values.assetId,
    )

    const firstFormBlock = {
      plantId: parseInt(values.plantId),
      assetId: values.assetId,
      lineId: parseInt(values.lineId),

      edgeDeviceName: values.edgeDeviceName,
      edgeDeviceManf: values.edgeDeviceManf,
      edgeDeviceType: values.edgeDeviceType,
      edgeDeviceModelNo: values.edgeDeviceModelNo,
      edgeDeviceProtocol: values.edgeDeviceProtocol,
      edgeDeviceIPAddress: values.edgeDeviceIPAddress,

      // edgeDeviceSlaveId: values.edgeDeviceSlaveId,
      edgeDeviceSlaveId: parseInt(values.edgeDeviceSlaveId),
      edgeDeviceParity: values.edgeDeviceParity,
      // edgeDeviceStopBits: values.edgeDeviceStopBits,
      // edgeDeviceBaudRate: values.edgeDeviceBaudRate,
      edgeDeviceStopBits: parseInt(values.edgeDeviceStopBits),
      edgeDeviceBaudRate: parseInt(values.edgeDeviceBaudRate),
    }
    const additionalBlocks =
      values?.EdgeLevelItem?.map((item: any) => ({
        plantId: parseInt(item.plantId),
        assetId: item.assetId,
        lineId: parseInt(item.lineId),

        edgeDeviceName: item.edgeDeviceName,
        edgeDeviceManf: item.edgeDeviceManf,
        edgeDeviceType: item.edgeDeviceType,
        edgeDeviceModelNo: item.edgeDeviceModelNo,
        edgeDeviceProtocol: item.edgeDeviceProtocol,
        edgeDeviceIPAddress: item.edgeDeviceIPAddress,

        // edgeDeviceSlaveId: item.edgeDeviceSlaveId,
        edgeDeviceSlaveId: parseInt(item.edgeDeviceSlaveId),
        edgeDeviceParity: item.edgeDeviceParity,
        // edgeDeviceStopBits: item.edgeDeviceStopBits,
        // edgeDeviceBaudRate: item.edgeDeviceBaudRate,
        edgeDeviceStopBits: parseInt(item.edgeDeviceStopBits),
        edgeDeviceBaudRate: parseInt(item.edgeDeviceBaudRate),
      })) || []

    //  Create clean payload by extracting only needed fields
    const payload = [firstFormBlock, ...additionalBlocks]
    console.log("Submitting payload:", payload)

    try {
      const response = await api.post(`/EdgeDevice/AddEdgeDevice`, payload)

      if (response.status === 200) {
        toast.success("EdgeDevice Added Successfully", {
          autoClose: 1000, // 1 second
        })

        setTimeout(() => {
          navigate("/edge-devices")
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
    <div className="w-full">
      <div className="border rounded border-base-300">    
        <PageHeaderWithSearchAndAdd
          title={id ? `Edit Edge Device (${id})` : `Create Edge Device`
          }
        />
        <div className="screen-height-media">
          {loading && <Loading />}

          <ConfigurableFormSection
            sectionName="Edge Device"
            fieldName="EdgeLevelItem"
            formVariables={EDGE_DEVICE_FORM_DATA}
            initialValues={{
              ...initialDefaultData,
              LevelItem: rmDefaultData.length
                ? rmDefaultData.map((i) => ({ ...i, isCollapsed: false }))
                : [],
            }}
            validationSchema={validationSchema}
            collapsedItemCount={2}
            buttonLabel="Add Edge Device"
            handleSubmitForm={handleSubmitForm}
            handleCancelForm={handleCancelForm}
          />
        </div>
      </div>
    </div>
  )
}

export default ManageEdgeDeviceConfiguration




// import Loading from "@/navigation/Loading"
// import { formatDateOnly } from "@/utils/convert"
// import { EDGE_DEVICE_FORM_DATA } from "@/utils/data"
// import { useQuery } from "@/utils/dom"
// import { initialFormikValues, formValidationSchema } from "@/utils/forms"
// import { IUser } from "@/utils/types"

// import { FormikValues } from "formik"
// import { useEffect, useState } from "react"
// import { useNavigate } from "react-router-dom"

// import api from "@/api/axiosInstance"
// import { toast } from "react-toastify"
// import ConfigurableFormSection from "@/components/forms/ConfigurableFormSection"

// interface IManageEdgeDeviceConfigurationProps {
//   user: IUser | null
// }

// const ManageEdgeDeviceConfiguration: React.FunctionComponent<
//   IManageEdgeDeviceConfigurationProps
// > = ({ user }) => {
//   const navigate = useNavigate()
//   const query = useQuery()

//   const id = query.get("id")
//   const [loading, setLoading] = useState(false)
//   const [edgeDeviceLevels] = useState<any[]>([])
//   const [updateDataById, setUpdateDataById] = useState<any[]>([])

//   const initialDefaultValueData = initialFormikValues(EDGE_DEVICE_FORM_DATA)

//   const validationSchema = formValidationSchema(EDGE_DEVICE_FORM_DATA, [
//     {
//       key: "EdgeLevelItem",
//       variables: EDGE_DEVICE_FORM_DATA,
//     },
//   ])
//   const rmDefaultData = edgeDeviceLevels || []

//   const updateData: { [key: string]: any } = updateDataById[0]

//   const formatDateTypeUpdate =
//     updateData !== undefined
//       ? updateData.ValidFrom && updateData.ValidTo
//         ? {
//             ValidFrom: formatDateOnly(updateData.ValidFrom),
//             ValidTo: formatDateOnly(updateData.ValidTo),
//           }
//         : {}
//       : {}

//   const initialDefaultData =
//     Object.assign({}, updateData, formatDateTypeUpdate) ||
//     initialDefaultValueData

//   const handleCancelForm = () => {
//     navigate("/edge-devices")
//   }

//   const handleSubmitForm = async (
//     values: FormikValues,
//     actions: FormikValues,
//   ) => {
//     console.log("Original Form Values:", values)
//     setLoading(true)
//     console.log("Original Form Values:", values)
//     console.log(
//       "Selected assetId type:",
//       typeof values.assetId,
//       "value:",
//       values.assetId,
//     )

//     const firstFormBlock = {
//       plantId: parseInt(values.plantId),
//       assetId: values.assetId,
//       lineId: parseInt(values.lineId),

//       edgeDeviceName: values.edgeDeviceName,
//       edgeDeviceManf: values.edgeDeviceManf,
//       edgeDeviceType: values.edgeDeviceType,
//       edgeDeviceModelNo: values.edgeDeviceModelNo,
//       edgeDeviceProtocol: values.edgeDeviceProtocol,
//       edgeDeviceIPAddress: values.edgeDeviceIPAddress,

//       // edgeDeviceSlaveId: values.edgeDeviceSlaveId,
//       edgeDeviceSlaveId: parseInt(values.edgeDeviceSlaveId),
//       edgeDeviceParity: values.edgeDeviceParity,
//       // edgeDeviceStopBits: values.edgeDeviceStopBits,
//       // edgeDeviceBaudRate: values.edgeDeviceBaudRate,
//       edgeDeviceStopBits: parseInt(values.edgeDeviceStopBits),
//       edgeDeviceBaudRate: parseInt(values.edgeDeviceBaudRate),
//     }
//     const additionalBlocks =
//       values?.EdgeLevelItem?.map((item: any) => ({
//         plantId: parseInt(item.plantId),
//         assetId: item.assetId,
//         lineId: parseInt(item.lineId),

//         edgeDeviceName: item.edgeDeviceName,
//         edgeDeviceManf: item.edgeDeviceManf,
//         edgeDeviceType: item.edgeDeviceType,
//         edgeDeviceModelNo: item.edgeDeviceModelNo,
//         edgeDeviceProtocol: item.edgeDeviceProtocol,
//         edgeDeviceIPAddress: item.edgeDeviceIPAddress,

//         // edgeDeviceSlaveId: item.edgeDeviceSlaveId,
//         edgeDeviceSlaveId: parseInt(item.edgeDeviceSlaveId),
//         edgeDeviceParity: item.edgeDeviceParity,
//         // edgeDeviceStopBits: item.edgeDeviceStopBits,
//         // edgeDeviceBaudRate: item.edgeDeviceBaudRate,
//         edgeDeviceStopBits: parseInt(item.edgeDeviceStopBits),
//         edgeDeviceBaudRate: parseInt(item.edgeDeviceBaudRate),
//       })) || []

//     //  Create clean payload by extracting only needed fields
//     const payload = [firstFormBlock, ...additionalBlocks]
//     console.log("Submitting payload:", payload)

//     try {
//       const response = await api.post(`/EdgeDevice/AddEdgeDevice`, payload)

//       if (response.status === 200) {
//         toast.success("EdgeDevice Added Successfully", {
//           autoClose: 1000, // 1 second
//         })

//         setTimeout(() => {
//           navigate("/edge-devices")
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
//     <div className="w-full">
//       <div className="border rounded border-base-300">
//         <div className="bg-info rounded-t border-b border-base-300 font-bold px-4 py-1 mt-16">
//           {id ? `Edit Edge Device (${id})` : `Create Edge Device`}
//         </div>
//         <div className="p-4 bg-neutral screen-height-media">
//           {loading && <Loading />}

//           <ConfigurableFormSection
//             sectionName="Edge Device"
//             fieldName="EdgeLevelItem"
//             formVariables={EDGE_DEVICE_FORM_DATA}
//             initialValues={{
//               ...initialDefaultData,
//               LevelItem: rmDefaultData.length
//                 ? rmDefaultData.map((i) => ({ ...i, isCollapsed: false }))
//                 : [],
//             }}
//             validationSchema={validationSchema}
//             collapsedItemCount={2}
//             buttonLabel="Add Edge Device"
//             handleSubmitForm={handleSubmitForm}
//             handleCancelForm={handleCancelForm}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ManageEdgeDeviceConfiguration
