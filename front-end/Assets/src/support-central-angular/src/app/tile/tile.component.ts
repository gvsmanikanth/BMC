import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Widget } from '../shared/models/widget.model';
import { GoogleAnalyticsService } from '../shared/services/google-analytics.service';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent implements OnInit {
  @Input() widget: Widget;
  @Output() extended: EventEmitter<boolean> = new EventEmitter();

  constructor(private ga: GoogleAnalyticsService) { }

  ngOnInit() {
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