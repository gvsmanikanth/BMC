import { AskCommunitiesDetail } from './ask-communities-detail.model';

export interface AskCommunityProduct {
    productBaseSmartNo: string,
    productName: string,
    communityDetails: Array<AskCommunitiesDetail>
}