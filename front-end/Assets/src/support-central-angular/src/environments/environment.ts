// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false
};

window['psc'] = {
  widgets: {
    askCommunity: "https://communities.bmc.com/welcome",
    bmcHelixServices: "https://stage.cms.bmc.com/it-services/bmc-helix-services.html",
    docs: "https://docs.bmc.com/docs/dashboard.action",
    enhancedServices: "https://stage.cms.bmc.com/it-services/enhanced-support-services.html",
    implServices: "https://stage.cms.bmc.com/it-services/implementation-services.html",
    listCase: "https://sfadev2-bmcsites.cs27.force.com/casemgmt/sc_CommunityHome",
    mainframeServices: "https://stage.cms.bmc.com/it-services/mainframe-services-rsm-partners.html",
    manageCase: "https://stage.cms.bmc.com/support/resources/issue-defect-management.html",
    managedServices: "https://stage.cms.bmc.com/it-services/managed-services.html",
    openCase: "https://sfadev2-bmcsites.cs27.force.com/casemgmt/apex/CreateNewCase",
    prdCompatibility: "https://docs.bmc.com/docs/modeler/#/",
    prdDownloads: "https://stage.cms.bmc.com/available/epd.html",
    prdSupport: "https://docs.bmc.com/docs/productinfo",
    servicesConsulting: "https://stage.cms.bmc.com/it-services/it-consulting-services.html",
    strategicServices: "https://stage.cms.bmc.com/it-services/strategic-services.html",
    supportVideos: "https://communities.bmc.com/community/support/blog/2018/09/17/support-videos",
    supportedProducts: "https://stage.cms.bmc.com/available/supported-product-az-list.html",
    training: "https://stage.cms.bmc.com/education/training-and-certification.html",
    caseDetailUrl: "https://bmcsites.force.com/casemgmt/SC_CaseDetailPage?CaseId=",
    supportQuestionUrl: "https://communities.bmc.com/community/support/"
  },
  user: {
    loggedIn: 'true'
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
