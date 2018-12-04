import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ValuesComponent } from './values/values.component';

const routes: Routes = [
  { path: '', redirectTo: '/values', pathMatch: 'full' },
  { path: 'values', component: ValuesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
