import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat'
})
export class NumberFormatPipe implements PipeTransform {

  transform(value: number): string {
    if (!value && value !== 0) {
      return '';
    }
    // Convert number to string and split into integer and fractional parts
    let [integer, fraction = '00'] = value.toFixed(2).split('.');

    // Use regex to format integer part
    integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Return formatted number
    return `${integer},${fraction}`;
  }

}
