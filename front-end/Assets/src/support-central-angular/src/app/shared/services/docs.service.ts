import { Injectable } from '@angular/core';
import { DocsProduct } from '../models/docs/docs-product.model';
import { DataFetchService } from './data-fetch.service';
import { GoogleAnalyticsService } from './google-analytics.service';

@Injectable()
export class DocsService {

  docs: DocsProduct[] = null;

  busyConfig = {
    busy: true,
    backdrop: false,
    loaderType: 'section',
    message: 'Loading'
  }

  constructor(
    private dataFetch: DataFetchService,
    private ga: GoogleAnalyticsService
  ) {}

  loadDocs() {
    if (this.docs) return Promise.resolve();
    this.dataFetch.getDocsProducts().then((docs) => {
      this.docs = docs;
      this.busyConfig.busy = false;
    }).catch((error) => {
      this.busyConfig.busy = false;
      console.log(error);
      this.ga.catchError(`docs ${error.message}`);
    })
  }
}
