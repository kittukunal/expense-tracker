import * as yup from "yup";

// Define schemas for login and register
const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const registerSchema = yup.object().shape({
  username: yup.string().min(3, "Username must be at least 3 characters").required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

/**
 * Validates entire form data using schema.
 * @param {object} formData
 * @returns {object} errors (empty if valid)
 */
const validateForm = async (formData) => {
  const schema = formData.username !== undefined ? registerSchema : loginSchema;

  try {
    await schema.validate(formData, { abortEarly: false });
    return {}; // no errors
  } catch (err) {
    const errors = {};
    err.inner.forEach((e) => {
      errors[e.path] = e.message;
    });
    return errors;
  }
};

export default validateForm;
