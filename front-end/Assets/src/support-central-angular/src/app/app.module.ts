import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule} from '@angular/core';

import { AppComponent } from './app.component';

import { AdaptButtonModule, AdaptSearchModule, AdaptTabsModule, AdaptAccordionModule, AdaptSwitcherModule, AdaptBusyModule } from '@bmc-ux/adapt-angular';
import { RouterModule, Routes } from '@angular/router';
import { EpdComponentComponent } from './epd-component/epd-component.component';
import { EPDService } from './shared/services/epd.service';
import { EPDVersionPipe } from './shared/pipes/version.pipe';
import { FormsModule } from '@angular/forms';
import { EpdProductComponent } from './epd-component/epd-product/epd-product.component';
import { TileComponent } from './tile/tile.component';
import { DataFetchService } from './shared/services/data-fetch.service';
import { HttpClientModule } from '@angular/common/http';

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
    EPDVersionPipe,
    EpdProductComponent,
    TileComponent
  ],
  imports: [
    BrowserModule,
    AdaptButtonModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AdaptBusyModule,
    RouterModule.forRoot(appRoutes, {
      useHash: true
    }),
    AdaptSwitcherModule
  ],
  providers: [
    DataFetchService,
    EPDService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
