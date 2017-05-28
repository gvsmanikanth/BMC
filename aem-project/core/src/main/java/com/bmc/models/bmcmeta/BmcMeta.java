package com.bmc.models.bmcmeta;

/**
 * Created by elambert on 5/26/17.
 */
public class BmcMeta {

    public BmcMeta() {
        setPage(new PageMeta());
        setSite(new SiteMeta());
        setUser(new UserMeta());
        setSupport(new SupportMeta());
    }


    private PageMeta page;
    private SiteMeta site;
    private UserMeta user;
    private SupportMeta support;

    public PageMeta getPage() {
        return page;
    }

    public void setPage(PageMeta page) {
        this.page = page;
    }

    public SiteMeta getSite() {
        return site;
    }

    public void setSite(SiteMeta site) {
        this.site = site;
    }

    public UserMeta getUser() {
        return user;
    }

    public void setUser(UserMeta user) {
        this.user = user;
    }

    public SupportMeta getSupport() {
        return support;
    }

    public void setSupport(SupportMeta support) {
        this.support = support;
    }
}
