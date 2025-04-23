import { Component } from '@angular/core';
import { TaleVersionSpecificComponent } from '../taleversionspecific';
import { VersionService } from '../services/version.service';
import { Settlement } from '../../domain/models/settlement';
import { SafePipe } from '../../library/safe';

@Component({
  selector: 'app-settlements',
  imports: [SafePipe],
  templateUrl: './settlements.component.html',
  styleUrl: './settlements.component.scss',
})
export class SettlementsComponent extends TaleVersionSpecificComponent {
  settlements: Settlement[] = [];
  operationError: string = '';
  hasError: boolean = false;
  constructor(private versionService: VersionService) {
    super();
  }

  getSettlements(): void {
    this.settlements = [];
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
    this.versionService.getSettlements(this.taleId, this.taleVersionId).subscribe({
      next: (data) => {
        var sorted = data.sort((a: any, b: any) => a.DocumentId.localeCompare(b.DocumentId));
        var results: Settlement[] = [];
        for (let i = 0; i < sorted.length; i++) {
          var settlement: Settlement = Object.assign(new Settlement(), sorted[i]);
          settlement.decorate(this.getWorldEra());
          results.push(settlement);
        }
        this.settlements = results;
        this.hasError = false;
      },
      error: (error) => {
        this.settlements = [];
        this.operationError = error;
        this.hasError = true;
      },
    });
  }

  ngOnInit(): void {
    super.onInit();
    this.getSettlements();
  }
}
