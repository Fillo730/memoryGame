const PASSWORD_LIMITS = {
  minLength: 8,
  maxLength: 99,
  minNumbers: 0,
  minSpecialCharacters: 0,
};

const USERNAME_LIMITS = {
  minLength: 3,
  maxLength: 20,
};

const NAME_LIMITS = {
  minLength: 1,
  maxLength: 20,
};

function checkPassword(password) {
  if (
    password.length < PASSWORD_LIMITS.minLength ||
    password.length > PASSWORD_LIMITS.maxLength
  ) {
    return {
      valid: false,
      message: `Password must be between ${PASSWORD_LIMITS.minLength} and ${PASSWORD_LIMITS.maxLength} characters.`,
    };
  }

  const numbers = '0123456789';
  const specialCharacters = '!@#$%^&*()_+[]{}|;:,.<>?';

  let numberCount = 0;
  let specialCharacterCount = 0;

  for (let i = 0; i < password.length; i++) {
    if (numbers.includes(password[i])) {
      numberCount++;
    } else if (specialCharacters.includes(password[i])) {
      specialCharacterCount++;
    }
  }

  if (numberCount < PASSWORD_LIMITS.minNumbers) {
    return {
      valid: false,
      message: `Password must contain at least ${PASSWORD_LIMITS.minNumbers} number${PASSWORD_LIMITS.minNumbers > 1 ? 's' : ''}.`,
    };
  }

  if (specialCharacterCount < PASSWORD_LIMITS.minSpecialCharacters) {
    return {
      valid: false,
      message: `Password must contain at least ${PASSWORD_LIMITS.minSpecialCharacters} special character${PASSWORD_LIMITS.minSpecialCharacters > 1 ? 's' : ''}.`,
    };
  }

  return { valid: true, message: '' };
}

function checkUsername(username) {
  const regex = new RegExp(
    `^[a-zA-Z0-9_]{${USERNAME_LIMITS.minLength},${USERNAME_LIMITS.maxLength}}$`
  );

  if (!regex.test(username)) {
    return {
      valid: false,
      message: `Username must be ${USERNAME_LIMITS.minLength}-${USERNAME_LIMITS.maxLength} characters and can only contain letters, numbers, underscores.`,
    };
  }

  return { valid: true, message: '' };
}

function checkName(name) {
  const regex = new RegExp(
    `^[a-zA-Z0-9]{${NAME_LIMITS.minLength},${NAME_LIMITS.maxLength}}$`
  );

  if(!regex.test(name)) {
    return {
      valid: false,
      message: `Names must be ${NAME_LIMITS.minLength}-${NAME_LIMITS.maxLength} characters and can only contain letters.`,
    };
  }

  return { valid: true, message: '' };
}

export { checkPassword, checkUsername, checkName };