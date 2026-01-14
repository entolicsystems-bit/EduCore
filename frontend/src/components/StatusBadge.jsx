// Maps each status to its UI color styles
const STATUS_STYLES = {
  verified: "bg-green-500 text-white",
  uploaded: "bg-blue-500 text-white",
  pending: "bg-orange-500 text-white",
};

// displays a colored badge based on document status
const StatusBadge = ({ status }) => {
  return (
    <span
      className={`px-4 py-1 text-sm rounded-full capitalize ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
