import { Component, OnInit } from '@angular/core';
import { DocsService } from '../shared/services/docs.service';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss']
})
export class DocsComponent implements OnInit {

  DESCRIPTION_LOGGED_IN = 'Suggested documentation based on your favorite products and recent activity';
  DESCRIPTION_NON_LOGGED_IN = 'Suggested documentation based on product popularity'

  widgets = window['psc'].widgets;
  user = window['psc'].user;

  widgetDescription = null;

  constructor(public docsService: DocsService) { }

  ngOnInit() {
    this.docsService.loadDocs();
    if (this.user.loggedIn === 'true') {
      this.widgetDescription = this.DESCRIPTION_LOGGED_IN
    } else {
      this.widgetDescription = this.DESCRIPTION_NON_LOGGED_IN
    }
  }

}
