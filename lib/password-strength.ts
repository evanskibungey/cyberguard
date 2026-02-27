import type { PasswordStrength, PasswordScore } from './types';

export function evaluatePassword(password: string): PasswordStrength {
  const len = password.length;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const classCount = [hasUpper, hasLower, hasDigit, hasSpecial].filter(Boolean).length;

  let score: PasswordScore;

  if (len === 0) {
    score = 0;
  } else if (len < 6) {
    score = 0;
  } else if (len < 8 || classCount <= 1) {
    score = 1;
  } else if (len < 12 || classCount <= 2) {
    score = 2;
  } else if (len < 14 || classCount < 4) {
    score = 3;
  } else {
    score = 4;
  }

  const labels: Record<PasswordScore, string> = {
    0: 'Weak',
    1: 'Weak',
    2: 'Fair',
    3: 'Good',
    4: 'Strong',
  };

  const tips: string[] = [];

  if (len < 14) {
    tips.push('Use at least 14 characters for a strong password.');
  }
  if (!hasUpper) {
    tips.push('Add uppercase letters (A–Z).');
  }
  if (!hasLower) {
    tips.push('Add lowercase letters (a–z).');
  }
  if (!hasDigit) {
    tips.push('Include numbers (0–9).');
  }
  if (!hasSpecial) {
    tips.push('Include special characters (!, @, #, $, etc.).');
  }
  if (len >= 14 && classCount === 4 && tips.length === 0) {
    tips.push('Great password! Consider using a password manager to keep it safe.');
  }

  return { score, label: labels[score], tips };
}
