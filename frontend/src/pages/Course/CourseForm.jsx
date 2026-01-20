import React, { useState } from 'react';
//import { X } from 'lucide-react'; // Purpose: Icon for removing subjects

const CourseForm = ({ initialData = null, isEdit = false }) => {
  // State to manage the list of subjects (the blue tags)
  const [subjects, setSubjects] = useState(initialData?.subjects || []);
  const [subjectInput, setSubjectInput] = useState("");

  // Purpose: Adds a new subject to the list when button is clicked
  const addSubject = () => {
    if (subjectInput && !subjects.includes(subjectInput)) {
      setSubjects([...subjects, subjectInput]);
      setSubjectInput("");
    }
  };

  // Purpose: Removes a subject from the list
  const removeSubject = (tag) => {
    setSubjects(subjects.filter(s => s !== tag));
  };

  return (
    <div className="max-w-5xl">
      {/* Course Info Card */}
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm mb-6">
        <h2 className="text-lg font-bold mb-6 text-gray-800">Course Information</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Course Name</label>
            <input 
              type="text" 
              placeholder="Enter Course name"
              defaultValue={initialData?.name}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Description</label>
            <textarea 
              rows="4" 
              placeholder="Enter course description"
              defaultValue={initialData?.description}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            ></textarea>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Duration</label>
              <div className="flex gap-2">
                <input type="number" defaultValue="12" className="w-24 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl" />
                <select className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                  <option>Month</option>
                  <option>Year</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Status</label>
              <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Subjects Card */}
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Subjects</h3>
        <div className="flex gap-3 mb-6">
          <input 
            type="text" 
            value={subjectInput}
            onChange={(e) => setSubjectInput(e.target.value)}
            placeholder="Enter The Subject"
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
          />
          <button 
            type="button"
            onClick={addSubject}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            + Add Subject
          </button>
        </div>

        {/* Displaying Added Subjects */}
        <div className="flex flex-wrap gap-2">
          {subjects.map((sub, index) => (
            <div key={index} className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg border border-blue-100 text-sm font-medium">
              {sub}
              <button onClick={() => removeSubject(sub)} className="hover:text-red-500"><X size={14} /></button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
         <button className="bg-indigo-600 text-white px-12 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all">
            {isEdit ? "Update Course" : "Save Course"}
         </button>
      </div>
    </div>
  );
};

export default CourseForm;