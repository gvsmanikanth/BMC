package com.bmc.services;

import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Service;
import org.apache.jackrabbit.api.security.user.Authorizable;
import org.apache.jackrabbit.api.security.user.UserManager;
import org.apache.sling.api.resource.ResourceResolver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Component(
        label = "User Profile Servie",
        description = "Helper Service for User Profile Details",
        immediate = true)
@Service(value=ProfileService.class)
public class ProfileService {

    private static final Logger logger = LoggerFactory.getLogger(ProfileService.class);


}
