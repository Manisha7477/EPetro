import Loading from "@/navigation/Loading"
import { formatDateOnly } from "@/utils/convert"
import { LINE_FORM_DATA } from "@/utils/data"
import { useQuery } from "@/utils/dom"
import { initialFormikValues, formValidationSchema } from "@/utils/forms"
import { IUser } from "@/utils/types"

import { FormikValues } from "formik"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import api from "@/api/axiosInstance"
import { toast } from "react-toastify"
import ConfigurableFormSection from "@/components/forms/ConfigurableFormSection"
import PageHeaderWithSearchAndAdd from "@/navigation/PageHeaderWithSearchAndAdd"

interface IManageConfigurationProps {
  user: IUser | null
}

const ManageLineConfiguration: React.FunctionComponent<
  IManageConfigurationProps
> = ({ user }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const query = useQuery()

  const [loading, setLoading] = useState(false)

  const [lineLevels] = useState<any[]>([])
  // const [data, setData] = useState<number | null>(null)
  // const [validfrom, setValidFrom] = useState<string | null>(null)
  // const [validto, setValidTo] = useState<string | null>(null)
  // const [lineItem, setLineItem] = useState()
  // const [showForm, setShowForm] = useState(false)

  const rmInitialDefaultData = initialFormikValues(LINE_FORM_DATA)
  const rmFormValidationSchemaData = formValidationSchema(LINE_FORM_DATA)

  const initialDefaultValueData = initialFormikValues(LINE_FORM_DATA)

  const validationSchema = formValidationSchema(LINE_FORM_DATA, [
    {
      key: "LineLevelItem",
      variables: LINE_FORM_DATA,
    },
  ])
  const rmDefaultData = lineLevels || []

  const handleCancelForm = () => {
    navigate("/line")
    console.log(rmDefaultData)
  }

  const handleSubmitForm = async (
    values: FormikValues,
    actions: FormikValues,
  ) => {
    setLoading(true)

    const firstFormBlock = {
      plantId: parseInt(values.plantId),
      plantStatusId: parseInt(values.plantStatus),
      lineName: values.lineName,
      siteId: parseInt(values.siteId),
      areaAffiliation: parseInt(values.areaAffId),
      description: values.description,
      lineType: values.lineType,
      theoPowerCon: parseFloat(values.theoPowerCon),
      actualPowerCon: parseFloat(values.actualPowerCon),
      currentRating: parseFloat(values.currentRating),
      capacity: parseFloat(values.capacity),
      electricalSupply: parseFloat(values.electricalSupply),
      highVtgRating: parseFloat(values.highVtgRating),
      lowVtgRating: parseFloat(values.lowVtgRating),
      totalEquipments: parseInt(values.totalEquipments),
      theorizedLineEngEff: parseFloat(values.theorizedLineEngEff),
      // area_affiliation: values.areaName,
      peakLoad: parseFloat(values.peakLoad),
      // createdBy: user?.email || "system",
      // modifiedBy: user?.email || "system",
    }

    const additionalBlocks =
      values?.LineLevelItem?.map((item: any) => ({
        plantId: parseInt(item.plantId),
        plantStatusId: parseInt(item.plantStatus),
        lineName: item.lineName,
        siteId: parseInt(item.siteId),
        areaAffiliation: parseInt(item.areaAffId),
        description: item.description,
        lineType: item.lineType,
        theoPowerCon: parseFloat(item.theoPowerCon),
        actualPowerCon: parseFloat(item.actualPowerCon),
        currentRating: parseFloat(item.currentRating),
        capacity: parseFloat(item.capacity),
        electricalSupply: parseFloat(item.electricalSupply),
        highVtgRating: parseFloat(item.highVtgRating),
        lowVtgRating: parseFloat(item.lowVtgRating),
        totalEquipments: parseInt(item.totalEquipments),
        theorizedLineEngEff: parseFloat(item.theorizedLineEngEff),

        peakLoad: parseFloat(item.peakLoad),
        // createdBy: user?.email || "system",
        // modifiedBy: user?.email || "system",
      })) || []

    const payload = [firstFormBlock, ...additionalBlocks]

    try {
      const response = await api.post("/Line/AddLine", payload)
      if (response.status === 200) {
        toast.success("Line Added Successfully", {
          autoClose: 1000, // 1 second
        })

        setTimeout(() => {
          navigate("/line")
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
      <div className="border rounded border-base-300 ">
        
        <PageHeaderWithSearchAndAdd
          title={`Line Configuration`}
        />
        <div className="screen-height-media">
          {loading && <Loading />}

          <ConfigurableFormSection
            sectionName="Line"
            fieldName="LineLevelItem"
            formVariables={LINE_FORM_DATA}
            initialValues={{
              ...initialDefaultValueData,
              LevelItem: rmDefaultData.length
                ? rmDefaultData.map((i) => ({ ...i, isCollapsed: false }))
                : [],
            }}
            validationSchema={validationSchema}
            collapsedItemCount={2}
            buttonLabel="Add Line"
            handleSubmitForm={handleSubmitForm}
            handleCancelForm={handleCancelForm}
          />
        </div>
      </div>
    </div>
  )
}

export default ManageLineConfiguration








// import Loading from "@/navigation/Loading"
// import { formatDateOnly } from "@/utils/convert"
// import { LINE_FORM_DATA } from "@/utils/data"
// import { useQuery } from "@/utils/dom"
// import { initialFormikValues, formValidationSchema } from "@/utils/forms"
// import { IUser } from "@/utils/types"

// import { FormikValues } from "formik"
// import { useEffect, useState } from "react"
// import { useLocation, useNavigate } from "react-router-dom"

// import api from "@/api/axiosInstance"
// import { toast } from "react-toastify"
// import ConfigurableFormSection from "@/components/forms/ConfigurableFormSection"

// interface IManageConfigurationProps {
//   user: IUser | null
// }

// const ManageLineConfiguration: React.FunctionComponent<
//   IManageConfigurationProps
// > = ({ user }) => {
//   const location = useLocation()
//   const navigate = useNavigate()
//   const query = useQuery()

//   const [loading, setLoading] = useState(false)

//   const [lineLevels] = useState<any[]>([])
//   // const [data, setData] = useState<number | null>(null)
//   // const [validfrom, setValidFrom] = useState<string | null>(null)
//   // const [validto, setValidTo] = useState<string | null>(null)
//   // const [lineItem, setLineItem] = useState()
//   // const [showForm, setShowForm] = useState(false)

//   const rmInitialDefaultData = initialFormikValues(LINE_FORM_DATA)
//   const rmFormValidationSchemaData = formValidationSchema(LINE_FORM_DATA)

//   const initialDefaultValueData = initialFormikValues(LINE_FORM_DATA)

//   const validationSchema = formValidationSchema(LINE_FORM_DATA, [
//     {
//       key: "LineLevelItem",
//       variables: LINE_FORM_DATA,
//     },
//   ])
//   const rmDefaultData = lineLevels || []

//   const handleCancelForm = () => {
//     navigate("/line")
//     console.log(rmDefaultData)
//   }

//   const handleSubmitForm = async (
//     values: FormikValues,
//     actions: FormikValues,
//   ) => {
//     setLoading(true)

//     const firstFormBlock = {
//       plantId: parseInt(values.plantId),
//       plantStatusId: parseInt(values.plantStatus),
//       lineName: values.lineName,
//       siteId: parseInt(values.siteId),
//       areaAffiliation: parseInt(values.areaAffId),
//       description: values.description,
//       lineType: values.lineType,
//       theoPowerCon: parseFloat(values.theoPowerCon),
//       actualPowerCon: parseFloat(values.actualPowerCon),
//       currentRating: parseFloat(values.currentRating),
//       capacity: parseFloat(values.capacity),
//       electricalSupply: parseFloat(values.electricalSupply),
//       highVtgRating: parseFloat(values.highVtgRating),
//       lowVtgRating: parseFloat(values.lowVtgRating),
//       totalEquipments: parseInt(values.totalEquipments),
//       theorizedLineEngEff: parseFloat(values.theorizedLineEngEff),
//       // area_affiliation: values.areaName,
//       peakLoad: parseFloat(values.peakLoad),
//       // createdBy: user?.email || "system",
//       // modifiedBy: user?.email || "system",
//     }

//     const additionalBlocks =
//       values?.LineLevelItem?.map((item: any) => ({
//         plantId: parseInt(item.plantId),
//         plantStatusId: parseInt(item.plantStatus),
//         lineName: item.lineName,
//         siteId: parseInt(item.siteId),
//         areaAffiliation: parseInt(item.areaAffId),
//         description: item.description,
//         lineType: item.lineType,
//         theoPowerCon: parseFloat(item.theoPowerCon),
//         actualPowerCon: parseFloat(item.actualPowerCon),
//         currentRating: parseFloat(item.currentRating),
//         capacity: parseFloat(item.capacity),
//         electricalSupply: parseFloat(item.electricalSupply),
//         highVtgRating: parseFloat(item.highVtgRating),
//         lowVtgRating: parseFloat(item.lowVtgRating),
//         totalEquipments: parseInt(item.totalEquipments),
//         theorizedLineEngEff: parseFloat(item.theorizedLineEngEff),

//         peakLoad: parseFloat(item.peakLoad),
//         // createdBy: user?.email || "system",
//         // modifiedBy: user?.email || "system",
//       })) || []

//     const payload = [firstFormBlock, ...additionalBlocks]

//     try {
//       const response = await api.post("/Line/AddLine", payload)
//       if (response.status === 200) {
//         toast.success("Line Added Successfully", {
//           autoClose: 1000, // 1 second
//         })

//         setTimeout(() => {
//           navigate("/line")
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
//       <div className="border rounded border-base-300 ">
//         <div className="bg-info rounded-t border-b border-base-300 font-bold px-4 py-1 mt-16">
//           {/* {`Add Lines`} */}
//           {`Line Configuration`}
//         </div>
//         <div className="p-4 bg-neutral screen-height-media">
//           {loading && <Loading />}

//           <ConfigurableFormSection
//             sectionName="Line"
//             fieldName="LineLevelItem"
//             formVariables={LINE_FORM_DATA}
//             initialValues={{
//               ...initialDefaultValueData,
//               LevelItem: rmDefaultData.length
//                 ? rmDefaultData.map((i) => ({ ...i, isCollapsed: false }))
//                 : [],
//             }}
//             validationSchema={validationSchema}
//             collapsedItemCount={2}
//             buttonLabel="Add Line"
//             handleSubmitForm={handleSubmitForm}
//             handleCancelForm={handleCancelForm}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ManageLineConfiguration

// // const handleSubmitForm = async (
// //   values: FormikValues,
// //   actions: FormikValues,
// // ) => {
// //   console.log("Submitting Form Data:", values)
// //   setLoading(true)

// //   // Create separate payloads for each LineLevelItem
// //   const lineItemsPayload =
// //     values.LineLevelItem?.map((item: any) => {
// //       const { isCollapsed, ...lineDetails } = item

// //       return {
// //         plantName: values.PlantName,
// //         site: values.SiteName,
// //         lineName: values.LineName,
// //         description: values.Description,
// //         lineType: values.LineType,
// //         theoretical_energy_consumption: values.TheoreticalPowerConsumption,
// //         actual_power_consumption: values.ActualPowerConsumption,
// //         startTime: values.ValidFrom,
// //         endTime: values.ValidTo,
// //         currentRating: lineDetails.CurrentRating,
// //         capacity: lineDetails.Capacity,
// //         electrical_supply: lineDetails.ElectricalSupply,
// //         voltage_rating_high: lineDetails.VoltageRatingHigh,
// //         voltage_rating_low: lineDetails.VoltageRatingLow,
// //         total_Equipements: lineDetails.TotalEquipements,
// //         theorized_line_energy_efficiency:
// //           lineDetails.TheorizedLineEnergyEfficiency,
// //         area_affiliation: lineDetails.AreaAffiliation,
// //         theorized_peak_load: lineDetails.TheorizedPeakLoad,

// //         // CreatedBy: user?.email,
// //         // CreatedDate: new Date().toISOString(),
// //         // ModifiedBy: user?.email,
// //         // ModifiedDate: new Date().toISOString(),
// //         // IsDeleted: false,
// //       }
// //     }) || []
// //   console.log("Token before POST:", token)
// //   try {
// //     await axios.post(`/lineItem`, lineItemsPayload)
// //     navigate("/line")
// //   } catch (error: any) {
// //     console.error(
// //       "Save details:",
// //       error.response?.status,
// //       error.response?.data,
// //     )
// //   } finally {
// //     setLoading(false)
// //     actions.setSubmitting(false)
// //   }
// // }

// // --------------------------------------
// //   const handleSubmitForm = async (
// //     values: FormikValues,
// //     actions: FormikValues,
// //   ) => {
// //     setLoading(true)

// //     const lineLevelData =  OPERATION_NEXUS_LINE_CONFIGURATION_FORM_DATA

// //     const payload = {
// //       LineItem: [
// //         {
// //           ...values,
// //          LineLevelItem: values.LineLevelItem.map((item: any) => {
// //         const { isCollapsed, ...cleanItem } = item;
// //         return cleanItem;
// // }),
// //           AlternateLineId: values.AlternateLineId,
// //           lId: values.MaterialNumber,
// //           CreatedBy: user?.email,
// //           CreatedDate: new Date().toISOString(),
// //           ModifiedBy: user?.email,
// //           ModifiedDate: new Date().toISOString(),
// //           IsDeleted: false,

// //           ItemId: lineItem,
// //         },
// //       ],
// //     }

// //     try {
// //       if (lineItem) {
// //         await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/LineItem`, payload, {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //         })
// //         navigate("/line")
// //       } else {
// //         await axios.post(
// //           `${process.env.NEXT_PUBLIC_API_URL}/Line`,
// //           payload,
// //           {
// //             headers: {
// //               Authorization: `Bearer ${token}`,
// //             },
// //           },
// //         )
// //         navigate("/line")
// //       }
// //     } catch (error) {
// //       console.log(error)
// //     } finally {
// //       setLoading(false)
// //       actions.setSubmitting(false)
// //     }
// //   }

// //   const { clearDependents } = useDependentStore()
// //     const navigate = useNavigate()
// //     const query = useQuery()
// //     const id = query.get("id")

// //     const [loading, setLoading] = useState(false)
// //     const [updateDataById, setUpdateDataById] = useState([])

// //     const initialDefaultValueData = initialFormikValues(OPERATION_NEXUS_LINE_CONFIGURATION_FORM_DATA)
// //     const formValidationSchemaData = formValidationSchema(
// //       OPERATION_NEXUS_LINE_CONFIGURATION_FORM_DATA,
// //     )

// //     const filteredFormData = OPERATION_NEXUS_LINE_CONFIGURATION_FORM_DATA.filter((field) => {
// //       return id ? field.showInUpdate !== false : true
// //     })

// //     const fetchAPI = (updateId: string) => {
// //     setLoading(true)
// //     axios
// //       .get(
// //         `${process.env.NEXT_PUBLIC_API_URL}/UserMapping?UserId=${updateId}`,
// //         {
// //           headers: {
// //             Authorization: `Bearer ${line?.accessToken}`,
// //           },
// //         },
// //       )
// //       .then((res) => {
// //         if (res.data.Data) {
// //           setUpdateDataById(res.data.Data)
// //           console.log(res.data.Data)
// //         }
// //       })
// //       .catch((error) => console.log(error))
// //       .finally(() => {
// //         setLoading(false)
// //       })
// //   }

// //   useEffect(() => {
// //     if (id) {
// //       fetchAPI(id)
// //     }
// //   }, [id])

// //   const updateData: { [key: string]: any } = updateDataById[0]

// //   const formatDateTypeUpdate =
// //     updateData !== undefined
// //       ? updateData.ValidFrom && updateData.ValidTo
// //         ? {
// //             ValidFrom: formatDateOnly(updateData.ValidFrom),
// //             ValidTo: formatDateOnly(updateData.ValidTo),
// //           }
// //         : {}
// //       : {}

// //   const initialDefaultData =
// //     Object.assign({}, updateData, formatDateTypeUpdate) ||
// //     initialDefaultValueData

// //       const handleCancel = () => {
// //     handleCancel()
// //   }

// //   const handleSubmitForm = (
// //     answerValues: FormikValues,
// //     actions: FormikValues,
// //   ) => {
// //     setLoading(true)
// //     const headers = {
// //       Authorization: `Bearer ${line?.accessToken}`, // Pass the token here
// //     }
// //     axios
// //       .put(
// //         `${process.env.NEXT_PUBLIC_API_URL}/EMS_LineDetails/PutUserMapping`,
// //         {
// //           UserMapping: [
// //             Object.assign({}, answerValues, {
// //               CreatedBy: line?.id,
// //             }),
// //           ],
// //         },
// //         { headers },
// //       )
// //       .then((_res) => {
// //         navigate("/user-mapping")
// //       })
// //       .catch((error) => console.log(error))
// //       .finally(() => {
// //         setLoading(false)
// //         actions.setSubmitting(false)
// //       })
// //   }

// //       return(
// //     <div className="w-full flex-col flex">

// //       <div className="rounded-md min-h-[90vh] px-6 py-2">
// //       <div className="bg-info rounded-md border-b border-base-300 font-bold px-4  mb-3 py-1">
// //       <h2 className="text-md">
// //         Line Configuration
// //         </h2>
// //        </div>
// //          <div className="bg-neutral screen-height-media w-full pl-5 ml-0 pr-9">
// //           {loading && <Loading />}
// //           <HorizontalLabelForm
// //                 formVariables={filteredFormData}
// //                 initialDefaultValueData={initialDefaultData}
// //                 formValidationSchemaData={formValidationSchemaData}
// //                 handleSubmitForm={handleSubmitForm}
// //                 handleCancelForm={handleCancel}
// //                 handleAddLines={handleSubmitForm}
// //                 showSaveCancelButtons={false}            />
// //         </div>

// //            <button

// //                   className="bg-teal-600  text-white py-1 px-6 mr-2  rounded-md hover:bg-teal-700 transition"
// //                 >
// //                 AddLine
// //                 </button>
// //        {/* <h1 className='text-md font-bold'>Add Line</h1> */}
// // {/* <div className='relative border p-2 border-black mb-3'>

// // <button
// //                   onClick={AddUtlityClicked}
// //                   className="bg-teal-600  text-white py-1 px-6 rounded-md hover:bg-teal-700 transition"
// //                 >
// //                 Add Lines
// //                 </button>
// //        </div> */}
// //        <button

// //                   className="bg-teal-600  text-white py-1 px-6 mr-2  rounded-md hover:bg-teal-700 transition"
// //                 >
// //                 Deploy
// //                 </button>
// //        </div>
// //        </div>
// //     )

// // import HorizontalLabelForm from '@/components/forms/HorizontalLabelForm';
// // import Loading from '@/navigation/Loading';
// // import useDependentStore from '@/store/dependents';
// // import { formatDateOnly } from '@/utils/convert';
// // import { OPERATION_NEXUS_LINE_CONFIGURATION_FORM_DATA } from '@/utils/data';
// // import { useQuery } from '@/utils/dom';
// // import { formValidationSchema, initialFormikValues } from '@/utils/forms';
// // import axios from 'axios';
// // import { FormikValues } from 'formik';
// // import React, { useEffect, useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { LineFormData } from './LineFrom';
// // import { toast } from 'react-toastify';
// // import user from '@/store/user';
// // import { IUser } from '@/utils/types';

// // interface LineFormDataProps {
// //   user:IUser |null

// // }

// // const ManageLineConfiguration:  React.FunctionComponent<
// // LineFormDataProps
// // >=({user})=>{

// // const navigate=useNavigate()
// //   const query=useQuery()
// //   const id=query.get("id")

// //   const [loading, setLoading] = useState(false)
// //   const [updateDataById, setUpdateDataById] = useState([])

// //     const filteredFormData =OPERATION_NEXUS_LINE_CONFIGURATION_FORM_DATA.filter((field) => {
// //       return id ? field.showInUpdate !== false : true
// //     })

// //   const  initialDefaultValueData=initialFormikValues(OPERATION_NEXUS_LINE_CONFIGURATION_FORM_DATA)
// //   const formValidationSchemaData=formValidationSchema(OPERATION_NEXUS_LINE_CONFIGURATION_FORM_DATA)

// //     const fetchAPI = (updateId: string) => {
// //     setLoading(true)
// //     axios
// //       .get(`${process.env.NEXT_PUBLIC_API_URL}/EmsLine/${updateId}`, {
// //         headers: {
// //           Authorization: `Bearer ${user?.accessToken}`,
// //         },
// //       })
// //       .then((res) => {
// //         if (res.data.Data) {
// //           setUpdateDataById(res.data.Data)
// //         }
// //       })
// //       .catch((error) => console.log(error))
// //       .finally(() => {
// //         setLoading(false)
// //       })
// //   }
// //    useEffect(() => {
// //     if (id) {
// //       fetchAPI(id)
// //     }
// //   }, [id])

// // const updateData: { [key: string]: any } = updateDataById[0] || {}

// //  const formatDateTypeUpdate =
// //     updateData !== undefined
// //       ? updateData.ValidFrom && updateData.ValidTo
// //         ? {
// //             ValidFrom: formatDateOnly(updateData.ValidFrom),
// //             ValidTo: formatDateOnly(updateData.ValidTo),
// //           }
// //         : {}
// //       : {}

// //   // const initialDefaultData =
// //   //   Object.assign({}, updateData, formatDateTypeUpdate) ||
// //   //   initialDefaultValueData

// //   const initialDefaultData =
// //   Object.keys(updateData).length > 0
// //     ? { ...updateData, ...formatDateTypeUpdate }
// //     : initialDefaultValueData

// //   const handleCancelForm = () => {
// //     navigate("line")
// //   }
// //   const handleSubmitForm = async (
// //     answerValues: FormikValues,
// //     actions: FormikValues,
// //   ) => {
// //     setLoading(true)

// //     const headers = {
// //       Authorization: `Bearer ${user?.accessToken}`, // Pass the token here
// //     }

// //     id
// //       ? axios
// //           .put(
// //             `${process.env.NEXT_PUBLIC_API_URL}/EmsLine`,
// //             {
// //               EMSlines: [
// //                 Object.assign({}, answerValues, {
// //                   ModifiedBy: user?.email,
// //                 }),
// //               ],
// //             },
// //             { headers },
// //           )
// //           .then((_res) => {
// //             toast.success("Lines updated successfully!")
// //             navigate("/line")
// //           })
// //           .catch((error) => {
// //             toast.error("Error updating plant: " + error.message)
// //           })
// //           .finally(() => {
// //             setLoading(false)
// //             actions.setSubmitting(false)
// //           })
// //       : axios
// //           .post(
// //             `${process.env.NEXT_PUBLIC_API_URL}/EmsLine`,
// //             {
// //               EMSLines: [
// //                 Object.assign({}, answerValues, {
// //                   CreatedBy: user?.email,
// //                 }),
// //               ],
// //             },
// //             { headers },
// //           )
// //           .then((_res) => {
// //             toast.success("New lines added successfully!")
// //             navigate("/line")
// //           })
// //           .catch((error) => {
// //             toast.error("Error adding new plant: " + error.message)
// //           })
// //           .finally(() => {
// //             setLoading(false)
// //             actions.setSubmitting(false)
// //           })
// //   }

// //   return (

// //      <div className="w-full px-2">
// //       <div className="border rounded border-base-300">
// //         <div className="bg-info rounded-t border-b border-base-300 font-bold px-4 py-1 mt-16">
// //           {id ? `Production Order Update (${id})` : `Line Configuration`}
// //         </div>
// //         <div className="p-4 bg-neutral screen-height-media">
// //       <h2 className="text-lg font-bold mb-2">Add Lines</h2>

// //         <div className="p-4 bg-neutral screen-height-media">
// //           {loading && <Loading />}
// //           <HorizontalLabelForm
// //               formVariables={OPERATION_NEXUS_LINE_CONFIGURATION_FORM_DATA}
// //               initialDefaultValueData={initialDefaultData}
// //               formValidationSchemaData={formValidationSchemaData}
// //               handleCancelForm={handleCancelForm}
// //               handleSubmitForm={handleSubmitForm}
// //               //  handleAddLines={handleSubmitForm}
// //               showSaveCancelButtons={false}
// //                handleAddLines={undefined}          />
// //           </div>

// //         <div>
// //           <button

// //                   className="bg-teal-600  text-white py-1 px-6 mr-2  rounded-md hover:bg-teal-700 transition"
// //                 >
// //                 AddLine
// //                 </button>

// //         </div>

// //                   {/* <div className="p-4 bg-neutral screen-height-media">
// //           {loading && <Loading />}
// //           <HorizontalLabelForm
// //               formVariables={OPERATION_NEXUS_LINE_CONFIGURATION_FORM_DATA}
// //               initialDefaultValueData={initialDefaultData}
// //               formValidationSchemaData={formValidationSchemaData}
// //               handleCancelForm={handleCancelForm}
// //               handleSubmitForm={handleSubmitForm}
// //               //  handleAddLines={handleSubmitForm}
// //               showSaveCancelButtons={false}
// //                handleAddLines={undefined}          />
// //           </div> */}
// //         </div>

// //        <button className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700">
// //          Deploy
// //        </button>
// //       </div>
// //       </div>

// // );
// // }

// //
// //
// //
// //export default ManageLineConfiguration;

// // Add a new form
// // const handleAddLine = () => {
// //   setFormInstances((prev) => [
// //     ...prev,
// //     { id: Date.now(), data: initialDefaultData },
// //   ]);
// //   setAddLineClicked(true);
// // };

// //   const handleAddLine = () => {
// //   const lastForm = formInstances[formInstances.length - 1];

// //   const clonedData = { ...lastForm.data }; // Clone the last filled data

// //   setFormInstances((prev) => [
// //     ...prev,
// //     { id: Date.now(), data: clonedData },
// //   ]);

// //   setAddLineClicked(true);
// // };

// // const handleAddLine = () => {
// //   setFormInstances((prev) => {
// //     const lastIndex = prev.length - 1;
// //     const lastForm = prev[lastIndex];

// //     const clonedData = { ...lastForm.data };

// //     // Replace last form with blank and append new form with cloned data
// //     const updatedForms = [
// //       ...prev.slice(0, lastIndex),
// //       { ...lastForm, data: initialDefaultData }, // Reset the last form
// //       { id: Date.now(), data: clonedData },      // New form with cloned values
// //     ];

// //     return updatedForms;
// //   });

// //   setAddLineClicked(true);
// // };

// // import React, { useState } from 'react';
// // import HorizontalLabelForm from '@/components/forms/HorizontalLabelForm';
// // import Loading from '@/navigation/Loading';
// // import axios from 'axios';
// // import { toast } from 'react-toastify';
// // import { useNavigate } from 'react-router-dom';
// // import { FormikValues } from 'formik';
// // import user from '@/store/user';
// // import {
// //   OPERATION_NEXUS_LINE_CONFIGURATION_FORM_DATA,
// // } from '@/utils/data';
// // import {
// //   formValidationSchema,
// //   initialFormikValues,
// // } from '@/utils/forms';

// // const ManageLineConfiguration = () => {
// //   const navigate = useNavigate();

// //   // Initial Form State
// //   const initialDefaultData = initialFormikValues(OPERATION_NEXUS_LINE_CONFIGURATION_FORM_DATA);
// //   const validationSchema = formValidationSchema(OPERATION_NEXUS_LINE_CONFIGURATION_FORM_DATA);

// //   const [loading, setLoading] = useState(false);
// //   const [addLineClicked, setAddLineClicked] = useState(false);
// //   const [formInstances, setFormInstances] = useState([
// //     { id: Date.now(), data: initialDefaultData },
// //   ]);

// // const handleAddLine = () => {
// //   const lastForm = formInstances[formInstances.length - 1];
// //   const clonedData = { ...lastForm.data };

// //   setFormInstances((prev) => [
// //     ...prev,
// //     { id: Date.now(), data: clonedData },
// //   ]);
// // };

// // const handleDeploy = async () => {
// //   setLoading(true);
// //   try {
// //     const filledForms = formInstances
// //       .map((f) => f.data)
// //       .filter((data) => isFormFilled(data));

// //     if (filledForms.length === 0) {
// //       toast.warn("No filled form data to deploy.");
// //       setLoading(false);
// //       return;
// //     }

// //     console.log("Deploying filled form data:", filledForms);

// //     await axios.post("/line/configuration", filledForms);

// //     toast.success("Filled forms deployed successfully!");
// //   } catch (err: any) {
// //     toast.error("Deploy failed: " + err.message);
// //   } finally {
// //     setLoading(false);
// //   }
// // };

// //   // Delete a specific form
// //   const handleDeleteLine = (formId: number) => {
// //     setFormInstances((prev) => prev.filter((form) => form.id !== formId));
// //   };

// //   // Handle cancel
// //   const handleCancelForm = () => navigate('/line');

// //   // Submit form (basic placeholder)
// //   const handleSubmitForm = async (values: FormikValues, actions: any) => {
// //     setLoading(true);
// //     try {
// //       // API call example
// //       console.log("Submitted:", values);
// //       toast.success("Form submitted successfully!");
// //     } catch (error: any) {
// //       toast.error("Submission failed: " + error.message);
// //     } finally {
// //       setLoading(false);
// //       actions.setSubmitting(false);
// //     }
// //   };

// //   return (
// //     <div className="w-full px-4 py-4">
// //       <div className="border rounded border-gray-300 shadow-md">
// //         <div className="bg-blue-100 font-bold text-lg px-4 py-2 rounded-t border-b border-gray-300">
// //           Line Configuration
// //         </div>

// //               {loading && <Loading />}
// //               <HorizontalLabelForm
// //                 formVariables={OPERATION_NEXUS_LINE_CONFIGURATION_FORM_DATA}
// //                 initialDefaultValueData={form.data}
// //                   onFormDataChange={(updatedData: any) => {
// //                       setFormInstances((prev) =>
// //                         prev.map((f) =>
// //                           f.id === form.id ? { ...f, data: updatedData } : f
// //                         )
// //                       );
// //                     }}
// //                 formValidationSchemaData={validationSchema}
// //                 handleCancelForm={handleCancelForm}
// //                 handleSubmitForm={handleSubmitForm}
// //                 showSaveCancelButtons={false}
// //                 // handleAddLines={undefined}

// //         <div className="p-4 bg-white"
// //           {formInstances.map((form, index) => (
// //             <div
// //               key={form.id}
// //               className="relative border rounded-md border-gray-300 p-4 mb-6 bg-gray-50  relative mb-12"
// //             >
// //               {/* Delete button on added forms only */}
// //              {index !== formInstances.length && (
// //        <div className="mt-4 text-right">
// //     <button
// //       onClick={() => handleDeleteLine(form.id)}
// //       className="bg-red-100 text-red-600 px-4 py-2 rounded shadow hover:bg-red-200 transition"
// //     >
// //       Delete
// //     </button>
// //   </div>
// //   </div>
// //     )}

// //           ))}

// //           <button
// //   onClick={handleAddLine}
// //   className="bg-teal-600 text-white py-2 px-6 rounded hover:bg-teal-700 transition"
// // >
// //   Add Line
// // </button>

// //         </div>

// //         <div className="px-4 pb-4">
// //           <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
// //           onClick={handleDeploy}
// //           >
// //             Deploy
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ManageLineConfiguration;

// // function isFormFilled(data: {}): unknown {
// //   throw new Error('Function not implemented.');
// // }

// //   onClick={handleAddLine}
// //   className="bg-teal-600 text-white py-1 px-6 rounded hover:bg-teal-700 transition"
// // >
// //   Add Line

// // </button>

// {
//   /* push(initialFormikValues(BOM_LEVEL_FORM_DATA)) */
// }

// {
//   /* {!hasAddedLine && (
//   <button
//     onClick={handleAddLine}
//     className="bg-teal-600 text-white py-1 px-6 rounded hover:bg-teal-700 transition"
//   >
//     Add Line
//   </button>
// )} */
// }

// // const ManageLineConfiguration: React.FC<LineFormDataProps> = ({ user }) => {
// //   const navigate = useNavigate();
// //   const query = useQuery();
// //   const id = query.get("id");

// //   const [loading, setLoading] = useState(false);
// //   const [updateDataById, setUpdateDataById] = useState<any[]>([]);
// //   const [formInstances, setFormInstances] = useState<any[]>([]); // <- key for dynamic forms

// //   const filteredFormData = OPERATION_NEXUS_LINE_CONFIGURATION_FORM_DATA.filter((field) =>
// //     id ? field.showInUpdate !== false : true
// //   );

// //   const initialDefaultValueData = initialFormikValues(OPERATION_NEXUS_LINE_CONFIGURATION_FORM_DATA);
// //   const formValidationSchemaData = formValidationSchema(OPERATION_NEXUS_LINE_CONFIGURATION_FORM_DATA);

// //   const fetchAPI = (updateId: string) => {
// //     setLoading(true);
// //     axios
// //       .get(`${process.env.NEXT_PUBLIC_API_URL}/EmsLine/${updateId}`, {
// //         headers: {
// //           Authorization: `Bearer ${user?.accessToken}`,
// //         },
// //       })
// //       .then((res) => {
// //         if (res.data.Data) {
// //           setUpdateDataById(res.data.Data);
// //         }
// //       })
// //       .catch((error) => console.log(error))
// //       .finally(() => setLoading(false));
// //   };

// //   useEffect(() => {
// //     if (id) {
// //       fetchAPI(id);
// //     }
// //   }, [id]);

// //   useEffect(() => {
// //     const updateData: { [key: string]: any } = updateDataById[0] || {};
// //     const formatDateTypeUpdate =
// //       updateData.ValidFrom && updateData.ValidTo
// //         ? {
// //             ValidFrom: formatDateOnly(updateData.ValidFrom),
// //             ValidTo: formatDateOnly(updateData.ValidTo),
// //           }
// //         : {};

// //     const initialDefaultData =
// //       Object.keys(updateData).length > 0
// //         ? { ...updateData, ...formatDateTypeUpdate }
// //         : initialDefaultValueData;

// //     setFormInstances([{ id: Date.now(), data: initialDefaultData }]);
// //   }, [updateDataById]);

// //   const handleCancelForm = () => navigate("/line");

// //   const handleSubmitForm = async (answerValues: FormikValues, actions: any) => {
// //     setLoading(true);
// //     const headers = {
// //       Authorization: `Bearer ${user?.accessToken}`,
// //     };

// //     const payload = {
// //       EMSLines: [
// //         Object.assign({}, answerValues, {
// //           [id ? "ModifiedBy" : "CreatedBy"]: user?.email,
// //         }),
// //       ],
// //     };

// //     const request = id
// //       ? axios.put(`${process.env.NEXT_PUBLIC_API_URL}/EmsLine`, payload, { headers })
// //       : axios.post(`${process.env.NEXT_PUBLIC_API_URL}/EmsLine`, payload, { headers });

// //     request
// //       .then(() => {
// //         toast.success(id ? "Lines updated successfully!" : "New lines added successfully!");
// //         navigate("/line");
// //       })
// //       .catch((error) => {
// //         toast.error(`Error ${id ? "updating" : "adding"} plant: ${error.message}`);
// //       })
// //       .finally(() => {
// //         setLoading(false);
// //         actions.setSubmitting(false);
// //       });
// //   };

// //   const handleAddLine = () => {
// //     setFormInstances([
// //       ...formInstances,
// //       { id: Date.now(), data: initialDefaultValueData },
// //     ]);
// //   };

// //   const handleDeleteLine = (instanceId: number) => {
// //     setFormInstances(formInstances.filter((form) => form.id !== instanceId));
// //   };

// //   return (
// //     <div className="w-full px-2">
// //       <div className="border rounded border-base-300">
// //         <div className="bg-info rounded-t border-b border-base-300 font-bold px-4 py-1 mt-16">
// //           {id ? `Production Order Update (${id})` : `Line Configuration`}
// //         </div>

// //         <div className="p-4 bg-neutral screen-height-media">
// //           <h2 className="text-lg font-bold mb-2">Add Lines</h2>

// //           {formInstances.map((form, index) => (
// //             <div
// //               key={form.id}
// //               className="relative border rounded-md border-gray-400 p-4 mb-6"
// //             >
// //               <button
// //                 onClick={() => handleDeleteLine(form.id)}
// //                 className="absolute top-1 right-1 text-red-600 hover:text-red-800"
// //               >
// //                 Delete
// //               </button>

// //               {loading && <Loading />}
// //               <HorizontalLabelForm
// //                 formVariables={filteredFormData}
// //                 initialDefaultValueData={form.data}
// //                 formValidationSchemaData={formValidationSchemaData}
// //                 handleCancelForm={handleCancelForm}
// //                 handleSubmitForm={handleSubmitForm}
// //                 showSaveCancelButtons={false}
// //                 handleAddLines={undefined}
// //               />
// //             </div>
// //           ))}

// //           <button
// //             onClick={handleAddLine}
// //             className="bg-teal-600 text-white py-1 px-6 mr-2 rounded-md hover:bg-teal-700 transition"
// //           >
// //             AddLine
// //           </button>
// //         </div>

// //         <button className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 ml-4 mb-4">
// //           Deploy
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// //     const [lineData, setLineData] = useState<LineFormData[]>([]);
// // const AddUtlityClicked=()=>{
// //     const modifiedLineData=lineData?.map(item=>({...item,expanded:false,tag:false}))
// //          setLineData([{
// //       id: Date.now(),
// //    plantName: "",
// //   Site: "",
// //   LineName: "",
// //   TheoriticalPowerConsumption: "",
// //   LineType: "",
// //   Description: "",
// //   ActualPowerConsumption: "",
// //   CurrentRating: "",
// //   Capacity: "",
// //   VoltageRating: "",
// //   ElectricalSupply: "",
// //   AreaAffliation: "",
// //   TotalEquipements: "",
// //   PeakLoad: "",
// //   expanded: true,
// //   tag: true
// //     }, ...modifiedLineData])
// //  }

// //     return(
// //     <div className="w-full flex-col flex">

// //       <div className="rounded-md min-h-[90vh] px-6 py-2">
// //       <div className="bg-info rounded-md border-b border-base-300 font-bold px-4  mb-3 py-1">
// //       <h2 className="text-md">
// //         Line Configuration
// //         </h2>
// //        </div>

// //        <h1 className='text-md font-bold'>Add Line</h1>
// // <div className='relative border p-2 border-black mb-3'>
// // <div className='rounded-lg max-h-[60vh] overflow-auto mb-5'>
// //      {lineData?.map((item) =>
// //       <LineForm key={item.id} lineData={item} setLineData={setLineData}/>
// //     )
// //      }
// // </div>
// // <button
// //                   onClick={AddUtlityClicked}
// //                   className="bg-teal-600  text-white py-1 px-6 rounded-md hover:bg-teal-700 transition"
// //                 >
// //                 Add Lines
// //                 </button>
// //        </div>
// //        <button

// //                   className="bg-teal-600  text-white py-1 px-6 mr-2  rounded-md hover:bg-teal-700 transition"
// //                 >
// //                 Deploy
// //                 </button>
// //        </div>
// //        </div>
// //     )

// // import React, { useState } from 'react';
// // import HorizontalLabelForm from '@/components/forms/HorizontalLabelForm';
// // import Loading from '@/navigation/Loading';
// // import axios from 'axios';
// // import { toast } from 'react-toastify';
// // import { useNavigate } from 'react-router-dom';
// // import { FormikValues } from 'formik';
// // import {
// //   OPERATION_NEXUS_LINE_CONFIGURATION_FORM_DATA,
// // } from '@/utils/data';
// // import {
// //   formValidationSchema,
// //   initialFormikValues,
// // } from '@/utils/forms';

// // const ManageLineConfiguration = () => {
// //   const navigate = useNavigate();

// //   const initialDefaultData = initialFormikValues(OPERATION_NEXUS_LINE_CONFIGURATION_FORM_DATA);
// //   const validationSchema = formValidationSchema(OPERATION_NEXUS_LINE_CONFIGURATION_FORM_DATA);

// //   const [loading, setLoading] = useState(false);
// //   const [formInstances, setFormInstances] = useState([
// //     { id: Date.now(), data: initialDefaultData },
// //   ]);

// //   // const handleAddLine = () => {
// //   //   const lastForm = formInstances[formInstances.length - 1];
// //   //   const clonedData = { ...lastForm.data };
// //   //   setFormInstances((prev) => [
// //   //     ...prev,
// //   //     { id: Date.now(), data: clonedData },
// //   //   ]);
// //   // };
// //   const handleAddLine = () => {
// //   let clonedData;

// //   if (formInstances.length === 0) {
// //     clonedData = initialFormikValues(OPERATION_NEXUS_LINE_CONFIGURATION_FORM_DATA);
// //   } else {
// //     const lastForm = formInstances[formInstances.length - 1];
// //     clonedData = { ...lastForm.data };
// //   }

// //   setFormInstances((prev) => [
// //     ...prev,
// //     { id: Date.now(), data: clonedData },
// //   ]);
// // };

// //   const handleDeploy = async () => {
// //     setLoading(true);
// //     try {
// //       const filledForms = formInstances
// //         .map((f) => f.data)
// //         .filter((data) => isFormFilled(data));

// //       if (filledForms.length === 0) {
// //         toast.warn("No filled form data to deploy.");
// //         setLoading(false);
// //         return;
// //       }

// //       await axios.post("/line/configuration", filledForms);
// //       toast.success("Filled forms deployed successfully!");
// //     } catch (err: any) {
// //       toast.error("Deploy failed: " + err.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleDeleteLine = (formId: number) => {
// //     setFormInstances((prev) => prev.filter((form) => form.id !== formId));
// //   };

// //   const handleCancelForm = () => navigate('/line');

// //   const handleSubmitForm = async (values: FormikValues, actions: any) => {
// //     setLoading(true);
// //     try {
// //       console.log("Submitted:", values);
// //       toast.success("Form submitted successfully!");
// //     } catch (error: any) {
// //       toast.error("Submission failed: " + error.message);
// //     } finally {
// //       setLoading(false);
// //       actions.setSubmitting(false);
// //     }
// //   };

// //   return (
// //     <div className="w-full px-4 py-4">
// //       <div className="border rounded border-gray-300 shadow-md">
// //        <div className="bg-blue-100 font-bold text-lg px-4 py-2 rounded-t border-b border-gray-300 border">
// //           Line Configuration
// //         </div>

// //           <div className="text-xl font-semibold text-gray-800 mb-4">New Line</div>
// //         <div className="p-4 bg-white">
// //           {formInstances.map((form, index) => (
// //             <div
// //               key={form.id}
// //               className="relative border rounded-md border-gray-300 p-4 mb-6 bg-gray-50"
// //             >
// //               {loading && <Loading />}
// //               <HorizontalLabelForm
// //                 formVariables={OPERATION_NEXUS_LINE_CONFIGURATION_FORM_DATA}
// //                 initialDefaultValueData={form.data}
// //                 onFormDataChange={(updatedData: any) => {
// //                   setFormInstances((prev) =>
// //                     prev.map((f) =>
// //                       f.id === form.id ? { ...f, data: updatedData } : f
// //                     )
// //                   );
// //                 }}
// //                 formValidationSchemaData={validationSchema}
// //                 handleCancelForm={handleCancelForm}
// //                 handleSubmitForm={handleSubmitForm}
// //                 showSaveCancelButtons={false}
// //               />
// //               {index !== formInstances.length  && (
// //                 <div className="mt-4 text-right">
// //                   <button
// //                     onClick={() => handleDeleteLine(form.id)}
// //                     className="bg-red-100 text-red-600 px-4 py-2 rounded shadow hover:bg-red-200 transition"
// //                   >
// //                     Delete
// //                   </button>
// //                 </div>
// //               )}
// //             </div>
// //           ))}

// //           <button
// //             onClick={handleAddLine}
// //             className="bg-teal-600 text-white py-2 px-6 rounded hover:bg-teal-700 transition"
// //           >
// //             Add Line
// //           </button>
// //         </div>

// //         <div className="px-4 pb-4">
// //           <button
// //             className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
// //             onClick={handleDeploy}
// //           >
// //             Deploy
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ManageLineConfiguration;

// // function isFormFilled(data: {}): boolean {
// //   // Replace this logic with real validation
// //   return Object.values(data).some((value) => value !== '');
// // }

// // import React, { useState } from 'react';
// // import HorizontalLabelForm from '@/components/forms/HorizontalLabelForm';
// // import Loading from '@/navigation/Loading';
// // import axios from 'axios';
// // import { toast } from 'react-toastify';
// // import { useNavigate } from 'react-router-dom';
// // import { FormikValues } from 'formik';
// // import {
// //   OPERATION_NEXUS_LINE_CONFIGURATION_FORM_DATA,
// // } from '@/utils/data';
// // import {
// //   formValidationSchema,
// //   initialFormikValues,
// // } from '@/utils/forms';

// // const ManageLineConfiguration = () => {
// //   const navigate = useNavigate();

// //   const initialDefaultData = initialFormikValues(OPERATION_NEXUS_LINE_CONFIGURATION_FORM_DATA);
// //   const validationSchema = formValidationSchema(OPERATION_NEXUS_LINE_CONFIGURATION_FORM_DATA);

// //   const [loading, setLoading] = useState(false);
// //   const [formInstances, setFormInstances] = useState([
// //     { id: Date.now(), data: initialDefaultData },
// //   ]);

// //   //  Adds a brand-new blank form each time
// //   const handleAddLine = () => {
// //     const newForm = {
// //       id: Date.now(),
// //       data: initialFormikValues(OPERATION_NEXUS_LINE_CONFIGURATION_FORM_DATA),
// //     };
// //     setFormInstances((prev) => [...prev, newForm]);
// //   };

// // const handleDeploy = async () => {
// //   setLoading(true);
// //   try {
// //     const filledForms = formInstances
// //       .map((f) => f.data)
// //       .filter((data) => isFormFilled(data));

// //     if (filledForms.length === 0) {
// //       toast.warn("No filled form data to deploy.");
// //       setLoading(false);
// //       return;
// //     }

// //     //  Send filled forms to backend
// //     await axios.post("/line/configuration", filledForms);

// //     toast.success("Filled forms deployed successfully!");

// //     //  Navigate to /line page after success
// //     navigate("/line");

// //   } catch (err: any) {
// //     toast.error("Deploy failed: " + err.message);
// //   } finally {
// //     setLoading(false);
// //   }
// // };

// //   const handleDeleteLine = (formId: number) => {
// //     setFormInstances((prev) => prev.filter((form) => form.id !== formId));
// //   };

// //   const handleCancelForm = () => navigate('/line');

// //   const handleSubmitForm = async (values: FormikValues, actions: any) => {
// //     setLoading(true);
// //     try {
// //       console.log("Submitted:", values);
// //       toast.success("Form submitted successfully!");
// //     } catch (error: any) {
// //       toast.error("Submission failed: " + error.message);
// //     } finally {
// //       setLoading(false);
// //       actions.setSubmitting(false);
// //     }
// //   };

// //   return (
// //     <div className="w-full px-4 py-4 pt-20">
// //       <div className="border rounded border-gray-300 shadow-md">
// //         {/*  Page Title */}
// //         <div className="bg-blue-400  text-2xl font-bold px-4 py-2">
// //           Line Configuration
// //           </div>

// //         <div className="p-4 bg-white">
// //           {formInstances.length === 0 && (
// //             <p className="text-gray-500 mb-4">No lines configured. Please add one.</p>
// //           )}

// //           {formInstances.map((form, index) => (
// //             <div
// //               key={form.id}
// //               className="relative border rounded-md border-gray-300 p-4 mb-6 bg-gray-50"
// //             >
// //               {/*  Line Title */}
// //               <div className="text-lg font-semibold text-gray-800 mb-4">
// //                 Line {index + 1}
// //               </div>

// //               {loading && <Loading />}

// //               <HorizontalLabelForm
// //                 formVariables={OPERATION_NEXUS_LINE_CONFIGURATION_FORM_DATA}
// //                 initialDefaultValueData={form.data}
// //                 onFormDataChange={(updatedData: any) => {
// //                   setFormInstances((prev) =>
// //                     prev.map((f) =>
// //                       f.id === form.id ? { ...f, data: updatedData } : f
// //                     )
// //                   );
// //                 }}
// //                 formValidationSchemaData={validationSchema}
// //                 handleCancelForm={handleCancelForm}
// //                 handleSubmitForm={handleSubmitForm}
// //                 showSaveCancelButtons={false}
// //               />
// //               {index > 0 && (
// //         <div className="mt-4 text-right">
// //         <button
// //           onClick={() => handleDeleteLine(form.id)}
// //           className="bg-red-100 text-red-600 px-4 py-2 rounded shadow hover:bg-red-200 transition"
// //         >
// //         Delete
// //       </button>
// //   </div>
// // )}
// //             </div>
// //           ))}

// //           <button
// //             onClick={handleAddLine}
// //             className="bg-teal-600 text-white py-2 px-6 rounded hover:bg-teal-700 transition"
// //           >
// //             Add Line
// //           </button>
// //         </div>

// //         <div className="px-4 pb-4">
// //           <button
// //             className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
// //             onClick={handleDeploy}
// //           >
// //             Deploy
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ManageLineConfiguration;

// // //  Basic filled-check for form validation before deploy
// // function isFormFilled(data: {}): boolean {
// //   return Object.values(data).some((value) => value !== '');
// // }
