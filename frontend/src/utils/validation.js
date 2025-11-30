// Validation utility functions

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@nie\.ac\.in$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  if (!phone || !phone.trim()) return true; // Optional field
  const phoneRegex = /^[\+]?[1-9][\d]{0,3}[\s\-\.]?[\(]?[\d]{1,3}[\)]?[\s\-\.]?[\d]{1,4}[\s\-\.]?[\d]{1,4}[\s\-\.]?[\d]{0,9}$/;
  return phoneRegex.test(phone.trim());
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateName = (name) => {
  return name && name.trim().length >= 2 && name.trim().length <= 50;
};

export const validateTitle = (title) => {
  return title && title.trim().length >= 3 && title.trim().length <= 100;
};

export const validateDescription = (description) => {
  return description && description.trim().length >= 10 && description.trim().length <= 1000;
};

export const validateLocation = (location) => {
  return location && location.trim().length >= 3 && location.trim().length <= 200;
};

export const validateContact = (contact) => {
  if (!contact || !contact.trim()) return true; // Optional field
  return validateEmail(contact) || validatePhone(contact);
};

export const validateDate = (date) => {
  if (!date) return true; // Optional field
  const inputDate = new Date(date);
  const today = new Date();
  return inputDate <= today;
};

export const validateReward = (reward) => {
  if (!reward) return true; // Optional field
  const num = parseFloat(reward);
  return !isNaN(num) && num >= 0 && num <= 10000;
};

export const validateTag = (tag) => {
  return tag && tag.trim().length <= 30;
};

export const validateTags = (tagsString) => {
  if (!tagsString || !tagsString.trim()) return true; // Optional field
  const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
  return tags.every(validateTag);
};

export const validateHiddenDetails = (hiddenDetails) => {
  return hiddenDetails && hiddenDetails.trim().length >= 10 && hiddenDetails.trim().length <= 500;
};

// Comprehensive form validation
export const validateUserRegistration = (formData) => {
  const errors = {};
  
  if (!validateName(formData.name)) {
    errors.name = 'Name must be between 2 and 50 characters';
  }
  
  if (!validateEmail(formData.email)) {
    errors.email = 'Email must end with @nie.ac.in';
  }
  
  if (!validatePassword(formData.password)) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  if (!validatePhone(formData.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }
  
  if (!validateDate(formData.dateOfBirth)) {
    errors.dateOfBirth = 'Date of birth cannot be in the future';
  }
  
  return errors;
};

export const validateItemForm = (formData) => {
  const errors = {};
  
  if (!validateTitle(formData.title)) {
    errors.title = 'Title must be between 3 and 100 characters';
  }
  
  if (!validateDescription(formData.description)) {
    errors.description = 'Description must be between 10 and 1000 characters';
  }
  
  if (!validateLocation(formData.location)) {
    errors.location = 'Location must be between 3 and 200 characters';
  }
  
  if (!validateContact(formData.contact)) {
    errors.contact = 'Contact must be a valid email or phone number';
  }
  
  if (!validateDate(formData.dateLostFound)) {
    errors.dateLostFound = 'Date cannot be in the future';
  }
  
  if (!validateReward(formData.reward)) {
    errors.reward = 'Reward must be a positive number up to $10,000';
  }
  
  if (!validateTags(formData.tags)) {
    errors.tags = 'Each tag must be 30 characters or less';
  }
  
  if (!validateHiddenDetails(formData.hiddenDetails)) {
    errors.hiddenDetails = 'Hidden details must be between 10 and 500 characters';
  }
  
  return errors;
};

// Real-time validation for better UX
export const getFieldError = (fieldName, value, formData = {}) => {
  switch (fieldName) {
    case 'name':
      return validateName(value) ? '' : 'Name must be between 2 and 50 characters';
    case 'email':
      return validateEmail(value) ? '' : 'Email must end with @nie.ac.in';
    case 'password':
      return validatePassword(value) ? '' : 'Password must be at least 6 characters';
    case 'confirmPassword':
      return value === formData.password ? '' : 'Passwords do not match';
    case 'phone':
      return validatePhone(value) ? '' : 'Please enter a valid phone number';
    case 'title':
      return validateTitle(value) ? '' : 'Title must be between 3 and 100 characters';
    case 'description':
      return validateDescription(value) ? '' : 'Description must be between 10 and 1000 characters';
    case 'location':
      return validateLocation(value) ? '' : 'Location must be between 3 and 200 characters';
    case 'contact':
      return validateContact(value) ? '' : 'Contact must be a valid email or phone number';
    case 'dateLostFound':
    case 'dateOfBirth':
      return validateDate(value) ? '' : 'Date cannot be in the future';
    case 'reward':
      return validateReward(value) ? '' : 'Reward must be a positive number up to $10,000';
    case 'tags':
      return validateTags(value) ? '' : 'Each tag must be 30 characters or less';
    case 'hiddenDetails':
      return validateHiddenDetails(value) ? '' : 'Hidden details must be between 10 and 500 characters';
    default:
      return '';
  }
};