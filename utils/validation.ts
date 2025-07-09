export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email) {
    return { isValid: false, error: 'Email is required' }
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' }
  }
  
  return { isValid: true }
}

export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (!password) {
    return { isValid: false, error: 'Password is required' }
  }
  
  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters long' }
  }
  
  return { isValid: true }
}

export const validateName = (name: string): { isValid: boolean; error?: string } => {
  if (!name) {
    return { isValid: false, error: 'Name is required' }
  }
  
  if (name.length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters long' }
  }
  
  return { isValid: true }
}

export const validateCompany = (company: string): { isValid: boolean; error?: string } => {
  if (!company) {
    return { isValid: false, error: 'Company name is required' }
  }
  
  if (company.length < 2) {
    return { isValid: false, error: 'Company name must be at least 2 characters long' }
  }
  
  return { isValid: true }
}

export const validateSkills = (skills: string[]): { isValid: boolean; error?: string } => {
  if (!skills || skills.length === 0) {
    return { isValid: false, error: 'At least one skill is required' }
  }
  
  if (skills.length > 20) {
    return { isValid: false, error: 'Maximum 20 skills allowed' }
  }
  
  return { isValid: true }
}

export const validateExperience = (years: number): { isValid: boolean; error?: string } => {
  if (years < 0) {
    return { isValid: false, error: 'Experience cannot be negative' }
  }
  
  if (years > 50) {
    return { isValid: false, error: 'Experience cannot exceed 50 years' }
  }
  
  return { isValid: true }
}