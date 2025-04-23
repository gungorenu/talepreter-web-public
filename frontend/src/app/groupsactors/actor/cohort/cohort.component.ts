import { Component, model, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cohort } from '../../../../domain/models/actor';
import { ExpanderComponent } from '../../../expander/expander.component';
import { SafePipe } from '../../../../library/safe';

@Component({
  selector: 'app-cohort',
  imports: [CommonModule, ExpanderComponent, SafePipe],
  templateUrl: './cohort.component.html',
  styleUrl: './cohort.component.scss',
})
export class CohortComponent implements OnChanges {
  cohortModel = model<Cohort>();
  cohortInfo?: Cohort;

  updateCohort() {
    const value = this.cohortModel();
    if (value == null) return;
    this.cohortInfo = value;
  }

  ngOnInit() {
    this.updateCohort();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.cohortModel.set(changes['cohortModel'].currentValue);
    this.updateCohort();
  }
}
