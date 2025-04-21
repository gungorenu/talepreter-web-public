import { CommonModule } from '@angular/common';
import { Component, model, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-expander',
  imports: [CommonModule],
  templateUrl: './expander.component.html',
  styleUrls: ['./expander.component.scss', '../../styles.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class ExpanderComponent {
  shift = model(false);
  leftMargin = `0px`;

  ngOnInit(): void {
    this.leftMargin = `${this.shift() ? 34 : 0}px`;
  }
}
