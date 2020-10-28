(function($) {
	$.fn.validateEmail = function() {
		var $this = this,
			$form = $(this),
			patternDetected = null,
			validationType = null;
			
			$this.patterns = null;
			$this.advanceReportingEnabled = true;
		
		var defaultValidationPatterns = {
			'1_BMC' : "^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(bmc.com|compuware.com)$",
			'2_Competitor' : "^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(absyss.fr|adventnet.com|altiris.com|appian.com|appworx.com|aprisma.com|arandasoft.com|Argent.com|asg.com|automic.com|avagotech.com|axiossystems.com|badgernt.com|bdna.com|betahg.com|bigfix.com|biosinto.com|broadcom.com|brocade.com|ca.com|capgroup.com|capitalgroup.com|capitalgroupuk.com|cdbsoftware.com|centennial-software.com|chef.com|cherwell.com|cirba.com|cybermation.com|datadirect.com|efecte.com|embarcadero.com|emc.com|emite.com|epicor.com|franciscopartners.com|frontrange.com|gvtc.com|heightsfinanical.com|helpstar.co.uk|helpstar.com|hornbill.com|hp.com|hpe.com|hyperformix.com|ibm.com|iet-solutions.com|infra.com.au|ipswitch.com|isilog.com|kaseya.com|knova.com|landesk.com|macro4.com|managedobjects.com|manageengine.com|marval.co.uk|matrix42.com|matrix42.de|mercury.com|metron.co.uk|microfocus.com|micromuse.com|microsoft.com|midcountrybank.com|midcountryfinanical.com|mobius.com|moniforce.com|mro.com|mtechIT.com|mxg.com|n-able.com|nagios.org|neonsystems.com|netiq.com|netuitive.com|newscale.com|nimsoft.com|novell.com|oblicore.com|ogsconsult.com|opnet.com|opsware.com|oracle.com|orsyp.com|peregrine.com|pg-de.de|pioneerservices.com|platespin.com|pssoft.com|pullelabs.com|quest.com|questsoftware.com|redwood.com|rightnow.com|rocketsoftware.com|sas.com|serena.com|service-now.com|servicenow.com|smatechnologies.com|softwaresa.com|solarwinds.com|solution-labs.com|staffandline.com|sun.com|sunrisesoftware.co.uk|swisslife.ch|symantec.com|teamquest.com|techexcel.com|tidalsoftware.com|topdesk.com|touchpaper.com|tripwire.com|uc4.com|unipress.co.uk|urbancode.com|veritas.com|vmturbo.com|vmware.com|waveset.com|wilytech.com|zcostmanagement.com|zenoss.com|zit-consulting.com|chef.io)$",
			'3_Personal' : "^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(10minutemail.com|aol.com|aventuremail.com|caramail.lycos.fr|comcast.net|computermail.net|doaramail.com|dodgeit.com|emailaccount.com|e-mailanywhere.com|eo.yifan.net|everymail.com|fastmail.fm|flashmail.com|fuzzmail.com|gmail.com|godmail.com|gurlmail.com|hotmail.com|hotmaail.com|hotmail.co.jp|hotmail.co.uk|hotmail.de|hotmial.com|hushmail.com|icqumail.com|katchup.co.nz|kaxy.com|lycos.co.kr|lycos.com|mail.com|mail.excite.com|mail.indiatimes.com|mail.lycos.com|mail2web.com|mail2world.com|mailandnews.com|mailinator.com|mauimail.com|meowmail.com|muchomail.com|MyPersonalEmail.com|myrealbox.com|nameplanet.com|netaddress.com|orgoo.com|personal.ro|pookmail.com|postmaster.co.uk|postmaster.infor.aol.com|prontomail.com|returnreceipt.com|thedoghousemail.com|walla.com|webmail.earthlink.net|webmail.juno.com|wongfaye.com|yahoo.com|yahoo.co.uk|yaho.com.ar|yahoo.ca|yahoo.co.in|yahoo.co.jp|yahoo.co.kr|yahoo.de|yahoo.es|yahoo.fr|yahoo.it|zzn.com|outlook.com|icloud.com|me.com|mac.com|msn.com)$",
			'4_Partners' : "^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(4points.com|academica.fi|acagroup.com|acsacs.com|ads.co.kr|ais.com.mx|alten.it|ar-ecsa.com.ar|artesys.eu|ascom-ac.de|asteros.ru|attitude-it.com|attivasoft.com|avnet.com|bellintegrator.ru|blueh2ogroup.com|bluemarasolutions.com|blueturtle.co.za|boyasoftware.com|bull.es|c2s.fr|caeius.com|calasis.com|calyconf.com.mx|capgemini.com|carahsoft.com|cbit.com.mx|cdw.com|cdwg.com|centechgroup.com|cerner.com|ce-service.com.cn|chn.cognizant.com|ch-si.com.tw|chuosystem.co.jp|cisco.com|ck7.de|clients.ie|cnthoth.com|cntrlsolutions.com|columnit.com|comconsult.de|comparo.se|compfort.pl|compsecinc.com|compta.pt|compucom.com|computacenter.com|comtrade.com|copysolutionsint.com|cscbrasil.com.br|csi.co.jp|cybersoft.lk|danutech.com|dashuoinfo.cn|datalink.com|dcs.premier.co.th|devoteam.ch|devoteam.com|dhcc.com.cn|d-i.nl|djcs.com.ve|dlt.com|e2etec.com.br|ebm.co.kr|eccom.com.cn|eds.com|emeriocorp.com|empired.com|emtecinc.com|eng.it|entiis.com|eplus.com|e-ro.fr|es-con.hu|ess.net.in|everis.com|extensionsa.cl|fdsme.com|finityit.com|flowoptions.com|flycastpartners.com|forsythe.com|freenet.de|frox.com|ftabs.com.cn|fusion.co.uk|fusionskye.com|fusionstorm.com|gijima.com|git.com.cn|globalip.com.br|goit.com.mx|greenpages.com|grupocontext.com|hitrontech.com|hk.fujitsu.com|iblgrp.com|icaro.com.br|identity-solutions.com.au|ieci.es|igsl-group.com|imaves.hr|incit-technology.com|incosa.com.uy|indra.es|inforegis.com.br|infravision.com|ingrammicro.com|in-line.ru|inoks.com|inspira.co.in|interadapt.com.br|interwestcorp.com|ionip.com|ironbow.com|isid.co.jp|it-akuten.se|itconcepts.ch|itconcepts.es|itconcepts.net|itprophets.com|it-tude.fr|jet.msk.su|jindoo-is.co.kr|jp.fujitsu.com|jpcsoftware.com.ar|kapsch.net|kobelcosys.co.jp|konnect.co.uk|ktsl.com|lanworks.com|lingtong.cc|llt.com.tw|lntinfotech.com|mail.fujitsu.es|mansystems.nl|maryville.com|materna.at|materna.com|materna.de|materna.dk|menyaltd.com|meritide.com|metaweave.co.za|mfec.co.th|microware.com.hk|mis.com.sa|moviri.com|myacuity.com|nantian.com.cn|ncs.com.sg|neixar.com|neoaxiom.co.kr|nexusis.com|nimbus-now.com|numarasoftware.co.uk|numarasoftware.co.za|numarasoftware.com|numarasoftware.com.au|numarasoftware.dk|numarasoftware.es|numarasoftware.fr|numarasoftware.no|numarasoftware.se|nvg.ru|nvisiongroup.ru|one.co.kr|onsoft.co.za|onx.com|ostfeld.com|pacen.com.au|pbti.com.br|pc-ware.nl|planwell.net|presidio.com|prestantia.fi|procedata.com|promec.com.py|qmxs.com|quintica.com|quintica.net|quitze.com|raptek.com|raymarc.net|relational.gr|ri-c.at|rightstar.com|rjrinnovations.com|salesforce.com|sanfran.com.tw|santix.de|sbti.com|seamlessti.com|seatone.com|serians.fr|servicetech.com.hk|sevenseastech.com|shi.com|shpy.com|sia.es|sidif.com|sihua.com|softwaresa.com|spot-on.com.my|ssasis.com|stee.stengg.com|steria.no|sti.com.ve|stream.co.th|svtech.com.vn|synergyitsm.com|syntax.gr|sysback.de|syscom.com.tw|syscomworld.com|sysgate.co.kr|systex.com.tw|tabordasolutions.com|tcpsi.es|tcs.com|techwork.at|tgitsm.com|thinkaheadit.com|thinkware-ag.com|thundercattech.com|tjsys.co.jp|tobiz.co.kr|topcpu.com|trace3.com|ts.fujitsu.com|t-systems.ch|tti-telecom.com|tui.de|tui-infotec.com|uclh.nhs.uk|uk.fujitsu.com|unisys.com|unit4.com|vanceinfo.com|vbt.com.tr|veska.com.hk|vipcon.com|vyomlabs.com|westernblue.com|wicresoft.com|winsit.co.kr|winvale.com|wipro.com|wired-rj.com.br|wwt.com|zones.com)$",
			'5_Testing' : "^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(aem-test.com|verticurl.com|click-test.com|email.tst|4tmtest.com|integrate-test.com|integrate.com|test.com)$",
			'5_Spammers':"(^.*qq.com.*$)|(^.*mailinator.*$)|(^.*unsub.*$)"
		};
		
		
		var fname = "";
		//Assemble file name for state JSON
		var uri = window.location.toString(); 
		if (uri.indexOf("localhost") > 0) {
			fname = '/front-end/Assets/src/jsondatafiles/evp.json';
		}
		else{
			fname = '/etc/designs/bmc/email/evp.json';
		}
		
		
		$.getJSON(fname, function(data) {
			if(data)
			{
				console.log("Email Validation json request Success - Object Loaded from Server");
				if(data.validationPatterns){
					$this.patterns = data.validationPatterns;
				}
				
				$this.advanceReportingEnabled = data.advanceReportingEnabled;
			}
		})
		.fail(function (e) {
			console.log("Email Validation json request Failed - Object Loaded as default");
			$this.patterns = defaultValidationPatterns;
		});	//EO Fail
		
		
		this.isEmailEligibleForAnalyticsTracking = function(){
			 
			var inputValue = $this.val();
			var returnValue = true;
			var isLeadGen = ($('#leadgen').length > 0)?true:false;
			var templateType = null;
			
			if (bmcMeta && bmcMeta.page && bmcMeta.page.contentType){
				templateType = bmcMeta.page.contentType;
			}
		
			patternDetected = null;
			validationType = $this.data('validation-type')
			
			for(var pattern in $this.patterns) {
		  		var regExp = new RegExp($this.patterns[pattern]);
				if(regExp.test(inputValue)){
					patternDetected =  pattern;
					console.log("Email Pattern Detected = " + pattern);
				}
			}
			
			console.log("isLeadGen =" + isLeadGen);
			console.log("patternDetected =" + patternDetected);
			console.log("templateType =" + templateType)
			
			if(templateType != "form-landing-page-full-width" && isLeadGen && $this.advanceReportingEnabled){
				if(patternDetected != null){
					returnValue = false;
				}
			}
			
			return returnValue;
		}
		
		this.getEmailCategory = function(){
			 
			var inputValue = $this.val();
			var returnValue = 0;
		
			patternDetected = null;
			
			for(var pattern in $this.patterns) {
		  		var regExp = new RegExp($this.patterns[pattern]);
				if(regExp.test(inputValue)){
					patternDetected =  pattern;
					console.log("Email Pattern Detected = " + pattern);
				}
			}
			
			console.log("patternDetected =" + patternDetected);
	
			if(patternDetected != null){
				returnValue = patternDetected.split("_")[0];
			}
			
			return returnValue;
		}
		
		return this;
	};	
	
	
	$formEmailValidation = $('form input[type="email"]')
	
	if($formEmailValidation.length > 0){
    	$formEmailValidation.validateEmail();   
	}

}) (jQuery);

