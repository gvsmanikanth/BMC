import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { AdaptButtonModule, AdaptSearchModule, AdaptTabsModule, AdaptAccordionModule } from '@bmc-ux/adapt-angular';
import { RouterModule, Routes } from '@angular/router';
import { EpdComponentComponent } from './epd-component/epd-component.component';
import { Tabs2Component } from './tabs2/tabs2.component';

const appRoutes: Routes = [
  {
    path: 'epd-widget',
    component: EpdComponentComponent
  }
]

@NgModule({
  declarations: [
    AppComponent,
    EpdComponentComponent,
    Tabs2Component
  ],
  imports: [
    BrowserModule,
    AdaptButtonModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes, {
      useHash: true
    }),
    AdaptSearchModule,
    AdaptTabsModule,
    AdaptAccordionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
