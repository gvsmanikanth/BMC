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

		init: function() {
			// Prevent init if not logged in or not on landing page
			if (!Support.Helpers.isAuthenticated() || !Support.Helpers.isOnSupportLandingPage()) {
				return;
			}
			this.issueShowMore();
			this.loadData();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL3N1cHBvcnQuanMiLCJqcy9tb2R1bGVzL21lbnUtYWRhcHRlci5qcyIsImpzL21vZHVsZXMvbWVudS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgbWVudWpzID0gcmVxdWlyZSgnLi9tZW51Jyk7XHJcbnZhciBtZW51QWRhcHRlciA9IHJlcXVpcmUoJy4vbWVudS1hZGFwdGVyJyk7XHJcblxyXG52YXIgU3VwcG9ydCA9IFN1cHBvcnQgfHwge307XHJcblxyXG4oZnVuY3Rpb24oJCkge1xyXG5cclxuXHR2YXIgc3VwcG9ydEVudixcclxuXHRcdHN1cHBvcnRQYXRoLFxyXG5cdFx0YWxlcnRNZXNzYWdlcyxcclxuXHRcdGlzc3Vlc0NvbnRhaW5lciA9ICQoJy5qcy1pc3N1ZXMtY29udGFpbmVyJyksXHJcblx0XHRjb250cmFjdFNlbGVjdG9yID0gJCgnLmpzLWNvbnRyYWN0cy1zZWxlY3QnKSxcclxuXHRcdGNvbnRyYWN0RGV0YWlscyA9ICQoJy5hY3Rpb24tZGV0YWlsLWdyb3VwJyksXHJcblx0XHRhY2NvdW50RGV0YWlscyA9ICQoJy5hY3Rpb24tZGV0YWlscycpLFxyXG5cdFx0YWNjb3VudEVycm9yID0gJCgnLmpzLWFjY291bnQtZXJyb3InKSxcclxuXHRcdGFsZXJ0c0J1dHRvbkNvbnRhaW5lciA9ICQoJ2EuYWxlcnRzLmpzLWZhbmN5RGlhbG9nJykucGFyZW50KCdsaS5hY3Rpb24nKTtcclxuXHJcblx0U3VwcG9ydC5IZWxwZXJzID0ge1xyXG5cclxuXHRcdC8vIENoZWNrIGlmIHRoZSBibWNNZXRhIGFuZCBibWNNZXRhLnN1cHBvcnQgZXhpc3RcclxuXHRcdC8vIFVzZWQgdG8gYXNzdW1lIG90aGVyIGZ1bmN0aW9uYWxpdHkgYmFzZWQgb24gdGhlIGV4aXN0YW5jZSBvZiB0aGlzIGluaXRpYWwgYmFzZSBzZXR1cFxyXG5cdFx0Ym1jU3VwcG9ydExvYWRlZDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdGlmICh0eXBlb2YgYm1jTWV0YSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGJtY01ldGEuc3VwcG9ydCAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIENoZWNrIHRvIHNlZSBpZiBlbmFibGVBbGVydHMgaXMgdHJ1ZVxyXG5cdFx0Ym1jQWxlcnRzRW5hYmxlZDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdGlmICh0eXBlb2YgYm1jTWV0YS5zdXBwb3J0LmVuYWJsZUFsZXJ0cyAhPT0gJ3VuZGVmaW5lZCcgJiYgYm1jTWV0YS5zdXBwb3J0LmVuYWJsZUFsZXJ0cyA9PSB0cnVlKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0U3VwcG9ydC5IZWxwZXJzLmhpZGVBbGVydHNCdXR0b24oKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9LFxyXG5cclxuXHRcdGhpZGVBbGVydHNCdXR0b246IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKGFsZXJ0c0J1dHRvbkNvbnRhaW5lcikuaGlkZSgpO1xyXG5cdFx0fSxcclxuXHRcdHNob3dBbGVydHNCdXR0b246IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKGFsZXJ0c0J1dHRvbkNvbnRhaW5lcikuc2hvdygpO1xyXG5cdFx0fSxcclxuXHJcblx0XHRpc0F1dGhlbnRpY2F0ZWQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gdHlwZW9mIGJtY01ldGEgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIGJtY01ldGEudXNlciAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgYm1jTWV0YS51c2VyLmlzU3VwcG9ydEF1dGhlbnRpY2F0ZWQgIT09IFwidW5kZWZpbmVkXCIgJiYgYm1jTWV0YS51c2VyLmlzU3VwcG9ydEF1dGhlbnRpY2F0ZWQ7XHJcblx0XHR9LFxyXG5cclxuXHRcdGlzT25TdXBwb3J0TGFuZGluZ1BhZ2U6IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdFx0aWYgKFN1cHBvcnQuSGVscGVycy5ibWNTdXBwb3J0TG9hZGVkKClcclxuXHRcdFx0XHQmJiB0eXBlb2YgYm1jTWV0YS5wYWdlICE9PSAndW5kZWZpbmVkJ1xyXG5cdFx0XHRcdCYmIHR5cGVvZiBibWNNZXRhLnBhZ2UubG9uZ05hbWUgPT09ICdzdHJpbmcnKSB7XHJcblxyXG5cdFx0XHRcdC8vdmFyIHBhdGhDaGVjayA9IC9zdXBwb3J0LipzdXBwb3J0LWNlbnRyYWwvO1xyXG5cdFx0XHRcdHZhciBwYXRoQ2hlY2sgPSAvc3VwcG9ydC87IC8vRFhQLTgxMlxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdC8vIG1hdGNoZXMgcGF0aCBzdHJpbmcgd2l0aCBzdXBwb3J0IGFuZCBzdXBwb3J0IGNlbnRyYWwgaW4gaXRcclxuXHRcdFx0XHQvLyBleGFtcGxlczpcclxuXHRcdFx0XHQvLyBcInN1cHBvcnQ6c3VwcG9ydC1jZW50cmFsXCIgb3IgXCJzdXBwb3J0OnJlZzpzdXBwb3J0LWNlbnRyYWxcIlxyXG5cdFx0XHRcdGlmIChibWNNZXRhLnBhZ2UubG9uZ05hbWUubWF0Y2gocGF0aENoZWNrKSAhPT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBjYXRjaC1hbGwgZGVmYXVsdFxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9LFxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogZ2V0QWNjb3VudEVycm9yTWVzc2FnZVxyXG5cdFx0ICogQHBhcmFtICB7c3RyaW5nfSBlcnJvclR5cGUgLSAnaXNzdWUnXHJcblx0XHQgKiBAcGFyYW0gIHtzdHJpbmd9IGVycm9yQ29kZSBlcnJvckNvZGUgKGxpa2VseSBwdWxsZWQgZnJvbSBhamF4IHJlc3BvbnNlKVxyXG5cdFx0ICogQHJldHVybiB7c3RyaW5nIHwgdW5kZWZpbmVkfSBSZXR1cm5zIG1hcHBlZCBzdHJpbmcgb3IgdW5kZWZpbmVkIGlmIG5vbmUgZm91bmQgaW4gdW5kZWZpbmVkXHJcblx0XHQgKi9cclxuXHRcdGdldEFjY291bnRFcnJvck1lc3NhZ2U6IGZ1bmN0aW9uKGVycm9yVHlwZSwgZXJyb3JDb2RlKSB7XHJcblx0XHRcdC8vIG1hcCBlcnJvclR5cGUgdG8gY29ycmVjdCBlcnJvckdyb3VwLCBlcnJvckdyb3VwIGlzIHVzZWQgYXMgdGhlIGluZGV4IG9uIGJtY01ldGEuc3VwcG9ydC5lcnJvck1lc3NhZ2VzXHJcblx0XHRcdGlmIChlcnJvclR5cGUgPT0gJ2lzc3VlJykge1xyXG5cdFx0XHRcdHZhciBlcnJvckdyb3VwID0gJ2Nhc2VFcnJvck1lc3NhZ2VzJztcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1VzZSB2YWxpZCBlcnJvclR5cGUgd2hlbiBhY2NvdW50RXJyb3InKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gZGV0ZXJtaW5lIGFwcHJvcHJpYXRlIGVycm9yIG1lc3NhZ2UgYmFzZWQgb24gaW5kZXhlc1xyXG5cdFx0XHQvLyB1bmRlZmluZWQgaWYgbWFwcGVkIHZhbHVlIG5vdCBmb3VuZFxyXG5cdFx0XHR2YXIgZXJyb3JNZXNzYWdlID0gU3VwcG9ydC5IZWxwZXJzLmJtY1N1cHBvcnRMb2FkZWQoKVxyXG5cdFx0XHRcdFx0XHRcdFx0JiYgYm1jTWV0YS5zdXBwb3J0W2Vycm9yR3JvdXBdICE9PSB1bmRlZmluZWRcclxuXHRcdFx0XHRcdFx0XHRcdCYmIGJtY01ldGEuc3VwcG9ydFtlcnJvckdyb3VwXVtlcnJvckNvZGVdICE9PSB1bmRlZmluZWRcclxuXHRcdFx0XHRcdFx0XHRcdD8gYm1jTWV0YS5zdXBwb3J0W2Vycm9yR3JvdXBdW2Vycm9yQ29kZV0gOiB1bmRlZmluZWQ7XHJcblxyXG5cdFx0XHRyZXR1cm4gZXJyb3JNZXNzYWdlO1xyXG5cdFx0fSxcclxuXHJcblx0XHRhY2NvdW50RXJyb3I6IGZ1bmN0aW9uKGVycm9yVHlwZSwgZXJyb3JDb2RlKSB7XHJcblx0XHRcdC8vIHJlc2V0IGhpZGluZyBvZiBjb250YWluZXIsIHNob3cgbmV3IGVycm9yXHJcblx0XHRcdFN1cHBvcnQuQ29udHJvbHMuYWN0aW9ucy5yZXNldExvYWRBY2NvdW50RXJyb3IoKTtcclxuXHJcblx0XHRcdHZhciBlcnJvck1lc3NhZ2UgPSBTdXBwb3J0LkhlbHBlcnMuZ2V0QWNjb3VudEVycm9yTWVzc2FnZShlcnJvclR5cGUsIGVycm9yQ29kZSk7XHJcblxyXG5cdFx0XHQvLyBlcnJvck1lc3NhZ2UgaXMgdW5kZWZpbmVkIGlmIG1hcHBlZCBtZXNzYWdlIG5vdCBmb3VuZFxyXG5cdFx0XHQvLyBhdHRlbXB0IHRvIHNldCB1c2UgREVGQVVMVF9FUlJPUl9NRVNTQUdFXHJcblx0XHRcdGlmIChlcnJvck1lc3NhZ2UgPT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdFx0ZXJyb3JNZXNzYWdlID0gU3VwcG9ydC5IZWxwZXJzLmdldEFjY291bnRFcnJvck1lc3NhZ2UoZXJyb3JUeXBlLCAnREVGQVVMVF9FUlJPUl9NRVNTQUdFJyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIHNob3cvaGlkZSBzcGVjaWZpYyBjb250YWluZXJzIGJhc2VkIG9uIGVycm9yVHlwZVxyXG5cdFx0XHRpZiAoZXJyb3JUeXBlID09ICdpc3N1ZScpIHtcclxuXHRcdFx0XHQkKGFjY291bnREZXRhaWxzKS5zaG93KCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGhpZGUgb3RoZXIgY29udGFpbmVyc1xyXG5cdFx0XHQkKGlzc3Vlc0NvbnRhaW5lcikuaGlkZSgpO1xyXG5cclxuXHRcdFx0Ly8gc2hvdyBlcnJvciBjb250YWluZXIgd2l0aCBtZXNzYWdlLCBidXQgb25seSBpZiBtZXNzYWdlIGlzIGEgbm9uLWVtcHR5IHN0cmluZ1xyXG5cdFx0XHQvLyBpZiB0aGUgZXJyb3JNZXNzYWdlIHdhcyByZXNvbHZlZCB0byBhIG1hcHBpbmcgb2YgYW4gZW1wdHkgc3RyaW5nLCB0aGVuIGRvbid0IHNob3dcclxuXHRcdFx0aWYgKHR5cGVvZiBlcnJvck1lc3NhZ2UgPT09ICdzdHJpbmcnICYmIGVycm9yTWVzc2FnZS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0JChhY2NvdW50RXJyb3IpLnNob3coKS5odG1sKGVycm9yTWVzc2FnZSk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBQYXJzZXMgZGF0ZXMgY29taW5nIGJhY2sgZnJvbSBhamF4IHJlc3BvbnNlLiBGb3IgdGhlIGxhY2sgb2YgYSBiZXR0ZXIgdGVybSB0aGlzIGlzIGJlaW5nXHJcblx0XHQgKiByZWZlcnJlZCB0byBhcyBgU3VwcG9ydCBMb25nIERhdGVgLCBhbmQgaXMgYSBzdHJpbmcgYmVpbmcgbG9hZGVkIGluIHRoZSBzdGFuZGFyZCBmb3JtYXQ6XHJcblx0XHQgKiAyMDE1LTA0LTE0VDE0OjAyOjIyLjAwMFpcclxuXHRcdCAqIEBwYXJhbSAge1N0cmluZ30gZGF0ZVN0cmluZyAtIERhdGUgZm9ybWF0dGVkIHN0cmluZywgbGlrZSAnMjAxNS0wNC0xNFQxNDowMjoyMi4wMDBaJ1xyXG5cdFx0ICogQHJldHVybiB7RGF0ZXxudWxsfSBudWxsIGlmIG5vIG1hdGNoZXMsIG9yIG5hdGl2ZSBqYXZhc2NyaXB0IERhdGUgb2JqZWN0XHJcblx0XHQgKi9cclxuXHRcdHBhcnNlU3VwcG9ydExvbmdEYXRlOiBmdW5jdGlvbihkYXRlU3RyaW5nKSB7XHJcblx0XHRcdHZhciBwYXR0ZXJuID0gLyhcXGR7NH0pLShcXGR7Mn0pLShcXGR7Mn0pVChcXGR7Mn0pOihcXGR7Mn0pOihcXGR7Mn0pLihcXGR7M31cXEQpLztcclxuXHRcdFx0dmFyIG1hdGNoZXMgPSBwYXR0ZXJuLmV4ZWMoZGF0ZVN0cmluZyk7XHJcblxyXG5cdFx0XHQvLyBvbiBzdWNjZXNzZnVsIG1hdGNoLCBtYXRjaFswXSB3aWxsIGJlIHRoZSBlbnRpcmUgbWF0Y2hlZCBzdHJpbmdcclxuXHRcdFx0Ly8gbWF0Y2hlZCBncm91cHMgYXJlIGZvbGxvd2luZyBpbmRleGVzXHJcblx0XHRcdGlmIChtYXRjaGVzKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdC8vIG1vbnRoIGlzIHJlcHJlc2VudGVkIGJ5IG1hdGNoZXNbMl0sIERhdGUgY29uc3RydWN0b3IgZXhwZWN0cyBtb250aCBpbmRleCBmcm9tIDAgdG8gMTEuXHJcblx0XHRcdFx0XHRyZXR1cm4gbmV3IERhdGUobWF0Y2hlc1sxXSwgKHBhcnNlSW50KG1hdGNoZXNbMl0pIC0gMSksIG1hdGNoZXNbM10sIG1hdGNoZXNbNF0sIG1hdGNoZXNbNV0sIG1hdGNoZXNbNl0pO1xyXG5cdFx0XHRcdH0gY2F0Y2goZXJyb3IpIHtcclxuXHRcdFx0XHRcdC8vY29uc29sZS5sb2coJ1VuYWJsZSB0byBwYXJzZVN1cHBvcnRMb25nRGF0ZSB3aXRoICcgKyBkYXRlU3RyaW5nICsgJy4gRXJyb3I6XFxuICcgKyBlcnJvci5tZXNzYWdlKTtcclxuXHRcdFx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHRwYWQ6IGZ1bmN0aW9uKG4sIHdpZHRoLCB6KSB7XHJcblx0XHRcdHogPSB6IHx8ICcwJztcclxuXHRcdFx0biA9IG4gKyAnJztcclxuXHRcdFx0cmV0dXJuIG4ubGVuZ3RoID49IHdpZHRoID8gbiA6IG5ldyBBcnJheSh3aWR0aCAtIG4ubGVuZ3RoICsgMSkuam9pbih6KSArIG47XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIFF1aWNrIGFuZCBlYXN5IGZ1bmN0aW9uIGZvciBwYWRkaW5nIG1vbnRoIGFuZCBkYXkgYW1vdW50cyB3aXRoIGxlYWRpbmcgemVyb2VzIGlmIG5lY2Vzc2FyeSAoaWU6IE1NL0REL1lZWVksIHNpbmdsZSBkaWdpdGFscyBmb3IgTU0gYW5kIEREIHNob3VsZCBoYXZlIGxlYWRpbmcgMClcclxuXHRcdHBhZFRvVHdvRGlnaXRzOiBmdW5jdGlvbihudW0pIHtcclxuXHRcdFx0cmV0dXJuIFN1cHBvcnQuSGVscGVycy5wYWQobnVtLCAyKTtcclxuXHRcdH0sXHJcblx0XHRnZXRVUkxXaXRoUXVlcnlQYXJhbTogZnVuY3Rpb24odXJpLCBrZXksIHZhbHVlKSB7XHJcblx0XHRcdHZhciByZSA9IG5ldyBSZWdFeHAoXCIoWz8mXSlcIiArIGtleSArIFwiPS4qPygmfCQpXCIsIFwiaVwiKTtcclxuXHRcdFx0dmFyIHNlcGFyYXRvciA9IHVyaS5pbmRleE9mKCc/JykgIT09IC0xID8gXCImXCIgOiBcIj9cIjtcclxuXHJcblx0XHRcdGlmICh1cmkubWF0Y2gocmUpKSB7XHJcblx0XHRcdFx0cmV0dXJuIHVyaS5yZXBsYWNlKHJlLCAnJDEnICsga2V5ICsgXCI9XCIgKyB2YWx1ZSArICckMicpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiB1cmkgKyBzZXBhcmF0b3IgKyBrZXkgKyBcIj1cIiArIHZhbHVlO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0Ly8gQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyBpZiBpdCdzIG5vdCBvbmUuIEFuIGVtcHR5IHN0cmluZyBpcyByZXR1cm5lZCBmb3IgYG51bGxgIG9yIGB1bmRlZmluZWRgIHZhbHVlcy5cclxuXHRcdGJhc2VUb1N0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdCAgcmV0dXJuIHZhbHVlID09IG51bGwgPyAnJyA6ICh2YWx1ZSArICcnKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gQ2FwaXRhbGl6ZXMgdGhlIGZpcnN0IGNoYXJhY3RlciBvZiBgc3RyaW5nYC5cclxuXHRcdGNhcGl0YWxpemU6IGZ1bmN0aW9uKHN0cmluZykge1xyXG5cdFx0ICBzdHJpbmcgPSBTdXBwb3J0LkhlbHBlcnMuYmFzZVRvU3RyaW5nKHN0cmluZyk7XHJcblx0XHQgIHJldHVybiBzdHJpbmcgJiYgKHN0cmluZy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0cmluZy5zbGljZSgxKSk7XHJcblx0XHR9LFxyXG5cclxuXHRcdG1ha2VGdWxsTmFtZTogZnVuY3Rpb24oZmlyc3ROYW1lLCBsYXN0TmFtZSkge1xyXG5cdFx0XHRyZXR1cm4gU3VwcG9ydC5IZWxwZXJzLmNhcGl0YWxpemUobGFzdE5hbWUudG9Mb3dlckNhc2UoKSkgKyBcIiwgXCIgKyBTdXBwb3J0LkhlbHBlcnMuY2FwaXRhbGl6ZShmaXJzdE5hbWUudG9Mb3dlckNhc2UoKSk7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0Ly8gQWRkIGNsYXNzIHRvIGJvZHksIHVzZWQgYnkgY3NzIHRvIHNob3cvaGlkZSBibG9ja3NcclxuXHQvLyB0aGF0IGRlcGVuZCBvbiBzdXBwb3J0IHVzZXIgYmVpbmcgYXV0aGVudGljYXRlZFxyXG5cdFN1cHBvcnQuQXV0aGVudGljYXRlZEJsb2NrcyA9IHtcclxuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgc3VwcG9ydEF1dGhlbnRpY2F0ZWRDbGFzcyA9IChTdXBwb3J0LkhlbHBlcnMuaXNBdXRoZW50aWNhdGVkKCkpID8gJ3N1cHBvcnQtbG9nZ2VkLWluJyA6ICdzdXBwb3J0LWxvZ2dlZC1vdXQnO1xyXG5cdFx0XHQkKCdib2R5JykuYWRkQ2xhc3Moc3VwcG9ydEF1dGhlbnRpY2F0ZWRDbGFzcyk7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0U3VwcG9ydC5Jc3N1ZXMgPSB7XHJcblxyXG5cdFx0dGFibGVSb3dzU2VsZWN0b3I6ICcuanMtc3VwcG9ydC1pc3N1ZXMtcm93cycsXHJcblx0XHRzaG93TW9yZVNlbGVjdG9yOiAnLmpzLXN1cHBvcnQtaXNzdWVzLXNob3ctbW9yZScsXHJcblx0XHRpc3N1ZVRhYmxlV3JhcHBlclNlbGVjdG9yOiAnLmpzLWlzc3VlLXRhYmxlLXdyYXBwZXInLFxyXG5cdFx0aGlkZGVuQ2xhc3M6ICdoaWRkZW4nLFxyXG5cdFx0c2hvd0JhdGNoUXR5OiAxMCxcclxuXHRcdC8vIHN0YXRlZnVsIHNlbGVjdG9ycyBhbmQgY2xhc3Nlc1xyXG5cdFx0bG9hZGluZ0lzc3Vlc0NvbnRhaW5lclNlbGVjdG9yOiAnLmpzLWxvYWRpbmctaXNzdWVzLWNvbnRhaW5lcicsXHJcblx0XHRub0lzc3Vlc0NvbnRhaW5lclNlbGVjdG9yOiAnLmpzLW5vLWlzc3Vlcy1jb250YWluZXInLFxyXG5cdFx0aGFzSXNzdWVzQ29udGFpbmVyU2VsZWN0b3I6ICcuanMtaXNzdWVzLWNvbnRhaW5lcicsXHJcblx0XHRsb2FkaW5nRmFpbGVkSXNzdWVzQ29udGFpbmVyU2VsZWN0b3I6ICcuanMtZmFpbGVkLWxvYWRpbmctaXNzdWVzLWNvbnRhaW5lcicsXHJcblx0XHRoaWRlT25Jbml0Q2xhc3M6ICdzdXBwb3J0LWhpZGUtd2hpbGUtbG9hZGluZycsXHJcblxyXG5cdFx0Z2V0TW9kdWxlU3RhdGVDb250YWluZXJTZWxlY3RvcnM6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdGxvYWQ6IFN1cHBvcnQuSXNzdWVzLmxvYWRpbmdJc3N1ZXNDb250YWluZXJTZWxlY3RvcixcclxuXHRcdFx0XHRoYXNJc3N1ZXM6IFN1cHBvcnQuSXNzdWVzLmhhc0lzc3Vlc0NvbnRhaW5lclNlbGVjdG9yLFxyXG5cdFx0XHRcdG5vSXNzdWVzOiBTdXBwb3J0Lklzc3Vlcy5ub0lzc3Vlc0NvbnRhaW5lclNlbGVjdG9yLFxyXG5cdFx0XHRcdGZhaWxlZDogU3VwcG9ydC5Jc3N1ZXMubG9hZGluZ0ZhaWxlZElzc3Vlc0NvbnRhaW5lclNlbGVjdG9yXHJcblx0XHRcdH07XHJcblx0XHR9LFxyXG5cclxuXHRcdGxvYWRWaWFVcmw6IGZ1bmN0aW9uKHVybCkge1xyXG5cclxuXHRcdFx0U3VwcG9ydC5Jc3N1ZXMuYWN0aW9ucy5zaG93U3RhdGVDb250YWluZXIoJ2xvYWQnKTtcclxuXHJcblx0XHRcdCQuZ2V0SlNPTih1cmwsIGZ1bmN0aW9uKGRhdGEpIHtcclxuXHRcdFx0XHRpZiAodHlwZW9mIGRhdGEuQ2FzZXMgIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdFx0XHR2YXIgaXNzdWVzID0gJC5tYXAoZGF0YS5DYXNlcywgU3VwcG9ydC5Jc3N1ZXMubWFwVG9Jc3N1ZUZvcm1hdClcclxuXHRcdFx0XHRcdFx0Ly8gc29ydHMgYnkgbW9zdCByZWNlbnQsIGRlc2NlbmRpbmdcclxuXHRcdFx0XHRcdFx0LnNvcnQoZnVuY3Rpb24oYSwgYikge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChhLmxhc3RVcGRhdGVkUmF3RGF0ZSAmJlxyXG5cdFx0XHRcdFx0XHRcdFx0Yi5sYXN0VXBkYXRlZFJhd0RhdGUgJiZcclxuXHRcdFx0XHRcdFx0XHRcdGEubGFzdFVwZGF0ZWRSYXdEYXRlID4gYi5sYXN0VXBkYXRlZFJhd0RhdGUpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIC0xO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgKGEubGFzdFVwZGF0ZWRSYXdEYXRlICYmXHJcblx0XHRcdFx0XHRcdFx0XHRiLmxhc3RVcGRhdGVkUmF3RGF0ZSAmJlxyXG5cdFx0XHRcdFx0XHRcdFx0YS5sYXN0VXBkYXRlZFJhd0RhdGUgPCBiLmxhc3RVcGRhdGVkUmF3RGF0ZSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gMTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdHJldHVybiAwO1xyXG5cdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0XHQvLyBvbmx5IGtlZXAgMjAgaXNzdWVzLCBhZnRlciBzb3J0aW5nXHJcblx0XHRcdFx0XHRcdC5zbGljZSgwLCAyMCk7XHJcblxyXG5cdFx0XHRcdFx0U3VwcG9ydC5Jc3N1ZXMuYWN0aW9ucy5yZW1vdmVBbGxJc3N1ZXMoKTtcclxuXHRcdFx0XHRcdFN1cHBvcnQuSXNzdWVzLmxvYWRJc3N1ZXMoaXNzdWVzKTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiBkYXRhLmVycm9yQ29kZSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0XHRTdXBwb3J0LkhlbHBlcnMuYWNjb3VudEVycm9yKCdpc3N1ZScsIGRhdGEuZXJyb3JDb2RlKTtcclxuXHRcdFx0XHRcdFN1cHBvcnQuSXNzdWVzLmFjdGlvbnMuc2hvd1N0YXRlQ29udGFpbmVyKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cdFx0XHQuZmFpbChmdW5jdGlvbihkYXRhKSB7XHJcblx0XHRcdFx0U3VwcG9ydC5IZWxwZXJzLmFjY291bnRFcnJvcignaXNzdWUnLCAnREVGQVVMVF9FUlJPUl9NRVNTQUdFJyk7XHJcblx0XHRcdFx0U3VwcG9ydC5Jc3N1ZXMuYWN0aW9ucy5zaG93U3RhdGVDb250YWluZXIoKTtcclxuXHRcdFx0fSlcclxuXHRcdFx0LmFsd2F5cyhmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRTdXBwb3J0LkNvbnRyb2xzLmFjdGlvbnMuZmluaXNoZWRMb2FkaW5nKCk7XHJcblx0XHRcdH0pOztcclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gdGFrZXMgZm9ybWF0IGZyb20ganNvbiBhbmQgbWFwcyB0byBmb3JtYXQgdXNlZCBpbnRlcm5hbGx5XHJcblx0XHQvLyBjYW4gcGVyZm9ybSBhbnkgb3RoZXIgY2xlYW4gdXAgYXMgd2VsbFxyXG5cdFx0bWFwVG9Jc3N1ZUZvcm1hdDogZnVuY3Rpb24oaXNzdWUpIHtcclxuXHJcblx0XHRcdHZhciBmdWxsTmFtZSA9IFN1cHBvcnQuSGVscGVycy5tYWtlRnVsbE5hbWUoaXNzdWUuQ29udGFjdEZpcnN0TmFtZSwgaXNzdWUuQ29udGFjdExhc3ROYW1lKTtcclxuXHJcblx0XHRcdC8vIGxlZnRQYWQgd2l0aCB3aXRoIGV4dHJhICcwJyBpZiByZXF1aXJlZFxyXG5cdFx0XHR2YXIgcGFkID0gU3VwcG9ydC5IZWxwZXJzLnBhZFRvVHdvRGlnaXRzO1xyXG5cclxuXHRcdFx0Ly8gcHJvdmlkZXMgcmF3IGpzIERhdGUgb2JqZWN0XHJcblx0XHRcdHZhciByYXdMYXN0VXBkYXRlZCA9IFN1cHBvcnQuSGVscGVycy5wYXJzZVN1cHBvcnRMb25nRGF0ZShpc3N1ZS5MYXN0TW9kaWZpZWREYXRlKTtcclxuXHRcdFx0dmFyIHJhd0NyZWF0ZWQgPSBTdXBwb3J0LkhlbHBlcnMucGFyc2VTdXBwb3J0TG9uZ0RhdGUoaXNzdWUuQ3JlYXRlZERhdGUpO1xyXG5cdFx0XHR2YXIgbW9udGhzPVsnSmFuJywnRmViJywnTWFyJywnQXByJywnTWF5JywnSnVuJywnSnVsJywnQXVnJywnU2VwJywnT2N0JywnTm92JywnRGVjJ107XHJcblx0XHRcdFxyXG5cdFx0XHQvLyBcIkxhc3QgVXBkYXRlZFwiIG91dHB1dHRlZCBmb3JtYXQ6IE1NL0REL1lZWVkgSEg6TU1cclxuXHRcdFx0LypcclxuXHRcdFx0dmFyIGZvcm1hdHRlZExhc3RVcGRhdGVkID0gcGFkKHJhd0xhc3RVcGRhdGVkLmdldE1vbnRoKCkgKyAxKSAvLyBnZXRNb250aCgpIHJldHVybnMgYSAwLTExIHJhbmdlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0KyBcIi9cIlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCsgcGFkKHJhd0xhc3RVcGRhdGVkLmdldERhdGUoKSlcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQrIFwiL1wiXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0KyByYXdMYXN0VXBkYXRlZC5nZXRGdWxsWWVhcigpO1xyXG5cclxuXHRcdFx0dmFyIGZvcm1hdHRlZENyZWF0ZWQgPSBwYWQocmF3Q3JlYXRlZC5nZXRNb250aCgpICsgMSkgLy8gZ2V0TW9udGgoKSByZXR1cm5zIGEgMC0xMSByYW5nZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCsgXCIvXCJcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQrIHBhZChyYXdDcmVhdGVkLmdldERhdGUoKSlcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQrIFwiL1wiXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0KyByYXdDcmVhdGVkLmdldEZ1bGxZZWFyKCk7XHJcblx0XHRcdCovXHJcblx0XHRcdFxyXG5cdFx0XHRcclxuXHRcdFx0Ly8gXCJMYXN0IFVwZGF0ZWRcIiBvdXRwdXR0ZWQgZm9ybWF0OiBNTS9ERC9ZWVlZIEhIOk1NXHJcblx0XHRcdHZhciBmb3JtYXR0ZWRMYXN0VXBkYXRlZCA9IHBhZChyYXdMYXN0VXBkYXRlZC5nZXREYXRlKCkpXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0KyBcIi1cIlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCsgcGFkKG1vbnRoc1tyYXdMYXN0VXBkYXRlZC5nZXRNb250aCgpXSkgXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0KyBcIi1cIlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCsgcmF3TGFzdFVwZGF0ZWQuZ2V0RnVsbFllYXIoKTtcclxuXHJcblx0XHRcdHZhciBmb3JtYXR0ZWRDcmVhdGVkID0gcGFkKHJhd0NyZWF0ZWQuZ2V0RGF0ZSgpKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCsgXCItXCJcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQrIHBhZChtb250aHNbcmF3Q3JlYXRlZC5nZXRNb250aCgpXSlcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQrIFwiLVwiXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0KyByYXdDcmVhdGVkLmdldEZ1bGxZZWFyKCk7XHJcblx0XHRcdFxyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdGlkOiBpc3N1ZS5JZCxcclxuXHRcdFx0XHRjYXNlTnVtYmVyOiBpc3N1ZS5DYXNlTnVtYmVyLFxyXG5cdFx0XHRcdHN0YXR1czogaXNzdWUuU3RhdHVzLFxyXG5cdFx0XHRcdHByb2R1Y3Q6IGlzc3VlLlByb2R1Y3ROYW1lLFxyXG5cdFx0XHRcdGNyZWF0ZWREYXRlOiBmb3JtYXR0ZWRDcmVhdGVkLFxyXG5cdFx0XHRcdGxhc3RVcGRhdGVkT3JpZ2luYWxEYXRlOiBpc3N1ZS5MYXN0TW9kaWZpZWREYXRlLFxyXG5cdFx0XHRcdGxhc3RVcGRhdGVkUmF3RGF0ZTogcmF3TGFzdFVwZGF0ZWQsXHJcblx0XHRcdFx0bGFzdFVwZGF0ZWRGb3JtYXR0ZWREYXRlOiBmb3JtYXR0ZWRMYXN0VXBkYXRlZCxcclxuXHRcdFx0XHRzdW1tYXJ5OiBpc3N1ZS5TdWJqZWN0LFxyXG5cdFx0XHRcdHN1Ym1pdHRlcjogZnVsbE5hbWVcclxuXHRcdFx0fTtcclxuXHRcdH0sXHJcblxyXG5cdFx0bG9hZElzc3VlczogZnVuY3Rpb24oaXNzdWVzKSB7XHJcblx0XHRcdGlmIChpc3N1ZXMubGVuZ3RoKSB7XHJcblx0XHRcdFx0U3VwcG9ydC5Jc3N1ZXMuYWN0aW9ucy5hZGRJc3N1ZXMoaXNzdWVzKTtcclxuXHRcdFx0XHRTdXBwb3J0Lklzc3Vlcy5hY3Rpb25zLnNob3dTdGF0ZUNvbnRhaW5lcignaGFzSXNzdWVzJyk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0U3VwcG9ydC5Jc3N1ZXMuYWN0aW9ucy5zaG93U3RhdGVDb250YWluZXIoJ25vSXNzdWVzJyk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0bG9hZFNlbGVjdGVkSXNzdWU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgbWF0Y2hJZCA9ICQoY29udHJhY3RTZWxlY3RvcikuZmluZCgnOnNlbGVjdGVkJykuZGF0YSgnY29udHJhY3QtaWQnKSB8fCBcIlwiO1xyXG5cdFx0XHQvLyBMb2FkIGxvY2FsIHRlc3QgZGF0YSAgb3IgZ2V0IHZpYSBhamF4XHJcblx0XHRcdGlmICh0eXBlb2YgYm1jTWV0YSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGJtY01ldGEuY2R4TG9jYWwgIT09ICd1bmRlZmluZWQnICYmIGJtY01ldGEuY2R4TG9jYWwpIHtcclxuXHRcdFx0XHR0aGlzLmxvYWRWaWFVcmwoJy4vdGVzdC8nICsgbWF0Y2hJZCArICcuanNvbicpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMubG9hZFZpYVVybCgnL3RlbXBsYXRlcy9SZXN0R2V0U3VwcG9ydE9wZW5Jc3N1ZXM/Y29udHJhY3RJRD0nICsgbWF0Y2hJZCk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0YWN0aW9uczoge1xyXG5cclxuXHRcdFx0LyoqXHJcblx0XHRcdCAqIEFkZHMgYW4gYXJyYXkgb2YgaXNzdWUgb2JqZWN0c1xyXG5cdFx0XHQgKiBAcGFyYW0ge2FycmF5fSBpc3N1ZXMgYXJyYXkgb2YgaXNzdWVzIGluIHRoZSBmb3JtYXQgc3BlY2lmaWVkIHdpdGhpbiBgYWRkSXNzdWVgXHJcblx0XHRcdCAqL1xyXG5cdFx0XHRhZGRJc3N1ZXM6IGZ1bmN0aW9uKGlzc3Vlcykge1xyXG5cdFx0XHRcdC8vIHNlZSBTdXBwb3J0Lklzc3Vlcy5hY3Rpb25zLmFkZElzc3VlIGZvciBleHBlY3RlZCBpc3N1ZSBmb3JtYXRcclxuXHRcdFx0XHQkLmVhY2goaXNzdWVzLCBmdW5jdGlvbihpLCBpc3N1ZSkge1xyXG5cdFx0XHRcdFx0U3VwcG9ydC5Jc3N1ZXMuYWN0aW9ucy5hZGRJc3N1ZShpc3N1ZSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRhZGRJc3N1ZTogZnVuY3Rpb24oaXNzdWUpIHtcclxuXHJcblx0XHRcdFx0LyoqXHJcblx0XHRcdFx0ICogb3V0cHV0IGZvcm1hdDpcclxuXHRcdFx0XHQgKlxyXG5cdFx0XHRcdCAqICB7XHJcblx0XHRcdFx0ICogICAgICBpZDogbnVtYmVyLFxyXG5cdFx0XHRcdCAqXHRcdHN1bW1hcnk6IHN0cmluZyxcclxuXHRcdFx0XHQgKiAgICAgIHByb2R1Y3Q6IHN0cmluZyxcclxuXHRcdFx0XHQgKiAgICAgIGNyZWF0ZWREYXRlOiBzdHJpbmcsXHJcblx0XHRcdFx0ICogICAgICBsYXN0VXBkYXRlZDogc3RyaW5nLFxyXG5cdFx0XHRcdCAqICAgICAgc3RhdHVzOiBzdHJpbmcsXHJcblx0XHRcdFx0ICpcdFx0c3VibWl0dGVyOiBzdHJpbmdcclxuXHRcdFx0XHQgKiBcdH1cclxuXHRcdFx0XHQgKi9cclxuXHJcblx0XHRcdFx0Ly8gcHVsbCBuZWVkZWQgZmllbGRzIGZyb20gaXNzdWUgZm9yIG91dHB1dCBmb3JtYXRcclxuXHRcdFx0XHR2YXIgaXNzdWVPdXRwdXQgPSB7XHJcblx0XHRcdFx0XHRpZDogaXNzdWUuY2FzZU51bWJlcixcclxuXHRcdFx0XHRcdHN1bW1hcnk6IGlzc3VlLnN1bW1hcnksXHJcblx0XHRcdFx0XHRwcm9kdWN0OiBpc3N1ZS5wcm9kdWN0LFxyXG5cdFx0XHRcdFx0Y3JlYXRlZERhdGU6IGlzc3VlLmNyZWF0ZWREYXRlLFxyXG5cdFx0XHRcdFx0bGFzdFVwZGF0ZWQ6IGlzc3VlLmxhc3RVcGRhdGVkRm9ybWF0dGVkRGF0ZSxcclxuXHRcdFx0XHRcdHN0YXR1czogaXNzdWUuc3RhdHVzLFxyXG5cdFx0XHRcdFx0c3VibWl0dGVyOiBpc3N1ZS5zdWJtaXR0ZXJcclxuXHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHQvLyBjZWxsIGh0bWwgbWFya3VwIGNvbnRhaW5lclxyXG5cdFx0XHRcdHZhciBjZWxscyA9IFtdO1xyXG5cclxuXHRcdFx0XHRmb3IgKGtleSBpbiBpc3N1ZU91dHB1dCkge1xyXG5cdFx0XHRcdFx0Ly8gSUQgbmVlZHMgdG8gYmUgbGlua2VkIHRvIHRoZSB0aWNrZXRcclxuXHRcdFx0XHRcdGlmIChrZXkgPT09ICdpZCcpIHtcclxuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBibWNNZXRhICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgYm1jTWV0YS5zdXBwb3J0ICE9PSAndW5kZWZpbmVkJykge1xyXG5cclxuXHRcdFx0XHRcdFx0XHRzdXBwb3J0RW52ID0gKHR5cGVvZiBibWNNZXRhLnN1cHBvcnQuaXNzdWVFbnZpcm9ubWVudCAhPT0gJ3VuZGVmaW5lZCcpID8gYm1jTWV0YS5zdXBwb3J0Lmlzc3VlRW52aXJvbm1lbnQgOiBcIlwiO1xyXG5cdFx0XHRcdFx0XHRcdHN1cHBvcnRQYXRoID0gKHR5cGVvZiBibWNNZXRhLnN1cHBvcnQuaXNzdWVQYXRoICE9PSAndW5kZWZpbmVkJykgPyBibWNNZXRhLnN1cHBvcnQuaXNzdWVQYXRoIDogXCJcIjtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0Y2VsbHMucHVzaCgnPHRkPjxhIGhyZWY9XCInICsgU3VwcG9ydC5Jc3N1ZXMuYnVpbGRTdXBwb3J0SXNzdWVVcmwoc3VwcG9ydEVudiwgc3VwcG9ydFBhdGgsIGlzc3VlLmlkKSArICdcIj4nICsgaXNzdWVPdXRwdXRba2V5XSArICc8L2E+PC90ZD4nKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGNlbGxzLnB1c2goJzx0ZD4nICsgaXNzdWVPdXRwdXRba2V5XSArICc8L3RkPicpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dmFyIHJvdyA9ICc8dHIgZGF0YS1pc3N1ZS1pZD1cIicgKyBpc3N1ZU91dHB1dC5pZCArICdcIj4nICsgY2VsbHMuam9pbignJykgKyAnPC90cj4nO1xyXG5cdFx0XHRcdHZhciByb3dzQ29udGFpbmVyID0gJChTdXBwb3J0Lklzc3Vlcy5pc3N1ZVRhYmxlV3JhcHBlclNlbGVjdG9yKS5maW5kKCd0YWJsZSB0Ym9keScpO1xyXG5cdFx0XHRcdCQocm93c0NvbnRhaW5lcikuYXBwZW5kKHJvdyk7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHQvKipcclxuXHRcdFx0ICogc3RhdGUgaXMgYmFzZWQgb24gdGhlIGtleSBwcm92aWRlZCBieSB0aGUgYXJyYXkgcmV0dXJuZWQgZnJvbSBnZXRNb2R1bGVTdGF0ZUNvbnRhaW5lclNlbGVjdG9yc1xyXG5cdFx0XHQgKi9cclxuXHRcdFx0c2hvd1N0YXRlQ29udGFpbmVyOiBmdW5jdGlvbihzaG93U3RhdGUpIHtcclxuXHJcblx0XHRcdFx0dmFyIHN0YXRlcyA9IFN1cHBvcnQuSXNzdWVzLmdldE1vZHVsZVN0YXRlQ29udGFpbmVyU2VsZWN0b3JzKCk7XHJcblxyXG5cdFx0XHRcdGlmICh0eXBlb2Ygc3RhdGVzW3Nob3dTdGF0ZV0gIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdFx0XHQkKHN0YXRlc1tzaG93U3RhdGVdKS5mYWRlSW4oKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIGhpZGUgZXhpc3Rpbmcgc3RhdGVzXHJcblx0XHRcdFx0Zm9yIChzdGF0ZSBpbiBzdGF0ZXMpIHtcclxuXHRcdFx0XHRcdGlmIChzdGF0ZSAhPT0gc2hvd1N0YXRlKSB7XHJcblx0XHRcdFx0XHRcdCQoc3RhdGVzW3N0YXRlXSkuaGlkZSgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdHJlbW92ZUFsbElzc3VlczogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIHJvd3MgPSAkKFN1cHBvcnQuSXNzdWVzLmlzc3VlVGFibGVXcmFwcGVyU2VsZWN0b3IpLmZpbmQoJ3RhYmxlIHRib2R5IHRyJyk7XHJcblx0XHRcdFx0cm93cy5yZW1vdmUoKTtcclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdHNob3dJc3N1ZXM6IGZ1bmN0aW9uKGFtb3VudCkge1xyXG5cdFx0XHRcdHZhciBoaWRkZW5Jc3N1ZXMgPSAkKFN1cHBvcnQuSXNzdWVzLnRhYmxlUm93c1NlbGVjdG9yKS5maW5kKCd0ci5oaWRkZW4nKTtcclxuXHRcdFx0XHR2YXIgY2FwcGVkID0gJChoaWRkZW5Jc3N1ZXMpLnNsaWNlKDAsIFN1cHBvcnQuSXNzdWVzLnNob3dCYXRjaFF0eSk7XHJcblx0XHRcdFx0dmFyIHJlbWFpbmluZyA9IGhpZGRlbklzc3Vlcy5sZW5ndGggLSBjYXBwZWQubGVuZ3RoO1xyXG5cclxuXHRcdFx0XHRpZiAoY2FwcGVkLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFN1cHBvcnQuSXNzdWVzLmFjdGlvbnMuc2hvdyhjYXBwZWQpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRTdXBwb3J0Lklzc3Vlcy5hY3Rpb25zLnZpZXdBbGwoKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIFNob3dlZCBmaW5hbCBiYXRjaFxyXG5cdFx0XHRcdGlmIChyZW1haW5pbmcgPD0gU3VwcG9ydC5Jc3N1ZXMuc2hvd0JhdGNoUXR5KSB7XHJcblx0XHRcdFx0XHRTdXBwb3J0Lklzc3Vlcy5hY3Rpb25zLmFsbFNob3duKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRzaG93OiBmdW5jdGlvbihlbGVtZW50cykge1xyXG5cdFx0XHRcdCQoZWxlbWVudHMpLnJlbW92ZUNsYXNzKFN1cHBvcnQuSXNzdWVzLmhpZGRlbkNsYXNzKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0aGlkZTogZnVuY3Rpb24oZWxlbWVudHMpIHtcclxuXHRcdFx0XHQkKGVsZW1lbnRzKS5hZGRDbGFzcyhTdXBwb3J0Lklzc3Vlcy5oaWRkZW5DbGFzcyk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGFsbFNob3duOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgc2hvd01vcmUgPSAkKFN1cHBvcnQuSXNzdWVzLnNob3dNb3JlU2VsZWN0b3IpO1xyXG5cdFx0XHRcdHZhciBuZXdMYWJlbCA9IHNob3dNb3JlLmRhdGEoJ3ZpZXctYWxsLWxhYmVsJyk7XHJcblx0XHRcdFx0c2hvd01vcmUuaHRtbChuZXdMYWJlbCk7XHJcblx0XHRcdH0sXHJcblx0XHRcdHZpZXdBbGw6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciB1cmwgPSAkKFN1cHBvcnQuSXNzdWVzLnNob3dNb3JlU2VsZWN0b3IpLmRhdGEoJ3ZpZXctYWxsLXVybCcpO1xyXG5cdFx0XHRcdGlmICh1cmwpIHtcclxuXHRcdFx0XHRcdGRvY3VtZW50LmxvY2F0aW9uID0gdXJsO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdGZpbmlzaGVkTG9hZGluZzogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0JCgnLmpzLWFjY291bnQtZGV0YWlscy1sb2FkaW5nJykuaGlkZSgpO1xyXG5cdFx0XHRcdCQoJy5zdXBwb3J0LW5vLWlzc3VlcycpLmhpZGUoKS5yZW1vdmVDbGFzcygnc3VwcG9ydC1oaWRlLXdoaWxlLWxvYWRpbmcnKTtcclxuXHRcdFx0XHQkKCcuYWN0aW9uLWRldGFpbHMnKS5yZW1vdmVDbGFzcygnc3VwcG9ydC1oaWRlLXdoaWxlLWxvYWRpbmcnKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHRidWlsZFN1cHBvcnRJc3N1ZVVybDogZnVuY3Rpb24oc3VwcG9ydEVudiwgc3VwcG9ydFBhdGgsIGlzc3VlSUQpIHtcclxuXHRcdFx0cmV0dXJuIHN1cHBvcnRFbnYgKyBzdXBwb3J0UGF0aCArIGlzc3VlSUQ7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0U3VwcG9ydC5Db250cm9scyA9IHtcclxuXHJcblx0XHRhY3Rpb25zOiB7XHJcblx0XHRcdGZpbmlzaGVkTG9hZGluZzogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0JCgnLmpzLWFjY291bnQtZGV0YWlscy1sb2FkaW5nJykuaGlkZSgpO1xyXG5cdFx0XHRcdCQoJy5zdXBwb3J0LW5vLWlzc3VlcycpLmhpZGUoKS5yZW1vdmVDbGFzcygnc3VwcG9ydC1oaWRlLXdoaWxlLWxvYWRpbmcnKTtcclxuXHRcdFx0XHQkKCcuYWN0aW9uLWRldGFpbHMnKS5yZW1vdmVDbGFzcygnc3VwcG9ydC1oaWRlLXdoaWxlLWxvYWRpbmcnKTtcclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdHJlc2V0TG9hZEFjY291bnRFcnJvcjogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0JChhY2NvdW50RXJyb3IpLmhpZGUoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHRpc3N1ZVNob3dNb3JlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0JChTdXBwb3J0Lklzc3Vlcy5zaG93TW9yZVNlbGVjdG9yKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdFN1cHBvcnQuSXNzdWVzLmFjdGlvbnMuc2hvd0lzc3VlcyhTdXBwb3J0Lklzc3Vlcy5zaG93QmF0Y2hRdHkpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0sXHJcblxyXG5cdFx0bG9hZERhdGE6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQvLyBMb2FkIGxvY2FsIHRlc3QgZGF0YSBvciBnZXQgdmlhIGFqYXhcclxuXHRcdFx0aWYgKHR5cGVvZiBibWNNZXRhICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgYm1jTWV0YS5jZHhMb2NhbCAhPT0gJ3VuZGVmaW5lZCcgJiYgYm1jTWV0YS5jZHhMb2NhbCkge1xyXG5cdFx0XHRcdFN1cHBvcnQuSXNzdWVzLmxvYWRWaWFVcmwoJy4vdGVzdC9pc3N1ZXMuanNvbicpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFN1cHBvcnQuSXNzdWVzLmxvYWRWaWFVcmwoJy9iaW4vc3VwcG9ydGNhc2VzJyk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdC8vIFByZXZlbnQgaW5pdCBpZiBub3QgbG9nZ2VkIGluIG9yIG5vdCBvbiBsYW5kaW5nIHBhZ2VcclxuXHRcdFx0aWYgKCFTdXBwb3J0LkhlbHBlcnMuaXNBdXRoZW50aWNhdGVkKCkgfHwgIVN1cHBvcnQuSGVscGVycy5pc09uU3VwcG9ydExhbmRpbmdQYWdlKCkpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5pc3N1ZVNob3dNb3JlKCk7XHJcblx0XHRcdHRoaXMubG9hZERhdGEoKTtcclxuXHRcdH1cclxuXHJcblx0fTtcclxuXHJcblx0U3VwcG9ydC5BbGVydHMgPSB7XHJcblxyXG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0XHQvLyBsb2NhbCB2YXJzXHJcblx0XHRcdHZhciBmaW5pc2hlZExvYWRpbmcsXHJcblx0XHRcdFx0bWVzc2FnZXNVcmw7XHJcblxyXG5cdFx0XHQvLyBPYmplY3RzXHJcblx0XHRcdHRoaXMuZGlhbG9nID0gJChcIiNjb25maXJtXCIpO1xyXG5cdFx0XHR0aGlzLnRyaWdnZXIgPSAkKFwiLmpzLWZhbmN5RGlhbG9nXCIpO1xyXG5cclxuXHRcdFx0Ly8gQWN0aW9uc1xyXG5cdFx0XHR0aGlzLmNvbmZpcm1CdXR0b24gPSBcIkNsb3NlXCI7XHJcblx0XHRcdHRoaXMuY29uZmlybUNoZWNrYm94ID0gXCJEb25cXCd0IHNob3cgdGhpcyBhZ2FpblwiO1xyXG5cclxuXHRcdFx0Ly8gY2FsbGJhY2sgdG8gaGFuZGxlIG1lc3NhZ2VzLCByZWdhcmRsZXNzIG9mIHNvdXJjZVxyXG5cdFx0XHQvLyBoYW5kbGVzIGNhc2UgaW4gdGhlIHNpdHVhdGlvbiB3aGVyZSB0aGVyZSBhcmUgbm8gbWVzc2FnZXNcclxuXHRcdFx0Ly8gb3IgbWVzc2FnZXMgZGF0YSBpcyBmYWxzZXlcclxuXHRcdFx0ZmluaXNoZWRMb2FkaW5nID0gZnVuY3Rpb24obWVzc2FnZXMpIHtcclxuXHJcblx0XHRcdFx0Ly8gaGF2ZSBtZXNzYWdlc1xyXG5cdFx0XHRcdGlmIChtZXNzYWdlcyAmJiBtZXNzYWdlcy5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHQvLyBzZXRzIGdsb2JhbCBhbGVydE1lc3NhZ2VzXHJcblx0XHRcdFx0XHRhbGVydE1lc3NhZ2VzID0gbWVzc2FnZXM7XHJcblxyXG5cdFx0XHRcdFx0Ly8gQWxlcnQgYnV0dG9uXHJcblx0XHRcdFx0XHR0aGlzLmFsZXJ0QnV0dG9uKCk7XHJcblx0XHRcdFx0XHQvLyBDaGVjayBjb29raWVzXHJcblx0XHRcdFx0XHR0aGlzLmNoZWNrQ29va2llcyh0aGlzLm1lc3NhZ2VzKTtcclxuXHRcdFx0XHQvLyBkb24ndCBoYXZlIG1lc3NhZ2VzXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdC8vIGluIGFueSBjYXNlIHRoYXQgZG9lc24ndCByZXN1bHQgaW4gbG9hZGluZywgaGlkZSB0aGUgYWxlcnRzIGJ1dHRvblxyXG5cdFx0XHRcdFx0dGhpcy50cmlnZ2VyLnBhcmVudCgpLnJlbW92ZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0Ly8gbWFpbnRhaW4gY29udGV4dFxyXG5cdFx0XHR9LmJpbmQodGhpcyk7XHJcblxyXG5cdFx0XHQvLyBsb2FkIG1lc3NhZ2VzIGRhdGEgZnJvbSBibWNNZXRhIGdsb2JhbCBvYmplY3RcclxuXHRcdFx0Ly8gdGhpcy5sb2FkTWVzc2FnZXNGcm9tR2xvYmFsKGZpbmlzaGVkTG9hZGluZyk7XHJcblx0XHRcdC8vXHJcblx0XHRcdC8vIC0tIE9SIC0tXHJcblx0XHRcdC8vXHJcblx0XHRcdC8vIGxvYWQgbWVzc2FnZXMgZGF0YSBmcm9tIGFqYXhcclxuXHRcdFx0Ly8gbG9hZCByZWxhdGl2ZSBVUkwgb24gYm1jLmNvbSBvciBoYXJkY29kZSBVUkwgc291cmNlIGZvciB0ZXN0aW5nIHB1cnBvc2VzXHJcblx0XHRcdGlmICggU3VwcG9ydC5IZWxwZXJzLmJtY1N1cHBvcnRMb2FkZWQoKSAmJiBTdXBwb3J0LkhlbHBlcnMuYm1jQWxlcnRzRW5hYmxlZCgpICl7XHJcblx0XHRcdFx0Ly8gbG9jYWwgZGV2ZWxvcG1lbnQ6XHJcblx0XHRcdFx0aWYgKCh0eXBlb2YgYm1jTWV0YS5jZHhMb2NhbCAhPT0gJ3VuZGVmaW5lZCcpICYmIGJtY01ldGEuY2R4TG9jYWwpIHtcclxuXHRcdFx0XHRcdG1lc3NhZ2VzVXJsID0gJ3Rlc3QvYWxlcnRNZXNzYWdlcy5qc29uJztcclxuXHRcdFx0XHQvLyBkZXYvc3RhZ2UvcHJvZDpcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYgKCh0eXBlb2YgYm1jTWV0YS5zdXBwb3J0LmFsZXJ0c1VybCAhPT0gJ3VuZGVmaW5lZCcpICYmIGJtY01ldGEuc3VwcG9ydC5hbGVydHNVcmwpIHtcclxuXHRcdFx0XHRcdFx0bWVzc2FnZXNVcmwgPSBibWNNZXRhLnN1cHBvcnQuYWxlcnRzVXJsO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0bWVzc2FnZXNVcmwgPSAnL3RlbXBsYXRlcy9TZXJ2aWNlU3VwcG9ydEFsZXJ0c0pTT04nO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLmxvYWRNZXNzYWdlc0Zyb21VcmwoZmluaXNoZWRMb2FkaW5nLCBtZXNzYWdlc1VybCk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gd2lsbCByZXRyaWV2ZSBtZXNzYWdlcyBieSB0aGUgYm1jTWV0YSBnbG9iYWxcclxuXHRcdC8vIGxvYWRzIG9uIG1vZHVsZSBnbG9iYWwgdmFyIGFsZXJ0TWVzc2FnZXNcclxuXHRcdGxvYWRNZXNzYWdlc0Zyb21HbG9iYWw6IGZ1bmN0aW9uKG1lc3NhZ2VzSGFuZGxlcikge1xyXG5cdFx0XHR2YXIgbWVzc2FnZXM7XHJcblxyXG5cdFx0XHRpZiAoU3VwcG9ydC5IZWxwZXJzLmJtY1N1cHBvcnRMb2FkZWQoKSAmJiB0eXBlb2YgYm1jTWV0YS5zdXBwb3J0LmFsZXJ0TWVzc2FnZXMgIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdFx0bWVzc2FnZXMgPSBibWNNZXRhLnN1cHBvcnQuYWxlcnRNZXNzYWdlcztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHR5cGVvZiBtZXNzYWdlc0hhbmRsZXIgPT09ICdmdW5jdGlvbicpIG1lc3NhZ2VzSGFuZGxlcihtZXNzYWdlcyk7XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIGFsbG93cyBmb3IgYWpheGluZyBpbiBtZXNzYWdlIGRhdGFcclxuXHRcdGxvYWRNZXNzYWdlc0Zyb21Vcmw6IGZ1bmN0aW9uKG1lc3NhZ2VzSGFuZGxlciwgdXJsKSB7XHJcblx0XHRcdCQuYWpheCh1cmwpXHJcblx0XHRcdFx0LmRvbmUoZnVuY3Rpb24oZGF0YSkge1xyXG5cdFx0XHRcdFx0Ly8gYmFzZWQgb24gZXhhbXBsZSBqc29uLCBhc3N1bWUgcmVzcG9uc2UgcGF5bG9hZCBjb250YWlucyBkYXRhIG9uXHJcblx0XHRcdFx0XHQvLyBwcm9wZXJ0eSAnc3VwcG9ydEFsZXJ0TWVzc2FnZXMnXHJcblx0XHRcdFx0XHRpZiAodHlwZW9mIG1lc3NhZ2VzSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykgbWVzc2FnZXNIYW5kbGVyKGRhdGEuc3VwcG9ydEFsZXJ0TWVzc2FnZXMpO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0LmZhaWwoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRpZiAodHlwZW9mIG1lc3NhZ2VzSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykgbWVzc2FnZXNIYW5kbGVyKG51bGwpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fSxcclxuXHJcblx0XHRvcGVuQWxlcnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aGlzLmZhbmN5Q29uZmlnKHRoaXMubWVzc2FnZXMpO1xyXG5cdFx0fSxcclxuXHJcblx0XHRhbGVydEJ1dHRvbjogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHRoaXMudHJpZ2dlci5vbihcImNsaWNrXCIsICQucHJveHkodGhpcy5vcGVuQWxlcnQsIHRoaXMpKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Y2hlY2tDb29raWVzOiBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0XHRcdC8vIENoZWNrIGlmIGNvb2tpZXMgbWF0Y2ggSURzXHJcblx0XHRcdHZhciBzaG93QWxlcnQgPSBmYWxzZTtcclxuXHRcdFx0Zm9yIChpID0gMDsgaSA8IGFsZXJ0TWVzc2FnZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHQvLyBJZiBubyBjb29raWVzIHRoZW4gc2hvdyBhbGVydFxyXG5cdFx0XHRcdGlmICgkLmNvb2tpZShhbGVydE1lc3NhZ2VzW2ldLmlkKSA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0XHRzaG93QWxlcnQgPSB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoc2hvd0FsZXJ0KSB7XHJcblx0XHRcdFx0dGhpcy5vcGVuQWxlcnQoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHRmYW5jeUNvbmZpZzogZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdFx0XHQkLmZhbmN5Ym94KHRoaXMuZGlhbG9nLCB7XHJcblx0XHRcdFx0YXV0b1dpZHRoOiBmYWxzZSxcclxuXHRcdFx0XHRtaW5IZWlnaHQ6IDQwMCxcclxuXHRcdFx0XHRtYXhXaWR0aDogNzQ1LFxyXG5cdFx0XHRcdHBhZGRpbmc6IDAsXHJcblx0XHRcdFx0dHBsOiB7XHJcblx0XHRcdFx0XHR3cmFwOiAnPGRpdiBjbGFzcz1cImZhbmN5Ym94LXdyYXAgZmFuY3lib3gtZGlhbG9nXCIgdGFiSW5kZXg9XCItMVwiPjxkaXYgY2xhc3M9XCJmYW5jeWJveC1za2luXCI+PGRpdiBjbGFzcz1cImZhbmN5Ym94LW91dGVyXCI+PGRpdiBjbGFzcz1cImZhbmN5Ym94LXRpdGxlXCI+QWxlcnQgTm90aWZpY2F0aW9uczwvZGl2PjxkaXYgY2xhc3M9XCJmYW5jeWJveC1pbm5lclwiPjwvZGl2PjwvZGl2PjwvZGl2PjwvZGl2PicsXHJcblx0XHRcdFx0XHRlcnJvcjogJzxwIGNsYXNzPVwiZmFuY3lib3gtZXJyb3JcIj5UaGUgcmVxdWVzdGVkIGNvbnRlbnQgY2Fubm90IGJlIGxvYWRlZC48YnIvPlBsZWFzZSB0cnkgYWdhaW4gbGF0ZXIuPC9wPidcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGhlbHBlcnM6IHtcclxuXHRcdFx0XHRcdG92ZXJsYXk6IHtcclxuXHRcdFx0XHRcdFx0Y2xvc2VDbGljazogdHJ1ZSwgLy8gaWYgdHJ1ZSwgZmFuY3lCb3ggd2lsbCBiZSBjbG9zZWQgd2hlbiB1c2VyIGNsaWNrcyBvbiB0aGUgb3ZlcmxheVxyXG5cdFx0XHRcdFx0XHRzcGVlZE91dDogMjAwLCAvLyBkdXJhdGlvbiBvZiBmYWRlT3V0IGFuaW1hdGlvblxyXG5cdFx0XHRcdFx0XHRzaG93RWFybHk6IHRydWUsIC8vIGluZGljYXRlcyBpZiBzaG91bGQgYmUgb3BlbmVkIGltbWVkaWF0ZWx5IG9yIHdhaXQgdW50aWwgdGhlIGNvbnRlbnQgaXMgcmVhZHlcclxuXHRcdFx0XHRcdFx0Y3NzOiB7fSwgLy8gY3VzdG9tIENTUyBwcm9wZXJ0aWVzXHJcblx0XHRcdFx0XHRcdGxvY2tlZDogdHJ1ZSAvLyBpZiB0cnVlLCB0aGUgY29udGVudCB3aWxsIGJlIGxvY2tlZCBpbnRvIG92ZXJsYXlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGJlZm9yZVNob3c6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0Ly8gQWRkIGNvbnRhaW5lcnNcclxuXHRcdFx0XHRcdHRoaXMuY29udGVudC5hcHBlbmQoXCI8ZGl2IGNsYXNzPSdtZXNzYWdlcyc+PC9kaXY+PGRpdiBjbGFzcz0nYWN0aW9uJz48L2Rpdj5cIik7XHJcblx0XHRcdFx0XHQvLyBBZGQgbWVzc2FnZXNcclxuXHRcdFx0XHRcdHRoaXMubWVzc2FnZXMgPSB0aGlzLmNvbnRlbnQuZmluZChcIi5tZXNzYWdlc1wiKTtcclxuXHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBhbGVydE1lc3NhZ2VzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMubWVzc2FnZXMuYXBwZW5kKFwiPGgzIGNsYXNzPSd0aXRsZSc+XCIgKyBhbGVydE1lc3NhZ2VzW2ldLnRpdGxlICsgXCI8L2gzPlwiKTtcclxuXHRcdFx0XHRcdFx0dGhpcy5tZXNzYWdlcy5hcHBlbmQoXCI8cCBjbGFzcz0nbWVzc2FnZSc+XCIgKyBhbGVydE1lc3NhZ2VzW2ldLm1lc3NhZ2UgKyBcIjwvcD5cIik7XHJcblx0XHRcdFx0XHRcdGlmIChhbGVydE1lc3NhZ2VzW2ldLmxpbmspIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLm1lc3NhZ2VzLmFwcGVuZCgnPHAgY2xhc3M9XCJsaW5rXCI+PGEgaHJlZj1cIicgKyBhbGVydE1lc3NhZ2VzW2ldLnVybCArICdcIj4nICsgYWxlcnRNZXNzYWdlc1tpXS5saW5rICsgJzwvYT48L3A+Jyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8vIEFkZCBtb2JpbGUgYnV0dG9uXHJcblx0XHRcdFx0XHR0aGlzLm1lc3NhZ2VzLmFwcGVuZCgnPHAgc3R5bGU9XCJ0ZXh0LWFsaWduOnJpZ2h0XCI+PGlucHV0IHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBhY3Rpb24tYnV0dG9uXCIgdmFsdWU9XCInICsgU3VwcG9ydC5BbGVydHMuY29uZmlybUJ1dHRvbiArICdcIi8+PC9wPicpO1xyXG5cdFx0XHRcdFx0Ly8gQWRkIGNvbnRyb2xzXHJcblx0XHRcdFx0XHR0aGlzLmNvbnRlbnQuZmluZChcIi5hY3Rpb25cIikuYXBwZW5kKCc8aW5wdXQgdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGFjdGlvbi1idXR0b25cIiB2YWx1ZT1cIicgKyBTdXBwb3J0LkFsZXJ0cy5jb25maXJtQnV0dG9uICsgJ1wiLz48bGFiZWwgY2xhc3M9XCJhY3Rpb24tY2hlY2tib3hcIj48aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgLz4nICsgU3VwcG9ydC5BbGVydHMuY29uZmlybUNoZWNrYm94ICsgJzwvbGFiZWw+Jyk7XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRhZnRlclNob3c6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0dmFyIGFsZXJ0QiA9IHRoaXMuY29udGVudC5maW5kKFwiLmFjdGlvbi1idXR0b25cIiksXHJcblx0XHRcdFx0XHRcdGFjdGlvbkIgPSB0aGlzLmNvbnRlbnQuZmluZChcIi5hY3Rpb24gLmFjdGlvbi1idXR0b25cIiksXHJcblx0XHRcdFx0XHRcdGFsZXJ0QyA9IHRoaXMuY29udGVudC5maW5kKFwiLmFjdGlvbi1jaGVja2JveCBpbnB1dFwiKSxcclxuXHRcdFx0XHRcdFx0YWxlcnRYID0gJCgnLmZhbmN5Ym94LWRpYWxvZyAuZmFuY3lib3gtY2xvc2UnKTtcclxuXHRcdFx0XHRcdGNsb3NlRGlhbG9nID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdC8vIENyZWF0ZSBjb29raWUgaWYgY2hlY2tib3ggaXMgY2hlY2tlZFxyXG5cdFx0XHRcdFx0XHRpZiAoYWxlcnRDLmlzKCc6Y2hlY2tlZCcpKSB7XHJcblx0XHRcdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGFsZXJ0TWVzc2FnZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdCQuY29va2llKGFsZXJ0TWVzc2FnZXNbaV0uaWQsIGFsZXJ0TWVzc2FnZXNbaV0uaWQsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZXhwaXJlczogMzY1LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRwYXRoOiBcIi9cIixcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZG9tYWluOiBcIi5ibWMuY29tXCJcclxuXHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHQkLmZhbmN5Ym94LmNsb3NlKCk7XHJcblx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0Ly8gQ2hlY2sgaWYgdGV4dCBvdmVyZmxvd3MgbWVzc2FnZSBjb250YWluZXJcclxuXHRcdFx0XHRcdGlmICh0aGlzLm1lc3NhZ2VzWzBdLnNjcm9sbEhlaWdodCA+IHRoaXMubWVzc2FnZXMuaW5uZXJIZWlnaHQoKSkge1xyXG5cdFx0XHRcdFx0XHRhY3Rpb25CLnByb3AoXCJkaXNhYmxlZFwiLCB0cnVlKTtcclxuXHRcdFx0XHRcdFx0dGhpcy5tZXNzYWdlcy5iaW5kKCdzY3JvbGwnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoJCh0aGlzKVswXS5zY3JvbGxIZWlnaHQgLSAkKHRoaXMpLnNjcm9sbFRvcCgpIDw9ICQodGhpcykuaW5uZXJIZWlnaHQoKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0YWN0aW9uQi5wcm9wKFwiZGlzYWJsZWRcIiwgZmFsc2UpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQvLyBDbG9zZSBkaWFsb2cgd2hlbiBidXR0b25zIGFyZSBjbGlja2VkXHJcblx0XHRcdFx0XHRhbGVydEIub24oXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0Y2xvc2VEaWFsb2coKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0YWxlcnRYLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdGNsb3NlRGlhbG9nKCk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGFmdGVyQ2xvc2U6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0Ly8gUmVtb3ZlIGRpYWxvZyBjb250ZW50XHJcblx0XHRcdFx0XHR0aGlzLmNvbnRlbnQuaHRtbChcIlwiKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdFN1cHBvcnQuR2V0dGluZ1N0YXJ0ZWRDYXJvdXNlbCA9IHtcclxuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKCcuc3VwcG9ydC1nZXR0aW5nLXN0YXJ0ZWQtdG9waWNzLmNhcm91c2VsIC50b3BpY3MnKS5vd2xDYXJvdXNlbCh7XHJcblx0XHRcdFx0aXRlbXM6IDEsXHJcblx0XHRcdFx0bmF2OiBmYWxzZVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHRTdXBwb3J0LlRvZ2dsZVNlYXJjaEFyZWFzID0ge1xyXG5cclxuXHRcdHNlYXJjaEFyZWFzU2VsZWN0b3I6ICcuanMtc3VwcG9ydC1zZWFyY2gtYXJlYScsXHJcblx0XHR0b2dnbGVBY3Rpb25TZWxlY3RvcjogJy5qcy1zdXBwb3J0LXNlYXJjaC10b2dnbGUnLFxyXG5cdFx0dG9nZ2xlQWN0aW9uTGFiZWxTZWxlY3RvcjogJy5qcy1zdXBwb3J0LXNlYXJjaC10b2dnbGUnLFxyXG5cdFx0dG9nZ2xlTGFiZWxUZXh0OiB7XHJcblx0XHRcdGV4cGFuZDogJ01vcmUgUmVzb3VyY2VzJyxcclxuXHRcdFx0Y29sbGFwc2U6ICdDb2xsYXBzZSdcclxuXHRcdH0sXHJcblx0XHR0b2dnbGFibGVBcmVhczogbnVsbCxcclxuXHRcdGVsZW1lbnRzU2hvd246IGZhbHNlLFxyXG5cdFx0aGlkZUxhc3RRdHk6IDQsXHJcblxyXG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0XHQvLyBvbmx5IGluaXRpYWxpemUgaWYgLmpzLXN1cHBvcnQtc2VhcmNoLXRvZ2dsZS1leHRyYSBleGlzdHNcclxuXHRcdFx0aWYgKCQoJy5qcy1zdXBwb3J0LXNlYXJjaC10b2dnbGUtZXh0cmEnKS5sZW5ndGggPT09IDApIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIFNFVFVQXHJcblx0XHRcdHRoaXMuZmluZFRvZ2dsYWJsZUVsZW1lbnRzKCk7XHJcblx0XHRcdHRoaXMuYWRkSGFuZGxlcnMoKTtcclxuXHJcblx0XHRcdC8vIElOSVRJQUwgQUNUSU9OU1xyXG5cdFx0XHR0aGlzLmFjdGlvbnMuaGlkZSh0aGlzLmhlbHBlcnMuaGlkZUVsZW1lbnRzSW5zdGFudCk7XHJcblx0XHRcdHRoaXMuYWN0aW9ucy51cGRhdGVMYWJlbCh0aGlzLnRvZ2dsZUxhYmVsVGV4dC5leHBhbmQpO1xyXG5cdFx0fSxcclxuXHJcblx0XHRoZWxwZXJzOiB7XHJcblx0XHRcdHNob3dFbGVtZW50c0ZhZGU6IGZ1bmN0aW9uKGVsZW1lbnRzKSB7XHJcblx0XHRcdFx0cmV0dXJuICQoZWxlbWVudHMpLmZhZGVJbigpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRzaG93RWxlbWVudHNJbnN0YW50OiBmdW5jdGlvbihlbGVtZW50cykge1xyXG5cdFx0XHRcdHJldHVybiAkKGVsZW1lbnRzKS5zaG93KCk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGhpZGVFbGVtZW50c0ZhZGU6IGZ1bmN0aW9uKGVsZW1lbnRzKSB7XHJcblx0XHRcdFx0cmV0dXJuICQoZWxlbWVudHMpLmZhZGVPdXQoKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0aGlkZUVsZW1lbnRzSW5zdGFudDogZnVuY3Rpb24oZWxlbWVudHMpIHtcclxuXHRcdFx0XHRyZXR1cm4gJChlbGVtZW50cykuaGlkZSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdGZpbmRUb2dnbGFibGVFbGVtZW50czogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBzZWFyY2hBcmVhcyA9ICQodGhpcy5zZWFyY2hBcmVhc1NlbGVjdG9yKTtcclxuXHRcdFx0dmFyIHNsaWNlRnJvbSA9IHNlYXJjaEFyZWFzLmxlbmd0aCAtIHRoaXMuaGlkZUxhc3RRdHk7XHJcblx0XHRcdHZhciBzbGljZVRvID0gc2VhcmNoQXJlYXMubGVuZ3RoO1xyXG5cdFx0XHR0aGlzLnRvZ2dsYWJsZUFyZWFzID0gc2VhcmNoQXJlYXMuc2xpY2Uoc2xpY2VGcm9tLCBzbGljZVRvKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0YWN0aW9uczoge1xyXG5cdFx0XHR0b2dnbGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGlmIChTdXBwb3J0LlRvZ2dsZVNlYXJjaEFyZWFzLmVsZW1lbnRzU2hvd24pIHtcclxuXHRcdFx0XHRcdHRoaXMuaGlkZShTdXBwb3J0LlRvZ2dsZVNlYXJjaEFyZWFzLmhlbHBlcnMuaGlkZUVsZW1lbnRzRmFkZSk7XHJcblx0XHRcdFx0XHR0aGlzLnVwZGF0ZUxhYmVsKFN1cHBvcnQuVG9nZ2xlU2VhcmNoQXJlYXMudG9nZ2xlTGFiZWxUZXh0LmV4cGFuZCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMuc2hvdyhTdXBwb3J0LlRvZ2dsZVNlYXJjaEFyZWFzLmhlbHBlcnMuc2hvd0VsZW1lbnRzRmFkZSk7XHJcblx0XHRcdFx0XHR0aGlzLnVwZGF0ZUxhYmVsKFN1cHBvcnQuVG9nZ2xlU2VhcmNoQXJlYXMudG9nZ2xlTGFiZWxUZXh0LmNvbGxhcHNlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHNob3c6IGZ1bmN0aW9uKGVsZW1lbnRzSGFuZGxlcikge1xyXG5cdFx0XHRcdGlmICh0eXBlb2YgZWxlbWVudHNIYW5kbGVyID09PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdFx0XHRlbGVtZW50c0hhbmRsZXIoJChTdXBwb3J0LlRvZ2dsZVNlYXJjaEFyZWFzLnRvZ2dsYWJsZUFyZWFzKSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRTdXBwb3J0LlRvZ2dsZVNlYXJjaEFyZWFzLmVsZW1lbnRzU2hvd24gPSB0cnVlO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRoaWRlOiBmdW5jdGlvbihlbGVtZW50c0hhbmRsZXIpIHtcclxuXHRcdFx0XHRpZiAodHlwZW9mIGVsZW1lbnRzSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHRcdFx0ZWxlbWVudHNIYW5kbGVyKCQoU3VwcG9ydC5Ub2dnbGVTZWFyY2hBcmVhcy50b2dnbGFibGVBcmVhcykpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0U3VwcG9ydC5Ub2dnbGVTZWFyY2hBcmVhcy5lbGVtZW50c1Nob3duID0gZmFsc2U7XHJcblx0XHRcdH0sXHJcblx0XHRcdHVwZGF0ZUxhYmVsOiBmdW5jdGlvbih0ZXh0KSB7XHJcblx0XHRcdFx0JChTdXBwb3J0LlRvZ2dsZVNlYXJjaEFyZWFzLnRvZ2dsZUFjdGlvbkxhYmVsU2VsZWN0b3IpLmh0bWwodGV4dCk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cclxuXHRcdGFkZEhhbmRsZXJzOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0JCh0aGlzLnRvZ2dsZUFjdGlvblNlbGVjdG9yKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdHRoaXMuYWN0aW9ucy50b2dnbGUoKTtcclxuXHRcdFx0fS5iaW5kKHRoaXMpKTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHRTdXBwb3J0Lk1lbnUgPSB7XHJcblxyXG5cdFx0ZGVza3RvcEJyZWFrcG9pbnQ6IDk2MCxcclxuXHJcblx0XHQvLyB0b3VjaEhhbmRsZXJzIHJlcXVpcmUgYSBgY2xpY2tgIHRvIHRyaWdnZXIgYSBtZW51XHJcblx0XHR0b3VjaEhhbmRsZXJzOiBmdW5jdGlvbihhZGFwdGVyKSB7XHJcblx0XHRcdHZhciBtZW51ID0gYWRhcHRlci5tZW51O1xyXG5cdFx0XHQkKG1lbnUuc3ViTWVudVRyaWdnZXJTZWxlY3Rvcikub24oe1xyXG5cdFx0XHRcdCdjbGljayc6IGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHRcdGlmICghJChtZW51LnN1Yk1lbnVTZWxlY3RvcikuaGFzKCQoZS50YXJnZXQpKSkge1xyXG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR2YXIgc3ViTWVudSA9IG1lbnUuZmluZE1lbnVGcm9tVGFyZ2V0KGUudGFyZ2V0KTtcclxuXHJcblx0XHRcdFx0XHRpZiAoc3ViTWVudS5oYXNDbGFzcyhtZW51LmV4cGFuZGVkQ2xhc3MpKSB7XHJcblx0XHRcdFx0XHRcdG1lbnUuY29sbGFwc2VNZW51KHN1Yk1lbnUpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0bWVudS5jb2xsYXBzZUFsbFN1Yk1lbnVzKCk7XHJcblx0XHRcdFx0XHRcdG1lbnUuZXhwYW5kTWVudShzdWJNZW51KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSxcclxuXHJcblx0XHQvLyAgbm9Ub3VjaEhhbmRsZXJzIGFzc3VtZXMgYSBtb3VzZSwgYW5kIHVzZXMgYSBgaG92ZXJgIHRvIHRyaWdnZXIgYSBtZW51XHJcblx0XHRub1RvdWNoSGFuZGxlcnM6IGZ1bmN0aW9uKGFkYXB0ZXIpIHtcclxuXHRcdFx0dmFyIG1lbnUgPSBhZGFwdGVyLm1lbnU7XHJcblx0XHRcdCQobWVudS5zdWJNZW51VHJpZ2dlclNlbGVjdG9yKS5vbih7XHJcblx0XHRcdFx0J21vdXNlZW50ZXInOiBmdW5jdGlvbihlKSB7XHJcblx0XHRcdFx0XHRtZW51LmNvbGxhcHNlQWxsU3ViTWVudXMoKTtcclxuXHRcdFx0XHRcdHZhciBzdWJNZW51ID0gbWVudS5maW5kTWVudUZyb21UYXJnZXQoZS50YXJnZXQpO1xyXG5cdFx0XHRcdFx0bWVudS5leHBhbmRNZW51KHN1Yk1lbnUpO1xyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0J21vdXNlbGVhdmUnOiBmdW5jdGlvbihlKSB7XHJcblx0XHRcdFx0XHRtZW51LmNvbGxhcHNlQWxsU3ViTWVudXMoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBSZWdpc3RlciBjbGlja3MgdGhhdCBoYXBwZW4gb3V0c2lkZSB0aGUgbWVudSwgYW5kIGRpc21pc3MgdGhlIG1lbnVcclxuXHRcdGNvbGxhcHNlT3V0c2lkZUhhbmRsZXI6IGZ1bmN0aW9uKGFkYXB0ZXIpIHtcclxuXHRcdFx0dmFyIG1lbnUgPSBhZGFwdGVyLm1lbnU7XHJcblx0XHRcdHZhciBtZW51RWxlbWVudCA9ICQobWVudS5tZW51RWxlbWVudCk7XHJcblxyXG5cdFx0XHQkKCdib2R5Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdGlmICghJChlLnRhcmdldCkucGFyZW50cygpLmFkZEJhY2soKS5pcyhtZW51RWxlbWVudCkpIHtcclxuXHRcdFx0XHRcdG1lbnUuY29sbGFwc2VBbGxTdWJNZW51cygpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIGJvdGggYHRvdWNoSGFuZGxlcnNgIGFuZCBgbm9Ub3VjaEhhbmRsZXJzYCB1c2UgdGhlIHNhbWVcclxuXHRcdC8vIGVsZW1lbnQgdG8gYXR0YWNoIGhhbmRsZXJzIHRvLCB0aGVyZWZvcmUgY2FuIHVzZSB0aGUgc2FtZVxyXG5cdFx0Ly8gZnVuY3Rpb24gdG8gcmVtb3ZlIHRoZSBoYW5kbGVyc1xyXG5cdFx0ZGVzdG9yeUhhbmRsZXJzOiBmdW5jdGlvbihhZGFwdGVyKSB7XHJcblx0XHRcdHZhciBtZW51ID0gYWRhcHRlci5tZW51O1xyXG5cdFx0XHQkKG1lbnUuc3ViTWVudVRyaWdnZXJTZWxlY3Rvcikub2ZmKCk7XHJcblx0XHR9LFxyXG5cclxuXHRcdGdldE1lbnU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQvLyBnZW5lcmF0ZSBtZW51IGJhc2VkIG9uIHNlbGVjdG9yXHJcblx0XHRcdHZhciBtZW51ID0gbWVudWpzLmdlbmVyYXRlTWVudSh7XHJcblx0XHRcdFx0bWVudUVsZW1lbnQ6ICQoJy5zdXBwb3J0LW1lbnUnKVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHJldHVybiBtZW51O1xyXG5cdFx0fSxcclxuXHJcblx0XHRnZXRBZGFwdGVyczogZnVuY3Rpb24obWVudSkge1xyXG5cdFx0XHR2YXIgc3VwcG9ydE1lbnUgPSB0aGlzO1xyXG5cclxuXHRcdFx0Ly8gY3JlYXRlIGRlc2t0b3AgYWRhcHRlclxyXG5cdFx0XHR2YXIgZGVza3RvcEFkYXB0ZXIgPSBtZW51QWRhcHRlci5nZW5lcmF0ZU1lbnVBZGFwdGVyKG1lbnUsIHtcclxuXHRcdFx0XHRoYW5kbGVyczogW3tcclxuXHRcdFx0XHRcdHNldHVwOiBzdXBwb3J0TWVudS50b3VjaEhhbmRsZXJzLFxyXG5cdFx0XHRcdFx0ZGVzdHJveTogc3VwcG9ydE1lbnUuZGVzdG9yeUhhbmRsZXJzXHJcblx0XHRcdFx0fSwge1xyXG5cdFx0XHRcdFx0c2V0dXA6IHN1cHBvcnRNZW51LmNvbGxhcHNlT3V0c2lkZUhhbmRsZXIsXHJcblx0XHRcdFx0XHRkZXN0cm95OiBzdXBwb3J0TWVudS5kZXN0b3J5SGFuZGxlcnNcclxuXHRcdFx0XHR9XSxcclxuXHRcdFx0XHRpbml0OiBmdW5jdGlvbihhZGFwdGVyKSB7XHJcblx0XHRcdFx0XHQkKGFkYXB0ZXIubWVudS5tZW51RWxlbWVudCkuYWRkQ2xhc3MoJ2Rlc2t0b3AnKTtcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHRlYXJkb3duOiBmdW5jdGlvbihhZGFwdGVyKSB7XHJcblx0XHRcdFx0XHQkKGFkYXB0ZXIubWVudS5tZW51RWxlbWVudCkucmVtb3ZlQ2xhc3MoJ2Rlc2t0b3AnKTtcclxuXHRcdFx0XHRcdGFkYXB0ZXIubWVudS5jb2xsYXBzZUFsbFN1Yk1lbnVzKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdC8vIGNyZWF0ZSBtb2JpbGUgYWRhcHRlclxyXG5cdFx0XHQvLyBtb2JpbGVBZGFwdGVyIHN0YXJ0aW5nIHBvaW50IGlzIGEgY29weSBvZiBkZXNrdG9wIGFkYXB0ZXJcclxuXHRcdFx0dmFyIG1vYmlsZUFkYXB0ZXIgPSBtZW51QWRhcHRlci5nZW5lcmF0ZU1lbnVBZGFwdGVyKG1lbnUsIHtcclxuXHRcdFx0XHRoYW5kbGVyczogW3tcclxuXHRcdFx0XHRcdHNldHVwOiBzdXBwb3J0TWVudS50b3VjaEhhbmRsZXJzLFxyXG5cdFx0XHRcdFx0ZGVzdHJveTogZnVuY3Rpb24oYWRhcHRlcikge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gc3VwcG9ydE1lbnUuZGVzdG9yeUhhbmRsZXJzKGFkYXB0ZXIpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1dLCAvLyBhc3N1bWUgbm8gaG92ZXIgaW50ZXJhY3Rpb25zXHJcblx0XHRcdFx0aW5pdDogZnVuY3Rpb24oYWRhcHRlcikge1xyXG5cdFx0XHRcdFx0JChhZGFwdGVyLm1lbnUubWVudUVsZW1lbnQpLmFkZENsYXNzKCdtb2JpbGUnKTtcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHRlYXJkb3duOiBmdW5jdGlvbihhZGFwdGVyKSB7XHJcblx0XHRcdFx0XHQkKGFkYXB0ZXIubWVudS5tZW51RWxlbWVudCkucmVtb3ZlQ2xhc3MoJ21vYmlsZScpO1xyXG5cdFx0XHRcdFx0YWRhcHRlci5tZW51LmNvbGxhcHNlQWxsU3ViTWVudXMoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0dmFyIGFsbEFkYXB0ZXJzID0ge1xyXG5cdFx0XHRcdG1vYmlsZTogbW9iaWxlQWRhcHRlcixcclxuXHRcdFx0XHRkZXNrdG9wOiBkZXNrdG9wQWRhcHRlclxyXG5cdFx0XHR9O1xyXG5cdFx0XHRyZXR1cm4gYWxsQWRhcHRlcnM7XHJcblx0XHR9LFxyXG5cclxuXHRcdGdldEFkYXB0ZXJNYW5hZ2VyOiBmdW5jdGlvbihtZW51LCBhZGFwdGVycykge1xyXG5cdFx0XHR2YXIgYWRhcHRlck1hbmFnZXIgPSBnZW5lcmF0ZU1lbnVBZGFwdGVyTWFuYWdlcigpO1xyXG5cdFx0XHRyZXR1cm4gYWRhcHRlck1hbmFnZXI7XHJcblx0XHR9LFxyXG5cclxuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgbWVudSA9IHRoaXMuZ2V0TWVudSgpO1xyXG5cdFx0XHR2YXIgYWRhcHRlcnMgPSB0aGlzLmdldEFkYXB0ZXJzKG1lbnUpO1xyXG5cdFx0XHR2YXIgYWRhcHRlck1hbmFnZXIgPSB0aGlzLmdldEFkYXB0ZXJNYW5hZ2VyKG1lbnUsIGFkYXB0ZXJzKTtcclxuXHJcblx0XHRcdHZhciBpc0Rlc2t0b3AgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQvLyBpbiBjYXNlIG1lZGlhIHF1ZXJpZXMgYXJlbid0IHN1cHBvcnRlZCBieSB0aGUgYnJvd3NlciwgdGhlbiBkZWZhdWx0IHRvIHVzaW5nIHRoZSB3aWR0aCBvZiB0aGUgd2luZG93XHJcblx0XHRcdFx0cmV0dXJuIE1vZGVybml6ci5tcSgnKG1pbi13aWR0aDogJyArIFN1cHBvcnQuTWVudS5kZXNrdG9wQnJlYWtwb2ludCArICdweCknKSB8fCAkKHdpbmRvdykud2lkdGgoKSA+PSBTdXBwb3J0Lk1lbnUuZGVza3RvcEJyZWFrcG9pbnQ7XHJcblx0XHRcdH07XHJcblx0XHRcdHZhciBpc01vYmlsZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJldHVybiAhaXNEZXNrdG9wKCk7XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHQvLyBBZGQgYWRhcHRlciBmb3IgdmFyaW91cyBjb25kaXRpb25zLCBvbiB0aGUgYWRhcHRlciBtYW5hZ2VyXHJcblx0XHRcdGFkYXB0ZXJNYW5hZ2VyLmFkZENvbmRpdGlvbihmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXR1cm4gaXNEZXNrdG9wKCk7XHJcblx0XHRcdH0sIGFkYXB0ZXJzLmRlc2t0b3ApO1xyXG5cclxuXHRcdFx0YWRhcHRlck1hbmFnZXIuYWRkQ29uZGl0aW9uKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJldHVybiBpc01vYmlsZSgpO1xyXG5cdFx0XHR9LCBhZGFwdGVycy5tb2JpbGUpO1xyXG5cclxuXHRcdFx0YWRhcHRlck1hbmFnZXIuaW5pdCgpO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdFN1cHBvcnQuTW9iaWxlVG9nZ2xlSGVhZGVyID0ge1xyXG5cclxuXHRcdGJhc2VIZWlnaHQ6IG51bGwsXHJcblx0XHRtYXhIZWlnaHQ6IDE1MDAsXHJcblx0XHRicmVha3BvaW50VG9nZ2xlOiA5NjAsXHJcblxyXG5cdFx0YWN0aW9uczoge1xyXG5cdFx0XHRvcGVuOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQkKCcuc3VwcG9ydC1oZWFkZXInKS5hZGRDbGFzcygnZXhwYW5kZWQnKTtcclxuXHRcdFx0XHQkKCcuc3VwcG9ydC1oZWFkZXInKS5jc3MoJ21heC1oZWlnaHQnLCAnMTIwMHB4Jyk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGNsb3NlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR0aGlzLnNldEhlaWdodEFzQmFzZUhlaWdodCgpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRzZXRIZWlnaHRBc0Jhc2VIZWlnaHQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdCQoJy5zdXBwb3J0LWhlYWRlcicpLmNzcygnbWF4LWhlaWdodCcsIFN1cHBvcnQuTW9iaWxlVG9nZ2xlSGVhZGVyLmJhc2VIZWlnaHQgKyAncHgnKTtcclxuXHJcblx0XHRcdFx0Ly8gYnkgZGVmYXVsdCBvdGhlciBicm93c2VycyB3aWxsIHRyaWdnZXIgY2xvc2Ugb24gYWRkSGFuZGxlcnMgYXQgdGhlIGVuZCBvZiB0aGUgY3NzIHRyYW5zaXRpb25cclxuXHRcdFx0XHQvLyBpZTggd2lsbCBuZXZlciB0cmlnZ2VyIHRoZSBlbmQgY3NzIHRyYW5zaXRpb24gZXZlbnQgYXMgaXQgZG9lc24ndCBzdXBwb3J0IHRyYW5zaXRpb25zXHJcblx0XHRcdFx0aWYgKCQoJ2h0bWwnKS5oYXNDbGFzcygnb2xkaWUnKSkge1xyXG5cdFx0XHRcdFx0JCgnLnN1cHBvcnQtaGVhZGVyJykudHJpZ2dlcigndHJhbnNpdGlvbmVuZCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0YXBwbHlJZk1vYmlsZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0Ly8gaWYgZGVza3RvcCwgcmVtb3ZlIG1heC1oZWlnaHQgYW5kIGV4cGFuZGVkIGNsYXNzXHJcblx0XHRcdFx0Ly8gaW4gY2FzZSBtZWRpYSBxdWVyaWVzIGFyZW4ndCBzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIsIHRoZW4gZGVmYXVsdCB0byB1c2luZyB0aGUgd2lkdGggb2YgdGhlIHdpbmRvd1xyXG5cdFx0XHRcdHZhciBpc0Rlc2t0b3AgPSBNb2Rlcm5penIubXEoJyhtaW4td2lkdGg6ICcgKyBTdXBwb3J0Lk1vYmlsZVRvZ2dsZUhlYWRlci5icmVha3BvaW50VG9nZ2xlICsgJ3B4KScpIHx8ICQod2luZG93KS53aWR0aCgpID49IFN1cHBvcnQuTWVudS5kZXNrdG9wQnJlYWtwb2ludDtcclxuXHRcdFx0XHRpZiAoaXNEZXNrdG9wKSB7XHJcblx0XHRcdFx0XHQkKCcuc3VwcG9ydC1oZWFkZXInKS5jc3MoJ21heC1oZWlnaHQnLCAnJyk7XHJcblx0XHRcdFx0XHQkKCcuc3VwcG9ydC1oZWFkZXInKS5yZW1vdmVDbGFzcygnZXhwYW5kZWQnKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYgKCQoJy5zdXBwb3J0LWhlYWRlcicpLmhhc0NsYXNzKCdleHBhbmRlZCcpKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMub3BlbigpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5jbG9zZSgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHRjYWxjQmFzZUhlaWdodDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdC8vIGlmIHRoZSBoZWlnaHQgc2hvdWxkIGJlIGRldGVybWluZWQgZHluYW1pY2FsbHlcclxuXHRcdFx0Ly8gdGhpcy5iYXNlSGVpZ2h0ID0gJCgnLmxvZ28tYmFyLWNvbnRhaW5lcicpLmhlaWdodCgpO1xyXG5cclxuXHRcdFx0dGhpcy5iYXNlSGVpZ2h0ID0gOTA7XHJcblx0XHR9LFxyXG5cclxuXHRcdGFkZEhhbmRsZXJzOiBmdW5jdGlvbigpIHtcclxuXHJcblx0XHRcdCQoJy5qcy10b2dnbGUtb3Blbi1oZWFkZXInKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRpZiAoJCgnLnN1cHBvcnQtaGVhZGVyJykuaGFzQ2xhc3MoJ2V4cGFuZGVkJykpIHtcclxuXHRcdFx0XHRcdFN1cHBvcnQuTW9iaWxlVG9nZ2xlSGVhZGVyLmFjdGlvbnMuY2xvc2UoKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0U3VwcG9ydC5Nb2JpbGVUb2dnbGVIZWFkZXIuYWN0aW9ucy5vcGVuKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdCQoJy5zdXBwb3J0LWhlYWRlcicpLm9uKCd0cmFuc2l0aW9uZW5kIHdlYmtpdFRyYW5zaXRpb25FbmQgb1RyYW5zaXRpb25FbmQgTVNUcmFuc2l0aW9uRW5kJywgZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0XHRcdC8vIHRyYW5zaXRpb24gaGFzIGVuZGVkIGFuZCBhdCBlbmQgaGVpZ2h0IHBvc2l0aW9uXHJcblx0XHRcdFx0aWYgKCQoJy5zdXBwb3J0LWhlYWRlcicpLmhlaWdodCgpID09PSBTdXBwb3J0Lk1vYmlsZVRvZ2dsZUhlYWRlci5iYXNlSGVpZ2h0IHx8ICQoJ2h0bWwnKS5oYXNDbGFzcygnb2xkaWUnKSkge1xyXG5cdFx0XHRcdFx0JCgnLnN1cHBvcnQtaGVhZGVyJykucmVtb3ZlQ2xhc3MoJ2V4cGFuZGVkJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdCQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdFN1cHBvcnQuTW9iaWxlVG9nZ2xlSGVhZGVyLmFjdGlvbnMuYXBwbHlJZk1vYmlsZSgpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHR9LFxyXG5cclxuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHRcdHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHNlbGYuY2FsY0Jhc2VIZWlnaHQoKTtcclxuXHRcdFx0XHRzZWxmLmFkZEhhbmRsZXJzKCk7XHJcblx0XHRcdFx0c2VsZi5hY3Rpb25zLmFwcGx5SWZNb2JpbGUoKTtcclxuXHRcdFx0fSwgMCk7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0Ly8gdXNlZCB0byBhdHRhY2ggdGhlIGNsYXNzIG9uIGxvYWQgdG8gdHJhbnNpdGlvbiB0aGUgZml4ZWQgc2lkZSBpbnRvIHZpZXdcclxuXHRTdXBwb3J0LlNsaWRlSW5TdXBwb3J0Q2hhdEJ1dHRvbiA9IHtcclxuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgJGNoYXROb3cgPSAkKCcuc3VwcG9ydC1jaGF0LW5vdywgLmNoYXQtbm93LWxpbmsnKTtcclxuXHRcdFx0aWYgKCRjaGF0Tm93Lmxlbmd0aCkge1xyXG5cdFx0XHRcdCRjaGF0Tm93LmFkZENsYXNzKCdvbi1zY3JlZW4nKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gaW5pdCBlYWNoIHN1cHBvcnQgZmVhdHVyZVxyXG5cdGZ1bmN0aW9uIGluaXQoKSB7XHJcblx0XHRTdXBwb3J0LkF1dGhlbnRpY2F0ZWRCbG9ja3MuaW5pdCgpO1xyXG5cdFx0U3VwcG9ydC5HZXR0aW5nU3RhcnRlZENhcm91c2VsLmluaXQoKTtcclxuXHRcdFN1cHBvcnQuQ29udHJvbHMuaW5pdCgpO1xyXG5cdFx0U3VwcG9ydC5BbGVydHMuaW5pdCgpO1xyXG5cdFx0U3VwcG9ydC5Ub2dnbGVTZWFyY2hBcmVhcy5pbml0KCk7XHJcblx0XHRTdXBwb3J0Lk1lbnUuaW5pdCgpO1xyXG5cdFx0U3VwcG9ydC5Nb2JpbGVUb2dnbGVIZWFkZXIuaW5pdCgpO1xyXG5cdFx0U3VwcG9ydC5TbGlkZUluU3VwcG9ydENoYXRCdXR0b24uaW5pdCgpO1xyXG5cdH1cclxuXHJcblx0JChpbml0KTtcclxuXHJcbn0oalF1ZXJ5KSk7XHJcbiIsInZhciBnZW5lcmF0ZU1lbnVBZGFwdGVyID0gKGZ1bmN0aW9uKCkge1xyXG5cclxuXHR2YXIgYWRhcHRlckFQSSA9IHtcclxuXHJcblx0XHRsYWJlbDogJycsXHJcblx0XHRtZW51OiBudWxsLFxyXG5cdFx0aW50ZXJmYWNlOiAndG91Y2gnLCAvLyBhc3N1bWUgYSB0b3VjaCBpbnRlcmZhY2UgYnkgZGVmYXVsdCwgbW9iaWxlLWZpcnN0XHJcblx0XHRoYW5kbGVyczogW10sXHJcblxyXG5cdFx0c2V0dXBIYW5kbGVyczogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBhZGFwdGVyID0gdGhpcztcclxuXHRcdFx0JC5lYWNoKHRoaXMuaGFuZGxlcnMsIGZ1bmN0aW9uKGksIGhhbmRsZXIpe1xyXG5cdFx0XHRcdGhhbmRsZXIuc2V0dXAoYWRhcHRlcik7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSxcclxuXHRcdGRlc3Ryb3lIYW5kbGVyczogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBhZGFwdGVyID0gdGhpcztcclxuXHRcdFx0JC5lYWNoKHRoaXMuaGFuZGxlcnMsIGZ1bmN0aW9uKGksIGhhbmRsZXIpe1xyXG5cdFx0XHRcdGhhbmRsZXIuZGVzdHJveShhZGFwdGVyKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9LFxyXG5cclxuXHRcdHRlYXJkb3duOiBmdW5jdGlvbihhZGFwdGVyKSB7fSxcclxuXHRcdGluaXQ6IGZ1bmN0aW9uKGFkYXB0ZXIpIHt9XHJcblx0fTtcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uKG1lbnUsIG9wdGlvbnMpIHtcclxuXHJcblx0XHR2YXIgYWRhcHRlciA9ICQuZXh0ZW5kKHt9LCBhZGFwdGVyQVBJLCBvcHRpb25zLCB7XHJcblxyXG5cdFx0XHRtZW51OiBtZW51LFxyXG5cclxuXHRcdFx0aW5pdDogZnVuY3Rpb24oaW50ZXJmYWNlKSB7XHJcblxyXG5cdFx0XHRcdG1lbnUuaW5pdCgpO1xyXG5cclxuXHRcdFx0XHR0aGlzLmludGVyZmFjZSA9IGludGVyZmFjZTtcclxuXHRcdFx0XHR0aGlzLnNldHVwSGFuZGxlcnMoKTtcclxuXHJcblx0XHRcdFx0Ly8gZmluaXNoIHdpdGggZXhlY3V0aW5nIHRoZSBvcHRpb25zIHBhc3NlZCBpblxyXG5cdFx0XHRcdGlmICh0eXBlb2Ygb3B0aW9ucy5pbml0ID09PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdFx0XHRvcHRpb25zLmluaXQodGhpcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0dGVhcmRvd246IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdFx0XHR0aGlzLmRlc3Ryb3lIYW5kbGVycygpO1xyXG5cclxuXHRcdFx0XHRpZiAodHlwZW9mIG9wdGlvbnMudGVhcmRvd24gPT09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0XHRcdG9wdGlvbnMudGVhcmRvd24odGhpcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gYWRhcHRlcjtcclxuXHJcblx0fTtcclxuXHJcbn0pKCk7XHJcblxyXG5leHBvcnRzLmdlbmVyYXRlTWVudUFkYXB0ZXIgPSBnZW5lcmF0ZU1lbnVBZGFwdGVyO1xyXG4iLCJ2YXIgZ2VuZXJhdGVNZW51ID0gKGZ1bmN0aW9uKCkge1xyXG5cclxuXHR2YXIgbWVudURlZmF1bHQgPSB7XHJcblxyXG5cdCAgbWVudUVsZW1lbnQ6ICQoJy5tZW51JyksXHJcblx0ICBzdWJNZW51U2VsZWN0b3I6ICcuc3ViLW1lbnUnLFxyXG5cdCAgZXhwYW5kZWRDbGFzczogJ2V4cGFuZGVkJyxcclxuXHQgIHN1Yk1lbnVUcmlnZ2VyU2VsZWN0b3I6ICcuanMtc2hvdy1zdWItdHJpZ2dlcicsXHJcblxyXG5cdCAgZXhwYW5kTWVudTogZnVuY3Rpb24oc3ViTWVudUVsZW1lbnQpIHtcclxuXHRcdCQoc3ViTWVudUVsZW1lbnQpLmFkZENsYXNzKHRoaXMuZXhwYW5kZWRDbGFzcyk7XHJcblx0ICB9LFxyXG5cclxuXHQgIGNvbGxhcHNlTWVudTogZnVuY3Rpb24oc3ViTWVudUVsZW1lbnQpIHtcclxuXHRcdCQoc3ViTWVudUVsZW1lbnQpLnJlbW92ZUNsYXNzKHRoaXMuZXhwYW5kZWRDbGFzcyk7XHJcblx0ICB9LFxyXG5cclxuXHQgIGNvbGxhcHNlQWxsU3ViTWVudXM6IGZ1bmN0aW9uKCkge1xyXG5cdCAgXHR2YXIgbWVudSA9IHRoaXM7XHJcblx0XHR0aGlzLm1lbnVFbGVtZW50LmZpbmQodGhpcy5zdWJNZW51U2VsZWN0b3IpLmVhY2goZnVuY3Rpb24oaSwgZSl7XHJcblx0XHQgIG1lbnUuY29sbGFwc2VNZW51KGUpO1xyXG5cdFx0fSk7XHJcblx0ICB9LFxyXG5cclxuXHQgIGZpbmRNZW51RnJvbVRhcmdldDogZnVuY3Rpb24odGFyZ2V0KSB7XHJcblx0XHR2YXIgdHJpZ2dlciA9ICQodGFyZ2V0KS5wYXJlbnQodGhpcy5zdWJNZW51VHJpZ2dlclNlbGVjdG9yKS5hZGRCYWNrKHRoaXMuc3ViTWVudVRyaWdnZXJTZWxlY3Rvcik7XHJcblx0XHR2YXIgbWVudSA9IHRyaWdnZXIuZmluZCh0aGlzLnN1Yk1lbnVTZWxlY3Rvcik7XHJcblx0XHRyZXR1cm4gbWVudTtcclxuXHQgIH0sXHJcblxyXG5cdCAgaW5pdDogZnVuY3Rpb24oKSB7fVxyXG5cdH07XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0ICByZXR1cm4gJC5leHRlbmQoe30sIG1lbnVEZWZhdWx0LCBvcHRpb25zKTtcclxuXHR9O1xyXG59KSgpO1xyXG5cclxuZXhwb3J0cy5nZW5lcmF0ZU1lbnUgPSAgZ2VuZXJhdGVNZW51O1xyXG4iXX0=
