const DynamicForm = ({ config, formData, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {config.fields.map((field) => {
        const value = formData[config.section]?.[field.name] || "";

        if (field.type === "select") {
          return (
            <div key={field.name}>
              <label className="label">{field.label}</label>
              <select
                value={value}
                onChange={(e) =>
                  onChange(config.section, field.name, e.target.value)
                }
                className="border rounded-md px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500;"
              >
                <option value="">Select</option>
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        if (field.type === "textarea") {
          return (
            <div key={field.name} className="col-span-1 md:col-span-2">
              <label className="label">{field.label}</label>
              <textarea
                className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500;"
                value={value}
                onChange={(e) =>
                  onChange(config.section, field.name, e.target.value)
                }
              />
            </div>
          );
        }

        if (field.type === "file") {
          return (
            <div
              key={field.name}
              className="col-span-1 md:col-span-2 border rounded-xl px-4 py-2 flex items-center justify-between"
            >
              {/* LEFT */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center rounded-md border">
                  {formData[config.section]?.[field.name] ? (
                    <i className="ri-check-line text-green-600 text-xl"></i>
                  ) : (
                    <i className="ri-file-text-line text-blue-500 text-xl"></i>
                  )}
                </div>

                <div>
                  <p className="text-sm">{field.label}</p>
                  <p className="text-sm text-gray-400">
                    {formData[config.section]?.[field.name]
                      ? "Uploaded"
                      : "Pending"}
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <div>
                <input
                  type="file"
                  id={field.name}
                  accept={field.accept}
                  hidden
                  onChange={(e) =>
                    onChange(config.section, field.name, e.target.files[0])
                  }
                />

                {formData[config.section]?.[field.name] ? (
                  <button
                    type="button"
                    className="px-4 py-1.5 text-sm rounded-md border text-green-600 hover:bg-green-50"
                    onClick={() =>
                      window.open(
                        URL.createObjectURL(
                          formData[config.section][field.name]
                        )
                      )
                    }
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
            </div>
          );
        }

        return (
          <div key={field.name}>
            <label className="label">{field.label}</label>
            <input
              type={field.type}
              className="border rounded-md px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500;"
              value={value}
              maxLength={field.maxLength}
              onChange={(e) =>
                onChange(config.section, field.name, e.target.value)
              }
            />
          </div>
        );
      })}
    </div>
  );
};

export default DynamicForm;
