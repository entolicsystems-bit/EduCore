import { documentsData } from "../assets/JavaScript/documentsData";
import DocumentRow from "./DocumentRow";

// This component renders the full document table
// loads all documents data from documentsData.js
// crates a table layout with headings
//uses DocumentRow component to display each document

const DocumentTable = () => {
  return (
    <table className="w-full border-collapse">

      {/* Table Header */}
      <thead>
        <tr className=" text-gray-500  border-b">
          <th className="py-3 text-left">Document Name</th>
          <th className="text-left">Status</th>
          <th className="text-right">Actions</th>
        </tr>
      </thead>

    {/* Table Body: Loop through all documents */}
      <tbody>
        {documentsData.map((doc) => (
          <DocumentRow key={doc.id} document={doc} />
        ))}
      </tbody>
    </table>
  );
};

export default DocumentTable;