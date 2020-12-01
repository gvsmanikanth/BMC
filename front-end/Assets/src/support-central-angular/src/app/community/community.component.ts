import { Component, OnInit } from '@angular/core';
import { CommunityService } from '../shared/services/community/community.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss']
})
export class CommunityComponent implements OnInit {

  DESCRIPTION_LOGGED_IN = 'Suggested Community content based on your favorite products and recent activity';
  DESCRIPTION_NON_LOGGED_IN = 'Popular Community content'

  widgets = window['psc'].widgets;
  user = window['psc'].user;

  widgetDescription = null;

  constructor(public communityService: CommunityService) { }

  ngOnInit() {
    this.communityService.getAskCommunity();
    if (this.user.loggedIn === 'true') {
      this.widgetDescription = this.DESCRIPTION_LOGGED_IN
    } else {
      this.widgetDescription = this.DESCRIPTION_NON_LOGGED_IN
    }
  }

}
