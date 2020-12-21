import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { AdaptButtonModule, AdaptSearchModule, AdaptTabsModule, AdaptAccordionModule, AdaptSwitcherModule, AdaptBusyModule, AdaptPaginationModule, AdaptEmptyStateModule, AdaptSelectModule } from '@bmc-ux/adapt-angular';
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

const appRoutes: Routes = [
  {
    path: 'epd-widget',
    component: EpdComponentComponent
  },
  {
    path: 'manage-case',
    component: CaseManagementComponent
  },
  {
    path: 'docs',
    component: DocsComponent
  },
  {
    path: 'support-question',
    component: SupportQuestionsComponent
  },
  {
    path: 'community',
    component: CommunityComponent
  },
  {
    path: 'sac',
    component: ServicesAndConsultingComponent
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
    AdaptPaginationModule
  ],
  providers: [
    DataFetchService,
    EPDService,
    CaseManageService,
    DocsService,
    SupportQuestionsService,
    CommunityService,
    StateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
