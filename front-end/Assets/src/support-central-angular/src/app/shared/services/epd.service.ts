import { Injectable } from "@angular/core";
import { EPDProduct } from '../models/epd/epd-product.model';
import { DataFetchService } from './data-fetch.service';

@Injectable()

export class EPDService {
    products: EPDProduct[] = null;
    constructor (private dataFetch: DataFetchService) {}

    busyConfig = {
        busy: true,
        backdrop: false,
        loaderType: 'section',
        message: 'Loading'
    }

    getProducts() {
        return  this.dataFetch.getEpdProducts().then((products:EPDProduct[]) => {
            this.products = products;
            this.busyConfig.busy = false;
        }).catch(() => {
          this.busyConfig.busy = false;
        })
    }
}
