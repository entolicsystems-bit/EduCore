//display diffrent action buttons based on document status
//this component is used in inside DocumentsTable.jsx
//possible status: ""

const ActionButtons = ({ status }) => {
  //when document is not uploaded yet
  if (status === "pending") {
    return (
      <button className="border border-blue-500 text-blue-600 px-4 py-1 rounded-md hover:bg-blue-50">
        Upload
      </button>
    );
  }

  //when document is already uploaded or verified
  return (
    <div className="inline-flex gap-4 text-gray-600">

      {/* view uploaded document */}
      <button title="View">
        <i className="ri-eye-line"></i>
      </button>

      {/* /Download uploaded document */}
      <button title="Download">
        <i className="ri-download-line"></i>
      </button>
      
      {/*Allow delete only if the document is uploaded(not verified) */}
      {status === "uploaded" && (
        <button title="Delete">
          <i className="ri-delete-bin-line"></i>
        </button>
      )}
    </div>
  );
};

export default ActionButtons;
