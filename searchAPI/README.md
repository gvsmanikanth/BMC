# BMC-DXP Readme for search API

# API end points:
    - Get all filters: <host>:<port>/bin/contentapi/filters
    - Get content: <host>:<port>/bin/contentapi/content

## Filters API - /bin/contentapi/filters
    - payload type: get
    - Parameters: none


## Content API - /bin/contentapi/content
    - payload type: get
    - Parameters:

### general param
    - [rootPath] Paths filter to query in JCR. Values should be comma-separated
        - single value
        - example: /bin/contentapi/content?rootPath=/content/bmc/us/en
        - example: /bin/contentapi/content?rootPath=/content/bmc/us/en/documents,/content/bmc/videos
    
### filter
    - [filter] filter results by returning only pages with matching filter value in the metadata.
        - multi value, comma-separated
        - filter values: all possible values can be found from response of /bin/contentapi/filters
        - example: /bin/contentapi/content?rootPath=/content/bmc/us/en/documents&ic-content-type=ic-type-196363946,ic-type-146731505,ic-type-185980791&ic-topics=ic-topics-017644695,ic-topics-594037608

### keyword
    - [keyword] search pages with the keywords that are within jcr title and jcr description
        - multi value
        - keyword values: any keyword you would like to search
        - example: /bin/contentapi/content?rootPath=/content/bmc/us/en&keyword=Supplier&keyword=Corporate

### sorting
    - [sortCriteria] & [sortOrder] sort result base on sort criteria and sort direction
        - multi value
        - sortCriteria values:
            - creation : sort by creation time
            - title : sort by title of node
            - modified : sort by last modified
        - sortOrder values:
            - asc
            - desc
        - example: /bin/contentapi/content?rootPath=/content/bmc/us/en&sortCriteria=modified&sortOrder=asc&sortCriteria=title&sortOrder=asc&filter=ic-buyer-stage-776139085


### pagination
    - [resultsPerPage] & [pageIndex] breaks up the result with pagination
        - single value
        - example: /bin/contentapi/content?rootPath=/content/bmc/us/en&resultsPerPage=10&pageIndex=0


# Indexes

Oak Lucene index is configured to avoid full traversal when filtering content. Index is configured using ACS Commons Ensure Index https://adobe-consulting-services.github.io/acs-aem-commons/features/ensure-oak-index/index.html


### Example
    - oak:index
        - icResource
            - indexRules
                - cq:Page
                    - properties
                        - ictopics
                            - propertyIndex = true
                            - name = jcr:content/ic-topics
                        - ictargetpersona
                            - propertyIndex = true
                            - name = jcr:content/ic-target-persona

To confirm that index works, run Explain Query in ```/libs/granite/operations/content/diagnosis/tool.html/granite_queryperformance```
```
/jcr:root/content/bmc/us/en/documents//element(*, cq:Page) [ (jcr:content/@ic-buyer-stage = 'ic-buyer-stage-453243382')  ]
```


# Unit Testing:

## Frameworks for testing
 - Mockito
 - Powermock
 
 ## How and what are being tested
  - We only test custom code. We do not test AEM modules. The reason why is because AEM should already be working, there is no point testing the functionality of AEM components (Example: QueryBuilder & Query Search)
 
 - We test functions that uses AEM components by using powermock framework to mock the behavior of AEM component. For example, to mock the output of
 ```resourceResolver.resolve(String str)```
 we do
 
 ```
 ResourceResolver mockResourceResolve = mock(ResourceResolver.class);
 Resource resource = mock(Resource.class);
 when(mockResourceResolver.resolve(any(String.class))).thenReturn(mockResource);
 ```
that way, the function to be tested won't be stuck on the part where it uses AEM component such as ResourceResolver.

# API switch:

## A flag in OSGI config is responsible for turn this API on/off. When the flag is turned off, the API will return a string "This API is turned off in OSGI config."

## Go to /system/console/configMgr and search for "Resource Center Service". In the dialog, the "Resource Center Query API switch" is a boolean flag to turn the API on/off.
## The configuration is also in the source code -> aem-project/ui.apps/src/main/content/jcr_root/apps/bmc/config/com.bmc.services.ResourceCenterServiceImpl.xml

