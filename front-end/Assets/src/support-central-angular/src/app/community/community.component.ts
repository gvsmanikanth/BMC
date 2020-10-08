import { Component, OnInit } from '@angular/core';
import { CommunityService } from '../shared/services/community/community.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss']
})
export class CommunityComponent implements OnInit {

  widgets = window['psc'].widgets;

  constructor(public communityService: CommunityService) { }

  ngOnInit() {
    this.communityService.getAskCommunity();
  }

}
