export class ValidationError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function isValidRoleName(roleName: string) {
  if (!roleName) {
    throw new ValidationError('空文字は無理');
  }
  if (roleName.length < 2) {
    throw new ValidationError('短すぎ');
  }
  if (roleName.length > 10) {
    throw new ValidationError('長すぎ');
  }
  if (/[@#:```\n\r\t<>&"'\\]/.test(roleName)) {
    throw new ValidationError('その文字は無理');
  }
}
