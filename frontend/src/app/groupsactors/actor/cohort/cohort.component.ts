import { Component, model, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { Cohort } from '../../../../domain/models/actor';
import { ExpanderComponent } from '../../../expander/expander.component';

@Component({
  selector: 'app-cohort',
  imports: [CommonModule, ExpanderComponent],
  templateUrl: './cohort.component.html',
  styleUrl: './cohort.component.scss',
})
export class CohortComponent implements OnChanges {
  constructor(private doms: DomSanitizer) {}
  cohortModel = model<Cohort>();
  cohortInfo?: Cohort;

  updateCohort() {
    const value = this.cohortModel();
    if (value == null) return;
    // TODO: prepare cohort
    this.cohortInfo = value;
  }

  ngOnInit() {
    this.updateCohort();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.cohortModel.set(changes['cohortModel'].currentValue);
    this.updateCohort();
  }

  safeHtml(value: string): SafeHtml {
    return this.doms.bypassSecurityTrustHtml(value);
  }
}
