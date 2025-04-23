import { Component } from '@angular/core';
import { TaleVersionSpecificComponent } from '../../../taleversionspecific';
import { VersionService } from '../../../services/version.service';
import { ActorSummary, decorateGroupSummary, GroupSummary } from '../../../../domain/models/group';
import { SafePipe } from '../../../../library/safe';

@Component({
  selector: 'app-progression-actors',
  templateUrl: './actors.component.html',
  styleUrl: './actors.component.scss',
  imports: [SafePipe],
})
export class ActorsComponent extends TaleVersionSpecificComponent {
  actorSummaries: ActorSummary[] = [];
  operationError: string = '';
  hasError: boolean = false;
  groupChallenge?: string;
  groupCost?: string;
  constructor(private versionService: VersionService) {
    super();
  }

  getGroupSummary(): void {
    this.actorSummaries = [];
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
    const currentGroup = localStorage?.getItem('world-focusedGroup') ?? '';
    if (currentGroup == '') {
      this.operationError = 'No group found';
      this.hasError = true;
      return;
    }

    this.versionService.getGroupSummary(this.taleId, this.taleVersionId, currentGroup).subscribe({
      next: (data: GroupSummary) => {
        decorateGroupSummary(data);
        this.groupChallenge = data.Challenge;
        this.groupCost = data.Cost;
        var sorted = data.Actors.sort((a: any, b: any) => (a.Order > b.Order ? 1 : 0));
        this.actorSummaries = sorted;
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
    this.getGroupSummary();
  }
}
