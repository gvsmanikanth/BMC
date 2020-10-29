import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { cases } from '../data/cases';
import { askCommunities } from '../data/community/communitiesQuestions';
import { discussion } from '../data/community/community-discussion';
import { communityDocs } from '../data/community/community-docs';
import { idea } from '../data/community/community-idea';
import { post } from '../data/community/community-post';
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

        return this.http.get('/bin/supportcentralcontent?content_type=ASK_COMMUNITIES').toPromise().then((response:AskCommunityProduct[]) => {
           return response
        });
    }

    getCommunitiesIdeas(smartNumber: string): Promise<AskCommunityProduct[]> {
        if (window.location.href.indexOf('localhost:4200') !== -1) {
            return Promise.resolve(idea);
        }

        return this.http.get('/bin/supportcentralcontent?content_type=COMMUNITY_IDEA&smart_number=' + smartNumber).toPromise().then((response:any) => {
           return response.body.data;
        });
    }

    getCommunitiesPosts(smartNumber: string): Promise<AskCommunityProduct[]> {
        if (window.location.href.indexOf('localhost:4200') !== -1) {
            return Promise.resolve(post);
        }

        return this.http.get('/bin/supportcentralcontent?content_type=COMMUNITY_POST&smart_number=' + smartNumber).toPromise().then((response:any) => {
           return response.body.data;
        });
    }

    getCommunitiesDocs(smartNumber: string): Promise<AskCommunityProduct[]> {
        if (window.location.href.indexOf('localhost:4200') !== -1) {
            return Promise.resolve(communityDocs);
        }

        return this.http.get('/bin/supportcentralcontent?content_type=COMMUNITY_DOC&smart_number=' + smartNumber).toPromise().then((response:any) => {
           return response.body.data;
        });
    }

    getCommunitiesDiscussion(smartNumber: string): Promise<AskCommunityProduct[]> {
        if (window.location.href.indexOf('localhost:4200') !== -1) {
            return Promise.resolve(discussion);
        }

        return this.http.get('/bin/supportcentralcontent?content_type=COMMUNITY_DISCUSSION&smart_number=' + smartNumber).toPromise().then((response:any) => {
           return response.body.data;
        });
    }

}