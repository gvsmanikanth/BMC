import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { AdaptButtonModule, AdaptSearchModule, AdaptTabsModule, AdaptAccordionModule, AdaptSwitcherModule, AdaptBusyModule, AdaptPaginationModule, AdaptEmptyStateModule, AdaptSelectModule, AdaptPopoverModule, AdaptTooltipModule, AdaptFocusTrackerModule } from '@bmc-ux/adapt-angular';
import { RouterModule, Routes } from '@angular/router';
import { EpdComponentComponent } from './epd-component/epd-component.component';
import { EPDService } from './shared/services/epd.service';
import { EPDVersionPipe } from './shared/pipes/version.pipe';
import { FormsModule } from '@angular/forms';
import { EpdProductComponent } from './epd-component/epd-product/epd-product.component';
import { TileComponent } from './tile/tile.component';
import { DataFetchService } from './shared/services/data-fetch.service';
import { HttpClientModule } from '@angular/common/http';
import { CaseManageService } from './shared/services/case-manage.service';
import { DocsComponent } from './docs/docs.component';
import { DocsService } from './shared/services/docs.service';
import { DocsProductComponent } from './docs/docs-product/docs-product.component';
import { CaseManagementComponent } from './case-management/case-management.component';
import { SupportQuestionsService } from './shared/services/support-questions/support-questions.service';
import { SupportQuestionsComponent } from './support-questions/support-questions.component';
import { QuestionComponent } from './support-questions/question/question.component';
import { CommunityComponent } from './community/community.component';
import { CommunityService } from './shared/services/community/community.service';
import { CommunityProductComponent } from './community/community-product/community-product.component';
import { StateService } from './shared/services/state.service';
import { ServicesAndConsultingComponent } from './services-and-consulting/services-and-consulting.component';
import { GuidedTourComponent } from './guided-tour/guided-tour.component';
import { ProductCompatibilityComponent } from './product-compatibility/product-compatibility.component';
import { ProductCompatibilityService } from './shared/services/product-compatibility/product-compatibility.service';
import { CompatibilityProductComponent } from './product-compatibility/compatibility-product/compatibility-product.component';
import { WidgetGuard } from './shared/guards/widget.guard';
import { EmptyComponent } from './empty/empty.component';

const appRoutes: Routes = [
  { 
    path: '',
    component: EmptyComponent
  },
  {
    path: 'epd-widget',
    component: EpdComponentComponent,
    canActivate: [WidgetGuard]
  },
  {
    path: 'manage-case',
    component: CaseManagementComponent,
    canActivate: [WidgetGuard]
  },
  {
    path: 'docs',
    component: DocsComponent,
    canActivate: [WidgetGuard]
  },
  {
    path: 'support-question',
    component: SupportQuestionsComponent,
    canActivate: [WidgetGuard]
  },
  {
    path: 'community',
    component: CommunityComponent,
    canActivate: [WidgetGuard]
  },
  {
    path: 'sac',
    component: ServicesAndConsultingComponent,
    canActivate: [WidgetGuard]
  },
  {
    path: 'compatibility',
    component: ProductCompatibilityComponent,
    canActivate: [WidgetGuard]
  },
  {
    path: '**',
    redirectTo: ''
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
    DocsComponent,
    DocsProductComponent,
    SupportQuestionsComponent,
    QuestionComponent,
    CommunityComponent,
    CommunityProductComponent,
    ServicesAndConsultingComponent,
    GuidedTourComponent,
    ProductCompatibilityComponent,
    CompatibilityProductComponent,
    EmptyComponent,
  ],
  imports: [
    BrowserModule,
    AdaptButtonModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AdaptBusyModule,
    AdaptEmptyStateModule,
    RouterModule.forRoot(appRoutes, {
      useHash: true
    }),
    AdaptSwitcherModule,
    AdaptAccordionModule,
    AdaptSelectModule,
    AdaptTabsModule.forRoot(),
    AdaptPaginationModule,
    AdaptPopoverModule,
    AdaptTooltipModule,
    AdaptFocusTrackerModule
  ],
  providers: [
    DataFetchService,
    EPDService,
    CaseManageService,
    DocsService,
    SupportQuestionsService,
    CommunityService,
    StateService,
    ProductCompatibilityService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
