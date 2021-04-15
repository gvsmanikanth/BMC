import { EPDDeeplink } from './epd-deeplink.model';

export interface EPDProduct {
    smartNumber: string
    productName: string
    deeplinks: Array<EPDDeeplink>
}