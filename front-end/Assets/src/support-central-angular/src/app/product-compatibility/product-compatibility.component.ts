import { Component, OnInit } from '@angular/core';
import { ProductCompatibilityService } from '../shared/services/product-compatibility/product-compatibility.service';
import { StateService } from '../shared/services/state.service';

@Component({
  selector: 'app-product-compatibility',
  templateUrl: './product-compatibility.component.html',
  styleUrls: ['./product-compatibility.component.scss']
})
export class ProductCompatibilityComponent implements OnInit {

  DESCRIPTION_LOGGED_IN = 'Product compatibility page suggestions based on your favorite products and recent activity';
  DESCRIPTION_NON_LOGGED_IN = 'Product compatibility page suggestions based on product popularity.'

  constructor(public compatibilityService: ProductCompatibilityService, public state: StateService) { }

  ngOnInit() {
    this.compatibilityService.getProducts();
  }

}
