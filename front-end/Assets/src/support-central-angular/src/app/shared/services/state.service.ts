import { Injectable } from '@angular/core';
import { GoogleAnalyticsService } from './google-analytics.service';

@Injectable()
export class StateService {

  widgets = window['psc'].widgets;
  user = window['psc'].user;
  hasUserActivity: boolean = null;

  constructor(private ga: GoogleAnalyticsService) { 
    window['gtag']('config', 'UA-114788512-5', {'login status': this.user.loggedIn});
  }
}