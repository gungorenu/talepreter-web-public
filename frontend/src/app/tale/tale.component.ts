import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TaleService } from '../services/tale.service';

@Component({
  selector: 'app-tale',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './tale.component.html',
  styleUrls: ['./../../styles.scss'],
  providers: [TaleService],
})
export class TaleComponent {
  tales: any[] = [];
  operationError: string = '';
  hasError: boolean = false;
  constructor(private taleService: TaleService) {}

  getTales(): void {
    this.taleService.getTales().subscribe({
      next: (data) => {
        this.tales = data;
      },
      error: (error) => {
        this.tales = [];
        this.operationError = error;
        this.hasError = true;
      },
    });
  }

  ngOnInit(): void {
    this.getTales();
  }
}
