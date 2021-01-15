import { Injectable } from "@angular/core";
import { EPDProduct } from '../models/epd/epd-product.model';
import { DataFetchService } from './data-fetch.service';
import { GoogleAnalyticsService } from "./google-analytics.service";

@Injectable()

export class EPDService {
    products: EPDProduct[] = null;

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
        return  this.dataFetch.getEpdProducts().then((products:EPDProduct[]) => {
            this.products = products;
            this.busyConfig.busy = false;
        }).catch((error) => {
          this.busyConfig.busy = false;
          this.ga.catchError(`epd ${error.message}`);
        })
    }
}
