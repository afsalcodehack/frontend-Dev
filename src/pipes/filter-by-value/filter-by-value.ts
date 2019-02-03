import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByValue',
  pure: false,
})
export class FilterByValuePipe implements PipeTransform {

  transform(items: any, ...args) {
    /*
    @Input
      items: Array of objects
      args[]:
        0: key which should be searched
        1: array of string which needs to be matched with the value corresponding to args[0]

    @Output
      Filtered array of objects based on args
    */
    const key = args[0];
    const values = args[1];

    if (!values || values.length === 0) {
      return items;
    }
    return items.filter((item: any) => values.indexOf(item[key]) > -1);
  }

}
