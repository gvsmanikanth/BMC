import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { cases } from '../data/cases';
import { products } from '../data/products';
import { Case } from '../models/case/case.model';
import { EPDProduct } from '../models/epd/epd-product.model';

@Injectable()
export class DataFetchService {
    constructor (private http: HttpClient) {

    }

    getEpdProducts() {
        if (window.location.href.indexOf('localhost:4200') !== -1) {
            return Promise.resolve(products)
        }
        
        return this.http.get('/bin/supportcentralcontent?content_type=PRODUCT_DOWNLOAD').toPromise()
    }

    getCases(): Promise<Case[]> {
        if (window.location.href.indexOf('localhost:4200') !== -1) {
            return Promise.resolve(cases)
        }
        
        return this.http.get('/bin/supportcases').toPromise().then((response: any) => {
            return response.Cases;
        })
    }

}