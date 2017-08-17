$.noConflict();
jQuery( document ).ready(function( $ ) {
		Coveo.SearchEndpoint.endpoints["default"] = new Coveo.SearchEndpoint({
		  restUri: 'https://cloudplatform.coveo.com/rest/search',
		  accessToken: supportCoveoAccessToken,
		  anonymous: true
});
    //Coveo.SearchEndpoint.endpoints.default.options.queryStringArguments = { 
            //'pipeline' : 'Public' 
   // };
// Enable jsonp if browser is IE8 or IE9
  function isIE () {
      var myNav = navigator.userAgent.toLowerCase();
      return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
  }
  if (isIE() && isIE() < 10) {
      Coveo.SearchEndpoint.endpoints.default.caller.useJsonp = true;    
  }

	  var bmcValueCaption = {
                            'csmessage' : 'Communities Message',
                            'csdiscussion': 'Communities Discussion',
                            'cscomment': 'Communities Comment',
                            'csidea': 'Communities Idea',
                            'csblogpost': 'Communities Blog Post',
                            'csdocument': 'Communities Document',
                            'cssystemblog': 'Communities System Blog',
                            'csannouncement': 'Communities Announcement',
                            'SalesforceItem': 'Knowledge Base Article',
                            'cscommunity': 'Communities',
                            'cssocialgroup': 'Communities Social Group',
                            'CFPage': 'Page',
                            'CFSpace': 'Space',
                            'CFComment': 'Comment',
                            'CFBlogEntry': 'Blog Entry',
                            'APTS Solutions': 'Mainframe APAR/PTFs'
      
      }

      Coveo.$("#search").coveo("init", {
			Facet: {
				valueCaption: bmcValueCaption 
			},
			externalComponents: [Coveo.$('#searchbox')]

	  });
        

    Coveo.$('#search').on('newResultDisplayed', function(e, args) {
        if (args.result.raw.syssource.indexOf('Confluence') > -1){
           if(!args.result.raw.syscontainsattachment) {
               Coveo.$(args.item).find('.CoveoResultFolding').remove();
               Coveo.$(args.item).find('.coveo-folding-footer').remove()
           }
        }
        if (args.result.raw.syssource.indexOf('Communities') > -1){
           if(!args.result.raw.jivecontainsattachment) {
               Coveo.$(args.item).find('.CoveoResultFolding').remove();
               Coveo.$(args.item).find('.coveo-folding-footer').remove()
           }
        }
     });
       
       Coveo.$('#search').on('preprocessResults', function(e, args) {
         args.results.results.forEach(function(r) { 
             if (r.raw.objecttype=='KBScFAQProcedural'){
                 r.clickUri = supportcentralurl+ '/sc_KnowledgeArticle?sfdcid='+r.raw.sfid+'&type=FAQ';
             }
             else if (r.raw.objecttype=='KBScProductServiceDescription'){
                 r.clickUri = supportcentralurl+ '/sc_KnowledgeArticle?sfdcid='+r.raw.sfid+'&type=ProductDescription';
             }
             else if (r.raw.objecttype=='KBScSolutionsToAProductProblem'){
                 r.clickUri = supportcentralurl+ '/sc_KnowledgeArticle?sfdcid='+r.raw.sfid+'&type=Solution';
             }
         });
       });

      //Add analytics custom events    
      Coveo.$('#search').on('changeAnalyticsCustomData', function(e, args) {
          if (args.type=='ClickEvent') {
              var result = Coveo.$("[href='"+args.metaObject.documentURL+"']").closest('.CoveoResult').data('CoveoResult');
              if (result && result.raw.sfkbid) {
                  args.metaObject.documentauthor = result.raw.sysauthor;
              }
          }
      });
	});
	
