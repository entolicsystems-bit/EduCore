import { useState, useEffect } from "react";
import { FORM_STEPS } from "../assets/JavaScript/formConfig";
import DynamicForm from "../components/DynamicForm";
import { useNavigate } from "react-router-dom";

const StudentRegistration = ({ step: propStep, setStep: setPropStep }) => {
  const navigate = useNavigate();

  // Use prop step if provided, otherwise use localStorage
  const [step, setStep] = useState(() => {
    if (propStep) return propStep;
    const savedStep = localStorage.getItem("admissionFormStep");
    return savedStep ? parseInt(savedStep) : 1;
  });

  // Sync with parent component's step prop
  useEffect(() => {
    if (propStep) {
      setStep(propStep);
    }
  }, [propStep]);

  // state management
  // All form data grouped by sections
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("admissionFormData");
    return saved
      ? JSON.parse(saved)
      : {
          student: {},
          guardian: {},
          address: {},
          academic: {},
          emergency: {},
          documents: {},
        };
  });

  //  stores inline field errors
  const [error, setError] = useState({});

  // store final submit summary errors
  const [summaryErrors, setSummaryErrors] = useState([]);

  // Auto-save form data to localStorage
  useEffect(() => {
    localStorage.setItem("admissionFormData", JSON.stringify(formData));
  }, [formData]);

  // Auto-save current step to localStorage
  useEffect(() => {
    localStorage.setItem("admissionFormStep", step.toString());
  }, [step]);

  // Save data before leaving page
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem("admissionFormData", JSON.stringify(formData));
      localStorage.setItem("admissionFormStep", step.toString());
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [formData, step]);

  //validate single field
  const validateField = (field, value) => {
    if (field.required && (!value || value.toString().trim() === "")) {
      return `${field.label} is required`;
    }

    if (field.name === "email" && value) {
      return /\S+@\S+\.\S+/.test(value) ? "" : "Invalid email format";
    }

    if (field.name === "phone" && value) {
      return /^[6-9]\d{9}$/.test(value)
        ? ""
        : "Phone must be 10 digits & start from 6-9";
    }

    if (field.name === "pincode" && value) {
      return /^[1-9][0-9]{5}$/.test(value) ? "" : "Invalid pincode";
    }

    if (field.pattern && value) {
      return new RegExp(field.pattern).test(value)
        ? ""
        : field.error || "Invalid value";
    }

    return "";
  };

  // validate file uploads
  const validateFiles = (config, sectionData) => {
    let errors = {};

    config.fields.forEach((field) => {
      if (field.type === "file") {
        const file = sectionData[field.name];

        if (field.required && !file) {
          errors[field.name] = `${field.label} is required`;
          return;
        }

        if (file) {
          const allowed = ["image/jpeg", "image/png", "application/pdf"];
          if (!allowed.includes(file.type)) {
            errors[field.name] = "Only PDF / JPG / PNG allowed";
            return;
          }

          if (file.size > 2 * 1024 * 1024) {
            errors[field.name] = "File must be less than 2MB";
            return;
          }
        }
      }
    });

    return errors;
  };

  // Vlidate one complete section
  const validationSection = (config, data) => {
    let newErrors = {};

    config.fields.forEach((field) => {
      if (field.type !== "file") {
        const value = data?.[field.name] || "";
        const msg = validateField(field, value);
        if (msg) newErrors[field.name] = msg;
      }
    });

    if (config.section === "documents") {
      const fileErrors = validateFiles(config, data);
      newErrors = { ...newErrors, ...fileErrors };
    }

    return newErrors;
  };

  // Get current step config
  const currentStep = FORM_STEPS.find((s) => s.step === step);

  //Update form data
  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  //validate field on blur
  const onBlur = (section, field) => {
    const fieldConfig = currentStep.fields.find((f) => f.name === field);
    const value = formData[section]?.[field] || "";
    const msg = validateField(fieldConfig, value);

    setError((prev) => ({
      ...prev,
      [field]: msg,
    }));
  };

  // Move to next step or submit
  const handleNext = () => {
    const config = FORM_STEPS.find((s) => s.step === step);
    const sectionKey = config.section;
    const sectionData = formData[sectionKey];

    const sectionError = validationSection(config, sectionData);

    // validate current step
    if (Object.keys(sectionError).length > 0) {
      setError(sectionError);
      return;
    }

    setError({});
    //If not last step -> move next
    if (step < FORM_STEPS.length) {
      setStep(step + 1);
    } else {
      //Final full-form validation
      let allErrors = [];

      FORM_STEPS.forEach((sec) => {
        const errs = validationSection(sec, formData[sec.section]);
        if (Object.keys(errs).length > 0) {
          allErrors.push({ section: sec.title, errors: errs });
        }
      });

      if (allErrors.length > 0) {
        setSummaryErrors(allErrors);
        alert("Please fix errors before submitting");
        return;
      }

      //  Final submit
      console.log("FINAL SUBMIT DATA:", formData);
      alert("Form submitted successfully!");
      navigate("/document-page");
    }
  };

  return (
    <div className="flex justify-center items-center p-4">
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-6">{currentStep.title}</h2>

        {/* Dynamic form rendering */}
        <DynamicForm
          config={currentStep}
          formData={formData}
          onChange={handleChange}
          onBlur={onBlur}
          errors={error}
        />

        {/* navigation button */}
        <div className="flex justify-between mt-5">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="border-2 border-gray-300 text-gray-500 px-6 py-2 rounded-lg hover:bg-gray-200 hover:text-gray-500 cursor-pointer transition-all"
            >
              Back
            </button>
          )}

          <button
            onClick={handleNext}
            className="bg-[#0d99ff] rounded-lg text-white font-bold px-8 hover:bg-[#007bff] cursor-pointer transition-all"
          >
            {step === FORM_STEPS.length ? "Submit Application" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistration;
