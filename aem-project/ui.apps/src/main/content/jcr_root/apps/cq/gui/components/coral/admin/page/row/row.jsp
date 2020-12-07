<%--
  ADOBE CONFIDENTIAL

  Copyright 2015 Adobe Systems Incorporated
  All Rights Reserved.

  NOTICE:  All information contained herein is, and remains
  the property of Adobe Systems Incorporated and its suppliers,
  if any.  The intellectual and technical concepts contained
  herein are proprietary to Adobe Systems Incorporated and its
  suppliers and may be covered by U.S. and Foreign Patents,
  patents in process, and are protected by trade secret or copyright law.
  Dissemination of this information or reproduction of this material
  is strictly forbidden unless prior written permission is obtained
  from Adobe Systems Incorporated.
--%><%
%><%@include file="/libs/granite/ui/global.jsp"%><%
%><%@page session="false"%><%
%><%@page import="java.util.ArrayList,
                  java.util.Calendar,
                  java.util.Collection,
                  java.util.LinkedHashMap,
                  java.util.List,
                  java.util.Locale,
                  java.util.Map,
                  java.time.OffsetDateTime,
                  javax.jcr.RepositoryException,
                  javax.jcr.Session,
                  javax.jcr.security.AccessControlManager,
                  javax.jcr.security.Privilege,
                  org.apache.commons.lang.StringUtils,
                  org.apache.jackrabbit.util.Text,
                  org.apache.sling.api.resource.ResourceResolver,
                  org.apache.sling.api.resource.ValueMap,
                  com.adobe.cq.ui.commons.admin.views.PublicationStatusUtils,
                  com.adobe.cq.contentinsight.ProviderSettingsManager,
                  com.adobe.cq.wcm.launches.utils.LaunchUtils,
                  com.adobe.granite.security.user.util.AuthorizableUtil,
                  com.adobe.granite.ui.components.AttrBuilder,
                  com.adobe.granite.ui.components.Tag,
                  com.adobe.granite.workflow.exec.Workflow,
                  com.adobe.granite.workflow.status.WorkflowStatus,
                  com.adobe.granite.workflow.exec.WorkItem,
                  com.day.cq.replication.AgentManager,
                  com.day.cq.replication.ReplicationQueue,
                  com.day.cq.replication.ReplicationStatus,
                  org.slf4j.Logger,
                  org.slf4j.LoggerFactory,
                  com.day.cq.wcm.api.Page,
                  com.day.cq.wcm.api.PageManager,
                  com.day.cq.wcm.api.PageInfoAggregator,
                  com.day.cq.wcm.api.Template,
                  com.day.cq.wcm.msm.api.LiveRelationshipManager" %><%
%><%@taglib prefix="cq" uri="http://www.day.com/taglibs/cq/1.0" %><%

final Locale locale = request.getLocale();

AccessControlManager acm = null;
try {
    acm = resourceResolver.adaptTo(Session.class).getAccessControlManager();
} catch (RepositoryException e) {
    log.warn("Unable to get access manager", e);
}

AgentManager agentManager = sling.getService(AgentManager.class);

ProviderSettingsManager providerSettingsManager = sling.getService(ProviderSettingsManager.class);
boolean hasAnalytics = false;
if (providerSettingsManager != null) {
    hasAnalytics = providerSettingsManager.hasActiveProviders(resource);
}

WorkflowStatus workflowStatus = resource.adaptTo(WorkflowStatus.class);
List<Workflow> workflows = workflowStatus.getWorkflows(false);

ReplicationStatus replicationStatus = resource.adaptTo(ReplicationStatus.class);

Page cqPage = resource.adaptTo(Page.class);
ValueMap resourceProperties;
String title;
String actionRels = StringUtils.join(getActionRels(resource, cqPage, acm, hasAnalytics), " ");

Calendar lastModifiedDate = null;

if (cqPage != null) {
    resourceProperties = cqPage.getProperties();
    title = cqPage.getTitle() == null ? cqPage.getName() : cqPage.getTitle();
    lastModifiedDate = cqPage.getLastModified();
} else {
    resourceProperties = resource.getValueMap();
    title = resourceProperties.get("jcr:content/translation-status", resourceProperties.get("translation-status", resource.getName()));
}

Calendar publishedDate = null;
String publishedBy = null;
Boolean isDeactivated = false;

if (replicationStatus != null) {
    publishedDate = replicationStatus.getLastPublished();
    publishedBy = AuthorizableUtil.getFormattedName(resourceResolver, replicationStatus.getLastPublishedBy());
    isDeactivated = replicationStatus.isDeactivated();
}

Map<String, ReplicationQueue.Entry> replicationEntries = (Map<String, ReplicationQueue.Entry>)request.getAttribute("libs.cq.gui.components.coral.admin.page.row.replicationMap");
if (replicationEntries == null) {
    replicationEntries = PublicationStatusUtils.buildPendingReplicationMap(agentManager);
    request.setAttribute("libs.cq.gui.components.coral.admin.page.row.replicationMap", replicationEntries);
}

LiveRelationshipManager liveRelationshipManager = resourceResolver.adaptTo(LiveRelationshipManager.class);
boolean isLiveCopy = liveRelationshipManager.hasLiveRelationship(resource);
boolean isLaunchCopy = LaunchUtils.isLaunchResourcePath(resource.getPath());

String propertiesHref = null;
if (cqPage != null) {
    propertiesHref = "/libs/wcm/core/content/sites/properties.html?item=" + Text.escape(cqPage.getPath());
} else if (!resource.isResourceType("nt:folder")) {
    // for nt:folder there are no properties to edit
    propertiesHref = "/libs/wcm/core/content/sites/folderproperties.html" + Text.escapePath(resource.getPath());
}

String templateTitle = "";
if (cqPage != null && cqPage.getTemplate() != null) {
    Template template = cqPage.getTemplate();
    templateTitle = template.getTitle();
    if ("".equals(templateTitle) || templateTitle == null) templateTitle = template.getName();
}

Tag tag = cmp.consumeTag();
AttrBuilder attrs = tag.getAttrs();

attrs.addClass("foundation-collection-navigator");

attrs.add("is", "coral-table-row");
attrs.add("data-timeline", true);
attrs.add("data-cq-page-livecopy", isLiveCopy);

%><tr <%= attrs %>>
    <td is="coral-table-cell" coral-table-rowselect><%
        if (cqPage != null) {
            %><img class="foundation-collection-item-thumbnail" src="<%= xssAPI.getValidHref(request.getContextPath() + getThumbnailUrl(cqPage, 48, 48)) %>" alt=""><%
        } else {
            %><coral-icon class="foundation-collection-item-thumbnail" icon="folder"></coral-icon><%
        }
    %></td>
    <td class="foundation-collection-item-title" is="coral-table-cell" value="<%= xssAPI.encodeForHTMLAttr(title) %>"><%
        %><%= xssAPI.encodeForHTML(title) %><%
        String context = isLaunchCopy ? i18n.get("Launch Copy") : isLiveCopy ? i18n.get("Live Copy") : null;
        if (context != null) {
            %><div class="aem-PageRow-context"><%= xssAPI.encodeForHTML(context) %></div><%
        }
        %><link rel="properties" href="<%= xssAPI.getValidHref(request.getContextPath() + propertiesHref) %>">
    </td>
    <td is="coral-table-cell" value="<%= xssAPI.encodeForHTMLAttr(resource.getName()) %>">
        <%= xssAPI.encodeForHTML(resource.getName()) %>
    </td>
    <td is="coral-table-cell" value="<%= (lastModifiedDate != null) ? xssAPI.encodeForHTMLAttr(Long.toString(lastModifiedDate.getTimeInMillis())) : "0" %>"><%
        if (cqPage != null && lastModifiedDate != null) {
    %><foundation-time value="<%= xssAPI.encodeForHTMLAttr(lastModifiedDate.toInstant().toString()) %>"></foundation-time><%

            // Modified-after-publish indicator
            if (publishedDate != null && publishedDate.before(lastModifiedDate)) {
                String modifiedAfterPublishStatus = i18n.get("Modified since last publication");
                %><coral-icon class="aem-PageRow-icon aem-PageRow-icon--warning" icon="alert" size="XS" title="<%= xssAPI.encodeForHTMLAttr(modifiedAfterPublishStatus) %>"></coral-icon><%
            }

            %><div class="foundation-layout-util-subtletext"><%= xssAPI.encodeForHTML(AuthorizableUtil.getFormattedName(resourceResolver, cqPage.getLastModifiedBy())) %></div><%
        }
    %></td>
    <td is="coral-table-cell" value="<%= (!isDeactivated && publishedDate != null) ? xssAPI.encodeForHTMLAttr(Long.toString(publishedDate.getTimeInMillis())) : "0" %>"><%
        // Published date and status
        if (!isDeactivated && publishedDate != null) {
    %><foundation-time value="<%= xssAPI.encodeForHTMLAttr(publishedDate.toInstant().toString()) %>"></foundation-time><%
        } else {
            %><span><%= xssAPI.encodeForHTML(i18n.get("Not published")) %></span><%
        }

        // Publication/un-publication pending indicator
        List<String> publicationPendingStatus = PublicationStatusUtils.getPendingStatus(replicationEntries, resource.getPath() , i18n);
        if (publicationPendingStatus.size() > 0) {
            %><coral-icon class="aem-PageRow-icon aem-PageRow-icon--warning" icon="pending" size="XS" title="<%= xssAPI.encodeForHTMLAttr(StringUtils.join(publicationPendingStatus, " ")) %>"></coral-icon><%
        }

        // On/Off time indicator
        String onOffTimeStatus = getOnOffTimeStatus(resourceProperties, i18n, locale);
        if (onOffTimeStatus.length() > 0) {
            %><coral-icon class="aem-PageRow-icon aem-PageRow-icon--info" icon="clock" size="XS" title="<%= xssAPI.encodeForHTMLAttr(onOffTimeStatus) %>"></coral-icon><%
        }

        // Publication/un-publication scheduled indicator
        List<Workflow> scheduledWorkflows = PublicationStatusUtils.getScheduledWorkflows(workflowStatus);
        if (scheduledWorkflows.size() > 0) {
            List<PublicationStatusUtils.ScheduledStatus> scheduledStatus = PublicationStatusUtils.getScheduledStatus(scheduledWorkflows, resourceResolver);
            if (scheduledStatus.size() > 0) {
              %><coral-icon class="aem-PageRow-icon aem-PageRow-icon--info" icon="calendar" size="XS"></coral-icon><%
              %><coral-tooltip variant="inspect" placement="right" target="_prev"><%
                for (PublicationStatusUtils.ScheduledStatus sInfo : scheduledStatus) {
                  %><%= xssAPI.encodeForHTML(i18n.get(sInfo.isPublishPending() ? "Publication Pending":"Un-publication Pending")) %><br><%
                  %><%= i18n.get("Version") %>: <%= xssAPI.encodeForHTML(sInfo.getVersion()) %><br><%
                  OffsetDateTime odt = sInfo.getOffsetDateTime();
                  if (odt != null) {
                    %><%= i18n.get("Scheduled") %>: <foundation-time value="<%= xssAPI.encodeForHTMLAttr(odt.toString()) %>" format="short" type="datetime"></foundation-time><br><%
                  }
                  %>(<%= xssAPI.encodeForHTML(sInfo.getAuthorizableName()) %>)<br><%
                } %></coral-tooltip><%
            }
        }

        // Published by
        if (!isDeactivated && publishedBy != null) {
            %><div class="foundation-layout-util-subtletext"><%= xssAPI.encodeForHTML(publishedBy) %></div><%
        }

        String strTranslationStatus = getTranslationStatus(resourceProperties, i18n);
        %><meta class="foundation-collection-quickactions" data-foundation-collection-quickactions-rel="<%= xssAPI.encodeForHTMLAttr(actionRels) %>">
    </td>
    <td is="coral-table-cell" value="<%= xssAPI.encodeForHTMLAttr(templateTitle) %>">
        <%= xssAPI.encodeForHTML(templateTitle) %>
    </td>
    <td is="coral-table-cell" value="<%= workflows.size() %>">
        <% if (workflows.size() > 0) { %>
        <a class="cq-timeline-control" data-cq-timeline-control-filter="workflows" href="#">
            <foundation-workflowstatus variant="<%= isWorkflowFailed(workflows) ? "error" : "default" %>">
        <%
            final String nameDisplayOrder = i18n.get("{0} {1}", "name display order: {0} is the given (first) name, {1} the family (last) name", "givenName middleName", "familyName");
            for (Workflow w : workflows) { %>
                <foundation-workflowstatus-item
                        author="<%= xssAPI.encodeForHTMLAttr(AuthorizableUtil.getFormattedName(resourceResolver, w.getInitiator(), nameDisplayOrder)) %>"
                        timestamp="<%= xssAPI.encodeForHTMLAttr(w.getTimeStarted().toInstant().toString()) %>">
                    <%= xssAPI.encodeForHTML(i18n.getVar(w.getWorkflowModel().getTitle())) %></foundation-workflowstatus-item>

            <% } %>
            </foundation-workflowstatus>
        </a>
        <% } %>
    </td>
    <td is="coral-table-cell" value="<%= xssAPI.encodeForHTMLAttr(templateTitle) %>">
        <%= xssAPI.encodeForHTML(strTranslationStatus) %>
    </td><%
    // Add the analytics data
    PageInfoAggregator piAggregatorService = sling.getService(PageInfoAggregator.class);
    LinkedHashMap<String, Map<String, Object>> showColumnInfo = (LinkedHashMap<String, Map<String, Object>>) request.getAttribute("sites.listView.info.providers");

    if (piAggregatorService != null && showColumnInfo != null) {
        Map<String, Object> customPageData = piAggregatorService.getAggregatedPageInfo(slingRequest, resource);
        for (Map.Entry<String, Map<String, Object>> columnInfoEntry : showColumnInfo.entrySet()) {
            String providerName = columnInfoEntry.getKey();
            Map<String, Object> providerCustomProperties = (Map<String, Object>) customPageData.get(providerName);
            if (providerCustomProperties != null) {
                List<String> columnProviderProperties = (List<String>) columnInfoEntry.getValue().get("properties");
                List<String> columnResourceTypes = (List<String>) columnInfoEntry.getValue().get("resourceTypes");
                for (String columnProviderProperty : columnProviderProperties) {
                    Object propValue = providerCustomProperties.get(columnProviderProperty);
                    Object trendInfo = providerCustomProperties.get(columnProviderProperty + "trend");
                    int index = columnProviderProperties.indexOf(columnProviderProperty);
                    String resourceType = columnResourceTypes.get(index);
                    if (propValue != null) {
                        request.setAttribute("sites.listView.info.render.provider", providerName);
                        request.setAttribute("sites.listView.info.render.providerProperty", columnProviderProperty);
                        request.setAttribute("sites.listView.info.render.value", propValue.toString());
                        request.setAttribute("sites.listView.info.render.trend", trendInfo);

                        %><cq:include path="<%=resource.getPath()%>" resourceType="<%=resourceType%>"/><%
                    } else {
                        %><td is="coral-table-cell" value="0"></td><%
                    }
                }
            } else {
                log.warn("No custom information found for provider '" + providerName + "'!");
            }
        }
    } else {
        log.debug("No PageInfoAggregator service found and/or no column information found on request attributes, no custom data will be available!");
    }
    %><td is="coral-table-cell" alignment="right">
        <button is="coral-button" coral-table-roworder variant="minimal" icon="dragHandle"></button>
    </td>
</tr><%!

private String getThumbnailUrl(Page page, int width, int height) {
    String ck = "";
    
    ValueMap metadata = page.getProperties("image/file/jcr:content");
    if (metadata != null) {
        Calendar cal = metadata.get("jcr:lastModified", Calendar.class);
        if (cal != null) {
            ck = "" + (cal.getTimeInMillis() / 1000);
        }
    }

    return Text.escapePath(page.getPath()) + ".thumb." + width + "." + height + ".png?ck=" + ck;
}

private String getTranslationStatus(ValueMap properties, I18n i18n) {

    // if (properties == null) return i18n.get("Not Translated");

    //String strTranslationStatus = String.format("<%s>",properties.get("cq:translationStatus", ""));
    // String strRetVal = i18n.get("Not Translated");

    // if ("<COMMITTED_FOR_TRANSLATION><TRANSLATION_IN_PROGRESS><SUBMITTED>".contains(strTranslationStatus)) {
    //  strRetVal = i18n.get("In Translation");
    //}
    //else if ("<TRANSLATED><READY_FOR_REVIEW><REJECTED><APPROVED><COMPLETE><ARCHIVE>".contains(strTranslationStatus)){
    //  strRetVal = i18n.get("Translated");   
    // }
    //  else{
    String strRetVal = properties.get("translation-status" ,"Not Translated");   
    //}
    return strRetVal;
}

private String getOnOffTimeStatus(ValueMap properties, I18n i18n, Locale locale) {
    if (properties == null) return "";

    Calendar onTimeDate = properties.get("onTime", Calendar.class);
    Calendar offTimeDate = properties.get("offTime", Calendar.class);

    String status = "";

    if (onTimeDate != null) {
        status += i18n.get("On Time") + ": ";
        status += onTimeDate.toInstant().toString();
    }
    if (offTimeDate != null) {
        status += (status.length() > 0) ? "\n" : "";
        status += i18n.get("Off Time") + ": ";
        status += offTimeDate.toInstant().toString();
    }
    return status;
}

private List<String> getActionRels(Resource resource, Page page, AccessControlManager acm, boolean hasAnalytics) {
    List<String> actionRels = new ArrayList<String>();

    if (page != null) {
        actionRels.add("cq-siteadmin-admin-actions-edit-activator");
        if (hasPermission(acm, resource, Privilege.JCR_WRITE)) {
            actionRels.add("cq-siteadmin-admin-actions-properties-activator");
        }
    } else {
        // for nt:folder there are no properties to edit
        if (!resource.isResourceType("nt:folder") && hasPermission(acm, resource, Privilege.JCR_WRITE)) {
            actionRels.add("cq-siteadmin-admin-actions-folderproperties-activator");
        }
    }

    if (hasAnalytics) {
        actionRels.add("cq-siteadmin-admin-actions-open-content-insight-activator");
    }

    if (page != null && hasPermission(acm, resource, Privilege.JCR_LOCK_MANAGEMENT)) {
        if (!page.isLocked()) {
            actionRels.add("cq-siteadmin-admin-actions-lockpage-activator");
        } else if (page.canUnlock()) {
            actionRels.add("cq-siteadmin-admin-actions-unlockpage-activator");
        }
    }

    actionRels.add("cq-siteadmin-admin-actions-copy-activator");

    boolean canDeleteLockedPage = (page != null && page.isLocked() && page.canUnlock()) || (page != null && !page.isLocked()) || page == null;

    if (hasPermission(acm, resource, Privilege.JCR_REMOVE_NODE) && canDeleteLockedPage) {
        actionRels.add("cq-siteadmin-admin-actions-move-activator");
        actionRels.add("cq-siteadmin-admin-actions-delete-activator");
    }

    if (hasPermission(acm, resource, "crx:replicate")) {
        actionRels.add("cq-siteadmin-admin-actions-quickpublish-activator");
    }
    if (hasPermission(acm, "/etc/workflow/models", Privilege.JCR_READ)) {
        actionRels.add("cq-siteadmin-admin-actions-publish-activator");
    }

    boolean showCreate = false;

    if (page != null && (!page.isLocked() || page.canUnlock())) {
        actionRels.add("cq-siteadmin-admin-createworkflow");
        if (hasPermission(acm, resource, Privilege.JCR_WRITE)) {
          actionRels.add("cq-siteadmin-admin-createversion");
        }
        showCreate = true;
    }

    if (hasPermission(acm, resource, Privilege.JCR_ADD_CHILD_NODES)) {
        actionRels.add("cq-siteadmin-admin-createlivecopy");
        actionRels.add("cq-siteadmin-admin-createsite");
        actionRels.add("cq-siteadmin-admin-createcatalog");
        ResourceResolver resourceResolver = resource.getResourceResolver();
        PageManager pageManager = resourceResolver.adaptTo(PageManager.class);
        Collection<?> templates = pageManager.getTemplates(resource.getPath());
        if (page != null && !templates.isEmpty()) {
            actionRels.add("cq-siteadmin-admin-createpage");
        }
        if (page == null) {
            actionRels.add("cq-siteadmin-admin-createfolder");
        }
        showCreate = true;
    }

    if (!resource.getPath().equals("/content") && hasPermission(acm, "/content/launches", Privilege.JCR_ADD_CHILD_NODES)) {
        actionRels.add("cq-siteadmin-admin-createlaunch");
        showCreate = true;
    }

    if (showCreate) {
        actionRels.add("cq-siteadmin-admin-actions-create-activator");
        actionRels.add("cq-siteadmin-admin-createlanguagecopy");
    }
    if (page!=null){
        ValueMap pageProperties = page.getProperties();
        if (pageProperties !=null && pageProperties.containsKey("cq:lastTranslationDone")){
            //this is translation page 
            actionRels.add("cq-siteadmin-admin-actions-translation-update-memory");
        }
    }
    return actionRels;
}

private boolean hasPermission(AccessControlManager acm, String path, String privilege) {
    if (acm != null) {
        try {
            Privilege p = acm.privilegeFromName(privilege);
            return acm.hasPrivileges(path, new Privilege[]{p});
        } catch (RepositoryException ignore) {
        }
    }
    return false;
}

private boolean hasPermission(AccessControlManager acm, Resource resource, String privilege) {
    return hasPermission(acm, resource.getPath(), privilege);
}

private boolean isWorkflowFailed(List<Workflow> workflows) {
    final String SUBTYPE_FAILURE_ITEM = "FailureItem";

    for (Workflow workflow : workflows) {
        List<WorkItem> workItems = workflow.getWorkItems();
        for (WorkItem workItem : workItems) {
            if (SUBTYPE_FAILURE_ITEM.equals(workItem.getItemSubType())) {
                return true;
            }
        }
    }
    return false;
}
%>