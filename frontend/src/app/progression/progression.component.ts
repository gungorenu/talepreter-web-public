import { Component, Type } from '@angular/core';
import { TaleVersionSpecificComponent } from '../taleversionspecific';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgComponentOutlet } from '@angular/common';
import { ChaptersComponent } from './subcomponents/chapters/chapters.component';
import { CachesComponent } from './subcomponents/caches/caches.component';
import { ActorsComponent } from './subcomponents/actors/actors.component';
import { TimelineComponent } from './subcomponents/timeline/timeline.component';

@Component({
  selector: 'app-progression',
  imports: [RouterLink, RouterLinkActive, NgComponentOutlet],
  templateUrl: './progression.component.html',
  styleUrl: './progression.component.scss',
})
export class ProgressionComponent extends TaleVersionSpecificComponent {
  selectedTab: string = '';
  currentTab?: { component: Type<any> };
  currentGroup: string = '';
  constructor(doms: DomSanitizer) {
    super(doms);
  }
  ngOnInit() {
    super.onInit();
    this.currentGroup = localStorage?.getItem('world-focusedGroup') ?? '';
    this.activatedRoute.queryParams.subscribe((qParams) => {
      this.selectedTab = qParams['tab'];
      switch (this.selectedTab) {
        case 'chapters':
          this.currentTab = { component: ChaptersComponent };
          break;
        case 'caches':
          this.currentTab = { component: CachesComponent };
          break;
        case 'timeline':
          this.currentTab = { component: TimelineComponent };
          break;
        default:
          this.currentTab = { component: ActorsComponent };
          break;
      }
    });
  }

  getActiveGroup(): string {
    return localStorage?.getItem('world-focusedGroup') ?? '';
  }
}
