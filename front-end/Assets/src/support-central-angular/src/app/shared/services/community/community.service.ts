import { Injectable } from '@angular/core';
import { AskCommunityProduct } from '../../models/communities/ask-communities.model';
import { DataFetchService } from '../data-fetch.service';
import { GoogleAnalyticsService } from '../google-analytics.service';
import { StateService } from '../state.service';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {

  busyConfig = {
    busy: true,
    backdrop: false,
    loaderType: 'section',
    message: 'Loading'
  }

  askCommunity: AskCommunityProduct[] = [];

  constructor(
    private dataFetch: DataFetchService,
    private state: StateService,
    private ga: GoogleAnalyticsService
  ) { }

  getAskCommunity() {
    this.dataFetch.getCommunitiesQuestions().then((questions) => {
      this.askCommunity = questions;
      this.busyConfig.busy = false;
      this.state.communitiesDownloaded$.next(true);
    }).catch((error) => {
      this.busyConfig.busy = false;
      this.ga.catchError(`community ${error.message}`);
      this.state.communitiesDownloaded$.next(true);
    })
  }

}
