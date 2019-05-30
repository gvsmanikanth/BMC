# BMC-DXP read-me for search API

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
    - [rootPath] A path filter to query in JCR. All results will come under rootPath
        - single value
        - example: /bin/contentapi/content?rootPath=/content/bmc/us/en
    
### filter
    - [filter] filter results by returning only pages with matching filter value in the metadata.
        - multi value
        - filter values: all possible values can be found from response of /bin/contentapi/filters
        - example: /bin/contentapi/content?rootPath=/content/bmc/us/en&filter=ic-target-industry-272486674&filter=ic-topics-773791639

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




