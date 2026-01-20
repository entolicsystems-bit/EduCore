import React from 'react';
import CourseForm from './CourseForm'; // Import the form component we made earlier

const CourseCreate = () => {
  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Course</h1>
      {/* Passing isEdit as false for a fresh form */}
      <CourseForm isEdit={false} />
    </div>
  );
};

export default CourseCreate;