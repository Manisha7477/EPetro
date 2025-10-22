import React from "react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  goToPage: (page: number) => void
  goToNextPage: () => void
  goToPreviousPage: () => void
  itemsPerPage: number
  setItemsPerPage: (itemsPerPage: number) => void
  itemsPerPageOptions: number[]
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  goToPage,
  goToNextPage,
  goToPreviousPage,
  itemsPerPage,
  setItemsPerPage,
  itemsPerPageOptions,
}) => {
  const renderPaginationButtons = () => {
    const maxPageButtons = 10
    const halfMaxPageButtons = Math.floor(maxPageButtons / 2)
    let startPage = currentPage - halfMaxPageButtons
    let endPage = currentPage + halfMaxPageButtons

    if (startPage < 1) {
      startPage = 1
      endPage = Math.min(maxPageButtons, totalPages)
    }

    if (endPage > totalPages) {
      endPage = totalPages
      startPage = Math.max(1, totalPages - maxPageButtons + 1)
    }

    const pageNumbers = []
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    // return (
    //   <div className="join">
    //     <button
    //       className="join-item btn btn-sm btn-primary-content"
    //       disabled={currentPage === 1}
    //       onClick={() => goToPage(1)}
    //     >
    //       First
    //     </button>
    //     <button
    //       className="join-item btn btn-sm btn-primary-content"
    //       disabled={currentPage === 1}
    //       onClick={goToPreviousPage}
    //     >
    //       Previous
    //     </button>
    //     {pageNumbers.map((page) => (
    //       <button
    //         key={page}
    //         className={`join-item btn btn-sm btn-primary-content ${
    //           currentPage === page ? "btn-active" : ""
    //         }`}
    //         onClick={() => goToPage(page)}
    //       >
    //         {page}
    //       </button>
    //     ))}
    //     <button
    //       className="join-item btn btn-sm btn-primary-content"
    //       disabled={currentPage === totalPages}
    //       onClick={goToNextPage}
    //     >
    //       Next
    //     </button>
    //     <button
    //       className="join-item btn btn-sm btn-primary-content"
    //       disabled={currentPage === totalPages}
    //       onClick={() => goToPage(totalPages)}
    //     >
    //       Last
    //     </button>
    //   </div>
    // );
    return (
      <div className="join">
        <button
          className="join-item bg-info rounded-t border-b border-base-300  px-4 py-1 disabled:opacity-50 disabled:text-gray-400 disabled:text-sm disabled:bg-transparent disabled:border-b"
          disabled={currentPage === 1}
          onClick={() => goToPage(1)}
        >
          First
        </button>

        <button
          className="join-item bg-info rounded-t border-b border-base-300 font px-4 py-1 disabled:opacity-50 disabled:text-gray-400 disabled:text-sm disabled:bg-transparent disabled:border-b"
          disabled={currentPage === 1}
          onClick={goToPreviousPage}
        >
          Previous
        </button>

        {pageNumbers.map((page) => (
          <button
            key={page}
            className={`join-item bg-info rounded-t border-b border-base-300 font px-4 py-1 ${
              currentPage === page ? "bg-primary text-white" : ""
            }`}
            onClick={() => goToPage(page)}
          >
            {page}
          </button>
        ))}
        <button
          className="join-item bg-info rounded-t border-b border-base-300 px-4 py-1
             disabled:opacity-50 disabled:text-gray-400 disabled:text-sm
             disabled:bg-transparent disabled:border-b"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={goToNextPage}
        >
          Next
        </button>

        <button
          className="join-item bg-info rounded-t border-b border-base-300 px-4 py-1
             disabled:opacity-50 disabled:text-gray-400 disabled:text-sm
             disabled:bg-transparent disabled:border-b"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => goToPage(totalPages)}
        >
          Last
        </button>

        {/* <button
      className="join-item bg-info rounded-t border-b border-base-300  px-4 py-1 disabled:opacity-50 disabled:text-gray-400 disabled:text-sm disabled:bg-transparent disabled:border-b"
      disabled={currentPage === totalPages}
      onClick={goToNextPage}
    >
      Next
    </button>
 
    <button
      className="join-item bg-info rounded-t border-b border-base-300  px-4 py-1 disabled:opacity-50 disabled:text-gray-400 disabled:text-sm disabled:bg-transparent disabled:border-b"
      disabled={currentPage === totalPages}
      onClick={() => goToPage(totalPages)}
    >
      Last
    </button> */}
      </div>
    )
  }

  //   return (
  //   <div className="flex justify-between items-center gap-4">
  //     {/* Items per page horizontal selector */}
  //     <div className="flex items-center gap-2">
  //       <span className="font-medium">Items per page:</span>
  //       <div className="flex gap-2">
  //         {itemsPerPageOptions.map((pageSize) => (
  //           <button
  //             key={pageSize}
  //             onClick={() => setItemsPerPage(pageSize)}
  //             className={`px-3 py-1 text-sm rounded
  //               ${itemsPerPage === pageSize
  //                 ? "bg-primary text-white"
  //                 : "bg-base-200 hover:bg-base-300"}`}
  //           >
  //             {pageSize}
  //           </button>
  //         ))}
  //       </div>
  //     </div>

  //     {renderPaginationButtons()}

  //     {/* Go to page input */}
  //     <div className="flex items-center gap-2">
  //       <span>Go to:</span>
  //       <input
  //         type="number"
  //         value={currentPage}
  //         min={1}
  //         max={totalPages}
  //         onChange={(e) => goToPage(Number(e.target.value))}
  //         className="input input-sm border border-base-300 rounded px-2 w-16"
  //       />
  //     </div>
  //   </div>
  // );

  return (
    <div className="flex justify-between items-center gap-4">
      <div className="dropdown dropdown-top">
        <div tabIndex={0} role="button" className="btn btn-sm m-1">
          {itemsPerPage} ▼
        </div>
        <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-28">
          {itemsPerPageOptions.map((pageSize) => (
            <li key={pageSize}>
              <button onClick={() => setItemsPerPage(pageSize)}>
                {pageSize}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {renderPaginationButtons()}

      {/* Go to page input */}
      <div className="flex items-center gap-2">
        <span>Go to:</span>
        <input
          type="number"
          value={currentPage}
          min={1}
          max={totalPages}
          onChange={(e) => goToPage(Number(e.target.value))}
          className="btn btn-sm m-1"
        />
      </div>
    </div>
  )
}

export default Pagination

// import React from "react";

// interface PaginationProps {
//   currentPage: number;
//   totalPages: number;
//   goToPage: (page: number) => void;
//   goToNextPage: () => void;
//   goToPreviousPage: () => void;
//   itemsPerPage: number;
//   setItemsPerPage: (itemsPerPage: number) => void;
//   itemsPerPageOptions: number[];
// }

// const Pagination: React.FC<PaginationProps> = ({
//   currentPage,
//   totalPages,
//   goToPage,
//   goToNextPage,
//   goToPreviousPage,
//   itemsPerPage,
//   setItemsPerPage,
//   itemsPerPageOptions,
// }) => {
//   const renderPaginationButtons = () => {
//     const maxPageButtons = 10;
//     const halfMaxPageButtons = Math.floor(maxPageButtons / 2);
//     let startPage = currentPage - halfMaxPageButtons;
//     let endPage = currentPage + halfMaxPageButtons;

//     if (startPage < 1) {
//       startPage = 1;
//       endPage = Math.min(maxPageButtons, totalPages);
//     }

//     if (endPage > totalPages) {
//       endPage = totalPages;
//       startPage = Math.max(1, totalPages - maxPageButtons + 1);
//     }

//     const pageNumbers = [];
//     for (let i = startPage; i <= endPage; i++) {
//       pageNumbers.push(i);
//     }

//     return (
//       <div className="join">
//         <button
//           className="join-item btn btn-sm btn-primary-content"
//           disabled={currentPage === 1}
//           onClick={() => goToPage(1)}
//         >
//           First
//         </button>
//         <button
//           className="join-item btn btn-sm btn-primary-content"
//           disabled={currentPage === 1}
//           onClick={goToPreviousPage}
//         >
//           Previous
//         </button>
//         {pageNumbers.map((page) => (
//           <button
//             key={page}
//             className={`join-item btn btn-sm btn-primary-content ${
//               currentPage === page ? "btn-active" : ""
//             }`}
//             onClick={() => goToPage(page)}
//           >
//             {page}
//           </button>
//         ))}
//         <button
//           className="join-item btn btn-sm btn-primary-content"
//           disabled={currentPage === totalPages}
//           onClick={goToNextPage}
//         >
//           Next
//         </button>
//         <button
//           className="join-item btn btn-sm btn-primary-content"
//           disabled={currentPage === totalPages}
//           onClick={() => goToPage(totalPages)}
//         >
//           Last
//         </button>
//       </div>
//     );
//   };

//   return (
//     <div className="flex justify-between items-center gap-2">
//       <select
//         className="border-2"
//         value={itemsPerPage}
//         onChange={(e) => setItemsPerPage(Number(e.target.value))}
//       >
//         {itemsPerPageOptions.map((pageSize) => (
//           <option key={pageSize} value={pageSize}>
//             {pageSize}
//           </option>
//         ))}
//       </select>
//       {renderPaginationButtons()}
//       <div className="flex items-center">
//         <span>Go to page:</span>
//         <input
//           type="number"
//           value={currentPage}
//           onChange={(e) => goToPage(Number(e.target.value))}
//           className="ml-2 p-1 border rounded"
//           style={{ width: "50px" }}
//         />
//       </div>
//     </div>
//   );
// };

// export default Pagination;
