<?php
$pageTitle = 'Stratergic Partnerships';
$bodyClass = 'company page-about-us';
include 'php-inc/head.php';
?>


<script>
	var pageFilterConfig = {
		"filterCriteria" : [
			{
			"name" : "partner_type",
				"values" : [{
							"id" : 0,
							"name" : "All"
						}, {
							"id" : 1,
							"name" : "Strategic GOSI Partners"
						},{
							"id" : 2,
							"name" : "Other GOSI Partners"
						},{
							"id" : 3,
							"name" : "Strategic Technical Alliances"
						}
					]
			}
		]
		
	}
	var pagePartnerFilterMapping = {
		384109202: [2],
		971908955: [3],
		258163397: [2],
		848437969: [2],	
		237178806: [2],	
		31216426: [2],	
		540957883: [1],	
		279688128: [2],	
		320981498: [1],	
		200711078: [2],	
		873216474: [2],	
		720566493: [3],	
		320266804: [2],	
		704720153: [2],	
		920682034: [1],	
		464169829: [1]
	}
    var bmcFilterConfig = {
        "pageType" : "list",
        "pageSize" : -1, // -1 for rendering the entire list
        "maxPagesToDisplay" : 5,
        "paginationType" : "onPagination", //"onPagination"
        "showMatchCountInDropdown" : false,
        "noResultFoundMessage" : "",
        "filterListObject" : null,
        "showDisplayCount" : "false"
	};
	
    var bmcPartnersData  = {
        "filterCriteria" : [],
        "listItems" : [
			{
				"id": 384109202,
				"name": "Accenture",
				"logo_url": "/content/dam/bmc/logos/third-party/accenture.png",
				"short_desc": "Accenture is a leading global professional services company, providing a broad range of services and solutions in strategy, consulting, digital, technology and operations.",
				"long_desc": "\u003cp\u003eAccenture is a leading global professional services company, providing a broad range of services and solutions in strategy, consulting, digital, technology and operations. Combining unmatched experience and specialized skills across more than 40 industries and all business functions – underpinned by the world’s largest delivery network – Accenture works at the intersection of business and technology to help clients improve their performance and create sustainable value for their stakeholders. With approximately 384,000 people serving clients in more than 120 countries, Accenture drives innovation to improve the way the world works and lives.\u003cbr /\u003e\r\n\u003c/p\u003e\r\n",
				"company_url": "https://www.accenture.com/us-en",
				"company_external_url": "",
				"partner_type": "",
				"region_name": "",
				"enabled": true
			},
			{
				"id": 971908955,
				"name": "Amazon Web Services",
				"logo_url": "/content/dam/bmc/collateral/third-party/AWS.logo.png",
				"short_desc": "Amazon Web Services and BMC have partnered to ensure enterprises can comprehensively manage both their AWS and on-premises resources.",
				"long_desc": "\u003cp\u003e\u003ca href\u003d\"/partners/aws-management.html\" target\u003d\"_self\"\u003eAmazon Web Services and BMC\u003c/a\u003e have partnered to lead the market by ensuring enterprises can comprehensively manage both their AWS and on-premises resources, marrying flexibility and scalability with superior management and control.\u003c/p\u003e\r\n",
				"company_url": "https://aws.amazon.com/",
				"company_external_url": "",
				"partner_type": "",
				"region_name": "",
				"enabled": true
			},
			{
				"id": 224169959,
				"name": "Apptio",
				"logo_url": "/content/dam/bmc/logos/third-party/Apptio_logo_235x132.png",
				"short_desc": "Apptio and BMC partner to enable IT leaders to make fact-based decisions that optimize costs and streamline operations.",
				"long_desc": "\u003cp\u003eApptio\u0026#39;s Cost Transparency, Bill of IT and Business Insights SaaS applications work with BMC Discovery and IT Service Management solutions to align technology investments to business priorities, engage business stakeholders to drive accountability and value, and improve the efficiency of both cloud-based and on premises IT resources. With Apptio and BMC, IT organizations can shift more spend into innovation activities that are strategically aligned with the broader goals of the business.\u003c/p\u003e\r\n",
				"company_url": "http://www.apptio.com/",
				"company_external_url": "",
				"partner_type": "",
				"region_name": "",
				"enabled": true
			},
			{
				"id": 258163397,
				"name": "ATOS",
				"logo_url": "/content/dam/bmc/logos/third-party/atos.png",
				"short_desc": "Atos SE is a European IT services corporation with headquarters in Bezons, France and Munich.",
				"long_desc": "\u003cp\u003eAtos SE is a European IT services corporation with headquarters in Bezons, France and Munich. Atos are leaders in digital services with pro forma annual revenue of circa € 12 billion and circa 100,000 employees in 72 countries, serving a global client base.\u003c/p\u003e\r\n\u003cp\u003eThey strive to create the firm of the future. They believe that bringing together people, business and technology is the way forward. At Atos, we embrace this journey, striving to remain the trusted partner that delivers digital empowerment to our clients.\u003c/p\u003e\r\n",
				"company_url": "http://na.atos.net/en-us/home.html",
				"company_external_url": "",
				"partner_type": "",
				"region_name": "",
				"enabled": true
			},
			{
				"id": 848437969,
				"name": "Capgemini",
				"logo_url": "/content/dam/bmc/logos/third-party/capgemini.png",
				"short_desc": "Capgemini and BMC have built a unique partnership that provides strategic thought leadership around digital transformation.",
				"long_desc": "\u003cp\u003eCapgemini and BMC have built a unique partnership that provides strategic thought leadership around digital transformation. Capgemini manages business process transformation leveraging BMC IT solutions designed to make digital business fast, seamless and optimized. Capgemini’s key technology initiatives built on BMC Digital Enterprise Management (DEM) solutions:\u003c/p\u003e\r\n\u003cul\u003e\r\n\u003cli\u003e\u003cb\u003eIndustrialization (Cost)\u003c/b\u003e delivers the best platform to support an infrastructure-led approach to reduce cost and complexity to deliver a broad set of products and services with increased margin \u003c/li\u003e\r\n\u003cli\u003e\u003cb\u003eCollaboration Platform (Organization)\u003c/b\u003e redefines the interactions at all levels between customers, the DSP staff from sales to support engineers, business partners and subcontractors\u003c/li\u003e\r\n\u003cli\u003e\u003cb\u003eProductization (Shareholder Value)\u003c/b\u003e provides the platform for new customer developments based on PaaS, open source, Big Data, Internet of Things (IoT) to then be offered as-a-Service.\u003c/li\u003e\r\n\u003cli\u003e\u003cb\u003eContract Improvements (Risk)\u003c/b\u003e aim to standardize SLA, security and compliance, pricing and billing, while allowing flexibility for a rich set of differing configurations.\u003c/li\u003e\r\n\u003c/ul\u003e\r\n\u003cp\u003eCertifications:\u003cbr /\u003e\r\nBMC Certified Professional - ADDM\u003cbr /\u003e\r\nBMC Certified professional - Cloud Lifecycle Management\u003cbr /\u003e\r\nBMC Certified Professional - TrueSight Operations Management\u003cbr /\u003e\r\nBMC Certified Professional - BMC Server Automation\u003c/p\u003e\r\n",
				"company_url": "http://www.capgemini.com/",
				"company_external_url": "https://marketplace.onbmc.com/companies/capgemini",
				"partner_type": "",
				"region_name": "",
				"enabled": true
			},
			{
				"id": 237178806,
				"name": "CGI",
				"logo_url": "/content/dam/bmc/logos/third-party/CGI.png",
				"short_desc": "CGI is a strategic BMC system integrator partner with a team of consultants trained to ensure your BMC solutions are up and running—and driving greater business efficiency.",
				"long_desc": "\u003cp\u003eCGI is a strategic BMC system integrator partner with a focused team of highly trained consultants to ensure your BMC solutions are up and running—and driving greater business efficiency and customer experience. The partnership between BMC Software and CGI has extended over 15 years, and focuses on:\u003c/p\u003e\r\n\u003cul\u003e\r\n\u003cli\u003eIntegrated IT service management on premises and in the cloud\u003c/li\u003e\r\n\u003cli\u003eData center automation\u003c/li\u003e\r\n\u003cli\u003eEnterprise cloud computing\u003c/li\u003e\r\n\u003cli\u003eProactive operations\u003c/li\u003e\r\n\u003c/ul\u003e\r\n",
				"company_url": "http://www.cgi.com/en",
				"company_external_url": "",
				"partner_type": "",
				"region_name": "",
				"enabled": true
			},
			{
				"id": 31216426,
				"name": "Cognizant",
				"logo_url": "/content/dam/bmc/logos/third-party/cognizant.png",
				"short_desc": "Cognizant is a leading provider of information technology, consulting, and business process services, dedicated to helping the world\u0027s leading companies build stronger businesses.",
				"long_desc": "\u003cp\u003eCognizant (NASDAQ: CTSH) is a leading provider of information technology, consulting, and business process services, dedicated to helping the world\u0027s leading companies build stronger businesses. Cognizant Infrastructure Services (CIS) provides Infrastructure Management Services and System Integration across all IT functions such as Network and Security, Application, Data Center Operations, Mainframes and more.\u003c/p\u003e\r\n\u003cp\u003eCognizant’s relationship with BMC focuses on:\u003c/p\u003e\r\n\u003cul\u003e\r\n\u003cli\u003eService Management – Providing automation around service management across all business functions including empowering the end user with self service and provisioning functionalities\u003c/li\u003e\r\n\u003cli\u003ePerformance \u0026amp; Analytics – Command and control, server and client monitoring services, analytics\u003c/li\u003e\r\n\u003cli\u003eWorkload Automation\u003c/li\u003e\r\n\u003c/ul\u003e\r\n",
				"company_url": "https://www.cognizant.com/",
				"company_external_url": "",
				"partner_type": "",
				"region_name": "",
				"enabled": true
			},
			{
				"id": 922422634,
				"name": "Compuware",
				"logo_url": "/content/dam/bmc/logos/third-party/logo-compuware.png",
				"short_desc": "Compuware is changing the way developers develop. Our products fit into a unified DevOps toolchain enabling cross-platform teams to manage mainframe applications, data and operations with one process, one culture and with leading tools of choice.",
				"long_desc": "\u003cp\u003eCompuware is changing the way developers develop. Our products fit into a unified DevOps toolchain enabling cross-platform teams to manage mainframe applications, data and operations with one process, one culture and with leading tools of choice. With a mainstreamed mainframe, the mainframe is just another platform, and any developer can build, analyze, test, deploy and manage COBOL applications with agility, efficiency and precision.\u003c/p\u003e\r\n",
				"company_url": "https://www.Compuware.com",
				"company_external_url": "",
				"partner_type": "",
				"region_name": "",
				"enabled": true
			},
			{
				"id": 540957883,
				"name": "Dell",
				"logo_url": "/content/dam/bmc/logos/third-party/dell1.png",
				"short_desc": "Dell delivers flexible, high-performance computing platforms with a long history of best practices and implementation services for optimizing the data center.",
				"long_desc": "\u003cp\u003eDell delivers flexible, high-performance computing platforms with a long history of best practices and implementation services for optimizing the data center. As a leading user of BMC Digital Enterprise Management solutions, Dell has the experience and resources to help our joint customers implement a complete infrastructure solution. The resulting solutions are tightly integrated and jointly developed to be optimized for each customer, with a proven track record of delivering significant customer benefits.\u003c/p\u003e\r\n\u003cp\u003eCertifications:\u003cbr /\u003e\r\nBMC Certified Professional: BMC Atrium Discovery and Dependency Mapping\u003c/p\u003e\r\n",
				"company_url": "https://www.delltechnologies.com/en-us/index.htm",
				"company_external_url": "",
				"partner_type": "",
				"region_name": "",
				"enabled": true
			},
			{
				"id": 934818989,
				"name": "Deloitte Consulting LLP",
				"logo_url": "/content/dam/bmc/logos/third-party/deloitte.png",
				"short_desc": "Deloitte, the largest consulting organization in the world, helps clients transform complex IT infrastructures into efficient engines for business.",
				"long_desc": "\u003cp\u003eDeloitte, the largest consulting organization in the world, helps clients transform complex IT infrastructures into efficient engines for business. From help desk to analytics-driven performance management, Deloitte and BMC can help you transform IT to deliver more business value.\u003c/p\u003e\r\n\u003cp\u003eThe Deloitte and BMC alliance brings focus and clarity to IT Service Management (ITSM), offering the experience and tools you need to successfully implement IT Infrastructure Library (ITIL®) principles and align your IT assets, activities, and decisions with business priorities. Our alliance combines Deloitte\u0027s portfolio of services for ITSM strategy and implementation with BMC\u0027s leading IT service management software.\u003c/p\u003e\r\n\u003cp\u003eCertifications:\u003cbr /\u003e\r\nBMC Certified Professional: BladeLogic Server Automation\u003cbr /\u003e\r\nBMC Certified Professional: BMC Remedy Service Desk and Change Management\u003cbr /\u003e\r\nBMC Certified Professional: BMC Server Automation\u003c/p\u003e\r\n",
				"company_url": "http://www2.deloitte.com/us/en/pages/about-deloitte/solutions/deloitte-technology-alliances-bmc.html",
				"company_external_url": "",
				"partner_type": "",
				"region_name": "",
				"enabled": true
			},
			{
				"id": 279688128,
				"name": "Fujitsu",
				"logo_url": "/content/dam/bmc/logos/third-party/fujitsu.png",
				"short_desc": "Fujitsu is a leading information and communication technology (ICT) company offering a full portfolio of business-technology products.",
				"long_desc": "\u003cp\u003eFujitsu is a leading information and communication technology (ICT) company offering a full portfolio of business-technology products, solutions, and services, ranging from workplace systems to data center solutions, managed services, and cloud-based software and solutions.\u003c/p\u003e\r\n\u003cp\u003eBMC and Fujitsu have a relationship spanning over 20 years including:\u003c/p\u003e\r\n\u003cul\u003e\r\n\u003cli\u003eOver 300 staff globally accredited on BMC technology\u003c/li\u003e\r\n\u003cli\u003eGo-to-market initiatives in IT outsourcing and application services\u003c/li\u003e\r\n\u003cli\u003eEnd-user client engagement services through joint collaborative review\u003c/li\u003e\r\n\u003cli\u003eData center outsourcing and networking \u003c/li\u003e\r\n\u003cli\u003eBMC Platinum Alliance Partner\u003c/li\u003e\r\n\u003c/ul\u003e\r\n",
				"company_url": "http://www.fujitsu.com/global/",
				"company_external_url": "",
				"partner_type": "",
				"region_name": "",
				"enabled": true
			},
			{
				"id": 320981498,
				"name": "HCL",
				"logo_url": "/content/dam/bmc/logos/third-party/HCL.png",
				"short_desc": "HCL’s Infrastructure Services Division (ISD) has executed complex global IT transformation exercises, and helped run efficient IT services for more than 300 of the world’s leading companies.",
				"long_desc": "\u003cp\u003eHCL’s Infrastructure Services Division (ISD) has not only executed complex global IT transformation exercises, but also helped run efficient IT services for more than 300 of the world’s leading companies. HCL and BMC have a 10-year partnership with expertise spanning our entire product portfolio where we add value to the below HCL service offerings.\u003c/p\u003e\r\n\u003cul\u003e\r\n\u003cli\u003eWorkplace ServicesData\u003c/li\u003e\r\n\u003cli\u003eCenter ServicesCross\u003c/li\u003e\r\n\u003cli\u003eFunctional Services\u003c/li\u003e\r\n\u003cli\u003eNetwork Services\u003c/li\u003e\r\n\u003cli\u003eIntegrated Operations Management\u003c/li\u003e\r\n\u003cli\u003eMainframe \u0026amp; AS/400\u003c/li\u003e\r\n\u003cli\u003eAutomation and Orchestration\u003c/li\u003e\r\n\u003c/ul\u003e\r\n\u003cp\u003eHCL and BMC jointly monitor 50,000 servers, automate 20,000 machines supporting 10,000+ Analysts and 1 million+ end users across their global customer base. BMC and HCL have joint programs running across multiple Centre of Excellence(CoE) units with over 300 HCL engineers trained on multiple BMC solutions.\u003c/p\u003e\r\n",
				"company_url": "http://www.hcl.com/",
				"company_external_url": "",
				"partner_type": "",
				"region_name": "",
				"enabled": true
			},
			{
				"id": 200711078,
				"name": "Infosys",
				"logo_url": "/content/dam/bmc/logos/third-party/Infosys-logo-03-02-2017.png",
				"short_desc": "Infosys is a global leader in technology services and consulting. They enable clients in more than 50 countries to create and execute strategies for their digital transformation.",
				"long_desc": "\u003cp\u003eInfosys is a global leader in technology services and consulting. We enable clients in more than 50 countries to create and execute strategies for their digital transformation. From engineering to application development, knowledge management and business process management, we help our clients find the right problems to solve, and to solve these effectively. Our team of 199,000+ innovators, across the globe, is differentiated by the imagination, knowledge and experience, across industries and technologies that we bring to every project we undertake.\u003c/p\u003e\r\n\u003cp\u003eInfosys’ infrastructure transformation consulting services primarily focuses on\u003c/p\u003e\r\n\u003cul\u003e\r\n\u003cli\u003eExtracting business value from IT infrastructure assets\u003c/li\u003e\r\n\u003cli\u003eDelivering an efficient IT infrastructure\u003c/li\u003e\r\n\u003c/ul\u003e\r\n\u003cp\u003eInfosys has proven expertise in helping organizations reshape their IT infrastructure by aligning business objectives and maximizing value on investments. Infosys infrastructure transformation consulting services offer:\u003c/p\u003e\r\n\u003cul\u003e\r\n\u003cli\u003eService transformation-\u0026nbsp;Focused on implementing the ITIL framework through process optimization and leveraging best- of- breed ITSM tools and platforms to drive unified IT operations\u003c/li\u003e\r\n\u003cli\u003eData center transformation -\u0026nbsp;Led by a consulting- based approach for developing next- generation data centers that are responsive to business requirements\u003c/li\u003e\r\n\u003cli\u003eSecurity transformation -\u0026nbsp;Focused on compliance, governance, and controls derived from various standards and policies\u003c/li\u003e\r\n\u003cli\u003eWorkplace transformation - Focused on providing solutions by leveraging emerging technologies to maximize efficiency, agility, and flexibility\u003c/li\u003e\r\n\u003c/ul\u003e\r\n\u003cp\u003eInfosys has been a Strategic GOSI (Global Outsourcers and System Integrator) partner of BMC Software for over a decade.\u003c/p\u003e\r\n\u003cp\u003eInfosys provides consulting and implementation services around BMC products in:\u003c/p\u003e\r\n\u003cul\u003e\r\n\u003cli\u003eDigital Service Management\u003c/li\u003e\r\n\u003cli\u003eData Center Automation and Cloud\u003c/li\u003e\r\n\u003cli\u003ePerformance and Availability Management\u003c/li\u003e\r\n\u003cli\u003eWorkload Automation\u003c/li\u003e\r\n\u003c/ul\u003e\r\n\u003cp\u003eInfosys has a team of around 300+ professionals working on consulting and implementation around these products. They have successfully completed 100+ projects around the globe.\u003c/p\u003e\r\n\u003cp\u003eInfosys has set up Labs for Training \u0026amp; Development – BMC ITSM Lab (Remedy), Service Assurance (BPPM/TrueSight), Automation and Orchestration, Workload Automation (Control-M).\u003c/p\u003e\r\n\u003cp\u003eInfosys is also a part of BMC’s Readiness Program and gets beta access to new BMC products\u003c/p\u003e\r\n",
				"company_url": "https://www.infosys.com/",
				"company_external_url": "",
				"partner_type": "",
				"region_name": "",
				"enabled": true
			},
			{
				"id": 873216474,
				"name": "LTI",
				"logo_url": "/content/dam/bmc/logos/third-party/LTI_with_Group_Lockup.png",
				"short_desc": "LTI (NSE: LTI) is a global technology consulting and digital solutions company helping more than 250 clients succeed in a converging world. ",
				"long_desc": "\u003cp\u003eLTI (NSE: LTI) is a global technology consulting and digital solutions company helping more than 250 clients succeed in a converging world. With operations in 27 countries, we go the extra mile for our clients and accelerate their digital transformation with LTI’s Mosaic platform enabling their mobile, social, analytics, IoT and cloud journeys. Founded 20 years ago as a subsidiary of the Larsen \u0026amp; Toubro group, our unique heritage gives us unrivaled real-world expertise to solve the most complex challenges of enterprises across all industries. Each day, our team of more than 20,000 LTItes enable our clients to improve the effectiveness of their business and technology operations, and deliver value to their customers, employees and shareholders. Find more at \u003ca href\u003d\"https://www.lntinfotech.com/\" target\u003d\"Target\"\u003ewww.Lntinfotech.com\u003c/a\u003e or follow us at @LTI_Global\u003cbr\u003e\r\n\u003c/p\u003e\r\n",
				"company_url": "https://www.lntinfotech.com/",
				"company_external_url": "",
				"partner_type": "",
				"region_name": "",
				"enabled": true
			},
			{
				"id": 720566493,
				"name": "Microsoft",
				"logo_url": "/content/dam/bmc/logos/third-party/Microsoft.png",
				"short_desc": "BMC and Microsoft have a long history of partnering to drive customer success with solutions that optimize investments in Microsoft technology and platforms, including Microsoft Azure.",
				"long_desc": "\u003cp\u003eBMC and Microsoft have a long history of partnering to drive customer success with solutions that optimize investments in Microsoft technology and platforms, including \u003ca href\u003d\"/partners/azure-management.html\"\u003eMicrosoft Azure\u003c/a\u003e. Together BMC and Microsoft:\u003cbr\u003e\r\n\u003c/p\u003e\r\n\u003cul\u003e\r\n\u003cli\u003eEnable customers to manage digital services delivery, consumption, operations, planning, and compliance across multi-platform, multi-vendor infrastructures\u003c/li\u003e\r\n\u003cli\u003eProvide customers management of the MSFT infrastructure as a part of a complete, heterogeneous ITIL® environment\u003c/li\u003e\r\n\u003cli\u003eProvide customers with choice of a server hypervisor platform through enhanced BMC support\u003c/li\u003e\r\n\u003cli\u003eDeliver early adopter support of new versions of MSFT operating systems, databases, and applications\u003c/li\u003e\r\n\u003cli\u003eOffer faster time-to-value with pre-configured integrations\u003c/li\u003e\r\n\u003c/ul\u003e\r\n",
				"company_url": "https://www.microsoft.com/",
				"company_external_url": "",
				"partner_type": "",
				"region_name": "",
				"enabled": true
			},
			{
				"id": 320266804,
				"name": "NTT DATA",
				"logo_url": "/content/dam/bmc/collateral/third-party/NTT-DATA-Logo-HumanBlue.png",
				"short_desc": "NTT DATA is a Global IT Innovator delivering technology-enabled services and solutions to clients around the world. The company provides consulting, managed services, projects, outsourcing, and cloud-based solutions to mid-sized and large enterprises in all major industries.",
				"long_desc": "\u003cp\u003eNTT DATA is a Global IT Innovator delivering technology-enabled services and solutions to clients around the world. The company provides consulting, managed services, projects, outsourcing, and cloud-based solutions to mid-sized and large enterprises in all major industries.\u003cbr /\u003e\r\n\u003c/p\u003e\r\n",
				"company_url": "http://www.nttdata.com/global/en/",
				"company_external_url": "",
				"partner_type": "",
				"region_name": "",
				"enabled": true
			},
			{
				"id": 704720153,
				"name": "Tata",
				"logo_url": "/content/dam/bmc/logos/third-party/TATA.png",
				"short_desc": "Tata Consultancy Services (TCS) is a global leader in IT services, digital and business solutions that partners with its clients to simplify, strengthen and transform their businesses.",
				"long_desc": "\u003cp\u003eTata Consultancy Services (TCS) is a global leader in IT services, digital and business solutions. Together, TCS and BMC provide digital transformation solutions for large enterprises, leveraging the latest technology offerings coupled with best practices and industry experience. BMC and TCS have joint programs running across multiple Centre of Excellence(CoE) units covering ESM tools transformation, batch automation, DevOps, enterprise data center automation, and mainframe solutions.  Over 500 TCS associates trained on BMC solutions support a wide spectrum of customer projects across the Globe. \u003c/p\u003e\r\n\u003cp\u003eTCS provides the following business value to its customers:\u003c/p\u003e\r\n\u003cul\u003e\r\n\u003cli\u003eProven delivery methodology and trained and certified engineers\u003c/li\u003e\r\n\u003cli\u003eDedicated lab setup (Executive Briefing Center, Bangalore) and SME support\u003c/li\u003e\r\n\u003cli\u003eExperience in multiple projects, covering major infrastructure domains\u003c/li\u003e\r\n\u003cli\u003eMulti-sourced environment expertise to manage suppliers by assuring SLAs\u003c/li\u003e\r\n\u003cli\u003ePredictable and standardized processes\u003c/li\u003e\r\n\u003cli\u003eTransparent infrastructure solutions that reduce total cost of ownership\u003c/li\u003e\r\n\u003c/ul\u003e\r\n",
				"company_url": "http://tata.com/",
				"company_external_url": "",
				"partner_type": "",
				"region_name": "",
				"enabled": true
			},
			{
				"id": 920682034,
				"name": "TechM",
				"logo_url": "/content/dam/bmc/logos/third-party/TechMahindra.png",
				"short_desc": "Tech Mahindra’s IT Infrastructure Management Services (IMS) offers a suite of proven infrastructure services and solutions that deliver differentiated value to their custome’s business.",
				"long_desc": "\u003cp\u003eTech Mahindra’s IT Infrastructure Management Services (IMS) offers a suite of proven infrastructure services and solutions that deliver differentiated value to their customer\u0027s business.\u003c/p\u003e\r\n\u003cp\u003eTheir rich portfolio of service offerings spans across the infrastructure lifecycle of Plan-Build-Run-Monitor and includes infrastructure consulting, data center and end user computing, enterprise networking, enterprise security, IT infrastructure operation management and transformation services.\u003c/p\u003e\r\n\u003cp\u003eTech Mahindra is Strategic GOSI (Global Outsourcers and System Integrator) partner of BMC Software with 5+ years of experience and 200+ associates trained on BMC solutions covering 25+ engagements across 10+ countries. TechM also has its exclusive BMC Labs in their main campus and BMC training and development centers across product lines.\u003c/p\u003e\r\n",
				"company_url": "http://www.techmahindra.com/pages/default.aspx",
				"company_external_url": "",
				"partner_type": "",
				"region_name": "",
				"enabled": true
			},
			{
				"id": 464169829,
				"name": "Wipro",
				"logo_url": "/content/dam/bmc/logos/third-party/Wipro.png",
				"short_desc": "Wipro has been a strategic partner for BMC for more than a decade and over the years, the partnership has evolved into one of the leading collaborations in the industry.",
				"long_desc": "\u003cp\u003eWipro has been a\u0026nbsp;strategic partner for BMC for more than a decade. Wipro leverages BMC solutions to provide industry-leading and innovative managed services and outsourcing options to customers worldwide. Wipro works with BMC to transform customers into digital enterprises by effectively leveraging the following:\u003c/p\u003e\r\n\u003cul\u003e\r\n\u003cli\u003eServiceNXT™ Command Centre, that spans across geographies and serves global customers in a multi-tenant mode; delivers ITIL® aligned services which are consistent and predictable\u0026nbsp;\u003c/li\u003e\r\n\u003cli\u003eServiceNXT™ Cloud Operations Centre leveraging BMC Cloud Lifecycle Management, delivering cloud services across private, public and hybrid environments\u003c/li\u003e\r\n\u003cli\u003eBMC COE for product and beta testing and developing accelerators to reduce time-to-market solution implementation for customers\u003c/li\u003e\r\n\u003cli\u003eInnovative use of BMC solutions for automation and remediation that helps drive efficiency from a service delivery perspective and ensure that people, process and technology are utilized to their fullest potential.\u003c/li\u003e\r\n\u003c/ul\u003e\r\n",
				"company_url": "http://www.wipro.com/",
				"company_external_url": "",
				"partner_type": "",
				"region_name": "",
				"enabled": true
			}
		]
    }
</script>

<section class="bg-white filterListContainer py3 bg-seashell" style="display: block;">
    <div class="layout-inner-wrap">
		<p class="partner-lead py2">BMC has formed partnerships with leading technology companies worldwide to deliver added value to our shared customers.</p>
		<h2>   See who we work with around the world</h2>   
	</div>
    <section class="bg-white listCompLoader">
        <div class="layout-inner-wrap py3 text-center">
            <img src="/etc/clientlibs/bmc/head/loading-indicator.gif"/>
            <p>
                Loading...
            </p>
        </div>
    </section>
    <div class="partner-list layout-inner-wrap py2 customer-story-landing-logo-blocks">
        <div class="cards-wrapper logo-blocks partners-cards">
        </div>
    </div>
</section>

<style>
	.partners-cards .block-title {
    width: 100%;
    margin-left: 1rem;
    margin-right: 1rem;
    text-align: left;
    border-bottom: 1px solid #cacaca;
    padding: .5rem;
    clear: both;
    margin-bottom: 20px;
}
</style>

<?php
include 'php-inc/foot.php';
?>