import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { products } from '../data/products';
import { EPDProduct } from '../models/epd/epd-product.model';

@Injectable()
export class DataFetchService {
    constructor (private http: HttpClient) {

    }

    getEpdProducts() {
        if (window.location.href.indexOf('localhost:4200') !== -1) {
            return Promise.resolve(products)
        }
        
        return this.http.get('/bin/supportcentral/content?content_type=PRODUCT_DOWNLOAD').toPromise()
    }

}