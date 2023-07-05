#!/usr/bin/node

function generatePassword(length, options = {}) {
    const {
      uppercase = true,
      lowercase = true,
      digits = true,
      symbols = true,
      exclude = ''
    } = options;

    let characters = '';
    if (uppercase) characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lowercase) characters += 'abcdefghijklmnopqrstuvwxyz';
    if (digits) characters += '0123456789';
    if (symbols) characters += '!@#$%^&*()_+-={}[]|:;"<>,.?/~';

    characters = characters.replace(new RegExp(`[${exclude}]`, 'g'), '');

    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }

    return password;
}

function validatePassword(password) {
    const passwordStrength = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      digit: /\d/.test(password),
      symbol: /[!@#$%^&*()_+-={}[\]|:;"<>,.?/~]/.test(password)
    };
    const isValid = Object.values(passwordStrength).every((value) => value === true);

    return isValid;
}


module.exports = {generatePassword, validatePassword};