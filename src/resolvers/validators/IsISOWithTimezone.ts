import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { DateTime } from 'luxon'

@ValidatorConstraint({ name: 'IsISOWithTimezone', async: false })
export default class IsISOWithTimezone implements ValidatorConstraintInterface {
  validate(value: string) {
    const dt = DateTime.fromISO(value, { setZone: true })
    return dt.isValid && !!dt.zoneName
  }

  defaultMessage() {
    return 'Date must be a valid ISO string with timezone information'
  }
}
