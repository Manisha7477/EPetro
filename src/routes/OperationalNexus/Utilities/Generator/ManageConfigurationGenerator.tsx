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
import { UTILITIES_GENERATOR_FORM_DATA } from "@/utils/data"

import ConfigurableFormSection from "@/components/forms/ConfigurableFormSection"
import api from "@/api/axiosInstance"
import { toast } from "react-toastify"
import UtilityHeader from "@/components/UtilityHeader"
import PageHeaderWithSearchAndAdd from "@/navigation/PageHeaderWithSearchAndAdd"
interface IManageAddUtilitiesProps {
  user: IUser | null
}

const ManageConfigurationGenerator: React.FunctionComponent<
  IManageAddUtilitiesProps
> = ({ user }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const query = useQuery()
  const token = nookies.get(null).accessToken || ""

  const id = query.get("id")

  const [loading, setLoading] = useState(false)
  const [updateDataById, setUpdateDataById] = useState<any[]>([])
  const [lineLevels, setLineLevels] = useState<any[]>([])
  const [data, setData] = useState<number | null>(null)
  const [validfrom, setValidFrom] = useState<string | null>(null)
  const [validto, setValidTo] = useState<string | null>(null)
  const [lineItem, setLineItem] = useState()
  const [showForm, setShowForm] = useState(false)
  const rmInitialDefaultData = initialFormikValues(
    UTILITIES_GENERATOR_FORM_DATA,
  )
  const rmFormValidationSchemaData = formValidationSchema(
    UTILITIES_GENERATOR_FORM_DATA,
  )

  const initialDefaultValueData = initialFormikValues(
    UTILITIES_GENERATOR_FORM_DATA,
  )

  const validationSchema = formValidationSchema(UTILITIES_GENERATOR_FORM_DATA, [
    {
      key: "GeneratorLevelItem",
      variables: UTILITIES_GENERATOR_FORM_DATA,
    },
  ])

  const rmDefaultData = lineLevels || []

  const handleCancelForm = () => {
    navigate(`/utilities/generator`)
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
      generatorName: values.generatorName,
      generatorIP: values.generatorIP,
      fuelType: values.fuelType,
      commPrtcl: values.commPrtcl,
      manufacturerName: values.manufacturerName,
      modelNumber: values.modelNumber,
      serialNumber: values.serialNumber,
      manufactureYear: values.manufactureYear,
      dgEngModel: values.dgEngModel,
      dgEngSrNo: values.dgEngSrNo,
      dgEngPwrOut: values.dgEngPwrOut,
      dgRatedSpeed: values.dgRatedSpeed,
      dgFuelType: values.dgFuelType,
      dgNoOfCyl: values.dgNoOfCyl,
      dgDisplacement: values.dgDisplacement,
      dgAltModel: values.dgAltModel,
      dgAltSrNo: values.dgAltSrNo,
      dgAltRatedPwrOut: values.dgAltRatedPwrOut,
      dgAltVolt: values.dgAltVolt,
      dgAltFreq: values.dgAltFreq,
      dgAltPwrFact: values.dgAltPwrFact,
      dgAltRatedCurr: values.dgAltRatedCurr,
      dgAltPhase: values.dgAltPhase,
      dgAltInsClass: values.dgAltInsClass,
      commIdorSlaveId: parseInt(values.commIdorSlaveId),

      // createdBy: user?.email || "system",
      // modifiedBy: user?.email || "system",
    }

    const additionalBlocks =
      values?.GeneratorLevelItem?.map((item: any) => ({
        // plantId: parseInt(item.plantId) || 10023,
        plantId: parseInt(item.plantId),
        lineId: parseInt(item.lineId),
        generatorName: item.generatorName,
        generatorIP: item.generatorIP,
        fuelType: item.fuelType,
        commPrtcl: item.commPrtcl,
        manufacturerName: item.manufacturerName,
        modelNumber: item.modelNumber,
        serialNumber: item.serialNumber,
        manufactureYear: item.manufactureYear,
        dgEngModel: item.dgEngModel,
        dgEngSrNo: item.dgEngSrNo,
        dgEngPwrOut: item.dgEngPwrOut,
        dgRatedSpeed: item.dgRatedSpeed,
        dgFuelType: item.dgFuelType,
        dgNoOfCyl: item.dgNoOfCyl,
        dgDisplacement: item.dgDisplacement,
        dgAltModel: item.dgAltModel,
        dgAltSrNo: item.dgAltSrNo,
        dgAltRatedPwrOut: item.dgAltRatedPwrOut,
        dgAltVolt: item.dgAltVolt,
        dgAltFreq: item.dgAltFreq,
        dgAltPwrFact: item.dgAltPwrFact,
        dgAltRatedCurr: item.dgAltRatedCurr,
        dgAltPhase: item.dgAltPhase,
        dgAltInsClass: item.dgAltInsClass,
        commIdorSlaveId: parseInt(item.commIdorSlaveId),
        // createdBy: user?.email || "system",
        // modifiedBy: user?.email || "system",
      })) || []

    const payload = [firstFormBlock, ...additionalBlocks]

    try {
      const response = await api.post("/Generator/AddGenerator", payload)
      if (response.status === 200) {
        toast.success("Generator Added Successfully", {
          autoClose: 1000, // 1 second
        })

        setTimeout(() => {
          navigate(`/utilities/generator`)
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
        <div className=" border-base-300 ">
          
          <PageHeaderWithSearchAndAdd
          title={'Generator Configuration'}
          // searchQuery={searchQuery}
          // onSearchChange={setSearchQuery}
          // onAddClick={() => navigate("/utilities/generator/configuration")}
        />

          <div className="p-4  screen-height-media -ml-2 -mr-2">
            {loading && <Loading />}
            {/* <UtilitiesGeneratorHorizontalLabelForm
              formVariables={UTILITIES_GENERATOR_FORM_DATA}
              initialDefaultValueData={initialDefaultData}
              rmFormVariables={UTILITIES_GENERATOR_FORM_DATA}
              rmInitialDefaultValues={rmDefaultData}
              formValidationSchemaData={formValidationSchemaData}
              rmFormValidationSchemaData={formValidationSchemaData}
              handleCancelForm={handleCancelForm}
              handleSubmitForm={handleSubmitForm}
            /> */}

            <ConfigurableFormSection
              sectionName="Generator"
              fieldName="GeneratorLevelItem"
              formVariables={UTILITIES_GENERATOR_FORM_DATA}
              initialValues={{
                ...initialDefaultValueData,
                AreaLevelItem: rmDefaultData.length
                  ? rmDefaultData.map((i) => ({ ...i, isCollapsed: false }))
                  : [],
              }}
              validationSchema={validationSchema}
              collapsedItemCount={2}
              buttonLabel="Add Generator"
              handleSubmitForm={handleSubmitForm}
              handleCancelForm={handleCancelForm}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageConfigurationGenerator






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
// import { UTILITIES_GENERATOR_FORM_DATA } from "@/utils/data"

// import ConfigurableFormSection from "@/components/forms/ConfigurableFormSection"
// import api from "@/api/axiosInstance"
// import { toast } from "react-toastify"
// import UtilityHeader from "@/components/UtilityHeader"
// interface IManageAddUtilitiesProps {
//   user: IUser | null
// }

// const ManageConfigurationGenerator: React.FunctionComponent<
//   IManageAddUtilitiesProps
// > = ({ user }) => {
//   const location = useLocation()
//   const navigate = useNavigate()
//   const query = useQuery()
//   const token = nookies.get(null).accessToken || ""

//   const id = query.get("id")

//   const [loading, setLoading] = useState(false)
//   const [updateDataById, setUpdateDataById] = useState<any[]>([])
//   const [lineLevels, setLineLevels] = useState<any[]>([])
//   const [data, setData] = useState<number | null>(null)
//   const [validfrom, setValidFrom] = useState<string | null>(null)
//   const [validto, setValidTo] = useState<string | null>(null)
//   const [lineItem, setLineItem] = useState()
//   const [showForm, setShowForm] = useState(false)
//   const rmInitialDefaultData = initialFormikValues(
//     UTILITIES_GENERATOR_FORM_DATA,
//   )
//   const rmFormValidationSchemaData = formValidationSchema(
//     UTILITIES_GENERATOR_FORM_DATA,
//   )

//   const initialDefaultValueData = initialFormikValues(
//     UTILITIES_GENERATOR_FORM_DATA,
//   )

//   const validationSchema = formValidationSchema(UTILITIES_GENERATOR_FORM_DATA, [
//     {
//       key: "GeneratorLevelItem",
//       variables: UTILITIES_GENERATOR_FORM_DATA,
//     },
//   ])

//   const rmDefaultData = lineLevels || []

//   const handleCancelForm = () => {
//     navigate(`/utilities/generator`)
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
//       generatorName: values.generatorName,
//       generatorIP: values.generatorIP,
//       fuelType: values.fuelType,
//       commPrtcl: values.commPrtcl,
//       manufacturerName: values.manufacturerName,
//       modelNumber: values.modelNumber,
//       serialNumber: values.serialNumber,
//       manufactureYear: values.manufactureYear,
//       dgEngModel: values.dgEngModel,
//       dgEngSrNo: values.dgEngSrNo,
//       dgEngPwrOut: values.dgEngPwrOut,
//       dgRatedSpeed: values.dgRatedSpeed,
//       dgFuelType: values.dgFuelType,
//       dgNoOfCyl: values.dgNoOfCyl,
//       dgDisplacement: values.dgDisplacement,
//       dgAltModel: values.dgAltModel,
//       dgAltSrNo: values.dgAltSrNo,
//       dgAltRatedPwrOut: values.dgAltRatedPwrOut,
//       dgAltVolt: values.dgAltVolt,
//       dgAltFreq: values.dgAltFreq,
//       dgAltPwrFact: values.dgAltPwrFact,
//       dgAltRatedCurr: values.dgAltRatedCurr,
//       dgAltPhase: values.dgAltPhase,
//       dgAltInsClass: values.dgAltInsClass,
//       commIdorSlaveId: parseInt(values.commIdorSlaveId),

//       // createdBy: user?.email || "system",
//       // modifiedBy: user?.email || "system",
//     }

//     const additionalBlocks =
//       values?.GeneratorLevelItem?.map((item: any) => ({
//         // plantId: parseInt(item.plantId) || 10023,
//         plantId: parseInt(item.plantId),
//         lineId: parseInt(item.lineId),
//         generatorName: item.generatorName,
//         generatorIP: item.generatorIP,
//         fuelType: item.fuelType,
//         commPrtcl: item.commPrtcl,
//         manufacturerName: item.manufacturerName,
//         modelNumber: item.modelNumber,
//         serialNumber: item.serialNumber,
//         manufactureYear: item.manufactureYear,
//         dgEngModel: item.dgEngModel,
//         dgEngSrNo: item.dgEngSrNo,
//         dgEngPwrOut: item.dgEngPwrOut,
//         dgRatedSpeed: item.dgRatedSpeed,
//         dgFuelType: item.dgFuelType,
//         dgNoOfCyl: item.dgNoOfCyl,
//         dgDisplacement: item.dgDisplacement,
//         dgAltModel: item.dgAltModel,
//         dgAltSrNo: item.dgAltSrNo,
//         dgAltRatedPwrOut: item.dgAltRatedPwrOut,
//         dgAltVolt: item.dgAltVolt,
//         dgAltFreq: item.dgAltFreq,
//         dgAltPwrFact: item.dgAltPwrFact,
//         dgAltRatedCurr: item.dgAltRatedCurr,
//         dgAltPhase: item.dgAltPhase,
//         dgAltInsClass: item.dgAltInsClass,
//         commIdorSlaveId: parseInt(item.commIdorSlaveId),
//         // createdBy: user?.email || "system",
//         // modifiedBy: user?.email || "system",
//       })) || []

//     const payload = [firstFormBlock, ...additionalBlocks]

//     try {
//       const response = await api.post("/Generator/AddGenerator", payload)
//       if (response.status === 200) {
//         toast.success("Generator Added Successfully", {
//           autoClose: 1000, // 1 second
//         })

//         setTimeout(() => {
//           navigate(`/utilities/generator`)
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
//         <div className="border rounded border-base-300 ">
//           <div className="bg-info rounded-t border-b border-base-300 font-bold px-4 py-1 -ml-2 -mr-2">
//             {`Generator Configuration`}
//           </div>

//           <div className="p-4 bg-neutral screen-height-media -ml-2 -mr-2">
//             {loading && <Loading />}
//             {/* <UtilitiesGeneratorHorizontalLabelForm
//               formVariables={UTILITIES_GENERATOR_FORM_DATA}
//               initialDefaultValueData={initialDefaultData}
//               rmFormVariables={UTILITIES_GENERATOR_FORM_DATA}
//               rmInitialDefaultValues={rmDefaultData}
//               formValidationSchemaData={formValidationSchemaData}
//               rmFormValidationSchemaData={formValidationSchemaData}
//               handleCancelForm={handleCancelForm}
//               handleSubmitForm={handleSubmitForm}
//             /> */}

//             <ConfigurableFormSection
//               sectionName="Generator"
//               fieldName="GeneratorLevelItem"
//               formVariables={UTILITIES_GENERATOR_FORM_DATA}
//               initialValues={{
//                 ...initialDefaultValueData,
//                 AreaLevelItem: rmDefaultData.length
//                   ? rmDefaultData.map((i) => ({ ...i, isCollapsed: false }))
//                   : [],
//               }}
//               validationSchema={validationSchema}
//               collapsedItemCount={2}
//               buttonLabel="Add Generator"
//               handleSubmitForm={handleSubmitForm}
//               handleCancelForm={handleCancelForm}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ManageConfigurationGenerator
