import { Component, Input, OnInit } from '@angular/core';
import { CompatibilityProduct } from 'src/app/shared/models/compatibility/compatibility-product';

@Component({
  selector: 'app-compatibility-product',
  templateUrl: './compatibility-product.component.html',
  styleUrls: ['./compatibility-product.component.scss']
})
export class CompatibilityProductComponent implements OnInit {

  @Input() product: CompatibilityProduct;

  DEFAULT_TRUNCATE_LENGTH = 3;

  shownVersions: number = null;
  truncated = true;

  constructor() { }

  ngOnInit() {
    if (this.product.versionCompatibility.length > this.DEFAULT_TRUNCATE_LENGTH) {
      this.truncated = true;
      this.shownVersions = this.DEFAULT_TRUNCATE_LENGTH;
    } else {
      this.truncated = false;
      this.shownVersions = this.product.versionCompatibility.length;
    }
  }

  showMore() {
    this.truncated = false;
    this.shownVersions = this.product.versionCompatibility.length;
  }
}
