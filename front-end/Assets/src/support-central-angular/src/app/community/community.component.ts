import { Component, OnDestroy, OnInit} from '@angular/core';
import { CommunityService } from '../shared/services/community/community.service';
import { GoogleAnalyticsService } from '../shared/services/google-analytics.service';
import { StateService } from '../shared/services/state.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss']
})
export class CommunityComponent implements OnInit, OnDestroy {

  DESCRIPTION_LOGGED_IN = 'Suggested community content based on your favorite products and recent activity';
  DESCRIPTION_NON_LOGGED_IN = 'Suggested community content based on product popularity'

  widgetDescription = null;

  constructor(
    public communityService: CommunityService, 
    public state: StateService,
    private ga: GoogleAnalyticsService
  ) { }

  ngOnInit() {
    this.communityService.getAskCommunity();
    if (this.state.user.loggedIn === 'true') {
      this.widgetDescription = this.DESCRIPTION_LOGGED_IN
    } else {
      this.widgetDescription = this.DESCRIPTION_NON_LOGGED_IN
    }
    this.state.communitiesOpened$.next(true);
  }

  sendCommunity(name: string) {
    this.ga.sendEvent('widget click', name, 'open resourse');
  }

  sendAccordion(name: string) {
    this.ga.sendEvent('accordion', name, 'community');
  }

  ngOnDestroy () {
    this.state.communitiesOpened$.next(false);
  }
}