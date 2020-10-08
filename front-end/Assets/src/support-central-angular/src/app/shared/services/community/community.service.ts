import { Injectable } from '@angular/core';
import { AskCommunityProduct } from '../../models/communities/ask-communities.model';
import { DataFetchService } from '../data-fetch.service';

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

  constructor(private dataFetch: DataFetchService) { }

  getAskCommunity() {
    this.dataFetch.getCommunitiesQuestions().then((questions) => {
      this.askCommunity = questions;
      this.busyConfig.busy = false;
    }).catch(() => {
      this.busyConfig.busy = false;
    })
  }

}
