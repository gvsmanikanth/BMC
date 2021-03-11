import { Component, OnDestroy, OnInit } from '@angular/core';
import { DocsService } from '../shared/services/docs.service';
import { GoogleAnalyticsService } from '../shared/services/google-analytics.service';
import { StateService } from '../shared/services/state.service';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss']
})
export class DocsComponent implements OnInit, OnDestroy {

  DESCRIPTION_LOGGED_IN = 'Suggested documentation based on your favorite products and recent activity';
  DESCRIPTION_NON_LOGGED_IN = 'Suggested documentation based on product popularity'

  widgetDescription = null;

  constructor(
    public docsService: DocsService, 
    public state: StateService,
    private ga: GoogleAnalyticsService
  ) { }

  ngOnInit() {
    this.docsService.loadDocs();
    this.state.documentationOpened$.next(true);
    if (this.state.user.loggedIn === 'true') {
      this.widgetDescription = this.DESCRIPTION_LOGGED_IN
    } else {
      this.widgetDescription = this.DESCRIPTION_NON_LOGGED_IN
    }
  }

  sendDocumentation(name: string) {
    this.ga.sendEvent('click', name, 'open resourse');
  }

  sendAccordion(name: string) {
    this.ga.sendEvent('accordion', name, 'Documentation');
  }

  ngOnDestroy() {
    this.state.documentationOpened$.next(false);
  }
}