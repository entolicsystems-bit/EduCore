import React from 'react';
import { useParams } from 'react-router-dom';
import CourseForm from './CourseForm';

const CourseEdit = () => {
  const { id } = useParams(); // Gets the ID from the URL

  // In a real app, you would fetch the course data here using the ID
  const mockData = {
    name: "Computer Science",
    description: "Comprehensive computer science program...",
    subjects: ["Programming Fundamentals", "Data Structures"]
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Course: {id}</h1>
      {/* Passing existing data to fill the inputs */}
      <CourseForm initialData={mockData} isEdit={true} />
    </div>
  );
};

export default CourseEdit;