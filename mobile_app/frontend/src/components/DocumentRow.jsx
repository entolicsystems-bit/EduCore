import StatusBadge from "./StatusBadge";
import ActionButtons from "./ActionButtons";

const DocumentRow = ({ document }) => {
  return (
    <tr className="border-b last:border-b-0">
      <td className="py-4">{document.name}</td>

      <td>
        <StatusBadge status={document.status} />
      </td>

      <td className="text-right">
        <ActionButtons status={document.status} />
      </td>
    </tr>
  );
};

export default DocumentRow;
