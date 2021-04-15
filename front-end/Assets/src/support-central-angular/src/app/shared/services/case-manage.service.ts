import { Injectable } from '@angular/core';
import { Case } from '../models/case/case.model';
import { WidgetsLinks } from '../models/widgets-links.model';
import { DataFetchService } from './data-fetch.service';
import { GoogleAnalyticsService } from './google-analytics.service';

@Injectable()
export class CaseManageService {

  cases: Case[] = [];

  widgetLinks: WidgetsLinks = window['psc'].widgets;

  
  busyConfig = {
    busy: true,
    backdrop: false,
    loaderType: 'section',
    message: 'Loading'
}

  constructor(
    private dataFetch: DataFetchService,
    private ga: GoogleAnalyticsService
  ) {}

  getCases() {
    this.busyConfig.busy = true;
    this.cases = [];
    return this.dataFetch.getCases().then((cases) => {
      this.cases = cases;
      console.log(cases);
      this.busyConfig.busy = false;
    }).catch((error) => {
      this.busyConfig.busy = false;
      this.ga.catchError(`case-managment ${error.message}`);
    })
  }
}
