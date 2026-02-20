import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'score',
  standalone: true
})
export class ScorePipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined) return 'N/A';
    return value.toFixed(1);
  }
}
