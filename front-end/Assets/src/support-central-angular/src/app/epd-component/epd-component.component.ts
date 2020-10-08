import { Component, OnInit } from '@angular/core';
import { EPDService } from '../shared/services/epd.service';

@Component({
  selector: 'app-epd-component',
  templateUrl: './epd-component.component.html',
  styleUrls: ['./epd-component.component.scss']
})
export class EpdComponentComponent implements OnInit {

  DESCRIPTION_LOGGED_IN = 'Suggested downloads based on your favorite products and recent activity';

  DESCRIPTION_NON_LOGGED_IN = 'Popular downloads'
  widgets = window['psc'].widgets;
  user = window['psc'].user;

  loggedIn = false;

  widgetDescription = null;


  constructor(public epdService: EPDService) { }

  ngOnInit() {
    this.epdService.getProducts();
    if (this.user.loggedIn === 'true') {
      this.widgetDescription = this.DESCRIPTION_LOGGED_IN
    } else {
      this.widgetDescription = this.DESCRIPTION_NON_LOGGED_IN
    }
  }

}
