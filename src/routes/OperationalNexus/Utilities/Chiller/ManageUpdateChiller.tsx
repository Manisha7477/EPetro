import HorizontalLabelForm from "@/components/forms/HorizontalLabelForm"
import Loading from "@/navigation/Loading"
import { formatDateOnly } from "@/utils/convert"
import { UTILITIES_CHILLER_FORM_DATA } from "@/utils/data"

import { useQuery } from "@/utils/dom"
import { initialFormikValues, formValidationSchema } from "@/utils/forms"
import { IFormVariable, IUser } from "@/utils/types"
import axios from "axios"
import { FormikValues } from "formik"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"

import { toast } from "react-toastify"
import UtilityHeader from "@/components/UtilityHeader"
import api from "@/api/axiosInstance"
import PageHeaderWithSearchAndAdd from "@/navigation/PageHeaderWithSearchAndAdd"
interface IManageChillerConfigurationProps {
  user: IUser | null
}

const ManageUpdateChiller: React.FunctionComponent<
  IManageChillerConfigurationProps
> = ({ user }) => {
  const navigate = useNavigate()
  const query = useQuery()
  const id = query.get("id")

  const [loading, setLoading] = useState(false)
  const [updateDataById, setUpdateDataById] = useState([])

  const initialDefaultValueData = initialFormikValues(
    UTILITIES_CHILLER_FORM_DATA,
  )
  const formValidationSchemaData = formValidationSchema(
    UTILITIES_CHILLER_FORM_DATA,
  )

  const fetchAPI = async (updateId: string) => {
    console.log("Update ID:", updateId)
    setLoading(true)

    await api
      .get(`/Chillers/GetAllChillerDetails_Id?ChillerId=${updateId}`)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setUpdateDataById(res.data)
          console.log(res.data)
        }
      })
      .catch((error) => {
        console.error("Error fetching area details:", error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (id) {
      fetchAPI(id)
    }
  }, [id])

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
    navigate(`/utilities/chiller`)
  }
  const handleSubmitForm = async (
    answerValues: FormikValues,
    actions: FormikValues,
  ) => {
    setLoading(true)
    await api
      .put(`/Chillers/UpdateChillers`, {
        lineId: updateData?.lineId,
        ...answerValues,
        deleteFlag: false,
      })

      .then((_res) => {
        toast.success("Chiller updated successfully!")
        navigate(`/utilities/chiller`)
      })
      .catch((error) => {
        toast.error("Error updating Chiller: " + error.message)
      })
      .finally(() => {
        setLoading(false)
        actions.setSubmitting(false)
      })
  }

  return (
    <div>
      <UtilityHeader />
      <div className="w-full">
        <div className=" rounded border-base-300">
          
          <PageHeaderWithSearchAndAdd
          title={`Chiller Update (${id})`}
          />
          <div className="p-4 screen-height-media -ml-2 -mr-2">
            {loading && <Loading />}
            <HorizontalLabelForm
              formVariables={UTILITIES_CHILLER_FORM_DATA}
              initialDefaultValueData={initialDefaultData}
              formValidationSchemaData={formValidationSchemaData}
              handleCancelForm={handleCancelForm}
              handleSubmitForm={handleSubmitForm}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageUpdateChiller





// import HorizontalLabelForm from "@/components/forms/HorizontalLabelForm"
// import Loading from "@/navigation/Loading"
// import { formatDateOnly } from "@/utils/convert"
// import { UTILITIES_CHILLER_FORM_DATA } from "@/utils/data"

// import { useQuery } from "@/utils/dom"
// import { initialFormikValues, formValidationSchema } from "@/utils/forms"
// import { IFormVariable, IUser } from "@/utils/types"
// import axios from "axios"
// import { FormikValues } from "formik"
// import { useEffect, useState } from "react"
// import { useNavigate } from "react-router-dom"
// import { useParams } from "react-router-dom"

// import { toast } from "react-toastify"
// import UtilityHeader from "@/components/UtilityHeader"
// import api from "@/api/axiosInstance"
// interface IManageChillerConfigurationProps {
//   user: IUser | null
// }

// const ManageUpdateChiller: React.FunctionComponent<
//   IManageChillerConfigurationProps
// > = ({ user }) => {
//   const navigate = useNavigate()
//   const query = useQuery()
//   const id = query.get("id")

//   const [loading, setLoading] = useState(false)
//   const [updateDataById, setUpdateDataById] = useState([])

//   const initialDefaultValueData = initialFormikValues(
//     UTILITIES_CHILLER_FORM_DATA,
//   )
//   const formValidationSchemaData = formValidationSchema(
//     UTILITIES_CHILLER_FORM_DATA,
//   )

//   const fetchAPI = async (updateId: string) => {
//     console.log("Update ID:", updateId)
//     setLoading(true)

//     await api
//       .get(`/Chillers/GetAllChillerDetails_Id?ChillerId=${updateId}`)
//       .then((res) => {
//         if (res.data && res.data.length > 0) {
//           setUpdateDataById(res.data)
//           console.log(res.data)
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching area details:", error)
//       })
//       .finally(() => {
//         setLoading(false)
//       })
//   }

//   useEffect(() => {
//     if (id) {
//       fetchAPI(id)
//     }
//   }, [id])

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
//     navigate(`/utilities/chiller`)
//   }
//   const handleSubmitForm = async (
//     answerValues: FormikValues,
//     actions: FormikValues,
//   ) => {
//     setLoading(true)
//     await api
//       .put(`/Chillers/UpdateChillers`, {
//         lineId: updateData?.lineId,
//         ...answerValues,
//         deleteFlag: false,
//       })

//       .then((_res) => {
//         toast.success("Chiller updated successfully!")
//         navigate(`/utilities/chiller`)
//       })
//       .catch((error) => {
//         toast.error("Error updating Chiller: " + error.message)
//       })
//       .finally(() => {
//         setLoading(false)
//         actions.setSubmitting(false)
//       })
//   }

//   return (
//     <div>
//       <UtilityHeader />
//       <div className="w-full">
//         <div className="border rounded border-base-300">
//           <div className="bg-info rounded-t border-b border-base-300 font-bold px-4 py-1 -ml-2 -mr-2">
//             {`Chiller Update (${id})`}
//           </div>
//           <div className="p-4 bg-neutral screen-height-media -ml-2 -mr-2">
//             {loading && <Loading />}
//             <HorizontalLabelForm
//               formVariables={UTILITIES_CHILLER_FORM_DATA}
//               initialDefaultValueData={initialDefaultData}
//               formValidationSchemaData={formValidationSchemaData}
//               handleCancelForm={handleCancelForm}
//               handleSubmitForm={handleSubmitForm}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ManageUpdateChiller
