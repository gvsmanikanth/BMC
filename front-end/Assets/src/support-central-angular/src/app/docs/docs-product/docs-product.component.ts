import { Component, Input, OnInit } from '@angular/core';
import { DocsProduct } from 'src/app/shared/models/docs/docs-product.model';

@Component({
  selector: 'app-docs-product',
  templateUrl: './docs-product.component.html',
  styleUrls: ['./docs-product.component.scss']
})
export class DocsProductComponent implements OnInit {

  @Input() product: DocsProduct;

  constructor() { }

  ngOnInit() {
  }

}
