import Loading from "@/navigation/Loading"

import { useQuery } from "@/utils/dom"
import { formValidationSchema, initialFormikValues } from "@/utils/forms"
import { IUser } from "@/utils/types"

import { FormikValues } from "formik"
import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import api from "@/api/axiosInstance"
import ConfigurableFormSection from "@/components/forms/ConfigurableFormSection"
import UtilityHeader from "@/components/UtilityHeader"
import { UTILITIES_CHILLER_FORM_DATA } from "@/utils/data"
import { toast } from "react-toastify"
import PageHeaderWithSearchAndAdd from "@/navigation/PageHeaderWithSearchAndAdd"

interface IManageBoilerProps {
  user: IUser | null
}

const ManageConfigurationChiller: React.FunctionComponent<
  IManageBoilerProps
> = ({ user }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const query = useQuery()

  const id = query.get("id")

  const [loading, setLoading] = useState(false)
  const [updateDataById, setUpdateDataById] = useState<any[]>([])
  const [chillerLevels, setChillerLevels] = useState<any[]>([])
  const [data, setData] = useState<number | null>(null)
  const [validfrom, setValidFrom] = useState<string | null>(null)
  const [validto, setValidTo] = useState<string | null>(null)
  const [chillerItem, setChillerItem] = useState()
  const [showForm, setShowForm] = useState(false)

  const rmInitialDefaultData = initialFormikValues(UTILITIES_CHILLER_FORM_DATA)
  const rmFormValidationSchemaData = formValidationSchema(
    UTILITIES_CHILLER_FORM_DATA,
  )

  const initialDefaultValueData = initialFormikValues(
    UTILITIES_CHILLER_FORM_DATA,
  )

  const validationSchema = formValidationSchema(UTILITIES_CHILLER_FORM_DATA, [
    {
      key: "ChillerLevelItem",
      variables: UTILITIES_CHILLER_FORM_DATA,
    },
  ])

  const rmDefaultData = chillerLevels || []

  const handleCancelForm = () => {
    navigate(`/utilities/chiller`)
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

      chillerName: values.chillerName,
      chillerIP: values.chillerIP,
      commPrtcl: values.commPrtcl,
      manufacturerName: values.manufacturerName,
      modelNumber: values.modelNumber,
      serialNumber: values.serialNumber,
      refrigerantType: values.refrigerantType,
      compressorType: values.compressorType,
      commIdorSlaveId: parseInt(values.commIdorSlaveId),
      coolingCapacity: parseFloat(values.coolingCapacity),
      powerSupplyRequirementsVtg: parseFloat(values.powerSupplyRequirementsVtg),
      powerSupplyRequirementsPhase: parseFloat(
        values.powerSupplyRequirementsPhase,
      ),
      powerSupplyRequirementsFrq: parseFloat(values.powerSupplyRequirementsFrq),
      refrigerantQuantity: parseFloat(values.refrigerantQuantity),
      maxOperatingPressure: parseFloat(values.maxOperatingPressure),
      fullLoadAmps: parseFloat(values.fullLoadAmps),
      minCircuitAmpacity: parseFloat(values.minCircuitAmpacity),
      maxFuseSize: parseFloat(values.maxFuseSize),

      // createdBy: user?.email || "system",
      // modifiedBy: user?.email || "system",
    }

    const additionalBlocks =
      values?.ChillerLevelItem?.map((item: any) => ({
        // plantId: parseInt(item.plantId) || 10023,
        plantId: parseInt(item.plantId),
        lineId: parseInt(item.lineId),

        chillerName: item.chillerName,
        chillerIP: item.chillerIP,
        commPrtcl: item.commPrtcl,
        manufacturerName: item.manufacturerName,
        modelNumber: item.modelNumber,
        serialNumber: item.serialNumber,
        refrigerantType: item.refrigerantType,
        compressorType: item.compressorType,
        commIdorSlaveId: parseInt(item.commIdorSlaveId),
        coolingCapacity: parseFloat(item.coolingCapacity),
        powerSupplyRequirementsVtg: parseFloat(item.powerSupplyRequirementsVtg),
        powerSupplyRequirementsPhase: parseFloat(
          item.powerSupplyRequirementsPhase,
        ),
        powerSupplyRequirementsFrq: parseFloat(item.powerSupplyRequirementsFrq),
        refrigerantQuantity: parseFloat(item.refrigerantQuantity),
        maxOperatingPressure: parseFloat(item.maxOperatingPressure),
        fullLoadAmps: parseFloat(item.fullLoadAmps),
        minCircuitAmpacity: parseFloat(item.minCircuitAmpacity),
        maxFuseSize: parseFloat(item.maxFuseSize),
      })) || []

    const payload = [firstFormBlock, ...additionalBlocks]

    try {
      const response = await api.post("/Chillers/AddChillers", payload)
      if (response.status === 200) {
        toast.success("Chiller Added Successfully", {
          autoClose: 1000, // 1 second
        })

        setTimeout(() => {
          navigate(`/utilities/chiller`)
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
      {/* <UtilityHeader /> */}
      <UtilityHeader
        onUtilityChange={(utility) => console.log("Utility:", utility)}
      />

      <div className="w-full">
        <div className="border rounded border-base-300">
          
          <PageHeaderWithSearchAndAdd
          title={`Utilities Configuration`}
          />
          <div className=" screen-height-media">
            {loading && <Loading />}
            {/* <UtilitiesChillerHorizontalLabelForm
              formVariables={UTILITIES_CHILLER_FORM_DATA}
              initialDefaultValueData={initialDefaultData}
              rmFormVariables={UTILITIES_CHILLER_FORM_DATA}
              rmInitialDefaultValues={rmDefaultData}
              formValidationSchemaData={formValidationSchemaData}
              rmFormValidationSchemaData={formValidationSchemaData}
              handleCancelForm={handleCancelForm}
              handleSubmitForm={handleSubmitForm}
            /> */}
            <ConfigurableFormSection
              sectionName="Chiller"
              fieldName="ChillerLevelItem"
              formVariables={UTILITIES_CHILLER_FORM_DATA}
              initialValues={{
                ...initialDefaultValueData,
                AreaLevelItem: rmDefaultData.length
                  ? rmDefaultData.map((i) => ({ ...i, isCollapsed: false }))
                  : [],
              }}
              validationSchema={validationSchema}
              collapsedItemCount={2}
              buttonLabel="Add Chiller"
              handleSubmitForm={handleSubmitForm}
              handleCancelForm={handleCancelForm}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageConfigurationChiller




// import Loading from "@/navigation/Loading"

// import { useQuery } from "@/utils/dom"
// import { formValidationSchema, initialFormikValues } from "@/utils/forms"
// import { IUser } from "@/utils/types"

// import { FormikValues } from "formik"
// import { useState } from "react"
// import { useLocation, useNavigate } from "react-router-dom"

// import api from "@/api/axiosInstance"
// import ConfigurableFormSection from "@/components/forms/ConfigurableFormSection"
// import UtilityHeader from "@/components/UtilityHeader"
// import { UTILITIES_CHILLER_FORM_DATA } from "@/utils/data"
// import { toast } from "react-toastify"

// interface IManageBoilerProps {
//   user: IUser | null
// }

// const ManageConfigurationChiller: React.FunctionComponent<
//   IManageBoilerProps
// > = ({ user }) => {
//   const location = useLocation()
//   const navigate = useNavigate()
//   const query = useQuery()

//   const id = query.get("id")

//   const [loading, setLoading] = useState(false)
//   const [updateDataById, setUpdateDataById] = useState<any[]>([])
//   const [chillerLevels, setChillerLevels] = useState<any[]>([])
//   const [data, setData] = useState<number | null>(null)
//   const [validfrom, setValidFrom] = useState<string | null>(null)
//   const [validto, setValidTo] = useState<string | null>(null)
//   const [chillerItem, setChillerItem] = useState()
//   const [showForm, setShowForm] = useState(false)

//   const rmInitialDefaultData = initialFormikValues(UTILITIES_CHILLER_FORM_DATA)
//   const rmFormValidationSchemaData = formValidationSchema(
//     UTILITIES_CHILLER_FORM_DATA,
//   )

//   const initialDefaultValueData = initialFormikValues(
//     UTILITIES_CHILLER_FORM_DATA,
//   )

//   const validationSchema = formValidationSchema(UTILITIES_CHILLER_FORM_DATA, [
//     {
//       key: "ChillerLevelItem",
//       variables: UTILITIES_CHILLER_FORM_DATA,
//     },
//   ])

//   const rmDefaultData = chillerLevels || []

//   const handleCancelForm = () => {
//     navigate(`/utilities/chiller`)
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

//       chillerName: values.chillerName,
//       chillerIP: values.chillerIP,
//       commPrtcl: values.commPrtcl,
//       manufacturerName: values.manufacturerName,
//       modelNumber: values.modelNumber,
//       serialNumber: values.serialNumber,
//       refrigerantType: values.refrigerantType,
//       compressorType: values.compressorType,
//       commIdorSlaveId: parseInt(values.commIdorSlaveId),
//       coolingCapacity: parseFloat(values.coolingCapacity),
//       powerSupplyRequirementsVtg: parseFloat(values.powerSupplyRequirementsVtg),
//       powerSupplyRequirementsPhase: parseFloat(
//         values.powerSupplyRequirementsPhase,
//       ),
//       powerSupplyRequirementsFrq: parseFloat(values.powerSupplyRequirementsFrq),
//       refrigerantQuantity: parseFloat(values.refrigerantQuantity),
//       maxOperatingPressure: parseFloat(values.maxOperatingPressure),
//       fullLoadAmps: parseFloat(values.fullLoadAmps),
//       minCircuitAmpacity: parseFloat(values.minCircuitAmpacity),
//       maxFuseSize: parseFloat(values.maxFuseSize),

//       // createdBy: user?.email || "system",
//       // modifiedBy: user?.email || "system",
//     }

//     const additionalBlocks =
//       values?.ChillerLevelItem?.map((item: any) => ({
//         // plantId: parseInt(item.plantId) || 10023,
//         plantId: parseInt(item.plantId),
//         lineId: parseInt(item.lineId),

//         chillerName: item.chillerName,
//         chillerIP: item.chillerIP,
//         commPrtcl: item.commPrtcl,
//         manufacturerName: item.manufacturerName,
//         modelNumber: item.modelNumber,
//         serialNumber: item.serialNumber,
//         refrigerantType: item.refrigerantType,
//         compressorType: item.compressorType,
//         commIdorSlaveId: parseInt(item.commIdorSlaveId),
//         coolingCapacity: parseFloat(item.coolingCapacity),
//         powerSupplyRequirementsVtg: parseFloat(item.powerSupplyRequirementsVtg),
//         powerSupplyRequirementsPhase: parseFloat(
//           item.powerSupplyRequirementsPhase,
//         ),
//         powerSupplyRequirementsFrq: parseFloat(item.powerSupplyRequirementsFrq),
//         refrigerantQuantity: parseFloat(item.refrigerantQuantity),
//         maxOperatingPressure: parseFloat(item.maxOperatingPressure),
//         fullLoadAmps: parseFloat(item.fullLoadAmps),
//         minCircuitAmpacity: parseFloat(item.minCircuitAmpacity),
//         maxFuseSize: parseFloat(item.maxFuseSize),
//       })) || []

//     const payload = [firstFormBlock, ...additionalBlocks]

//     try {
//       const response = await api.post("/Chillers/AddChillers", payload)
//       if (response.status === 200) {
//         toast.success("Chiller Added Successfully", {
//           autoClose: 1000, // 1 second
//         })

//         setTimeout(() => {
//           navigate(`/utilities/chiller`)
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
//       <div className="bg-info rounded-md border-b border-base-300 font-bold px-3 py-1 mt-16 mr-2 -mb-14">
//         View Utilities
//       </div>
//       {/* <UtilityHeader /> */}
//       <UtilityHeader
//         onUtilityChange={(utility) => console.log("Utility:", utility)}
//       />

//       <div className="w-full">
//         <div className="border rounded border-base-300">
//           <div className="bg-info rounded-t border-b border-base-300 font-bold px-4 py-1 -ml-2 -mr-2">
//             {`Utilities Configuration`}
//           </div>

//           <div className="p-4 bg-neutral screen-height-media -ml-2 -mr-2">
//             {loading && <Loading />}
//             {/* <UtilitiesChillerHorizontalLabelForm
//               formVariables={UTILITIES_CHILLER_FORM_DATA}
//               initialDefaultValueData={initialDefaultData}
//               rmFormVariables={UTILITIES_CHILLER_FORM_DATA}
//               rmInitialDefaultValues={rmDefaultData}
//               formValidationSchemaData={formValidationSchemaData}
//               rmFormValidationSchemaData={formValidationSchemaData}
//               handleCancelForm={handleCancelForm}
//               handleSubmitForm={handleSubmitForm}
//             /> */}
//             <ConfigurableFormSection
//               sectionName="Chiller"
//               fieldName="ChillerLevelItem"
//               formVariables={UTILITIES_CHILLER_FORM_DATA}
//               initialValues={{
//                 ...initialDefaultValueData,
//                 AreaLevelItem: rmDefaultData.length
//                   ? rmDefaultData.map((i) => ({ ...i, isCollapsed: false }))
//                   : [],
//               }}
//               validationSchema={validationSchema}
//               collapsedItemCount={2}
//               buttonLabel="Add Chiller"
//               handleSubmitForm={handleSubmitForm}
//               handleCancelForm={handleCancelForm}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ManageConfigurationChiller
