import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { formatText } from '../../library/string';
import { getTaleDate } from '../../library/datetime';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss', './../../styles.scss'],
})
export class NavigationComponent {
  readonly router = inject(Router);
  taleId: string | null = null;
  taleVersionId: string | null = null;
  hasNoTaleId: boolean = true;
  hasNoVersionId: boolean = true;
  constructor(private doms: DomSanitizer) {
    this.router.events.subscribe((evnt) => {
      if (evnt instanceof ActivationEnd) {
        const newTaleId = evnt.snapshot.paramMap.get('taleId');
        const newTaleVersionId = evnt.snapshot.paramMap.get('taleVersionId');
        this.taleId = newTaleId;
        this.taleVersionId = newTaleVersionId;
        this.hasNoTaleId = this.taleId === null || this.taleId === undefined;
        this.hasNoVersionId = this.taleVersionId === null || this.taleVersionId === undefined;

        // below causes too many calls error
        // if (!uuidValidate(this.taleId)) this.taleId = null;
        // if (!uuidValidate(this.taleVersionId)) this.taleVersionId = null;

        // if (this.taleId === null) {
        //   this.router.navigate(['/tales']);
        // } else if (this.taleVersionId === null) {
        //   this.router.navigate(['/tale', this.taleId]);
        // }
      }
    });
  }

  getChapterPage() {
    const chapter = localStorage?.getItem('world-currentChapter') ?? '.';
    const page = localStorage?.getItem('world-currentPage') ?? '.';
    return `C#${chapter} / P#${page}`;
  }
  getTaleToday() {
    const todayN = parseInt(localStorage?.getItem('world-today') ?? '0');
    const era = localStorage?.getItem('world-era') ?? '';
    return getTaleDate(todayN, era);
  }
  getCurrentLocation() {
    return this.doms.bypassSecurityTrustHtml(formatText(localStorage?.getItem('world-location') ?? ''));
  }
  clearLocalStorage() {
    localStorage?.clear();
  }
}
