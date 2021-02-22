import { DocsProductVersion } from './docs-product-version.model';

export interface DocsProduct {
    baseSequenceId: number,
    productBaseSmartNo: string,  
    description: string,  
    versionProduct: DocsProductVersion[]
}