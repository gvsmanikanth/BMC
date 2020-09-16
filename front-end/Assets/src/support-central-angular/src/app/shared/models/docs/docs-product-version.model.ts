import { DocsVersionItem } from './docs-version-items.model';

export interface DocsProductVersion {
    baseSequenceId: number,  
    productVersionSmartNo: string,  
    productVersionId: string,  
    description: string,
    itemDetails: DocsVersionItem[]
}