const ActionButtons = ({ status }) => {
  if (status === "pending") {
    return (
      <button className="border border-blue-500 text-blue-600 px-4 py-1 rounded-md hover:bg-blue-50">
        Upload
      </button>
    );
  }

  return (
    <div className="inline-flex gap-4 text-gray-600">
      <button title="View">
        <i className="ri-eye-line"></i>
      </button>
      <button title="Download">
        <i className="ri-download-line"></i>
      </button>
      {status === "uploaded" && (
        <button title="Delete">
          <i className="ri-delete-bin-line"></i>
        </button>
      )}
    </div>
  );
};

export default ActionButtons;
