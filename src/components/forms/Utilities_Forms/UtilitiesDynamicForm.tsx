import {
  FieldArray,
  FieldArrayRenderProps,
  Form,
  Formik,
  FormikValues,
} from "formik"
import { useLocation } from "react-router-dom"
import { IFormVariable } from "@/utils/types"
import HorizontalLabelFormField from "../HorizontalLabelFormField"

interface UtilitiesDynamicFormProps {
  formVariables: IFormVariable[]
  initialDefaultValueData: FormikValues
  rmFormVariables: IFormVariable[]
  rmInitialDefaultValues: FormikValues[]
  formValidationSchemaData: any
  rmFormValidationSchemaData: any
  handleCancelForm: () => void
  handleSubmitForm: (values: FormikValues, actions: any) => void
  formType?: string // optional, fallback if not provided
}

const UtilitiesDynamicForm: React.FC<UtilitiesDynamicFormProps> = ({
  formVariables,
  initialDefaultValueData,
  rmFormVariables,
  rmInitialDefaultValues,
  formValidationSchemaData,
  rmFormValidationSchemaData,
  handleCancelForm,
  handleSubmitForm,
  formType, // no default here
}) => {
  const location = useLocation()
  const path = location.pathname.toLowerCase()

  // Auto-detect form type if not passed
  let detectedFormType = "Utility"
  if (path.includes("boiler")) detectedFormType = "Boiler"
  else if (path.includes("chiller")) detectedFormType = "Chiller"
  else if (path.includes("aircompressor")) detectedFormType = "AirCompressor"
  else if (path.includes("area")) detectedFormType = "Area"
  else if (path.includes("line")) detectedFormType = "Line"
  else if (path.includes("generator")) detectedFormType = "Generator"

  const finalFormType = formType || detectedFormType

  const formatLabel = (type: string) =>
    type
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^./, (s) => s.toUpperCase())

  const formattedFormType = formatLabel(finalFormType)
  const fieldArrayKey = `${finalFormType}Item`
  const blockLabel = `${formattedFormType} Block`
  const addButtonLabel = `Add ${formattedFormType}`

  const createNewBlock = () => {
    const defaults: FormikValues = {}
    rmFormVariables.forEach((v) => {
      defaults[v.name] = v.defaultValue ?? ""
    })
    return { ...defaults, isCollapsed: false }
  }

  const initialValues: FormikValues = {
    ...initialDefaultValueData,
    [fieldArrayKey]: Array.isArray(rmInitialDefaultValues)
      ? rmInitialDefaultValues.map((item) => ({
          ...item,
          isCollapsed: false,
        }))
      : [createNewBlock()],
  }

  return (
    <div className="w-full p-4 md:p-8 bg-gray-50 rounded-lg shadow-inner">
      <Formik
        initialValues={initialValues}
        validationSchema={formValidationSchemaData}
        onSubmit={handleSubmitForm}
        validateOnMount
        enableReinitialize
      >
        {({ isSubmitting, values, setFieldValue, validateForm }) => (
          <Form autoComplete="on">
            {/* Top Section */}
            <div className="border border-gray-200 -mt-2 p-4 mb-3 rounded-lg bg-white shadow-sm">
              <HorizontalLabelFormField formVariables={formVariables} />
            </div>

            {/* Repeated Dynamic Blocks */}
            <FieldArray name={fieldArrayKey}>
              {({ push, remove }: FieldArrayRenderProps) => {
                const blocks = values[fieldArrayKey] || []

                return (
                  <>
                    {blocks.map((block: any, index: number) => {
                      const prefixedVariables = rmFormVariables.map((v) => ({
                        ...v,
                        name: `${fieldArrayKey}.${index}.${v.name}`,
                      }))

                      const displayedVariables = block.isCollapsed
                        ? prefixedVariables.slice(0, 2)
                        : prefixedVariables

                      return (
                        <div
                          key={index}
                          className="border border-gray-200 p-4 mb-4 rounded-lg bg-white shadow-sm"
                        >
                          <div className="flex justify-between items-center mb-4">
                            <h2 className="font-semibold text-lg text-gray-700">
                              {blockLabel} {index + 1}
                            </h2>
                            <div className="flex space-x-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setFieldValue(
                                    `${fieldArrayKey}.${index}.isCollapsed`,
                                    !block.isCollapsed,
                                  )
                                }
                                className={`btn btn-sm ${
                                  block.isCollapsed
                                    ? "btn-outline btn-info"
                                    : "btn-outline btn-warning"
                                } text-sm font-medium px-4 py-2 rounded-md`}
                              >
                                {block.isCollapsed ? "Expand" : "Collapse"}
                              </button>

                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="btn btn-sm btn-error text-white"
                              >
                                Delete
                              </button>
                            </div>
                          </div>

                          <HorizontalLabelFormField
                            formVariables={displayedVariables}
                          />
                        </div>
                      )
                    })}

                    <button
                      type="button"
                      onClick={() => {
                        push(createNewBlock())
                        setTimeout(() => validateForm(), 0)
                      }}
                      className="btn btn-sm btn-primary text-base-100"
                    >
                      {addButtonLabel}
                    </button>
                  </>
                )
              }}
            </FieldArray>

            {/* Save / Cancel Buttons */}
            <div className="mt-4 mb-10">
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
                onClick={handleCancelForm}
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

export default UtilitiesDynamicForm
