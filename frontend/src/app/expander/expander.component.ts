import { CommonModule } from '@angular/common';
import { Component, model, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-expander',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './expander.component.html',
  styleUrls: ['./expander.component.scss', '../../styles.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class ExpanderComponent {
  shift = model(false);
  leftMargin = `0px`;
  //  this control is too fishy, it does not work in other setups but only with this combined method of two properties, due to custom checkbox style I believe because in a normal checkbox everything works as it should
  open = model(false);
  checked: boolean = false;

  ngOnInit(): void {
    this.leftMargin = `${this.shift() ? 34 : 0}px`; // bad idea to use hardcoded value but no escape from it
    this.checked = this.open();
  }

  changed(event: Event) {
    this.checked = !this.checked;
    this.open.update(() => this.checked);
  }
}
