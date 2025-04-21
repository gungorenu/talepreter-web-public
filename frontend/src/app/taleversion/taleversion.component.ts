import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { validate as uuidValidate } from 'uuid';
import { TaleService } from '../services/tale.service';
import { VersionService } from '../services/version.service';
import { getTaleYear } from '../../library/datetime';

@Component({
  selector: 'app-taleversion',
  imports: [RouterOutlet],
  templateUrl: './taleversion.component.html',
  styleUrls: ['./../../styles.scss'],
  providers: [TaleService, VersionService],
})
export class TaleVersionComponent {
  readonly activatedRoute = inject(ActivatedRoute);
  readonly router = inject(Router);
  taleId: string | null = null;
  versions: any[] = [];
  operationError: string = '';
  hasError: boolean = false;
  constructor(private versionService: VersionService, private taleService: TaleService) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      const newTaleId = params['taleId'];
      this.taleId = newTaleId;

      if (!uuidValidate(this.taleId)) this.taleId = null;

      if (this.taleId === null) {
        this.router.navigate(['/tales']);
        return;
      }
    });
    this.getVersions();
  }

  getVersions(): void {
    if (this.taleId === null) {
      this.versions = [];
      this.operationError = 'Invalid tale id';
      this.hasError = true;
      return;
    }
    this.taleService.getVersions(this.taleId).subscribe({
      next: (data) => {
        this.versions = data.sort((a: any, b: any) => b.lastPage.chapter - a.lastPage.chapter);
      },
      error: (error) => {
        this.versions = [];
        this.operationError = error;
        this.hasError = true;
      },
    });
  }

  getVersionStatusStyle(status: string): string {
    switch (status) {
      case 'Published':
        return 'CF7';
      case 'Faulted':
        return 'CF8';
      default:
        return 'CF0';
    }
  }

  onVersionNavigate($event: Event, versionId: string) {
    if (this.taleId === null) return;
    this.versionService.getWorld(this.taleId, versionId).subscribe({
      next: (data) => {
        if (localStorage == null) return;
        localStorage.setItem('taleVersionId', versionId);
        localStorage.setItem('world-era', data.era);
        localStorage.setItem('world-today', data.today);
        localStorage.setItem('world-focusedGroup', data.focusedGroup);
        localStorage.setItem('world-currentChapter', data.currentChapter);
        localStorage.setItem('world-currentPage', data.currentPage);
        localStorage.setItem('world-location', data.currentLocation);
        const todayYear = getTaleYear(data.today);
        localStorage.setItem('world-todayYear', todayYear.toString());
        this.router.navigate([`/tale/${this.taleId}/${versionId}/progression`]);
      },
    });
  }
}
