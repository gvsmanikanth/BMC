import { Component, Input, OnInit } from '@angular/core';
import { AskCommunitiesDetail } from 'src/app/shared/models/communities/ask-communities-detail.model';
import { DataFetchService } from 'src/app/shared/services/data-fetch.service';

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
  busyConfigDicsussion = {
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

  constructor(private dataFetch: DataFetchService) { }

  ngOnInit() {
  }

  tabChanged(event: {index: number }) {
    if (event.index === 1) {
      this.dataFetch.getCommunitiesPosts(this.smartNumber).then((response) => {
        this.blogs = response[0].communityDetails;
        this.busyConfigBlog.busy = false;
      })
    }
    if (event.index === 2) {
      this.dataFetch.getCommunitiesDiscussion(this.smartNumber).then((response) => {
        this.discussions = response[0].communityDetails;
        this.busyConfigDicsussion.busy = false;
      })
    }
    if (event.index === 3) {
      this.dataFetch.getCommunitiesDocs(this.smartNumber).then((response) => {
        this.documents = response[0].communityDetails;
        this.busyConfigDocs.busy = false;
      })
    }
    if (event.index === 4) {
      this.dataFetch.getCommunitiesIdeas(this.smartNumber).then((response) => {
        this.ideas = response[0].communityDetails;
        this.busyConfigIdea.busy = false;
      })
    }
  }

}
