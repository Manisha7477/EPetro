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
import HorizontalLabelFormField from "@/components/forms/HorizontalLabelFormField"
 
 
 
interface IChillerHorizontalLabelFormProps {
  formVariables: IFormVariable[]
  initialDefaultValueData: {}
  rmFormVariables: IFormVariable[]
  rmInitialDefaultValues: FormikValues
  formValidationSchemaData: any
  rmFormValidationSchemaData: any
  handleCancelForm: Function
  handleSubmitForm: Function
  showSaveCancelButtons?: boolean
  // disableAddLinesButton?:boolean
}
 
const UtilitiesChillerHorizontalLabelForm: React.FunctionComponent<
  IChillerHorizontalLabelFormProps
> = ({
  formVariables,
  initialDefaultValueData,
  formValidationSchemaData,
  rmFormValidationSchemaData,
  rmFormVariables,
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
 
 
  const createNewChillerBlockInitialValues = () => {
    const defaultValues: FormikValues = {}
    rmFormVariables.forEach((variable) => {
      defaultValues[variable.name] = variable.defaultValue ?? ""
    })
    // Add the collapse state for each new area block
    return { ...defaultValues, isCollapsed: false }
  }
 
  // Initialize Formik's initialValues
  const initialDVD = {
    ...initialDefaultValueData,
    ChillerItem: Array.isArray(rmInitialDefaultValues)
      ? rmInitialDefaultValues.map((item: FormikValues) => ({
          ...item,
          isCollapsed: false, // Initialize existing items as not collapsed
        }))
      : [createNewChillerBlockInitialValues()],
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
        {({ isSubmitting, values, setFieldValue ,validateForm}) => (  // makes changes  argha added validateForm
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
 
            <FieldArray name="ChillerItem">
              {({ push, remove }:FieldArrayRenderProps) => (
                <>
                  {values.ChillerItem?.map((chillerBlock: any, index: number) => {
                    const prefixedFormVariables: IFormVariable[] =
                      rmFormVariables.map((variable) => ({
                        ...variable,
                        name: `ChillerItem.${index}.${variable.name}`,
                      }))
 
                    // Modified: Show only the first 3 variables (Plant Name, Site,Line  name) when collapsed
                    const displayedFormVariables = chillerBlock.isCollapsed
                      ? prefixedFormVariables.slice(0, 2) // Show first 2 variables when collapsed (Area Name, Site)
                      : prefixedFormVariables // Show all when expanded
 
                    return (
                      <div
                        key={index}
                        className="border border-gray-200 p-4 mb-4 rounded-lg bg-white shadow-sm transition-all duration-300 ease-in-out"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="font-semibold text-lg text-gray-700">
                             Chiller Block {index + 1}
                          </h2>
                          <div className="flex space-x-2">
                            {/* Collapse/Expand Button */}
                            <button
                              type="button"
                              onClick={() =>
                                setFieldValue(
                                  `ChillerItem.${index}.isCollapsed`,
                                  !chillerBlock.isCollapsed
                                )
                              }
                              className={`btn btn-sm ${
                                chillerBlock.isCollapsed
                                  ? "btn-outline btn-info"
                                  : "btn-outline btn-warning"
                              } text-sm font-medium px-4 py-2 rounded-md transition-colors duration-200 ease-in-out`}
                            >
                              {chillerBlock.isCollapsed ? "Expand" : "Collapse"}
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
                  })}
 
                  <div className="w-full mt-2">
                   
                    <button
                      type="button"
                      onClick={() => {
                    push(createNewChillerBlockInitialValues())
                    setTimeout(() => {
                      validateForm()
                    }, 0)
                  }}
                      // onClick={() => push(createNewAirCompressorBlockInitialValues())}
                      className="btn btn-sm btn-primary text-base-100 "
                     // disabled={disableAddLinesButton}
                    >
                      Add Chiller
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
 
export default UtilitiesChillerHorizontalLabelForm
 
 