import { Component, model, OnChanges, SimpleChanges } from '@angular/core';
import { TaleVersionSpecificComponent } from '../../taleversionspecific';
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
import { SafePipe } from '../../../library/safe';

@Component({
  selector: 'app-actor',
  imports: [CommonModule, ExpanderComponent, CohortComponent, SafePipe],
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
  constructor(private versionService: VersionService) {
    super();
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
        this.actorProperties = populateActorProperties(data);
        this.actorInventory = prepareActorInventory(data);
        this.cohorts = prepareActorCohorts(data);
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
