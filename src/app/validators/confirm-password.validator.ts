import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const confirmPasswordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const isEquals =
    control.value.new_password === control.value.new_password_confirmation;
  return isEquals ? null : { PasswordNoMatch: true };
};
