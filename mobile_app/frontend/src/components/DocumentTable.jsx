import { documentsData } from "../assets/JavaScript/documentsData";
import DocumentRow from "./DocumentRow";

const DocumentTable = () => {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className=" text-gray-500  border-b">
          <th className="py-3 text-left">Document Name</th>
          <th className="text-left">Status</th>
          <th className="text-right">Actions</th>
        </tr>
      </thead>

      <tbody>
        {documentsData.map((doc) => (
          <DocumentRow key={doc.id} document={doc} />
        ))}
      </tbody>
    </table>
  );
};

export default DocumentTable;
