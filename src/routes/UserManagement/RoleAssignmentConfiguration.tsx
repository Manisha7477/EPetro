import HorizontalLabelForm from "@/components/forms/HorizontalLabelForm"
import Loading from "@/navigation/Loading"
import { formatDateOnly } from "@/utils/convert"
import { ROLE_ASSIGNMENT_FORM_DATA } from "@/utils/data"
import { useQuery } from "@/utils/dom"
import { initialFormikValues, formValidationSchema } from "@/utils/forms"
import { IUser } from "@/utils/types"
import { FormikValues } from "formik"
import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "@/api/axiosInstance"
import useDependentStore from "@/store/dependents"
import { toast } from "react-toastify"
import PageHeaderWithSearchAndAdd from "@/navigation/PageHeaderWithSearchAndAdd"
interface IRoleConfigurationProps {
  user: IUser | null
}

const RoleAssignmentConfiguration: React.FunctionComponent<
  IRoleConfigurationProps
> = ({ user }) => {
  const { setFirstDependent, setSecondDependent } = useDependentStore()
  const { clearDependents } = useDependentStore()
  const navigate = useNavigate()
  const query = useQuery()
  const id = query.get("id")

  const [loading, setLoading] = useState(false)
  const [updateDataById, setUpdateDataById] = useState([])

  const initialDefaultValueData = initialFormikValues(ROLE_ASSIGNMENT_FORM_DATA)
  const formValidationSchemaData = formValidationSchema(
    ROLE_ASSIGNMENT_FORM_DATA,
  )

  const filteredFormData = ROLE_ASSIGNMENT_FORM_DATA.filter((field) => {
    return id ? field.showInUpdate !== false : true
  })

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
    clearDependents()
    navigate("/user-mapping")
  }

  const handleSubmitForm = async (
    answerValues: FormikValues,
    actions: FormikValues,
  ) => {
    setLoading(true)

    try {
      // Construct correct payload structure
      const payload = {
        userId: Number(answerValues.userId),
        plantId: Number(answerValues.plantId),
        byEngineerId: answerValues.byEngineerId
          ? Number(answerValues.byEngineerId)
          : null,
        byManager: answerValues.byManager
          ? Number(answerValues.byManager)
          : null,
      }

      const response = await api.put("/User/UpdateUserDetails", payload)

      toast.success("User details updated successfully!", {
        autoClose: 1000,
      })

      setTimeout(() => {
        navigate("/user-mapping")
      }, 1000)
    } catch (error: any) {
      const status = error?.response?.status
      if (status === 401) return

      toast.error("Error updating user details: " + error.message, {
        autoClose: 1000,
      })
    } finally {
      setLoading(false)
      actions.setSubmitting(false)
      setFirstDependent(null)
      setSecondDependent(null)
    }
  }

  return (
    <div>
      <div className="sm:border rounded border-base-300">
        {/* {/* <div className="bg-info rounded-t border-b border-base-300 font-bold px-4 py-1" */}
        <PageHeaderWithSearchAndAdd title="User Mapping" 
        />
        {/* <div className="bg-neutral screen-height-media w-full pl-5 ml-0 pr-9"> */}
        <div className="p-4 screen-height-media">
          {loading && <Loading />}
          <HorizontalLabelForm
            formVariables={filteredFormData}
            initialDefaultValueData={initialDefaultData}
            formValidationSchemaData={formValidationSchemaData}
            handleSubmitForm={handleSubmitForm}
            handleCancelForm={handleCancelForm}
          />
        </div>
      </div>
    </div>
  )
}

export default RoleAssignmentConfiguration


// import HorizontalLabelForm from "@/components/forms/HorizontalLabelForm"
// import Loading from "@/navigation/Loading"
// import { formatDateOnly } from "@/utils/convert"
// import { ROLE_ASSIGNMENT_FORM_DATA } from "@/utils/data"
// import { useQuery } from "@/utils/dom"
// import { initialFormikValues, formValidationSchema } from "@/utils/forms"
// import { IUser } from "@/utils/types"
// import { FormikValues } from "formik"
// import { useCallback, useEffect, useState } from "react"
// import { useNavigate } from "react-router-dom"
// import api from "@/api/axiosInstance"
// import useDependentStore from "@/store/dependents"
// import { toast } from "react-toastify"
// interface IRoleConfigurationProps {
//   user: IUser | null
// }

// const RoleAssignmentConfiguration: React.FunctionComponent<
//   IRoleConfigurationProps
// > = ({ user }) => {
//   const { setFirstDependent, setSecondDependent } = useDependentStore()
//   const { clearDependents } = useDependentStore()
//   const navigate = useNavigate()
//   const query = useQuery()
//   const id = query.get("id")

//   const [loading, setLoading] = useState(false)
//   const [updateDataById, setUpdateDataById] = useState([])

//   const initialDefaultValueData = initialFormikValues(ROLE_ASSIGNMENT_FORM_DATA)
//   const formValidationSchemaData = formValidationSchema(
//     ROLE_ASSIGNMENT_FORM_DATA,
//   )

//   const filteredFormData = ROLE_ASSIGNMENT_FORM_DATA.filter((field) => {
//     return id ? field.showInUpdate !== false : true
//   })

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
//     clearDependents()
//     navigate("/user-mapping")
//   }

//   const handleSubmitForm = async (
//     answerValues: FormikValues,
//     actions: FormikValues,
//   ) => {
//     setLoading(true)

//     try {
//       // Construct correct payload structure
//       const payload = {
//         userId: Number(answerValues.userId),
//         plantId: Number(answerValues.plantId),
//         byEngineerId: answerValues.byEngineerId
//           ? Number(answerValues.byEngineerId)
//           : null,
//         byManager: answerValues.byManager
//           ? Number(answerValues.byManager)
//           : null,
//       }

//       const response = await api.put("/User/UpdateUserDetails", payload)

//       toast.success("User details updated successfully!", {
//         autoClose: 1000,
//       })

//       setTimeout(() => {
//         navigate("/user-mapping")
//       }, 1000)
//     } catch (error: any) {
//       const status = error?.response?.status
//       if (status === 401) return

//       toast.error("Error updating user details: " + error.message, {
//         autoClose: 1000,
//       })
//     } finally {
//       setLoading(false)
//       actions.setSubmitting(false)
//       setFirstDependent(null)
//       setSecondDependent(null)
//     }
//   }

//   return (
//     <div className=" ">
//       <div className="sm:border rounded border-base-300">
//         <div className="bg-info rounded-t border-b border-base-300 font-bold px-4 py-1 mt-16">
//           {`User Mapping`}
//         </div>
//         {/* <div className="bg-neutral screen-height-media w-full pl-5 ml-0 pr-9"> */}
//         <div className="p-4 bg-neutral screen-height-media">
//           {loading && <Loading />}
//           <HorizontalLabelForm
//             formVariables={filteredFormData}
//             initialDefaultValueData={initialDefaultData}
//             formValidationSchemaData={formValidationSchemaData}
//             handleSubmitForm={handleSubmitForm}
//             handleCancelForm={handleCancelForm}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default RoleAssignmentConfiguration

// // const fetchAPI = useCallback(async (updateId: string) => {
// //   setLoading(true)
// //   try {
// //     const response = await api.put("/User/UpdateUserDetails", updateId)

// //     if (response.data?.status) {
// //       console.log("User update successful:", response.data)
// //       // Optionally show a success toast or refetch data
// //     } else {
// //       console.warn(
// //         "Update response returned without success status:",
// //         response.data,
// //       )
// //     }
// //   } catch (error) {
// //     console.error("Error updating user details:", error)
// //   } finally {
// //     setLoading(false)
// //   }
// // }, [])

// // const fetchAPI = (updateId: string) => {
// //   setLoading(true)
// //   axios
// //     .get(
// //       `${process.env.NEXT_PUBLIC_API_URL}/UserMapping?UserId=${updateId}`,
// //       {
// //         headers: {
// //           Authorization: `Bearer ${user?.accessToken}`,
// //         },
// //       },
// //     )
// //     .then((res) => {
// //       if (res.data.Data) {
// //         setUpdateDataById(res.data.Data)
// //         console.log(res.data.Data)
// //       }
// //     })
// //     .catch((error) => console.log(error))
// //     .finally(() => {
// //       setLoading(false)
// //     })
// // }

// // useEffect(() => {
// //   if (id) {
// //     fetchAPI(id)
// //   }
// // }, [id])

// // const handleSubmitForm = (
// //   answerValues: FormikValues,
// //   actions: FormikValues,
// // ) => {
// //   setLoading(true)
// //   const headers = {
// //     Authorization: `Bearer ${user?.accessToken}`, // Pass the token here
// //   }
// //   axios
// //     .put(
// //       `${process.env.NEXT_PUBLIC_API_URL}/MES_UserDetails/PutUserMapping`,
// //       {
// //         UserMapping: [
// //           Object.assign({}, answerValues, {
// //             CreatedBy: user?.email,
// //           }),
// //         ],
// //       },
// //       { headers },
// //     )
// //     .then((_res) => {
// //       navigate("/user-mapping")
// //     })
// //     .catch((error) => console.log(error))
// //     .finally(() => {
// //       setLoading(false)
// //       actions.setSubmitting(false)
// //     })
// // }
