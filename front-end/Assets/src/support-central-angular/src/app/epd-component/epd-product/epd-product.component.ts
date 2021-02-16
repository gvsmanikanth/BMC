import { Component, OnInit, Input } from '@angular/core';
import { EPDProduct } from 'src/app/shared/models/epd/epd-product.model';

@Component({
  selector: 'app-epd-product',
  templateUrl: './epd-product.component.html',
  styleUrls: ['./epd-product.component.scss']
})
export class EpdProductComponent implements OnInit {

  @Input() product: EPDProduct;

  DEFAULT_TRUNCATE_LENGTH = 3;

  shownVersions: number = null;
  truncated = true;

  constructor() { }

  ngOnInit() {
    if (this.product.deeplinks.length > this.DEFAULT_TRUNCATE_LENGTH) {
      this.truncated = true;
      this.shownVersions = this.DEFAULT_TRUNCATE_LENGTH;
    } else {
      this.truncated = false;
      this.shownVersions = this.product.deeplinks.length;
    }
  }

  showMore() {
    this.truncated = false;
    this.shownVersions = this.product.deeplinks.length;
  }

}
