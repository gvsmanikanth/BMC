import { Component, Input, OnInit } from '@angular/core';
import { AskCommunitiesDetail } from 'src/app/shared/models/communities/ask-communities-detail.model';
import { DataFetchService } from 'src/app/shared/services/data-fetch.service';
import { GoogleAnalyticsService } from 'src/app/shared/services/google-analytics.service';

@Component({
  selector: 'app-community-product',
  templateUrl: './community-product.component.html',
  styleUrls: ['./community-product.component.scss']
})
export class CommunityProductComponent implements OnInit {
  @Input('details') questions: AskCommunitiesDetail[]
  @Input('smartNumber') smartNumber: string;

  blogs: AskCommunitiesDetail[] = [];
  discussions: AskCommunitiesDetail[] = [];
  documents: AskCommunitiesDetail[] = [];
  ideas: AskCommunitiesDetail[] = [];

  busyConfigBlog = {
      busy: true,
      backdrop: false,
      loaderType: 'section',
      message: 'Loading'
  }
  busyConfigDiscussion = {
      busy: true,
      backdrop: false,
      loaderType: 'section',
      message: 'Loading'
  }
  busyConfigDocs = {
      busy: true,
      backdrop: false,
      loaderType: 'section',
      message: 'Loading'
  }
  busyConfigIdea = {
      busy: true,
      backdrop: false,
      loaderType: 'section',
      message: 'Loading'
  }

  constructor(
    private dataFetch: DataFetchService,
    private ga: GoogleAnalyticsService
  ) { }

  ngOnInit() {
  }

  tabChanged(event: {index: number }) {
    if (event.index === 1) {
      this.dataFetch.getCommunitiesPosts(this.smartNumber).then((response) => {
        this.blogs = response[0].communityDetails;
        this.busyConfigBlog.busy = false;
      }).catch((error) => {
        this.busyConfigBlog.busy = false;
        this.ga.catchError(`communityBlog ${error.message}`);
      })
    }
    if (event.index === 2) {
      this.dataFetch.getCommunitiesDiscussion(this.smartNumber).then((response) => {
        this.discussions = response[0].communityDetails;
        this.busyConfigDiscussion.busy = false;
      }).catch((error) => {
        this.busyConfigDiscussion.busy = false;
        this.ga.catchError(`communityDiscussion ${error.message}`);
      })
    }
    if (event.index === 3) {
      this.dataFetch.getCommunitiesDocs(this.smartNumber).then((response) => {
        this.documents = response[0].communityDetails;
        this.busyConfigDocs.busy = false;
      }).catch((error) => {
        this.busyConfigDocs.busy = false;
        this.ga.catchError(`communityDocs ${error.message}`);
      })
    }
    if (event.index === 4) {
      this.dataFetch.getCommunitiesIdeas(this.smartNumber).then((response) => {
        this.ideas = response[0].communityDetails;
        this.busyConfigIdea.busy = false;
      }).catch((error) => {
        this.busyConfigIdea.busy = false;
        this.ga.catchError(`communityIdea ${error.message}`);
      })
    }
  }

}
