import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainWindowComponent} from './main-window/main-window.component';
import { ChildWindowComponent } from './child-window/child-window.component';
import { SecondaryWindowComponent } from './secondary-window/secondary-window.component';

const routes: Routes = [
  {
    path: 'tile/:id',
    component: ChildWindowComponent
  },
  {
    path: 'secondary',
    component: SecondaryWindowComponent
  },
  {
    path: '**',
    component: MainWindowComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
