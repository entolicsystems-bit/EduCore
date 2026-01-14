import StatusBadge from "./StatusBadge";
import ActionButtons from "./ActionButtons";

//This component renders one row of inside the document table

//it recives a single documents object as a props and displays
// 1) document name
// 2) current status of the document using StatusBadge component
// 3) avilable actions (using ActionButtons)
//This component is used inside DocumentTable where all documents are looped and displayed
const DocumentRow = ({ document }) => {
  return (
    //each <tr> represents one document row
    <tr className="border-b last:border-b-0">

      {/* {column 1: document name} */}
      <td className="py-4">{document.name}</td>

      {/* {column 2: document status (pending,upload,verified etc)} */}
      <td>
        <StatusBadge status={document.status} />
      </td>
        {/* column3: Action buttons (upload, view, delete etc) */}
      <td className="text-right">
        <ActionButtons status={document.status} />
      </td>
    </tr>
  );
};

export default DocumentRow;
