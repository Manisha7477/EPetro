import { useNavigate } from "react-router-dom"
import {
  ErrorMessage,
  Field,
  FieldArray,
  FieldArrayRenderProps,
  Form,
  Formik,
  FormikHelpers,
  FormikValues,
} from "formik"
// Assuming these imports are correct and available

import { IFormVariable } from "@/utils/types"
import HorizontalLabelFormField from "../HorizontalLabelFormField"

import { formValidationSchema, initialFormikValues } from "@/utils/forms"

// HorizontalLabelForm is imported but not directly used in this component's render logic,
// keeping it as it was in the original code snippet.
import HorizontalLabelForm from "../HorizontalLabelForm"
import user from "@/store/user"
import axios from "axios"
import { useQuery } from "@/utils/dom"
import api from "@/api/axiosInstance"
import * as yup from "yup"

interface ILineHorizontalLabelFormProps {
  formVariables: IFormVariable[]
  // initialDefaultValueData: {}
  // rmFormVariables: IFormVariable[]
  rmInitialDefaultValues: FormikValues
  formValidationSchemaData: any
  rmFormValidationSchemaData: any
  handleCancelForm: Function
  handleSubmitForm: Function
  showSaveCancelButtons?: boolean
  // disableAddLinesButton?:boolean
}

const LineHorizontalLabelForm: React.FunctionComponent<
  ILineHorizontalLabelFormProps
> = ({
  formVariables,
  // initialDefaultValueData,
  formValidationSchemaData,
  // rmFormValidationSchemaData,
  // rmFormVariables,
  rmInitialDefaultValues,
  handleCancelForm,
  handleSubmitForm,
  // disableAddLinesButton,
}) => {
  const navigate = useNavigate()
  //  const query = useQuery()
  //   const id = query.get("id")

  const handleCancel = () => {
    handleCancelForm()
  }

  const handleSubmit = (answerValues: FormikValues, actions: FormikValues) => {
    handleSubmitForm(answerValues, actions)
  }

  const createNewLineBlockInitialValues = () => {
    const defaultValues: FormikValues = {}
    formVariables.forEach((variable) => {
      defaultValues[variable.name] = variable.defaultValue || ""
    })
    // Add the collapse state for each new area block
    return { ...defaultValues, isCollapsed: false }
  }

  // Initialize Formik's initialValues
  const initialDVD = {
    // ...initialDefaultValueData,
    LineLevelItem: Array.isArray(rmInitialDefaultValues)
      ? rmInitialDefaultValues.map((item: FormikValues) => ({
          ...item,
          isCollapsed: false, // Initialize existing items as not collapsed
        }))
      : [createNewLineBlockInitialValues()],
    //createNewLineBlockInitialValues()
    // Fallback if rmInitialDefaultValues isn't an array
  }

  return (
    <div className="w-full p-4 md:p-8 bg-gray-50 rounded-lg shadow-inner">
      <Formik
        initialValues={initialDVD}
        validationSchema={formValidationSchemaData}
        onSubmit={(values, actions) => {
          handleSubmit(values, actions)
        }}
        validateOnMount
        enableReinitialize
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form autoComplete="on">
            <div className="border border-gray-200 -mt-2 p-4 mb-3 rounded-lg bg-white shadow-sm transition-all duration-300 ease-in-out">
              <HorizontalLabelFormField formVariables={formVariables} />
            </div>
            {/* First Area Form Section (Top form) */}
            {/* <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Line Configuration
            </h1> */}
            {/* <HorizontalLabelFormField formVariables={formVariables} /> */}

            {/* Area Blocks Section */}
            {/* <div className="mt-10 mb-5 font-extrabold text-gray-800 text-xl border-b pb-2">
              <h2>Line</h2>
            </div> */}

            <FieldArray name="LineLevelItem">
              {({ push, remove }: FieldArrayRenderProps) => (
                <>
                  {values.LineLevelItem?.map(
                    (lineBlock: any, index: number) => {
                      const prefixedFormVariables: IFormVariable[] =
                        formVariables.map((variable) => ({
                          ...variable,
                          name: `LineLevelItem.${index}.${variable.name}`,
                        }))

                      // Modified: Show only the first 3 variables (Plant Name, Site,Line  name) when collapsed
                      const displayedFormVariables = lineBlock.isCollapsed
                        ? prefixedFormVariables.slice(0, 3) // Show first 3 variables when collapsed (Area Name, Site)
                        : prefixedFormVariables // Show all when expanded

                      return (
                        <div
                          key={index}
                          className="border border-gray-200 p-4 mb-4 rounded-lg bg-white shadow-sm transition-all duration-300 ease-in-out"
                        >
                          <div className="flex justify-between items-center mb-4">
                            <h2 className="font-semibold text-lg text-gray-700">
                              Line Block {index + 1}
                            </h2>
                            <div className="flex space-x-2">
                              {/* Collapse/Expand Button */}
                              <button
                                type="button"
                                onClick={() =>
                                  setFieldValue(
                                    `LineLevelItem.${index}.isCollapsed`,
                                    !lineBlock.isCollapsed,
                                  )
                                }
                                className={`btn btn-sm ${
                                  lineBlock.isCollapsed
                                    ? "btn-outline btn-info"
                                    : "btn-outline btn-warning"
                                } text-sm font-medium px-4 py-2 rounded-md transition-colors duration-200 ease-in-out`}
                              >
                                {lineBlock.isCollapsed ? "Expand" : "Collapse"}
                              </button>
                              {/* Delete Button */}
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="btn btn-sm btn-error text-white text-sm font-medium px-4 py-2 rounded-md shadow-md hover:bg-red-700 transition-colors duration-200 ease-in-out"
                              >
                                Delete
                              </button>
                            </div>
                          </div>

                          {/* Render HorizontalLabelFormField with the dynamically selected variables */}
                          <HorizontalLabelFormField
                            formVariables={displayedFormVariables}
                          />
                        </div>
                      )
                    },
                  )}

                  <div className="w-full mt-2">
                    <button
                      type="button"
                      onClick={() => push(createNewLineBlockInitialValues())}
                      className="btn btn-sm btn-primary text-base-100 "
                      // disabled={disableAddLinesButton}
                    >
                      Add Lines
                    </button>
                  </div>
                </>
              )}
            </FieldArray>

            {/* Save/Cancel Buttons - Reverted to original styling and positioning */}
            <div className="mt-2 mb-10">
              <button
                type="submit"
                className="btn btn-sm btn-primary text-base-100"
                disabled={isSubmitting}
              >
                Save
              </button>
              <button
                type="button"
                className="btn btn-sm btn-primary ml-4 text-base-100"
                disabled={isSubmitting}
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default LineHorizontalLabelForm

//  const handleSubmit = async (answerValues: FormikValues, actions: any) => {
//     // Resetting errors before validation
//     actions.setErrors({})
//     actions.setSubmitting(true)

//     try {
//       // Validate the form using the validation schema
//       await formValidationSchemaData.validate(answerValues, {
//         abortEarly: false,
//       })

//       // Additional custom validations
//       if (
//         answerValues.Line &&
//         answerValues.AlternateLine &&
//         answerValues.Line === answerValues.AlternateLine
//       ) {
//         actions.setFieldError(
//           "AlternateLine",
//           "line and AlternateLine cannot be the same",
//         )
//         actions.setSubmitting(false)
//         return
//       }

//       if (
//         answerValues.ValidFrom &&
//         answerValues.ValidTo &&
//         new Date(answerValues.ValidFrom) > new Date(answerValues.ValidTo)
//       ) {
//         actions.setFieldError(
//           "ValidTo",
//           "Valid To should be greater than Valid From",
//         )
//         actions.setSubmitting(false)
//         return
//       }

//       // If everything is valid, call the submit handler
//       handleSubmitForm(answerValues, actions)
//     } catch (validationErrors) {
//       // Handle form validation errors
//       if (validationErrors instanceof yup.ValidationError) {
//         const errors = validationErrors.inner.reduce((acc: any, error: any) => {
//           acc[error.path] = error.message
//           return acc
//         }, {})

//         actions.setErrors(errors)
//           console.log("Save button clicked with values:", answerValues);
//       }

//       // Ensure submitting state is reset
//       actions.setSubmitting(false)
//     }
//   }

// import { useNavigate } from "react-router-dom"
// import {
//   ErrorMessage,
//   Field,
//   FieldArray,
//   FieldArrayRenderProps,
//   Form,
//   Formik,
//   FormikHelpers,
//   FormikValues,
// } from "formik"

// import { IFormVariable } from "@/utils/types"
// import { Key } from "react"

// import { OPERATION_NEXUS_LINE_CONFIGURATION_FORM_DATA } from "@/utils/data"
// import { formValidationSchema, initialFormikValues } from "@/utils/forms"

// import HorizontalLabelFormField from "@/components/forms/HorizontalLabelFormField"

// interface ILineHorizontalLabelFormProps {
//   formVariables: IFormVariable[]
//   initialDefaultValueData: {}
//   rmFormVariables: IFormVariable[]
//   rmInitialDefaultValues: FormikValues
//   formValidationSchemaData: any
//   rmFormValidationSchemaData: any
//   handleCancelForm: Function
//   handleSubmitForm: Function
//   showSaveCancelButtons?: boolean
// }

// const LineHorizontalLabelForm: React.FunctionComponent<
//   ILineHorizontalLabelFormProps
// > = ({

//   initialDefaultValueData,
//   formValidationSchemaData,
//   // rmFormValidationSchemaData,
//   // rmFormVariables,
//   // rmInitialDefaultValues,
//   handleCancelForm,
//   handleSubmitForm,
// }) => {
//   const navigate = useNavigate()
//   const formVariables = OPERATION_NEXUS_LINE_CONFIGURATION_FORM_DATA;

//   const handleCancel = () => {
//     handleCancelForm()
//   }

//   const handleSubmit = (answerValues: FormikValues, actions: FormikValues) => {
//     console.log(answerValues)
//     handleSubmitForm(answerValues, actions)
//   }

// const createEmptyLineItem = () => {
//   const formData: { [key: string]: any } = {};

//   formVariables.forEach((variable) => {
//     formData[variable.name] =
//       variable.type === "bool" ? false : ""; // or null if preferred
//   });

//   return formData;
// };

// const prefixFormVariables = (prefix: string, variables: IFormVariable[]) => {
//   return variables.map((variable) => ({
//     ...variable,
//     name: `${prefix}.${variable.name}`, // Prefix every variable name like `lineItems[0].MaterialId`
//   }));
// };

// const initialDVD = {

//   lineItems: [],  // this is the dynamic FieldArray
// };
// console.log("initialDVD", initialDVD)

//   console.log(initialDefaultValueData)
//   console.log(initialDVD)

//   const handleClick = (push: (arg0: FormikValues) => void) => {
//   push(initialFormikValues(formVariables));
// };

//   return (
//     <div className="w-full p-4 md:p-8 bg-gray-50 rounded-lg shadow-inner">
//       <Formik
//         initialValues={initialDVD}
//         validationSchema={formValidationSchemaData}
//         onSubmit={(values, actions) => {
//           handleSubmit(values, actions)
//         }}
//         validateOnMount
//         enableReinitialize
//       >
//         {({ isSubmitting, values }) => (
//           <Form autoComplete="on">
//             {/* Finished Goods Section */}
//             <HorizontalLabelFormField formVariables={formVariables}

//  />

//             {/* Raw Materials Section */}
//             <div className="mt-10 mb-5 font-bold">
//               <h1>Line Level Details</h1>
//             </div>

//       <FieldArray name="lineItems">
//       {( { push, remove }: FieldArrayRenderProps) => (
//                 <>
//                   {/* Render Fields Inside the Same Container */}
//                   <div className="border p-4 mb-4 rounded">
//                     {values.lineItems.map((variable: any, sindex: any) => (
//                       <div
//                         key={sindex}
//                         className="w-full md:flex gap-4 items-center"
//                       >
//                            <HorizontalLabelFormField
//                         // formVariables={formVariables}
//                          formVariables={prefixFormVariables(`lineItems[${sindex}]`, formVariables)}
//                        // namePrefix={`lineItems[${sindex}]`}

//           />

//                         {/* Remove Button */}
//                         <div className="md:w-1/12 flex justify-center md:justify-end mt-4 md:mt-0">
//                           <button
//                             type="button"
//                             onClick={() => remove(sindex)}
//                             className="btn btn-sm btn-danger"
//                           >
//                             Remove
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {/* "Add Raw Material" Button Outside the Container */}
//                   <div className="w-full mt-4">
//                     <button
//                       type="button"
//                      onClick={() => push(createEmptyLineItem())}
//                       className="btn btn-sm btn-primary text-base-100"
//                     >
//                       Add Lines
//                     </button>
//                   </div>
//                 </>
//               )}
//             </FieldArray>

//             <div className="mt-10 mb-4">
//               <button
//                 type="submit"
//                 className="btn btn-sm btn-primary text-base-100"
//                 disabled={isSubmitting}
//               >
//                 Save
//               </button>
//               <button
//                 type="button"
//                 className="btn btn-sm btn-primary ml-4 text-base-100"
//                 disabled={isSubmitting}
//                 onClick={handleCancel}
//               >
//                 Cancel
//               </button>
//             </div>
//           </Form>
//         )}
//       </Formik>
//     </div>
//   )
// }

// export default LineHorizontalLabelForm
