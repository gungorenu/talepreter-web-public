import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl } from '@angular/platform-browser';
import { formatText } from './string';

@Pipe({
  name: 'safe',
})
export class SafePipe implements PipeTransform {
  constructor(protected _sanitizer: DomSanitizer) {}
  transform(value: string | undefined, type: string = 'html'): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
    if (value == undefined) return '';

    const formatted = formatText(value);

    switch (type) {
      case 'style':
        return this._sanitizer.bypassSecurityTrustStyle(formatted);
      case 'script':
        return this._sanitizer.bypassSecurityTrustScript(formatted);
      case 'url':
        return this._sanitizer.bypassSecurityTrustUrl(formatted);
      case 'resourceUrl':
        return this._sanitizer.bypassSecurityTrustResourceUrl(formatted);
      case 'html':
      default:
        return this._sanitizer.bypassSecurityTrustHtml(formatted);
    }
  }
}
