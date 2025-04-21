import { Routes } from '@angular/router';
import { Err404Component } from './err404/err404.component';
import { TaleComponent } from './tale/tale.component';
import { TaleVersionComponent } from './taleversion/taleversion.component';
import { ProgressionComponent } from './progression/progression.component';
import { GroupsActorsComponent } from './groupsactors/groupsactors.component';
import { SettlementsComponent } from './settlements/settlements.component';
import { AnecdotesComponent } from './anecdotes/anecdotes.component';
import { PersonsComponent } from './persons/persons.component';
import { PlaygroundComponent } from './playground/playground.component';

export const routes: Routes = [
  { path: 'tales', component: TaleComponent },
  { path: 'test', component: PlaygroundComponent },
  { path: 'tale/:taleId', component: TaleVersionComponent, pathMatch: 'full' },
  {
    path: 'tale/:taleId/:taleVersionId',
    children: [
      { path: 'progression', component: ProgressionComponent },
      { path: 'groupsactors', component: GroupsActorsComponent },
      { path: 'settlements', component: SettlementsComponent },
      { path: 'anecdotes', component: AnecdotesComponent },
      { path: 'persons', component: PersonsComponent },
      { path: '**', component: Err404Component },
      { path: '', component: TaleVersionComponent },
    ],
  },
  { path: '', component: TaleComponent },
  { path: '404', component: Err404Component },
  { path: '**', redirectTo: '404' },
];
