const StepperSidebar = ({ steps, currentStep, setStep }) => {
  return (
    <div className="w-64 bg-[#f1f6ff] p-6 rounded-l-xl">
      <div className="flex flex-col gap-10">
        {steps.map((s, index) => {
          const isCompleted = s.step < currentStep;
          const isActive = s.step === currentStep;

          return (
            <div key={s.step} className="flex items-start">
              <div
                className={`rounded-md border w-full text-sm
                  ${
                    isActive
                      ? "bg-white font-semibold"
                      : "bg-transparent text-gray-600"
                  }`}
              >
                <div
                  className="flex items-center gap-2 px-2  py-1"
                  onClick={() => setStep(s.step)}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold
                          ${
                            isCompleted
                              ? "bg-green-500 text-white"
                              : isActive
                              ? "bg-blue-600 text-white"
                              : "border-2 border-gray-300 text-gray-300"
                          }`}
                  >
                    {s.step}
                  </div>

                  {index !== steps.length && (
                    <div className="w-2px h-8 bg-gray-300 mt-1"></div>
                  )}
                  {s.title}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepperSidebar;
