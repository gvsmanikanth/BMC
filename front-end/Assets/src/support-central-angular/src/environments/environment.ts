// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false
};

window['psc'] = {
  widgets: {
    askCommunity: "https://communities.bmc.com/welcome",
    docs: "https://docs.bmc.com/docs/dashboard.action",
    listCase: "https://sfadev2-bmcsites.cs27.force.com/casemgmt/sc_CommunityHome",
    manageCase: "https://stage.cms.bmc.com/support/resources/issue-defect-management.html",
    openCase: "https://sfadev2-bmcsites.cs27.force.com/casemgmt/apex/CreateNewCase",
    prdCompatibility: "https://customerapps.bmc.com/spac/o/welcome.html",
    prdDownloads: "https://stage.cms.bmc.com/available/epd.html",
    prdSupport: "https://docs.bmc.com/docs/productinfo",
    supportVideos: "https://communities.bmc.com/community/support/blog/2018/09/17/support-videos",
    supportedProducts: "https://stage.cms.bmc.com/available/supported-product-az-list.html",
    training: "https://stage.cms.bmc.com/education/training-and-certification.html"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
