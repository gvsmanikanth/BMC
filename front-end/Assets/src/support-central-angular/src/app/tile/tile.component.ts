import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Widget } from '../shared/models/widget.model';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent implements OnInit {
  @Input() widget: Widget;
  @Output() extended: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  checkExtended() {
    if (this.widget.routerLink != null) {
      this.widget.isExtended = !this.widget.isExtended;
      this.extended.emit(true);
    } else {
      this.widget.isExtended = false;
    }
  }

}
