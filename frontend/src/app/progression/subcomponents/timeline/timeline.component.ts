import { Component } from '@angular/core';
import { TaleVersionSpecificComponent } from '../../../taleversionspecific';
import { populateWorldTimelineNotes, TimelineNote, WorldChapters } from '../../../../domain/models/world';
import { VersionService } from '../../../services/version.service';
import { SafePipe } from '../../../../library/safe';

@Component({
  selector: 'app-progression-timeline',
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
  imports: [SafePipe],
})
export class TimelineComponent extends TaleVersionSpecificComponent {
  notes: TimelineNote[] = [];
  operationError: string = '';
  hasError: boolean = false;
  constructor(private versionService: VersionService) {
    super();
  }

  getTimeline(): void {
    this.notes = [];
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

    this.versionService.getTimeline(this.taleId, this.taleVersionId).subscribe({
      next: (data: WorldChapters) => {
        this.notes = populateWorldTimelineNotes(data);
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
    this.getTimeline();
  }
}
