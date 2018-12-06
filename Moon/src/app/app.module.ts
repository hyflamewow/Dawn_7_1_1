import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ValuesComponent } from './values/values.component';
import { MessageComponent } from './message/message.component';
import { TicketComponent } from './ticket/ticket.component';
import { AppSettingsService } from './services/app-settings.service';

@NgModule({
  declarations: [
    AppComponent,
    ValuesComponent,
    MessageComponent,
    TicketComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER, useFactory: (
        service: AppSettingsService) => () => service.load(),
      deps: [AppSettingsService], multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
