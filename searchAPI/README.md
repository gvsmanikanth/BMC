# BMC-DXP read-me for search API

# API end points:
    - Get all filters: <host>:<port>/bin/contentapi/filters
    - Get content: <host>:<port>/bin/contentapi/content

## Filters API - /bin/contentapi/filters
    - payload type: get
    - Parameters: none


## Content API - /bin/contentapi/content
    - payload type: get
    - Parameters: see below

### general param
    - rootPath
        - single value
        - example: /bin/contentapi/content?rootPath=/content/bmc/us/en
    
### filter
    - filter
        - multi value
        - filter values: everything returned by filters API
        - example: /bin/contentapi/content?rootPath=/content/bmc/us/en&filter=ic-target-industry-272486674&filter=ic-topics-773791639

### sorting
    - sortCriteria & sortOrder
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
    - resultsPerPage & pageIndex
        - single value
        - example: /bin/contentapi/content?rootPath=/content/bmc/us/en&resultsPerPage=10&pageIndex=0




