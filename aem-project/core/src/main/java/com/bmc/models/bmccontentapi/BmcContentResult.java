package com.bmc.models.bmccontentapi;

import java.util.List;

public class BmcContentResult {

    private List<BmcContent> results;
    private BmcPagination pagination;

    public BmcContentResult(List<BmcContent> results) {
        this(results, 10L, Long.valueOf(0));
    }

    public BmcContentResult(List<BmcContent> results, Long resultsPerPage,  Long totalMatches) {
        this.results = results;
        this.pagination = new BmcPagination();
        this.pagination.setResultsPerPage(resultsPerPage);
        this.pagination.setNumberOfPages(Math.round(Math.ceil((float )totalMatches / resultsPerPage)));
        this.pagination.setTotalMatches(totalMatches);
    }

    public List<BmcContent> getResults() {
        return results;
    }

    public BmcPagination getPagination() {
        return pagination;
    }

    public class BmcPagination {

        private Long resultsPerPage;
        private Long numberOfPages;
        private Long totalMatches;

        public Long getResultsPerPage() {
            return resultsPerPage;
        }
        public void setResultsPerPage(Long resultsPerPage) {
            this.resultsPerPage = resultsPerPage;
        }
        public Long getNumberOfPages() {
            return numberOfPages;
        }
        public void setNumberOfPages(Long numberOfPages) {
            this.numberOfPages = numberOfPages;
        }
        public Long getTotalMatches() {
            return totalMatches;
        }
        public void setTotalMatches(Long totalMatches) {
            this.totalMatches = totalMatches;
        }
    }
}
