import { CommonModule } from '@angular/common';
import { Component, model, ViewEncapsulation } from '@angular/core';
import { Anecdote, decorateAnecdote, expandAnecdotesFromQuery, populateAnecdotesFromQuery } from '../../../domain/models/anecdote';
import { VersionService } from '../../services/version.service';
import { TaleVersionSpecificComponent } from '../../taleversionspecific';
import { SafePipe } from '../../../library/safe';

@Component({
  selector: 'app-anecdote',
  imports: [CommonModule, SafePipe],
  templateUrl: './anecdote.component.html',
  styleUrls: ['./anecdote.component.scss', '../../../styles.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
// this component is copy of expander but it has some more complicated stuff to do so it is a separate component, not an expansion of expander
// for sure same expander could be used here
export class AnecdoteComponent extends TaleVersionSpecificComponent {
  data = model<Anecdote>();
  roots = model<Anecdote[]>();
  checked: boolean = false;
  operationError: string = '';
  hasError: boolean = false;

  constructor(private versionService: VersionService) {
    super();
  }

  ngOnInit(): void {
    super.onInit();
    this.checked = this.data()?.Expanded ?? false;
  }

  fetchAnecdote(anecdoteId: string): void {
    this.operationError = '';
    this.hasError = false;

    if (this.taleId === null) {
      this.operationError = 'Invalid tale id';
      this.hasError = true;
      return;
    }
    if (this.taleVersionId === null) {
      this.operationError = 'Invalid tale version id';
      this.hasError = true;
      return;
    }

    this.versionService.expandAnecdote(this.taleId, this.taleVersionId, anecdoteId).subscribe({
      next: (data: Anecdote[]) => {
        data.forEach((a) => decorateAnecdote(a, this.getWorldEra(), false, true));
        expandAnecdotesFromQuery(this.roots()!, data);
      },
      error: (error) => {
        this.operationError = error;
        this.hasError = true;
        console.error('Anecdote could not fetch from server');
        console.error(error);
      },
    });
  }

  changed(event: Event) {
    this.checked = !this.checked;
    const model = this.data();
    if (model != null) {
      model.Expanded = this.checked;
      if (model.Fetched != true) {
        model.Fetched = true;
        this.fetchAnecdote(model._id);
      }
    }
  }

  hasChildren(): boolean {
    const model = this.data();
    if (model == undefined) return false;
    if (model.Children == undefined || model.Children.length == 0) return false;
    return model.Children.length > 0;
  }
}
