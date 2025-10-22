import AreaHorizontalLabelForm from "@/components/forms/Area_Forms/AreaHorizontalLabelForm"
import Loading from "@/navigation/Loading"
import { formatDateOnly } from "@/utils/convert"
import { AREA_ITEM_FORM_DATA } from "@/utils/data"
import { useQuery } from "@/utils/dom"
import { initialFormikValues, formValidationSchema } from "@/utils/forms"
import { IFormVariable, IUser } from "@/utils/types"

import { FormikValues } from "formik"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import nookies from "nookies"
import api from "@/api/axiosInstance"

import { toast } from "react-toastify"
import ConfigurableFormSection from "@/components/forms/ConfigurableFormSection"
import PageHeaderWithSearchAndAdd from "@/navigation/PageHeaderWithSearchAndAdd"
interface IAreaConfigurationProps {
  user: IUser | null
}

const ManageAreaConfiguration: React.FunctionComponent<
  IAreaConfigurationProps
> = ({ user }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const query = useQuery()

  const [loading, setLoading] = useState(false)

  const [bomLevels, setBomLevels] = useState<any[]>([])
  // const [data, setData] = useState<number | null>(null)
  // const [validfrom, setValidFrom] = useState<string | null>(null)
  // const [validto, setValidTo] = useState<string | null>(null)

  const initialDefaultValueData = initialFormikValues(AREA_ITEM_FORM_DATA)

  const validationSchema = formValidationSchema(AREA_ITEM_FORM_DATA, [
    {
      key: "AreaLevelItem",
      variables: AREA_ITEM_FORM_DATA,
    },
  ])

  const rmDefaultData = bomLevels || []

  const handleCancelForm = () => {
    navigate("/area")
    console.log(rmDefaultData)
  }

  const handleSubmitForm = async (
    values: FormikValues,
    actions: FormikValues,
  ) => {
    setLoading(true)
    console.log("Submitting form with values:", values)

    const firstFormBlock = {
      plantId: parseInt(values.plantId),
      plantStatusId: parseInt(values.plantStatus),
      areaName: values.areaName,
      siteId: parseInt(values.siteId),
      electricalSupp: parseFloat(values.electricalSupp),
      theoPowerSupp: parseFloat(values.theoPowerSupp),
      actualPowerConsum: parseFloat(values.actualPowerConsum),
      description: values.description || "",
      phase: values.phase,
      currentRating: parseFloat(values.currentRating),
      lowVtgRating: parseFloat(values.lowVtgRating),
      highVtgRating: parseFloat(values.highVtgRating),
      peakLoad: parseFloat(values.peakLoad) || 0,
      // createdBy: user?.email || "system",
    }

    const additionalBlocks =
      values?.AreaLevelItem?.map((item: any) => ({
        plantId: parseInt(item.plantId),
        plantStatusId: parseInt(item.plantStatus),
        areaName: item.areaName,
        siteId: parseInt(item.siteId),
        electricalSupp: parseFloat(item.electricalSupp),
        theoPowerSupp: parseFloat(item.theoPowerSupp),
        actualPowerConsum: parseFloat(item.actualPowerConsum),
        description: item.description || "",
        phase: item.phase,
        currentRating: parseFloat(item.currentRating),
        lowVtgRating: parseFloat(item.lowVtgRating),
        highVtgRating: parseFloat(item.highVtgRating),
        peakLoad: parseFloat(item.peakLoad),
        // createdBy: user?.email || "system",
      })) || []

    const payload = [firstFormBlock, ...additionalBlocks]

    try {
      const response = await api.post("/Area/AddArea", payload)
      if (response.status === 200) {
        toast.success("Area Added Successfully", {
          autoClose: 1000, // 1 second
        })

        setTimeout(() => {
          navigate("/area")
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
          title={`Area Configuration`}
        />
        <div className="screen-height-media">
          {loading && <Loading />}

          <ConfigurableFormSection
            sectionName="Area"
            fieldName="AreaLevelItem"
            formVariables={AREA_ITEM_FORM_DATA}
            initialValues={{
              ...initialDefaultValueData,

              LevelItem: rmDefaultData.length
                ? rmDefaultData.map((i) => ({ ...i, isCollapsed: false }))
                : [],
            }}
            validationSchema={validationSchema}
            collapsedItemCount={2}
            buttonLabel="Add Area"
            handleSubmitForm={handleSubmitForm}
            handleCancelForm={handleCancelForm}
          />
        </div>
      </div>
    </div>
  )
}

export default ManageAreaConfiguration





// import AreaHorizontalLabelForm from "@/components/forms/Area_Forms/AreaHorizontalLabelForm"
// import Loading from "@/navigation/Loading"
// import { formatDateOnly } from "@/utils/convert"
// import { AREA_ITEM_FORM_DATA } from "@/utils/data"
// import { useQuery } from "@/utils/dom"
// import { initialFormikValues, formValidationSchema } from "@/utils/forms"
// import { IFormVariable, IUser } from "@/utils/types"

// import { FormikValues } from "formik"
// import { useEffect, useState } from "react"
// import { useLocation, useNavigate } from "react-router-dom"
// import nookies from "nookies"
// import api from "@/api/axiosInstance"

// import { toast } from "react-toastify"
// import ConfigurableFormSection from "@/components/forms/ConfigurableFormSection"

// interface IAreaConfigurationProps {
//   user: IUser | null
// }

// const ManageAreaConfiguration: React.FunctionComponent<
//   IAreaConfigurationProps
// > = ({ user }) => {
//   const location = useLocation()
//   const navigate = useNavigate()
//   const query = useQuery()

//   const [loading, setLoading] = useState(false)

//   const [bomLevels, setBomLevels] = useState<any[]>([])
//   // const [data, setData] = useState<number | null>(null)
//   // const [validfrom, setValidFrom] = useState<string | null>(null)
//   // const [validto, setValidTo] = useState<string | null>(null)

//   const initialDefaultValueData = initialFormikValues(AREA_ITEM_FORM_DATA)

//   const validationSchema = formValidationSchema(AREA_ITEM_FORM_DATA, [
//     {
//       key: "AreaLevelItem",
//       variables: AREA_ITEM_FORM_DATA,
//     },
//   ])

//   const rmDefaultData = bomLevels || []

//   const handleCancelForm = () => {
//     navigate("/area")
//     console.log(rmDefaultData)
//   }

//   const handleSubmitForm = async (
//     values: FormikValues,
//     actions: FormikValues,
//   ) => {
//     setLoading(true)
//     console.log("Submitting form with values:", values)

//     const firstFormBlock = {
//       plantId: parseInt(values.plantId),
//       plantStatusId: parseInt(values.plantStatus),
//       areaName: values.areaName,
//       siteId: parseInt(values.siteId),
//       electricalSupp: parseFloat(values.electricalSupp),
//       theoPowerSupp: parseFloat(values.theoPowerSupp),
//       actualPowerConsum: parseFloat(values.actualPowerConsum),
//       description: values.description || "",
//       phase: values.phase,
//       currentRating: parseFloat(values.currentRating),
//       lowVtgRating: parseFloat(values.lowVtgRating),
//       highVtgRating: parseFloat(values.highVtgRating),
//       peakLoad: parseFloat(values.peakLoad) || 0,
//       // createdBy: user?.email || "system",
//     }

//     const additionalBlocks =
//       values?.AreaLevelItem?.map((item: any) => ({
//         plantId: parseInt(item.plantId),
//         plantStatusId: parseInt(item.plantStatus),
//         areaName: item.areaName,
//         siteId: parseInt(item.siteId),
//         electricalSupp: parseFloat(item.electricalSupp),
//         theoPowerSupp: parseFloat(item.theoPowerSupp),
//         actualPowerConsum: parseFloat(item.actualPowerConsum),
//         description: item.description || "",
//         phase: item.phase,
//         currentRating: parseFloat(item.currentRating),
//         lowVtgRating: parseFloat(item.lowVtgRating),
//         highVtgRating: parseFloat(item.highVtgRating),
//         peakLoad: parseFloat(item.peakLoad),
//         // createdBy: user?.email || "system",
//       })) || []

//     const payload = [firstFormBlock, ...additionalBlocks]

//     try {
//       const response = await api.post("/Area/AddArea", payload)
//       if (response.status === 200) {
//         toast.success("Area Added Successfully", {
//           autoClose: 1000, // 1 second
//         })

//         setTimeout(() => {
//           navigate("/area")
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
//           {`Area Configuration`}
//         </div>
//         <div className="p-4 bg-neutral screen-height-media">
//           {loading && <Loading />}

//           <ConfigurableFormSection
//             sectionName="Area"
//             fieldName="AreaLevelItem"
//             formVariables={AREA_ITEM_FORM_DATA}
//             initialValues={{
//               ...initialDefaultValueData,

//               LevelItem: rmDefaultData.length
//                 ? rmDefaultData.map((i) => ({ ...i, isCollapsed: false }))
//                 : [],
//             }}
//             validationSchema={validationSchema}
//             collapsedItemCount={2}
//             buttonLabel="Add Area"
//             handleSubmitForm={handleSubmitForm}
//             handleCancelForm={handleCancelForm}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ManageAreaConfiguration
