import { Pipe, PipeTransform } from '@angular/core';

import { AppTranslateService } from './translate.service';

@Pipe({
  name: 'translate',
  pure: false,
})
export class AppTranslatePipe implements PipeTransform {
  constructor(private readonly translate: AppTranslateService) {}

  public transform(value: string) {
    return !Boolean(value) ? value : this.translate.instant(value);
  }
}
