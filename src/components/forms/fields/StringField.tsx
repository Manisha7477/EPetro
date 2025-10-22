import { IFormVariable } from "@/utils/types"
import { ErrorMessage, Field } from "formik"

interface IStringFieldProps {
  variable: IFormVariable
  displayLabel?: boolean
}

const StringField: React.FunctionComponent<IStringFieldProps> = ({
  variable,
  displayLabel = true,
}) => {
  return (
    <div className="form-control" key={variable.name}>
      {displayLabel && (
        <label htmlFor={variable.name} className="w-full">
          {variable.display}
          {variable.required && (
            <span className="text-error text-left ml-1">*</span>
          )}
        </label>
      )}
      <div className="w-full">
        <Field
          id={variable.name}
          name={variable.name}
          placeholder={variable.display}
          className="input input-sm input-bordered w-full"
        />
        <div className="text-error text-xs text-left">
          <ErrorMessage name={variable.name} />
        </div>

        <div className="text-sm text-faint mt-1">{variable.description}</div>
      </div>
    </div>
  )
}

export default StringField

// import { IFormVariable } from "@/utils/types"
// import { ErrorMessage, Field } from "formik"
// import { useEffect, useState } from "react"
// import api from "../../../api/axiosInstance"
// import useDependentStore from "@/store/dependents"
// interface IStringFieldProps {
//   variable: IFormVariable
//   displayLabel?: boolean
// }

// const StringField: React.FunctionComponent<IStringFieldProps> = ({
//   variable,
//   displayLabel = true,
// }) => {
//   const { firstDependent, secondDependent } = useDependentStore()
//   const [value, setValue] = useState<string>("")
//   const fetchApiData = async (values: string | undefined) => {
//     const response = await api.get(
//       `${values}?PlantId=${secondDependent ? secondDependent : firstDependent}`,
//     )
//     const data = response.data
//     console.log(data)
//     setValue(data[0].siteName)
//   }
//   useEffect(() => {
//     console.log("Chcking api hit")
//     if (firstDependent || secondDependent) {
//       console.log("first = " + firstDependent)
//       console.log("Second = " + secondDependent)
//       fetchApiData(variable.API)
//     }
//   }, [firstDependent, secondDependent])
//   return (
//     <div className="form-control" key={variable.name}>
//       {displayLabel && (
//         <label htmlFor={variable.name} className="w-full">
//           {variable.display}
//           {variable.required && (
//             <span className="text-error text-left ml-1">*</span>
//           )}
//         </label>
//       )}
//       <div className="w-full">
//         <Field
//           id={variable.name}
//           name={variable.name}
//           placeholder={variable.display}
//           value={value}
//           className="input input-sm input-bordered w-full"
//         />
//         <div className="text-error text-xs text-left">
//           <ErrorMessage name={variable.name} />
//         </div>

//         <div className="text-sm text-faint mt-1">{variable.description}</div>
//       </div>
//     </div>
//   )
// }

// export default StringField
