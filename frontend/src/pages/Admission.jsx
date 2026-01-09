import AdmissionForm from "../components/AdmissionForm";
import Dashboard from "../layouts/DashboardLayout";
import StepperSidebar from "../components/StepperSidebar";
import { FORM_STEPS } from "../assets/JavaScript/formConfig";
import { useState } from "react";

const Admission = () => {
  const [step, setStep] = useState(1);
  return (
    <Dashboard>
      <div className="h-full w-full flex justify-center items-center">
        <div className="h-150 w-250 rounded-lg border-2 border-gray-300 grid grid-cols-3">
          <div className="proccess border-r-2 border-gray-300">
            <StepperSidebar
              steps={FORM_STEPS}
              currentStep={step}
              setStep={setStep}
            />
          </div>
          <div className="admissionForm col-span-2 bg-white rounded-r-lg">
            <AdmissionForm step={step} setStep={setStep} />
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default Admission;
