import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'

@ValidatorConstraint({ name: 'IsValidEmail', async: false })
export default class IsValidEmail implements ValidatorConstraintInterface {
  validate(value: string) {
    // RFC 5321 limit
    if (value.length > 254) return false;

    // Split local and domain parts
    const parts = value.split('@');
    if (parts.length !== 2) return false;

    const [localPart, domainPart] = parts;

    // RFC 5321 limits
    if (localPart.length > 64 || domainPart.length > 255) return false;

    // RFC 5322 compatible regex (simplified but effective)
    const emailRegex =
      /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|(?:\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)]))$/;

    return emailRegex.test(value);
  }

  defaultMessage() {
    return 'Email must be valid'
  }
}
