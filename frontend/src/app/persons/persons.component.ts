import { Component } from '@angular/core';
import { TaleVersionSpecificComponent } from '../taleversionspecific';
import { VersionService } from '../services/version.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Person } from '../../domain/models/person';
import { SafePipe } from '../../library/safe';

@Component({
  selector: 'app-persons',
  imports: [ReactiveFormsModule, SafePipe],
  templateUrl: './persons.component.html',
  styleUrl: './persons.component.scss',
})
export class PersonsComponent extends TaleVersionSpecificComponent {
  searchForm = new FormGroup({
    searchPattern: new FormControl(''),
    searchInContent: new FormControl(false),
    skipDead: new FormControl(true),
    skipDummy: new FormControl(true),
    currentChapterOnly: new FormControl(false),
  });
  persons: Person[] = [];
  operationError: string = '';
  hasError: boolean = false;
  constructor(private versionService: VersionService) {
    super();
  }

  ngOnInit() {
    super.onInit();
  }

  searchPersons(sender: string): void {
    this.persons = [];
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
    switch (sender) {
      case 'search':
        this.onSearchPersons(
          this.versionService.searchPersons(
            this.taleId,
            this.taleVersionId,
            this.getSearchPattern(),
            this.getSearchInContent(),
            this.getSkipDead(),
            this.getSkipDummy(),
            this.getSearchInChapter(),
            this.getCurrentChapter()
          )
        );
        break;
      case 'dummies':
        this.onSearchPersons(
          this.versionService.getDummies(this.taleId, this.taleVersionId, this.getSearchPattern(), this.getSearchInContent(), this.getCurrentChapter())
        );
        break;
      case 'deathbed':
        this.onSearchPersons(this.versionService.getDeathbed(this.taleId, this.taleVersionId, this.getWorldToday()));
        break;
      default:
        break;
    }
  }

  onSearchPersons(action: Observable<any>) {
    action.subscribe({
      next: (data: Person[]) => {
        var sorted = data.sort((a, b) => a.DocumentId.localeCompare(b.DocumentId));
        var results: Person[] = [];
        for (let i = 0; i < sorted.length; i++) {
          var person: Person = Object.assign(new Person(), sorted[i]);
          person.decorate(this.getWorldToday(), this.getCurrentChapter());
          results.push(person);
        }
        this.persons = results;
        this.hasError = false;
      },
      error: (error) => {
        this.persons = [];
        this.operationError = error;
        this.hasError = true;
      },
    });
  }

  getDiplomacyStyle(diplomacy: number) {
    return `CF${diplomacy}`;
  }
  getSearchPattern(): string {
    return this.searchForm.controls['searchPattern']?.value ?? '';
  }
  getSearchInContent(): boolean {
    return this.searchForm.controls['searchInContent']?.value ?? false;
  }
  getSkipDead(): boolean {
    return this.searchForm.controls['skipDead']?.value ?? false;
  }
  getSkipDummy(): boolean {
    return this.searchForm.controls['skipDummy']?.value ?? false;
  }
  getSearchInChapter(): number {
    if (this.searchForm.controls['currentChapterOnly']?.value ?? false) {
      return parseInt(localStorage?.getItem('world-currentChapter') ?? '0');
    } else return 0;
  }
  getCurrentChapter(): number {
    return parseInt(localStorage?.getItem('world-currentChapter') ?? '0');
  }
}
