import HorizontalLabelForm from "@/components/forms/HorizontalLabelForm"
import Loading from "@/navigation/Loading"
import { formatDateOnly } from "@/utils/convert"
import { LINE_FORM_DATA } from "@/utils/data"
import { useQuery } from "@/utils/dom"
import { initialFormikValues, formValidationSchema } from "@/utils/forms"
import { IFormVariable, IUser } from "@/utils/types"

import { FormikValues } from "formik"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { toast } from "react-toastify"
import api from "@/api/axiosInstance"
import PageHeaderWithSearchAndAdd from "@/navigation/PageHeaderWithSearchAndAdd"



interface ILineConfigurationProps {
  user: IUser | null
}

const UpdateLineConfiguration: React.FunctionComponent<
  ILineConfigurationProps
> = ({ user }) => {
  const navigate = useNavigate()
  const query = useQuery()
  const id = query.get("id")

  const [loading, setLoading] = useState(false)
  const [updateDataById, setUpdateDataById] = useState([])

  const initialDefaultValueData = initialFormikValues(LINE_FORM_DATA)
  const formValidationSchemaData = formValidationSchema(LINE_FORM_DATA)

  const fetchAPI = async (updateId: string) => {
    console.log("Update ID:", updateId)
    setLoading(true)

    await api
      .get(`Line/GetAllLineDetails_Id?LineId=${updateId}`)
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
    navigate("/line")
  }

  const handleSubmitForm = async (
    answerValues: FormikValues,
    actions: FormikValues,
  ) => {
    setLoading(true)
    await api
      .put(`/Line/UpdateLine`, {
        lineId: updateData?.lineId,
        ...answerValues,
        deleteFlag: false,
      })

      .then((_res) => {
        toast.success("Line updated successfully!", {
          autoClose: 1000, // 1 second
        })

        setTimeout(() => {
          navigate("/line")
        }, 1000)
      })
      .catch((error) => {
        const status = error?.response?.status

        if (status === 401) return

        toast.error("Error updating Line: " + error.message, {
          autoClose: 1000, // 1 second
        })
      })
      .finally(() => {
        setLoading(false)
        actions.setSubmitting(false)
      })
  }
  return (
    <div className="w-full">
      <div className="border rounded border-base-300">
        <PageHeaderWithSearchAndAdd
          title={`Line Update (${id})`}
        />
        <div className="p-4 screen-height-media">
          {loading && <Loading />}
          <HorizontalLabelForm
            formVariables={LINE_FORM_DATA}
            initialDefaultValueData={initialDefaultData}
            formValidationSchemaData={formValidationSchemaData}
            handleCancelForm={handleCancelForm}
            handleSubmitForm={handleSubmitForm}
          />
        </div>
      </div>
    </div>
  )
}

export default UpdateLineConfiguration





// import HorizontalLabelForm from "@/components/forms/HorizontalLabelForm"
// import Loading from "@/navigation/Loading"
// import { formatDateOnly } from "@/utils/convert"
// import { LINE_FORM_DATA } from "@/utils/data"
// import { useQuery } from "@/utils/dom"
// import { initialFormikValues, formValidationSchema } from "@/utils/forms"
// import { IFormVariable, IUser } from "@/utils/types"

// import { FormikValues } from "formik"
// import { useEffect, useState } from "react"
// import { useNavigate } from "react-router-dom"

// import { toast } from "react-toastify"
// import api from "@/api/axiosInstance"

// interface ILineConfigurationProps {
//   user: IUser | null
// }

// const UpdateLineConfiguration: React.FunctionComponent<
//   ILineConfigurationProps
// > = ({ user }) => {
//   const navigate = useNavigate()
//   const query = useQuery()
//   const id = query.get("id")

//   const [loading, setLoading] = useState(false)
//   const [updateDataById, setUpdateDataById] = useState([])

//   const initialDefaultValueData = initialFormikValues(LINE_FORM_DATA)
//   const formValidationSchemaData = formValidationSchema(LINE_FORM_DATA)

//   const fetchAPI = async (updateId: string) => {
//     console.log("Update ID:", updateId)
//     setLoading(true)

//     await api
//       .get(`Line/GetAllLineDetails_Id?LineId=${updateId}`)
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
//     navigate("/line")
//   }

//   const handleSubmitForm = async (
//     answerValues: FormikValues,
//     actions: FormikValues,
//   ) => {
//     setLoading(true)
//     await api
//       .put(`/Line/UpdateLine`, {
//         lineId: updateData?.lineId,
//         ...answerValues,
//         deleteFlag: false,
//       })

//       .then((_res) => {
//         toast.success("Line updated successfully!", {
//           autoClose: 1000, // 1 second
//         })

//         setTimeout(() => {
//           navigate("/line")
//         }, 1000)
//       })
//       .catch((error) => {
//         const status = error?.response?.status

//         if (status === 401) return

//         toast.error("Error updating Line: " + error.message, {
//           autoClose: 1000, // 1 second
//         })
//       })
//       .finally(() => {
//         setLoading(false)
//         actions.setSubmitting(false)
//       })
//   }
//   return (
//     <div className="w-full">
//       <div className="border rounded border-base-300">
//         <div className="bg-info rounded-t border-b border-base-300 font-bold px-4 py-1 mt-16">
//           {`Line Update (${id})`}
//         </div>
//         <div className="p-4 bg-neutral screen-height-media">
//           {loading && <Loading />}
//           <HorizontalLabelForm
//             formVariables={LINE_FORM_DATA}
//             initialDefaultValueData={initialDefaultData}
//             formValidationSchemaData={formValidationSchemaData}
//             handleCancelForm={handleCancelForm}
//             handleSubmitForm={handleSubmitForm}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default UpdateLineConfiguration
