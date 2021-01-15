import { Injectable } from '@angular/core';
import { GoogleAnalyticsService } from './google-analytics.service';

@Injectable()
export class StateService {

  widgets = window['psc'].widgets;
  user = window['psc'].user;
  hasUserActivity: boolean = null;

  constructor(private ga: GoogleAnalyticsService) { 
    window['gtag']('config', 'G-38WV2ZDKPB', {'login status': this.user.loggedIn});
  }
}