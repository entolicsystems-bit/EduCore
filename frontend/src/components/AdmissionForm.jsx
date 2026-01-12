import { useState } from "react";
import { FORM_STEPS } from "../assets/JavaScript//formConfig";
import DynamicForm from "../components/DynamicForm";
import { useNavigate } from "react-router-dom";

const StudentRegistration = ({ step, setStep }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    student: {},
    guardian: {},
    address: {},
    academic: {},
    emergency: {},
    documents: {},
  });

  const currentStep = FORM_STEPS.find((s) => s.step === step);

  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleNext = () => {
    if (step < FORM_STEPS.length) {
      setStep(step + 1);
    } else {
      navigate("/document-page");
      console.log("FINAL SUBMIT DATA:", formData);
      alert("Form submitted successfully!");
    }
  };

  return (
    <div className="flex justify-center items-center p-4">
      <div className=" p-6">
        <h2 className="text-2xl font-semibold mb-6">{currentStep.title}</h2>

        <DynamicForm
          config={currentStep}
          formData={formData}
          onChange={handleChange}
        />

        <div className="flex justify-between mt-5">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className=" hover:bg-gray-200 px-4 py-2 rounded-lg curosor-pointer"
            >
              Back
            </button>
          )}

          <button onClick={handleNext} className="btn-primary ml-auto">
            {step === FORM_STEPS.length ? "Submit Application" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistration;
