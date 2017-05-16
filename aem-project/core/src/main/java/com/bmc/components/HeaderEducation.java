package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;

import java.util.ArrayList;

public class HeaderEducation extends WCMUsePojo {

    private ArrayList<HeaderEducationItem> list;

    @Override
    public void activate() throws Exception {
        // TODO: Replace with query to get real list of products
        list = new ArrayList<>();
        list.add(new HeaderEducationItem("/url1", "Link 1"));
        list.add(new HeaderEducationItem("/url2", "Link 2"));
        list.add(new HeaderEducationItem("/url3", "Link 3"));
    }

    public ArrayList<HeaderEducationItem> getList() {
        return list;
    }
}