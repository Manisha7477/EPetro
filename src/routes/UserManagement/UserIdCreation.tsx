//NEW CODE
import HorizontalLabelForm from "@/components/forms/HorizontalLabelForm"
//import UserIdCreationForm from "@/components/forms/UserIdCreationForm"
import Loading from "@/navigation/Loading"
import { formatDateOnly } from "@/utils/convert"
import { USER_CREATION_FORM_DATA } from "@/utils/data"
import { useQuery } from "@/utils/dom"
import { initialFormikValues, formValidationSchema } from "@/utils/forms"
import { IUser } from "@/utils/types"
import axios from "axios"
import { FormikValues } from "formik"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "@/api/axiosInstance"
import { toast } from "react-toastify"
interface IUserIdCreationProps {
  user: IUser | null
}

const UserIdCreation: React.FunctionComponent<IUserIdCreationProps> = ({
  user,
}) => {
  const navigate = useNavigate()
  const query = useQuery()
  const id = query.get("id")

  const [loading, setLoading] = useState(false)
  // const [updateDataById, setUpdateDataById] = useState([])
  const [updateDataById, setUpdateDataById] = useState<{
    [key: string]: any
  } | null>(null)

  const filteredFormData = USER_CREATION_FORM_DATA.filter((field) => {
    return id ? field.showInUpdate !== false : true
  })
  const initialDefaultValueData = initialFormikValues(USER_CREATION_FORM_DATA)
  const formValidationSchemaData = formValidationSchema(filteredFormData)
  // console.log(
  //   "Form data after filtering is " + JSON.stringify(filteredFormData),
  // )

  const fetchAPI = async (updateId: string) => {
    console.log("Update ID:", updateId)
    setLoading(true)

    const response = await api
      .get(`/User/GetAllUserDetails_Id?userId=${updateId}`)

      .then((res) => {
        if (res.data) {
          const newData = {
            employeeId: res.data[0].employeeId,
            firstName: res.data[0].firstName,
            lastName: res.data[0].lastName,
            emailAddress: res.data[0].emailAddress,
            validFrom: res.data[0].validFrom,
            role: res.data[0].role,
            userId: res.data[0].userId,
            contactNumber: res.data[0].contactNumber,
            validTo: res.data[0].validTo,
          }
          // setUpdateDataById(res.data)
          setUpdateDataById(newData)
          // console.log(res.data);
        }
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (id) {
      fetchAPI(id)
    }
  }, [id])

  // const updateData: { [key: string]: any } = updateDataById
  const updateData = updateDataById || {}

  const formatDateTypeUpdate =
    updateData !== undefined
      ? updateData.validFrom && updateData.validTo
        ? {
            validFrom: formatDateOnly(updateData.validFrom),
            validTo: formatDateOnly(updateData.validTo),
          }
        : {}
      : {}

  const initialDefaultData =
    Object.assign({}, updateData, formatDateTypeUpdate) ||
    initialDefaultValueData

  const handleCancelForm = () => {
    navigate("/manage-users")
  }

  // const handleSubmitForm = (
  //   answerValues: FormikValues,
  //   actions: FormikValues,
  // ) => {
  //   setLoading(true)
  //   console.log("answerValues", answerValues)

  //   id
  //     ? api
  //         .put(`/User/UpdateUserConfig`, {
  //           userId: updateData?.userId,
  //           ...answerValues,
  //           isDeleted: false,
  //         })
  //         .then((_res) => {
  //           navigate("/manage-users")
  //         })
  //         .catch((error) => console.log(error))
  //         .finally(() => {
  //           setLoading(false)
  //           actions.setSubmitting(false)
  //         })
  //     : api
  //         .post(`/User/CreateUser`, {
  //           ...answerValues,
  //         })

  //         .then((_res) => {
  //           navigate("/manage-users")
  //         })
  //         .catch((error) => console.log(error))
  //         .finally(() => {
  //           setLoading(false)
  //           actions.setSubmitting(false)
  //         })
  // }
  const handleSubmitForm = (
    answerValues: FormikValues,
    actions: FormikValues,
  ) => {
    setLoading(true)
    console.log("answerValues", answerValues)

    const request = id
      ? api.put(`/User/UpdateUserConfig`, {
          userId: updateData?.userId,
          ...answerValues,
          isDeleted: false,
        })
      : api.post(`/User/CreateUser`, {
          ...answerValues,
        })

    request
      .then((_res) => {
        const successMessage = id
          ? "User updated successfully!"
          : "User created successfully!"

        toast.success(successMessage, {
          autoClose: 1000,
        })

        setTimeout(() => {
          navigate("/manage-users")
        }, 1000)
      })
      .catch((error) => {
        const status = error?.response?.status
        if (status === 401) return

        toast.error("Error occurred: " + error.message, {
          autoClose: 1000,
        })
      })
      .finally(() => {
        setLoading(false)
        actions.setSubmitting(false)
      })
  }

  return (
    <div className=" ">
      <div className="sm:border rounded border-base-300">
        <div
          className="relative bg-white rounded-t-lg border-b border-gray-200 px-4 pt-2 pb-2 flex items-center justify-between"
          style={{ width: "100%" }}
        >

          <div className="px-4 py-1 relative border-b-0 inline-block text-base font-semibold flex items-center gap-6 -gradient-to-r from-blue-500 via-blue-600 to-purple-500">
            {id ? `User Id Update (${id})` : `User Id Creation`}
            <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-500 rounded-full"></span>
          </div>
        </div>
        {/* <div className="bg-neutral screen-height-media w-full pl-5 ml-0 pr-9"> */}
        <div className="px-4 py-2 screen-height-media">
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

export default UserIdCreation




// import HorizontalLabelForm from "@/components/forms/HorizontalLabelForm"
// //import UserIdCreationForm from "@/components/forms/UserIdCreationForm"
// import Loading from "@/navigation/Loading"
// import { formatDateOnly } from "@/utils/convert"
// import { USER_CREATION_FORM_DATA } from "@/utils/data"
// import { useQuery } from "@/utils/dom"
// import { initialFormikValues, formValidationSchema } from "@/utils/forms"
// import { IUser } from "@/utils/types"

// import { FormikValues } from "formik"
// import { useEffect, useState } from "react"
// import { useNavigate } from "react-router-dom"
// import api from "@/api/axiosInstance"
// import { toast } from "react-toastify"
// interface IUserIdCreationProps {
//   user: IUser | null
// }

// const UserIdCreation: React.FunctionComponent<IUserIdCreationProps> = ({
//   user,
// }) => {
//   const navigate = useNavigate()
//   const query = useQuery()
//   const id = query.get("id")

//   const [loading, setLoading] = useState(false)
//   // const [updateDataById, setUpdateDataById] = useState([])
//   const [updateDataById, setUpdateDataById] = useState<{
//     [key: string]: any
//   } | null>(null)

//   const filteredFormData = USER_CREATION_FORM_DATA.filter((field) => {
//     return id ? field.showInUpdate !== false : true
//   })
//   const initialDefaultValueData = initialFormikValues(USER_CREATION_FORM_DATA)
//   const formValidationSchemaData = formValidationSchema(filteredFormData)
//   // console.log(
//   //   "Form data after filtering is " + JSON.stringify(filteredFormData),
//   // )

//   const fetchAPI = async (updateId: string) => {
//     console.log("Update ID:", updateId)
//     setLoading(true)

//     const response = await api
//       .get(`/User/GetAllUserDetails_Id?userId=${updateId}`)

//       .then((res) => {
//         if (res.data) {
//           const newData = {
//             employeeId: res.data[0].employeeId,
//             firstName: res.data[0].firstName,
//             lastName: res.data[0].lastName,
//             emailAddress: res.data[0].emailAddress,
//             validFrom: res.data[0].validFrom,
//             // role: res.data[0].role,
//             userId: res.data[0].userId,
//             contactNumber: res.data[0].contactNumber,
//             validTo: res.data[0].validTo,
//             //  use roleId instead of role
//             roleId: res.data[0].roleId,
//           }
//           // setUpdateDataById(res.data)
//           setUpdateDataById(newData)
//           // console.log(res.data)
//         }
//       })
//       .catch((error) => console.log(error))
//       .finally(() => {
//         setLoading(false)
//       })
//   }

//   useEffect(() => {
//     if (id) {
//       fetchAPI(id)
//     }
//   }, [id])

//   // const updateData: { [key: string]: any } = updateDataById
//   const updateData = updateDataById || {}

//   const formatDateTypeUpdate =
//     updateData !== undefined
//       ? updateData.validFrom && updateData.validTo
//         ? {
//             validFrom: formatDateOnly(updateData.validFrom),
//             validTo: formatDateOnly(updateData.validTo),
//           }
//         : {}
//       : {}

//   const initialDefaultData =
//     Object.assign({}, updateData, formatDateTypeUpdate) ||
//     initialDefaultValueData

//   const handleCancelForm = () => {
//     navigate("/manage-users")
//   }

//   const handleSubmitForm = (
//     answerValues: FormikValues,
//     actions: FormikValues,
//   ) => {
//     setLoading(true)
//     console.log("answerValues", answerValues)

//     const request = id
//       ? api.put(`/User/UpdateUserConfig`, {
//           userId: updateData?.userId,
//           ...answerValues,
//           isDeleted: false,
//         })
//       : api.post(`/User/CreateUser`, {
//           ...answerValues,
//         })

//     request
//       .then((_res) => {
//         const successMessage = id
//           ? "User updated successfully!"
//           : "User created successfully!"

//         toast.success(successMessage, {
//           autoClose: 1000,
//         })

//         setTimeout(() => {
//           navigate("/manage-users")
//         }, 1000)
//       })
//       .catch((error) => {
//         const status = error?.response?.status
//         if (status === 401) return

//         toast.error("Error occurred: " + error.message, {
//           autoClose: 1000,
//         })
//       })
//       .finally(() => {
//         setLoading(false)
//         actions.setSubmitting(false)
//       })
//   }

//   return (
//     <div className=" ">
//       <div className="sm:border rounded border-base-300">
//         <div className="bg-info rounded-t border-b border-base-300 font-bold px-4 py-1 mt-16">
//           {id ? `User Id Update (${id})` : `User Id Creation`}
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

// export default UserIdCreation

// // import HorizontalLabelForm from "@/components/forms/HorizontalLabelForm"

// // import Loading from "@/navigation/Loading"
// // import { formatDateOnly } from "@/utils/convert"
// // import { USER_CREATION_FORM_DATA } from "@/utils/data"
// // import { useQuery } from "@/utils/dom"
// // import { initialFormikValues, formValidationSchema } from "@/utils/forms"
// // import { IUser } from "@/utils/types"
// // import axios from "axios"
// // import { FormikValues } from "formik"
// // import { useEffect, useState } from "react"
// // import { useNavigate } from "react-router-dom"
// // import api from "@/api/axiosInstance"
// // import { toast } from "react-toastify"
// // interface IUserIdCreationProps {
// //   user: IUser | null
// // }

// // const UserIdCreation: React.FunctionComponent<IUserIdCreationProps> = ({
// //   user,
// // }) => {
// //   const navigate = useNavigate()
// //   const query = useQuery()
// //   const id = query.get("id")

// //   const [loading, setLoading] = useState(false)
// //   const [updateDataById, setUpdateDataById] = useState([])
// //   // const [updateDataById, setUpdateDataById] = useState<{
// //   //   [key: string]: any
// //   // } | null>(null)

// //   const filteredFormData = USER_CREATION_FORM_DATA.filter((field) => {
// //     return id ? field.showInUpdate !== false : true
// //   })
// //   const initialDefaultValueData = initialFormikValues(USER_CREATION_FORM_DATA)
// //   const formValidationSchemaData = formValidationSchema(filteredFormData)
// //   // console.log(
// //   //   "Form data after filtering is " + JSON.stringify(filteredFormData),
// //   // )

// //   const fetchAPI = async (updateId: string) => {
// //     console.log("Update ID:", updateId)
// //     setLoading(true)

// //     const response = await api
// //       .get(`/User/GetAllUserDetails_Id?userId=${updateId}`)

// //       .then((res) => {
// //         if (res.data) {
// //           const newData = {
// //             employeeId: res.data[0].employeeId,
// //             firstName: res.data[0].firstName,
// //             lastName: res.data[0].lastName,
// //             emailAddress: res.data[0].emailAddress,
// //             validFrom: res.data[0].validFrom,
// //             role: res.data[0].role,
// //             userId: res.data[0].userId,
// //             contactNumber: res.data[0].contactNumber,
// //             validTo: res.data[0].validTo,
// //           }
// //           // setUpdateDataById(res.data)
// //           setUpdateDataById(newData)
// //           // console.log(res.data);
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

// //   // const updateData: { [key: string]: any } = updateDataById
// //   const updateData = updateDataById || {}

// //   const formatDateTypeUpdate =
// //     updateData !== undefined
// //       ? updateData.validFrom && updateData.validTo
// //         ? {
// //             validFrom: formatDateOnly(updateData.validFrom),
// //             validTo: formatDateOnly(updateData.validTo),
// //           }
// //         : {}
// //       : {}

// //   const initialDefaultData =
// //     Object.assign({}, updateData, formatDateTypeUpdate) ||
// //     initialDefaultValueData

// //   const handleCancelForm = () => {
// //     navigate("/manage-users")
// //   }

// //   const handleSubmitForm = (
// //     answerValues: FormikValues,
// //     actions: FormikValues,
// //   ) => {
// //     setLoading(true)
// //     console.log("answerValues", answerValues)

// //     const request = id
// //       ? api.put(`/User/UpdateUserConfig`, {
// //           userId: updateData?.userId,
// //           ...answerValues,
// //           isDeleted: false,
// //         })
// //       : api.post(`/User/CreateUser`, {
// //           ...answerValues,
// //         })

// //     request
// //       .then((_res) => {
// //         const successMessage = id
// //           ? "User updated successfully!"
// //           : "User created successfully!"

// //         toast.success(successMessage, {
// //           autoClose: 1000,
// //         })

// //         setTimeout(() => {
// //           navigate("/manage-users")
// //         }, 1000)
// //       })
// //       .catch((error) => {
// //         const status = error?.response?.status
// //         if (status === 401) return

// //         toast.error("Error occurred: " + error.message, {
// //           autoClose: 1000,
// //         })
// //       })
// //       .finally(() => {
// //         setLoading(false)
// //         actions.setSubmitting(false)
// //       })
// //   }

// //   return (
// //     <div className=" ">
// //       <div className="sm:border rounded border-base-300">
// //         <div className="bg-info rounded-t border-b border-base-300 font-bold px-4 py-1 mt-16">
// //           {id ? `User Id Update (${id})` : `User Id Creation`}
// //         </div>
// //         {/* <div className="bg-neutral screen-height-media w-full pl-5 ml-0 pr-9"> */}
// //         <div className="p-4 bg-neutral screen-height-media">
// //           {loading && <Loading />}
// //           <HorizontalLabelForm
// //             formVariables={filteredFormData}
// //             initialDefaultValueData={initialDefaultData}
// //             formValidationSchemaData={formValidationSchemaData}
// //             handleSubmitForm={handleSubmitForm}
// //             handleCancelForm={handleCancelForm}
// //           />
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// // export default UserIdCreation
