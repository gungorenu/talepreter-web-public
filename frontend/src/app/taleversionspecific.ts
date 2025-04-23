import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { validate as uuidValidate } from 'uuid';

export abstract class TaleVersionSpecificComponent {
  readonly activatedRoute = inject(ActivatedRoute);
  readonly router = inject(Router);
  taleId: string | null = null;
  taleVersionId: string | null = null;

  onInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      const newTaleId = params['taleId'];
      const newTaleVersionId = params['taleVersionId'];
      this.taleId = newTaleId;
      this.taleVersionId = newTaleVersionId;

      if (!uuidValidate(this.taleId)) this.taleId = null;
      if (!uuidValidate(this.taleVersionId)) this.taleVersionId = null;

      if (this.taleId === null) {
        this.router.navigate(['/tales']);
      } else if (this.taleVersionId === null) {
        this.router.navigate(['/tale', this.taleId]);
      }
    });
  }

  getWorldEra(): string {
    const era = localStorage.getItem('world-era') ?? '';
    return era;
  }

  getWorldFocusedGroup(): string {
    const focusedGroup = localStorage.getItem('world-focusedGroup') ?? '';
    return focusedGroup;
  }

  getWorldToday(): number {
    const todayN = parseInt(localStorage.getItem('world-today') ?? '');
    return todayN;
  }
}
