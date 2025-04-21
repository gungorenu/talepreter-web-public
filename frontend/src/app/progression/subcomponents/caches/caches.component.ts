import { Component } from '@angular/core';
import { TaleVersionSpecificComponent } from '../../../taleversionspecific';
import { DomSanitizer } from '@angular/platform-browser';
import { VersionService } from '../../../services/version.service';
import { Cache, decorateCache } from '../../../../domain/models/world';
import { foreach } from '../../../../library/array';

@Component({
  selector: 'app-progression-caches',
  templateUrl: './caches.component.html',
  styleUrl: './caches.component.scss',
})
export class CachesComponent extends TaleVersionSpecificComponent {
  caches: Cache[] = [];
  operationError: string = '';
  hasError: boolean = false;
  constructor(private versionService: VersionService, doms: DomSanitizer) {
    super(doms);
  }

  getCaches(): void {
    this.caches = [];
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

    this.versionService.getCaches(this.taleId, this.taleVersionId).subscribe({
      next: (data: Cache[]) => {
        var sorted = data.sort((a: any, b: any) => (a.DocumentId > b.DocumentId ? 1 : 0));
        foreach(sorted, (cache) => decorateCache(cache, (s) => this.safeHtml(s)));
        this.caches = sorted;
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
    this.getCaches();
  }
}
