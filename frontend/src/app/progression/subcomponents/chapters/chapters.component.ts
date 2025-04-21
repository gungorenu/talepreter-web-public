import { Component } from '@angular/core';
import { TaleVersionSpecificComponent } from '../../../taleversionspecific';
import { DomSanitizer } from '@angular/platform-browser';
import { VersionService } from '../../../services/version.service';
import { Chapter, decorateWorldChapters, WorldChapters } from '../../../../domain/models/world';

@Component({
  selector: 'app-progression-chapters',
  templateUrl: './chapters.component.html',
  styleUrl: './chapters.component.scss',
})
export class ChaptersComponent extends TaleVersionSpecificComponent {
  chapters: Chapter[] = [];
  operationError: string = '';
  hasError: boolean = false;
  constructor(private versionService: VersionService, doms: DomSanitizer) {
    super(doms);
  }

  getChapters(): void {
    this.chapters = [];
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

    this.versionService.getChapters(this.taleId, this.taleVersionId).subscribe({
      next: (data: WorldChapters) => {
        decorateWorldChapters(data, (s) => this.safeHtml(s));
        var sorted = data.Chapters.sort((a: any, b: any) => (a._id < b._id ? 1 : 0));
        this.chapters = sorted;
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
    this.getChapters();
  }
}
