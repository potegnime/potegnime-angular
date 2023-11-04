import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'date1337x'
})
export class Date1337xPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) {
      return value;
    }
    // Expected format from 1337x: Sep. 26th '23
    const dateParts = value.split(' ');
    const day = dateParts[1].slice(0, -2);
    const month = dateParts[0].slice(0, -1);
    const year = dateParts[2].substring(1);

    const date = new Date(`${month} ${day}, ${year}`);
    return date.toLocaleDateString('sl-SI', { day: 'numeric', month: 'numeric', year: 'numeric' })
      .replace(/\s/g, '');


  }
}