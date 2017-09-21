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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL3N1cHBvcnQuanMiLCJqcy9tb2R1bGVzL21lbnUtYWRhcHRlci5qcyIsImpzL21vZHVsZXMvbWVudS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdmlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBtZW51anMgPSByZXF1aXJlKCcuL21lbnUnKTtcclxudmFyIG1lbnVBZGFwdGVyID0gcmVxdWlyZSgnLi9tZW51LWFkYXB0ZXInKTtcclxuXHJcbnZhciBTdXBwb3J0ID0gU3VwcG9ydCB8fCB7fTtcclxuXHJcbihmdW5jdGlvbigkKSB7XHJcblxyXG5cdHZhciBzdXBwb3J0RW52LFxyXG5cdFx0c3VwcG9ydFBhdGgsXHJcblx0XHRhbGVydE1lc3NhZ2VzLFxyXG5cdFx0aXNzdWVzQ29udGFpbmVyID0gJCgnLmpzLWlzc3Vlcy1jb250YWluZXInKSxcclxuXHRcdGNvbnRyYWN0U2VsZWN0b3IgPSAkKCcuanMtY29udHJhY3RzLXNlbGVjdCcpLFxyXG5cdFx0Y29udHJhY3REZXRhaWxzID0gJCgnLmFjdGlvbi1kZXRhaWwtZ3JvdXAnKSxcclxuXHRcdGFjY291bnREZXRhaWxzID0gJCgnLmFjdGlvbi1kZXRhaWxzJyksXHJcblx0XHRhY2NvdW50RXJyb3IgPSAkKCcuanMtYWNjb3VudC1lcnJvcicpLFxyXG5cdFx0YWxlcnRzQnV0dG9uQ29udGFpbmVyID0gJCgnYS5hbGVydHMuanMtZmFuY3lEaWFsb2cnKS5wYXJlbnQoJ2xpLmFjdGlvbicpO1xyXG5cclxuXHRTdXBwb3J0LkhlbHBlcnMgPSB7XHJcblxyXG5cdFx0Ly8gQ2hlY2sgaWYgdGhlIGJtY01ldGEgYW5kIGJtY01ldGEuc3VwcG9ydCBleGlzdFxyXG5cdFx0Ly8gVXNlZCB0byBhc3N1bWUgb3RoZXIgZnVuY3Rpb25hbGl0eSBiYXNlZCBvbiB0aGUgZXhpc3RhbmNlIG9mIHRoaXMgaW5pdGlhbCBiYXNlIHNldHVwXHJcblx0XHRibWNTdXBwb3J0TG9hZGVkOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0aWYgKHR5cGVvZiBibWNNZXRhICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgYm1jTWV0YS5zdXBwb3J0ICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gQ2hlY2sgdG8gc2VlIGlmIGVuYWJsZUFsZXJ0cyBpcyB0cnVlXHJcblx0XHRibWNBbGVydHNFbmFibGVkOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0aWYgKHR5cGVvZiBibWNNZXRhLnN1cHBvcnQuZW5hYmxlQWxlcnRzICE9PSAndW5kZWZpbmVkJyAmJiBibWNNZXRhLnN1cHBvcnQuZW5hYmxlQWxlcnRzID09IHRydWUpIHtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRTdXBwb3J0LkhlbHBlcnMuaGlkZUFsZXJ0c0J1dHRvbigpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH0sXHJcblxyXG5cdFx0aGlkZUFsZXJ0c0J1dHRvbjogZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQoYWxlcnRzQnV0dG9uQ29udGFpbmVyKS5oaWRlKCk7XHJcblx0XHR9LFxyXG5cdFx0c2hvd0FsZXJ0c0J1dHRvbjogZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQoYWxlcnRzQnV0dG9uQ29udGFpbmVyKS5zaG93KCk7XHJcblx0XHR9LFxyXG5cclxuXHRcdGlzQXV0aGVudGljYXRlZDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJldHVybiB0eXBlb2YgYm1jTWV0YSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgYm1jTWV0YS51c2VyICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBibWNNZXRhLnVzZXIuaXNTdXBwb3J0QXV0aGVudGljYXRlZCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBibWNNZXRhLnVzZXIuaXNTdXBwb3J0QXV0aGVudGljYXRlZDtcclxuXHRcdH0sXHJcblxyXG5cdFx0aXNPblN1cHBvcnRMYW5kaW5nUGFnZTogZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0XHRpZiAoU3VwcG9ydC5IZWxwZXJzLmJtY1N1cHBvcnRMb2FkZWQoKVxyXG5cdFx0XHRcdCYmIHR5cGVvZiBibWNNZXRhLnBhZ2UgIT09ICd1bmRlZmluZWQnXHJcblx0XHRcdFx0JiYgdHlwZW9mIGJtY01ldGEucGFnZS5sb25nTmFtZSA9PT0gJ3N0cmluZycpIHtcclxuXHJcblx0XHRcdFx0Ly92YXIgcGF0aENoZWNrID0gL3N1cHBvcnQuKnN1cHBvcnQtY2VudHJhbC87XHJcblx0XHRcdFx0dmFyIHBhdGhDaGVjayA9IC9zdXBwb3J0LzsgLy9EWFAtODEyXHJcblx0XHRcdFx0XHJcblx0XHRcdFx0Ly8gbWF0Y2hlcyBwYXRoIHN0cmluZyB3aXRoIHN1cHBvcnQgYW5kIHN1cHBvcnQgY2VudHJhbCBpbiBpdFxyXG5cdFx0XHRcdC8vIGV4YW1wbGVzOlxyXG5cdFx0XHRcdC8vIFwic3VwcG9ydDpzdXBwb3J0LWNlbnRyYWxcIiBvciBcInN1cHBvcnQ6cmVnOnN1cHBvcnQtY2VudHJhbFwiXHJcblx0XHRcdFx0aWYgKGJtY01ldGEucGFnZS5sb25nTmFtZS5tYXRjaChwYXRoQ2hlY2spICE9PSBudWxsKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGNhdGNoLWFsbCBkZWZhdWx0XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH0sXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBnZXRBY2NvdW50RXJyb3JNZXNzYWdlXHJcblx0XHQgKiBAcGFyYW0gIHtzdHJpbmd9IGVycm9yVHlwZSAtICdpc3N1ZSdcclxuXHRcdCAqIEBwYXJhbSAge3N0cmluZ30gZXJyb3JDb2RlIGVycm9yQ29kZSAobGlrZWx5IHB1bGxlZCBmcm9tIGFqYXggcmVzcG9uc2UpXHJcblx0XHQgKiBAcmV0dXJuIHtzdHJpbmcgfCB1bmRlZmluZWR9IFJldHVybnMgbWFwcGVkIHN0cmluZyBvciB1bmRlZmluZWQgaWYgbm9uZSBmb3VuZCBpbiB1bmRlZmluZWRcclxuXHRcdCAqL1xyXG5cdFx0Z2V0QWNjb3VudEVycm9yTWVzc2FnZTogZnVuY3Rpb24oZXJyb3JUeXBlLCBlcnJvckNvZGUpIHtcclxuXHRcdFx0Ly8gbWFwIGVycm9yVHlwZSB0byBjb3JyZWN0IGVycm9yR3JvdXAsIGVycm9yR3JvdXAgaXMgdXNlZCBhcyB0aGUgaW5kZXggb24gYm1jTWV0YS5zdXBwb3J0LmVycm9yTWVzc2FnZXNcclxuXHRcdFx0aWYgKGVycm9yVHlwZSA9PSAnaXNzdWUnKSB7XHJcblx0XHRcdFx0dmFyIGVycm9yR3JvdXAgPSAnY2FzZUVycm9yTWVzc2FnZXMnO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignVXNlIHZhbGlkIGVycm9yVHlwZSB3aGVuIGFjY291bnRFcnJvcicpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBkZXRlcm1pbmUgYXBwcm9wcmlhdGUgZXJyb3IgbWVzc2FnZSBiYXNlZCBvbiBpbmRleGVzXHJcblx0XHRcdC8vIHVuZGVmaW5lZCBpZiBtYXBwZWQgdmFsdWUgbm90IGZvdW5kXHJcblx0XHRcdHZhciBlcnJvck1lc3NhZ2UgPSBTdXBwb3J0LkhlbHBlcnMuYm1jU3VwcG9ydExvYWRlZCgpXHJcblx0XHRcdFx0XHRcdFx0XHQmJiBibWNNZXRhLnN1cHBvcnRbZXJyb3JHcm91cF0gIT09IHVuZGVmaW5lZFxyXG5cdFx0XHRcdFx0XHRcdFx0JiYgYm1jTWV0YS5zdXBwb3J0W2Vycm9yR3JvdXBdW2Vycm9yQ29kZV0gIT09IHVuZGVmaW5lZFxyXG5cdFx0XHRcdFx0XHRcdFx0PyBibWNNZXRhLnN1cHBvcnRbZXJyb3JHcm91cF1bZXJyb3JDb2RlXSA6IHVuZGVmaW5lZDtcclxuXHJcblx0XHRcdHJldHVybiBlcnJvck1lc3NhZ2U7XHJcblx0XHR9LFxyXG5cclxuXHRcdGFjY291bnRFcnJvcjogZnVuY3Rpb24oZXJyb3JUeXBlLCBlcnJvckNvZGUpIHtcclxuXHRcdFx0Ly8gcmVzZXQgaGlkaW5nIG9mIGNvbnRhaW5lciwgc2hvdyBuZXcgZXJyb3JcclxuXHRcdFx0U3VwcG9ydC5Db250cm9scy5hY3Rpb25zLnJlc2V0TG9hZEFjY291bnRFcnJvcigpO1xyXG5cclxuXHRcdFx0dmFyIGVycm9yTWVzc2FnZSA9IFN1cHBvcnQuSGVscGVycy5nZXRBY2NvdW50RXJyb3JNZXNzYWdlKGVycm9yVHlwZSwgZXJyb3JDb2RlKTtcclxuXHJcblx0XHRcdC8vIGVycm9yTWVzc2FnZSBpcyB1bmRlZmluZWQgaWYgbWFwcGVkIG1lc3NhZ2Ugbm90IGZvdW5kXHJcblx0XHRcdC8vIGF0dGVtcHQgdG8gc2V0IHVzZSBERUZBVUxUX0VSUk9SX01FU1NBR0VcclxuXHRcdFx0aWYgKGVycm9yTWVzc2FnZSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0XHRlcnJvck1lc3NhZ2UgPSBTdXBwb3J0LkhlbHBlcnMuZ2V0QWNjb3VudEVycm9yTWVzc2FnZShlcnJvclR5cGUsICdERUZBVUxUX0VSUk9SX01FU1NBR0UnKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gc2hvdy9oaWRlIHNwZWNpZmljIGNvbnRhaW5lcnMgYmFzZWQgb24gZXJyb3JUeXBlXHJcblx0XHRcdGlmIChlcnJvclR5cGUgPT0gJ2lzc3VlJykge1xyXG5cdFx0XHRcdCQoYWNjb3VudERldGFpbHMpLnNob3coKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gaGlkZSBvdGhlciBjb250YWluZXJzXHJcblx0XHRcdCQoaXNzdWVzQ29udGFpbmVyKS5oaWRlKCk7XHJcblxyXG5cdFx0XHQvLyBzaG93IGVycm9yIGNvbnRhaW5lciB3aXRoIG1lc3NhZ2UsIGJ1dCBvbmx5IGlmIG1lc3NhZ2UgaXMgYSBub24tZW1wdHkgc3RyaW5nXHJcblx0XHRcdC8vIGlmIHRoZSBlcnJvck1lc3NhZ2Ugd2FzIHJlc29sdmVkIHRvIGEgbWFwcGluZyBvZiBhbiBlbXB0eSBzdHJpbmcsIHRoZW4gZG9uJ3Qgc2hvd1xyXG5cdFx0XHRpZiAodHlwZW9mIGVycm9yTWVzc2FnZSA9PT0gJ3N0cmluZycgJiYgZXJyb3JNZXNzYWdlLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHQkKGFjY291bnRFcnJvcikuc2hvdygpLmh0bWwoZXJyb3JNZXNzYWdlKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFBhcnNlcyBkYXRlcyBjb21pbmcgYmFjayBmcm9tIGFqYXggcmVzcG9uc2UuIEZvciB0aGUgbGFjayBvZiBhIGJldHRlciB0ZXJtIHRoaXMgaXMgYmVpbmdcclxuXHRcdCAqIHJlZmVycmVkIHRvIGFzIGBTdXBwb3J0IExvbmcgRGF0ZWAsIGFuZCBpcyBhIHN0cmluZyBiZWluZyBsb2FkZWQgaW4gdGhlIHN0YW5kYXJkIGZvcm1hdDpcclxuXHRcdCAqIDIwMTUtMDQtMTRUMTQ6MDI6MjIuMDAwWlxyXG5cdFx0ICogQHBhcmFtICB7U3RyaW5nfSBkYXRlU3RyaW5nIC0gRGF0ZSBmb3JtYXR0ZWQgc3RyaW5nLCBsaWtlICcyMDE1LTA0LTE0VDE0OjAyOjIyLjAwMFonXHJcblx0XHQgKiBAcmV0dXJuIHtEYXRlfG51bGx9IG51bGwgaWYgbm8gbWF0Y2hlcywgb3IgbmF0aXZlIGphdmFzY3JpcHQgRGF0ZSBvYmplY3RcclxuXHRcdCAqL1xyXG5cdFx0cGFyc2VTdXBwb3J0TG9uZ0RhdGU6IGZ1bmN0aW9uKGRhdGVTdHJpbmcpIHtcclxuXHRcdFx0dmFyIHBhdHRlcm4gPSAvKFxcZHs0fSktKFxcZHsyfSktKFxcZHsyfSlUKFxcZHsyfSk6KFxcZHsyfSk6KFxcZHsyfSkuKFxcZHszfVxcRCkvO1xyXG5cdFx0XHR2YXIgbWF0Y2hlcyA9IHBhdHRlcm4uZXhlYyhkYXRlU3RyaW5nKTtcclxuXHJcblx0XHRcdC8vIG9uIHN1Y2Nlc3NmdWwgbWF0Y2gsIG1hdGNoWzBdIHdpbGwgYmUgdGhlIGVudGlyZSBtYXRjaGVkIHN0cmluZ1xyXG5cdFx0XHQvLyBtYXRjaGVkIGdyb3VwcyBhcmUgZm9sbG93aW5nIGluZGV4ZXNcclxuXHRcdFx0aWYgKG1hdGNoZXMpIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0Ly8gbW9udGggaXMgcmVwcmVzZW50ZWQgYnkgbWF0Y2hlc1syXSwgRGF0ZSBjb25zdHJ1Y3RvciBleHBlY3RzIG1vbnRoIGluZGV4IGZyb20gMCB0byAxMS5cclxuXHRcdFx0XHRcdHJldHVybiBuZXcgRGF0ZShtYXRjaGVzWzFdLCAocGFyc2VJbnQobWF0Y2hlc1syXSkgLSAxKSwgbWF0Y2hlc1szXSwgbWF0Y2hlc1s0XSwgbWF0Y2hlc1s1XSwgbWF0Y2hlc1s2XSk7XHJcblx0XHRcdFx0fSBjYXRjaChlcnJvcikge1xyXG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZygnVW5hYmxlIHRvIHBhcnNlU3VwcG9ydExvbmdEYXRlIHdpdGggJyArIGRhdGVTdHJpbmcgKyAnLiBFcnJvcjpcXG4gJyArIGVycm9yLm1lc3NhZ2UpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdHBhZDogZnVuY3Rpb24obiwgd2lkdGgsIHopIHtcclxuXHRcdFx0eiA9IHogfHwgJzAnO1xyXG5cdFx0XHRuID0gbiArICcnO1xyXG5cdFx0XHRyZXR1cm4gbi5sZW5ndGggPj0gd2lkdGggPyBuIDogbmV3IEFycmF5KHdpZHRoIC0gbi5sZW5ndGggKyAxKS5qb2luKHopICsgbjtcclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gUXVpY2sgYW5kIGVhc3kgZnVuY3Rpb24gZm9yIHBhZGRpbmcgbW9udGggYW5kIGRheSBhbW91bnRzIHdpdGggbGVhZGluZyB6ZXJvZXMgaWYgbmVjZXNzYXJ5IChpZTogTU0vREQvWVlZWSwgc2luZ2xlIGRpZ2l0YWxzIGZvciBNTSBhbmQgREQgc2hvdWxkIGhhdmUgbGVhZGluZyAwKVxyXG5cdFx0cGFkVG9Ud29EaWdpdHM6IGZ1bmN0aW9uKG51bSkge1xyXG5cdFx0XHRyZXR1cm4gU3VwcG9ydC5IZWxwZXJzLnBhZChudW0sIDIpO1xyXG5cdFx0fSxcclxuXHRcdGdldFVSTFdpdGhRdWVyeVBhcmFtOiBmdW5jdGlvbih1cmksIGtleSwgdmFsdWUpIHtcclxuXHRcdFx0dmFyIHJlID0gbmV3IFJlZ0V4cChcIihbPyZdKVwiICsga2V5ICsgXCI9Lio/KCZ8JClcIiwgXCJpXCIpO1xyXG5cdFx0XHR2YXIgc2VwYXJhdG9yID0gdXJpLmluZGV4T2YoJz8nKSAhPT0gLTEgPyBcIiZcIiA6IFwiP1wiO1xyXG5cclxuXHRcdFx0aWYgKHVyaS5tYXRjaChyZSkpIHtcclxuXHRcdFx0XHRyZXR1cm4gdXJpLnJlcGxhY2UocmUsICckMScgKyBrZXkgKyBcIj1cIiArIHZhbHVlICsgJyQyJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuIHVyaSArIHNlcGFyYXRvciArIGtleSArIFwiPVwiICsgdmFsdWU7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHQvLyBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIGlmIGl0J3Mgbm90IG9uZS4gQW4gZW1wdHkgc3RyaW5nIGlzIHJldHVybmVkIGZvciBgbnVsbGAgb3IgYHVuZGVmaW5lZGAgdmFsdWVzLlxyXG5cdFx0YmFzZVRvU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0ICByZXR1cm4gdmFsdWUgPT0gbnVsbCA/ICcnIDogKHZhbHVlICsgJycpO1xyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBDYXBpdGFsaXplcyB0aGUgZmlyc3QgY2hhcmFjdGVyIG9mIGBzdHJpbmdgLlxyXG5cdFx0Y2FwaXRhbGl6ZTogZnVuY3Rpb24oc3RyaW5nKSB7XHJcblx0XHQgIHN0cmluZyA9IFN1cHBvcnQuSGVscGVycy5iYXNlVG9TdHJpbmcoc3RyaW5nKTtcclxuXHRcdCAgcmV0dXJuIHN0cmluZyAmJiAoc3RyaW5nLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyaW5nLnNsaWNlKDEpKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0bWFrZUZ1bGxOYW1lOiBmdW5jdGlvbihmaXJzdE5hbWUsIGxhc3ROYW1lKSB7XHJcblx0XHRcdHJldHVybiBTdXBwb3J0LkhlbHBlcnMuY2FwaXRhbGl6ZShsYXN0TmFtZS50b0xvd2VyQ2FzZSgpKSArIFwiLCBcIiArIFN1cHBvcnQuSGVscGVycy5jYXBpdGFsaXplKGZpcnN0TmFtZS50b0xvd2VyQ2FzZSgpKTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHQvLyBBZGQgY2xhc3MgdG8gYm9keSwgdXNlZCBieSBjc3MgdG8gc2hvdy9oaWRlIGJsb2Nrc1xyXG5cdC8vIHRoYXQgZGVwZW5kIG9uIHN1cHBvcnQgdXNlciBiZWluZyBhdXRoZW50aWNhdGVkXHJcblx0U3VwcG9ydC5BdXRoZW50aWNhdGVkQmxvY2tzID0ge1xyXG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBzdXBwb3J0QXV0aGVudGljYXRlZENsYXNzID0gKFN1cHBvcnQuSGVscGVycy5pc0F1dGhlbnRpY2F0ZWQoKSkgPyAnc3VwcG9ydC1sb2dnZWQtaW4nIDogJ3N1cHBvcnQtbG9nZ2VkLW91dCc7XHJcblx0XHRcdCQoJ2JvZHknKS5hZGRDbGFzcyhzdXBwb3J0QXV0aGVudGljYXRlZENsYXNzKTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHRTdXBwb3J0Lklzc3VlcyA9IHtcclxuXHJcblx0XHR0YWJsZVJvd3NTZWxlY3RvcjogJy5qcy1zdXBwb3J0LWlzc3Vlcy1yb3dzJyxcclxuXHRcdHNob3dNb3JlU2VsZWN0b3I6ICcuanMtc3VwcG9ydC1pc3N1ZXMtc2hvdy1tb3JlJyxcclxuXHRcdGlzc3VlVGFibGVXcmFwcGVyU2VsZWN0b3I6ICcuanMtaXNzdWUtdGFibGUtd3JhcHBlcicsXHJcblx0XHRoaWRkZW5DbGFzczogJ2hpZGRlbicsXHJcblx0XHRzaG93QmF0Y2hRdHk6IDEwLFxyXG5cdFx0Ly8gc3RhdGVmdWwgc2VsZWN0b3JzIGFuZCBjbGFzc2VzXHJcblx0XHRsb2FkaW5nSXNzdWVzQ29udGFpbmVyU2VsZWN0b3I6ICcuanMtbG9hZGluZy1pc3N1ZXMtY29udGFpbmVyJyxcclxuXHRcdG5vSXNzdWVzQ29udGFpbmVyU2VsZWN0b3I6ICcuanMtbm8taXNzdWVzLWNvbnRhaW5lcicsXHJcblx0XHRoYXNJc3N1ZXNDb250YWluZXJTZWxlY3RvcjogJy5qcy1pc3N1ZXMtY29udGFpbmVyJyxcclxuXHRcdGxvYWRpbmdGYWlsZWRJc3N1ZXNDb250YWluZXJTZWxlY3RvcjogJy5qcy1mYWlsZWQtbG9hZGluZy1pc3N1ZXMtY29udGFpbmVyJyxcclxuXHRcdGhpZGVPbkluaXRDbGFzczogJ3N1cHBvcnQtaGlkZS13aGlsZS1sb2FkaW5nJyxcclxuXHJcblx0XHRnZXRNb2R1bGVTdGF0ZUNvbnRhaW5lclNlbGVjdG9yczogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0bG9hZDogU3VwcG9ydC5Jc3N1ZXMubG9hZGluZ0lzc3Vlc0NvbnRhaW5lclNlbGVjdG9yLFxyXG5cdFx0XHRcdGhhc0lzc3VlczogU3VwcG9ydC5Jc3N1ZXMuaGFzSXNzdWVzQ29udGFpbmVyU2VsZWN0b3IsXHJcblx0XHRcdFx0bm9Jc3N1ZXM6IFN1cHBvcnQuSXNzdWVzLm5vSXNzdWVzQ29udGFpbmVyU2VsZWN0b3IsXHJcblx0XHRcdFx0ZmFpbGVkOiBTdXBwb3J0Lklzc3Vlcy5sb2FkaW5nRmFpbGVkSXNzdWVzQ29udGFpbmVyU2VsZWN0b3JcclxuXHRcdFx0fTtcclxuXHRcdH0sXHJcblxyXG5cdFx0bG9hZFZpYVVybDogZnVuY3Rpb24odXJsKSB7XHJcblxyXG5cdFx0XHRTdXBwb3J0Lklzc3Vlcy5hY3Rpb25zLnNob3dTdGF0ZUNvbnRhaW5lcignbG9hZCcpO1xyXG5cclxuXHRcdFx0JC5nZXRKU09OKHVybCwgZnVuY3Rpb24oZGF0YSkge1xyXG5cdFx0XHRcdGlmICh0eXBlb2YgZGF0YS5DYXNlcyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0XHRcdHZhciBpc3N1ZXMgPSAkLm1hcChkYXRhLkNhc2VzLCBTdXBwb3J0Lklzc3Vlcy5tYXBUb0lzc3VlRm9ybWF0KVxyXG5cdFx0XHRcdFx0XHQvLyBzb3J0cyBieSBtb3N0IHJlY2VudCwgZGVzY2VuZGluZ1xyXG5cdFx0XHRcdFx0XHQuc29ydChmdW5jdGlvbihhLCBiKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKGEubGFzdFVwZGF0ZWRSYXdEYXRlICYmXHJcblx0XHRcdFx0XHRcdFx0XHRiLmxhc3RVcGRhdGVkUmF3RGF0ZSAmJlxyXG5cdFx0XHRcdFx0XHRcdFx0YS5sYXN0VXBkYXRlZFJhd0RhdGUgPiBiLmxhc3RVcGRhdGVkUmF3RGF0ZSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gLTE7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiAoYS5sYXN0VXBkYXRlZFJhd0RhdGUgJiZcclxuXHRcdFx0XHRcdFx0XHRcdGIubGFzdFVwZGF0ZWRSYXdEYXRlICYmXHJcblx0XHRcdFx0XHRcdFx0XHRhLmxhc3RVcGRhdGVkUmF3RGF0ZSA8IGIubGFzdFVwZGF0ZWRSYXdEYXRlKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiAxO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIDA7XHJcblx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRcdC8vIG9ubHkga2VlcCAyMCBpc3N1ZXMsIGFmdGVyIHNvcnRpbmdcclxuXHRcdFx0XHRcdFx0LnNsaWNlKDAsIDIwKTtcclxuXHJcblx0XHRcdFx0XHRTdXBwb3J0Lklzc3Vlcy5hY3Rpb25zLnJlbW92ZUFsbElzc3VlcygpO1xyXG5cdFx0XHRcdFx0U3VwcG9ydC5Jc3N1ZXMubG9hZElzc3Vlcyhpc3N1ZXMpO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIGRhdGEuZXJyb3JDb2RlICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRcdFN1cHBvcnQuSGVscGVycy5hY2NvdW50RXJyb3IoJ2lzc3VlJywgZGF0YS5lcnJvckNvZGUpO1xyXG5cdFx0XHRcdFx0U3VwcG9ydC5Jc3N1ZXMuYWN0aW9ucy5zaG93U3RhdGVDb250YWluZXIoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHRcdC5mYWlsKGZ1bmN0aW9uKGRhdGEpIHtcclxuXHRcdFx0XHRTdXBwb3J0LkhlbHBlcnMuYWNjb3VudEVycm9yKCdpc3N1ZScsICdERUZBVUxUX0VSUk9SX01FU1NBR0UnKTtcclxuXHRcdFx0XHRTdXBwb3J0Lklzc3Vlcy5hY3Rpb25zLnNob3dTdGF0ZUNvbnRhaW5lcigpO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHQuYWx3YXlzKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFN1cHBvcnQuQ29udHJvbHMuYWN0aW9ucy5maW5pc2hlZExvYWRpbmcoKTtcclxuXHRcdFx0fSk7O1xyXG5cdFx0fSxcclxuXHJcblx0XHQvLyB0YWtlcyBmb3JtYXQgZnJvbSBqc29uIGFuZCBtYXBzIHRvIGZvcm1hdCB1c2VkIGludGVybmFsbHlcclxuXHRcdC8vIGNhbiBwZXJmb3JtIGFueSBvdGhlciBjbGVhbiB1cCBhcyB3ZWxsXHJcblx0XHRtYXBUb0lzc3VlRm9ybWF0OiBmdW5jdGlvbihpc3N1ZSkge1xyXG5cclxuXHRcdFx0dmFyIGZ1bGxOYW1lID0gU3VwcG9ydC5IZWxwZXJzLm1ha2VGdWxsTmFtZShpc3N1ZS5Db250YWN0Rmlyc3ROYW1lLCBpc3N1ZS5Db250YWN0TGFzdE5hbWUpO1xyXG5cclxuXHRcdFx0Ly8gbGVmdFBhZCB3aXRoIHdpdGggZXh0cmEgJzAnIGlmIHJlcXVpcmVkXHJcblx0XHRcdHZhciBwYWQgPSBTdXBwb3J0LkhlbHBlcnMucGFkVG9Ud29EaWdpdHM7XHJcblxyXG5cdFx0XHQvLyBwcm92aWRlcyByYXcganMgRGF0ZSBvYmplY3RcclxuXHRcdFx0dmFyIHJhd0xhc3RVcGRhdGVkID0gU3VwcG9ydC5IZWxwZXJzLnBhcnNlU3VwcG9ydExvbmdEYXRlKGlzc3VlLkxhc3RNb2RpZmllZERhdGUpO1xyXG5cdFx0XHR2YXIgcmF3Q3JlYXRlZCA9IFN1cHBvcnQuSGVscGVycy5wYXJzZVN1cHBvcnRMb25nRGF0ZShpc3N1ZS5DcmVhdGVkRGF0ZSk7XHJcblx0XHRcdHZhciBtb250aHM9WydKYW4nLCdGZWInLCdNYXInLCdBcHInLCdNYXknLCdKdW4nLCdKdWwnLCdBdWcnLCdTZXAnLCdPY3QnLCdOb3YnLCdEZWMnXTtcclxuXHRcdFx0XHJcblx0XHRcdC8vIFwiTGFzdCBVcGRhdGVkXCIgb3V0cHV0dGVkIGZvcm1hdDogTU0vREQvWVlZWSBISDpNTVxyXG5cdFx0XHQvKlxyXG5cdFx0XHR2YXIgZm9ybWF0dGVkTGFzdFVwZGF0ZWQgPSBwYWQocmF3TGFzdFVwZGF0ZWQuZ2V0TW9udGgoKSArIDEpIC8vIGdldE1vbnRoKCkgcmV0dXJucyBhIDAtMTEgcmFuZ2VcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQrIFwiL1wiXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0KyBwYWQocmF3TGFzdFVwZGF0ZWQuZ2V0RGF0ZSgpKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCsgXCIvXCJcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQrIHJhd0xhc3RVcGRhdGVkLmdldEZ1bGxZZWFyKCk7XHJcblxyXG5cdFx0XHR2YXIgZm9ybWF0dGVkQ3JlYXRlZCA9IHBhZChyYXdDcmVhdGVkLmdldE1vbnRoKCkgKyAxKSAvLyBnZXRNb250aCgpIHJldHVybnMgYSAwLTExIHJhbmdlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0KyBcIi9cIlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCsgcGFkKHJhd0NyZWF0ZWQuZ2V0RGF0ZSgpKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCsgXCIvXCJcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQrIHJhd0NyZWF0ZWQuZ2V0RnVsbFllYXIoKTtcclxuXHRcdFx0Ki9cclxuXHRcdFx0XHJcblx0XHRcdFxyXG5cdFx0XHQvLyBcIkxhc3QgVXBkYXRlZFwiIG91dHB1dHRlZCBmb3JtYXQ6IE1NL0REL1lZWVkgSEg6TU1cclxuXHRcdFx0dmFyIGZvcm1hdHRlZExhc3RVcGRhdGVkID0gcGFkKHJhd0xhc3RVcGRhdGVkLmdldERhdGUoKSlcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQrIFwiLVwiXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0KyBwYWQobW9udGhzW3Jhd0xhc3RVcGRhdGVkLmdldE1vbnRoKCldKSBcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQrIFwiLVwiXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0KyByYXdMYXN0VXBkYXRlZC5nZXRGdWxsWWVhcigpO1xyXG5cclxuXHRcdFx0dmFyIGZvcm1hdHRlZENyZWF0ZWQgPSBwYWQocmF3Q3JlYXRlZC5nZXREYXRlKCkpXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0KyBcIi1cIlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCsgcGFkKG1vbnRoc1tyYXdDcmVhdGVkLmdldE1vbnRoKCldKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCsgXCItXCJcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQrIHJhd0NyZWF0ZWQuZ2V0RnVsbFllYXIoKTtcclxuXHRcdFx0XHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0aWQ6IGlzc3VlLklkLFxyXG5cdFx0XHRcdGNhc2VOdW1iZXI6IGlzc3VlLkNhc2VOdW1iZXIsXHJcblx0XHRcdFx0c3RhdHVzOiBpc3N1ZS5TdGF0dXMsXHJcblx0XHRcdFx0cHJvZHVjdDogaXNzdWUuUHJvZHVjdE5hbWUsXHJcblx0XHRcdFx0Y3JlYXRlZERhdGU6IGZvcm1hdHRlZENyZWF0ZWQsXHJcblx0XHRcdFx0bGFzdFVwZGF0ZWRPcmlnaW5hbERhdGU6IGlzc3VlLkxhc3RNb2RpZmllZERhdGUsXHJcblx0XHRcdFx0bGFzdFVwZGF0ZWRSYXdEYXRlOiByYXdMYXN0VXBkYXRlZCxcclxuXHRcdFx0XHRsYXN0VXBkYXRlZEZvcm1hdHRlZERhdGU6IGZvcm1hdHRlZExhc3RVcGRhdGVkLFxyXG5cdFx0XHRcdHN1bW1hcnk6IGlzc3VlLlN1YmplY3QsXHJcblx0XHRcdFx0c3VibWl0dGVyOiBmdWxsTmFtZVxyXG5cdFx0XHR9O1xyXG5cdFx0fSxcclxuXHJcblx0XHRsb2FkSXNzdWVzOiBmdW5jdGlvbihpc3N1ZXMpIHtcclxuXHRcdFx0aWYgKGlzc3Vlcy5sZW5ndGgpIHtcclxuXHRcdFx0XHRTdXBwb3J0Lklzc3Vlcy5hY3Rpb25zLmFkZElzc3Vlcyhpc3N1ZXMpO1xyXG5cdFx0XHRcdFN1cHBvcnQuSXNzdWVzLmFjdGlvbnMuc2hvd1N0YXRlQ29udGFpbmVyKCdoYXNJc3N1ZXMnKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRTdXBwb3J0Lklzc3Vlcy5hY3Rpb25zLnNob3dTdGF0ZUNvbnRhaW5lcignbm9Jc3N1ZXMnKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHRsb2FkU2VsZWN0ZWRJc3N1ZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBtYXRjaElkID0gJChjb250cmFjdFNlbGVjdG9yKS5maW5kKCc6c2VsZWN0ZWQnKS5kYXRhKCdjb250cmFjdC1pZCcpIHx8IFwiXCI7XHJcblx0XHRcdC8vIExvYWQgbG9jYWwgdGVzdCBkYXRhICBvciBnZXQgdmlhIGFqYXhcclxuXHRcdFx0aWYgKHR5cGVvZiBibWNNZXRhICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgYm1jTWV0YS5jZHhMb2NhbCAhPT0gJ3VuZGVmaW5lZCcgJiYgYm1jTWV0YS5jZHhMb2NhbCkge1xyXG5cdFx0XHRcdHRoaXMubG9hZFZpYVVybCgnLi90ZXN0LycgKyBtYXRjaElkICsgJy5qc29uJyk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5sb2FkVmlhVXJsKCcvdGVtcGxhdGVzL1Jlc3RHZXRTdXBwb3J0T3Blbklzc3Vlcz9jb250cmFjdElEPScgKyBtYXRjaElkKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHRhY3Rpb25zOiB7XHJcblxyXG5cdFx0XHQvKipcclxuXHRcdFx0ICogQWRkcyBhbiBhcnJheSBvZiBpc3N1ZSBvYmplY3RzXHJcblx0XHRcdCAqIEBwYXJhbSB7YXJyYXl9IGlzc3VlcyBhcnJheSBvZiBpc3N1ZXMgaW4gdGhlIGZvcm1hdCBzcGVjaWZpZWQgd2l0aGluIGBhZGRJc3N1ZWBcclxuXHRcdFx0ICovXHJcblx0XHRcdGFkZElzc3VlczogZnVuY3Rpb24oaXNzdWVzKSB7XHJcblx0XHRcdFx0Ly8gc2VlIFN1cHBvcnQuSXNzdWVzLmFjdGlvbnMuYWRkSXNzdWUgZm9yIGV4cGVjdGVkIGlzc3VlIGZvcm1hdFxyXG5cdFx0XHRcdCQuZWFjaChpc3N1ZXMsIGZ1bmN0aW9uKGksIGlzc3VlKSB7XHJcblx0XHRcdFx0XHRTdXBwb3J0Lklzc3Vlcy5hY3Rpb25zLmFkZElzc3VlKGlzc3VlKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdGFkZElzc3VlOiBmdW5jdGlvbihpc3N1ZSkge1xyXG5cclxuXHRcdFx0XHQvKipcclxuXHRcdFx0XHQgKiBvdXRwdXQgZm9ybWF0OlxyXG5cdFx0XHRcdCAqXHJcblx0XHRcdFx0ICogIHtcclxuXHRcdFx0XHQgKiAgICAgIGlkOiBudW1iZXIsXHJcblx0XHRcdFx0ICpcdFx0c3VtbWFyeTogc3RyaW5nLFxyXG5cdFx0XHRcdCAqICAgICAgcHJvZHVjdDogc3RyaW5nLFxyXG5cdFx0XHRcdCAqICAgICAgY3JlYXRlZERhdGU6IHN0cmluZyxcclxuXHRcdFx0XHQgKiAgICAgIGxhc3RVcGRhdGVkOiBzdHJpbmcsXHJcblx0XHRcdFx0ICogICAgICBzdGF0dXM6IHN0cmluZyxcclxuXHRcdFx0XHQgKlx0XHRzdWJtaXR0ZXI6IHN0cmluZ1xyXG5cdFx0XHRcdCAqIFx0fVxyXG5cdFx0XHRcdCAqL1xyXG5cclxuXHRcdFx0XHQvLyBwdWxsIG5lZWRlZCBmaWVsZHMgZnJvbSBpc3N1ZSBmb3Igb3V0cHV0IGZvcm1hdFxyXG5cdFx0XHRcdHZhciBpc3N1ZU91dHB1dCA9IHtcclxuXHRcdFx0XHRcdGlkOiBpc3N1ZS5jYXNlTnVtYmVyLFxyXG5cdFx0XHRcdFx0c3VtbWFyeTogaXNzdWUuc3VtbWFyeSxcclxuXHRcdFx0XHRcdHByb2R1Y3Q6IGlzc3VlLnByb2R1Y3QsXHJcblx0XHRcdFx0XHRjcmVhdGVkRGF0ZTogaXNzdWUuY3JlYXRlZERhdGUsXHJcblx0XHRcdFx0XHRsYXN0VXBkYXRlZDogaXNzdWUubGFzdFVwZGF0ZWRGb3JtYXR0ZWREYXRlLFxyXG5cdFx0XHRcdFx0c3RhdHVzOiBpc3N1ZS5zdGF0dXMsXHJcblx0XHRcdFx0XHRzdWJtaXR0ZXI6IGlzc3VlLnN1Ym1pdHRlclxyXG5cdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdC8vIGNlbGwgaHRtbCBtYXJrdXAgY29udGFpbmVyXHJcblx0XHRcdFx0dmFyIGNlbGxzID0gW107XHJcblxyXG5cdFx0XHRcdGZvciAoa2V5IGluIGlzc3VlT3V0cHV0KSB7XHJcblx0XHRcdFx0XHQvLyBJRCBuZWVkcyB0byBiZSBsaW5rZWQgdG8gdGhlIHRpY2tldFxyXG5cdFx0XHRcdFx0aWYgKGtleSA9PT0gJ2lkJykge1xyXG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mIGJtY01ldGEgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBibWNNZXRhLnN1cHBvcnQgIT09ICd1bmRlZmluZWQnKSB7XHJcblxyXG5cdFx0XHRcdFx0XHRcdHN1cHBvcnRFbnYgPSAodHlwZW9mIGJtY01ldGEuc3VwcG9ydC5pc3N1ZUVudmlyb25tZW50ICE9PSAndW5kZWZpbmVkJykgPyBibWNNZXRhLnN1cHBvcnQuaXNzdWVFbnZpcm9ubWVudCA6IFwiXCI7XHJcblx0XHRcdFx0XHRcdFx0c3VwcG9ydFBhdGggPSAodHlwZW9mIGJtY01ldGEuc3VwcG9ydC5pc3N1ZVBhdGggIT09ICd1bmRlZmluZWQnKSA/IGJtY01ldGEuc3VwcG9ydC5pc3N1ZVBhdGggOiBcIlwiO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRjZWxscy5wdXNoKCc8dGQ+PGEgaHJlZj1cIicgKyBTdXBwb3J0Lklzc3Vlcy5idWlsZFN1cHBvcnRJc3N1ZVVybChzdXBwb3J0RW52LCBzdXBwb3J0UGF0aCwgaXNzdWUuaWQpICsgJ1wiPicgKyBpc3N1ZU91dHB1dFtrZXldICsgJzwvYT48L3RkPicpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0Y2VsbHMucHVzaCgnPHRkPicgKyBpc3N1ZU91dHB1dFtrZXldICsgJzwvdGQ+Jyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR2YXIgcm93ID0gJzx0ciBkYXRhLWlzc3VlLWlkPVwiJyArIGlzc3VlT3V0cHV0LmlkICsgJ1wiPicgKyBjZWxscy5qb2luKCcnKSArICc8L3RyPic7XHJcblx0XHRcdFx0dmFyIHJvd3NDb250YWluZXIgPSAkKFN1cHBvcnQuSXNzdWVzLmlzc3VlVGFibGVXcmFwcGVyU2VsZWN0b3IpLmZpbmQoJ3RhYmxlIHRib2R5Jyk7XHJcblx0XHRcdFx0JChyb3dzQ29udGFpbmVyKS5hcHBlbmQocm93KTtcclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdC8qKlxyXG5cdFx0XHQgKiBzdGF0ZSBpcyBiYXNlZCBvbiB0aGUga2V5IHByb3ZpZGVkIGJ5IHRoZSBhcnJheSByZXR1cm5lZCBmcm9tIGdldE1vZHVsZVN0YXRlQ29udGFpbmVyU2VsZWN0b3JzXHJcblx0XHRcdCAqL1xyXG5cdFx0XHRzaG93U3RhdGVDb250YWluZXI6IGZ1bmN0aW9uKHNob3dTdGF0ZSkge1xyXG5cclxuXHRcdFx0XHR2YXIgc3RhdGVzID0gU3VwcG9ydC5Jc3N1ZXMuZ2V0TW9kdWxlU3RhdGVDb250YWluZXJTZWxlY3RvcnMoKTtcclxuXHJcblx0XHRcdFx0aWYgKHR5cGVvZiBzdGF0ZXNbc2hvd1N0YXRlXSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0XHRcdCQoc3RhdGVzW3Nob3dTdGF0ZV0pLmZhZGVJbigpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8gaGlkZSBleGlzdGluZyBzdGF0ZXNcclxuXHRcdFx0XHRmb3IgKHN0YXRlIGluIHN0YXRlcykge1xyXG5cdFx0XHRcdFx0aWYgKHN0YXRlICE9PSBzaG93U3RhdGUpIHtcclxuXHRcdFx0XHRcdFx0JChzdGF0ZXNbc3RhdGVdKS5oaWRlKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0cmVtb3ZlQWxsSXNzdWVzOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgcm93cyA9ICQoU3VwcG9ydC5Jc3N1ZXMuaXNzdWVUYWJsZVdyYXBwZXJTZWxlY3RvcikuZmluZCgndGFibGUgdGJvZHkgdHInKTtcclxuXHRcdFx0XHRyb3dzLnJlbW92ZSgpO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0c2hvd0lzc3VlczogZnVuY3Rpb24oYW1vdW50KSB7XHJcblx0XHRcdFx0dmFyIGhpZGRlbklzc3VlcyA9ICQoU3VwcG9ydC5Jc3N1ZXMudGFibGVSb3dzU2VsZWN0b3IpLmZpbmQoJ3RyLmhpZGRlbicpO1xyXG5cdFx0XHRcdHZhciBjYXBwZWQgPSAkKGhpZGRlbklzc3Vlcykuc2xpY2UoMCwgU3VwcG9ydC5Jc3N1ZXMuc2hvd0JhdGNoUXR5KTtcclxuXHRcdFx0XHR2YXIgcmVtYWluaW5nID0gaGlkZGVuSXNzdWVzLmxlbmd0aCAtIGNhcHBlZC5sZW5ndGg7XHJcblxyXG5cdFx0XHRcdGlmIChjYXBwZWQubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0U3VwcG9ydC5Jc3N1ZXMuYWN0aW9ucy5zaG93KGNhcHBlZCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFN1cHBvcnQuSXNzdWVzLmFjdGlvbnMudmlld0FsbCgpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8gU2hvd2VkIGZpbmFsIGJhdGNoXHJcblx0XHRcdFx0aWYgKHJlbWFpbmluZyA8PSBTdXBwb3J0Lklzc3Vlcy5zaG93QmF0Y2hRdHkpIHtcclxuXHRcdFx0XHRcdFN1cHBvcnQuSXNzdWVzLmFjdGlvbnMuYWxsU2hvd24oKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHNob3c6IGZ1bmN0aW9uKGVsZW1lbnRzKSB7XHJcblx0XHRcdFx0JChlbGVtZW50cykucmVtb3ZlQ2xhc3MoU3VwcG9ydC5Jc3N1ZXMuaGlkZGVuQ2xhc3MpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRoaWRlOiBmdW5jdGlvbihlbGVtZW50cykge1xyXG5cdFx0XHRcdCQoZWxlbWVudHMpLmFkZENsYXNzKFN1cHBvcnQuSXNzdWVzLmhpZGRlbkNsYXNzKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0YWxsU2hvd246IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciBzaG93TW9yZSA9ICQoU3VwcG9ydC5Jc3N1ZXMuc2hvd01vcmVTZWxlY3Rvcik7XHJcblx0XHRcdFx0dmFyIG5ld0xhYmVsID0gc2hvd01vcmUuZGF0YSgndmlldy1hbGwtbGFiZWwnKTtcclxuXHRcdFx0XHRzaG93TW9yZS5odG1sKG5ld0xhYmVsKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0dmlld0FsbDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIHVybCA9ICQoU3VwcG9ydC5Jc3N1ZXMuc2hvd01vcmVTZWxlY3RvcikuZGF0YSgndmlldy1hbGwtdXJsJyk7XHJcblx0XHRcdFx0aWYgKHVybCkge1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQubG9jYXRpb24gPSB1cmw7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0ZmluaXNoZWRMb2FkaW5nOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQkKCcuanMtYWNjb3VudC1kZXRhaWxzLWxvYWRpbmcnKS5oaWRlKCk7XHJcblx0XHRcdFx0JCgnLnN1cHBvcnQtbm8taXNzdWVzJykuaGlkZSgpLnJlbW92ZUNsYXNzKCdzdXBwb3J0LWhpZGUtd2hpbGUtbG9hZGluZycpO1xyXG5cdFx0XHRcdCQoJy5hY3Rpb24tZGV0YWlscycpLnJlbW92ZUNsYXNzKCdzdXBwb3J0LWhpZGUtd2hpbGUtbG9hZGluZycpO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdGJ1aWxkU3VwcG9ydElzc3VlVXJsOiBmdW5jdGlvbihzdXBwb3J0RW52LCBzdXBwb3J0UGF0aCwgaXNzdWVJRCkge1xyXG5cdFx0XHRyZXR1cm4gc3VwcG9ydEVudiArIHN1cHBvcnRQYXRoICsgaXNzdWVJRDtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHRTdXBwb3J0LkNvbnRyb2xzID0ge1xyXG5cclxuXHRcdGFjdGlvbnM6IHtcclxuXHRcdFx0ZmluaXNoZWRMb2FkaW5nOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQkKCcuanMtYWNjb3VudC1kZXRhaWxzLWxvYWRpbmcnKS5oaWRlKCk7XHJcblx0XHRcdFx0JCgnLnN1cHBvcnQtbm8taXNzdWVzJykuaGlkZSgpLnJlbW92ZUNsYXNzKCdzdXBwb3J0LWhpZGUtd2hpbGUtbG9hZGluZycpO1xyXG5cdFx0XHRcdCQoJy5hY3Rpb24tZGV0YWlscycpLnJlbW92ZUNsYXNzKCdzdXBwb3J0LWhpZGUtd2hpbGUtbG9hZGluZycpO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0cmVzZXRMb2FkQWNjb3VudEVycm9yOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQkKGFjY291bnRFcnJvcikuaGlkZSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdGlzc3VlU2hvd01vcmU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKFN1cHBvcnQuSXNzdWVzLnNob3dNb3JlU2VsZWN0b3IpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0U3VwcG9ydC5Jc3N1ZXMuYWN0aW9ucy5zaG93SXNzdWVzKFN1cHBvcnQuSXNzdWVzLnNob3dCYXRjaFF0eSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSxcclxuXHJcblx0XHRsb2FkRGF0YTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdC8vIExvYWQgbG9jYWwgdGVzdCBkYXRhIG9yIGdldCB2aWEgYWpheFxyXG5cdFx0XHRpZiAodHlwZW9mIGJtY01ldGEgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBibWNNZXRhLmNkeExvY2FsICE9PSAndW5kZWZpbmVkJyAmJiBibWNNZXRhLmNkeExvY2FsKSB7XHJcblx0XHRcdFx0U3VwcG9ydC5Jc3N1ZXMubG9hZFZpYVVybCgnLi90ZXN0L2lzc3Vlcy5qc29uJyk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0U3VwcG9ydC5Jc3N1ZXMubG9hZFZpYVVybCgnL2Jpbi9zdXBwb3J0Y2FzZXMnKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdFxyXG5cdFx0ZW1wbG95ZWVDaGVjayA6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFxyXG5cdFx0XHRpZih0eXBlb2YgYm1jTWV0YSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgYm1jTWV0YS51c2VyICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBibWNNZXRhLnVzZXIuZW1haWwgIT09IFwidW5kZWZpbmVkXCIpe1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHZhciBwRW1haWxJRCA9IGJtY01ldGEudXNlci5lbWFpbDtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRpZihwRW1haWxJRC5pbmRleE9mKFwiQGJtYy5jb21cIikgPiAtMSlcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0dmFyIGVtcGxveWVlQWxlcnRDb250ZW50ID0gJzxzZWN0aW9uIGNsYXNzPVwibGF5b3V0LWZ1bGwtYmxlZWQgc3VwcG9ydC1wcm9tbyBzdXBwb3J0LW1lc3NhZ2UtYm94XCI+PHAgY2xhc3M9XCJhbGlnbi1jZW50ZXJcIj48c3Ryb25nPllvdSBhcmUgY3VycmVudGx5IGxvZ2dlZCBpbiB3aXRoIHlvdXIgQk1DIGVtcGxveWVlIGludGVybmFsIElEIG9uIHRoZSBleHRlcm5hbCB3d3cuYm1jLmNvbS9zdXBwb3J0IHNpdGUuPC9zdHJvbmc+PGJyPlBsZWFzZSA8YSBocmVmPVwiL2F2YWlsYWJsZS9zc28tZGVmYXVsdC1sb2dpbi5odG1sXCI+bG9naW48L2E+IHVzaW5nIGFuIGFjY291bnQgdGhhdCB5b3UgaGF2ZSByZWdpc3RlcmVkIHdpdGggYW4gYWN0aXZlIFN1cHBvcnQgSUQgaWYgeW91IHdvdWxkIGxpa2UgdG8gYWNjZXNzIEJNQyBDdXN0b21lciBTdXBwb3J0IGFwcGxpY2F0aW9ucyBpLmUuIFByb2R1Y3QgRG93bmxvYWRzLCBlRml4LCBDYXNlIE1hbmFnZW1lbnQuPC9wPjwvc2VjdGlvbj4nO1xyXG5cdFx0XHRcdFx0XHQkKCBlbXBsb3llZUFsZXJ0Q29udGVudCApLmluc2VydEFmdGVyKCBcIi5zdXBwb3J0Y2VudHJhbC1uZXdzXCIgKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHRpbml0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHJcblx0XHRcdC8vIFByZXZlbnQgaW5pdCBpZiBub3QgbG9nZ2VkIGluIG9yIG5vdCBvbiBsYW5kaW5nIHBhZ2VcclxuXHRcdFx0aWYgKCFTdXBwb3J0LkhlbHBlcnMuaXNBdXRoZW50aWNhdGVkKCkgfHwgIVN1cHBvcnQuSGVscGVycy5pc09uU3VwcG9ydExhbmRpbmdQYWdlKCkpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5pc3N1ZVNob3dNb3JlKCk7XHJcblx0XHRcdHRoaXMubG9hZERhdGEoKTtcclxuXHRcdFx0XHJcblx0XHRcdC8vRFhQLTExMTEgOiBTdXBwb3J0IENlbnRyYWwgLSBFbXBsb3llZSBDaGVja1xyXG5cdFx0XHR0aGlzLmVtcGxveWVlQ2hlY2soKTtcclxuXHRcdFx0XHJcblx0XHR9XHJcblxyXG5cdH07XHJcblxyXG5cdFN1cHBvcnQuQWxlcnRzID0ge1xyXG5cclxuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdFx0Ly8gbG9jYWwgdmFyc1xyXG5cdFx0XHR2YXIgZmluaXNoZWRMb2FkaW5nLFxyXG5cdFx0XHRcdG1lc3NhZ2VzVXJsO1xyXG5cclxuXHRcdFx0Ly8gT2JqZWN0c1xyXG5cdFx0XHR0aGlzLmRpYWxvZyA9ICQoXCIjY29uZmlybVwiKTtcclxuXHRcdFx0dGhpcy50cmlnZ2VyID0gJChcIi5qcy1mYW5jeURpYWxvZ1wiKTtcclxuXHJcblx0XHRcdC8vIEFjdGlvbnNcclxuXHRcdFx0dGhpcy5jb25maXJtQnV0dG9uID0gXCJDbG9zZVwiO1xyXG5cdFx0XHR0aGlzLmNvbmZpcm1DaGVja2JveCA9IFwiRG9uXFwndCBzaG93IHRoaXMgYWdhaW5cIjtcclxuXHJcblx0XHRcdC8vIGNhbGxiYWNrIHRvIGhhbmRsZSBtZXNzYWdlcywgcmVnYXJkbGVzcyBvZiBzb3VyY2VcclxuXHRcdFx0Ly8gaGFuZGxlcyBjYXNlIGluIHRoZSBzaXR1YXRpb24gd2hlcmUgdGhlcmUgYXJlIG5vIG1lc3NhZ2VzXHJcblx0XHRcdC8vIG9yIG1lc3NhZ2VzIGRhdGEgaXMgZmFsc2V5XHJcblx0XHRcdGZpbmlzaGVkTG9hZGluZyA9IGZ1bmN0aW9uKG1lc3NhZ2VzKSB7XHJcblxyXG5cdFx0XHRcdC8vIGhhdmUgbWVzc2FnZXNcclxuXHRcdFx0XHRpZiAobWVzc2FnZXMgJiYgbWVzc2FnZXMubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0Ly8gc2V0cyBnbG9iYWwgYWxlcnRNZXNzYWdlc1xyXG5cdFx0XHRcdFx0YWxlcnRNZXNzYWdlcyA9IG1lc3NhZ2VzO1xyXG5cclxuXHRcdFx0XHRcdC8vIEFsZXJ0IGJ1dHRvblxyXG5cdFx0XHRcdFx0dGhpcy5hbGVydEJ1dHRvbigpO1xyXG5cdFx0XHRcdFx0Ly8gQ2hlY2sgY29va2llc1xyXG5cdFx0XHRcdFx0dGhpcy5jaGVja0Nvb2tpZXModGhpcy5tZXNzYWdlcyk7XHJcblx0XHRcdFx0Ly8gZG9uJ3QgaGF2ZSBtZXNzYWdlc1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHQvLyBpbiBhbnkgY2FzZSB0aGF0IGRvZXNuJ3QgcmVzdWx0IGluIGxvYWRpbmcsIGhpZGUgdGhlIGFsZXJ0cyBidXR0b25cclxuXHRcdFx0XHRcdHRoaXMudHJpZ2dlci5wYXJlbnQoKS5yZW1vdmUoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdC8vIG1haW50YWluIGNvbnRleHRcclxuXHRcdFx0fS5iaW5kKHRoaXMpO1xyXG5cclxuXHRcdFx0Ly8gbG9hZCBtZXNzYWdlcyBkYXRhIGZyb20gYm1jTWV0YSBnbG9iYWwgb2JqZWN0XHJcblx0XHRcdC8vIHRoaXMubG9hZE1lc3NhZ2VzRnJvbUdsb2JhbChmaW5pc2hlZExvYWRpbmcpO1xyXG5cdFx0XHQvL1xyXG5cdFx0XHQvLyAtLSBPUiAtLVxyXG5cdFx0XHQvL1xyXG5cdFx0XHQvLyBsb2FkIG1lc3NhZ2VzIGRhdGEgZnJvbSBhamF4XHJcblx0XHRcdC8vIGxvYWQgcmVsYXRpdmUgVVJMIG9uIGJtYy5jb20gb3IgaGFyZGNvZGUgVVJMIHNvdXJjZSBmb3IgdGVzdGluZyBwdXJwb3Nlc1xyXG5cdFx0XHRpZiAoIFN1cHBvcnQuSGVscGVycy5ibWNTdXBwb3J0TG9hZGVkKCkgJiYgU3VwcG9ydC5IZWxwZXJzLmJtY0FsZXJ0c0VuYWJsZWQoKSApe1xyXG5cdFx0XHRcdC8vIGxvY2FsIGRldmVsb3BtZW50OlxyXG5cdFx0XHRcdGlmICgodHlwZW9mIGJtY01ldGEuY2R4TG9jYWwgIT09ICd1bmRlZmluZWQnKSAmJiBibWNNZXRhLmNkeExvY2FsKSB7XHJcblx0XHRcdFx0XHRtZXNzYWdlc1VybCA9ICd0ZXN0L2FsZXJ0TWVzc2FnZXMuanNvbic7XHJcblx0XHRcdFx0Ly8gZGV2L3N0YWdlL3Byb2Q6XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGlmICgodHlwZW9mIGJtY01ldGEuc3VwcG9ydC5hbGVydHNVcmwgIT09ICd1bmRlZmluZWQnKSAmJiBibWNNZXRhLnN1cHBvcnQuYWxlcnRzVXJsKSB7XHJcblx0XHRcdFx0XHRcdG1lc3NhZ2VzVXJsID0gYm1jTWV0YS5zdXBwb3J0LmFsZXJ0c1VybDtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdG1lc3NhZ2VzVXJsID0gJy90ZW1wbGF0ZXMvU2VydmljZVN1cHBvcnRBbGVydHNKU09OJztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5sb2FkTWVzc2FnZXNGcm9tVXJsKGZpbmlzaGVkTG9hZGluZywgbWVzc2FnZXNVcmwpO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIHdpbGwgcmV0cmlldmUgbWVzc2FnZXMgYnkgdGhlIGJtY01ldGEgZ2xvYmFsXHJcblx0XHQvLyBsb2FkcyBvbiBtb2R1bGUgZ2xvYmFsIHZhciBhbGVydE1lc3NhZ2VzXHJcblx0XHRsb2FkTWVzc2FnZXNGcm9tR2xvYmFsOiBmdW5jdGlvbihtZXNzYWdlc0hhbmRsZXIpIHtcclxuXHRcdFx0dmFyIG1lc3NhZ2VzO1xyXG5cclxuXHRcdFx0aWYgKFN1cHBvcnQuSGVscGVycy5ibWNTdXBwb3J0TG9hZGVkKCkgJiYgdHlwZW9mIGJtY01ldGEuc3VwcG9ydC5hbGVydE1lc3NhZ2VzICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRcdG1lc3NhZ2VzID0gYm1jTWV0YS5zdXBwb3J0LmFsZXJ0TWVzc2FnZXM7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0eXBlb2YgbWVzc2FnZXNIYW5kbGVyID09PSAnZnVuY3Rpb24nKSBtZXNzYWdlc0hhbmRsZXIobWVzc2FnZXMpO1xyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBhbGxvd3MgZm9yIGFqYXhpbmcgaW4gbWVzc2FnZSBkYXRhXHJcblx0XHRsb2FkTWVzc2FnZXNGcm9tVXJsOiBmdW5jdGlvbihtZXNzYWdlc0hhbmRsZXIsIHVybCkge1xyXG5cdFx0XHQkLmFqYXgodXJsKVxyXG5cdFx0XHRcdC5kb25lKGZ1bmN0aW9uKGRhdGEpIHtcclxuXHRcdFx0XHRcdC8vIGJhc2VkIG9uIGV4YW1wbGUganNvbiwgYXNzdW1lIHJlc3BvbnNlIHBheWxvYWQgY29udGFpbnMgZGF0YSBvblxyXG5cdFx0XHRcdFx0Ly8gcHJvcGVydHkgJ3N1cHBvcnRBbGVydE1lc3NhZ2VzJ1xyXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBtZXNzYWdlc0hhbmRsZXIgPT09ICdmdW5jdGlvbicpIG1lc3NhZ2VzSGFuZGxlcihkYXRhLnN1cHBvcnRBbGVydE1lc3NhZ2VzKTtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdC5mYWlsKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBtZXNzYWdlc0hhbmRsZXIgPT09ICdmdW5jdGlvbicpIG1lc3NhZ2VzSGFuZGxlcihudWxsKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdH0sXHJcblxyXG5cdFx0b3BlbkFsZXJ0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dGhpcy5mYW5jeUNvbmZpZyh0aGlzLm1lc3NhZ2VzKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0YWxlcnRCdXR0b246IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aGlzLnRyaWdnZXIub24oXCJjbGlja1wiLCAkLnByb3h5KHRoaXMub3BlbkFsZXJ0LCB0aGlzKSk7XHJcblx0XHR9LFxyXG5cclxuXHRcdGNoZWNrQ29va2llczogZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdFx0XHQvLyBDaGVjayBpZiBjb29raWVzIG1hdGNoIElEc1xyXG5cdFx0XHR2YXIgc2hvd0FsZXJ0ID0gZmFsc2U7XHJcblx0XHRcdGZvciAoaSA9IDA7IGkgPCBhbGVydE1lc3NhZ2VzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0Ly8gSWYgbm8gY29va2llcyB0aGVuIHNob3cgYWxlcnRcclxuXHRcdFx0XHRpZiAoJC5jb29raWUoYWxlcnRNZXNzYWdlc1tpXS5pZCkgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdFx0c2hvd0FsZXJ0ID0gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHNob3dBbGVydCkge1xyXG5cdFx0XHRcdHRoaXMub3BlbkFsZXJ0KCk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0ZmFuY3lDb25maWc6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHRcdFx0JC5mYW5jeWJveCh0aGlzLmRpYWxvZywge1xyXG5cdFx0XHRcdGF1dG9XaWR0aDogZmFsc2UsXHJcblx0XHRcdFx0bWluSGVpZ2h0OiA0MDAsXHJcblx0XHRcdFx0bWF4V2lkdGg6IDc0NSxcclxuXHRcdFx0XHRwYWRkaW5nOiAwLFxyXG5cdFx0XHRcdHRwbDoge1xyXG5cdFx0XHRcdFx0d3JhcDogJzxkaXYgY2xhc3M9XCJmYW5jeWJveC13cmFwIGZhbmN5Ym94LWRpYWxvZ1wiIHRhYkluZGV4PVwiLTFcIj48ZGl2IGNsYXNzPVwiZmFuY3lib3gtc2tpblwiPjxkaXYgY2xhc3M9XCJmYW5jeWJveC1vdXRlclwiPjxkaXYgY2xhc3M9XCJmYW5jeWJveC10aXRsZVwiPkFsZXJ0IE5vdGlmaWNhdGlvbnM8L2Rpdj48ZGl2IGNsYXNzPVwiZmFuY3lib3gtaW5uZXJcIj48L2Rpdj48L2Rpdj48L2Rpdj48L2Rpdj4nLFxyXG5cdFx0XHRcdFx0ZXJyb3I6ICc8cCBjbGFzcz1cImZhbmN5Ym94LWVycm9yXCI+VGhlIHJlcXVlc3RlZCBjb250ZW50IGNhbm5vdCBiZSBsb2FkZWQuPGJyLz5QbGVhc2UgdHJ5IGFnYWluIGxhdGVyLjwvcD4nXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRoZWxwZXJzOiB7XHJcblx0XHRcdFx0XHRvdmVybGF5OiB7XHJcblx0XHRcdFx0XHRcdGNsb3NlQ2xpY2s6IHRydWUsIC8vIGlmIHRydWUsIGZhbmN5Qm94IHdpbGwgYmUgY2xvc2VkIHdoZW4gdXNlciBjbGlja3Mgb24gdGhlIG92ZXJsYXlcclxuXHRcdFx0XHRcdFx0c3BlZWRPdXQ6IDIwMCwgLy8gZHVyYXRpb24gb2YgZmFkZU91dCBhbmltYXRpb25cclxuXHRcdFx0XHRcdFx0c2hvd0Vhcmx5OiB0cnVlLCAvLyBpbmRpY2F0ZXMgaWYgc2hvdWxkIGJlIG9wZW5lZCBpbW1lZGlhdGVseSBvciB3YWl0IHVudGlsIHRoZSBjb250ZW50IGlzIHJlYWR5XHJcblx0XHRcdFx0XHRcdGNzczoge30sIC8vIGN1c3RvbSBDU1MgcHJvcGVydGllc1xyXG5cdFx0XHRcdFx0XHRsb2NrZWQ6IHRydWUgLy8gaWYgdHJ1ZSwgdGhlIGNvbnRlbnQgd2lsbCBiZSBsb2NrZWQgaW50byBvdmVybGF5XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRiZWZvcmVTaG93OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdC8vIEFkZCBjb250YWluZXJzXHJcblx0XHRcdFx0XHR0aGlzLmNvbnRlbnQuYXBwZW5kKFwiPGRpdiBjbGFzcz0nbWVzc2FnZXMnPjwvZGl2PjxkaXYgY2xhc3M9J2FjdGlvbic+PC9kaXY+XCIpO1xyXG5cdFx0XHRcdFx0Ly8gQWRkIG1lc3NhZ2VzXHJcblx0XHRcdFx0XHR0aGlzLm1lc3NhZ2VzID0gdGhpcy5jb250ZW50LmZpbmQoXCIubWVzc2FnZXNcIik7XHJcblx0XHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgYWxlcnRNZXNzYWdlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0XHR0aGlzLm1lc3NhZ2VzLmFwcGVuZChcIjxoMyBjbGFzcz0ndGl0bGUnPlwiICsgYWxlcnRNZXNzYWdlc1tpXS50aXRsZSArIFwiPC9oMz5cIik7XHJcblx0XHRcdFx0XHRcdHRoaXMubWVzc2FnZXMuYXBwZW5kKFwiPHAgY2xhc3M9J21lc3NhZ2UnPlwiICsgYWxlcnRNZXNzYWdlc1tpXS5tZXNzYWdlICsgXCI8L3A+XCIpO1xyXG5cdFx0XHRcdFx0XHRpZiAoYWxlcnRNZXNzYWdlc1tpXS5saW5rKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5tZXNzYWdlcy5hcHBlbmQoJzxwIGNsYXNzPVwibGlua1wiPjxhIGhyZWY9XCInICsgYWxlcnRNZXNzYWdlc1tpXS51cmwgKyAnXCI+JyArIGFsZXJ0TWVzc2FnZXNbaV0ubGluayArICc8L2E+PC9wPicpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQvLyBBZGQgbW9iaWxlIGJ1dHRvblxyXG5cdFx0XHRcdFx0dGhpcy5tZXNzYWdlcy5hcHBlbmQoJzxwIHN0eWxlPVwidGV4dC1hbGlnbjpyaWdodFwiPjxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYWN0aW9uLWJ1dHRvblwiIHZhbHVlPVwiJyArIFN1cHBvcnQuQWxlcnRzLmNvbmZpcm1CdXR0b24gKyAnXCIvPjwvcD4nKTtcclxuXHRcdFx0XHRcdC8vIEFkZCBjb250cm9sc1xyXG5cdFx0XHRcdFx0dGhpcy5jb250ZW50LmZpbmQoXCIuYWN0aW9uXCIpLmFwcGVuZCgnPGlucHV0IHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBhY3Rpb24tYnV0dG9uXCIgdmFsdWU9XCInICsgU3VwcG9ydC5BbGVydHMuY29uZmlybUJ1dHRvbiArICdcIi8+PGxhYmVsIGNsYXNzPVwiYWN0aW9uLWNoZWNrYm94XCI+PGlucHV0IHR5cGU9XCJjaGVja2JveFwiIC8+JyArIFN1cHBvcnQuQWxlcnRzLmNvbmZpcm1DaGVja2JveCArICc8L2xhYmVsPicpO1xyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0YWZ0ZXJTaG93OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdHZhciBhbGVydEIgPSB0aGlzLmNvbnRlbnQuZmluZChcIi5hY3Rpb24tYnV0dG9uXCIpLFxyXG5cdFx0XHRcdFx0XHRhY3Rpb25CID0gdGhpcy5jb250ZW50LmZpbmQoXCIuYWN0aW9uIC5hY3Rpb24tYnV0dG9uXCIpLFxyXG5cdFx0XHRcdFx0XHRhbGVydEMgPSB0aGlzLmNvbnRlbnQuZmluZChcIi5hY3Rpb24tY2hlY2tib3ggaW5wdXRcIiksXHJcblx0XHRcdFx0XHRcdGFsZXJ0WCA9ICQoJy5mYW5jeWJveC1kaWFsb2cgLmZhbmN5Ym94LWNsb3NlJyk7XHJcblx0XHRcdFx0XHRjbG9zZURpYWxvZyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHQvLyBDcmVhdGUgY29va2llIGlmIGNoZWNrYm94IGlzIGNoZWNrZWRcclxuXHRcdFx0XHRcdFx0aWYgKGFsZXJ0Qy5pcygnOmNoZWNrZWQnKSkge1xyXG5cdFx0XHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBhbGVydE1lc3NhZ2VzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQkLmNvb2tpZShhbGVydE1lc3NhZ2VzW2ldLmlkLCBhbGVydE1lc3NhZ2VzW2ldLmlkLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGV4cGlyZXM6IDM2NSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0cGF0aDogXCIvXCIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdGRvbWFpbjogXCIuYm1jLmNvbVwiXHJcblx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0JC5mYW5jeWJveC5jbG9zZSgpO1xyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdC8vIENoZWNrIGlmIHRleHQgb3ZlcmZsb3dzIG1lc3NhZ2UgY29udGFpbmVyXHJcblx0XHRcdFx0XHRpZiAodGhpcy5tZXNzYWdlc1swXS5zY3JvbGxIZWlnaHQgPiB0aGlzLm1lc3NhZ2VzLmlubmVySGVpZ2h0KCkpIHtcclxuXHRcdFx0XHRcdFx0YWN0aW9uQi5wcm9wKFwiZGlzYWJsZWRcIiwgdHJ1ZSk7XHJcblx0XHRcdFx0XHRcdHRoaXMubWVzc2FnZXMuYmluZCgnc2Nyb2xsJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKCQodGhpcylbMF0uc2Nyb2xsSGVpZ2h0IC0gJCh0aGlzKS5zY3JvbGxUb3AoKSA8PSAkKHRoaXMpLmlubmVySGVpZ2h0KCkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGFjdGlvbkIucHJvcChcImRpc2FibGVkXCIsIGZhbHNlKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Ly8gQ2xvc2UgZGlhbG9nIHdoZW4gYnV0dG9ucyBhcmUgY2xpY2tlZFxyXG5cdFx0XHRcdFx0YWxlcnRCLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdGNsb3NlRGlhbG9nKCk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdGFsZXJ0WC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRjbG9zZURpYWxvZygpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRhZnRlckNsb3NlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdC8vIFJlbW92ZSBkaWFsb2cgY29udGVudFxyXG5cdFx0XHRcdFx0dGhpcy5jb250ZW50Lmh0bWwoXCJcIik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHRTdXBwb3J0LkdldHRpbmdTdGFydGVkQ2Fyb3VzZWwgPSB7XHJcblx0XHRpbml0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0JCgnLnN1cHBvcnQtZ2V0dGluZy1zdGFydGVkLXRvcGljcy5jYXJvdXNlbCAudG9waWNzJykub3dsQ2Fyb3VzZWwoe1xyXG5cdFx0XHRcdGl0ZW1zOiAxLFxyXG5cdFx0XHRcdG5hdjogZmFsc2VcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0U3VwcG9ydC5Ub2dnbGVTZWFyY2hBcmVhcyA9IHtcclxuXHJcblx0XHRzZWFyY2hBcmVhc1NlbGVjdG9yOiAnLmpzLXN1cHBvcnQtc2VhcmNoLWFyZWEnLFxyXG5cdFx0dG9nZ2xlQWN0aW9uU2VsZWN0b3I6ICcuanMtc3VwcG9ydC1zZWFyY2gtdG9nZ2xlJyxcclxuXHRcdHRvZ2dsZUFjdGlvbkxhYmVsU2VsZWN0b3I6ICcuanMtc3VwcG9ydC1zZWFyY2gtdG9nZ2xlJyxcclxuXHRcdHRvZ2dsZUxhYmVsVGV4dDoge1xyXG5cdFx0XHRleHBhbmQ6ICdNb3JlIFJlc291cmNlcycsXHJcblx0XHRcdGNvbGxhcHNlOiAnQ29sbGFwc2UnXHJcblx0XHR9LFxyXG5cdFx0dG9nZ2xhYmxlQXJlYXM6IG51bGwsXHJcblx0XHRlbGVtZW50c1Nob3duOiBmYWxzZSxcclxuXHRcdGhpZGVMYXN0UXR5OiA0LFxyXG5cclxuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdFx0Ly8gb25seSBpbml0aWFsaXplIGlmIC5qcy1zdXBwb3J0LXNlYXJjaC10b2dnbGUtZXh0cmEgZXhpc3RzXHJcblx0XHRcdGlmICgkKCcuanMtc3VwcG9ydC1zZWFyY2gtdG9nZ2xlLWV4dHJhJykubGVuZ3RoID09PSAwKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBTRVRVUFxyXG5cdFx0XHR0aGlzLmZpbmRUb2dnbGFibGVFbGVtZW50cygpO1xyXG5cdFx0XHR0aGlzLmFkZEhhbmRsZXJzKCk7XHJcblxyXG5cdFx0XHQvLyBJTklUSUFMIEFDVElPTlNcclxuXHRcdFx0dGhpcy5hY3Rpb25zLmhpZGUodGhpcy5oZWxwZXJzLmhpZGVFbGVtZW50c0luc3RhbnQpO1xyXG5cdFx0XHR0aGlzLmFjdGlvbnMudXBkYXRlTGFiZWwodGhpcy50b2dnbGVMYWJlbFRleHQuZXhwYW5kKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0aGVscGVyczoge1xyXG5cdFx0XHRzaG93RWxlbWVudHNGYWRlOiBmdW5jdGlvbihlbGVtZW50cykge1xyXG5cdFx0XHRcdHJldHVybiAkKGVsZW1lbnRzKS5mYWRlSW4oKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0c2hvd0VsZW1lbnRzSW5zdGFudDogZnVuY3Rpb24oZWxlbWVudHMpIHtcclxuXHRcdFx0XHRyZXR1cm4gJChlbGVtZW50cykuc2hvdygpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRoaWRlRWxlbWVudHNGYWRlOiBmdW5jdGlvbihlbGVtZW50cykge1xyXG5cdFx0XHRcdHJldHVybiAkKGVsZW1lbnRzKS5mYWRlT3V0KCk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGhpZGVFbGVtZW50c0luc3RhbnQ6IGZ1bmN0aW9uKGVsZW1lbnRzKSB7XHJcblx0XHRcdFx0cmV0dXJuICQoZWxlbWVudHMpLmhpZGUoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHRmaW5kVG9nZ2xhYmxlRWxlbWVudHM6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgc2VhcmNoQXJlYXMgPSAkKHRoaXMuc2VhcmNoQXJlYXNTZWxlY3Rvcik7XHJcblx0XHRcdHZhciBzbGljZUZyb20gPSBzZWFyY2hBcmVhcy5sZW5ndGggLSB0aGlzLmhpZGVMYXN0UXR5O1xyXG5cdFx0XHR2YXIgc2xpY2VUbyA9IHNlYXJjaEFyZWFzLmxlbmd0aDtcclxuXHRcdFx0dGhpcy50b2dnbGFibGVBcmVhcyA9IHNlYXJjaEFyZWFzLnNsaWNlKHNsaWNlRnJvbSwgc2xpY2VUbyk7XHJcblx0XHR9LFxyXG5cclxuXHRcdGFjdGlvbnM6IHtcclxuXHRcdFx0dG9nZ2xlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRpZiAoU3VwcG9ydC5Ub2dnbGVTZWFyY2hBcmVhcy5lbGVtZW50c1Nob3duKSB7XHJcblx0XHRcdFx0XHR0aGlzLmhpZGUoU3VwcG9ydC5Ub2dnbGVTZWFyY2hBcmVhcy5oZWxwZXJzLmhpZGVFbGVtZW50c0ZhZGUpO1xyXG5cdFx0XHRcdFx0dGhpcy51cGRhdGVMYWJlbChTdXBwb3J0LlRvZ2dsZVNlYXJjaEFyZWFzLnRvZ2dsZUxhYmVsVGV4dC5leHBhbmQpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLnNob3coU3VwcG9ydC5Ub2dnbGVTZWFyY2hBcmVhcy5oZWxwZXJzLnNob3dFbGVtZW50c0ZhZGUpO1xyXG5cdFx0XHRcdFx0dGhpcy51cGRhdGVMYWJlbChTdXBwb3J0LlRvZ2dsZVNlYXJjaEFyZWFzLnRvZ2dsZUxhYmVsVGV4dC5jb2xsYXBzZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRzaG93OiBmdW5jdGlvbihlbGVtZW50c0hhbmRsZXIpIHtcclxuXHRcdFx0XHRpZiAodHlwZW9mIGVsZW1lbnRzSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHRcdFx0ZWxlbWVudHNIYW5kbGVyKCQoU3VwcG9ydC5Ub2dnbGVTZWFyY2hBcmVhcy50b2dnbGFibGVBcmVhcykpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0U3VwcG9ydC5Ub2dnbGVTZWFyY2hBcmVhcy5lbGVtZW50c1Nob3duID0gdHJ1ZTtcclxuXHRcdFx0fSxcclxuXHRcdFx0aGlkZTogZnVuY3Rpb24oZWxlbWVudHNIYW5kbGVyKSB7XHJcblx0XHRcdFx0aWYgKHR5cGVvZiBlbGVtZW50c0hhbmRsZXIgPT09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0XHRcdGVsZW1lbnRzSGFuZGxlcigkKFN1cHBvcnQuVG9nZ2xlU2VhcmNoQXJlYXMudG9nZ2xhYmxlQXJlYXMpKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFN1cHBvcnQuVG9nZ2xlU2VhcmNoQXJlYXMuZWxlbWVudHNTaG93biA9IGZhbHNlO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHR1cGRhdGVMYWJlbDogZnVuY3Rpb24odGV4dCkge1xyXG5cdFx0XHRcdCQoU3VwcG9ydC5Ub2dnbGVTZWFyY2hBcmVhcy50b2dnbGVBY3Rpb25MYWJlbFNlbGVjdG9yKS5odG1sKHRleHQpO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHJcblx0XHRhZGRIYW5kbGVyczogZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQodGhpcy50b2dnbGVBY3Rpb25TZWxlY3Rvcikub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHR0aGlzLmFjdGlvbnMudG9nZ2xlKCk7XHJcblx0XHRcdH0uYmluZCh0aGlzKSk7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0U3VwcG9ydC5NZW51ID0ge1xyXG5cclxuXHRcdGRlc2t0b3BCcmVha3BvaW50OiA5NjAsXHJcblxyXG5cdFx0Ly8gdG91Y2hIYW5kbGVycyByZXF1aXJlIGEgYGNsaWNrYCB0byB0cmlnZ2VyIGEgbWVudVxyXG5cdFx0dG91Y2hIYW5kbGVyczogZnVuY3Rpb24oYWRhcHRlcikge1xyXG5cdFx0XHR2YXIgbWVudSA9IGFkYXB0ZXIubWVudTtcclxuXHRcdFx0JChtZW51LnN1Yk1lbnVUcmlnZ2VyU2VsZWN0b3IpLm9uKHtcclxuXHRcdFx0XHQnY2xpY2snOiBmdW5jdGlvbihlKSB7XHJcblx0XHRcdFx0XHRpZiAoISQobWVudS5zdWJNZW51U2VsZWN0b3IpLmhhcygkKGUudGFyZ2V0KSkpIHtcclxuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0dmFyIHN1Yk1lbnUgPSBtZW51LmZpbmRNZW51RnJvbVRhcmdldChlLnRhcmdldCk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKHN1Yk1lbnUuaGFzQ2xhc3MobWVudS5leHBhbmRlZENsYXNzKSkge1xyXG5cdFx0XHRcdFx0XHRtZW51LmNvbGxhcHNlTWVudShzdWJNZW51KTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdG1lbnUuY29sbGFwc2VBbGxTdWJNZW51cygpO1xyXG5cdFx0XHRcdFx0XHRtZW51LmV4cGFuZE1lbnUoc3ViTWVudSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gIG5vVG91Y2hIYW5kbGVycyBhc3N1bWVzIGEgbW91c2UsIGFuZCB1c2VzIGEgYGhvdmVyYCB0byB0cmlnZ2VyIGEgbWVudVxyXG5cdFx0bm9Ub3VjaEhhbmRsZXJzOiBmdW5jdGlvbihhZGFwdGVyKSB7XHJcblx0XHRcdHZhciBtZW51ID0gYWRhcHRlci5tZW51O1xyXG5cdFx0XHQkKG1lbnUuc3ViTWVudVRyaWdnZXJTZWxlY3Rvcikub24oe1xyXG5cdFx0XHRcdCdtb3VzZWVudGVyJzogZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdFx0bWVudS5jb2xsYXBzZUFsbFN1Yk1lbnVzKCk7XHJcblx0XHRcdFx0XHR2YXIgc3ViTWVudSA9IG1lbnUuZmluZE1lbnVGcm9tVGFyZ2V0KGUudGFyZ2V0KTtcclxuXHRcdFx0XHRcdG1lbnUuZXhwYW5kTWVudShzdWJNZW51KTtcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdCdtb3VzZWxlYXZlJzogZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdFx0bWVudS5jb2xsYXBzZUFsbFN1Yk1lbnVzKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gUmVnaXN0ZXIgY2xpY2tzIHRoYXQgaGFwcGVuIG91dHNpZGUgdGhlIG1lbnUsIGFuZCBkaXNtaXNzIHRoZSBtZW51XHJcblx0XHRjb2xsYXBzZU91dHNpZGVIYW5kbGVyOiBmdW5jdGlvbihhZGFwdGVyKSB7XHJcblx0XHRcdHZhciBtZW51ID0gYWRhcHRlci5tZW51O1xyXG5cdFx0XHR2YXIgbWVudUVsZW1lbnQgPSAkKG1lbnUubWVudUVsZW1lbnQpO1xyXG5cclxuXHRcdFx0JCgnYm9keScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHRpZiAoISQoZS50YXJnZXQpLnBhcmVudHMoKS5hZGRCYWNrKCkuaXMobWVudUVsZW1lbnQpKSB7XHJcblx0XHRcdFx0XHRtZW51LmNvbGxhcHNlQWxsU3ViTWVudXMoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBib3RoIGB0b3VjaEhhbmRsZXJzYCBhbmQgYG5vVG91Y2hIYW5kbGVyc2AgdXNlIHRoZSBzYW1lXHJcblx0XHQvLyBlbGVtZW50IHRvIGF0dGFjaCBoYW5kbGVycyB0bywgdGhlcmVmb3JlIGNhbiB1c2UgdGhlIHNhbWVcclxuXHRcdC8vIGZ1bmN0aW9uIHRvIHJlbW92ZSB0aGUgaGFuZGxlcnNcclxuXHRcdGRlc3RvcnlIYW5kbGVyczogZnVuY3Rpb24oYWRhcHRlcikge1xyXG5cdFx0XHR2YXIgbWVudSA9IGFkYXB0ZXIubWVudTtcclxuXHRcdFx0JChtZW51LnN1Yk1lbnVUcmlnZ2VyU2VsZWN0b3IpLm9mZigpO1xyXG5cdFx0fSxcclxuXHJcblx0XHRnZXRNZW51OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0Ly8gZ2VuZXJhdGUgbWVudSBiYXNlZCBvbiBzZWxlY3RvclxyXG5cdFx0XHR2YXIgbWVudSA9IG1lbnVqcy5nZW5lcmF0ZU1lbnUoe1xyXG5cdFx0XHRcdG1lbnVFbGVtZW50OiAkKCcuc3VwcG9ydC1tZW51JylcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gbWVudTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Z2V0QWRhcHRlcnM6IGZ1bmN0aW9uKG1lbnUpIHtcclxuXHRcdFx0dmFyIHN1cHBvcnRNZW51ID0gdGhpcztcclxuXHJcblx0XHRcdC8vIGNyZWF0ZSBkZXNrdG9wIGFkYXB0ZXJcclxuXHRcdFx0dmFyIGRlc2t0b3BBZGFwdGVyID0gbWVudUFkYXB0ZXIuZ2VuZXJhdGVNZW51QWRhcHRlcihtZW51LCB7XHJcblx0XHRcdFx0aGFuZGxlcnM6IFt7XHJcblx0XHRcdFx0XHRzZXR1cDogc3VwcG9ydE1lbnUudG91Y2hIYW5kbGVycyxcclxuXHRcdFx0XHRcdGRlc3Ryb3k6IHN1cHBvcnRNZW51LmRlc3RvcnlIYW5kbGVyc1xyXG5cdFx0XHRcdH0sIHtcclxuXHRcdFx0XHRcdHNldHVwOiBzdXBwb3J0TWVudS5jb2xsYXBzZU91dHNpZGVIYW5kbGVyLFxyXG5cdFx0XHRcdFx0ZGVzdHJveTogc3VwcG9ydE1lbnUuZGVzdG9yeUhhbmRsZXJzXHJcblx0XHRcdFx0fV0sXHJcblx0XHRcdFx0aW5pdDogZnVuY3Rpb24oYWRhcHRlcikge1xyXG5cdFx0XHRcdFx0JChhZGFwdGVyLm1lbnUubWVudUVsZW1lbnQpLmFkZENsYXNzKCdkZXNrdG9wJyk7XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHR0ZWFyZG93bjogZnVuY3Rpb24oYWRhcHRlcikge1xyXG5cdFx0XHRcdFx0JChhZGFwdGVyLm1lbnUubWVudUVsZW1lbnQpLnJlbW92ZUNsYXNzKCdkZXNrdG9wJyk7XHJcblx0XHRcdFx0XHRhZGFwdGVyLm1lbnUuY29sbGFwc2VBbGxTdWJNZW51cygpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQvLyBjcmVhdGUgbW9iaWxlIGFkYXB0ZXJcclxuXHRcdFx0Ly8gbW9iaWxlQWRhcHRlciBzdGFydGluZyBwb2ludCBpcyBhIGNvcHkgb2YgZGVza3RvcCBhZGFwdGVyXHJcblx0XHRcdHZhciBtb2JpbGVBZGFwdGVyID0gbWVudUFkYXB0ZXIuZ2VuZXJhdGVNZW51QWRhcHRlcihtZW51LCB7XHJcblx0XHRcdFx0aGFuZGxlcnM6IFt7XHJcblx0XHRcdFx0XHRzZXR1cDogc3VwcG9ydE1lbnUudG91Y2hIYW5kbGVycyxcclxuXHRcdFx0XHRcdGRlc3Ryb3k6IGZ1bmN0aW9uKGFkYXB0ZXIpIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHN1cHBvcnRNZW51LmRlc3RvcnlIYW5kbGVycyhhZGFwdGVyKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XSwgLy8gYXNzdW1lIG5vIGhvdmVyIGludGVyYWN0aW9uc1xyXG5cdFx0XHRcdGluaXQ6IGZ1bmN0aW9uKGFkYXB0ZXIpIHtcclxuXHRcdFx0XHRcdCQoYWRhcHRlci5tZW51Lm1lbnVFbGVtZW50KS5hZGRDbGFzcygnbW9iaWxlJyk7XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHR0ZWFyZG93bjogZnVuY3Rpb24oYWRhcHRlcikge1xyXG5cdFx0XHRcdFx0JChhZGFwdGVyLm1lbnUubWVudUVsZW1lbnQpLnJlbW92ZUNsYXNzKCdtb2JpbGUnKTtcclxuXHRcdFx0XHRcdGFkYXB0ZXIubWVudS5jb2xsYXBzZUFsbFN1Yk1lbnVzKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHZhciBhbGxBZGFwdGVycyA9IHtcclxuXHRcdFx0XHRtb2JpbGU6IG1vYmlsZUFkYXB0ZXIsXHJcblx0XHRcdFx0ZGVza3RvcDogZGVza3RvcEFkYXB0ZXJcclxuXHRcdFx0fTtcclxuXHRcdFx0cmV0dXJuIGFsbEFkYXB0ZXJzO1xyXG5cdFx0fSxcclxuXHJcblx0XHRnZXRBZGFwdGVyTWFuYWdlcjogZnVuY3Rpb24obWVudSwgYWRhcHRlcnMpIHtcclxuXHRcdFx0dmFyIGFkYXB0ZXJNYW5hZ2VyID0gZ2VuZXJhdGVNZW51QWRhcHRlck1hbmFnZXIoKTtcclxuXHRcdFx0cmV0dXJuIGFkYXB0ZXJNYW5hZ2VyO1xyXG5cdFx0fSxcclxuXHJcblx0XHRpbml0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIG1lbnUgPSB0aGlzLmdldE1lbnUoKTtcclxuXHRcdFx0dmFyIGFkYXB0ZXJzID0gdGhpcy5nZXRBZGFwdGVycyhtZW51KTtcclxuXHRcdFx0dmFyIGFkYXB0ZXJNYW5hZ2VyID0gdGhpcy5nZXRBZGFwdGVyTWFuYWdlcihtZW51LCBhZGFwdGVycyk7XHJcblxyXG5cdFx0XHR2YXIgaXNEZXNrdG9wID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0Ly8gaW4gY2FzZSBtZWRpYSBxdWVyaWVzIGFyZW4ndCBzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIsIHRoZW4gZGVmYXVsdCB0byB1c2luZyB0aGUgd2lkdGggb2YgdGhlIHdpbmRvd1xyXG5cdFx0XHRcdHJldHVybiBNb2Rlcm5penIubXEoJyhtaW4td2lkdGg6ICcgKyBTdXBwb3J0Lk1lbnUuZGVza3RvcEJyZWFrcG9pbnQgKyAncHgpJykgfHwgJCh3aW5kb3cpLndpZHRoKCkgPj0gU3VwcG9ydC5NZW51LmRlc2t0b3BCcmVha3BvaW50O1xyXG5cdFx0XHR9O1xyXG5cdFx0XHR2YXIgaXNNb2JpbGUgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXR1cm4gIWlzRGVza3RvcCgpO1xyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0Ly8gQWRkIGFkYXB0ZXIgZm9yIHZhcmlvdXMgY29uZGl0aW9ucywgb24gdGhlIGFkYXB0ZXIgbWFuYWdlclxyXG5cdFx0XHRhZGFwdGVyTWFuYWdlci5hZGRDb25kaXRpb24oZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmV0dXJuIGlzRGVza3RvcCgpO1xyXG5cdFx0XHR9LCBhZGFwdGVycy5kZXNrdG9wKTtcclxuXHJcblx0XHRcdGFkYXB0ZXJNYW5hZ2VyLmFkZENvbmRpdGlvbihmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXR1cm4gaXNNb2JpbGUoKTtcclxuXHRcdFx0fSwgYWRhcHRlcnMubW9iaWxlKTtcclxuXHJcblx0XHRcdGFkYXB0ZXJNYW5hZ2VyLmluaXQoKTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHRTdXBwb3J0Lk1vYmlsZVRvZ2dsZUhlYWRlciA9IHtcclxuXHJcblx0XHRiYXNlSGVpZ2h0OiBudWxsLFxyXG5cdFx0bWF4SGVpZ2h0OiAxNTAwLFxyXG5cdFx0YnJlYWtwb2ludFRvZ2dsZTogOTYwLFxyXG5cclxuXHRcdGFjdGlvbnM6IHtcclxuXHRcdFx0b3BlbjogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0JCgnLnN1cHBvcnQtaGVhZGVyJykuYWRkQ2xhc3MoJ2V4cGFuZGVkJyk7XHJcblx0XHRcdFx0JCgnLnN1cHBvcnQtaGVhZGVyJykuY3NzKCdtYXgtaGVpZ2h0JywgJzEyMDBweCcpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRjbG9zZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dGhpcy5zZXRIZWlnaHRBc0Jhc2VIZWlnaHQoKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0c2V0SGVpZ2h0QXNCYXNlSGVpZ2h0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQkKCcuc3VwcG9ydC1oZWFkZXInKS5jc3MoJ21heC1oZWlnaHQnLCBTdXBwb3J0Lk1vYmlsZVRvZ2dsZUhlYWRlci5iYXNlSGVpZ2h0ICsgJ3B4Jyk7XHJcblxyXG5cdFx0XHRcdC8vIGJ5IGRlZmF1bHQgb3RoZXIgYnJvd3NlcnMgd2lsbCB0cmlnZ2VyIGNsb3NlIG9uIGFkZEhhbmRsZXJzIGF0IHRoZSBlbmQgb2YgdGhlIGNzcyB0cmFuc2l0aW9uXHJcblx0XHRcdFx0Ly8gaWU4IHdpbGwgbmV2ZXIgdHJpZ2dlciB0aGUgZW5kIGNzcyB0cmFuc2l0aW9uIGV2ZW50IGFzIGl0IGRvZXNuJ3Qgc3VwcG9ydCB0cmFuc2l0aW9uc1xyXG5cdFx0XHRcdGlmICgkKCdodG1sJykuaGFzQ2xhc3MoJ29sZGllJykpIHtcclxuXHRcdFx0XHRcdCQoJy5zdXBwb3J0LWhlYWRlcicpLnRyaWdnZXIoJ3RyYW5zaXRpb25lbmQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdGFwcGx5SWZNb2JpbGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdC8vIGlmIGRlc2t0b3AsIHJlbW92ZSBtYXgtaGVpZ2h0IGFuZCBleHBhbmRlZCBjbGFzc1xyXG5cdFx0XHRcdC8vIGluIGNhc2UgbWVkaWEgcXVlcmllcyBhcmVuJ3Qgc3VwcG9ydGVkIGJ5IHRoZSBicm93c2VyLCB0aGVuIGRlZmF1bHQgdG8gdXNpbmcgdGhlIHdpZHRoIG9mIHRoZSB3aW5kb3dcclxuXHRcdFx0XHR2YXIgaXNEZXNrdG9wID0gTW9kZXJuaXpyLm1xKCcobWluLXdpZHRoOiAnICsgU3VwcG9ydC5Nb2JpbGVUb2dnbGVIZWFkZXIuYnJlYWtwb2ludFRvZ2dsZSArICdweCknKSB8fCAkKHdpbmRvdykud2lkdGgoKSA+PSBTdXBwb3J0Lk1lbnUuZGVza3RvcEJyZWFrcG9pbnQ7XHJcblx0XHRcdFx0aWYgKGlzRGVza3RvcCkge1xyXG5cdFx0XHRcdFx0JCgnLnN1cHBvcnQtaGVhZGVyJykuY3NzKCdtYXgtaGVpZ2h0JywgJycpO1xyXG5cdFx0XHRcdFx0JCgnLnN1cHBvcnQtaGVhZGVyJykucmVtb3ZlQ2xhc3MoJ2V4cGFuZGVkJyk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGlmICgkKCcuc3VwcG9ydC1oZWFkZXInKS5oYXNDbGFzcygnZXhwYW5kZWQnKSkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLm9wZW4oKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuY2xvc2UoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0Y2FsY0Jhc2VIZWlnaHQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQvLyBpZiB0aGUgaGVpZ2h0IHNob3VsZCBiZSBkZXRlcm1pbmVkIGR5bmFtaWNhbGx5XHJcblx0XHRcdC8vIHRoaXMuYmFzZUhlaWdodCA9ICQoJy5sb2dvLWJhci1jb250YWluZXInKS5oZWlnaHQoKTtcclxuXHJcblx0XHRcdHRoaXMuYmFzZUhlaWdodCA9IDkwO1xyXG5cdFx0fSxcclxuXHJcblx0XHRhZGRIYW5kbGVyczogZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0XHQkKCcuanMtdG9nZ2xlLW9wZW4taGVhZGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0aWYgKCQoJy5zdXBwb3J0LWhlYWRlcicpLmhhc0NsYXNzKCdleHBhbmRlZCcpKSB7XHJcblx0XHRcdFx0XHRTdXBwb3J0Lk1vYmlsZVRvZ2dsZUhlYWRlci5hY3Rpb25zLmNsb3NlKCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFN1cHBvcnQuTW9iaWxlVG9nZ2xlSGVhZGVyLmFjdGlvbnMub3BlbigpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQkKCcuc3VwcG9ydC1oZWFkZXInKS5vbigndHJhbnNpdGlvbmVuZCB3ZWJraXRUcmFuc2l0aW9uRW5kIG9UcmFuc2l0aW9uRW5kIE1TVHJhbnNpdGlvbkVuZCcsIGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdFx0XHQvLyB0cmFuc2l0aW9uIGhhcyBlbmRlZCBhbmQgYXQgZW5kIGhlaWdodCBwb3NpdGlvblxyXG5cdFx0XHRcdGlmICgkKCcuc3VwcG9ydC1oZWFkZXInKS5oZWlnaHQoKSA9PT0gU3VwcG9ydC5Nb2JpbGVUb2dnbGVIZWFkZXIuYmFzZUhlaWdodCB8fCAkKCdodG1sJykuaGFzQ2xhc3MoJ29sZGllJykpIHtcclxuXHRcdFx0XHRcdCQoJy5zdXBwb3J0LWhlYWRlcicpLnJlbW92ZUNsYXNzKCdleHBhbmRlZCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHRTdXBwb3J0Lk1vYmlsZVRvZ2dsZUhlYWRlci5hY3Rpb25zLmFwcGx5SWZNb2JpbGUoKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0fSxcclxuXHJcblx0XHRpbml0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdFx0XHR3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRzZWxmLmNhbGNCYXNlSGVpZ2h0KCk7XHJcblx0XHRcdFx0c2VsZi5hZGRIYW5kbGVycygpO1xyXG5cdFx0XHRcdHNlbGYuYWN0aW9ucy5hcHBseUlmTW9iaWxlKCk7XHJcblx0XHRcdH0sIDApO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdC8vIHVzZWQgdG8gYXR0YWNoIHRoZSBjbGFzcyBvbiBsb2FkIHRvIHRyYW5zaXRpb24gdGhlIGZpeGVkIHNpZGUgaW50byB2aWV3XHJcblx0U3VwcG9ydC5TbGlkZUluU3VwcG9ydENoYXRCdXR0b24gPSB7XHJcblx0XHRpbml0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyICRjaGF0Tm93ID0gJCgnLnN1cHBvcnQtY2hhdC1ub3csIC5jaGF0LW5vdy1saW5rJyk7XHJcblx0XHRcdGlmICgkY2hhdE5vdy5sZW5ndGgpIHtcclxuXHRcdFx0XHQkY2hhdE5vdy5hZGRDbGFzcygnb24tc2NyZWVuJyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIGluaXQgZWFjaCBzdXBwb3J0IGZlYXR1cmVcclxuXHRmdW5jdGlvbiBpbml0KCkge1xyXG5cdFx0U3VwcG9ydC5BdXRoZW50aWNhdGVkQmxvY2tzLmluaXQoKTtcclxuXHRcdFN1cHBvcnQuR2V0dGluZ1N0YXJ0ZWRDYXJvdXNlbC5pbml0KCk7XHJcblx0XHRTdXBwb3J0LkNvbnRyb2xzLmluaXQoKTtcclxuXHRcdFN1cHBvcnQuQWxlcnRzLmluaXQoKTtcclxuXHRcdFN1cHBvcnQuVG9nZ2xlU2VhcmNoQXJlYXMuaW5pdCgpO1xyXG5cdFx0U3VwcG9ydC5NZW51LmluaXQoKTtcclxuXHRcdFN1cHBvcnQuTW9iaWxlVG9nZ2xlSGVhZGVyLmluaXQoKTtcclxuXHRcdFN1cHBvcnQuU2xpZGVJblN1cHBvcnRDaGF0QnV0dG9uLmluaXQoKTtcclxuXHR9XHJcblxyXG5cdCQoaW5pdCk7XHJcblxyXG59KGpRdWVyeSkpO1xyXG4iLCJ2YXIgZ2VuZXJhdGVNZW51QWRhcHRlciA9IChmdW5jdGlvbigpIHtcclxuXHJcblx0dmFyIGFkYXB0ZXJBUEkgPSB7XHJcblxyXG5cdFx0bGFiZWw6ICcnLFxyXG5cdFx0bWVudTogbnVsbCxcclxuXHRcdGludGVyZmFjZTogJ3RvdWNoJywgLy8gYXNzdW1lIGEgdG91Y2ggaW50ZXJmYWNlIGJ5IGRlZmF1bHQsIG1vYmlsZS1maXJzdFxyXG5cdFx0aGFuZGxlcnM6IFtdLFxyXG5cclxuXHRcdHNldHVwSGFuZGxlcnM6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgYWRhcHRlciA9IHRoaXM7XHJcblx0XHRcdCQuZWFjaCh0aGlzLmhhbmRsZXJzLCBmdW5jdGlvbihpLCBoYW5kbGVyKXtcclxuXHRcdFx0XHRoYW5kbGVyLnNldHVwKGFkYXB0ZXIpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0sXHJcblx0XHRkZXN0cm95SGFuZGxlcnM6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgYWRhcHRlciA9IHRoaXM7XHJcblx0XHRcdCQuZWFjaCh0aGlzLmhhbmRsZXJzLCBmdW5jdGlvbihpLCBoYW5kbGVyKXtcclxuXHRcdFx0XHRoYW5kbGVyLmRlc3Ryb3koYWRhcHRlcik7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSxcclxuXHJcblx0XHR0ZWFyZG93bjogZnVuY3Rpb24oYWRhcHRlcikge30sXHJcblx0XHRpbml0OiBmdW5jdGlvbihhZGFwdGVyKSB7fVxyXG5cdH07XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbihtZW51LCBvcHRpb25zKSB7XHJcblxyXG5cdFx0dmFyIGFkYXB0ZXIgPSAkLmV4dGVuZCh7fSwgYWRhcHRlckFQSSwgb3B0aW9ucywge1xyXG5cclxuXHRcdFx0bWVudTogbWVudSxcclxuXHJcblx0XHRcdGluaXQ6IGZ1bmN0aW9uKGludGVyZmFjZSkge1xyXG5cclxuXHRcdFx0XHRtZW51LmluaXQoKTtcclxuXHJcblx0XHRcdFx0dGhpcy5pbnRlcmZhY2UgPSBpbnRlcmZhY2U7XHJcblx0XHRcdFx0dGhpcy5zZXR1cEhhbmRsZXJzKCk7XHJcblxyXG5cdFx0XHRcdC8vIGZpbmlzaCB3aXRoIGV4ZWN1dGluZyB0aGUgb3B0aW9ucyBwYXNzZWQgaW5cclxuXHRcdFx0XHRpZiAodHlwZW9mIG9wdGlvbnMuaW5pdCA9PT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHRcdFx0b3B0aW9ucy5pbml0KHRoaXMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdHRlYXJkb3duOiBmdW5jdGlvbigpIHtcclxuXHJcblx0XHRcdFx0dGhpcy5kZXN0cm95SGFuZGxlcnMoKTtcclxuXHJcblx0XHRcdFx0aWYgKHR5cGVvZiBvcHRpb25zLnRlYXJkb3duID09PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdFx0XHRvcHRpb25zLnRlYXJkb3duKHRoaXMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIGFkYXB0ZXI7XHJcblxyXG5cdH07XHJcblxyXG59KSgpO1xyXG5cclxuZXhwb3J0cy5nZW5lcmF0ZU1lbnVBZGFwdGVyID0gZ2VuZXJhdGVNZW51QWRhcHRlcjtcclxuIiwidmFyIGdlbmVyYXRlTWVudSA9IChmdW5jdGlvbigpIHtcclxuXHJcblx0dmFyIG1lbnVEZWZhdWx0ID0ge1xyXG5cclxuXHQgIG1lbnVFbGVtZW50OiAkKCcubWVudScpLFxyXG5cdCAgc3ViTWVudVNlbGVjdG9yOiAnLnN1Yi1tZW51JyxcclxuXHQgIGV4cGFuZGVkQ2xhc3M6ICdleHBhbmRlZCcsXHJcblx0ICBzdWJNZW51VHJpZ2dlclNlbGVjdG9yOiAnLmpzLXNob3ctc3ViLXRyaWdnZXInLFxyXG5cclxuXHQgIGV4cGFuZE1lbnU6IGZ1bmN0aW9uKHN1Yk1lbnVFbGVtZW50KSB7XHJcblx0XHQkKHN1Yk1lbnVFbGVtZW50KS5hZGRDbGFzcyh0aGlzLmV4cGFuZGVkQ2xhc3MpO1xyXG5cdCAgfSxcclxuXHJcblx0ICBjb2xsYXBzZU1lbnU6IGZ1bmN0aW9uKHN1Yk1lbnVFbGVtZW50KSB7XHJcblx0XHQkKHN1Yk1lbnVFbGVtZW50KS5yZW1vdmVDbGFzcyh0aGlzLmV4cGFuZGVkQ2xhc3MpO1xyXG5cdCAgfSxcclxuXHJcblx0ICBjb2xsYXBzZUFsbFN1Yk1lbnVzOiBmdW5jdGlvbigpIHtcclxuXHQgIFx0dmFyIG1lbnUgPSB0aGlzO1xyXG5cdFx0dGhpcy5tZW51RWxlbWVudC5maW5kKHRoaXMuc3ViTWVudVNlbGVjdG9yKS5lYWNoKGZ1bmN0aW9uKGksIGUpe1xyXG5cdFx0ICBtZW51LmNvbGxhcHNlTWVudShlKTtcclxuXHRcdH0pO1xyXG5cdCAgfSxcclxuXHJcblx0ICBmaW5kTWVudUZyb21UYXJnZXQ6IGZ1bmN0aW9uKHRhcmdldCkge1xyXG5cdFx0dmFyIHRyaWdnZXIgPSAkKHRhcmdldCkucGFyZW50KHRoaXMuc3ViTWVudVRyaWdnZXJTZWxlY3RvcikuYWRkQmFjayh0aGlzLnN1Yk1lbnVUcmlnZ2VyU2VsZWN0b3IpO1xyXG5cdFx0dmFyIG1lbnUgPSB0cmlnZ2VyLmZpbmQodGhpcy5zdWJNZW51U2VsZWN0b3IpO1xyXG5cdFx0cmV0dXJuIG1lbnU7XHJcblx0ICB9LFxyXG5cclxuXHQgIGluaXQ6IGZ1bmN0aW9uKCkge31cclxuXHR9O1xyXG5cclxuXHRyZXR1cm4gZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdCAgcmV0dXJuICQuZXh0ZW5kKHt9LCBtZW51RGVmYXVsdCwgb3B0aW9ucyk7XHJcblx0fTtcclxufSkoKTtcclxuXHJcbmV4cG9ydHMuZ2VuZXJhdGVNZW51ID0gIGdlbmVyYXRlTWVudTtcclxuIl19
