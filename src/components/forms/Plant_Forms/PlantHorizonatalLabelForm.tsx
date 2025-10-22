import {
  FieldArray,
  FieldArrayRenderProps,
  Form,
  Formik,
  FormikValues,
} from "formik"
import { useNavigate } from "react-router-dom"

import { IFormVariable } from "@/utils/types"
import HorizontalLabelFormField from "../HorizontalLabelFormField"
import BooleanField from "../fields/BooleanField"
import CustomSelectField from "../fields/CustomSelectField"
import DateField from "../fields/DateField"
import DependedField from "../fields/DependedField"
import NumberField from "../fields/NumberField"
import PasswordField from "../fields/PasswordField"
import RadioField from "../fields/RadioField"
import SelectField from "../fields/SelectField"
import SelectOneField from "../fields/SelectOneField"
import StringField from "../fields/StringField"
import TextareaField from "../fields/TextareaField"
import TimeField from "../fields/TimeField"

interface IPlantHorizontalLabelFormProps {
  formVariables: IFormVariable[]
  initialDefaultValueData: FormikValues

  rmInitialDefaultValues: FormikValues
  formValidationSchemaData: any
  rmFormValidationSchemaData: any
  handleCancelForm: Function
  handleSubmitForm: Function
  showSaveCancelButtons?: boolean
}

const PlantHorizontalLabelForm: React.FC<IPlantHorizontalLabelFormProps> = ({
  formVariables,
  initialDefaultValueData,
  formValidationSchemaData,
  rmFormValidationSchemaData,

  rmInitialDefaultValues,
  handleCancelForm,
  handleSubmitForm,
}) => {
  const navigate = useNavigate()

  const renderFields = (variable: IFormVariable) => {
    switch (variable.type) {
      case "string":
        return <StringField variable={variable} displayLabel={false} />
      case "string(textarea)":
        return <TextareaField variable={variable} displayLabel={false} />
      case "number":
        return <NumberField variable={variable} displayLabel={false} />
      case "select":
        return <SelectField variable={variable} displayLabel={false} />
      case "selectcustom":
        return <CustomSelectField variable={variable} displayLabel={false} />
      case "selectone":
        return <SelectOneField variable={variable} displayLabel={false} />
      case "bool":
        return <BooleanField variable={variable} displayLabel={false} />
      case "radio":
        return <RadioField variable={variable} displayLabel={false} />
      case "password":
        return <PasswordField variable={variable} displayLabel={false} />
      case "date":
        return <DateField variable={variable} displayLabel={false} />
      case "time":
        return <TimeField variable={variable} displayLabel={false} />
      case "depended":
        return <DependedField variable={variable} displayLabel={false} />
      default:
        return <StringField variable={variable} displayLabel={false} />
    }
  }

  const handleCancel = () => {
    handleCancelForm()
  }

  const handleSubmit = (answerValues: FormikValues, actions: FormikValues) => {
    console.log(answerValues)
    handleSubmitForm(answerValues, actions)
  }

  const separateCamelCase = (text: string): string => {
    return text
      .replace(/([a-z])([A-Z])/g, "$1 $2") // insert space between camelCase
      .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2") // handle PascalCase like UOM
      .replace(/^./, (str) => str.toUpperCase()) // capitalize first letter
  }
  // return (
  //   <div className="w-full">
  //     <Formik
  //       initialValues={{
  //         ...initialDefaultValueData,
  //         PlantLevelItem: rmInitialDefaultValues, // 🔥 this line enables prefill!
  //       }}
  //       validationSchema={formValidationSchemaData}
  //       onSubmit={(values, actions) => handleSubmit(values, actions)}
  //       validateOnMount
  //       enableReinitialize
  //     >
  //       {({ isSubmitting, values }) => (
  //         <Form autoComplete="on">
  //           <HorizontalLabelFormField formVariables={formVariables} />

  //           {/* Energy Sources Section */}
  //           <div className="mt-10 mb-5 font-bold">
  //             <h1>Energy Sources</h1>
  //           </div>

  //           <FieldArray name="PlantLevelItem">
  //             {({ push, remove }: FieldArrayRenderProps) => (
  //               <>
  //                 <div className="border p-4 mb-4 rounded space-y-4">
  //                   {values?.PlantLevelItem?.map(
  //                     (variable: any, sindex: number) => (
  //                       <div
  //                         key={sindex}
  //                         className="w-full md:flex gap-4 items-center"
  //                       >
  //                         {/* Loop over fields and render them inside the same container */}
  //                         {Object.keys(variable)
  //                           .filter((key) =>
  //                             [
  //                               "EnergySource",
  //                               "BenchmarkedCarbonFootprint",
  //                               "EmissionFactor",
  //                             ].includes(key),
  //                           )

  //                           .map((key) => (
  //                             <div className="w-full md:w-1/4" key={key}>
  //                               <label
  //                                 htmlFor={`PlantLevelItem.${sindex}.${key}`}
  //                                 className="text-xs font-semibold"
  //                               >
  //                                 {separateCamelCase(key)}
  //                                 {variable.required && (
  //                                   <span className="text-error text-left ml-1">
  //                                     *
  //                                   </span>
  //                                 )}
  //                               </label>
  //                               <div className="w-full">
  //                                 {renderFields({
  //                                   name: `PlantLevelItem.${sindex}.${key}`,
  //                                   type: "string",
  //                                   display: separateCamelCase(key),
  //                                   required: true,
  //                                   API: "",
  //                                   defaultValue: "",
  //                                 })}
  //                               </div>
  //                             </div>
  //                           ))}
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
  //                     ),
  //                   )}
  //                 </div>
  //                 {/* "Add Raw Material" Button Outside the Container */}
  //                 <div className="w-full mt-4">
  //                   <button
  //                     type="button"
  //                     onClick={() => {
  //                       // Push new fields based on the template of the first entry
  //                       const newPlantItem = values.PlantLevelItem // Use the fields from the first object as a template
  //                       push({
  //                         EnergySource: "",
  //                         BenchmarkedCarbonFootprint: "",
  //                         EmissionFactor: "",
  //                       })
  //                     }}
  //                     className="btn btn-sm btn-primary text-base-100"
  //                   >
  //                     Add Energy Sources
  //                   </button>
  //                 </div>
  //               </>
  //             )}
  //           </FieldArray>

  //           {/* Submit & Cancel Buttons */}
  //           <div className="mt-10 mb-4">
  //             <button
  //               type="submit"
  //               className="btn btn-sm btn-primary text-base-100"
  //               disabled={isSubmitting}
  //             >
  //               Save
  //             </button>
  //             <button
  //               type="button"
  //               className="btn btn-sm btn-primary ml-4 text-base-100"
  //               disabled={isSubmitting}
  //               onClick={handleCancel}
  //             >
  //               Cancel
  //             </button>
  //           </div>
  //         </Form>
  //       )}
  //     </Formik>
  //   </div>
  // )

  return (
    <div className="w-full">
      <Formik
        initialValues={{
          ...initialDefaultValueData,
          PlantLevelItem: rmInitialDefaultValues, // 🔥 this line enables prefill!
        }}
        validationSchema={formValidationSchemaData}
        onSubmit={(values, actions) => handleSubmit(values, actions)}
        validateOnMount
        enableReinitialize
      >
        {({ isSubmitting, values }) => (
          <Form autoComplete="on">
            <HorizontalLabelFormField formVariables={formVariables} />

            {/* Energy Sources Section */}
            <div className="mt-3 mb-3 font-bold">
              <h1>Energy Sources</h1>
            </div>

            <FieldArray name="PlantLevelItem">
              {({ push, remove }: FieldArrayRenderProps) => (
                <>
                  <div className="border p-2 mb-4 rounded space-y-4">
                    {values?.PlantLevelItem?.map(
                      (variable: any, sindex: number) => (
                        <div
                          key={sindex}
                          className="w-full md:flex gap-4 items-center"
                        >
                          {/* Loop over fields and render them inside the same container */}
                          {Object.keys(variable)
                            .filter((key) =>
                              [
                                "EnergySource",
                                "BenchmarkedCarbonFootprint",
                                "EmissionFactor",
                              ].includes(key),
                            )

                            .map((key) => (
                              <div className="flex-1" key={key}>
                                <label
                                  htmlFor={`PlantLevelItem.${sindex}.${key}`}
                                  className="text-xs font-semibold"
                                >
                                  {separateCamelCase(key)}
                                  {variable.required && (
                                    <span className="text-error text-left ml-1">
                                      *
                                    </span>
                                  )}
                                </label>
                                <div className="w-full">
                                  {renderFields({
                                    name: `PlantLevelItem.${sindex}.${key}`,
                                    type: "string",
                                    display: separateCamelCase(key),
                                    required: true,
                                    API: "",
                                    defaultValue: "",
                                  })}
                                </div>
                              </div>
                            ))}
                          {/* Remove Button */}
                          <div className="md:w-1/12 flex justify-center md:justify-end mt-4 md:mt-0">
                            <button
                              type="button"
                              onClick={() => remove(sindex)}
                              className="btn btn-sm btn-danger"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                  <div className="w-full mt-4 mb-4 flex gap-4 justify-between ">
                    <button
                      type="button"
                      onClick={() => {
                        const newPlantItem = values.PlantLevelItem
                        push({
                          EnergySource: "",
                          BenchmarkedCarbonFootprint: "",
                          EmissionFactor: "",
                        })
                      }}
                      className="px-3 py-2 text-sm flex items-center gap-1 border border-primary text-primary rounded hover:bg-primary hover:text-white transition"
                    >
                      Add Energy Sources
                    </button>
                    <div className=" flex gap-4">
                      <button
                        type="submit"
                        className="px-3 py-2 text-sm flex items-center gap-1 border border-primary text-primary rounded hover:bg-primary hover:text-white transition"
                        disabled={isSubmitting}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="px-3 py-2 text-sm flex items-center gap-1 border border-primary text-primary rounded hover:bg-primary hover:text-white transition"
                        disabled={isSubmitting}
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </>
              )}
            </FieldArray>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default PlantHorizontalLabelForm
