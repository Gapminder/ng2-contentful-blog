import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'gmToDate'
})
export class ToDatePipe implements PipeTransform {
  public transform(value: string): any {
    if (value) {
      // TODO add check for invalid date
      return new Date(value);
    }
    return undefined;
  }
}
