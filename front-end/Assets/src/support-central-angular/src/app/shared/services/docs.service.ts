import { Injectable } from '@angular/core';
import { DocsProduct } from '../models/docs/docs-product.model';
import { DataFetchService } from './data-fetch.service';

@Injectable()
export class DocsService {

  docs: DocsProduct[] = null;

  busyConfig = {
    busy: true,
    backdrop: false,
    loaderType: 'section',
    message: 'Loading'
  }

  constructor(private dataFetch: DataFetchService) { }

  loadDocs() {
    this.dataFetch.getDocsProducts().then((docs) => {
      this.docs = docs;
      this.busyConfig.busy = false;
    }).catch(() => {
      this.busyConfig.busy = false;
    })
  }
}
