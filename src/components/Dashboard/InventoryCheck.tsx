// import { initialFormikValues, formValidationSchema } from "@/utils/forms"
// import {
//   INVENTORY_CHECK_FORM_DATA,
//   INVENTORY_CHECK_HEADER_DATA,
//   INVENTORY_CHECK_DATA,
// } from "@/utils/data"
// import InventoryCheckForm from "@/components/forms/InventoryCheckForm"
// import BasicTable from "@/components/tables/BasicTable"

// interface IInventoryCheckProps {}

// const InventoryCheck: React.FunctionComponent<IInventoryCheckProps> = ({}) => {
//   const initialDefaultValueData = initialFormikValues(INVENTORY_CHECK_FORM_DATA)
//   const formValidationSchemaData = formValidationSchema(
//     INVENTORY_CHECK_FORM_DATA,
//   )
//   return (
//     <>
//       <div className="overflow-x-auto">
//         <InventoryCheckForm
//           formVariables={INVENTORY_CHECK_FORM_DATA}
//           initialDefaultValueData={initialDefaultValueData}
//           formValidationSchemaData={formValidationSchemaData}
//         />
//         <BasicTable
//           tableHeader={INVENTORY_CHECK_HEADER_DATA}
//           tableData={INVENTORY_CHECK_DATA}
//           currentPage={0} itemsPerPage={0} searchQuery={""} setSearchQuery={function (query: string): void {
//             throw new Error("Function not implemented.")
//           } }        />
//       </div>
//     </>
//   )
// }

// export default InventoryCheck
