import { Component } from '@angular/core';
import { TaleVersionSpecificComponent } from '../taleversionspecific';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-anecdotes',
  imports: [],
  templateUrl: './anecdotes.component.html',
  styleUrl: './anecdotes.component.scss',
})
export class AnecdotesComponent extends TaleVersionSpecificComponent {
  constructor(doms: DomSanitizer) {
    super(doms);
  }

  ngOnInit() {
    super.onInit();
  }
}
