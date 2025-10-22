import Loading from "@/navigation/Loading"
import { formatDateOnly } from "@/utils/convert"

import { useQuery } from "@/utils/dom"
import { initialFormikValues, formValidationSchema } from "@/utils/forms"
import { IFormVariable, IUser } from "@/utils/types"

import { FormikValues } from "formik"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { PLANT_FORM_DATA } from "@/utils/data"
import PlantHorizontalLabelForm from "@/components/forms/Plant_Forms/PlantHorizonatalLabelForm"
import api from "@/api/axiosInstance"
import { toast } from "react-toastify"
import PageHeaderWithSearchAndAdd from "@/navigation/PageHeaderWithSearchAndAdd"


interface IManageConfigurationProps {
  user: IUser | null
}

const ManagePlantConfiguration: React.FunctionComponent<
  IManageConfigurationProps
> = ({ user }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const query = useQuery()

  const id = query.get("id")

  const [loading, setLoading] = useState(false)
  const [updateDataById, setUpdateDataById] = useState<any[]>([])
  const [plantLevels, setPlantLevels] = useState<any[]>([])
  const [data, setData] = useState<number | null>(null)
  const [validfrom, setValidFrom] = useState<string | null>(null)
  const [validto, setValidTo] = useState<string | null>(null)
  const [PlantItem, setPlantItem] = useState()
  const initialDefaultValueData = initialFormikValues(PLANT_FORM_DATA)
  const formValidationSchemaData = formValidationSchema(PLANT_FORM_DATA)
  const [responseMessage, setResponseMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  // const rmInitialDefaultData = initialFormikValues(PLANT_LEVEL_FORM_DATA)

  // const rmFormValidationSchemaData = initialFormikValues(PLANT_LEVEL_FORM_DATA)

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

  const rmDefaultData = plantLevels || []

  const handleCancelForm = () => {
    navigate("/on-plant")
    console.log(rmDefaultData)
  }

  const handleSubmitForm = async (
    values: FormikValues,
    actions: FormikValues,
  ) => {
    console.log("Original Form Values:", values)
    setLoading(true)

    const energyMapping = values?.PlantLevelItem?.map(
      (item: any, index: number) => ({
        plantEnergyId: index + 1, // or use unique ID if available
        energySource: item.EnergySource,
        benchCarbonFootprint: item.BenchmarkedCarbonFootprint,
        emissionFactor: parseFloat(item.EmissionFactor),
      }),
    )

    //  Create clean payload by extracting only needed fields
    const payload = {
      plantName: values.plantName, // Either use plant name or lookup name via dropdown if needed
      site: values.site,
      description: values.description,
      theoEnergyCons: parseFloat(values.theoEnergyCons || 0),
      startDate: values.startDate,
      endDate: values.endDate,
      status: values.plantStatus,
      contactPerson: values.contactPerson,
      contPersNum: values.contPersNum,
      contPersDesig: values.contPersDesig,
      contPersEmail: values.contPersEmail,
      plantEnergyEff: values.plantEnergyEff,
      energyCostperUnit: parseFloat(values.energyCostperUnit || 0),
      // createdBy: user?.email || "string",
      plantEnergyMapping: energyMapping,
    }

    try {
      const response = await api.post(`/Plant/AddPlant`, payload)

      if (response.status === 200) {
        toast.success("Plant Added Successfully", {
          autoClose: 1000, // 1 second
        })

        setTimeout(() => {
          navigate("/on-plant")
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
    <div className="w-full px-2">
      <div className="border rounded border-base-300">
        
        <PageHeaderWithSearchAndAdd
          title={`Plant Configuration`}
        />
      
        <div className="px-4 py-2 screen-height-media">
          {loading && <Loading />}

          <PlantHorizontalLabelForm
            formVariables={PLANT_FORM_DATA}
            initialDefaultValueData={initialDefaultData}
            // rmFormVariables={PLANT_LEVEL_FORM_DATA}
            rmInitialDefaultValues={rmDefaultData}
            formValidationSchemaData={formValidationSchemaData}
            rmFormValidationSchemaData={formValidationSchemaData}
            handleCancelForm={handleCancelForm}
            handleSubmitForm={handleSubmitForm}
          />
        </div>
      </div>
    </div>
  )
}

export default ManagePlantConfiguration

// import Loading from "@/navigation/Loading"
// import { formatDateOnly } from "@/utils/convert"

// import { useQuery } from "@/utils/dom"
// import { initialFormikValues, formValidationSchema } from "@/utils/forms"
// import { IFormVariable, IUser } from "@/utils/types"

// import { FormikValues } from "formik"
// import { useEffect, useState } from "react"
// import { useLocation, useNavigate } from "react-router-dom"

// import { PLANT_FORM_DATA } from "@/utils/data"
// import PlantHorizontalLabelForm from "@/components/forms/Plant_Forms/PlantHorizonatalLabelForm"
// import api from "@/api/axiosInstance"
// import { toast } from "react-toastify"
// interface IManageConfigurationProps {
//   user: IUser | null
// }

// const ManagePlantConfiguration: React.FunctionComponent<
//   IManageConfigurationProps
// > = ({ user }) => {
//   const location = useLocation()
//   const navigate = useNavigate()
//   const query = useQuery()

//   const id = query.get("id")

//   const [loading, setLoading] = useState(false)
//   const [updateDataById, setUpdateDataById] = useState<any[]>([])
//   const [plantLevels, setPlantLevels] = useState<any[]>([])
//   const [data, setData] = useState<number | null>(null)
//   const [validfrom, setValidFrom] = useState<string | null>(null)
//   const [validto, setValidTo] = useState<string | null>(null)
//   const [PlantItem, setPlantItem] = useState()
//   const initialDefaultValueData = initialFormikValues(PLANT_FORM_DATA)
//   const formValidationSchemaData = formValidationSchema(PLANT_FORM_DATA)
//   const [responseMessage, setResponseMessage] = useState<{
//     type: "success" | "error"
//     text: string
//   } | null>(null)

//   // const rmInitialDefaultData = initialFormikValues(PLANT_LEVEL_FORM_DATA)

//   // const rmFormValidationSchemaData = initialFormikValues(PLANT_LEVEL_FORM_DATA)

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

//   const rmDefaultData = plantLevels || []

//   const handleCancelForm = () => {
//     navigate("/on-plant")
//     console.log(rmDefaultData)
//   }

//   const handleSubmitForm = async (
//     values: FormikValues,
//     actions: FormikValues,
//   ) => {
//     console.log("Original Form Values:", values)
//     setLoading(true)

//     const energyMapping = values?.PlantLevelItem?.map(
//       (item: any, index: number) => ({
//         plantEnergyId: index + 1, // or use unique ID if available
//         energySource: item.EnergySource,
//         benchCarbonFootprint: item.BenchmarkedCarbonFootprint,
//         emissionFactor: parseFloat(item.EmissionFactor),
//       }),
//     )

//     //  Create clean payload by extracting only needed fields
//     const payload = {
//       plantName: values.plantName, // Either use plant name or lookup name via dropdown if needed
//       site: values.site,
//       description: values.description,
//       theoEnergyCons: parseFloat(values.theoEnergyCons || 0),
//       startDate: values.startDate,
//       endDate: values.endDate,
//       status: values.plantStatus,
//       contactPerson: values.contactPerson,
//       contPersNum: values.contPersNum,
//       contPersDesig: values.contPersDesig,
//       contPersEmail: values.contPersEmail,
//       plantEnergyEff: values.plantEnergyEff,
//       energyCostperUnit: parseFloat(values.energyCostperUnit || 0),
//       // createdBy: user?.email || "string",
//       plantEnergyMapping: energyMapping,
//     }

//     try {
//       const response = await api.post(`/Plant/AddPlant`, payload)

//       if (response.status === 200) {
//         toast.success("Plant Added Successfully", {
//           autoClose: 1000, // 1 second
//         })

//         setTimeout(() => {
//           navigate("/on-plant")
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
//           {`Plant Configuration`}
//         </div>
//         <div className="p-4 bg-neutral screen-height-media">
//           {loading && <Loading />}

//           <PlantHorizontalLabelForm
//             formVariables={PLANT_FORM_DATA}
//             initialDefaultValueData={initialDefaultData}
//             // rmFormVariables={PLANT_LEVEL_FORM_DATA}
//             rmInitialDefaultValues={rmDefaultData}
//             formValidationSchemaData={formValidationSchemaData}
//             rmFormValidationSchemaData={formValidationSchemaData}
//             handleCancelForm={handleCancelForm}
//             handleSubmitForm={handleSubmitForm}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ManagePlantConfiguration
