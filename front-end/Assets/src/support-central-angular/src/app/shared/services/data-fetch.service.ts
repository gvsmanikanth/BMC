import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { cases } from '../data/cases';
import { askCommunities } from '../data/communitiesQuestions';
import { docs } from '../data/docs';
import { products } from '../data/products';
import { questions } from '../data/questions';
import { Case } from '../models/case/case.model';
import { AskCommunityProduct } from '../models/communities/ask-communities.model';
import { DocsProduct } from '../models/docs/docs-product.model';
import { EPDProduct } from '../models/epd/epd-product.model';
import { SupportQuestion } from '../models/questions/question.model';

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

    getDocsProducts(): Promise<DocsProduct[]> {
        if (window.location.href.indexOf('localhost:4200') !== -1) {
            return Promise.resolve(docs)
        }

        return this.http.get('/bin/supportcentralcontent?content_type=DOCUMENTATION').toPromise().then((response:DocsProduct[]) => {
           return response
        });
    }

    getQuestions(): Promise<SupportQuestion[]> {
        if (window.location.href.indexOf('localhost:4200') !== -1) {
            return Promise.resolve(questions);
        }

        return this.http.get('/bin/supportcentralcontent?content_type=FAQ_SUPPORT').toPromise().then((response:any) => {
           return response.details
        });
    }

    getCommunitiesQuestions(): Promise<AskCommunityProduct[]> {
        if (window.location.href.indexOf('localhost:4200') !== -1) {
            return Promise.resolve(askCommunities);
        }

        return this.http.get('/bin/supportcentralcontent?content_type=ASK_COMMUNITES').toPromise().then((response:AskCommunityProduct[]) => {
           return response
        });
    }

}