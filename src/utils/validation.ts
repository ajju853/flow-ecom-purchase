
export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return { isValid: false, message: 'Email is required' };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
};

export const validatePhone = (phone: string): ValidationResult => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  
  if (!phone) {
    return { isValid: false, message: 'Phone number is required' };
  }
  
  if (!phoneRegex.test(phone)) {
    return { isValid: false, message: 'Please enter a valid phone number' };
  }
  
  return { isValid: true };
};

export const validateCardNumber = (cardNumber: string): ValidationResult => {
  const cleanCard = cardNumber.replace(/\s/g, '');
  
  if (!cleanCard) {
    return { isValid: false, message: 'Card number is required' };
  }
  
  if (cleanCard.length !== 16) {
    return { isValid: false, message: 'Card number must be 16 digits' };
  }
  
  if (!/^\d{16}$/.test(cleanCard)) {
    return { isValid: false, message: 'Card number must contain only digits' };
  }
  
  return { isValid: true };
};

export const validateExpiryDate = (expiryDate: string): ValidationResult => {
  if (!expiryDate) {
    return { isValid: false, message: 'Expiry date is required' };
  }
  
  const [month, year] = expiryDate.split('/');
  
  if (!month || !year || month.length !== 2 || year.length !== 2) {
    return { isValid: false, message: 'Please enter date in MM/YY format' };
  }
  
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear() % 100;
  
  const expMonth = parseInt(month, 10);
  const expYear = parseInt(year, 10);
  
  if (expMonth < 1 || expMonth > 12) {
    return { isValid: false, message: 'Invalid month' };
  }
  
  if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
    return { isValid: false, message: 'Card has expired' };
  }
  
  return { isValid: true };
};

export const validateCVV = (cvv: string): ValidationResult => {
  if (!cvv) {
    return { isValid: false, message: 'CVV is required' };
  }
  
  if (cvv.length !== 3) {
    return { isValid: false, message: 'CVV must be 3 digits' };
  }
  
  if (!/^\d{3}$/.test(cvv)) {
    return { isValid: false, message: 'CVV must contain only digits' };
  }
  
  return { isValid: true };
};

export const validateRequired = (value: string, fieldName: string): ValidationResult => {
  if (!value || !value.trim()) {
    return { isValid: false, message: `${fieldName} is required` };
  }
  
  return { isValid: true };
};
