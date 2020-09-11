import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

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
import { CaseManagementComponent } from './case-management/case-management.component';
import { CaseManageService } from './shared/services/case-manage.service';
import { AdaptGridModule } from '@bmc-ux/adapt-grid';
import { AgGridModule } from 'ag-grid-angular';
import { DateCellComponent } from './case-management/date-cell/date-cell.component';
import { CaseIdCellComponent } from './case-management/case-id-cell/case-id-cell.component';

const appRoutes: Routes = [
  {
    path: 'epd-widget',
    component: EpdComponentComponent
  },
  {
    path: 'manage-case',
    component: CaseManagementComponent
  }
]

@NgModule({
  declarations: [
    AppComponent,
    EpdComponentComponent,
    EPDVersionPipe,
    EpdProductComponent,
    TileComponent,
    CaseManagementComponent,
    DateCellComponent,
    CaseIdCellComponent
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
    AdaptSwitcherModule,
    AdaptGridModule.forRoot(),
    AgGridModule.withComponents([])
  ],
  providers: [
    DataFetchService,
    EPDService,
    CaseManageService
  ],
  entryComponents: [
    DateCellComponent,
    CaseIdCellComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
