import Joi from 'joi';

const today = new Date();
const maxDate = new Date(today.toISOString().split('T')[0]);
const minDate = new Date(today);
minDate.setFullYear(today.getFullYear() - 120);
maxDate.setFullYear(today.getFullYear() - 18);
//console.log(maxDate, minDate);
const userRegisterSchema = Joi.object({
  firstName: Joi.string().required().trim().min(3).max(16),
  lastName: Joi.string().required().trim().min(3).max(16),
  // .pattern(/^[9][0-9]{9}$/)
  // phone: Joi.number().required().min(10).max(10).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  phone: Joi.string()
    .pattern(/^9\d{9}$/) // Must start with '9' followed by 9 digits
    .length(10) // Ensure the total length is 10
    .required(),
  dateOfBirth: Joi.date().optional().min(minDate).max(maxDate),
  age: Joi.number().optional().min(18).max(120),
  username: Joi.string().required().trim().alphanum().min(3).max(30),
  email: Joi.string().required().trim().email(),
  password: Joi.string().required().min(8),
}).custom((value, helpers) => {
  const { dateOfBirth, age } = value;

  if (!dateOfBirth && !age) {
    return helpers.error('any.required', {
      message: 'Either dateOfBirth or age must be provided.',
    });
  }
  if (dateOfBirth) {
    const dob = new Date(dateOfBirth);
    var calculatedAge = today.getFullYear() - dob.getFullYear();
    if (today < new Date(dob.setFullYear(dob.getFullYear() + calculatedAge))) {
      calculatedAge--;
    }
  }
  // return value explicitly.
  return value;
});

const userLoginSchema = Joi.object({
  username: Joi.string().required().trim().alphanum().min(3).max(30),
  password: Joi.string().required().min(8),
});

export { userRegisterSchema, userLoginSchema };
