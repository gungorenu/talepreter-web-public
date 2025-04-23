import { Component, model, OnChanges, SimpleChanges } from '@angular/core';
import { TaleVersionSpecificComponent } from '../../taleversionspecific';
import { VersionService } from '../../services/version.service';
import { CommonModule } from '@angular/common';
import {
  GroupActor,
  GroupActorProperty,
  populateGroupActorProperties,
  GroupActorInventory,
  populateGroupActorInventory,
} from '../../../domain/models/groupactor';
import { ExpanderComponent } from '../../expander/expander.component';
import { SafePipe } from '../../../library/safe';

@Component({
  selector: 'app-groupactor',
  imports: [CommonModule, ExpanderComponent, SafePipe],
  templateUrl: './groupactor.component.html',
  styleUrl: './groupactor.component.scss',
})
export class GroupActorComponent extends TaleVersionSpecificComponent implements OnChanges {
  operationError: string = '';
  hasError: boolean = false;
  actorId = model('');
  groupActorProperties: GroupActorProperty[] = [];
  groupActorInventory: GroupActorInventory = new GroupActorInventory('', '');
  constructor(private versionService: VersionService) {
    super();
  }

  getGroupActor(): void {
    this.groupActorProperties = [];
    this.groupActorInventory = new GroupActorInventory('', '');
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
    const groupName = this.actorId().replace('Actor:', '');
    this.versionService.getGroupActorDetails(this.taleId, this.taleVersionId, groupName).subscribe({
      next: (data: GroupActor) => {
        this.groupActorProperties = populateGroupActorProperties(data);
        this.groupActorInventory = populateGroupActorInventory(data);
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
    this.getGroupActor();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.actorId.set(changes['actorId'].currentValue);
    this.getGroupActor();
  }
}
