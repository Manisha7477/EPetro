// DropDown.tsx
import React from "react"

interface DropDownProps {
  title: string
  data: string[] // or any other type based on your data
  onChange?: (value: string) => void // Add a callback for handling selection change
}

const DropDown: React.FC<DropDownProps> = ({ title, data, onChange }) => {
  return (
    <div className="dropdown">
      <label className="dropdown-label">{title}</label>
      <select
        className="dropdown-select"
        onChange={(e) => onChange?.(e.target.value)}
      >
        <option value="" disabled>
          Select {title}
        </option>
        {data.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  )
}

export default DropDown
// // DropDown.tsx
// import React from 'react';

// interface DropDownProps {
//   title: string;
//   data: string[]; // Assuming the data is an array of strings. Adjust if needed.
//   onChange?: (value: string) => void; // Add a callback for handling selection change
// }

// const DropDown: React.FC<DropDownProps> = ({ title, data, onChange }) => {
//   return (
//     <div className="dropdown">
//       <label className="dropdown-label">{title}</label>
//       <select
//         className="dropdown-select"
//         onChange={(e) => onChange?.(e.target.value)}
//       >
//         <option value="" disabled>Select {title}</option>
//         {data.map((item, index) => (
//           <option key={index} value={item}>
//             {item}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// };

// export default DropDown;

// DropDown.tsx
