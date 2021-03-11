import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GoogleAnalyticsService } from './google-analytics.service';

@Injectable()
export class StateService {

  widgets = window['psc'].widgets;
  user = window['psc'].user;
  hasUserActivity: boolean = null;

  caseManagementOpened$ = new BehaviorSubject<boolean>(false);
  communitiesOpened$ = new BehaviorSubject<boolean>(false);
  productDownloadsOpened$ = new BehaviorSubject<boolean>(false);
  documentationOpened$ = new BehaviorSubject<boolean>(false);

  constructor(private ga: GoogleAnalyticsService) { 
    window['gtag']('config', 'UA-114788512-5', {'login status': this.user.loggedIn});
  }
}