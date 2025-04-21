import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ExpanderComponent } from '../expander/expander.component';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { formatText } from '../../library/string';

@Component({
  selector: 'app-playground',
  imports: [CommonModule, ExpanderComponent],
  templateUrl: './playground.component.html',
  styleUrl: './playground.component.scss',
})
export class PlaygroundComponent {
  header: SafeHtml = '';
  content: SafeHtml = '';
  sampleClean: string = '';
  sampleFormatted: SafeHtml = '';

  constructor(private doms: DomSanitizer) {
    this.sampleClean =
      '*This* text is supposed to be ^formatted^ like below. The ==main== attributes or _tags_ come from `Markdown` style. In **another** application the |text| is shown and ~~previewed~~ with colors and ~every~ content is colorful. to mimic this in here in web, a transformation applies to almost every text';
    this.sampleFormatted = this.safeHtml(formatText(this.sampleClean));
  }

  safeHtml(value: string): SafeHtml {
    return this.doms.bypassSecurityTrustHtml(value);
  }

  ngOnInit(): void {
    this.header = this.safeHtml(formatText('*This* is a ==formatted== text sample, and ~~very unnecessary~~ actually.'));
    this.content = this.safeHtml(formatText('_This_ is a *formatted* text sample, and ^very unnecessary^ actually.'));
  }
}
