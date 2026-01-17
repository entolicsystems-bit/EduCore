import uploadImage from "/uploadFile.png";

// Render a dynamic form fields based on FORM_STEP config
const DynamicForm = ({ config, formData, onChange, onBlur, errors }) => {
  return (
    //2 column responsive grid
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Loop through all fields of cuurent form step */}
      {config.fields.map((field) => {
        const value = formData?.[config.section]?.[field.name] || "";

        // SELECT (dropdown)
        if (field.type === "select") {
          return (
            <div key={field.name}>
              <label className="label">{field.label}</label>
              <select
                value={value}
                onChange={(e) =>
                  onChange(config.section, field.name, e.target.value)
                }
                onBlur={() => onBlur(config.section, field.name)}
                className="border rounded-md px-3 py-1 w-full"
              >
                <options value="">{field.placeholder || "Select"}</options>

                <option value="">Select</option>
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>

              {errors?.[field.name] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors[field.name]}
                </p>
              )}
            </div>
          );
        }

        // textarea
        if (field.type === "textarea") {
          return (
            <div key={field.name} className="col-span-1 md:col-span-2">
              <label className="label">{field.label}</label>
              <textarea
                value={value}
                placeholder={field.placeholder || ""}
                maxLength={field.maxLength}
                className="border resize-none rounded-md px-3 py-1 w-full"
                rows={4}
                onChange={(e) =>
                  onChange(config.section, field.name, e.target.value)
                }
                onBlur={() => onBlur(config.section, field.name)}
              ></textarea>
              {errors?.[field.name] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors[field.name]}
                </p>
              )}
            </div>
          );
        }

        // file Upload
        if (field.type === "file") {
          const file = formData?.[config.section]?.[field.name];

          // Special case for guardian ID upload
          if (field.name === "guardianId") {
            return (
              <div className="col-start-2">
                <label className="label">{field.label}</label>

                <label className="border rounded-md w-full h-28 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                  {/* Upload Icon */}
                  <img
                    src={uploadImage}
                    alt=""
                    className="h-8 w-8 text-blue-500 mb-1"
                  />
                  <p className="text-sm text-gray-500">Tap to Import</p>
                  {value && (
                    <p className="text-xs text-gray-400 mt-1">{value.name}</p>
                  )}
                  {/* Hidden file input */}
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      onChange(config.section, field.name, e.target.files[0])
                    }
                    onBlur={() => onBlur(config.section, field.name)}
                  />
                </label>
              </div>
            );
          }

          return (
            <div
              key={field.name}
              className="col-span-1 md:col-span-2 border rounded-xl md:w-140 px-4 py-2 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center rounded-md border">
                  {file ? (
                    <i className="ri-check-line text-green-600 text-xl"></i>
                  ) : (
                    <i className="ri-file-text-line text-blue-500 text-xl"></i>
                  )}
                </div>

                <div>
                  <p className="text-sm">{field.label}</p>
                  <p className="text-sm text-gray-400">
                    {file ? "Uploaded" : "Pending"}
                  </p>
                </div>
              </div>

              <div>
                <input
                  type="file"
                  id={field.name}
                  accept={field.accept}
                  hidden
                  onChange={(e) => {
                    const selectedFile = e.target.files[0];
                    if (!selectedFile) return;

                    // 2MB limit
                    if (selectedFile.size > 2 * 1024 * 1024) {
                      alert("File must be less than 2MB");
                      return;
                    }

                    // type validation
                    if (
                      field.accept &&
                      !field.accept.includes(selectedFile.type)
                    ) {
                      alert("Invalid file type");
                      return;
                    }

                    onChange(config.section, field.name, selectedFile);
                  }}
                />

                {file ? (
                  <button
                    type="button"
                    className="px-4 py-1.5 text-sm rounded-md border text-green-600 hover:bg-green-50"
                    onClick={() => {
                      const url = URL.createObjectURL(file);
                      window.open(url, "_blank");
                    }}
                  >
                    View
                  </button>
                ) : (
                  <button
                    type="button"
                    className="px-4 py-1.5 text-sm rounded-md border bg-gray-100 hover:bg-gray-200 text-gray-600"
                    onClick={() => document.getElementById(field.name).click()}
                  >
                    Upload Now
                  </button>
                )}
              </div>

              {errors?.[field.name] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors[field.name]}
                </p>
              )}
            </div>
          );
        }

        // special case for street address to span 2 columns
        if (field.name === "street") {
          return (
            <div key={field.name} className="col-span-1 md:col-span-2">
              <label className="label">{field.label}</label>
              <input
                type={field.type}
                value={value}
                placeholder={field.placeholder || ""}
                maxLength={field.maxLength}
                className="border rounded-md px-3 py-1 w-full"
                onChange={(e) =>
                  onChange(config.section, field.name, e.target.value)
                }
                onBlur={() => onBlur(config.section, field.name)}
              />
              {errors?.[field.name] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors[field.name]}
                </p>
              )}
            </div>
          );
        }

        // Normal INPUT
        return (
          <div key={field.name}>
            <label className="label">{field.label}</label>

            <input
              type={field.type}
              value={value}
              placeholder={field.placeholder || ""}
              maxLength={field.maxLength}
              className="border rounded-md px-3 py-1 w-full"
              onChange={(e) =>
                onChange(config.section, field.name, e.target.value)
              }
              onBlur={() => onBlur(config.section, field.name)}
            />

            {errors?.[field.name] && (
              <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DynamicForm;
