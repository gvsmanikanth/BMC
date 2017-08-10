<?php
	$pageTitle = 'Mainframe Page';
	$bodyClass = 'section-products';
	include_once 'php-inc/head.php';
?>

<section class="layout-full-bleed">
    <div class="layout-inner-wrap">
        <h1 class="page-heading">Mainframe System Management with MainView</h1>
        <div class="social-sharing">
            <ul>
                <li></li>
            </ul>
        </div>
        <article class="layout-primary">
            <section>
                <figure class="product-feature-offset" style="background-image: url('http://media.cms.bmc.com/designimages/background_offering_C.png');">
                    <img src="http://media.cms.bmc.com/images/screenshot_mainview.png" width="750" height="400" alt="MainView" title="MainView" border="0"> </figure>
                <div class="wrapper-nested">
                    <div class="two-up">
                        <a class="btn" href="/forms/MSM_ReqQuote_MainView_BMCcom_EN_Sep2012_V2.html" data-form="2473" data-location="Top-CTA-Button-Area" data-parent-id="259178981" target="_self" title="Contact Sales" onclick="s_objectID=&quot;http://www.bmc.com/forms/MSM_ReqQuote_MainView_BMCcom_EN_Sep2012_V2.html_1&quot;;return this.s_oc?this.s_oc(e):true">Contact Sales&nbsp;›</a>
                    </div>
                    <div class="two-up nth-child-np2 nth-child-2n" style="margin-top: 1em;">
                        <p>
                            <a class="link-icon-pdf mo-download-pdf" href="http://documents.bmc.com/products/documents/84/90/298490/298490.pdf" target="_blank" onclick="s_objectID=&quot;http://documents.bmc.com/products/documents/84/90/298490/298490.pdf_1&quot;;return this.s_oc?this.s_oc(e):true">MainView Datasheet</a>
                        </p>
                    </div>
                    <div class="divider"></div>
                    <h2>Manage your mainframe performance proactively </h2>
                    <p>To keep your business running smoothly, you need mainframe management that does more than just monitor and display. BMC MainView gives you the power to diagnose problems, minimize risk, and cut costs.</p>
                    <ul>
                        <li>Lower costs with more efficient monitoring.</li>
                        <li>Find and fix problems early to prevent costly outages and slowdowns.</li>
                        <li>Improve availability and productivity by automating and simplifying performance tasks.</li>
                        <li>Streamline application performance tuning with <a href="http://documents.bmc.com/products/documents/75/65/467565/467565.pdf" target="_blank" onclick="s_objectID=&quot;http://documents.bmc.com/products/documents/75/65/467565/467565.pdf_1&quot;;return this.s_oc?this.s_oc(e):true">Compuware Strobe</a> seamless integration.</li>
                    </ul>
                </div>
            </section>
            <figure>
                <h2>Video: See how MainView boosts productivity and cuts costs</h2>
                <p>Keep your mainframe running at peak performance with MainView’s proactive monitoring, automated problem solving, and storage solutions. (2:23)</p>
                <div class="video">
                    <input id="5ccb2c081ffa4" type="hidden" value="Find out how BMC can help you. <strong><a id='overlayLink' href='http://www.bmc.com/forms/ESM_ContactCenter_ContactRequest_BMCcom_EN_Jan2014.html'>Contact a sales rep ›</a></strong>">
                    <script type="text/javascript" src="//service.twistage.com/api/script"></script>
                    <script type="text/javascript">
                    viewNode("5ccb2c081ffa4", {
                        "server_detection": true,
                        "width": 640,
                        "height": 380
                    });
                    </script>
                    <script type="text/javascript" charset="utf-8" src="//service.twistage.com/embeds/videos/5ccb2c081ffa4/979e3ab480d402b8bf883f8cd6ccc7d5.json?voxtoken=system&amp;width=640&amp;height=380&amp;userAgent=Macintosh_Chrome&amp;currentUrl=http://www.bmc.com/it-solutions/mainview.html&amp;flash=18.0 r0&amp;html5=true&amp;silverlight=0&amp;version=3.94"></script>
                    <object type="application/x-shockwave-flash" id="embedded_player_5ccb2c081ffa4" name="embedded_player_5ccb2c081ffa4" width="640" height="380" data="//service.twistage.com/plugins/player.swf" class="player-swf">
                        <param name="allowfullscreen" value="true">
                        <param name="allowscriptaccess" value="always">
                        <param name="movie" value="//service.twistage.com/plugins/player.swf">
                        <param name="base" value="//service.twistage.com">
                        <param name="flashVars" value="v=5ccb2c081ffa4&amp;">
                        <param name="bgcolor" value="#000000">
                        <param name="wmode" value="opaque">
                    </object>
                </div>
            </figure>
            <script type="text/javascript">
            var flowplayer = new Object();
            var bufferingStopped = false;
            var player_id;
            flowplayer.fireEvent = function(objectID, event, obj1, obj2, obj3, obj4) {
                if (event == "onBegin") {
                    if (player_id !== undefined) {
                        // pause the video here and fire onPause event
                    }
                    var str = obj2['originalUrl'];
                    player_id = str.substring(str.lastIndexOf(":") + 1, str.lastIndexOf("_"));
                    document.getElementById("embedded_player_" + player_id).fp_animate("content", {
                        opacity: 0.0
                    }, 0);
                }
                if (event == "onPause" || event == "onLastSecond" || event == "onStop") {
                    var message = document.getElementById(player_id).value;
                    document.getElementById("embedded_player_" + player_id).fp_animate("content", {
                        opacity: .9
                    }, 0);
                    document.getElementById("embedded_player_" + player_id).fp_css("content", {
                        backgroundColor: "rgba(0, 0, 0, 0.75);"
                    });
                    document.getElementById("embedded_player_" + player_id).fp_css("content", {
                        border: 0
                    });
                    document.getElementById("embedded_player_" + player_id).fp_css("content", {
                        borderRadius: 0
                    });
                    document.getElementById('embedded_player_' + player_id).fp_css("content", {
                        height: 70
                    });
                    document.getElementById('embedded_player_' + player_id).fp_css("content", {
                        width: "100%"
                    });
                    document.getElementById('embedded_player_' + player_id).fp_css("content", {
                        textAlign: 'center'
                    });
                    document.getElementById('embedded_player_' + player_id).fp_css("content", {
                        padding: 20
                    });
                    document.getElementById('embedded_player_' + player_id).fp_css("content", {
                        bottom: 150
                    });
                    document.getElementById('embedded_player_' + player_id).fp_css("content", {
                        margin: 0
                    });
                    document.getElementById('embedded_player_' + player_id).fp_css("content", {
                        color: "#fff"
                    });
                    document.getElementById('embedded_player_' + player_id).fp_css("content", {
                        a: {
                            color: "#32a6d4"
                        }
                    });
                    document.getElementById('embedded_player_' + player_id).fp_css("content", {
                        a: {
                            whiteSpace: "nowrap"
                        }
                    });
                    document.getElementById('embedded_player_' + player_id).fp_css("content", {
                        backgroundGradient: 'none'
                    });
                    document.getElementById("embedded_player_" + player_id).fp_invoke("content", "setHtml", "<font size='18px' weight='normal' face='verdana,arial,sans-serif'>" + message + "</font>");
                    player_id = undefined;
                    message = undefined;
                }
            };
            </script>
            <section>
                <p>Related topics:&nbsp;
                    <a href="/it-solutions/mainframe.html" target="_self" onclick="s_objectID=&quot;http://www.bmc.com/it-solutions/mainframe.html_2&quot;;return this.s_oc?this.s_oc(e):true">Mainframe</a>, <a href="/it-solutions/mainframe-cost-optimization.html" target="_self" onclick="s_objectID=&quot;http://www.bmc.com/it-solutions/mainframe-cost-optimization.html_4&quot;;return this.s_oc?this.s_oc(e):true">Mainframe Cost Optimization</a>
                </p>
            </section>
            <section>
                <h2>A mainframe management solution that does it all</h2>
                <p>MainView makes system management easy with proactive monitoring, automated problem solving, and storage solutions.</p>
                <div class="wrapper-nested">
                    <div class="two-up">
                        <h4>Real-time and historical monitoring</h4>
                        <p>Find and fix problems before outages occur.</p>
                        <h4>Single point of monitoring</h4>
                        <p>Improve Mean Time to Repair (MTTR).</p>
                        <h4>Automatic threshold determination</h4>
                        <p>Improve alarm and alert effectiveness.</p>
                        <h4>Shared data collections</h4>
                        <p>Save CPU cycles.</p>
                        <h4>Smart Loop Check</h4>
                        <p>Reduce mainframe costs and slash wasteful resource consumption.</p>
                    </div>
                    <div class="two-up nth-child-np2 nth-child-2n">
                        <h4>Offload CPU resources</h4>
                        <p>Gain efficiency by offloading up to 70% of CPU resources to zIIPs.</p>
                        <h4>Track transactions across systems and subsystems</h4>
                        <p>Identify the cause of an issue quickly and easily.</p>
                        <h4>Single console</h4>
                        <p>Replace cluttered consoles for zEnterprise<sup>®</sup>.</p>
                        <h4>Deep analytical application performance tuning</h4>
                        <p>BMC MainView and <a href="http://documents.bmc.com/products/documents/75/65/467565/467565.pdf" target="_blank" onclick="s_objectID=&quot;http://documents.bmc.com/products/documents/75/65/467565/467565.pdf_2&quot;;return this.s_oc?this.s_oc(e):true">Compuware Strobe</a> work together seamlessly to reduce costs and pinpoint application inefficiencies.</p>
                    </div>
                </div>
            </section>
            <section>
                <a class="btn" href="/forms/MSM_ReqQuote_MainView_BMCcom_EN_Sep2012_V2.html" data-form="2473" data-location="Primary-Column" data-parent-id="259178981" target="_self" onclick="s_objectID=&quot;http://www.bmc.com/forms/MSM_ReqQuote_MainView_BMCcom_EN_Sep2012_V2.html_2&quot;;return this.s_oc?this.s_oc(e):true">Contact Sales&nbsp;›</a>
            </section>
            <blockquote class="testimonial divider">
                <p>
                    “By being able to proactively monitor our mainframe systems and react to potential issues [with MainView], our organization has been able to provide superior support to our clients.”
                </p>
                <cite>
                    — Bob Hadden, IT Specialist, Fiserv, Inc.
                </cite>
                <h5><a href="http://www.techvalidate.com/product-research/bmc-performance-and-availability/case-studies/17D-F94-A3C" target="_blank" onclick="s_objectID=&quot;http://www.techvalidate.com/product-research/bmc-performance-and-availability/case-studies/17D-F9_1&quot;;return this.s_oc?this.s_oc(e):true">TechValidate Case Study: Fiserv, Inc.</a></h5>
            </blockquote>
            <section>
                <a class="btn" href="/customers/success-stories.html" target="_self" onclick="s_objectID=&quot;http://www.bmc.com/customers/success-stories.html_10&quot;;return this.s_oc?this.s_oc(e):true">Hear from other customers&nbsp;›</a>
            </section>
            <section>
                <h2>Mainframe performance monitoring and automation for every environment</h2> Get proactive about managing your mainframe, no matter what type of environment you’re running. MainView comes in a variety of options—you’re bound to find one that fits.
                <div class="wrapper-nested">
                    <div class="two-up">
                        <h4><a href="/it-solutions/mainview-mainframe-automation.html" onclick="s_objectID=&quot;http://www.bmc.com/it-solutions/mainview-mainframe-automation.html_1&quot;;return this.s_oc?this.s_oc(e):true">MainView Automation&nbsp;›</a></h4>
                        <p>BMC MainView Automation helps you master your mainframe automation processes and provides consolidated console management across your mainframe environment.</p>
                        <h4><a href="/it-solutions/mainview-ims-management.html" onclick="s_objectID=&quot;http://www.bmc.com/it-solutions/mainview-ims-management.html_1&quot;;return this.s_oc?this.s_oc(e):true">MainView for IMS Management&nbsp;›</a></h4>
                        <p>Simplify the management and maintenance of your IMS environment—no matter how complex—with BMC MainView for IMS Management.</p>
                        <h4><a href="/it-solutions/mainview-db2-management.html" onclick="s_objectID=&quot;http://www.bmc.com/it-solutions/mainview-db2-management.html_1&quot;;return this.s_oc?this.s_oc(e):true">MainView for DB2 Management&nbsp;›</a></h4>
                        <p>BMC MainView for DB2 Management offers consolidated controls for optimizing performance all across your DB2 environment.</p>
                        <h4><a href="/it-solutions/mainview-cics.html" onclick="s_objectID=&quot;http://www.bmc.com/it-solutions/mainview-cics.html_1&quot;;return this.s_oc?this.s_oc(e):true">MainView for CICS Management&nbsp;›</a></h4>
                        <p>BMC MainView for CICS Management provides a powerful, centralized point of control from which you can maximize the efficiency of your CICS subsystems.</p>
                        <h4><a href="/it-solutions/mainview-network-management.html" onclick="s_objectID=&quot;http://www.bmc.com/it-solutions/mainview-network-management.html_1&quot;;return this.s_oc?this.s_oc(e):true">MainView for Networks&nbsp;›</a></h4>
                        <p>Minimize the risk of connectivity problems in your mainframe network with BMC MainView for Networks.</p>
                    </div>
                    <div class="two-up nth-child-np2 nth-child-2n">
                        <h4><a href="/it-solutions/mainview-mainframe-monitoring.html" onclick="s_objectID=&quot;http://www.bmc.com/it-solutions/mainview-mainframe-monitoring.html_1&quot;;return this.s_oc?this.s_oc(e):true">MainView Monitoring&nbsp;›</a></h4>
                        <p>Optimize your z/OS and z/OS Unix mainframe environment with the help of the monitoring and configuration tools in BMC MainView Monitoring.</p>
                        <h4><a href="/it-solutions/mainview-message-management.html" onclick="s_objectID=&quot;http://www.bmc.com/it-solutions/mainview-message-management.html_1&quot;;return this.s_oc?this.s_oc(e):true">MainView Message Management&nbsp;›</a></h4>
                        <p>Keep your IBM MQ environment healthy with the monitoring and automation power of BMC MainView Message Management.</p>
                        <h4><a href="/it-solutions/mainframe-storage-resource-management.html" onclick="s_objectID=&quot;http://www.bmc.com/it-solutions/mainframe-storage-resource-management.html_1&quot;;return this.s_oc?this.s_oc(e):true">MainView Storage Resource Management&nbsp;›</a></h4>
                        <p>Optimize the performance of your enterprise storage resources with the solutions in BMC’s MainView Mainframe Storage Resource Management product line.</p>
                        <h4><a href="/it-solutions/mainview-batch-optimizer.html" onclick="s_objectID=&quot;http://www.bmc.com/it-solutions/mainview-batch-optimizer.html_1&quot;;return this.s_oc?this.s_oc(e):true">MainView Batch Optimizer&nbsp;›</a></h4>
                        <p>BMC MainView Batch Optimizer is the only solution that optimizes batch workloads without the need for costly and time consuming manual changes to jobs or JCL.</p>
                    </div>
                </div>
            </section>
            <section>
                <h2>Reduce your MLC costs with MainView Cost Optimization</h2>
                <p>Looking to super-charge your MLC cost savings? BMC MainView Cost Optimization provides an integrated solution that combines the power of Cost Analyzer for zEnterprise and Intelligent Capping for zEnterprise. Visit the product pages and datasheet below, for more information.</p>
                <h3><a href="/it-solutions/cost-analyzer-z-enterprise.html" target="_self" onclick="s_objectID=&quot;http://www.bmc.com/it-solutions/cost-analyzer-z-enterprise.html_2&quot;;return this.s_oc?this.s_oc(e):true">Cost Analyzer for zEnterprise<sup>®</sup></a></h3>
                <p>BMC Cost Analyzer for zEnterprise is an easy-to-use solution for reducing IBM<sup>®</sup> MLC costs by anywhere from 5% to more than 20%, through insightful reporting and predictive planning.</p>
                <h3><a href="/it-solutions/intelligent-capping-zenterprise.html" target="_self" onclick="s_objectID=&quot;http://www.bmc.com/it-solutions/intelligent-capping-zenterprise.html_2&quot;;return this.s_oc?this.s_oc(e):true">Intelligent Capping (iCap) for zEnterprise<sup>®</sup></a></h3>
                <p>BMC Intelligent Capping (iCap) for zEnterprise dynamically automates and optimizes defined capacity settings to lower MLC.</p>
            </section>
            <section>
                <a class="btn" href="http://documents.bmc.com/products/documents/40/14/464014/464014.pdf" target="_blank" onclick="s_objectID=&quot;http://documents.bmc.com/products/documents/40/14/464014/464014.pdf_1&quot;;return this.s_oc?this.s_oc(e):true">MainView Cost Optimization Datasheet&nbsp;›</a>
            </section>
            <blockquote class="testimonial divider">
                <p>
                    "BMC MainView enables us to monitor and rapidly resolve mainframe performance issues."
                </p>
                <cite>
                    — TechValidate research survey response
                </cite>
                <h5><a href="http://www.techvalidate.com/portals/mainframe-performance-monitoring" target="_blank" onclick="s_objectID=&quot;http://www.techvalidate.com/portals/mainframe-performance-monitoring_1&quot;;return this.s_oc?this.s_oc(e):true">Read more about what customers are achieving with MainView</a></h5>
            </blockquote>
        </article>
        <aside class="layout-secondary">
            <section>
                <h3>Gain new insight</h3>
                <p>
                    <a class="modal-video-player" href="http://www.bmc.com/templates/Media_Video_Mobile?vID=12a355b9e5c50" onclick="s_objectID=&quot;http://www.bmc.com/templates/Media_Video_Mobile?vID=12a355b9e5c50_1&quot;;return this.s_oc?this.s_oc(e):true"></a>
                </p>
                <figure>
                    <a class="modal-video-player" href="http://www.bmc.com/templates/Media_Video_Mobile?vID=12a355b9e5c50" onclick="s_objectID=&quot;http://www.bmc.com/templates/Media_Video_Mobile?vID=12a355b9e5c50_2&quot;;return this.s_oc?this.s_oc(e):true"><img src="http://media.cms.bmc.com/images/right_bmc_video_Threshold_advisor_Mainframe_analytics_transparent.png" width="320" height="170" alt="Video: Mainview Threshold Advisor - Mainframe Analytics" title="Video: Mainview Threshold Advisor - Mainframe Analytics" border="0"></a>
                </figure><a class="modal-video-player" href="http://www.bmc.com/templates/Media_Video_Mobile?vID=12a355b9e5c50" onclick="s_objectID=&quot;http://www.bmc.com/templates/Media_Video_Mobile?vID=12a355b9e5c50_3&quot;;return this.s_oc?this.s_oc(e):true">Video: Mainview Threshold Advisor - Mainframe Analytics</a>
                <p></p>
                <p>&nbsp;</p>
            </section>
            <section>
                <p>
                    <a class="modal-video-player" href="http://www.bmc.com/templates/Media_Video_Mobile?vID=64ae54db26c46" onclick="s_objectID=&quot;http://www.bmc.com/templates/Media_Video_Mobile?vID=64ae54db26c46_1&quot;;return this.s_oc?this.s_oc(e):true"></a>
                </p>
                <figure>
                    <a class="modal-video-player" href="http://www.bmc.com/templates/Media_Video_Mobile?vID=64ae54db26c46" onclick="s_objectID=&quot;http://www.bmc.com/templates/Media_Video_Mobile?vID=64ae54db26c46_2&quot;;return this.s_oc?this.s_oc(e):true"><img src="http://media.cms.bmc.com/images/right_bmc_video_See_why_MainView_excels.png" width="320" height="170" alt="Video:  See why BMC MainView excels" title="Video:  See why BMC MainView excels" border="0"></a>
                </figure><a class="modal-video-player" href="http://www.bmc.com/templates/Media_Video_Mobile?vID=64ae54db26c46" onclick="s_objectID=&quot;http://www.bmc.com/templates/Media_Video_Mobile?vID=64ae54db26c46_3&quot;;return this.s_oc?this.s_oc(e):true">Video: See why MainView excels</a>
                <p></p>
                <p>&nbsp;</p>
            </section>
            <section>
                <h3>Join the conversation</h3>
                <a href="https://communities.bmc.com/community/bmcdn/bmc_for_mainframes_and_middleware/bmc_mainview" onclick="s_objectID=&quot;https://communities.bmc.com/community/bmcdn/bmc_for_mainframes_and_middleware/bmc_mainview_1&quot;;return this.s_oc?this.s_oc(e):true">Exchange insights in our MainView community</a>
            </section>
        </aside>
    </div>
    <!-- / layout-inner-wrap -->
</section>

<?php include_once 'php-inc/foot.php'; ?>
