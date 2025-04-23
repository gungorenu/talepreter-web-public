import { CommonModule } from '@angular/common';
import { Component, model, output } from '@angular/core';
import { SafePipe } from '../../library/safe';

export class RadioGroupItem {
  constructor(value: number, header: string) {
    this.Value = value;
    this.Header = header;
  }
  Value: number = 0;
  Header: string = '';
  get optionId() {
    return `option${this.Value}`;
  }
}

@Component({
  selector: 'app-radiogroup',
  imports: [CommonModule, SafePipe],
  templateUrl: './radiogroup.component.html',
  styleUrl: './radiogroup.component.scss',
})
export class RadioGroupComponent {
  items = model([] as RadioGroupItem[]);
  choice = model(-1);
  choiceChanged = output<RadioGroupItem | undefined>();

  onChange(option: number) {
    this.choice.update(() => option);
    const selected = this.items().find((x) => x.Value == option);
    this.choiceChanged.emit(selected);
  }
}
