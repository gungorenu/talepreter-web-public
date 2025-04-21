import { Component } from '@angular/core';
import { TaleVersionSpecificComponent } from '../../../taleversionspecific';
import { DomSanitizer } from '@angular/platform-browser';
import { populateWorldTimelineNotes, TimelineNote, WorldChapters } from '../../../../domain/models/world';
import { VersionService } from '../../../services/version.service';

@Component({
  selector: 'app-progression-timeline',
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
})
export class TimelineComponent extends TaleVersionSpecificComponent {
  notes: TimelineNote[] = [];
  operationError: string = '';
  hasError: boolean = false;
  constructor(private versionService: VersionService, doms: DomSanitizer) {
    super(doms);
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
        this.notes = populateWorldTimelineNotes(data, (s) => this.safeHtml(s));
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
