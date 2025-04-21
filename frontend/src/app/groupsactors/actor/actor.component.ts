import { Component, model, OnChanges, SimpleChanges } from '@angular/core';
import { TaleVersionSpecificComponent } from '../../taleversionspecific';
import { DomSanitizer } from '@angular/platform-browser';
import { VersionService } from '../../services/version.service';
import { CommonModule } from '@angular/common';
import {
  Actor,
  ActorInventory,
  ActorProperty,
  Cohort,
  populateActorProperties,
  prepareActorCohorts,
  prepareActorInventory,
} from '../../../domain/models/actor';
import { ExpanderComponent } from '../../expander/expander.component';
import { CohortComponent } from './cohort/cohort.component';

@Component({
  selector: 'app-actor',
  imports: [CommonModule, ExpanderComponent, CohortComponent],
  templateUrl: './actor.component.html',
  styleUrl: './actor.component.scss',
})
export class ActorComponent extends TaleVersionSpecificComponent implements OnChanges {
  operationError: string = '';
  hasError: boolean = false;
  actorId = model('');
  actorProperties: ActorProperty[] = [];
  actorInventory: ActorInventory = new ActorInventory();
  cohorts: Cohort[] = [];
  constructor(private versionService: VersionService, doms: DomSanitizer) {
    super(doms);
  }

  getActor(): void {
    this.actorProperties = [];
    this.cohorts = [];
    this.actorInventory = new ActorInventory();
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
    this.versionService.getActorDetails(this.taleId, this.taleVersionId, this.actorId()).subscribe({
      next: (data: Actor) => {
        this.actorProperties = populateActorProperties(data, (s) => this.safeHtml(s));
        this.actorInventory = prepareActorInventory(data, (s) => this.safeHtml(s));
        this.cohorts = prepareActorCohorts(data, (s) => this.safeHtml(s));
        this.hasError = false;
      },
      error: (error) => {
        this.operationError = error;
        this.hasError = true;
      },
    });
  }

  ngOnInit() {
    super.onInit();
    this.getActor();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.actorId.set(changes['actorId'].currentValue);
    this.getActor();
  }
}
