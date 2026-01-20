import React from 'react';
// 1. IMPORT LINK: This prevents the "Link is not defined" error
import { Link } from 'react-router-dom'; 
// 2. IMPORT ICONS: Make sure to run 'npm install lucide-react' in your terminal
//import { Edit2, Trash2, Plus, Search } from 'lucide-react';

const Course = () => {
  // Purpose: Mock data to simulate information coming from a database/API
  const courses = [
    { 
      id: 1, 
      name: 'Computer science', 
      description: 'Comprehensive computer science program covering fundamentals to advanced topics',
      duration: '12 months', 
      subjects: ['Programming Fundamentals', 'Data Structure', 'Algorithms'], 
      enrolled: 45, 
      status: 'Active' 
    },
    { 
      id: 2, 
      name: 'Data Science', 
      description: 'Arrays, stacks, queues, trees, graphs, all that brain-melting logic.',
      duration: '12 months', 
      subjects: ['Programming Fundamentals', 'Data Structure', 'Algorithms'], 
      enrolled: 45, 
      status: 'Inactive' 
    }
  ];

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Courses</h1>
        {/* Purpose: Navigate to the create page defined in your App.jsx routes */}
        <Link 
          to="/courses/create" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md transition-all active:scale-95"
        >
          <Plus size={20} /> <span className="font-semibold">Create Course</span>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search Course" 
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
          />
        </div>
        <select className="border border-gray-200 rounded-xl px-4 py-2 bg-white text-gray-600 outline-none focus:ring-2 focus:ring-indigo-500">
          <option>Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Course Name</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Duration</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Subjects</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Enrolled</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    {/* Placeholder icon for course */}
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-500">
                      <Search size={20} /> 
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{course.name}</div>
                      <div className="text-xs text-gray-500 max-w-[250px] truncate">{course.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-gray-600 font-medium">{course.duration}</td>
                <td className="px-6 py-5">
                  <div className="flex flex-wrap gap-1.5">
                    {course.subjects.map((sub, i) => (
                      <span key={i} className="bg-blue-50 text-blue-600 text-[11px] font-medium px-2.5 py-1 rounded-md border border-blue-100">
                        {sub}
                      </span>
                    ))}
                    <span className="text-[11px] text-gray-400 font-bold bg-gray-100 px-1.5 py-1 rounded-md">+2</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-gray-600">{course.enrolled} students</td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    course.status === 'Active' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-500'
                  }`}>
                    {course.status}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    {/* Purpose: Navigate to the Edit page with the specific Course ID */}
                    <Link to={`/courses/edit/${course.id}`} className="text-blue-500 hover:text-blue-700 transition-colors">
                      <Edit2 size={18} />
                    </Link>
                    <button className="text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Course;