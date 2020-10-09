import { Component, Input, OnInit } from '@angular/core';
import { AskCommunitiesDetail } from 'src/app/shared/models/communities/ask-communities-detail.model';

@Component({
  selector: 'app-community-product',
  templateUrl: './community-product.component.html',
  styleUrls: ['./community-product.component.scss']
})
export class CommunityProductComponent implements OnInit {
  @Input('details') questions: AskCommunitiesDetail[]

  constructor() { }

  ngOnInit() {
  }

}
