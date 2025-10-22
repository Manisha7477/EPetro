import HorizontalLabelForm from "@/components/forms/HorizontalLabelForm"
import Loading from "@/navigation/Loading"
import { formatDateOnly } from "@/utils/convert"
import { UTILITIES_GENERATOR_FORM_DATA } from "@/utils/data"

import { useQuery } from "@/utils/dom"
import { initialFormikValues, formValidationSchema } from "@/utils/forms"
import { IFormVariable, IUser } from "@/utils/types"
import axios from "axios"
import { FormikValues } from "formik"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"
import UtilityHeader from "@/components/UtilityHeader"
import { toast } from "react-toastify"
import api from "@/api/axiosInstance"
import PageHeaderWithSearchAndAdd from "@/navigation/PageHeaderWithSearchAndAdd"
interface IManageGeneratorConfigurationProps {
  user: IUser | null
}

const ManageUpdateGenerator: React.FunctionComponent<
  IManageGeneratorConfigurationProps
> = ({ user }) => {
  const navigate = useNavigate()
  const query = useQuery()
  const id = query.get("id")

  const [loading, setLoading] = useState(false)
  const [updateDataById, setUpdateDataById] = useState([])

  const initialDefaultValueData = initialFormikValues(
    UTILITIES_GENERATOR_FORM_DATA,
  )
  const formValidationSchemaData = formValidationSchema(
    UTILITIES_GENERATOR_FORM_DATA,
  )

  const fetchAPI = async (updateId: string) => {
    console.log("Update ID:", updateId)
    setLoading(true)

    await api
      .get(`/Generator/GetAllGeneratorDetails_Id?GeneratorId=${updateId}`)
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
    navigate(`/utilities/generator`)
  }
  const handleSubmitForm = async (
    answerValues: FormikValues,
    actions: FormikValues,
  ) => {
    setLoading(true)
    await api
      .put(`/Generator/UpdateGenerator`, {
        lineId: updateData?.lineId,
        ...answerValues,
        deleteFlag: false,
      })

      .then((_res) => {
        toast.success("Generator updated successfully!")
        navigate(`/utilities/generator`)
      })
      .catch((error) => {
        toast.error("Error updating Generator: " + error.message)
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
        <div className=" border-base-300 ">
          
          <PageHeaderWithSearchAndAdd
          title={`Generator Update (${id})`}
          // searchQuery={searchQuery}
          // onSearchChange={setSearchQuery}
          // onAddClick={() => navigate("/utilities/generator/configuration")}
        />
          <div className="p-2  screen-height-media -ml-2 -mr-2">
            {loading && <Loading />}
            <HorizontalLabelForm
              formVariables={UTILITIES_GENERATOR_FORM_DATA}
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

export default ManageUpdateGenerator





// import HorizontalLabelForm from "@/components/forms/HorizontalLabelForm"
// import Loading from "@/navigation/Loading"
// import { formatDateOnly } from "@/utils/convert"
// import { UTILITIES_GENERATOR_FORM_DATA } from "@/utils/data"

// import { useQuery } from "@/utils/dom"
// import { initialFormikValues, formValidationSchema } from "@/utils/forms"
// import { IFormVariable, IUser } from "@/utils/types"
// import axios from "axios"
// import { FormikValues } from "formik"
// import { useEffect, useState } from "react"
// import { useNavigate } from "react-router-dom"
// import { useParams } from "react-router-dom"
// import UtilityHeader from "@/components/UtilityHeader"
// import { toast } from "react-toastify"
// import api from "@/api/axiosInstance"
// interface IManageGeneratorConfigurationProps {
//   user: IUser | null
// }

// const ManageUpdateGenerator: React.FunctionComponent<
//   IManageGeneratorConfigurationProps
// > = ({ user }) => {
//   const navigate = useNavigate()
//   const query = useQuery()
//   const id = query.get("id")

//   const [loading, setLoading] = useState(false)
//   const [updateDataById, setUpdateDataById] = useState([])

//   const initialDefaultValueData = initialFormikValues(
//     UTILITIES_GENERATOR_FORM_DATA,
//   )
//   const formValidationSchemaData = formValidationSchema(
//     UTILITIES_GENERATOR_FORM_DATA,
//   )

//   const fetchAPI = async (updateId: string) => {
//     console.log("Update ID:", updateId)
//     setLoading(true)

//     await api
//       .get(`/Generator/GetAllGeneratorDetails_Id?GeneratorId=${updateId}`)
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
//     navigate(`/utilities/generator`)
//   }
//   const handleSubmitForm = async (
//     answerValues: FormikValues,
//     actions: FormikValues,
//   ) => {
//     setLoading(true)
//     await api
//       .put(`/Generator/UpdateGenerator`, {
//         lineId: updateData?.lineId,
//         ...answerValues,
//         deleteFlag: false,
//       })

//       .then((_res) => {
//         toast.success("Generator updated successfully!")
//         navigate(`/utilities/generator`)
//       })
//       .catch((error) => {
//         toast.error("Error updating Generator: " + error.message)
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
//         <div className="border rounded border-base-300 ">
//           <div className="bg-info rounded-t border-b border-base-300 font-bold px-4 py-1 -ml-2 -mr-2">
//             {`Generator Update (${id})`}
//           </div>
//           <div className="p-4 bg-neutral screen-height-media -ml-2 -mr-2">
//             {loading && <Loading />}
//             <HorizontalLabelForm
//               formVariables={UTILITIES_GENERATOR_FORM_DATA}
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

// export default ManageUpdateGenerator
