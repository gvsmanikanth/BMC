import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { AdaptButtonModule } from '@bmc-ux/adapt-angular';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AdaptButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
