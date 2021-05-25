import { Injectable } from '@angular/core';
import { CompatibilityProduct } from '../../models/compatibility/compatibility-product';
import { DataFetchService } from '../data-fetch.service';
import { GoogleAnalyticsService } from '../google-analytics.service';

@Injectable({
  providedIn: 'root'
})
export class ProductCompatibilityService {
  products: CompatibilityProduct[] = null;

  constructor (
      private dataFetch: DataFetchService,
      private ga: GoogleAnalyticsService
  ) {}

  busyConfig = {
      busy: true,
      backdrop: false,
      loaderType: 'section',
      message: 'Loading'
  }

  getProducts() {
      if (this.products) return Promise.resolve();
      return  this.dataFetch.getCompatibility().then((products:CompatibilityProduct[]) => {
          this.products = products;
          this.busyConfig.busy = false;
      }).catch((error) => {
        this.busyConfig.busy = false;
        this.ga.catchError(`compatibility ${error.message}`);
      })
  }
}
