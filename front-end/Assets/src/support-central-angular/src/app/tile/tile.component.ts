import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Widget } from '../shared/models/widget.model';
import { GoogleAnalyticsService } from '../shared/services/google-analytics.service';
import { StateService } from '../shared/services/state.service';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent implements OnInit {
  @Input() widget: Widget;
  @Output() extended: EventEmitter<boolean> = new EventEmitter();

  LOGGED_IN_POPOVER_TEXT = "Personalized view";

  GUEST_USER_POPOVER_TEXT = "Popular products";

  iconPopoverText = 'Hello';

  constructor(private state: StateService, private ga: GoogleAnalyticsService) { }

  ngOnInit() {
    if (this.state.user.loggedIn === 'true') {
      this.iconPopoverText = this.LOGGED_IN_POPOVER_TEXT;
    } else {
      this.iconPopoverText = this.GUEST_USER_POPOVER_TEXT;
    }
  }

  checkExtended(event) {
    event.stopPropagation();
    if (this.widget.routerLink != null) {
      this.widget.isExtended = !this.widget.isExtended;
      this.extended.emit(true);
      this.ga.sendEvent('open', this.widget.title, 'personalize view');
    } else {
      this.widget.isExtended = false;
    }
  }

  sendTileClicks(title) {
    this.ga.sendEvent('widget click', title, 'open resourse');
  }

}