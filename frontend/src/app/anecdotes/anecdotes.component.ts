import { Component } from '@angular/core';
import { TaleVersionSpecificComponent } from '../taleversionspecific';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Anecdote, AnecdoteSearchResult, decorateAnecdote, populateAnecdotesFromQuery, populateAnecdotesFromSearch } from '../../domain/models/anecdote';
import { RadioGroupComponent, RadioGroupItem } from '../radiogroup/radiogroup.component';
import { AnecdoteComponent } from './anecdote/anecdote.component';
import { VersionService } from '../services/version.service';
import { NumberRestricDirective } from '../../library/numeric';

@Component({
  selector: 'app-anecdotes',
  imports: [ReactiveFormsModule, RadioGroupComponent, AnecdoteComponent, NumberRestricDirective],
  templateUrl: './anecdotes.component.html',
  styleUrl: './anecdotes.component.scss',
})
export class AnecdotesComponent extends TaleVersionSpecificComponent {
  searchForm = new FormGroup({
    searchPattern: new FormControl(''),
    searchInContent: new FormControl(false),
    searchInChapter: new FormControl(0, Validators.pattern('[0-9]+')),
  });
  loadChoices: RadioGroupItem[] = [];
  roots: Anecdote[] = [];
  operationError: string = '';
  hasError: boolean = false;
  loadChoice: number = -1;

  constructor(private versionService: VersionService) {
    super();
    this.loadChoices.push(new RadioGroupItem(0, 'Load On Expand'));
    this.loadChoices.push(new RadioGroupItem(1, 'Search'));
  }

  ngOnInit() {
    super.onInit();
  }

  onLoadRoots() {
    this.roots = [];
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
    this.versionService.getRootAnecdotes(this.taleId, this.taleVersionId).subscribe({
      next: (data: Anecdote[]) => {
        data.forEach((a) => decorateAnecdote(a, this.getWorldEra(), false, true));
        populateAnecdotesFromQuery(this.roots, data);
        this.hasError = false;
      },
      error: (error) => {
        this.operationError = error;
        this.hasError = true;
      },
    });
  }

  onSearchAnecdote() {
    this.roots = [];
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
    const searchPattern = this.getSearchPattern();
    if (searchPattern.length < 3) {
      this.operationError = 'Search pattern is too short';
      this.hasError = true;
      console.log('Search pattern is too short');
      return;
    }
    this.versionService
      .searchAnecdotes(this.taleId, this.taleVersionId, this.getSearchPattern(), this.getSearchInContent(), this.getSearchInChapter())
      .subscribe({
        next: (data: AnecdoteSearchResult) => {
          console.log(data);
          data.Parents.forEach((a) => decorateAnecdote(a, this.getWorldEra(), true, true));
          data.Results.forEach((a) => decorateAnecdote(a, this.getWorldEra(), true, true));
          populateAnecdotesFromSearch(this.roots, data);
          console.log(this.roots);
          this.hasError = false;
        },
        error: (error) => {
          this.operationError = error;
          this.hasError = true;
        },
      });
  }

  getSearchPattern(): string {
    return this.searchForm.controls['searchPattern']?.value ?? '';
  }
  getSearchInContent(): boolean {
    return this.searchForm.controls['searchInContent']?.value ?? false;
  }
  getSearchInChapter(): number {
    const value = this.searchForm.controls['searchInChapter']?.value;
    if (value == null) return 0;
    else return parseInt(value + '');
  }
}
