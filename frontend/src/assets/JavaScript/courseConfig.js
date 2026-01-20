export const COURSE_FORM_CONFIG = {
  section: "course",
  fields: [
    {
      name: "courseName",
      label: "Course Name",
      type: "text",
      placeholder: "Enter course name",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Enter course description",
      required: true,
    },
    {
      name: "duration",
      label: "Duration",
      type: "number",
      unitOptions: ["Month", "Year"], // For the dropdown next to the number
      required: true,
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: ["Active", "Inactive"],
      required: true,
    },
  ],
};