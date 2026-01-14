import AdmissionForm from "../components/AdmissionForm";
import Dashboard from "../layouts/DashboardLayout";
import StepperSidebar from "../components/StepperSidebar";
import { FORM_STEPS } from "../assets/JavaScript/formConfig";
import { useState } from "react";

//main page that shows the muti-step admission form
const Admission = () => {
  //stores which step user is currently on - restore from localStorage
  const [step, setStep] = useState(() => {
    const savedStep = localStorage.getItem("admissionFormStep");
    return savedStep ? parseInt(savedStep) : 1;
  });

  return (
    //wrap page inside the main dashboard layout
    <Dashboard>
      {/* center the admission ui */}
      <div className="h-full w-full flex justify-center items-center">

        {/* Main container holding sidebar + form */}
        <div className="h-150 w-250 rounded-lg border-2 border-gray-300 grid grid-cols-3">

        {/* left side: stepper sidebar  */}
          <div className="proccess border-r-2 border-gray-300">
            <StepperSidebar
              steps={FORM_STEPS} //all steps(formConfig.js)
              currentStep={step} //active step
              setStep={setStep} //change step on click
            />
          </div>

          {/* right side: admission form*/}
          <div className="admissionForm col-span-2 bg-white rounded-r-lg">
            <AdmissionForm step={step} setStep={setStep} />
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default Admission;
