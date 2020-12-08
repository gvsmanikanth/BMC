import { Component, OnInit } from '@angular/core';
import { CommunityService } from '../shared/services/community/community.service';
import { StateService } from '../shared/services/state.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss']
})
export class CommunityComponent implements OnInit {

  DESCRIPTION_LOGGED_IN = 'Suggested Community content based on your favorite products and recent activity';
  DESCRIPTION_NON_LOGGED_IN = 'Popular Community content'

  widgetDescription = null;

  constructor(public communityService: CommunityService, public state: StateService) { }

  ngOnInit() {
    this.communityService.getAskCommunity();
    if (this.state.user.loggedIn === 'true') {
      this.widgetDescription = this.DESCRIPTION_LOGGED_IN
    } else {
      this.widgetDescription = this.DESCRIPTION_NON_LOGGED_IN
    }
  }

}
