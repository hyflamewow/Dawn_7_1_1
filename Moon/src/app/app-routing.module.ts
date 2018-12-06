import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ValuesComponent } from './values/values.component';
import { TicketComponent } from './ticket/ticket.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/ticket', pathMatch: 'full' }
  , { path: 'values', component: ValuesComponent }
  , { path: 'ticket', component: TicketComponent }
  , { path: 'authTicket', component: TicketComponent, canActivate: [AuthGuard] }
  , { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
