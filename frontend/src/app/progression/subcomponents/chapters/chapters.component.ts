import { Component } from '@angular/core';
import { TaleVersionSpecificComponent } from '../../../taleversionspecific';
import { VersionService } from '../../../services/version.service';
import { Chapter, decorateWorldChapters, WorldChapters } from '../../../../domain/models/world';
import { SafePipe } from '../../../../library/safe';

@Component({
  selector: 'app-progression-chapters',
  templateUrl: './chapters.component.html',
  styleUrl: './chapters.component.scss',
  imports: [SafePipe],
})
export class ChaptersComponent extends TaleVersionSpecificComponent {
  chapters: Chapter[] = [];
  operationError: string = '';
  hasError: boolean = false;
  constructor(private versionService: VersionService) {
    super();
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
        decorateWorldChapters(data);
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
