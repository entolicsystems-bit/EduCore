import React, { useState } from 'react';
import { COURSE_FORM_CONFIG } from './courseConfig';

const CourseForm = ({ initialData = null, mode = "create" }) => {
  // 1. Setup State: If editing, use initialData. If creating, use empty values.
  const [formData, setFormData] = useState(initialData || {
    courseName: '',
    description: '',
    duration: '',
    status: 'Active'
  });

  const [subjects, setSubjects] = useState(initialData?.subjects || []);
  const [subjectInput, setSubjectInput] = useState("");

  // 2. Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle Adding Subjects (The Blue Tags in your Figma)
  const addSubject = () => {
    if (subjectInput.trim()) {
      setSubjects([...subjects, subjectInput]);
      setSubjectInput(""); // Clear the small input
    }
  };

  return (
    <div className="form-container">
      <div className="card">
        <h3>Course Information</h3>
        <div className="grid-layout">
          {COURSE_FORM_CONFIG.fields.map((field) => {
            // WE MUST RETURN JSX HERE
            return (
              <div key={field.name} className="field-group">
                <label>{field.label}</label>
                
                {field.type === "textarea" ? (
                  <textarea 
                    name={field.name} 
                    value={formData[field.name]} 
                    onChange={handleChange} 
                    placeholder={field.placeholder}
                  />
                ) : field.type === "select" ? (
                  <select name={field.name} value={formData[field.name]} onChange={handleChange}>
                    {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <input 
                    type={field.type} 
                    name={field.name} 
                    value={formData[field.name]} 
                    onChange={handleChange} 
                    placeholder={field.placeholder} 
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* 4. The Subjects Section from your Screenshot */}
        <div className="subjects-section">
          <label>Subjects</label>
          <div className="subject-input-wrapper">
            <input 
              type="text" 
              value={subjectInput} 
              onChange={(e) => setSubjectInput(e.target.value)}
              placeholder="Enter The Subject" 
            />
            <button type="button" onClick={addSubject} className="add-btn">+ Add Subject</button>
          </div>
          
          <div className="tag-container">
            {subjects.map((sub, index) => (
              <span key={index} className="subject-tag">
                {sub} <button onClick={() => setSubjects(subjects.filter((_, i) => i !== index))}>×</button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseForm;