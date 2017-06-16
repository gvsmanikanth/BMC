<?php
    $state=( object) array( 'loggedIn'=> (isset($_REQUEST['logged-in']) ? !!$_REQUEST['logged-in'] : false), 'hasIssues' => (isset($_REQUEST['has-issues']) ? !!$_REQUEST['has-issues'] : false) );
?>
<?php
    $pageTitle = 'Support News';
    $bodyClass = 'page-support-news';
?>
<?php include 'php-inc/support/head.php'; ?>
<?php include( 'php-inc/support/header.php') ?>
<?php include( 'php-inc/support/chat-now.php') ?>
<?php include('php-inc/support/account-header.php') ?>
<section class="layout-full-bleed">
    <div class="layout-inner-wrap">
        <article class="layout-primary">
            <!-- BEGIN MAIN COLUMN -->
            <h2 class="title">Support News</h2>
            <!--BEGIN SUPPORT NEWS BODY -->
            <div class="layout-wrapper-nested">
                <table class="table">
                    <thead>
                        <tr>
                            <th colspan="2">2015</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="date">
                                28 APR
                            </td>
                            <td>
                                <a href="/support/support-news/2015_disaster_recovery_drill.html" onclick="s_objectID=&quot;http://www.bmc.com/support/support-news/2015_disaster_recovery_drill.html_1&quot;;return this.s_oc?this.s_oc(e):true">May 2015 Corporate Disaster Recovery Drill</a>
                            </td>
                        </tr>
                        <tr>
                            <td class="date">
                                01 APR
                            </td>
                            <td>
                                <a href="/support/support-news/Quarterly-Product-Change-Notification-Q4FY15-April-2015.html" onclick="s_objectID=&quot;http://www.bmc.com/support/support-news/Quarterly-Product-Change-Notification-Q4FY15-April-2015.h_1&quot;;return this.s_oc?this.s_oc(e):true">Quarterly Product Change Notification Q4FY15 April-2015</a>
                            </td>
                        </tr>
                        <tr>
                            <td class="date">19 MAR
                            </td>
                            <td>
                                <a href="/support/support-news/OpenSSL_CVE-2015-0204_CVE-2015-0291.html" onclick="s_objectID=&quot;http://www.bmc.com/support/support-news/OpenSSL_CVE-2015-0204_CVE-2015-0291.html_1&quot;;return this.s_oc?this.s_oc(e):true">OpenSSL Multiple Security Vulnerabilities -- CVE-2015-0204 and CVE-2015-0291</a>
                            </td>
                        </tr>
                        <tr>
                            <td class="date">
                                06 MAR
                            </td>
                            <td>
                                <a href="/support/support-news/SmartIT_and_MyIT_node_js_security_concern.html" onclick="s_objectID=&quot;http://www.bmc.com/support/support-news/SmartIT_and_MyIT_node_js_security_concern.html_1&quot;;return this.s_oc?this.s_oc(e):true">SmartIT and MyIT node.js Security Concern</a>
                            </td>
                        </tr>
                        <tr>
                            <td class="date">
                                25 FEB
                            </td>
                            <td>
                                <a href="/support/support-news/eol-truesight-eum-1200.html" onclick="s_objectID=&quot;http://www.bmc.com/support/support-news/eol-truesight-eum-1200.html_1&quot;;return this.s_oc?this.s_oc(e):true">End of Life for BMC TrueSight End User Monitor</a>
                            </td>
                        </tr>
                        <tr>
                            <td class="date">
                                19 FEB
                            </td>
                            <td>
                                <a href="/support/support-news/MongoDB_Security_Configuration_Vulnerability.html" onclick="s_objectID=&quot;http://www.bmc.com/support/support-news/MongoDB_Security_Configuration_Vulnerability.html_1&quot;;return this.s_oc?this.s_oc(e):true">MongoDB Security Configuration Vulnerability</a>
                            </td>
                        </tr>
                        <tr>
                            <td class="date">
                                02 FEB
                            </td>
                            <td>
                                <a href="/support/support-news/GHOST_glibc_Security_Vulnerability_CVE_2015_0235.html" onclick="s_objectID=&quot;http://www.bmc.com/support/support-news/GHOST_glibc_Security_Vulnerability_CVE_2015_0235.html_1&quot;;return this.s_oc?this.s_oc(e):true">GHOST: glibc Security Vulnerability -- CVE-2015-0235</a>
                            </td>
                        </tr>
                        <tr>
                            <td class="date">
                                15 JAN
                            </td>
                            <td>
                                <a href="/support/support-news/Quarterly-Product-Change-Notification-Q2FY15-January-2015.html" onclick="s_objectID=&quot;http://www.bmc.com/support/support-news/Quarterly-Product-Change-Notification-Q2FY15-January-2015_1&quot;;return this.s_oc?this.s_oc(e):true">Quarterly Product Change Notification Q3FY15 Jan-2015</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table class="table">
                    <thead>
                        <tr>
                            <th colspan="2">2014</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="date">
                                15 OCT
                            </td>
                            <td>
                                <a href="/support/support-news/SSL_3_0_POODLE_Security_Vulnerability_CVE_2014_3566.html" onclick="s_objectID=&quot;http://www.bmc.com/support/support-news/SSL_3_0_POODLE_Security_Vulnerability_CVE_2014_3566.html_1&quot;;return this.s_oc?this.s_oc(e):true">SSL 3.0 “POODLE” Security Vulnerability -- CVE-2014-3566</a>
                            </td>
                        </tr>
                        <tr>
                            <td class="date">
                                01 OCT
                            </td>
                            <td>
                                <a href="/support/support-news/Quarterly-Product-Change-Notification-Q2FY15-July-2014.html" onclick="s_objectID=&quot;http://www.bmc.com/support/support-news/Quarterly-Product-Change-Notification-Q2FY15-July-2014.ht_1&quot;;return this.s_oc?this.s_oc(e):true">Quarterly Product Change Notification Q2FY15 Oct-2014</a>
                            </td>
                        </tr>
                        <tr>
                            <td class="date">
                                29 SEP
                            </td>
                            <td>
                                <a href="/support/support-news/End-of-Life-for-BMC-Mobility-Products.html" onclick="s_objectID=&quot;http://www.bmc.com/support/support-news/End-of-Life-for-BMC-Mobility-Products.html_1&quot;;return this.s_oc?this.s_oc(e):true">End of Life for BMC Mobility Products</a>
                            </td>
                        </tr>
                        <tr>
                            <td class="date">
                                26 SEP
                            </td>
                            <td>
                                <a href="/support/support-news/GNU-Bourne-Again-Shell-Bash-Shellshock-Vulnerability.html" onclick="s_objectID=&quot;http://www.bmc.com/support/support-news/GNU-Bourne-Again-Shell-Bash-Shellshock-Vulnerability.html_1&quot;;return this.s_oc?this.s_oc(e):true">GNU Bourne Again Shell (Bash) ‘Shellshock’ Vulnerability (CVE-2014-6271, CVE-2014-7169)</a>
                            </td>
                        </tr>
                        <tr>
                            <td class="date">
                                01 SEP
                            </td>
                            <td>
                                <a href="/support/support-news/sept-2014-dr-drill.html" onclick="s_objectID=&quot;http://www.bmc.com/support/support-news/sept-2014-dr-drill.html_1&quot;;return this.s_oc?this.s_oc(e):true">September 2014 Disaster Drill</a>
                            </td>
                        </tr>
                        <tr>
                            <td class="date">
                                19 AUG
                            </td>
                            <td>
                                <a href="/support/support-news/SSO_Upgrade_News.html" onclick="s_objectID=&quot;http://www.bmc.com/support/support-news/SSO_Upgrade_News.html_1&quot;;return this.s_oc?this.s_oc(e):true">Single Sign-On System Upgrade</a>
                            </td>
                        </tr>
                        <tr>
                            <td class="date">
                                10 JUL
                            </td>
                            <td>
                                <a href="/support/support-news/Quarterly-Product-Change-Notification-Q1FY14-July-2014.html" onclick="s_objectID=&quot;http://www.bmc.com/support/support-news/Quarterly-Product-Change-Notification-Q1FY14-July-2014.ht_1&quot;;return this.s_oc?this.s_oc(e):true">Quarterly Product Change Notification Q1FY15 July-2014</a>
                            </td>
                        </tr>
                        <tr>
                            <td class="date">
                                11 JUN
                            </td>
                            <td>
                                <a href="/support/support-news/End-of-Life-for-BMC-Transaction-Monitoring-Application-Response-Timer.html" onclick="s_objectID=&quot;http://www.bmc.com/support/support-news/End-of-Life-for-BMC-Transaction-Monitoring-Application-Re_1&quot;;return this.s_oc?this.s_oc(e):true">End of Life for BMC Transaction Monitoring Application Response Timer (TMART)</a>
                            </td>
                        </tr>
                        <tr>
                            <td class="date">
                                05 JUN
                            </td>
                            <td>
                                <a href="/support/support-news/OpenSSL-CCS-Injection-Vulnerability-Disclosed-June-5-2014.html" onclick="s_objectID=&quot;http://www.bmc.com/support/support-news/OpenSSL-CCS-Injection-Vulnerability-Disclosed-June-5-2014_1&quot;;return this.s_oc?this.s_oc(e):true">OpenSSL CCS Injection Vulnerability <br>(Disclosed June 5, 2014)</a>
                            </td>
                        </tr>
                        <tr>
                            <td class="date">
                                21 APR
                            </td>
                            <td>
                                <a href="/support/support-news/Change-to-Support-Renewals-for-Aternity-Products.html" onclick="s_objectID=&quot;http://www.bmc.com/support/support-news/Change-to-Support-Renewals-for-Aternity-Products.html_1&quot;;return this.s_oc?this.s_oc(e):true">Change to Support Renewals for Aternity Products</a>
                            </td>
                        </tr>
                        <tr>
                            <td class="date">
                                15 APR
                            </td>
                            <td>
                                <a href="/support/support-news/Product_Change_Notification_FY2014_Q4_April_2014_Final_2014_0415.html" onclick="s_objectID=&quot;http://www.bmc.com/support/support-news/Product_Change_Notification_FY2014_Q4_April_2014_Final_20_1&quot;;return this.s_oc?this.s_oc(e):true">Quarterly Product Change Notification Q4FY14 Apr-2014</a>
                            </td>
                        </tr>
                        <tr>
                            <td class="date">
                                10 APR
                            </td>
                            <td>
                                <a href="/support/support-news/openssl_CVE-2014-0160.html" onclick="s_objectID=&quot;http://www.bmc.com/support/support-news/openssl_CVE-2014-0160.html_1&quot;;return this.s_oc?this.s_oc(e):true">OpenSSL Heartbleed Security Bug -- CVE-2014-0160</a>
                            </td>
                        </tr>
                        <tr>
                            <td class="date">
                                06 MAR
                            </td>
                            <td>
                                <a href="/support/support-news/Change-to-Support-Renewals-for-SailPoint-Products.html" onclick="s_objectID=&quot;http://www.bmc.com/support/support-news/Change-to-Support-Renewals-for-SailPoint-Products.html_1&quot;;return this.s_oc?this.s_oc(e):true">Change to Support Renewals for SailPoint Products</a>
                            </td>
                        </tr>
                        <tr>
                            <td class="date">
                                20 FEB
                            </td>
                            <td>
                                <a href="/support/support-news/bca_eol_replacement_notification.html" onclick="s_objectID=&quot;http://www.bmc.com/support/support-news/bca_eol_replacement_notification.html_1&quot;;return this.s_oc?this.s_oc(e):true">BMC Client Automation End-of-Life and Replacement Notification</a>
                            </td>
                        </tr>
                        <tr>
                            <td class="date">
                                31 JAN
                            </td>
                            <td>
                                <a href="/support/support-news/Quarterly-Product-Change-Notification-Q3FY14-Jan-2014.html" onclick="s_objectID=&quot;http://www.bmc.com/support/support-news/Quarterly-Product-Change-Notification-Q3FY14-Jan-2014.htm_1&quot;;return this.s_oc?this.s_oc(e):true">Quarterly Product Change Notification Q3FY14 Jan-2014</a>
                            </td>
                        </tr>
                        <tr>
                            <td class="date">
                                24 JAN
                            </td>
                            <td>
                                <a href="/support/support-news/BMC-Security-Advisory-EPOS-Malware.html" onclick="s_objectID=&quot;http://www.bmc.com/support/support-news/BMC-Security-Advisory-EPOS-Malware.html_1&quot;;return this.s_oc?this.s_oc(e):true">BMC Security Advisory: EPOS Malware</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table class="table">
                    <thead>
                        <tr>
                            <th colspan="2">2013</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="date">
                                10 OCT
                            </td>
                            <td>
                                <a href="/support/support-news/Quarterly-Product-Change-Notification-Q2FY14-Oct-2013.html" onclick="s_objectID=&quot;http://www.bmc.com/support/support-news/Quarterly-Product-Change-Notification-Q2FY14-Oct-2013.htm_1&quot;;return this.s_oc?this.s_oc(e):true">Quarterly Product Change Notification Q2FY14 Oct-2013</a>
                            </td>
                        </tr>
                        <tr>
                            <td class="date">
                                15 JUL
                            </td>
                            <td>
                                <a href="/support/support-news/Quarterly-Product-Change-Notification-Q1FY14-Jul-2013.html" onclick="s_objectID=&quot;http://www.bmc.com/support/support-news/Quarterly-Product-Change-Notification-Q1FY14-Jul-2013.htm_1&quot;;return this.s_oc?this.s_oc(e):true">Quarterly Product Change Notification Q1FY14 Jul-2013</a>
                            </td>
                        </tr>
                        <tr>
                            <td class="date">
                                15 JUN
                            </td>
                            <td>
                                <a href="/support/support-news/ideas_launch.html" onclick="s_objectID=&quot;http://www.bmc.com/support/support-news/ideas_launch.html_1&quot;;return this.s_oc?this.s_oc(e):true">BMC Launches Crowd-Sourced Product Enhancement Process</a>
                            </td>
                        </tr>
                        <tr>
                            <td class="date">
                                09 APR
                            </td>
                            <td>
                                <a href="/support/support-news/proactive-notification-alert-subscription.html" onclick="s_objectID=&quot;http://www.bmc.com/support/support-news/proactive-notification-alert-subscription.html_1&quot;;return this.s_oc?this.s_oc(e):true">BMC Proactive Notification Alert Subscription</a>
                            </td>
                        </tr>
                        <tr>
                            <td class="date">
                                01 APR
                            </td>
                            <td>
                                <a href="/support/support-news/Quarterly-Product-Change-Notification-Q4FY13-Apr-2013.html" onclick="s_objectID=&quot;http://www.bmc.com/support/support-news/Quarterly-Product-Change-Notification-Q4FY13-Apr-2013.htm_1&quot;;return this.s_oc?this.s_oc(e):true">Quarterly Product Change Notification Q4FY13 Apr-2013</a>
                            </td>
                        </tr>
                        <tr>
                            <td class="date">
                                15 JAN
                            </td>
                            <td>
                                <a href="/support/support-news/201301_epd_enhancements.html" onclick="s_objectID=&quot;http://www.bmc.com/support/support-news/201301_epd_enhancements.html_1&quot;;return this.s_oc?this.s_oc(e):true">Electronic Product Distribution (EPD) Enhancements</a>
                            </td>
                        </tr>
                        <tr>
                            <td class="date">
                                01 JAN
                            </td>
                            <td>
                                <a href="/support/support-news/Quarterly-Product-Change-Notification-Q3FY13-Jan-2013.html" onclick="s_objectID=&quot;http://www.bmc.com/support/support-news/Quarterly-Product-Change-Notification-Q3FY13-Jan-2013.htm_1&quot;;return this.s_oc?this.s_oc(e):true">Quarterly Product Change Notification Q3FY13 Jan-2013</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table class="table">
                    <thead>
                        <tr>
                            <th colspan="2">2012</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="date">
                                01 NOV
                            </td>
                            <td>
                                <a href="/support/support-news/Quarterly-Product-Change-Notification-Q2FY13-Oct-2012.html" onclick="s_objectID=&quot;http://www.bmc.com/support/support-news/Quarterly-Product-Change-Notification-Q2FY13-Oct-2012.htm_1&quot;;return this.s_oc?this.s_oc(e):true">Quarterly Product Change Notification Q2FY13 Oct-2012</a>
                            </td>
                        </tr>
                        <tr>
                            <td class="date">
                                15 OCT
                            </td>
                            <td>
                                <a href="/support/support-news/announcing_chat.html" onclick="s_objectID=&quot;http://www.bmc.com/support/support-news/announcing_chat.html_1&quot;;return this.s_oc?this.s_oc(e):true">Chat With BMC Global Contact Center Now Available</a>
                            </td>
                        </tr>
                        <tr>
                            <td class="date">
                                10 SEP
                            </td>
                            <td>
                                <a href="/support/support-news/spac-utility-announcement.html" onclick="s_objectID=&quot;http://www.bmc.com/support/support-news/spac-utility-announcement.html_1&quot;;return this.s_oc?this.s_oc(e):true">New SPAC Utility Simplifies Finding Compatibility Data </a>
                            </td>
                        </tr>
                        <tr>
                            <td class="date">
                                01 JUL
                            </td>
                            <td>
                                <a href="/support/support-news/Quarterly-Product-Change-Notification-Q1FY13-Jul-2012.html" onclick="s_objectID=&quot;http://www.bmc.com/support/support-news/Quarterly-Product-Change-Notification-Q1FY13-Jul-2012.htm_1&quot;;return this.s_oc?this.s_oc(e):true">Quarterly Product Change Notification Q1FY13 Jul-2012</a>
                            </td>
                        </tr>
                        <tr>
                            <td class="date">
                                23 APR
                            </td>
                            <td>
                                <a href="/support/support-news/Improvements-to-the-Knowledge-Base-User-Interface.html" onclick="s_objectID=&quot;http://www.bmc.com/support/support-news/Improvements-to-the-Knowledge-Base-User-Interface.html_1&quot;;return this.s_oc?this.s_oc(e):true">Improvements to the Knowledge Base User Interface</a>
                            </td>
                        </tr>
                        <tr>
                            <td class="date">
                                01 APR
                            </td>
                            <td>
                                <a href="/support/support-news/Quarterly-Product-Change-Notification-Q4FY12-Apr-2012.html" onclick="s_objectID=&quot;http://www.bmc.com/support/support-news/Quarterly-Product-Change-Notification-Q4FY12-Apr-2012.htm_1&quot;;return this.s_oc?this.s_oc(e):true">Quarterly Product Change Notification Q4FY12 Apr-2012</a>
                            </td>
                        </tr>
                        <tr>
                            <td class="date">
                                01 JAN
                            </td>
                            <td>
                                <a href="/support/support-news/Quarterly-Product-Change-Notification-Q3FY12-Jan-2012.html" onclick="s_objectID=&quot;http://www.bmc.com/support/support-news/Quarterly-Product-Change-Notification-Q3FY12-Jan-2012.htm_1&quot;;return this.s_oc?this.s_oc(e):true">Quarterly Product Change Notification Q3FY12 Jan-2012</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table class="table">
                    <thead>
                        <tr>
                            <th colspan="2">2011</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="date">
                                01 OCT
                            </td>
                            <td>
                                <a href="/support/support-news/Quarterly-Product-Change-Notification-Q2FY12-Oct-2011.html" onclick="s_objectID=&quot;http://www.bmc.com/support/support-news/Quarterly-Product-Change-Notification-Q2FY12-Oct-2011.htm_1&quot;;return this.s_oc?this.s_oc(e):true">Quarterly Product Change Notification Q2FY12 Oct-2011</a>
                            </td>
                        </tr>
                        <tr>
                            <td class="date">
                                01 AUG
                            </td>
                            <td>
                                <a href="/support/support-news/Quarterly-Product-Change-Notification-Q1FY11-Jul-2011.html" onclick="s_objectID=&quot;http://www.bmc.com/support/support-news/Quarterly-Product-Change-Notification-Q1FY11-Jul-2011.htm_1&quot;;return this.s_oc?this.s_oc(e):true">Quarterly Product Change Notification Q1FY12 Jul-2011</a>
                            </td>
                        </tr>
                        <tr>
                            <td class="date">
                                01 MAY
                            </td>
                            <td>
                                <a href="/support/support-news/Quarterly-Product-Change-Notification-Q4FY11-Apr-2011.html" onclick="s_objectID=&quot;http://www.bmc.com/support/support-news/Quarterly-Product-Change-Notification-Q4FY11-Apr-2011.htm_1&quot;;return this.s_oc?this.s_oc(e):true">Quarterly Product Change Notification Q4FY11 Apr-2011</a>
                            </td>
                        </tr>
                        <tr>
                            <td class="date">
                                01 FEB
                            </td>
                            <td>
                                <a href="/support/support-news/Quarterly-Product-Change-Notification-Q3FY11-Jan-2011.html" onclick="s_objectID=&quot;http://www.bmc.com/support/support-news/Quarterly-Product-Change-Notification-Q3FY11-Jan-2011.htm_1&quot;;return this.s_oc?this.s_oc(e):true">Quarterly Product Change Notification Q3FY11 Jan-2011</a>
                            </td>
                        </tr>
                </table>
            </div>
        </article>
        <aside class="layout-secondary-shaded">
            <?php include( 'php-inc/support/aside.php') ?>
        </aside>
    </div>
</section>
<?php include 'php-inc/foot.php'; ?>
<div class="fancybox-content" id="confirm"></div>
