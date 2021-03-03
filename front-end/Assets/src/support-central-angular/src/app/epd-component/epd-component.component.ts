import { Component, OnDestroy, OnInit } from '@angular/core';
import { EPDService } from '../shared/services/epd.service';
import { StateService } from '../shared/services/state.service';

@Component({
  selector: 'app-epd-component',
  templateUrl: './epd-component.component.html',
  styleUrls: ['./epd-component.component.scss']
})
export class EpdComponentComponent implements OnInit, OnDestroy {

  DESCRIPTION_LOGGED_IN = 'Suggested downloads based on your favorite products and recent activity';
  DESCRIPTION_NON_LOGGED_IN = 'Suggested downloads based on product popularity'

  widgetDescription = null;


  constructor(public epdService: EPDService, public state: StateService) { }

  ngOnInit() {
    this.epdService.getProducts();
    if (this.state.user.loggedIn === 'true') {
      this.widgetDescription = this.DESCRIPTION_LOGGED_IN
    } else {
      this.widgetDescription = this.DESCRIPTION_NON_LOGGED_IN
    }
    this.state.productDownloadsOpened$.next(true);
  }
  ngOnDestroy () {
    this.state.productDownloadsOpened$.next(false);
  }
}
