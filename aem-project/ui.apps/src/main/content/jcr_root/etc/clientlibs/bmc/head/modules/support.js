(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var menujs = require('./menu');
var menuAdapter = require('./menu-adapter');

var Support = Support || {};

(function($) {

	var supportEnv,
		supportPath,
		alertMessages,
		issuesContainer = $('.js-issues-container'),
		contractSelector = $('.js-contracts-select'),
		contractDetails = $('.action-detail-group'),
		accountDetails = $('.action-details'),
		accountError = $('.js-account-error'),
		alertsButtonContainer = $('a.alerts.js-fancyDialog').parent('li.action');

	Support.Helpers = {

		// Check if the bmcMeta and bmcMeta.support exist
		// Used to assume other functionality based on the existance of this initial base setup
		bmcSupportLoaded: function() {
			if (typeof bmcMeta !== 'undefined' && typeof bmcMeta.support !== 'undefined') {
				return true;
			}
			return false;
		},

		// Check to see if enableAlerts is true
		bmcAlertsEnabled: function() {
			if (typeof bmcMeta.support.enableAlerts !== 'undefined' && bmcMeta.support.enableAlerts == true) {
				return true;
			} else {
				Support.Helpers.hideAlertsButton();
			}
			return false;
		},

		hideAlertsButton: function() {
			$(alertsButtonContainer).hide();
		},
		showAlertsButton: function() {
			$(alertsButtonContainer).show();
		},

		isAuthenticated: function() {
			return typeof bmcMeta !== "undefined" && typeof bmcMeta.user !== "undefined" && typeof bmcMeta.user.isSupportAuthenticated !== "undefined" && bmcMeta.user.isSupportAuthenticated;
		},

		isOnSupportLandingPage: function() {

			if (Support.Helpers.bmcSupportLoaded()
				&& typeof bmcMeta.page !== 'undefined'
				&& typeof bmcMeta.page.longName === 'string') {

				//var pathCheck = /support.*support-central/;
				var pathCheck = /support/; //DXP-812
				
				// matches path string with support and support central in it
				// examples:
				// "support:support-central" or "support:reg:support-central"
				if (bmcMeta.page.longName.match(pathCheck) !== null) {
					return true;
				}
			}

			// catch-all default
			return false;
		},

		/**
		 * getAccountErrorMessage
		 * @param  {string} errorType - 'issue'
		 * @param  {string} errorCode errorCode (likely pulled from ajax response)
		 * @return {string | undefined} Returns mapped string or undefined if none found in undefined
		 */
		getAccountErrorMessage: function(errorType, errorCode) {
			// map errorType to correct errorGroup, errorGroup is used as the index on bmcMeta.support.errorMessages
			if (errorType == 'issue') {
				var errorGroup = 'caseErrorMessages';
			} else {
				throw new Error('Use valid errorType when accountError');
			}

			// determine appropriate error message based on indexes
			// undefined if mapped value not found
			var errorMessage = Support.Helpers.bmcSupportLoaded()
								&& bmcMeta.support[errorGroup] !== undefined
								&& bmcMeta.support[errorGroup][errorCode] !== undefined
								? bmcMeta.support[errorGroup][errorCode] : undefined;

			return errorMessage;
		},

		accountError: function(errorType, errorCode) {
			// reset hiding of container, show new error
			Support.Controls.actions.resetLoadAccountError();

			var errorMessage = Support.Helpers.getAccountErrorMessage(errorType, errorCode);

			// errorMessage is undefined if mapped message not found
			// attempt to set use DEFAULT_ERROR_MESSAGE
			if (errorMessage === 'undefined') {
				errorMessage = Support.Helpers.getAccountErrorMessage(errorType, 'DEFAULT_ERROR_MESSAGE');
			}

			// show/hide specific containers based on errorType
			if (errorType == 'issue') {
				$(accountDetails).show();
			}

			// hide other containers
			$(issuesContainer).hide();

			// show error container with message, but only if message is a non-empty string
			// if the errorMessage was resolved to a mapping of an empty string, then don't show
			if (typeof errorMessage === 'string' && errorMessage.length > 0) {
				$(accountError).show().html(errorMessage);
			}
		},

		/**
		 * Parses dates coming back from ajax response. For the lack of a better term this is being
		 * referred to as `Support Long Date`, and is a string being loaded in the standard format:
		 * 2015-04-14T14:02:22.000Z
		 * @param  {String} dateString - Date formatted string, like '2015-04-14T14:02:22.000Z'
		 * @return {Date|null} null if no matches, or native javascript Date object
		 */
		parseSupportLongDate: function(dateString) {
			var pattern = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d{3}\D)/;
			var matches = pattern.exec(dateString);

			// on successful match, match[0] will be the entire matched string
			// matched groups are following indexes
			if (matches) {
				try {
					// month is represented by matches[2], Date constructor expects month index from 0 to 11.
					return new Date(matches[1], (parseInt(matches[2]) - 1), matches[3], matches[4], matches[5], matches[6]);
				} catch(error) {
					//console.log('Unable to parseSupportLongDate with ' + dateString + '. Error:\n ' + error.message);
					return null;
				}
			} else {
				return null;
			}
		},

		pad: function(n, width, z) {
			z = z || '0';
			n = n + '';
			return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
		},

		// Quick and easy function for padding month and day amounts with leading zeroes if necessary (ie: MM/DD/YYYY, single digitals for MM and DD should have leading 0)
		padToTwoDigits: function(num) {
			return Support.Helpers.pad(num, 2);
		},
		getURLWithQueryParam: function(uri, key, value) {
			var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
			var separator = uri.indexOf('?') !== -1 ? "&" : "?";

			if (uri.match(re)) {
				return uri.replace(re, '$1' + key + "=" + value + '$2');
			}
			else {
				return uri + separator + key + "=" + value;
			}
		},
		// Converts `value` to a string if it's not one. An empty string is returned for `null` or `undefined` values.
		baseToString: function(value) {
		  return value == null ? '' : (value + '');
		},

		// Capitalizes the first character of `string`.
		capitalize: function(string) {
		  string = Support.Helpers.baseToString(string);
		  return string && (string.charAt(0).toUpperCase() + string.slice(1));
		},

		makeFullName: function(firstName, lastName) {
			return Support.Helpers.capitalize(lastName.toLowerCase()) + ", " + Support.Helpers.capitalize(firstName.toLowerCase());
		}
	};

	// Add class to body, used by css to show/hide blocks
	// that depend on support user being authenticated
	Support.AuthenticatedBlocks = {
		init: function() {
			var supportAuthenticatedClass = (Support.Helpers.isAuthenticated()) ? 'support-logged-in' : 'support-logged-out';
			$('body').addClass(supportAuthenticatedClass);
		}
	};

	Support.Issues = {

		tableRowsSelector: '.js-support-issues-rows',
		showMoreSelector: '.js-support-issues-show-more',
		issueTableWrapperSelector: '.js-issue-table-wrapper',
		hiddenClass: 'hidden',
		showBatchQty: 10,
		// stateful selectors and classes
		loadingIssuesContainerSelector: '.js-loading-issues-container',
		noIssuesContainerSelector: '.js-no-issues-container',
		hasIssuesContainerSelector: '.js-issues-container',
		loadingFailedIssuesContainerSelector: '.js-failed-loading-issues-container',
		hideOnInitClass: 'support-hide-while-loading',

		getModuleStateContainerSelectors: function() {
			return {
				load: Support.Issues.loadingIssuesContainerSelector,
				hasIssues: Support.Issues.hasIssuesContainerSelector,
				noIssues: Support.Issues.noIssuesContainerSelector,
				failed: Support.Issues.loadingFailedIssuesContainerSelector
			};
		},

		loadViaUrl: function(url) {

			Support.Issues.actions.showStateContainer('load');

			$.getJSON(url, function(data) {
				if (typeof data.Cases !== 'undefined') {
					var issues = $.map(data.Cases, Support.Issues.mapToIssueFormat)
						// sorts by most recent, descending
						.sort(function(a, b) {
							if (a.lastUpdatedRawDate &&
								b.lastUpdatedRawDate &&
								a.lastUpdatedRawDate > b.lastUpdatedRawDate) {
									return -1;
							}

							if (a.lastUpdatedRawDate &&
								b.lastUpdatedRawDate &&
								a.lastUpdatedRawDate < b.lastUpdatedRawDate) {
									return 1;
							}

							return 0;
						})
						// only keep 20 issues, after sorting
						.slice(0, 20);

					Support.Issues.actions.removeAllIssues();
					Support.Issues.loadIssues(issues);
				} else if (typeof data.errorCode !== undefined) {
					Support.Helpers.accountError('issue', data.errorCode);
					Support.Issues.actions.showStateContainer();
				}
			})
			.fail(function(data) {
				Support.Helpers.accountError('issue', 'DEFAULT_ERROR_MESSAGE');
				Support.Issues.actions.showStateContainer();
			})
			.always(function() {
				Support.Controls.actions.finishedLoading();
			});;
		},

		// takes format from json and maps to format used internally
		// can perform any other clean up as well
		mapToIssueFormat: function(issue) {

			var fullName = Support.Helpers.makeFullName(issue.ContactFirstName, issue.ContactLastName);

			// leftPad with with extra '0' if required
			var pad = Support.Helpers.padToTwoDigits;

			// provides raw js Date object
			var rawLastUpdated = Support.Helpers.parseSupportLongDate(issue.LastModifiedDate);
			var rawCreated = Support.Helpers.parseSupportLongDate(issue.CreatedDate);
			var months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
			
			// "Last Updated" outputted format: MM/DD/YYYY HH:MM
			/*
			var formattedLastUpdated = pad(rawLastUpdated.getMonth() + 1) // getMonth() returns a 0-11 range
										+ "/"
										+ pad(rawLastUpdated.getDate())
										+ "/"
										+ rawLastUpdated.getFullYear();

			var formattedCreated = pad(rawCreated.getMonth() + 1) // getMonth() returns a 0-11 range
										+ "/"
										+ pad(rawCreated.getDate())
										+ "/"
										+ rawCreated.getFullYear();
			*/
			
			
			// "Last Updated" outputted format: MM/DD/YYYY HH:MM
			var formattedLastUpdated = pad(rawLastUpdated.getDate())
										+ "-"
										+ pad(months[rawLastUpdated.getMonth()]) 
										+ "-"
										+ rawLastUpdated.getFullYear();

			var formattedCreated = pad(rawCreated.getDate())
										+ "-"
										+ pad(months[rawCreated.getMonth()])
										+ "-"
										+ rawCreated.getFullYear();
			
			return {
				id: issue.Id,
				caseNumber: issue.CaseNumber,
				status: issue.Status,
				product: issue.ProductName,
				createdDate: formattedCreated,
				lastUpdatedOriginalDate: issue.LastModifiedDate,
				lastUpdatedRawDate: rawLastUpdated,
				lastUpdatedFormattedDate: formattedLastUpdated,
				summary: issue.Subject,
				submitter: fullName
			};
		},

		loadIssues: function(issues) {
			if (issues.length) {
				Support.Issues.actions.addIssues(issues);
				Support.Issues.actions.showStateContainer('hasIssues');
			} else {
				Support.Issues.actions.showStateContainer('noIssues');
			}
		},

		loadSelectedIssue: function() {
			var matchId = $(contractSelector).find(':selected').data('contract-id') || "";
			// Load local test data  or get via ajax
			if (typeof bmcMeta !== 'undefined' && typeof bmcMeta.cdxLocal !== 'undefined' && bmcMeta.cdxLocal) {
				this.loadViaUrl('./test/' + matchId + '.json');
			} else {
				this.loadViaUrl('/templates/RestGetSupportOpenIssues?contractID=' + matchId);
			}
		},

		actions: {

			/**
			 * Adds an array of issue objects
			 * @param {array} issues array of issues in the format specified within `addIssue`
			 */
			addIssues: function(issues) {
				// see Support.Issues.actions.addIssue for expected issue format
				$.each(issues, function(i, issue) {
					Support.Issues.actions.addIssue(issue);
				});
			},

			addIssue: function(issue) {

				/**
				 * output format:
				 *
				 *  {
				 *      id: number,
				 *		summary: string,
				 *      product: string,
				 *      createdDate: string,
				 *      lastUpdated: string,
				 *      status: string,
				 *		submitter: string
				 * 	}
				 */

				// pull needed fields from issue for output format
				var issueOutput = {
					id: issue.caseNumber,
					summary: issue.summary,
					product: issue.product,
					createdDate: issue.createdDate,
					lastUpdated: issue.lastUpdatedFormattedDate,
					status: issue.status,
					submitter: issue.submitter
				};

				// cell html markup container
				var cells = [];

				for (key in issueOutput) {
					// ID needs to be linked to the ticket
					if (key === 'id') {
						if (typeof bmcMeta !== 'undefined' && typeof bmcMeta.support !== 'undefined') {

							supportEnv = (typeof bmcMeta.support.issueEnvironment !== 'undefined') ? bmcMeta.support.issueEnvironment : "";
							supportPath = (typeof bmcMeta.support.issuePath !== 'undefined') ? bmcMeta.support.issuePath : "";
						}

						cells.push('<td><a href="' + Support.Issues.buildSupportIssueUrl(supportEnv, supportPath, issue.id) + '">' + issueOutput[key] + '</a></td>');
					} else {
						cells.push('<td>' + issueOutput[key] + '</td>');
					}
				}

				var row = '<tr data-issue-id="' + issueOutput.id + '">' + cells.join('') + '</tr>';
				var rowsContainer = $(Support.Issues.issueTableWrapperSelector).find('table tbody');
				$(rowsContainer).append(row);
			},

			/**
			 * state is based on the key provided by the array returned from getModuleStateContainerSelectors
			 */
			showStateContainer: function(showState) {

				var states = Support.Issues.getModuleStateContainerSelectors();

				if (typeof states[showState] !== 'undefined') {
					$(states[showState]).fadeIn();
				}

				// hide existing states
				for (state in states) {
					if (state !== showState) {
						$(states[state]).hide();
					}
				}
			},

			removeAllIssues: function() {
				var rows = $(Support.Issues.issueTableWrapperSelector).find('table tbody tr');
				rows.remove();
			},

			showIssues: function(amount) {
				var hiddenIssues = $(Support.Issues.tableRowsSelector).find('tr.hidden');
				var capped = $(hiddenIssues).slice(0, Support.Issues.showBatchQty);
				var remaining = hiddenIssues.length - capped.length;

				if (capped.length > 0) {
					Support.Issues.actions.show(capped);
				} else {
					Support.Issues.actions.viewAll();
				}

				// Showed final batch
				if (remaining <= Support.Issues.showBatchQty) {
					Support.Issues.actions.allShown();
				}
			},
			show: function(elements) {
				$(elements).removeClass(Support.Issues.hiddenClass);
			},
			hide: function(elements) {
				$(elements).addClass(Support.Issues.hiddenClass);
			},
			allShown: function() {
				var showMore = $(Support.Issues.showMoreSelector);
				var newLabel = showMore.data('view-all-label');
				showMore.html(newLabel);
			},
			viewAll: function() {
				var url = $(Support.Issues.showMoreSelector).data('view-all-url');
				if (url) {
					document.location = url;
				}
			},

			finishedLoading: function() {
				$('.js-account-details-loading').hide();
				$('.support-no-issues').hide().removeClass('support-hide-while-loading');
				$('.action-details').removeClass('support-hide-while-loading');
			}
		},

		buildSupportIssueUrl: function(supportEnv, supportPath, issueID) {
			return supportEnv + supportPath + issueID;
		}
	};

	Support.Controls = {

		actions: {
			finishedLoading: function() {
				$('.js-account-details-loading').hide();
				$('.support-no-issues').hide().removeClass('support-hide-while-loading');
				$('.action-details').removeClass('support-hide-while-loading');
			},

			resetLoadAccountError: function() {
				$(accountError).hide();
			}
		},

		issueShowMore: function() {
			$(Support.Issues.showMoreSelector).on('click', function(e) {
				e.preventDefault();
				Support.Issues.actions.showIssues(Support.Issues.showBatchQty);
			});
		},

		loadData: function() {
			// Load local test data or get via ajax
			if (typeof bmcMeta !== 'undefined' && typeof bmcMeta.cdxLocal !== 'undefined' && bmcMeta.cdxLocal) {
				Support.Issues.loadViaUrl('./test/issues.json');
			} else {
				Support.Issues.loadViaUrl('/bin/supportcases');
			}
		},
		
		employeeCheck : function(){
			
			bmcMeta.user.email = "shailesh@bmc.com";
			
			if(typeof bmcMeta !== "undefined" && typeof bmcMeta.user !== "undefined" && typeof bmcMeta.user.email !== "undefined"){
				
				var pEmailID = bmcMeta.user.email;
				
				if(pEmailID.indexOf("@bmc.com") > -1)
					{
						var employeeAlertContent = '<section class="layout-full-bleed support-promo support-message-box"><p class="align-center"><strong>You are currently logged in with your BMC employee internal ID on the external www.bmc.com/support site.</strong><br>Please <a href="/available/sso-default-login.html">login</a> using an account that you have registered with an active Support ID if you would like to access BMC Customer Support applications i.e. Product Downloads, eFix, Case Management.</p></section>';
						$( employeeAlertContent ).insertAfter( ".supportcentral-news" );
					}
			}
		},

		init: function() {
			
			// Prevent init if not logged in or not on landing page
			if (!Support.Helpers.isAuthenticated() || !Support.Helpers.isOnSupportLandingPage()) {
				return;
			}
			this.issueShowMore();
			this.loadData();
			
			//DXP-1111 : Support Central - Employee Check
			this.employeeCheck();
			
		}

	};

	Support.Alerts = {

		init: function() {

			// local vars
			var finishedLoading,
				messagesUrl;

			// Objects
			this.dialog = $("#confirm");
			this.trigger = $(".js-fancyDialog");

			// Actions
			this.confirmButton = "Close";
			this.confirmCheckbox = "Don\'t show this again";

			// callback to handle messages, regardless of source
			// handles case in the situation where there are no messages
			// or messages data is falsey
			finishedLoading = function(messages) {

				// have messages
				if (messages && messages.length > 0) {
					// sets global alertMessages
					alertMessages = messages;

					// Alert button
					this.alertButton();
					// Check cookies
					this.checkCookies(this.messages);
				// don't have messages
				} else {
					// in any case that doesn't result in loading, hide the alerts button
					this.trigger.parent().remove();
				}
			// maintain context
			}.bind(this);

			// load messages data from bmcMeta global object
			// this.loadMessagesFromGlobal(finishedLoading);
			//
			// -- OR --
			//
			// load messages data from ajax
			// load relative URL on bmc.com or hardcode URL source for testing purposes
			if ( Support.Helpers.bmcSupportLoaded() && Support.Helpers.bmcAlertsEnabled() ){
				// local development:
				if ((typeof bmcMeta.cdxLocal !== 'undefined') && bmcMeta.cdxLocal) {
					messagesUrl = 'test/alertMessages.json';
				// dev/stage/prod:
				} else {
					if ((typeof bmcMeta.support.alertsUrl !== 'undefined') && bmcMeta.support.alertsUrl) {
						messagesUrl = bmcMeta.support.alertsUrl;
					} else {
						messagesUrl = '/templates/ServiceSupportAlertsJSON';
					}
				}
				this.loadMessagesFromUrl(finishedLoading, messagesUrl);
			}
		},

		// will retrieve messages by the bmcMeta global
		// loads on module global var alertMessages
		loadMessagesFromGlobal: function(messagesHandler) {
			var messages;

			if (Support.Helpers.bmcSupportLoaded() && typeof bmcMeta.support.alertMessages !== 'undefined') {
				messages = bmcMeta.support.alertMessages;
			}

			if (typeof messagesHandler === 'function') messagesHandler(messages);
		},

		// allows for ajaxing in message data
		loadMessagesFromUrl: function(messagesHandler, url) {
			$.ajax(url)
				.done(function(data) {
					// based on example json, assume response payload contains data on
					// property 'supportAlertMessages'
					if (typeof messagesHandler === 'function') messagesHandler(data.supportAlertMessages);
				})
				.fail(function() {
					if (typeof messagesHandler === 'function') messagesHandler(null);
				});
		},

		openAlert: function() {
			this.fancyConfig(this.messages);
		},

		alertButton: function() {
			this.trigger.on("click", $.proxy(this.openAlert, this));
		},

		checkCookies: function(options) {
			// Check if cookies match IDs
			var showAlert = false;
			for (i = 0; i < alertMessages.length; i++) {
				// If no cookies then show alert
				if ($.cookie(alertMessages[i].id) === undefined) {
					showAlert = true;
				}
			}
			if (showAlert) {
				this.openAlert();
			}
		},

		fancyConfig: function(options) {
			$.fancybox(this.dialog, {
				autoWidth: false,
				minHeight: 400,
				maxWidth: 745,
				padding: 0,
				tpl: {
					wrap: '<div class="fancybox-wrap fancybox-dialog" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-title">Alert Notifications</div><div class="fancybox-inner"></div></div></div></div>',
					error: '<p class="fancybox-error">The requested content cannot be loaded.<br/>Please try again later.</p>'
				},
				helpers: {
					overlay: {
						closeClick: true, // if true, fancyBox will be closed when user clicks on the overlay
						speedOut: 200, // duration of fadeOut animation
						showEarly: true, // indicates if should be opened immediately or wait until the content is ready
						css: {}, // custom CSS properties
						locked: true // if true, the content will be locked into overlay
					}
				},
				beforeShow: function() {
					// Add containers
					this.content.append("<div class='messages'></div><div class='action'></div>");
					// Add messages
					this.messages = this.content.find(".messages");
					for (i = 0; i < alertMessages.length; i++) {
						this.messages.append("<h3 class='title'>" + alertMessages[i].title + "</h3>");
						this.messages.append("<p class='message'>" + alertMessages[i].message + "</p>");
						if (alertMessages[i].link) {
							this.messages.append('<p class="link"><a href="' + alertMessages[i].url + '">' + alertMessages[i].link + '</a></p>');
						}
					}
					// Add mobile button
					this.messages.append('<p style="text-align:right"><input type="button" class="btn action-button" value="' + Support.Alerts.confirmButton + '"/></p>');
					// Add controls
					this.content.find(".action").append('<input type="button" class="btn action-button" value="' + Support.Alerts.confirmButton + '"/><label class="action-checkbox"><input type="checkbox" />' + Support.Alerts.confirmCheckbox + '</label>');
				},
				afterShow: function() {
					var alertB = this.content.find(".action-button"),
						actionB = this.content.find(".action .action-button"),
						alertC = this.content.find(".action-checkbox input"),
						alertX = $('.fancybox-dialog .fancybox-close');
					closeDialog = function() {
						// Create cookie if checkbox is checked
						if (alertC.is(':checked')) {
							for (i = 0; i < alertMessages.length; i++) {
								$.cookie(alertMessages[i].id, alertMessages[i].id, {
									expires: 365,
									path: "/",
									domain: ".bmc.com"
								});
							}
						}
						$.fancybox.close();
					};
					// Check if text overflows message container
					if (this.messages[0].scrollHeight > this.messages.innerHeight()) {
						actionB.prop("disabled", true);
						this.messages.bind('scroll', function() {
							if ($(this)[0].scrollHeight - $(this).scrollTop() <= $(this).innerHeight()) {
								actionB.prop("disabled", false);
							}
						});
					}
					// Close dialog when buttons are clicked
					alertB.on("click", function() {
						closeDialog();
					});
					alertX.on("click", function() {
						closeDialog();
					});
				},
				afterClose: function() {
					// Remove dialog content
					this.content.html("");
				}
			});
		}
	};

	Support.GettingStartedCarousel = {
		init: function() {
			$('.support-getting-started-topics.carousel .topics').owlCarousel({
				items: 1,
				nav: false
			});
		}
	};

	Support.ToggleSearchAreas = {

		searchAreasSelector: '.js-support-search-area',
		toggleActionSelector: '.js-support-search-toggle',
		toggleActionLabelSelector: '.js-support-search-toggle',
		toggleLabelText: {
			expand: 'More Resources',
			collapse: 'Collapse'
		},
		togglableAreas: null,
		elementsShown: false,
		hideLastQty: 4,

		init: function() {

			// only initialize if .js-support-search-toggle-extra exists
			if ($('.js-support-search-toggle-extra').length === 0) {
				return;
			}

			// SETUP
			this.findTogglableElements();
			this.addHandlers();

			// INITIAL ACTIONS
			this.actions.hide(this.helpers.hideElementsInstant);
			this.actions.updateLabel(this.toggleLabelText.expand);
		},

		helpers: {
			showElementsFade: function(elements) {
				return $(elements).fadeIn();
			},
			showElementsInstant: function(elements) {
				return $(elements).show();
			},
			hideElementsFade: function(elements) {
				return $(elements).fadeOut();
			},
			hideElementsInstant: function(elements) {
				return $(elements).hide();
			}
		},

		findTogglableElements: function() {
			var searchAreas = $(this.searchAreasSelector);
			var sliceFrom = searchAreas.length - this.hideLastQty;
			var sliceTo = searchAreas.length;
			this.togglableAreas = searchAreas.slice(sliceFrom, sliceTo);
		},

		actions: {
			toggle: function() {
				if (Support.ToggleSearchAreas.elementsShown) {
					this.hide(Support.ToggleSearchAreas.helpers.hideElementsFade);
					this.updateLabel(Support.ToggleSearchAreas.toggleLabelText.expand);
				} else {
					this.show(Support.ToggleSearchAreas.helpers.showElementsFade);
					this.updateLabel(Support.ToggleSearchAreas.toggleLabelText.collapse);
				}
			},
			show: function(elementsHandler) {
				if (typeof elementsHandler === 'function') {
					elementsHandler($(Support.ToggleSearchAreas.togglableAreas));
				}

				Support.ToggleSearchAreas.elementsShown = true;
			},
			hide: function(elementsHandler) {
				if (typeof elementsHandler === 'function') {
					elementsHandler($(Support.ToggleSearchAreas.togglableAreas));
				}

				Support.ToggleSearchAreas.elementsShown = false;
			},
			updateLabel: function(text) {
				$(Support.ToggleSearchAreas.toggleActionLabelSelector).html(text);
			}
		},


		addHandlers: function() {
			$(this.toggleActionSelector).on('click', function(e) {
				e.preventDefault();
				this.actions.toggle();
			}.bind(this));
		}
	};

	Support.Menu = {

		desktopBreakpoint: 960,

		// touchHandlers require a `click` to trigger a menu
		touchHandlers: function(adapter) {
			var menu = adapter.menu;
			$(menu.subMenuTriggerSelector).on({
				'click': function(e) {
					if (!$(menu.subMenuSelector).has($(e.target))) {
						e.preventDefault();
					}
					var subMenu = menu.findMenuFromTarget(e.target);

					if (subMenu.hasClass(menu.expandedClass)) {
						menu.collapseMenu(subMenu);
					} else {
						menu.collapseAllSubMenus();
						menu.expandMenu(subMenu);
					}
				}
			});
		},

		//  noTouchHandlers assumes a mouse, and uses a `hover` to trigger a menu
		noTouchHandlers: function(adapter) {
			var menu = adapter.menu;
			$(menu.subMenuTriggerSelector).on({
				'mouseenter': function(e) {
					menu.collapseAllSubMenus();
					var subMenu = menu.findMenuFromTarget(e.target);
					menu.expandMenu(subMenu);
				},
				'mouseleave': function(e) {
					menu.collapseAllSubMenus();
				}
			});
		},

		// Register clicks that happen outside the menu, and dismiss the menu
		collapseOutsideHandler: function(adapter) {
			var menu = adapter.menu;
			var menuElement = $(menu.menuElement);

			$('body').on('click', function(e) {
				if (!$(e.target).parents().addBack().is(menuElement)) {
					menu.collapseAllSubMenus();
				}
			});
		},

		// both `touchHandlers` and `noTouchHandlers` use the same
		// element to attach handlers to, therefore can use the same
		// function to remove the handlers
		destoryHandlers: function(adapter) {
			var menu = adapter.menu;
			$(menu.subMenuTriggerSelector).off();
		},

		getMenu: function() {
			// generate menu based on selector
			var menu = menujs.generateMenu({
				menuElement: $('.support-menu')
			});

			return menu;
		},

		getAdapters: function(menu) {
			var supportMenu = this;

			// create desktop adapter
			var desktopAdapter = menuAdapter.generateMenuAdapter(menu, {
				handlers: [{
					setup: supportMenu.touchHandlers,
					destroy: supportMenu.destoryHandlers
				}, {
					setup: supportMenu.collapseOutsideHandler,
					destroy: supportMenu.destoryHandlers
				}],
				init: function(adapter) {
					$(adapter.menu.menuElement).addClass('desktop');
				},
				teardown: function(adapter) {
					$(adapter.menu.menuElement).removeClass('desktop');
					adapter.menu.collapseAllSubMenus();
				}
			});

			// create mobile adapter
			// mobileAdapter starting point is a copy of desktop adapter
			var mobileAdapter = menuAdapter.generateMenuAdapter(menu, {
				handlers: [{
					setup: supportMenu.touchHandlers,
					destroy: function(adapter) {
						return supportMenu.destoryHandlers(adapter);
					}
				}], // assume no hover interactions
				init: function(adapter) {
					$(adapter.menu.menuElement).addClass('mobile');
				},
				teardown: function(adapter) {
					$(adapter.menu.menuElement).removeClass('mobile');
					adapter.menu.collapseAllSubMenus();
				}
			});

			var allAdapters = {
				mobile: mobileAdapter,
				desktop: desktopAdapter
			};
			return allAdapters;
		},

		getAdapterManager: function(menu, adapters) {
			var adapterManager = generateMenuAdapterManager();
			return adapterManager;
		},

		init: function() {
			var menu = this.getMenu();
			var adapters = this.getAdapters(menu);
			var adapterManager = this.getAdapterManager(menu, adapters);

			var isDesktop = function() {
				// in case media queries aren't supported by the browser, then default to using the width of the window
				return Modernizr.mq('(min-width: ' + Support.Menu.desktopBreakpoint + 'px)') || $(window).width() >= Support.Menu.desktopBreakpoint;
			};
			var isMobile = function() {
				return !isDesktop();
			};

			// Add adapter for various conditions, on the adapter manager
			adapterManager.addCondition(function() {
				return isDesktop();
			}, adapters.desktop);

			adapterManager.addCondition(function() {
				return isMobile();
			}, adapters.mobile);

			adapterManager.init();
		}
	};

	Support.MobileToggleHeader = {

		baseHeight: null,
		maxHeight: 1500,
		breakpointToggle: 960,

		actions: {
			open: function() {
				$('.support-header').addClass('expanded');
				$('.support-header').css('max-height', '1200px');
			},
			close: function() {
				this.setHeightAsBaseHeight();
			},
			setHeightAsBaseHeight: function() {
				$('.support-header').css('max-height', Support.MobileToggleHeader.baseHeight + 'px');

				// by default other browsers will trigger close on addHandlers at the end of the css transition
				// ie8 will never trigger the end css transition event as it doesn't support transitions
				if ($('html').hasClass('oldie')) {
					$('.support-header').trigger('transitionend');
				}
			},
			applyIfMobile: function() {
				// if desktop, remove max-height and expanded class
				// in case media queries aren't supported by the browser, then default to using the width of the window
				var isDesktop = Modernizr.mq('(min-width: ' + Support.MobileToggleHeader.breakpointToggle + 'px)') || $(window).width() >= Support.Menu.desktopBreakpoint;
				if (isDesktop) {
					$('.support-header').css('max-height', '');
					$('.support-header').removeClass('expanded');
				} else {
					if ($('.support-header').hasClass('expanded')) {
						this.open();
					} else {
						this.close();
					}
				}
			}
		},

		calcBaseHeight: function() {
			// if the height should be determined dynamically
			// this.baseHeight = $('.logo-bar-container').height();

			this.baseHeight = 90;
		},

		addHandlers: function() {

			$('.js-toggle-open-header').on('click', function() {
				if ($('.support-header').hasClass('expanded')) {
					Support.MobileToggleHeader.actions.close();
				} else {
					Support.MobileToggleHeader.actions.open();
				}
			});

			$('.support-header').on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function() {

				// transition has ended and at end height position
				if ($('.support-header').height() === Support.MobileToggleHeader.baseHeight || $('html').hasClass('oldie')) {
					$('.support-header').removeClass('expanded');
				}
			});

			$(window).on('resize', function(e) {
				Support.MobileToggleHeader.actions.applyIfMobile();
			});

		},

		init: function() {
			var self = this;
			window.setTimeout(function() {
				self.calcBaseHeight();
				self.addHandlers();
				self.actions.applyIfMobile();
			}, 0);
		}
	};

	// used to attach the class on load to transition the fixed side into view
	Support.SlideInSupportChatButton = {
		init: function() {
			var $chatNow = $('.support-chat-now, .chat-now-link');
			if ($chatNow.length) {
				$chatNow.addClass('on-screen');
			}
		}
	}

	// init each support feature
	function init() {
		Support.AuthenticatedBlocks.init();
		Support.GettingStartedCarousel.init();
		Support.Controls.init();
		Support.Alerts.init();
		Support.ToggleSearchAreas.init();
		Support.Menu.init();
		Support.MobileToggleHeader.init();
		Support.SlideInSupportChatButton.init();
	}

	$(init);

}(jQuery));

},{"./menu":3,"./menu-adapter":2}],2:[function(require,module,exports){
var generateMenuAdapter = (function() {

	var adapterAPI = {

		label: '',
		menu: null,
		interface: 'touch', // assume a touch interface by default, mobile-first
		handlers: [],

		setupHandlers: function() {
			var adapter = this;
			$.each(this.handlers, function(i, handler){
				handler.setup(adapter);
			});
		},
		destroyHandlers: function() {
			var adapter = this;
			$.each(this.handlers, function(i, handler){
				handler.destroy(adapter);
			});
		},

		teardown: function(adapter) {},
		init: function(adapter) {}
	};

	return function(menu, options) {

		var adapter = $.extend({}, adapterAPI, options, {

			menu: menu,

			init: function(interface) {

				menu.init();

				this.interface = interface;
				this.setupHandlers();

				// finish with executing the options passed in
				if (typeof options.init === 'function') {
					options.init(this);
				}
			},

			teardown: function() {

				this.destroyHandlers();

				if (typeof options.teardown === 'function') {
					options.teardown(this);
				}
			}
		});

		return adapter;

	};

})();

exports.generateMenuAdapter = generateMenuAdapter;

},{}],3:[function(require,module,exports){
var generateMenu = (function() {

	var menuDefault = {

	  menuElement: $('.menu'),
	  subMenuSelector: '.sub-menu',
	  expandedClass: 'expanded',
	  subMenuTriggerSelector: '.js-show-sub-trigger',

	  expandMenu: function(subMenuElement) {
		$(subMenuElement).addClass(this.expandedClass);
	  },

	  collapseMenu: function(subMenuElement) {
		$(subMenuElement).removeClass(this.expandedClass);
	  },

	  collapseAllSubMenus: function() {
	  	var menu = this;
		this.menuElement.find(this.subMenuSelector).each(function(i, e){
		  menu.collapseMenu(e);
		});
	  },

	  findMenuFromTarget: function(target) {
		var trigger = $(target).parent(this.subMenuTriggerSelector).addBack(this.subMenuTriggerSelector);
		var menu = trigger.find(this.subMenuSelector);
		return menu;
	  },

	  init: function() {}
	};

	return function(options) {
	  return $.extend({}, menuDefault, options);
	};
})();

exports.generateMenu =  generateMenu;

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL3N1cHBvcnQuanMiLCJqcy9tb2R1bGVzL21lbnUtYWRhcHRlci5qcyIsImpzL21vZHVsZXMvbWVudS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ppQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgbWVudWpzID0gcmVxdWlyZSgnLi9tZW51Jyk7XG52YXIgbWVudUFkYXB0ZXIgPSByZXF1aXJlKCcuL21lbnUtYWRhcHRlcicpO1xuXG52YXIgU3VwcG9ydCA9IFN1cHBvcnQgfHwge307XG5cbihmdW5jdGlvbigkKSB7XG5cblx0dmFyIHN1cHBvcnRFbnYsXG5cdFx0c3VwcG9ydFBhdGgsXG5cdFx0YWxlcnRNZXNzYWdlcyxcblx0XHRpc3N1ZXNDb250YWluZXIgPSAkKCcuanMtaXNzdWVzLWNvbnRhaW5lcicpLFxuXHRcdGNvbnRyYWN0U2VsZWN0b3IgPSAkKCcuanMtY29udHJhY3RzLXNlbGVjdCcpLFxuXHRcdGNvbnRyYWN0RGV0YWlscyA9ICQoJy5hY3Rpb24tZGV0YWlsLWdyb3VwJyksXG5cdFx0YWNjb3VudERldGFpbHMgPSAkKCcuYWN0aW9uLWRldGFpbHMnKSxcblx0XHRhY2NvdW50RXJyb3IgPSAkKCcuanMtYWNjb3VudC1lcnJvcicpLFxuXHRcdGFsZXJ0c0J1dHRvbkNvbnRhaW5lciA9ICQoJ2EuYWxlcnRzLmpzLWZhbmN5RGlhbG9nJykucGFyZW50KCdsaS5hY3Rpb24nKTtcblxuXHRTdXBwb3J0LkhlbHBlcnMgPSB7XG5cblx0XHQvLyBDaGVjayBpZiB0aGUgYm1jTWV0YSBhbmQgYm1jTWV0YS5zdXBwb3J0IGV4aXN0XG5cdFx0Ly8gVXNlZCB0byBhc3N1bWUgb3RoZXIgZnVuY3Rpb25hbGl0eSBiYXNlZCBvbiB0aGUgZXhpc3RhbmNlIG9mIHRoaXMgaW5pdGlhbCBiYXNlIHNldHVwXG5cdFx0Ym1jU3VwcG9ydExvYWRlZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAodHlwZW9mIGJtY01ldGEgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBibWNNZXRhLnN1cHBvcnQgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0sXG5cblx0XHQvLyBDaGVjayB0byBzZWUgaWYgZW5hYmxlQWxlcnRzIGlzIHRydWVcblx0XHRibWNBbGVydHNFbmFibGVkOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICh0eXBlb2YgYm1jTWV0YS5zdXBwb3J0LmVuYWJsZUFsZXJ0cyAhPT0gJ3VuZGVmaW5lZCcgJiYgYm1jTWV0YS5zdXBwb3J0LmVuYWJsZUFsZXJ0cyA9PSB0cnVlKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0U3VwcG9ydC5IZWxwZXJzLmhpZGVBbGVydHNCdXR0b24oKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9LFxuXG5cdFx0aGlkZUFsZXJ0c0J1dHRvbjogZnVuY3Rpb24oKSB7XG5cdFx0XHQkKGFsZXJ0c0J1dHRvbkNvbnRhaW5lcikuaGlkZSgpO1xuXHRcdH0sXG5cdFx0c2hvd0FsZXJ0c0J1dHRvbjogZnVuY3Rpb24oKSB7XG5cdFx0XHQkKGFsZXJ0c0J1dHRvbkNvbnRhaW5lcikuc2hvdygpO1xuXHRcdH0sXG5cblx0XHRpc0F1dGhlbnRpY2F0ZWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHR5cGVvZiBibWNNZXRhICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBibWNNZXRhLnVzZXIgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIGJtY01ldGEudXNlci5pc1N1cHBvcnRBdXRoZW50aWNhdGVkICE9PSBcInVuZGVmaW5lZFwiICYmIGJtY01ldGEudXNlci5pc1N1cHBvcnRBdXRoZW50aWNhdGVkO1xuXHRcdH0sXG5cblx0XHRpc09uU3VwcG9ydExhbmRpbmdQYWdlOiBmdW5jdGlvbigpIHtcblxuXHRcdFx0aWYgKFN1cHBvcnQuSGVscGVycy5ibWNTdXBwb3J0TG9hZGVkKClcblx0XHRcdFx0JiYgdHlwZW9mIGJtY01ldGEucGFnZSAhPT0gJ3VuZGVmaW5lZCdcblx0XHRcdFx0JiYgdHlwZW9mIGJtY01ldGEucGFnZS5sb25nTmFtZSA9PT0gJ3N0cmluZycpIHtcblxuXHRcdFx0XHQvL3ZhciBwYXRoQ2hlY2sgPSAvc3VwcG9ydC4qc3VwcG9ydC1jZW50cmFsLztcblx0XHRcdFx0dmFyIHBhdGhDaGVjayA9IC9zdXBwb3J0LzsgLy9EWFAtODEyXG5cdFx0XHRcdFxuXHRcdFx0XHQvLyBtYXRjaGVzIHBhdGggc3RyaW5nIHdpdGggc3VwcG9ydCBhbmQgc3VwcG9ydCBjZW50cmFsIGluIGl0XG5cdFx0XHRcdC8vIGV4YW1wbGVzOlxuXHRcdFx0XHQvLyBcInN1cHBvcnQ6c3VwcG9ydC1jZW50cmFsXCIgb3IgXCJzdXBwb3J0OnJlZzpzdXBwb3J0LWNlbnRyYWxcIlxuXHRcdFx0XHRpZiAoYm1jTWV0YS5wYWdlLmxvbmdOYW1lLm1hdGNoKHBhdGhDaGVjaykgIT09IG51bGwpIHtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBjYXRjaC1hbGwgZGVmYXVsdFxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBnZXRBY2NvdW50RXJyb3JNZXNzYWdlXG5cdFx0ICogQHBhcmFtICB7c3RyaW5nfSBlcnJvclR5cGUgLSAnaXNzdWUnXG5cdFx0ICogQHBhcmFtICB7c3RyaW5nfSBlcnJvckNvZGUgZXJyb3JDb2RlIChsaWtlbHkgcHVsbGVkIGZyb20gYWpheCByZXNwb25zZSlcblx0XHQgKiBAcmV0dXJuIHtzdHJpbmcgfCB1bmRlZmluZWR9IFJldHVybnMgbWFwcGVkIHN0cmluZyBvciB1bmRlZmluZWQgaWYgbm9uZSBmb3VuZCBpbiB1bmRlZmluZWRcblx0XHQgKi9cblx0XHRnZXRBY2NvdW50RXJyb3JNZXNzYWdlOiBmdW5jdGlvbihlcnJvclR5cGUsIGVycm9yQ29kZSkge1xuXHRcdFx0Ly8gbWFwIGVycm9yVHlwZSB0byBjb3JyZWN0IGVycm9yR3JvdXAsIGVycm9yR3JvdXAgaXMgdXNlZCBhcyB0aGUgaW5kZXggb24gYm1jTWV0YS5zdXBwb3J0LmVycm9yTWVzc2FnZXNcblx0XHRcdGlmIChlcnJvclR5cGUgPT0gJ2lzc3VlJykge1xuXHRcdFx0XHR2YXIgZXJyb3JHcm91cCA9ICdjYXNlRXJyb3JNZXNzYWdlcyc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1VzZSB2YWxpZCBlcnJvclR5cGUgd2hlbiBhY2NvdW50RXJyb3InKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gZGV0ZXJtaW5lIGFwcHJvcHJpYXRlIGVycm9yIG1lc3NhZ2UgYmFzZWQgb24gaW5kZXhlc1xuXHRcdFx0Ly8gdW5kZWZpbmVkIGlmIG1hcHBlZCB2YWx1ZSBub3QgZm91bmRcblx0XHRcdHZhciBlcnJvck1lc3NhZ2UgPSBTdXBwb3J0LkhlbHBlcnMuYm1jU3VwcG9ydExvYWRlZCgpXG5cdFx0XHRcdFx0XHRcdFx0JiYgYm1jTWV0YS5zdXBwb3J0W2Vycm9yR3JvdXBdICE9PSB1bmRlZmluZWRcblx0XHRcdFx0XHRcdFx0XHQmJiBibWNNZXRhLnN1cHBvcnRbZXJyb3JHcm91cF1bZXJyb3JDb2RlXSAhPT0gdW5kZWZpbmVkXG5cdFx0XHRcdFx0XHRcdFx0PyBibWNNZXRhLnN1cHBvcnRbZXJyb3JHcm91cF1bZXJyb3JDb2RlXSA6IHVuZGVmaW5lZDtcblxuXHRcdFx0cmV0dXJuIGVycm9yTWVzc2FnZTtcblx0XHR9LFxuXG5cdFx0YWNjb3VudEVycm9yOiBmdW5jdGlvbihlcnJvclR5cGUsIGVycm9yQ29kZSkge1xuXHRcdFx0Ly8gcmVzZXQgaGlkaW5nIG9mIGNvbnRhaW5lciwgc2hvdyBuZXcgZXJyb3Jcblx0XHRcdFN1cHBvcnQuQ29udHJvbHMuYWN0aW9ucy5yZXNldExvYWRBY2NvdW50RXJyb3IoKTtcblxuXHRcdFx0dmFyIGVycm9yTWVzc2FnZSA9IFN1cHBvcnQuSGVscGVycy5nZXRBY2NvdW50RXJyb3JNZXNzYWdlKGVycm9yVHlwZSwgZXJyb3JDb2RlKTtcblxuXHRcdFx0Ly8gZXJyb3JNZXNzYWdlIGlzIHVuZGVmaW5lZCBpZiBtYXBwZWQgbWVzc2FnZSBub3QgZm91bmRcblx0XHRcdC8vIGF0dGVtcHQgdG8gc2V0IHVzZSBERUZBVUxUX0VSUk9SX01FU1NBR0Vcblx0XHRcdGlmIChlcnJvck1lc3NhZ2UgPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdGVycm9yTWVzc2FnZSA9IFN1cHBvcnQuSGVscGVycy5nZXRBY2NvdW50RXJyb3JNZXNzYWdlKGVycm9yVHlwZSwgJ0RFRkFVTFRfRVJST1JfTUVTU0FHRScpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBzaG93L2hpZGUgc3BlY2lmaWMgY29udGFpbmVycyBiYXNlZCBvbiBlcnJvclR5cGVcblx0XHRcdGlmIChlcnJvclR5cGUgPT0gJ2lzc3VlJykge1xuXHRcdFx0XHQkKGFjY291bnREZXRhaWxzKS5zaG93KCk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIGhpZGUgb3RoZXIgY29udGFpbmVyc1xuXHRcdFx0JChpc3N1ZXNDb250YWluZXIpLmhpZGUoKTtcblxuXHRcdFx0Ly8gc2hvdyBlcnJvciBjb250YWluZXIgd2l0aCBtZXNzYWdlLCBidXQgb25seSBpZiBtZXNzYWdlIGlzIGEgbm9uLWVtcHR5IHN0cmluZ1xuXHRcdFx0Ly8gaWYgdGhlIGVycm9yTWVzc2FnZSB3YXMgcmVzb2x2ZWQgdG8gYSBtYXBwaW5nIG9mIGFuIGVtcHR5IHN0cmluZywgdGhlbiBkb24ndCBzaG93XG5cdFx0XHRpZiAodHlwZW9mIGVycm9yTWVzc2FnZSA9PT0gJ3N0cmluZycgJiYgZXJyb3JNZXNzYWdlLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0JChhY2NvdW50RXJyb3IpLnNob3coKS5odG1sKGVycm9yTWVzc2FnZSk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIFBhcnNlcyBkYXRlcyBjb21pbmcgYmFjayBmcm9tIGFqYXggcmVzcG9uc2UuIEZvciB0aGUgbGFjayBvZiBhIGJldHRlciB0ZXJtIHRoaXMgaXMgYmVpbmdcblx0XHQgKiByZWZlcnJlZCB0byBhcyBgU3VwcG9ydCBMb25nIERhdGVgLCBhbmQgaXMgYSBzdHJpbmcgYmVpbmcgbG9hZGVkIGluIHRoZSBzdGFuZGFyZCBmb3JtYXQ6XG5cdFx0ICogMjAxNS0wNC0xNFQxNDowMjoyMi4wMDBaXG5cdFx0ICogQHBhcmFtICB7U3RyaW5nfSBkYXRlU3RyaW5nIC0gRGF0ZSBmb3JtYXR0ZWQgc3RyaW5nLCBsaWtlICcyMDE1LTA0LTE0VDE0OjAyOjIyLjAwMFonXG5cdFx0ICogQHJldHVybiB7RGF0ZXxudWxsfSBudWxsIGlmIG5vIG1hdGNoZXMsIG9yIG5hdGl2ZSBqYXZhc2NyaXB0IERhdGUgb2JqZWN0XG5cdFx0ICovXG5cdFx0cGFyc2VTdXBwb3J0TG9uZ0RhdGU6IGZ1bmN0aW9uKGRhdGVTdHJpbmcpIHtcblx0XHRcdHZhciBwYXR0ZXJuID0gLyhcXGR7NH0pLShcXGR7Mn0pLShcXGR7Mn0pVChcXGR7Mn0pOihcXGR7Mn0pOihcXGR7Mn0pLihcXGR7M31cXEQpLztcblx0XHRcdHZhciBtYXRjaGVzID0gcGF0dGVybi5leGVjKGRhdGVTdHJpbmcpO1xuXG5cdFx0XHQvLyBvbiBzdWNjZXNzZnVsIG1hdGNoLCBtYXRjaFswXSB3aWxsIGJlIHRoZSBlbnRpcmUgbWF0Y2hlZCBzdHJpbmdcblx0XHRcdC8vIG1hdGNoZWQgZ3JvdXBzIGFyZSBmb2xsb3dpbmcgaW5kZXhlc1xuXHRcdFx0aWYgKG1hdGNoZXMpIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHQvLyBtb250aCBpcyByZXByZXNlbnRlZCBieSBtYXRjaGVzWzJdLCBEYXRlIGNvbnN0cnVjdG9yIGV4cGVjdHMgbW9udGggaW5kZXggZnJvbSAwIHRvIDExLlxuXHRcdFx0XHRcdHJldHVybiBuZXcgRGF0ZShtYXRjaGVzWzFdLCAocGFyc2VJbnQobWF0Y2hlc1syXSkgLSAxKSwgbWF0Y2hlc1szXSwgbWF0Y2hlc1s0XSwgbWF0Y2hlc1s1XSwgbWF0Y2hlc1s2XSk7XG5cdFx0XHRcdH0gY2F0Y2goZXJyb3IpIHtcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKCdVbmFibGUgdG8gcGFyc2VTdXBwb3J0TG9uZ0RhdGUgd2l0aCAnICsgZGF0ZVN0cmluZyArICcuIEVycm9yOlxcbiAnICsgZXJyb3IubWVzc2FnZSk7XG5cdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRwYWQ6IGZ1bmN0aW9uKG4sIHdpZHRoLCB6KSB7XG5cdFx0XHR6ID0geiB8fCAnMCc7XG5cdFx0XHRuID0gbiArICcnO1xuXHRcdFx0cmV0dXJuIG4ubGVuZ3RoID49IHdpZHRoID8gbiA6IG5ldyBBcnJheSh3aWR0aCAtIG4ubGVuZ3RoICsgMSkuam9pbih6KSArIG47XG5cdFx0fSxcblxuXHRcdC8vIFF1aWNrIGFuZCBlYXN5IGZ1bmN0aW9uIGZvciBwYWRkaW5nIG1vbnRoIGFuZCBkYXkgYW1vdW50cyB3aXRoIGxlYWRpbmcgemVyb2VzIGlmIG5lY2Vzc2FyeSAoaWU6IE1NL0REL1lZWVksIHNpbmdsZSBkaWdpdGFscyBmb3IgTU0gYW5kIEREIHNob3VsZCBoYXZlIGxlYWRpbmcgMClcblx0XHRwYWRUb1R3b0RpZ2l0czogZnVuY3Rpb24obnVtKSB7XG5cdFx0XHRyZXR1cm4gU3VwcG9ydC5IZWxwZXJzLnBhZChudW0sIDIpO1xuXHRcdH0sXG5cdFx0Z2V0VVJMV2l0aFF1ZXJ5UGFyYW06IGZ1bmN0aW9uKHVyaSwga2V5LCB2YWx1ZSkge1xuXHRcdFx0dmFyIHJlID0gbmV3IFJlZ0V4cChcIihbPyZdKVwiICsga2V5ICsgXCI9Lio/KCZ8JClcIiwgXCJpXCIpO1xuXHRcdFx0dmFyIHNlcGFyYXRvciA9IHVyaS5pbmRleE9mKCc/JykgIT09IC0xID8gXCImXCIgOiBcIj9cIjtcblxuXHRcdFx0aWYgKHVyaS5tYXRjaChyZSkpIHtcblx0XHRcdFx0cmV0dXJuIHVyaS5yZXBsYWNlKHJlLCAnJDEnICsga2V5ICsgXCI9XCIgKyB2YWx1ZSArICckMicpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHJldHVybiB1cmkgKyBzZXBhcmF0b3IgKyBrZXkgKyBcIj1cIiArIHZhbHVlO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Ly8gQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyBpZiBpdCdzIG5vdCBvbmUuIEFuIGVtcHR5IHN0cmluZyBpcyByZXR1cm5lZCBmb3IgYG51bGxgIG9yIGB1bmRlZmluZWRgIHZhbHVlcy5cblx0XHRiYXNlVG9TdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0ICByZXR1cm4gdmFsdWUgPT0gbnVsbCA/ICcnIDogKHZhbHVlICsgJycpO1xuXHRcdH0sXG5cblx0XHQvLyBDYXBpdGFsaXplcyB0aGUgZmlyc3QgY2hhcmFjdGVyIG9mIGBzdHJpbmdgLlxuXHRcdGNhcGl0YWxpemU6IGZ1bmN0aW9uKHN0cmluZykge1xuXHRcdCAgc3RyaW5nID0gU3VwcG9ydC5IZWxwZXJzLmJhc2VUb1N0cmluZyhzdHJpbmcpO1xuXHRcdCAgcmV0dXJuIHN0cmluZyAmJiAoc3RyaW5nLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyaW5nLnNsaWNlKDEpKTtcblx0XHR9LFxuXG5cdFx0bWFrZUZ1bGxOYW1lOiBmdW5jdGlvbihmaXJzdE5hbWUsIGxhc3ROYW1lKSB7XG5cdFx0XHRyZXR1cm4gU3VwcG9ydC5IZWxwZXJzLmNhcGl0YWxpemUobGFzdE5hbWUudG9Mb3dlckNhc2UoKSkgKyBcIiwgXCIgKyBTdXBwb3J0LkhlbHBlcnMuY2FwaXRhbGl6ZShmaXJzdE5hbWUudG9Mb3dlckNhc2UoKSk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIEFkZCBjbGFzcyB0byBib2R5LCB1c2VkIGJ5IGNzcyB0byBzaG93L2hpZGUgYmxvY2tzXG5cdC8vIHRoYXQgZGVwZW5kIG9uIHN1cHBvcnQgdXNlciBiZWluZyBhdXRoZW50aWNhdGVkXG5cdFN1cHBvcnQuQXV0aGVudGljYXRlZEJsb2NrcyA9IHtcblx0XHRpbml0OiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBzdXBwb3J0QXV0aGVudGljYXRlZENsYXNzID0gKFN1cHBvcnQuSGVscGVycy5pc0F1dGhlbnRpY2F0ZWQoKSkgPyAnc3VwcG9ydC1sb2dnZWQtaW4nIDogJ3N1cHBvcnQtbG9nZ2VkLW91dCc7XG5cdFx0XHQkKCdib2R5JykuYWRkQ2xhc3Moc3VwcG9ydEF1dGhlbnRpY2F0ZWRDbGFzcyk7XG5cdFx0fVxuXHR9O1xuXG5cdFN1cHBvcnQuSXNzdWVzID0ge1xuXG5cdFx0dGFibGVSb3dzU2VsZWN0b3I6ICcuanMtc3VwcG9ydC1pc3N1ZXMtcm93cycsXG5cdFx0c2hvd01vcmVTZWxlY3RvcjogJy5qcy1zdXBwb3J0LWlzc3Vlcy1zaG93LW1vcmUnLFxuXHRcdGlzc3VlVGFibGVXcmFwcGVyU2VsZWN0b3I6ICcuanMtaXNzdWUtdGFibGUtd3JhcHBlcicsXG5cdFx0aGlkZGVuQ2xhc3M6ICdoaWRkZW4nLFxuXHRcdHNob3dCYXRjaFF0eTogMTAsXG5cdFx0Ly8gc3RhdGVmdWwgc2VsZWN0b3JzIGFuZCBjbGFzc2VzXG5cdFx0bG9hZGluZ0lzc3Vlc0NvbnRhaW5lclNlbGVjdG9yOiAnLmpzLWxvYWRpbmctaXNzdWVzLWNvbnRhaW5lcicsXG5cdFx0bm9Jc3N1ZXNDb250YWluZXJTZWxlY3RvcjogJy5qcy1uby1pc3N1ZXMtY29udGFpbmVyJyxcblx0XHRoYXNJc3N1ZXNDb250YWluZXJTZWxlY3RvcjogJy5qcy1pc3N1ZXMtY29udGFpbmVyJyxcblx0XHRsb2FkaW5nRmFpbGVkSXNzdWVzQ29udGFpbmVyU2VsZWN0b3I6ICcuanMtZmFpbGVkLWxvYWRpbmctaXNzdWVzLWNvbnRhaW5lcicsXG5cdFx0aGlkZU9uSW5pdENsYXNzOiAnc3VwcG9ydC1oaWRlLXdoaWxlLWxvYWRpbmcnLFxuXG5cdFx0Z2V0TW9kdWxlU3RhdGVDb250YWluZXJTZWxlY3RvcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0bG9hZDogU3VwcG9ydC5Jc3N1ZXMubG9hZGluZ0lzc3Vlc0NvbnRhaW5lclNlbGVjdG9yLFxuXHRcdFx0XHRoYXNJc3N1ZXM6IFN1cHBvcnQuSXNzdWVzLmhhc0lzc3Vlc0NvbnRhaW5lclNlbGVjdG9yLFxuXHRcdFx0XHRub0lzc3VlczogU3VwcG9ydC5Jc3N1ZXMubm9Jc3N1ZXNDb250YWluZXJTZWxlY3Rvcixcblx0XHRcdFx0ZmFpbGVkOiBTdXBwb3J0Lklzc3Vlcy5sb2FkaW5nRmFpbGVkSXNzdWVzQ29udGFpbmVyU2VsZWN0b3Jcblx0XHRcdH07XG5cdFx0fSxcblxuXHRcdGxvYWRWaWFVcmw6IGZ1bmN0aW9uKHVybCkge1xuXG5cdFx0XHRTdXBwb3J0Lklzc3Vlcy5hY3Rpb25zLnNob3dTdGF0ZUNvbnRhaW5lcignbG9hZCcpO1xuXG5cdFx0XHQkLmdldEpTT04odXJsLCBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdGlmICh0eXBlb2YgZGF0YS5DYXNlcyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0XHR2YXIgaXNzdWVzID0gJC5tYXAoZGF0YS5DYXNlcywgU3VwcG9ydC5Jc3N1ZXMubWFwVG9Jc3N1ZUZvcm1hdClcblx0XHRcdFx0XHRcdC8vIHNvcnRzIGJ5IG1vc3QgcmVjZW50LCBkZXNjZW5kaW5nXG5cdFx0XHRcdFx0XHQuc29ydChmdW5jdGlvbihhLCBiKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChhLmxhc3RVcGRhdGVkUmF3RGF0ZSAmJlxuXHRcdFx0XHRcdFx0XHRcdGIubGFzdFVwZGF0ZWRSYXdEYXRlICYmXG5cdFx0XHRcdFx0XHRcdFx0YS5sYXN0VXBkYXRlZFJhd0RhdGUgPiBiLmxhc3RVcGRhdGVkUmF3RGF0ZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIC0xO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0aWYgKGEubGFzdFVwZGF0ZWRSYXdEYXRlICYmXG5cdFx0XHRcdFx0XHRcdFx0Yi5sYXN0VXBkYXRlZFJhd0RhdGUgJiZcblx0XHRcdFx0XHRcdFx0XHRhLmxhc3RVcGRhdGVkUmF3RGF0ZSA8IGIubGFzdFVwZGF0ZWRSYXdEYXRlKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gMTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdHJldHVybiAwO1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC8vIG9ubHkga2VlcCAyMCBpc3N1ZXMsIGFmdGVyIHNvcnRpbmdcblx0XHRcdFx0XHRcdC5zbGljZSgwLCAyMCk7XG5cblx0XHRcdFx0XHRTdXBwb3J0Lklzc3Vlcy5hY3Rpb25zLnJlbW92ZUFsbElzc3VlcygpO1xuXHRcdFx0XHRcdFN1cHBvcnQuSXNzdWVzLmxvYWRJc3N1ZXMoaXNzdWVzKTtcblx0XHRcdFx0fSBlbHNlIGlmICh0eXBlb2YgZGF0YS5lcnJvckNvZGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFN1cHBvcnQuSGVscGVycy5hY2NvdW50RXJyb3IoJ2lzc3VlJywgZGF0YS5lcnJvckNvZGUpO1xuXHRcdFx0XHRcdFN1cHBvcnQuSXNzdWVzLmFjdGlvbnMuc2hvd1N0YXRlQ29udGFpbmVyKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuZmFpbChmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdFN1cHBvcnQuSGVscGVycy5hY2NvdW50RXJyb3IoJ2lzc3VlJywgJ0RFRkFVTFRfRVJST1JfTUVTU0FHRScpO1xuXHRcdFx0XHRTdXBwb3J0Lklzc3Vlcy5hY3Rpb25zLnNob3dTdGF0ZUNvbnRhaW5lcigpO1xuXHRcdFx0fSlcblx0XHRcdC5hbHdheXMoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFN1cHBvcnQuQ29udHJvbHMuYWN0aW9ucy5maW5pc2hlZExvYWRpbmcoKTtcblx0XHRcdH0pOztcblx0XHR9LFxuXG5cdFx0Ly8gdGFrZXMgZm9ybWF0IGZyb20ganNvbiBhbmQgbWFwcyB0byBmb3JtYXQgdXNlZCBpbnRlcm5hbGx5XG5cdFx0Ly8gY2FuIHBlcmZvcm0gYW55IG90aGVyIGNsZWFuIHVwIGFzIHdlbGxcblx0XHRtYXBUb0lzc3VlRm9ybWF0OiBmdW5jdGlvbihpc3N1ZSkge1xuXG5cdFx0XHR2YXIgZnVsbE5hbWUgPSBTdXBwb3J0LkhlbHBlcnMubWFrZUZ1bGxOYW1lKGlzc3VlLkNvbnRhY3RGaXJzdE5hbWUsIGlzc3VlLkNvbnRhY3RMYXN0TmFtZSk7XG5cblx0XHRcdC8vIGxlZnRQYWQgd2l0aCB3aXRoIGV4dHJhICcwJyBpZiByZXF1aXJlZFxuXHRcdFx0dmFyIHBhZCA9IFN1cHBvcnQuSGVscGVycy5wYWRUb1R3b0RpZ2l0cztcblxuXHRcdFx0Ly8gcHJvdmlkZXMgcmF3IGpzIERhdGUgb2JqZWN0XG5cdFx0XHR2YXIgcmF3TGFzdFVwZGF0ZWQgPSBTdXBwb3J0LkhlbHBlcnMucGFyc2VTdXBwb3J0TG9uZ0RhdGUoaXNzdWUuTGFzdE1vZGlmaWVkRGF0ZSk7XG5cdFx0XHR2YXIgcmF3Q3JlYXRlZCA9IFN1cHBvcnQuSGVscGVycy5wYXJzZVN1cHBvcnRMb25nRGF0ZShpc3N1ZS5DcmVhdGVkRGF0ZSk7XG5cdFx0XHR2YXIgbW9udGhzPVsnSmFuJywnRmViJywnTWFyJywnQXByJywnTWF5JywnSnVuJywnSnVsJywnQXVnJywnU2VwJywnT2N0JywnTm92JywnRGVjJ107XG5cdFx0XHRcblx0XHRcdC8vIFwiTGFzdCBVcGRhdGVkXCIgb3V0cHV0dGVkIGZvcm1hdDogTU0vREQvWVlZWSBISDpNTVxuXHRcdFx0Lypcblx0XHRcdHZhciBmb3JtYXR0ZWRMYXN0VXBkYXRlZCA9IHBhZChyYXdMYXN0VXBkYXRlZC5nZXRNb250aCgpICsgMSkgLy8gZ2V0TW9udGgoKSByZXR1cm5zIGEgMC0xMSByYW5nZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHQrIFwiL1wiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCsgcGFkKHJhd0xhc3RVcGRhdGVkLmdldERhdGUoKSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0KyBcIi9cIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQrIHJhd0xhc3RVcGRhdGVkLmdldEZ1bGxZZWFyKCk7XG5cblx0XHRcdHZhciBmb3JtYXR0ZWRDcmVhdGVkID0gcGFkKHJhd0NyZWF0ZWQuZ2V0TW9udGgoKSArIDEpIC8vIGdldE1vbnRoKCkgcmV0dXJucyBhIDAtMTEgcmFuZ2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0KyBcIi9cIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQrIHBhZChyYXdDcmVhdGVkLmdldERhdGUoKSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0KyBcIi9cIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQrIHJhd0NyZWF0ZWQuZ2V0RnVsbFllYXIoKTtcblx0XHRcdCovXG5cdFx0XHRcblx0XHRcdFxuXHRcdFx0Ly8gXCJMYXN0IFVwZGF0ZWRcIiBvdXRwdXR0ZWQgZm9ybWF0OiBNTS9ERC9ZWVlZIEhIOk1NXG5cdFx0XHR2YXIgZm9ybWF0dGVkTGFzdFVwZGF0ZWQgPSBwYWQocmF3TGFzdFVwZGF0ZWQuZ2V0RGF0ZSgpKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHQrIFwiLVwiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCsgcGFkKG1vbnRoc1tyYXdMYXN0VXBkYXRlZC5nZXRNb250aCgpXSkgXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCsgXCItXCJcblx0XHRcdFx0XHRcdFx0XHRcdFx0KyByYXdMYXN0VXBkYXRlZC5nZXRGdWxsWWVhcigpO1xuXG5cdFx0XHR2YXIgZm9ybWF0dGVkQ3JlYXRlZCA9IHBhZChyYXdDcmVhdGVkLmdldERhdGUoKSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0KyBcIi1cIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQrIHBhZChtb250aHNbcmF3Q3JlYXRlZC5nZXRNb250aCgpXSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0KyBcIi1cIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQrIHJhd0NyZWF0ZWQuZ2V0RnVsbFllYXIoKTtcblx0XHRcdFxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0aWQ6IGlzc3VlLklkLFxuXHRcdFx0XHRjYXNlTnVtYmVyOiBpc3N1ZS5DYXNlTnVtYmVyLFxuXHRcdFx0XHRzdGF0dXM6IGlzc3VlLlN0YXR1cyxcblx0XHRcdFx0cHJvZHVjdDogaXNzdWUuUHJvZHVjdE5hbWUsXG5cdFx0XHRcdGNyZWF0ZWREYXRlOiBmb3JtYXR0ZWRDcmVhdGVkLFxuXHRcdFx0XHRsYXN0VXBkYXRlZE9yaWdpbmFsRGF0ZTogaXNzdWUuTGFzdE1vZGlmaWVkRGF0ZSxcblx0XHRcdFx0bGFzdFVwZGF0ZWRSYXdEYXRlOiByYXdMYXN0VXBkYXRlZCxcblx0XHRcdFx0bGFzdFVwZGF0ZWRGb3JtYXR0ZWREYXRlOiBmb3JtYXR0ZWRMYXN0VXBkYXRlZCxcblx0XHRcdFx0c3VtbWFyeTogaXNzdWUuU3ViamVjdCxcblx0XHRcdFx0c3VibWl0dGVyOiBmdWxsTmFtZVxuXHRcdFx0fTtcblx0XHR9LFxuXG5cdFx0bG9hZElzc3VlczogZnVuY3Rpb24oaXNzdWVzKSB7XG5cdFx0XHRpZiAoaXNzdWVzLmxlbmd0aCkge1xuXHRcdFx0XHRTdXBwb3J0Lklzc3Vlcy5hY3Rpb25zLmFkZElzc3Vlcyhpc3N1ZXMpO1xuXHRcdFx0XHRTdXBwb3J0Lklzc3Vlcy5hY3Rpb25zLnNob3dTdGF0ZUNvbnRhaW5lcignaGFzSXNzdWVzJyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRTdXBwb3J0Lklzc3Vlcy5hY3Rpb25zLnNob3dTdGF0ZUNvbnRhaW5lcignbm9Jc3N1ZXMnKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0bG9hZFNlbGVjdGVkSXNzdWU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG1hdGNoSWQgPSAkKGNvbnRyYWN0U2VsZWN0b3IpLmZpbmQoJzpzZWxlY3RlZCcpLmRhdGEoJ2NvbnRyYWN0LWlkJykgfHwgXCJcIjtcblx0XHRcdC8vIExvYWQgbG9jYWwgdGVzdCBkYXRhICBvciBnZXQgdmlhIGFqYXhcblx0XHRcdGlmICh0eXBlb2YgYm1jTWV0YSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGJtY01ldGEuY2R4TG9jYWwgIT09ICd1bmRlZmluZWQnICYmIGJtY01ldGEuY2R4TG9jYWwpIHtcblx0XHRcdFx0dGhpcy5sb2FkVmlhVXJsKCcuL3Rlc3QvJyArIG1hdGNoSWQgKyAnLmpzb24nKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMubG9hZFZpYVVybCgnL3RlbXBsYXRlcy9SZXN0R2V0U3VwcG9ydE9wZW5Jc3N1ZXM/Y29udHJhY3RJRD0nICsgbWF0Y2hJZCk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdGFjdGlvbnM6IHtcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBBZGRzIGFuIGFycmF5IG9mIGlzc3VlIG9iamVjdHNcblx0XHRcdCAqIEBwYXJhbSB7YXJyYXl9IGlzc3VlcyBhcnJheSBvZiBpc3N1ZXMgaW4gdGhlIGZvcm1hdCBzcGVjaWZpZWQgd2l0aGluIGBhZGRJc3N1ZWBcblx0XHRcdCAqL1xuXHRcdFx0YWRkSXNzdWVzOiBmdW5jdGlvbihpc3N1ZXMpIHtcblx0XHRcdFx0Ly8gc2VlIFN1cHBvcnQuSXNzdWVzLmFjdGlvbnMuYWRkSXNzdWUgZm9yIGV4cGVjdGVkIGlzc3VlIGZvcm1hdFxuXHRcdFx0XHQkLmVhY2goaXNzdWVzLCBmdW5jdGlvbihpLCBpc3N1ZSkge1xuXHRcdFx0XHRcdFN1cHBvcnQuSXNzdWVzLmFjdGlvbnMuYWRkSXNzdWUoaXNzdWUpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0sXG5cblx0XHRcdGFkZElzc3VlOiBmdW5jdGlvbihpc3N1ZSkge1xuXG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiBvdXRwdXQgZm9ybWF0OlxuXHRcdFx0XHQgKlxuXHRcdFx0XHQgKiAge1xuXHRcdFx0XHQgKiAgICAgIGlkOiBudW1iZXIsXG5cdFx0XHRcdCAqXHRcdHN1bW1hcnk6IHN0cmluZyxcblx0XHRcdFx0ICogICAgICBwcm9kdWN0OiBzdHJpbmcsXG5cdFx0XHRcdCAqICAgICAgY3JlYXRlZERhdGU6IHN0cmluZyxcblx0XHRcdFx0ICogICAgICBsYXN0VXBkYXRlZDogc3RyaW5nLFxuXHRcdFx0XHQgKiAgICAgIHN0YXR1czogc3RyaW5nLFxuXHRcdFx0XHQgKlx0XHRzdWJtaXR0ZXI6IHN0cmluZ1xuXHRcdFx0XHQgKiBcdH1cblx0XHRcdFx0ICovXG5cblx0XHRcdFx0Ly8gcHVsbCBuZWVkZWQgZmllbGRzIGZyb20gaXNzdWUgZm9yIG91dHB1dCBmb3JtYXRcblx0XHRcdFx0dmFyIGlzc3VlT3V0cHV0ID0ge1xuXHRcdFx0XHRcdGlkOiBpc3N1ZS5jYXNlTnVtYmVyLFxuXHRcdFx0XHRcdHN1bW1hcnk6IGlzc3VlLnN1bW1hcnksXG5cdFx0XHRcdFx0cHJvZHVjdDogaXNzdWUucHJvZHVjdCxcblx0XHRcdFx0XHRjcmVhdGVkRGF0ZTogaXNzdWUuY3JlYXRlZERhdGUsXG5cdFx0XHRcdFx0bGFzdFVwZGF0ZWQ6IGlzc3VlLmxhc3RVcGRhdGVkRm9ybWF0dGVkRGF0ZSxcblx0XHRcdFx0XHRzdGF0dXM6IGlzc3VlLnN0YXR1cyxcblx0XHRcdFx0XHRzdWJtaXR0ZXI6IGlzc3VlLnN1Ym1pdHRlclxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdC8vIGNlbGwgaHRtbCBtYXJrdXAgY29udGFpbmVyXG5cdFx0XHRcdHZhciBjZWxscyA9IFtdO1xuXG5cdFx0XHRcdGZvciAoa2V5IGluIGlzc3VlT3V0cHV0KSB7XG5cdFx0XHRcdFx0Ly8gSUQgbmVlZHMgdG8gYmUgbGlua2VkIHRvIHRoZSB0aWNrZXRcblx0XHRcdFx0XHRpZiAoa2V5ID09PSAnaWQnKSB7XG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mIGJtY01ldGEgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBibWNNZXRhLnN1cHBvcnQgIT09ICd1bmRlZmluZWQnKSB7XG5cblx0XHRcdFx0XHRcdFx0c3VwcG9ydEVudiA9ICh0eXBlb2YgYm1jTWV0YS5zdXBwb3J0Lmlzc3VlRW52aXJvbm1lbnQgIT09ICd1bmRlZmluZWQnKSA/IGJtY01ldGEuc3VwcG9ydC5pc3N1ZUVudmlyb25tZW50IDogXCJcIjtcblx0XHRcdFx0XHRcdFx0c3VwcG9ydFBhdGggPSAodHlwZW9mIGJtY01ldGEuc3VwcG9ydC5pc3N1ZVBhdGggIT09ICd1bmRlZmluZWQnKSA/IGJtY01ldGEuc3VwcG9ydC5pc3N1ZVBhdGggOiBcIlwiO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRjZWxscy5wdXNoKCc8dGQ+PGEgaHJlZj1cIicgKyBTdXBwb3J0Lklzc3Vlcy5idWlsZFN1cHBvcnRJc3N1ZVVybChzdXBwb3J0RW52LCBzdXBwb3J0UGF0aCwgaXNzdWUuaWQpICsgJ1wiPicgKyBpc3N1ZU91dHB1dFtrZXldICsgJzwvYT48L3RkPicpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjZWxscy5wdXNoKCc8dGQ+JyArIGlzc3VlT3V0cHV0W2tleV0gKyAnPC90ZD4nKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR2YXIgcm93ID0gJzx0ciBkYXRhLWlzc3VlLWlkPVwiJyArIGlzc3VlT3V0cHV0LmlkICsgJ1wiPicgKyBjZWxscy5qb2luKCcnKSArICc8L3RyPic7XG5cdFx0XHRcdHZhciByb3dzQ29udGFpbmVyID0gJChTdXBwb3J0Lklzc3Vlcy5pc3N1ZVRhYmxlV3JhcHBlclNlbGVjdG9yKS5maW5kKCd0YWJsZSB0Ym9keScpO1xuXHRcdFx0XHQkKHJvd3NDb250YWluZXIpLmFwcGVuZChyb3cpO1xuXHRcdFx0fSxcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBzdGF0ZSBpcyBiYXNlZCBvbiB0aGUga2V5IHByb3ZpZGVkIGJ5IHRoZSBhcnJheSByZXR1cm5lZCBmcm9tIGdldE1vZHVsZVN0YXRlQ29udGFpbmVyU2VsZWN0b3JzXG5cdFx0XHQgKi9cblx0XHRcdHNob3dTdGF0ZUNvbnRhaW5lcjogZnVuY3Rpb24oc2hvd1N0YXRlKSB7XG5cblx0XHRcdFx0dmFyIHN0YXRlcyA9IFN1cHBvcnQuSXNzdWVzLmdldE1vZHVsZVN0YXRlQ29udGFpbmVyU2VsZWN0b3JzKCk7XG5cblx0XHRcdFx0aWYgKHR5cGVvZiBzdGF0ZXNbc2hvd1N0YXRlXSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0XHQkKHN0YXRlc1tzaG93U3RhdGVdKS5mYWRlSW4oKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIGhpZGUgZXhpc3Rpbmcgc3RhdGVzXG5cdFx0XHRcdGZvciAoc3RhdGUgaW4gc3RhdGVzKSB7XG5cdFx0XHRcdFx0aWYgKHN0YXRlICE9PSBzaG93U3RhdGUpIHtcblx0XHRcdFx0XHRcdCQoc3RhdGVzW3N0YXRlXSkuaGlkZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSxcblxuXHRcdFx0cmVtb3ZlQWxsSXNzdWVzOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyIHJvd3MgPSAkKFN1cHBvcnQuSXNzdWVzLmlzc3VlVGFibGVXcmFwcGVyU2VsZWN0b3IpLmZpbmQoJ3RhYmxlIHRib2R5IHRyJyk7XG5cdFx0XHRcdHJvd3MucmVtb3ZlKCk7XG5cdFx0XHR9LFxuXG5cdFx0XHRzaG93SXNzdWVzOiBmdW5jdGlvbihhbW91bnQpIHtcblx0XHRcdFx0dmFyIGhpZGRlbklzc3VlcyA9ICQoU3VwcG9ydC5Jc3N1ZXMudGFibGVSb3dzU2VsZWN0b3IpLmZpbmQoJ3RyLmhpZGRlbicpO1xuXHRcdFx0XHR2YXIgY2FwcGVkID0gJChoaWRkZW5Jc3N1ZXMpLnNsaWNlKDAsIFN1cHBvcnQuSXNzdWVzLnNob3dCYXRjaFF0eSk7XG5cdFx0XHRcdHZhciByZW1haW5pbmcgPSBoaWRkZW5Jc3N1ZXMubGVuZ3RoIC0gY2FwcGVkLmxlbmd0aDtcblxuXHRcdFx0XHRpZiAoY2FwcGVkLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRTdXBwb3J0Lklzc3Vlcy5hY3Rpb25zLnNob3coY2FwcGVkKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRTdXBwb3J0Lklzc3Vlcy5hY3Rpb25zLnZpZXdBbGwoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFNob3dlZCBmaW5hbCBiYXRjaFxuXHRcdFx0XHRpZiAocmVtYWluaW5nIDw9IFN1cHBvcnQuSXNzdWVzLnNob3dCYXRjaFF0eSkge1xuXHRcdFx0XHRcdFN1cHBvcnQuSXNzdWVzLmFjdGlvbnMuYWxsU2hvd24oKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHNob3c6IGZ1bmN0aW9uKGVsZW1lbnRzKSB7XG5cdFx0XHRcdCQoZWxlbWVudHMpLnJlbW92ZUNsYXNzKFN1cHBvcnQuSXNzdWVzLmhpZGRlbkNsYXNzKTtcblx0XHRcdH0sXG5cdFx0XHRoaWRlOiBmdW5jdGlvbihlbGVtZW50cykge1xuXHRcdFx0XHQkKGVsZW1lbnRzKS5hZGRDbGFzcyhTdXBwb3J0Lklzc3Vlcy5oaWRkZW5DbGFzcyk7XG5cdFx0XHR9LFxuXHRcdFx0YWxsU2hvd246IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgc2hvd01vcmUgPSAkKFN1cHBvcnQuSXNzdWVzLnNob3dNb3JlU2VsZWN0b3IpO1xuXHRcdFx0XHR2YXIgbmV3TGFiZWwgPSBzaG93TW9yZS5kYXRhKCd2aWV3LWFsbC1sYWJlbCcpO1xuXHRcdFx0XHRzaG93TW9yZS5odG1sKG5ld0xhYmVsKTtcblx0XHRcdH0sXG5cdFx0XHR2aWV3QWxsOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyIHVybCA9ICQoU3VwcG9ydC5Jc3N1ZXMuc2hvd01vcmVTZWxlY3RvcikuZGF0YSgndmlldy1hbGwtdXJsJyk7XG5cdFx0XHRcdGlmICh1cmwpIHtcblx0XHRcdFx0XHRkb2N1bWVudC5sb2NhdGlvbiA9IHVybDtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblxuXHRcdFx0ZmluaXNoZWRMb2FkaW5nOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0JCgnLmpzLWFjY291bnQtZGV0YWlscy1sb2FkaW5nJykuaGlkZSgpO1xuXHRcdFx0XHQkKCcuc3VwcG9ydC1uby1pc3N1ZXMnKS5oaWRlKCkucmVtb3ZlQ2xhc3MoJ3N1cHBvcnQtaGlkZS13aGlsZS1sb2FkaW5nJyk7XG5cdFx0XHRcdCQoJy5hY3Rpb24tZGV0YWlscycpLnJlbW92ZUNsYXNzKCdzdXBwb3J0LWhpZGUtd2hpbGUtbG9hZGluZycpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRidWlsZFN1cHBvcnRJc3N1ZVVybDogZnVuY3Rpb24oc3VwcG9ydEVudiwgc3VwcG9ydFBhdGgsIGlzc3VlSUQpIHtcblx0XHRcdHJldHVybiBzdXBwb3J0RW52ICsgc3VwcG9ydFBhdGggKyBpc3N1ZUlEO1xuXHRcdH1cblx0fTtcblxuXHRTdXBwb3J0LkNvbnRyb2xzID0ge1xuXG5cdFx0YWN0aW9uczoge1xuXHRcdFx0ZmluaXNoZWRMb2FkaW5nOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0JCgnLmpzLWFjY291bnQtZGV0YWlscy1sb2FkaW5nJykuaGlkZSgpO1xuXHRcdFx0XHQkKCcuc3VwcG9ydC1uby1pc3N1ZXMnKS5oaWRlKCkucmVtb3ZlQ2xhc3MoJ3N1cHBvcnQtaGlkZS13aGlsZS1sb2FkaW5nJyk7XG5cdFx0XHRcdCQoJy5hY3Rpb24tZGV0YWlscycpLnJlbW92ZUNsYXNzKCdzdXBwb3J0LWhpZGUtd2hpbGUtbG9hZGluZycpO1xuXHRcdFx0fSxcblxuXHRcdFx0cmVzZXRMb2FkQWNjb3VudEVycm9yOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0JChhY2NvdW50RXJyb3IpLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0aXNzdWVTaG93TW9yZTogZnVuY3Rpb24oKSB7XG5cdFx0XHQkKFN1cHBvcnQuSXNzdWVzLnNob3dNb3JlU2VsZWN0b3IpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRTdXBwb3J0Lklzc3Vlcy5hY3Rpb25zLnNob3dJc3N1ZXMoU3VwcG9ydC5Jc3N1ZXMuc2hvd0JhdGNoUXR5KTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cblx0XHRsb2FkRGF0YTogZnVuY3Rpb24oKSB7XG5cdFx0XHQvLyBMb2FkIGxvY2FsIHRlc3QgZGF0YSBvciBnZXQgdmlhIGFqYXhcblx0XHRcdGlmICh0eXBlb2YgYm1jTWV0YSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGJtY01ldGEuY2R4TG9jYWwgIT09ICd1bmRlZmluZWQnICYmIGJtY01ldGEuY2R4TG9jYWwpIHtcblx0XHRcdFx0U3VwcG9ydC5Jc3N1ZXMubG9hZFZpYVVybCgnLi90ZXN0L2lzc3Vlcy5qc29uJyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRTdXBwb3J0Lklzc3Vlcy5sb2FkVmlhVXJsKCcvYmluL3N1cHBvcnRjYXNlcycpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XG5cdFx0ZW1wbG95ZWVDaGVjayA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcblx0XHRcdGJtY01ldGEudXNlci5lbWFpbCA9IFwic2hhaWxlc2hAYm1jLmNvbVwiO1xuXHRcdFx0XG5cdFx0XHRpZih0eXBlb2YgYm1jTWV0YSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgYm1jTWV0YS51c2VyICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBibWNNZXRhLnVzZXIuZW1haWwgIT09IFwidW5kZWZpbmVkXCIpe1xuXHRcdFx0XHRcblx0XHRcdFx0dmFyIHBFbWFpbElEID0gYm1jTWV0YS51c2VyLmVtYWlsO1xuXHRcdFx0XHRcblx0XHRcdFx0aWYocEVtYWlsSUQuaW5kZXhPZihcIkBibWMuY29tXCIpID4gLTEpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0dmFyIGVtcGxveWVlQWxlcnRDb250ZW50ID0gJzxzZWN0aW9uIGNsYXNzPVwibGF5b3V0LWZ1bGwtYmxlZWQgc3VwcG9ydC1wcm9tbyBzdXBwb3J0LW1lc3NhZ2UtYm94XCI+PHAgY2xhc3M9XCJhbGlnbi1jZW50ZXJcIj48c3Ryb25nPllvdSBhcmUgY3VycmVudGx5IGxvZ2dlZCBpbiB3aXRoIHlvdXIgQk1DIGVtcGxveWVlIGludGVybmFsIElEIG9uIHRoZSBleHRlcm5hbCB3d3cuYm1jLmNvbS9zdXBwb3J0IHNpdGUuPC9zdHJvbmc+PGJyPlBsZWFzZSA8YSBocmVmPVwiL2F2YWlsYWJsZS9zc28tZGVmYXVsdC1sb2dpbi5odG1sXCI+bG9naW48L2E+IHVzaW5nIGFuIGFjY291bnQgdGhhdCB5b3UgaGF2ZSByZWdpc3RlcmVkIHdpdGggYW4gYWN0aXZlIFN1cHBvcnQgSUQgaWYgeW91IHdvdWxkIGxpa2UgdG8gYWNjZXNzIEJNQyBDdXN0b21lciBTdXBwb3J0IGFwcGxpY2F0aW9ucyBpLmUuIFByb2R1Y3QgRG93bmxvYWRzLCBlRml4LCBDYXNlIE1hbmFnZW1lbnQuPC9wPjwvc2VjdGlvbj4nO1xuXHRcdFx0XHRcdFx0JCggZW1wbG95ZWVBbGVydENvbnRlbnQgKS5pbnNlcnRBZnRlciggXCIuc3VwcG9ydGNlbnRyYWwtbmV3c1wiICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRpbml0OiBmdW5jdGlvbigpIHtcblx0XHRcdFxuXHRcdFx0Ly8gUHJldmVudCBpbml0IGlmIG5vdCBsb2dnZWQgaW4gb3Igbm90IG9uIGxhbmRpbmcgcGFnZVxuXHRcdFx0aWYgKCFTdXBwb3J0LkhlbHBlcnMuaXNBdXRoZW50aWNhdGVkKCkgfHwgIVN1cHBvcnQuSGVscGVycy5pc09uU3VwcG9ydExhbmRpbmdQYWdlKCkpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5pc3N1ZVNob3dNb3JlKCk7XG5cdFx0XHR0aGlzLmxvYWREYXRhKCk7XG5cdFx0XHRcblx0XHRcdC8vRFhQLTExMTEgOiBTdXBwb3J0IENlbnRyYWwgLSBFbXBsb3llZSBDaGVja1xuXHRcdFx0dGhpcy5lbXBsb3llZUNoZWNrKCk7XG5cdFx0XHRcblx0XHR9XG5cblx0fTtcblxuXHRTdXBwb3J0LkFsZXJ0cyA9IHtcblxuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xuXG5cdFx0XHQvLyBsb2NhbCB2YXJzXG5cdFx0XHR2YXIgZmluaXNoZWRMb2FkaW5nLFxuXHRcdFx0XHRtZXNzYWdlc1VybDtcblxuXHRcdFx0Ly8gT2JqZWN0c1xuXHRcdFx0dGhpcy5kaWFsb2cgPSAkKFwiI2NvbmZpcm1cIik7XG5cdFx0XHR0aGlzLnRyaWdnZXIgPSAkKFwiLmpzLWZhbmN5RGlhbG9nXCIpO1xuXG5cdFx0XHQvLyBBY3Rpb25zXG5cdFx0XHR0aGlzLmNvbmZpcm1CdXR0b24gPSBcIkNsb3NlXCI7XG5cdFx0XHR0aGlzLmNvbmZpcm1DaGVja2JveCA9IFwiRG9uXFwndCBzaG93IHRoaXMgYWdhaW5cIjtcblxuXHRcdFx0Ly8gY2FsbGJhY2sgdG8gaGFuZGxlIG1lc3NhZ2VzLCByZWdhcmRsZXNzIG9mIHNvdXJjZVxuXHRcdFx0Ly8gaGFuZGxlcyBjYXNlIGluIHRoZSBzaXR1YXRpb24gd2hlcmUgdGhlcmUgYXJlIG5vIG1lc3NhZ2VzXG5cdFx0XHQvLyBvciBtZXNzYWdlcyBkYXRhIGlzIGZhbHNleVxuXHRcdFx0ZmluaXNoZWRMb2FkaW5nID0gZnVuY3Rpb24obWVzc2FnZXMpIHtcblxuXHRcdFx0XHQvLyBoYXZlIG1lc3NhZ2VzXG5cdFx0XHRcdGlmIChtZXNzYWdlcyAmJiBtZXNzYWdlcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0Ly8gc2V0cyBnbG9iYWwgYWxlcnRNZXNzYWdlc1xuXHRcdFx0XHRcdGFsZXJ0TWVzc2FnZXMgPSBtZXNzYWdlcztcblxuXHRcdFx0XHRcdC8vIEFsZXJ0IGJ1dHRvblxuXHRcdFx0XHRcdHRoaXMuYWxlcnRCdXR0b24oKTtcblx0XHRcdFx0XHQvLyBDaGVjayBjb29raWVzXG5cdFx0XHRcdFx0dGhpcy5jaGVja0Nvb2tpZXModGhpcy5tZXNzYWdlcyk7XG5cdFx0XHRcdC8vIGRvbid0IGhhdmUgbWVzc2FnZXNcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyBpbiBhbnkgY2FzZSB0aGF0IGRvZXNuJ3QgcmVzdWx0IGluIGxvYWRpbmcsIGhpZGUgdGhlIGFsZXJ0cyBidXR0b25cblx0XHRcdFx0XHR0aGlzLnRyaWdnZXIucGFyZW50KCkucmVtb3ZlKCk7XG5cdFx0XHRcdH1cblx0XHRcdC8vIG1haW50YWluIGNvbnRleHRcblx0XHRcdH0uYmluZCh0aGlzKTtcblxuXHRcdFx0Ly8gbG9hZCBtZXNzYWdlcyBkYXRhIGZyb20gYm1jTWV0YSBnbG9iYWwgb2JqZWN0XG5cdFx0XHQvLyB0aGlzLmxvYWRNZXNzYWdlc0Zyb21HbG9iYWwoZmluaXNoZWRMb2FkaW5nKTtcblx0XHRcdC8vXG5cdFx0XHQvLyAtLSBPUiAtLVxuXHRcdFx0Ly9cblx0XHRcdC8vIGxvYWQgbWVzc2FnZXMgZGF0YSBmcm9tIGFqYXhcblx0XHRcdC8vIGxvYWQgcmVsYXRpdmUgVVJMIG9uIGJtYy5jb20gb3IgaGFyZGNvZGUgVVJMIHNvdXJjZSBmb3IgdGVzdGluZyBwdXJwb3Nlc1xuXHRcdFx0aWYgKCBTdXBwb3J0LkhlbHBlcnMuYm1jU3VwcG9ydExvYWRlZCgpICYmIFN1cHBvcnQuSGVscGVycy5ibWNBbGVydHNFbmFibGVkKCkgKXtcblx0XHRcdFx0Ly8gbG9jYWwgZGV2ZWxvcG1lbnQ6XG5cdFx0XHRcdGlmICgodHlwZW9mIGJtY01ldGEuY2R4TG9jYWwgIT09ICd1bmRlZmluZWQnKSAmJiBibWNNZXRhLmNkeExvY2FsKSB7XG5cdFx0XHRcdFx0bWVzc2FnZXNVcmwgPSAndGVzdC9hbGVydE1lc3NhZ2VzLmpzb24nO1xuXHRcdFx0XHQvLyBkZXYvc3RhZ2UvcHJvZDpcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAoKHR5cGVvZiBibWNNZXRhLnN1cHBvcnQuYWxlcnRzVXJsICE9PSAndW5kZWZpbmVkJykgJiYgYm1jTWV0YS5zdXBwb3J0LmFsZXJ0c1VybCkge1xuXHRcdFx0XHRcdFx0bWVzc2FnZXNVcmwgPSBibWNNZXRhLnN1cHBvcnQuYWxlcnRzVXJsO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRtZXNzYWdlc1VybCA9ICcvdGVtcGxhdGVzL1NlcnZpY2VTdXBwb3J0QWxlcnRzSlNPTic7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMubG9hZE1lc3NhZ2VzRnJvbVVybChmaW5pc2hlZExvYWRpbmcsIG1lc3NhZ2VzVXJsKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0Ly8gd2lsbCByZXRyaWV2ZSBtZXNzYWdlcyBieSB0aGUgYm1jTWV0YSBnbG9iYWxcblx0XHQvLyBsb2FkcyBvbiBtb2R1bGUgZ2xvYmFsIHZhciBhbGVydE1lc3NhZ2VzXG5cdFx0bG9hZE1lc3NhZ2VzRnJvbUdsb2JhbDogZnVuY3Rpb24obWVzc2FnZXNIYW5kbGVyKSB7XG5cdFx0XHR2YXIgbWVzc2FnZXM7XG5cblx0XHRcdGlmIChTdXBwb3J0LkhlbHBlcnMuYm1jU3VwcG9ydExvYWRlZCgpICYmIHR5cGVvZiBibWNNZXRhLnN1cHBvcnQuYWxlcnRNZXNzYWdlcyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0bWVzc2FnZXMgPSBibWNNZXRhLnN1cHBvcnQuYWxlcnRNZXNzYWdlcztcblx0XHRcdH1cblxuXHRcdFx0aWYgKHR5cGVvZiBtZXNzYWdlc0hhbmRsZXIgPT09ICdmdW5jdGlvbicpIG1lc3NhZ2VzSGFuZGxlcihtZXNzYWdlcyk7XG5cdFx0fSxcblxuXHRcdC8vIGFsbG93cyBmb3IgYWpheGluZyBpbiBtZXNzYWdlIGRhdGFcblx0XHRsb2FkTWVzc2FnZXNGcm9tVXJsOiBmdW5jdGlvbihtZXNzYWdlc0hhbmRsZXIsIHVybCkge1xuXHRcdFx0JC5hamF4KHVybClcblx0XHRcdFx0LmRvbmUoZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRcdC8vIGJhc2VkIG9uIGV4YW1wbGUganNvbiwgYXNzdW1lIHJlc3BvbnNlIHBheWxvYWQgY29udGFpbnMgZGF0YSBvblxuXHRcdFx0XHRcdC8vIHByb3BlcnR5ICdzdXBwb3J0QWxlcnRNZXNzYWdlcydcblx0XHRcdFx0XHRpZiAodHlwZW9mIG1lc3NhZ2VzSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykgbWVzc2FnZXNIYW5kbGVyKGRhdGEuc3VwcG9ydEFsZXJ0TWVzc2FnZXMpO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQuZmFpbChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRpZiAodHlwZW9mIG1lc3NhZ2VzSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykgbWVzc2FnZXNIYW5kbGVyKG51bGwpO1xuXHRcdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0b3BlbkFsZXJ0OiBmdW5jdGlvbigpIHtcblx0XHRcdHRoaXMuZmFuY3lDb25maWcodGhpcy5tZXNzYWdlcyk7XG5cdFx0fSxcblxuXHRcdGFsZXJ0QnV0dG9uOiBmdW5jdGlvbigpIHtcblx0XHRcdHRoaXMudHJpZ2dlci5vbihcImNsaWNrXCIsICQucHJveHkodGhpcy5vcGVuQWxlcnQsIHRoaXMpKTtcblx0XHR9LFxuXG5cdFx0Y2hlY2tDb29raWVzOiBmdW5jdGlvbihvcHRpb25zKSB7XG5cdFx0XHQvLyBDaGVjayBpZiBjb29raWVzIG1hdGNoIElEc1xuXHRcdFx0dmFyIHNob3dBbGVydCA9IGZhbHNlO1xuXHRcdFx0Zm9yIChpID0gMDsgaSA8IGFsZXJ0TWVzc2FnZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0Ly8gSWYgbm8gY29va2llcyB0aGVuIHNob3cgYWxlcnRcblx0XHRcdFx0aWYgKCQuY29va2llKGFsZXJ0TWVzc2FnZXNbaV0uaWQpID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRzaG93QWxlcnQgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAoc2hvd0FsZXJ0KSB7XG5cdFx0XHRcdHRoaXMub3BlbkFsZXJ0KCk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdGZhbmN5Q29uZmlnOiBmdW5jdGlvbihvcHRpb25zKSB7XG5cdFx0XHQkLmZhbmN5Ym94KHRoaXMuZGlhbG9nLCB7XG5cdFx0XHRcdGF1dG9XaWR0aDogZmFsc2UsXG5cdFx0XHRcdG1pbkhlaWdodDogNDAwLFxuXHRcdFx0XHRtYXhXaWR0aDogNzQ1LFxuXHRcdFx0XHRwYWRkaW5nOiAwLFxuXHRcdFx0XHR0cGw6IHtcblx0XHRcdFx0XHR3cmFwOiAnPGRpdiBjbGFzcz1cImZhbmN5Ym94LXdyYXAgZmFuY3lib3gtZGlhbG9nXCIgdGFiSW5kZXg9XCItMVwiPjxkaXYgY2xhc3M9XCJmYW5jeWJveC1za2luXCI+PGRpdiBjbGFzcz1cImZhbmN5Ym94LW91dGVyXCI+PGRpdiBjbGFzcz1cImZhbmN5Ym94LXRpdGxlXCI+QWxlcnQgTm90aWZpY2F0aW9uczwvZGl2PjxkaXYgY2xhc3M9XCJmYW5jeWJveC1pbm5lclwiPjwvZGl2PjwvZGl2PjwvZGl2PjwvZGl2PicsXG5cdFx0XHRcdFx0ZXJyb3I6ICc8cCBjbGFzcz1cImZhbmN5Ym94LWVycm9yXCI+VGhlIHJlcXVlc3RlZCBjb250ZW50IGNhbm5vdCBiZSBsb2FkZWQuPGJyLz5QbGVhc2UgdHJ5IGFnYWluIGxhdGVyLjwvcD4nXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGhlbHBlcnM6IHtcblx0XHRcdFx0XHRvdmVybGF5OiB7XG5cdFx0XHRcdFx0XHRjbG9zZUNsaWNrOiB0cnVlLCAvLyBpZiB0cnVlLCBmYW5jeUJveCB3aWxsIGJlIGNsb3NlZCB3aGVuIHVzZXIgY2xpY2tzIG9uIHRoZSBvdmVybGF5XG5cdFx0XHRcdFx0XHRzcGVlZE91dDogMjAwLCAvLyBkdXJhdGlvbiBvZiBmYWRlT3V0IGFuaW1hdGlvblxuXHRcdFx0XHRcdFx0c2hvd0Vhcmx5OiB0cnVlLCAvLyBpbmRpY2F0ZXMgaWYgc2hvdWxkIGJlIG9wZW5lZCBpbW1lZGlhdGVseSBvciB3YWl0IHVudGlsIHRoZSBjb250ZW50IGlzIHJlYWR5XG5cdFx0XHRcdFx0XHRjc3M6IHt9LCAvLyBjdXN0b20gQ1NTIHByb3BlcnRpZXNcblx0XHRcdFx0XHRcdGxvY2tlZDogdHJ1ZSAvLyBpZiB0cnVlLCB0aGUgY29udGVudCB3aWxsIGJlIGxvY2tlZCBpbnRvIG92ZXJsYXlcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGJlZm9yZVNob3c6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdC8vIEFkZCBjb250YWluZXJzXG5cdFx0XHRcdFx0dGhpcy5jb250ZW50LmFwcGVuZChcIjxkaXYgY2xhc3M9J21lc3NhZ2VzJz48L2Rpdj48ZGl2IGNsYXNzPSdhY3Rpb24nPjwvZGl2PlwiKTtcblx0XHRcdFx0XHQvLyBBZGQgbWVzc2FnZXNcblx0XHRcdFx0XHR0aGlzLm1lc3NhZ2VzID0gdGhpcy5jb250ZW50LmZpbmQoXCIubWVzc2FnZXNcIik7XG5cdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGFsZXJ0TWVzc2FnZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdHRoaXMubWVzc2FnZXMuYXBwZW5kKFwiPGgzIGNsYXNzPSd0aXRsZSc+XCIgKyBhbGVydE1lc3NhZ2VzW2ldLnRpdGxlICsgXCI8L2gzPlwiKTtcblx0XHRcdFx0XHRcdHRoaXMubWVzc2FnZXMuYXBwZW5kKFwiPHAgY2xhc3M9J21lc3NhZ2UnPlwiICsgYWxlcnRNZXNzYWdlc1tpXS5tZXNzYWdlICsgXCI8L3A+XCIpO1xuXHRcdFx0XHRcdFx0aWYgKGFsZXJ0TWVzc2FnZXNbaV0ubGluaykge1xuXHRcdFx0XHRcdFx0XHR0aGlzLm1lc3NhZ2VzLmFwcGVuZCgnPHAgY2xhc3M9XCJsaW5rXCI+PGEgaHJlZj1cIicgKyBhbGVydE1lc3NhZ2VzW2ldLnVybCArICdcIj4nICsgYWxlcnRNZXNzYWdlc1tpXS5saW5rICsgJzwvYT48L3A+Jyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8vIEFkZCBtb2JpbGUgYnV0dG9uXG5cdFx0XHRcdFx0dGhpcy5tZXNzYWdlcy5hcHBlbmQoJzxwIHN0eWxlPVwidGV4dC1hbGlnbjpyaWdodFwiPjxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYWN0aW9uLWJ1dHRvblwiIHZhbHVlPVwiJyArIFN1cHBvcnQuQWxlcnRzLmNvbmZpcm1CdXR0b24gKyAnXCIvPjwvcD4nKTtcblx0XHRcdFx0XHQvLyBBZGQgY29udHJvbHNcblx0XHRcdFx0XHR0aGlzLmNvbnRlbnQuZmluZChcIi5hY3Rpb25cIikuYXBwZW5kKCc8aW5wdXQgdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGFjdGlvbi1idXR0b25cIiB2YWx1ZT1cIicgKyBTdXBwb3J0LkFsZXJ0cy5jb25maXJtQnV0dG9uICsgJ1wiLz48bGFiZWwgY2xhc3M9XCJhY3Rpb24tY2hlY2tib3hcIj48aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgLz4nICsgU3VwcG9ydC5BbGVydHMuY29uZmlybUNoZWNrYm94ICsgJzwvbGFiZWw+Jyk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGFmdGVyU2hvdzogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dmFyIGFsZXJ0QiA9IHRoaXMuY29udGVudC5maW5kKFwiLmFjdGlvbi1idXR0b25cIiksXG5cdFx0XHRcdFx0XHRhY3Rpb25CID0gdGhpcy5jb250ZW50LmZpbmQoXCIuYWN0aW9uIC5hY3Rpb24tYnV0dG9uXCIpLFxuXHRcdFx0XHRcdFx0YWxlcnRDID0gdGhpcy5jb250ZW50LmZpbmQoXCIuYWN0aW9uLWNoZWNrYm94IGlucHV0XCIpLFxuXHRcdFx0XHRcdFx0YWxlcnRYID0gJCgnLmZhbmN5Ym94LWRpYWxvZyAuZmFuY3lib3gtY2xvc2UnKTtcblx0XHRcdFx0XHRjbG9zZURpYWxvZyA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0Ly8gQ3JlYXRlIGNvb2tpZSBpZiBjaGVja2JveCBpcyBjaGVja2VkXG5cdFx0XHRcdFx0XHRpZiAoYWxlcnRDLmlzKCc6Y2hlY2tlZCcpKSB7XG5cdFx0XHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBhbGVydE1lc3NhZ2VzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0JC5jb29raWUoYWxlcnRNZXNzYWdlc1tpXS5pZCwgYWxlcnRNZXNzYWdlc1tpXS5pZCwge1xuXHRcdFx0XHRcdFx0XHRcdFx0ZXhwaXJlczogMzY1LFxuXHRcdFx0XHRcdFx0XHRcdFx0cGF0aDogXCIvXCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRkb21haW46IFwiLmJtYy5jb21cIlxuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQkLmZhbmN5Ym94LmNsb3NlKCk7XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHQvLyBDaGVjayBpZiB0ZXh0IG92ZXJmbG93cyBtZXNzYWdlIGNvbnRhaW5lclxuXHRcdFx0XHRcdGlmICh0aGlzLm1lc3NhZ2VzWzBdLnNjcm9sbEhlaWdodCA+IHRoaXMubWVzc2FnZXMuaW5uZXJIZWlnaHQoKSkge1xuXHRcdFx0XHRcdFx0YWN0aW9uQi5wcm9wKFwiZGlzYWJsZWRcIiwgdHJ1ZSk7XG5cdFx0XHRcdFx0XHR0aGlzLm1lc3NhZ2VzLmJpbmQoJ3Njcm9sbCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRpZiAoJCh0aGlzKVswXS5zY3JvbGxIZWlnaHQgLSAkKHRoaXMpLnNjcm9sbFRvcCgpIDw9ICQodGhpcykuaW5uZXJIZWlnaHQoKSkge1xuXHRcdFx0XHRcdFx0XHRcdGFjdGlvbkIucHJvcChcImRpc2FibGVkXCIsIGZhbHNlKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8vIENsb3NlIGRpYWxvZyB3aGVuIGJ1dHRvbnMgYXJlIGNsaWNrZWRcblx0XHRcdFx0XHRhbGVydEIub24oXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGNsb3NlRGlhbG9nKCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0YWxlcnRYLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRjbG9zZURpYWxvZygpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRhZnRlckNsb3NlOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQvLyBSZW1vdmUgZGlhbG9nIGNvbnRlbnRcblx0XHRcdFx0XHR0aGlzLmNvbnRlbnQuaHRtbChcIlwiKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9O1xuXG5cdFN1cHBvcnQuR2V0dGluZ1N0YXJ0ZWRDYXJvdXNlbCA9IHtcblx0XHRpbml0OiBmdW5jdGlvbigpIHtcblx0XHRcdCQoJy5zdXBwb3J0LWdldHRpbmctc3RhcnRlZC10b3BpY3MuY2Fyb3VzZWwgLnRvcGljcycpLm93bENhcm91c2VsKHtcblx0XHRcdFx0aXRlbXM6IDEsXG5cdFx0XHRcdG5hdjogZmFsc2Vcblx0XHRcdH0pO1xuXHRcdH1cblx0fTtcblxuXHRTdXBwb3J0LlRvZ2dsZVNlYXJjaEFyZWFzID0ge1xuXG5cdFx0c2VhcmNoQXJlYXNTZWxlY3RvcjogJy5qcy1zdXBwb3J0LXNlYXJjaC1hcmVhJyxcblx0XHR0b2dnbGVBY3Rpb25TZWxlY3RvcjogJy5qcy1zdXBwb3J0LXNlYXJjaC10b2dnbGUnLFxuXHRcdHRvZ2dsZUFjdGlvbkxhYmVsU2VsZWN0b3I6ICcuanMtc3VwcG9ydC1zZWFyY2gtdG9nZ2xlJyxcblx0XHR0b2dnbGVMYWJlbFRleHQ6IHtcblx0XHRcdGV4cGFuZDogJ01vcmUgUmVzb3VyY2VzJyxcblx0XHRcdGNvbGxhcHNlOiAnQ29sbGFwc2UnXG5cdFx0fSxcblx0XHR0b2dnbGFibGVBcmVhczogbnVsbCxcblx0XHRlbGVtZW50c1Nob3duOiBmYWxzZSxcblx0XHRoaWRlTGFzdFF0eTogNCxcblxuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xuXG5cdFx0XHQvLyBvbmx5IGluaXRpYWxpemUgaWYgLmpzLXN1cHBvcnQtc2VhcmNoLXRvZ2dsZS1leHRyYSBleGlzdHNcblx0XHRcdGlmICgkKCcuanMtc3VwcG9ydC1zZWFyY2gtdG9nZ2xlLWV4dHJhJykubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU0VUVVBcblx0XHRcdHRoaXMuZmluZFRvZ2dsYWJsZUVsZW1lbnRzKCk7XG5cdFx0XHR0aGlzLmFkZEhhbmRsZXJzKCk7XG5cblx0XHRcdC8vIElOSVRJQUwgQUNUSU9OU1xuXHRcdFx0dGhpcy5hY3Rpb25zLmhpZGUodGhpcy5oZWxwZXJzLmhpZGVFbGVtZW50c0luc3RhbnQpO1xuXHRcdFx0dGhpcy5hY3Rpb25zLnVwZGF0ZUxhYmVsKHRoaXMudG9nZ2xlTGFiZWxUZXh0LmV4cGFuZCk7XG5cdFx0fSxcblxuXHRcdGhlbHBlcnM6IHtcblx0XHRcdHNob3dFbGVtZW50c0ZhZGU6IGZ1bmN0aW9uKGVsZW1lbnRzKSB7XG5cdFx0XHRcdHJldHVybiAkKGVsZW1lbnRzKS5mYWRlSW4oKTtcblx0XHRcdH0sXG5cdFx0XHRzaG93RWxlbWVudHNJbnN0YW50OiBmdW5jdGlvbihlbGVtZW50cykge1xuXHRcdFx0XHRyZXR1cm4gJChlbGVtZW50cykuc2hvdygpO1xuXHRcdFx0fSxcblx0XHRcdGhpZGVFbGVtZW50c0ZhZGU6IGZ1bmN0aW9uKGVsZW1lbnRzKSB7XG5cdFx0XHRcdHJldHVybiAkKGVsZW1lbnRzKS5mYWRlT3V0KCk7XG5cdFx0XHR9LFxuXHRcdFx0aGlkZUVsZW1lbnRzSW5zdGFudDogZnVuY3Rpb24oZWxlbWVudHMpIHtcblx0XHRcdFx0cmV0dXJuICQoZWxlbWVudHMpLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0ZmluZFRvZ2dsYWJsZUVsZW1lbnRzOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBzZWFyY2hBcmVhcyA9ICQodGhpcy5zZWFyY2hBcmVhc1NlbGVjdG9yKTtcblx0XHRcdHZhciBzbGljZUZyb20gPSBzZWFyY2hBcmVhcy5sZW5ndGggLSB0aGlzLmhpZGVMYXN0UXR5O1xuXHRcdFx0dmFyIHNsaWNlVG8gPSBzZWFyY2hBcmVhcy5sZW5ndGg7XG5cdFx0XHR0aGlzLnRvZ2dsYWJsZUFyZWFzID0gc2VhcmNoQXJlYXMuc2xpY2Uoc2xpY2VGcm9tLCBzbGljZVRvKTtcblx0XHR9LFxuXG5cdFx0YWN0aW9uczoge1xuXHRcdFx0dG9nZ2xlOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKFN1cHBvcnQuVG9nZ2xlU2VhcmNoQXJlYXMuZWxlbWVudHNTaG93bikge1xuXHRcdFx0XHRcdHRoaXMuaGlkZShTdXBwb3J0LlRvZ2dsZVNlYXJjaEFyZWFzLmhlbHBlcnMuaGlkZUVsZW1lbnRzRmFkZSk7XG5cdFx0XHRcdFx0dGhpcy51cGRhdGVMYWJlbChTdXBwb3J0LlRvZ2dsZVNlYXJjaEFyZWFzLnRvZ2dsZUxhYmVsVGV4dC5leHBhbmQpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuc2hvdyhTdXBwb3J0LlRvZ2dsZVNlYXJjaEFyZWFzLmhlbHBlcnMuc2hvd0VsZW1lbnRzRmFkZSk7XG5cdFx0XHRcdFx0dGhpcy51cGRhdGVMYWJlbChTdXBwb3J0LlRvZ2dsZVNlYXJjaEFyZWFzLnRvZ2dsZUxhYmVsVGV4dC5jb2xsYXBzZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRzaG93OiBmdW5jdGlvbihlbGVtZW50c0hhbmRsZXIpIHtcblx0XHRcdFx0aWYgKHR5cGVvZiBlbGVtZW50c0hhbmRsZXIgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRlbGVtZW50c0hhbmRsZXIoJChTdXBwb3J0LlRvZ2dsZVNlYXJjaEFyZWFzLnRvZ2dsYWJsZUFyZWFzKSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRTdXBwb3J0LlRvZ2dsZVNlYXJjaEFyZWFzLmVsZW1lbnRzU2hvd24gPSB0cnVlO1xuXHRcdFx0fSxcblx0XHRcdGhpZGU6IGZ1bmN0aW9uKGVsZW1lbnRzSGFuZGxlcikge1xuXHRcdFx0XHRpZiAodHlwZW9mIGVsZW1lbnRzSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdGVsZW1lbnRzSGFuZGxlcigkKFN1cHBvcnQuVG9nZ2xlU2VhcmNoQXJlYXMudG9nZ2xhYmxlQXJlYXMpKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdFN1cHBvcnQuVG9nZ2xlU2VhcmNoQXJlYXMuZWxlbWVudHNTaG93biA9IGZhbHNlO1xuXHRcdFx0fSxcblx0XHRcdHVwZGF0ZUxhYmVsOiBmdW5jdGlvbih0ZXh0KSB7XG5cdFx0XHRcdCQoU3VwcG9ydC5Ub2dnbGVTZWFyY2hBcmVhcy50b2dnbGVBY3Rpb25MYWJlbFNlbGVjdG9yKS5odG1sKHRleHQpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblxuXHRcdGFkZEhhbmRsZXJzOiBmdW5jdGlvbigpIHtcblx0XHRcdCQodGhpcy50b2dnbGVBY3Rpb25TZWxlY3Rvcikub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHRoaXMuYWN0aW9ucy50b2dnbGUoKTtcblx0XHRcdH0uYmluZCh0aGlzKSk7XG5cdFx0fVxuXHR9O1xuXG5cdFN1cHBvcnQuTWVudSA9IHtcblxuXHRcdGRlc2t0b3BCcmVha3BvaW50OiA5NjAsXG5cblx0XHQvLyB0b3VjaEhhbmRsZXJzIHJlcXVpcmUgYSBgY2xpY2tgIHRvIHRyaWdnZXIgYSBtZW51XG5cdFx0dG91Y2hIYW5kbGVyczogZnVuY3Rpb24oYWRhcHRlcikge1xuXHRcdFx0dmFyIG1lbnUgPSBhZGFwdGVyLm1lbnU7XG5cdFx0XHQkKG1lbnUuc3ViTWVudVRyaWdnZXJTZWxlY3Rvcikub24oe1xuXHRcdFx0XHQnY2xpY2snOiBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdFx0aWYgKCEkKG1lbnUuc3ViTWVudVNlbGVjdG9yKS5oYXMoJChlLnRhcmdldCkpKSB7XG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHZhciBzdWJNZW51ID0gbWVudS5maW5kTWVudUZyb21UYXJnZXQoZS50YXJnZXQpO1xuXG5cdFx0XHRcdFx0aWYgKHN1Yk1lbnUuaGFzQ2xhc3MobWVudS5leHBhbmRlZENsYXNzKSkge1xuXHRcdFx0XHRcdFx0bWVudS5jb2xsYXBzZU1lbnUoc3ViTWVudSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG1lbnUuY29sbGFwc2VBbGxTdWJNZW51cygpO1xuXHRcdFx0XHRcdFx0bWVudS5leHBhbmRNZW51KHN1Yk1lbnUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdC8vICBub1RvdWNoSGFuZGxlcnMgYXNzdW1lcyBhIG1vdXNlLCBhbmQgdXNlcyBhIGBob3ZlcmAgdG8gdHJpZ2dlciBhIG1lbnVcblx0XHRub1RvdWNoSGFuZGxlcnM6IGZ1bmN0aW9uKGFkYXB0ZXIpIHtcblx0XHRcdHZhciBtZW51ID0gYWRhcHRlci5tZW51O1xuXHRcdFx0JChtZW51LnN1Yk1lbnVUcmlnZ2VyU2VsZWN0b3IpLm9uKHtcblx0XHRcdFx0J21vdXNlZW50ZXInOiBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdFx0bWVudS5jb2xsYXBzZUFsbFN1Yk1lbnVzKCk7XG5cdFx0XHRcdFx0dmFyIHN1Yk1lbnUgPSBtZW51LmZpbmRNZW51RnJvbVRhcmdldChlLnRhcmdldCk7XG5cdFx0XHRcdFx0bWVudS5leHBhbmRNZW51KHN1Yk1lbnUpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHQnbW91c2VsZWF2ZSc6IGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0XHRtZW51LmNvbGxhcHNlQWxsU3ViTWVudXMoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdC8vIFJlZ2lzdGVyIGNsaWNrcyB0aGF0IGhhcHBlbiBvdXRzaWRlIHRoZSBtZW51LCBhbmQgZGlzbWlzcyB0aGUgbWVudVxuXHRcdGNvbGxhcHNlT3V0c2lkZUhhbmRsZXI6IGZ1bmN0aW9uKGFkYXB0ZXIpIHtcblx0XHRcdHZhciBtZW51ID0gYWRhcHRlci5tZW51O1xuXHRcdFx0dmFyIG1lbnVFbGVtZW50ID0gJChtZW51Lm1lbnVFbGVtZW50KTtcblxuXHRcdFx0JCgnYm9keScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0aWYgKCEkKGUudGFyZ2V0KS5wYXJlbnRzKCkuYWRkQmFjaygpLmlzKG1lbnVFbGVtZW50KSkge1xuXHRcdFx0XHRcdG1lbnUuY29sbGFwc2VBbGxTdWJNZW51cygpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0Ly8gYm90aCBgdG91Y2hIYW5kbGVyc2AgYW5kIGBub1RvdWNoSGFuZGxlcnNgIHVzZSB0aGUgc2FtZVxuXHRcdC8vIGVsZW1lbnQgdG8gYXR0YWNoIGhhbmRsZXJzIHRvLCB0aGVyZWZvcmUgY2FuIHVzZSB0aGUgc2FtZVxuXHRcdC8vIGZ1bmN0aW9uIHRvIHJlbW92ZSB0aGUgaGFuZGxlcnNcblx0XHRkZXN0b3J5SGFuZGxlcnM6IGZ1bmN0aW9uKGFkYXB0ZXIpIHtcblx0XHRcdHZhciBtZW51ID0gYWRhcHRlci5tZW51O1xuXHRcdFx0JChtZW51LnN1Yk1lbnVUcmlnZ2VyU2VsZWN0b3IpLm9mZigpO1xuXHRcdH0sXG5cblx0XHRnZXRNZW51OiBmdW5jdGlvbigpIHtcblx0XHRcdC8vIGdlbmVyYXRlIG1lbnUgYmFzZWQgb24gc2VsZWN0b3Jcblx0XHRcdHZhciBtZW51ID0gbWVudWpzLmdlbmVyYXRlTWVudSh7XG5cdFx0XHRcdG1lbnVFbGVtZW50OiAkKCcuc3VwcG9ydC1tZW51Jylcblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gbWVudTtcblx0XHR9LFxuXG5cdFx0Z2V0QWRhcHRlcnM6IGZ1bmN0aW9uKG1lbnUpIHtcblx0XHRcdHZhciBzdXBwb3J0TWVudSA9IHRoaXM7XG5cblx0XHRcdC8vIGNyZWF0ZSBkZXNrdG9wIGFkYXB0ZXJcblx0XHRcdHZhciBkZXNrdG9wQWRhcHRlciA9IG1lbnVBZGFwdGVyLmdlbmVyYXRlTWVudUFkYXB0ZXIobWVudSwge1xuXHRcdFx0XHRoYW5kbGVyczogW3tcblx0XHRcdFx0XHRzZXR1cDogc3VwcG9ydE1lbnUudG91Y2hIYW5kbGVycyxcblx0XHRcdFx0XHRkZXN0cm95OiBzdXBwb3J0TWVudS5kZXN0b3J5SGFuZGxlcnNcblx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdHNldHVwOiBzdXBwb3J0TWVudS5jb2xsYXBzZU91dHNpZGVIYW5kbGVyLFxuXHRcdFx0XHRcdGRlc3Ryb3k6IHN1cHBvcnRNZW51LmRlc3RvcnlIYW5kbGVyc1xuXHRcdFx0XHR9XSxcblx0XHRcdFx0aW5pdDogZnVuY3Rpb24oYWRhcHRlcikge1xuXHRcdFx0XHRcdCQoYWRhcHRlci5tZW51Lm1lbnVFbGVtZW50KS5hZGRDbGFzcygnZGVza3RvcCcpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR0ZWFyZG93bjogZnVuY3Rpb24oYWRhcHRlcikge1xuXHRcdFx0XHRcdCQoYWRhcHRlci5tZW51Lm1lbnVFbGVtZW50KS5yZW1vdmVDbGFzcygnZGVza3RvcCcpO1xuXHRcdFx0XHRcdGFkYXB0ZXIubWVudS5jb2xsYXBzZUFsbFN1Yk1lbnVzKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBjcmVhdGUgbW9iaWxlIGFkYXB0ZXJcblx0XHRcdC8vIG1vYmlsZUFkYXB0ZXIgc3RhcnRpbmcgcG9pbnQgaXMgYSBjb3B5IG9mIGRlc2t0b3AgYWRhcHRlclxuXHRcdFx0dmFyIG1vYmlsZUFkYXB0ZXIgPSBtZW51QWRhcHRlci5nZW5lcmF0ZU1lbnVBZGFwdGVyKG1lbnUsIHtcblx0XHRcdFx0aGFuZGxlcnM6IFt7XG5cdFx0XHRcdFx0c2V0dXA6IHN1cHBvcnRNZW51LnRvdWNoSGFuZGxlcnMsXG5cdFx0XHRcdFx0ZGVzdHJveTogZnVuY3Rpb24oYWRhcHRlcikge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHN1cHBvcnRNZW51LmRlc3RvcnlIYW5kbGVycyhhZGFwdGVyKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1dLCAvLyBhc3N1bWUgbm8gaG92ZXIgaW50ZXJhY3Rpb25zXG5cdFx0XHRcdGluaXQ6IGZ1bmN0aW9uKGFkYXB0ZXIpIHtcblx0XHRcdFx0XHQkKGFkYXB0ZXIubWVudS5tZW51RWxlbWVudCkuYWRkQ2xhc3MoJ21vYmlsZScpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR0ZWFyZG93bjogZnVuY3Rpb24oYWRhcHRlcikge1xuXHRcdFx0XHRcdCQoYWRhcHRlci5tZW51Lm1lbnVFbGVtZW50KS5yZW1vdmVDbGFzcygnbW9iaWxlJyk7XG5cdFx0XHRcdFx0YWRhcHRlci5tZW51LmNvbGxhcHNlQWxsU3ViTWVudXMoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdHZhciBhbGxBZGFwdGVycyA9IHtcblx0XHRcdFx0bW9iaWxlOiBtb2JpbGVBZGFwdGVyLFxuXHRcdFx0XHRkZXNrdG9wOiBkZXNrdG9wQWRhcHRlclxuXHRcdFx0fTtcblx0XHRcdHJldHVybiBhbGxBZGFwdGVycztcblx0XHR9LFxuXG5cdFx0Z2V0QWRhcHRlck1hbmFnZXI6IGZ1bmN0aW9uKG1lbnUsIGFkYXB0ZXJzKSB7XG5cdFx0XHR2YXIgYWRhcHRlck1hbmFnZXIgPSBnZW5lcmF0ZU1lbnVBZGFwdGVyTWFuYWdlcigpO1xuXHRcdFx0cmV0dXJuIGFkYXB0ZXJNYW5hZ2VyO1xuXHRcdH0sXG5cblx0XHRpbml0OiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBtZW51ID0gdGhpcy5nZXRNZW51KCk7XG5cdFx0XHR2YXIgYWRhcHRlcnMgPSB0aGlzLmdldEFkYXB0ZXJzKG1lbnUpO1xuXHRcdFx0dmFyIGFkYXB0ZXJNYW5hZ2VyID0gdGhpcy5nZXRBZGFwdGVyTWFuYWdlcihtZW51LCBhZGFwdGVycyk7XG5cblx0XHRcdHZhciBpc0Rlc2t0b3AgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0Ly8gaW4gY2FzZSBtZWRpYSBxdWVyaWVzIGFyZW4ndCBzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIsIHRoZW4gZGVmYXVsdCB0byB1c2luZyB0aGUgd2lkdGggb2YgdGhlIHdpbmRvd1xuXHRcdFx0XHRyZXR1cm4gTW9kZXJuaXpyLm1xKCcobWluLXdpZHRoOiAnICsgU3VwcG9ydC5NZW51LmRlc2t0b3BCcmVha3BvaW50ICsgJ3B4KScpIHx8ICQod2luZG93KS53aWR0aCgpID49IFN1cHBvcnQuTWVudS5kZXNrdG9wQnJlYWtwb2ludDtcblx0XHRcdH07XG5cdFx0XHR2YXIgaXNNb2JpbGUgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuICFpc0Rlc2t0b3AoKTtcblx0XHRcdH07XG5cblx0XHRcdC8vIEFkZCBhZGFwdGVyIGZvciB2YXJpb3VzIGNvbmRpdGlvbnMsIG9uIHRoZSBhZGFwdGVyIG1hbmFnZXJcblx0XHRcdGFkYXB0ZXJNYW5hZ2VyLmFkZENvbmRpdGlvbihmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIGlzRGVza3RvcCgpO1xuXHRcdFx0fSwgYWRhcHRlcnMuZGVza3RvcCk7XG5cblx0XHRcdGFkYXB0ZXJNYW5hZ2VyLmFkZENvbmRpdGlvbihmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIGlzTW9iaWxlKCk7XG5cdFx0XHR9LCBhZGFwdGVycy5tb2JpbGUpO1xuXG5cdFx0XHRhZGFwdGVyTWFuYWdlci5pbml0KCk7XG5cdFx0fVxuXHR9O1xuXG5cdFN1cHBvcnQuTW9iaWxlVG9nZ2xlSGVhZGVyID0ge1xuXG5cdFx0YmFzZUhlaWdodDogbnVsbCxcblx0XHRtYXhIZWlnaHQ6IDE1MDAsXG5cdFx0YnJlYWtwb2ludFRvZ2dsZTogOTYwLFxuXG5cdFx0YWN0aW9uczoge1xuXHRcdFx0b3BlbjogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQoJy5zdXBwb3J0LWhlYWRlcicpLmFkZENsYXNzKCdleHBhbmRlZCcpO1xuXHRcdFx0XHQkKCcuc3VwcG9ydC1oZWFkZXInKS5jc3MoJ21heC1oZWlnaHQnLCAnMTIwMHB4Jyk7XG5cdFx0XHR9LFxuXHRcdFx0Y2xvc2U6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR0aGlzLnNldEhlaWdodEFzQmFzZUhlaWdodCgpO1xuXHRcdFx0fSxcblx0XHRcdHNldEhlaWdodEFzQmFzZUhlaWdodDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQoJy5zdXBwb3J0LWhlYWRlcicpLmNzcygnbWF4LWhlaWdodCcsIFN1cHBvcnQuTW9iaWxlVG9nZ2xlSGVhZGVyLmJhc2VIZWlnaHQgKyAncHgnKTtcblxuXHRcdFx0XHQvLyBieSBkZWZhdWx0IG90aGVyIGJyb3dzZXJzIHdpbGwgdHJpZ2dlciBjbG9zZSBvbiBhZGRIYW5kbGVycyBhdCB0aGUgZW5kIG9mIHRoZSBjc3MgdHJhbnNpdGlvblxuXHRcdFx0XHQvLyBpZTggd2lsbCBuZXZlciB0cmlnZ2VyIHRoZSBlbmQgY3NzIHRyYW5zaXRpb24gZXZlbnQgYXMgaXQgZG9lc24ndCBzdXBwb3J0IHRyYW5zaXRpb25zXG5cdFx0XHRcdGlmICgkKCdodG1sJykuaGFzQ2xhc3MoJ29sZGllJykpIHtcblx0XHRcdFx0XHQkKCcuc3VwcG9ydC1oZWFkZXInKS50cmlnZ2VyKCd0cmFuc2l0aW9uZW5kJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRhcHBseUlmTW9iaWxlOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0Ly8gaWYgZGVza3RvcCwgcmVtb3ZlIG1heC1oZWlnaHQgYW5kIGV4cGFuZGVkIGNsYXNzXG5cdFx0XHRcdC8vIGluIGNhc2UgbWVkaWEgcXVlcmllcyBhcmVuJ3Qgc3VwcG9ydGVkIGJ5IHRoZSBicm93c2VyLCB0aGVuIGRlZmF1bHQgdG8gdXNpbmcgdGhlIHdpZHRoIG9mIHRoZSB3aW5kb3dcblx0XHRcdFx0dmFyIGlzRGVza3RvcCA9IE1vZGVybml6ci5tcSgnKG1pbi13aWR0aDogJyArIFN1cHBvcnQuTW9iaWxlVG9nZ2xlSGVhZGVyLmJyZWFrcG9pbnRUb2dnbGUgKyAncHgpJykgfHwgJCh3aW5kb3cpLndpZHRoKCkgPj0gU3VwcG9ydC5NZW51LmRlc2t0b3BCcmVha3BvaW50O1xuXHRcdFx0XHRpZiAoaXNEZXNrdG9wKSB7XG5cdFx0XHRcdFx0JCgnLnN1cHBvcnQtaGVhZGVyJykuY3NzKCdtYXgtaGVpZ2h0JywgJycpO1xuXHRcdFx0XHRcdCQoJy5zdXBwb3J0LWhlYWRlcicpLnJlbW92ZUNsYXNzKCdleHBhbmRlZCcpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmICgkKCcuc3VwcG9ydC1oZWFkZXInKS5oYXNDbGFzcygnZXhwYW5kZWQnKSkge1xuXHRcdFx0XHRcdFx0dGhpcy5vcGVuKCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRoaXMuY2xvc2UoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0Y2FsY0Jhc2VIZWlnaHQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gaWYgdGhlIGhlaWdodCBzaG91bGQgYmUgZGV0ZXJtaW5lZCBkeW5hbWljYWxseVxuXHRcdFx0Ly8gdGhpcy5iYXNlSGVpZ2h0ID0gJCgnLmxvZ28tYmFyLWNvbnRhaW5lcicpLmhlaWdodCgpO1xuXG5cdFx0XHR0aGlzLmJhc2VIZWlnaHQgPSA5MDtcblx0XHR9LFxuXG5cdFx0YWRkSGFuZGxlcnM6IGZ1bmN0aW9uKCkge1xuXG5cdFx0XHQkKCcuanMtdG9nZ2xlLW9wZW4taGVhZGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmICgkKCcuc3VwcG9ydC1oZWFkZXInKS5oYXNDbGFzcygnZXhwYW5kZWQnKSkge1xuXHRcdFx0XHRcdFN1cHBvcnQuTW9iaWxlVG9nZ2xlSGVhZGVyLmFjdGlvbnMuY2xvc2UoKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRTdXBwb3J0Lk1vYmlsZVRvZ2dsZUhlYWRlci5hY3Rpb25zLm9wZW4oKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdCQoJy5zdXBwb3J0LWhlYWRlcicpLm9uKCd0cmFuc2l0aW9uZW5kIHdlYmtpdFRyYW5zaXRpb25FbmQgb1RyYW5zaXRpb25FbmQgTVNUcmFuc2l0aW9uRW5kJywgZnVuY3Rpb24oKSB7XG5cblx0XHRcdFx0Ly8gdHJhbnNpdGlvbiBoYXMgZW5kZWQgYW5kIGF0IGVuZCBoZWlnaHQgcG9zaXRpb25cblx0XHRcdFx0aWYgKCQoJy5zdXBwb3J0LWhlYWRlcicpLmhlaWdodCgpID09PSBTdXBwb3J0Lk1vYmlsZVRvZ2dsZUhlYWRlci5iYXNlSGVpZ2h0IHx8ICQoJ2h0bWwnKS5oYXNDbGFzcygnb2xkaWUnKSkge1xuXHRcdFx0XHRcdCQoJy5zdXBwb3J0LWhlYWRlcicpLnJlbW92ZUNsYXNzKCdleHBhbmRlZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0JCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdFN1cHBvcnQuTW9iaWxlVG9nZ2xlSGVhZGVyLmFjdGlvbnMuYXBwbHlJZk1vYmlsZSgpO1xuXHRcdFx0fSk7XG5cblx0XHR9LFxuXG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHR3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0c2VsZi5jYWxjQmFzZUhlaWdodCgpO1xuXHRcdFx0XHRzZWxmLmFkZEhhbmRsZXJzKCk7XG5cdFx0XHRcdHNlbGYuYWN0aW9ucy5hcHBseUlmTW9iaWxlKCk7XG5cdFx0XHR9LCAwKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gdXNlZCB0byBhdHRhY2ggdGhlIGNsYXNzIG9uIGxvYWQgdG8gdHJhbnNpdGlvbiB0aGUgZml4ZWQgc2lkZSBpbnRvIHZpZXdcblx0U3VwcG9ydC5TbGlkZUluU3VwcG9ydENoYXRCdXR0b24gPSB7XG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgJGNoYXROb3cgPSAkKCcuc3VwcG9ydC1jaGF0LW5vdywgLmNoYXQtbm93LWxpbmsnKTtcblx0XHRcdGlmICgkY2hhdE5vdy5sZW5ndGgpIHtcblx0XHRcdFx0JGNoYXROb3cuYWRkQ2xhc3MoJ29uLXNjcmVlbicpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIGluaXQgZWFjaCBzdXBwb3J0IGZlYXR1cmVcblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRTdXBwb3J0LkF1dGhlbnRpY2F0ZWRCbG9ja3MuaW5pdCgpO1xuXHRcdFN1cHBvcnQuR2V0dGluZ1N0YXJ0ZWRDYXJvdXNlbC5pbml0KCk7XG5cdFx0U3VwcG9ydC5Db250cm9scy5pbml0KCk7XG5cdFx0U3VwcG9ydC5BbGVydHMuaW5pdCgpO1xuXHRcdFN1cHBvcnQuVG9nZ2xlU2VhcmNoQXJlYXMuaW5pdCgpO1xuXHRcdFN1cHBvcnQuTWVudS5pbml0KCk7XG5cdFx0U3VwcG9ydC5Nb2JpbGVUb2dnbGVIZWFkZXIuaW5pdCgpO1xuXHRcdFN1cHBvcnQuU2xpZGVJblN1cHBvcnRDaGF0QnV0dG9uLmluaXQoKTtcblx0fVxuXG5cdCQoaW5pdCk7XG5cbn0oalF1ZXJ5KSk7XG4iLCJ2YXIgZ2VuZXJhdGVNZW51QWRhcHRlciA9IChmdW5jdGlvbigpIHtcblxuXHR2YXIgYWRhcHRlckFQSSA9IHtcblxuXHRcdGxhYmVsOiAnJyxcblx0XHRtZW51OiBudWxsLFxuXHRcdGludGVyZmFjZTogJ3RvdWNoJywgLy8gYXNzdW1lIGEgdG91Y2ggaW50ZXJmYWNlIGJ5IGRlZmF1bHQsIG1vYmlsZS1maXJzdFxuXHRcdGhhbmRsZXJzOiBbXSxcblxuXHRcdHNldHVwSGFuZGxlcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGFkYXB0ZXIgPSB0aGlzO1xuXHRcdFx0JC5lYWNoKHRoaXMuaGFuZGxlcnMsIGZ1bmN0aW9uKGksIGhhbmRsZXIpe1xuXHRcdFx0XHRoYW5kbGVyLnNldHVwKGFkYXB0ZXIpO1xuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHRkZXN0cm95SGFuZGxlcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGFkYXB0ZXIgPSB0aGlzO1xuXHRcdFx0JC5lYWNoKHRoaXMuaGFuZGxlcnMsIGZ1bmN0aW9uKGksIGhhbmRsZXIpe1xuXHRcdFx0XHRoYW5kbGVyLmRlc3Ryb3koYWRhcHRlcik7XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0dGVhcmRvd246IGZ1bmN0aW9uKGFkYXB0ZXIpIHt9LFxuXHRcdGluaXQ6IGZ1bmN0aW9uKGFkYXB0ZXIpIHt9XG5cdH07XG5cblx0cmV0dXJuIGZ1bmN0aW9uKG1lbnUsIG9wdGlvbnMpIHtcblxuXHRcdHZhciBhZGFwdGVyID0gJC5leHRlbmQoe30sIGFkYXB0ZXJBUEksIG9wdGlvbnMsIHtcblxuXHRcdFx0bWVudTogbWVudSxcblxuXHRcdFx0aW5pdDogZnVuY3Rpb24oaW50ZXJmYWNlKSB7XG5cblx0XHRcdFx0bWVudS5pbml0KCk7XG5cblx0XHRcdFx0dGhpcy5pbnRlcmZhY2UgPSBpbnRlcmZhY2U7XG5cdFx0XHRcdHRoaXMuc2V0dXBIYW5kbGVycygpO1xuXG5cdFx0XHRcdC8vIGZpbmlzaCB3aXRoIGV4ZWN1dGluZyB0aGUgb3B0aW9ucyBwYXNzZWQgaW5cblx0XHRcdFx0aWYgKHR5cGVvZiBvcHRpb25zLmluaXQgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRvcHRpb25zLmluaXQodGhpcyk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdHRlYXJkb3duOiBmdW5jdGlvbigpIHtcblxuXHRcdFx0XHR0aGlzLmRlc3Ryb3lIYW5kbGVycygpO1xuXG5cdFx0XHRcdGlmICh0eXBlb2Ygb3B0aW9ucy50ZWFyZG93biA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdG9wdGlvbnMudGVhcmRvd24odGhpcyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHJldHVybiBhZGFwdGVyO1xuXG5cdH07XG5cbn0pKCk7XG5cbmV4cG9ydHMuZ2VuZXJhdGVNZW51QWRhcHRlciA9IGdlbmVyYXRlTWVudUFkYXB0ZXI7XG4iLCJ2YXIgZ2VuZXJhdGVNZW51ID0gKGZ1bmN0aW9uKCkge1xuXG5cdHZhciBtZW51RGVmYXVsdCA9IHtcblxuXHQgIG1lbnVFbGVtZW50OiAkKCcubWVudScpLFxuXHQgIHN1Yk1lbnVTZWxlY3RvcjogJy5zdWItbWVudScsXG5cdCAgZXhwYW5kZWRDbGFzczogJ2V4cGFuZGVkJyxcblx0ICBzdWJNZW51VHJpZ2dlclNlbGVjdG9yOiAnLmpzLXNob3ctc3ViLXRyaWdnZXInLFxuXG5cdCAgZXhwYW5kTWVudTogZnVuY3Rpb24oc3ViTWVudUVsZW1lbnQpIHtcblx0XHQkKHN1Yk1lbnVFbGVtZW50KS5hZGRDbGFzcyh0aGlzLmV4cGFuZGVkQ2xhc3MpO1xuXHQgIH0sXG5cblx0ICBjb2xsYXBzZU1lbnU6IGZ1bmN0aW9uKHN1Yk1lbnVFbGVtZW50KSB7XG5cdFx0JChzdWJNZW51RWxlbWVudCkucmVtb3ZlQ2xhc3ModGhpcy5leHBhbmRlZENsYXNzKTtcblx0ICB9LFxuXG5cdCAgY29sbGFwc2VBbGxTdWJNZW51czogZnVuY3Rpb24oKSB7XG5cdCAgXHR2YXIgbWVudSA9IHRoaXM7XG5cdFx0dGhpcy5tZW51RWxlbWVudC5maW5kKHRoaXMuc3ViTWVudVNlbGVjdG9yKS5lYWNoKGZ1bmN0aW9uKGksIGUpe1xuXHRcdCAgbWVudS5jb2xsYXBzZU1lbnUoZSk7XG5cdFx0fSk7XG5cdCAgfSxcblxuXHQgIGZpbmRNZW51RnJvbVRhcmdldDogZnVuY3Rpb24odGFyZ2V0KSB7XG5cdFx0dmFyIHRyaWdnZXIgPSAkKHRhcmdldCkucGFyZW50KHRoaXMuc3ViTWVudVRyaWdnZXJTZWxlY3RvcikuYWRkQmFjayh0aGlzLnN1Yk1lbnVUcmlnZ2VyU2VsZWN0b3IpO1xuXHRcdHZhciBtZW51ID0gdHJpZ2dlci5maW5kKHRoaXMuc3ViTWVudVNlbGVjdG9yKTtcblx0XHRyZXR1cm4gbWVudTtcblx0ICB9LFxuXG5cdCAgaW5pdDogZnVuY3Rpb24oKSB7fVxuXHR9O1xuXG5cdHJldHVybiBmdW5jdGlvbihvcHRpb25zKSB7XG5cdCAgcmV0dXJuICQuZXh0ZW5kKHt9LCBtZW51RGVmYXVsdCwgb3B0aW9ucyk7XG5cdH07XG59KSgpO1xuXG5leHBvcnRzLmdlbmVyYXRlTWVudSA9ICBnZW5lcmF0ZU1lbnU7XG4iXX0=
