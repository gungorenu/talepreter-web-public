import { Component, Type } from '@angular/core';
import { TaleVersionSpecificComponent } from '../taleversionspecific';
import { DomSanitizer } from '@angular/platform-browser';
import { VersionService } from '../services/version.service';
import { ActorSummary, groupActorList, GroupSummary } from '../../domain/models/group';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GroupActorComponent } from './groupactor/groupactor.component';
import { ActorComponent } from './actor/actor.component';

@Component({
  selector: 'app-groupsactors',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './groupsactors.component.html',
  styleUrl: './groupsactors.component.scss',
})
export class GroupsActorsComponent extends TaleVersionSpecificComponent {
  selectedGroup = new FormControl<GroupSummary>(null!);
  groups: GroupSummary[] = [];
  operationError: string = '';
  hasError: boolean = false;
  selectedGroupActors: ActorSummary[] = [];
  selectedActor?: ActorSummary;
  actorDetailView?: { component: Type<any>; actorId: string };
  constructor(private versionService: VersionService, doms: DomSanitizer) {
    super(doms);
    this.selectedGroup.valueChanges.subscribe((value) => this.listGroupActors(value!));
  }

  listGroupActors(group: GroupSummary) {
    this.selectedGroupActors = group.Actors.sort((a, b) => (a.Order > b.Order ? 1 : 0));
    if (group.DocumentId != 'Freelancers') {
      const groupActor = this.selectedGroupActors.find((a) => a.DocumentId == group.DocumentId);
      this.selectedActor = groupActor;
      this.actorDetailView = { component: GroupActorComponent, actorId: groupActor!._id };
    } else this.actorDetailView = null!;
  }

  getActors(): void {
    this.groups = [];
    this.selectedActor = null!;
    this.selectedGroupActors = [];
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
    this.versionService.getActors(this.taleId, this.taleVersionId).subscribe({
      next: (data: ActorSummary[]) => {
        this.groups = groupActorList(data);

        var focusedGroup = localStorage?.getItem('world-focusedGroup');
        if (focusedGroup != null) {
          var found = this.groups.find((e) => e.DocumentId == focusedGroup);
          if (found != null) this.selectedGroup.setValue(found);
        }

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
    this.getActors();
  }

  onActorSelected($event: Event, actorId: string, isGroupActor: boolean, groupName?: string) {
    let group: GroupSummary | undefined = undefined;
    let actor: ActorSummary | undefined = undefined;
    if (isGroupActor) {
      group = this.groups.find((g) => g.DocumentId == actorId);
      actor = group!.Actors.find((a) => a.DocumentId == actorId);
    } else if (groupName == null) {
      group = this.groups.find((g) => g.DocumentId == 'Freelancers');
      actor = group!.Actors.find((a) => a.DocumentId == actorId);
    } else {
      group = this.groups.find((g) => g.DocumentId == groupName!);
      actor = group!.Actors.find((a) => a.DocumentId == actorId);
    }
    this.selectedActor = actor!;
    if (this.selectedActor.IsGroupActor) this.actorDetailView = { component: GroupActorComponent, actorId: this.selectedActor._id };
    else this.actorDetailView = { component: ActorComponent, actorId: this.selectedActor._id };
  }
}
