import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gender',
})
export class GenderPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    switch (value) {
      case 'male':
        return 'Home';
      case 'female':
        return 'Dona';
      case 'others':
        return 'Altres';
      case 'non-binary':
        return 'No binari';
      case 'prefer-not-to-say':
        return 'Preferixo no dir-ho';
      default:
        return 'Errors';
    }
  }
}
