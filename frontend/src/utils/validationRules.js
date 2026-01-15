export const validationRules = {
    required: (values) =>
        values && values.toString().trim() !== "" ? "" : "this field is required",
}