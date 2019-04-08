package com.bmc.services;

import org.json.JSONObject;

import javax.jcr.Session;

public interface ResourceCenterService {

    JSONObject getResourceOptions(Session session);
    JSONObject getResourceOptions(Session session, String option);
    JSONObject getResourceOptions(Session session, String[] options);

}
