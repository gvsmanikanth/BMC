package com.bmc.models.bmcmeta;

import org.apache.felix.scr.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by elambert on 5/26/17.
 */
@Component(
        label = "BMCMeta Compoonent",
        description = "Helper Service for BMCMeta Object",
        immediate = true)
public class BmcMeta {

    private static final Logger logger = LoggerFactory.getLogger(BmcMeta.class);

    public BmcMeta() {
        setPage(new PageMeta());
        setSite(new SiteMeta());
        setUser(new UserMeta());
    }

    public void initSupport() {
        setSupport(new SupportMeta());
    }

    public void initFormMeta() {
        setFormMeta(new FormMeta());
    }

    private FormMeta form;
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

    public FormMeta getForm() {
        return form;
    }

    public void setFormMeta(FormMeta form) {
        this.form = form;
    }
}
