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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL3N1cHBvcnQuanMiLCJqcy9tb2R1bGVzL21lbnUtYWRhcHRlci5qcyIsImpzL21vZHVsZXMvbWVudS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgbWVudWpzID0gcmVxdWlyZSgnLi9tZW51Jyk7XG52YXIgbWVudUFkYXB0ZXIgPSByZXF1aXJlKCcuL21lbnUtYWRhcHRlcicpO1xuXG52YXIgU3VwcG9ydCA9IFN1cHBvcnQgfHwge307XG5cbihmdW5jdGlvbigkKSB7XG5cblx0dmFyIHN1cHBvcnRFbnYsXG5cdFx0c3VwcG9ydFBhdGgsXG5cdFx0YWxlcnRNZXNzYWdlcyxcblx0XHRpc3N1ZXNDb250YWluZXIgPSAkKCcuanMtaXNzdWVzLWNvbnRhaW5lcicpLFxuXHRcdGNvbnRyYWN0U2VsZWN0b3IgPSAkKCcuanMtY29udHJhY3RzLXNlbGVjdCcpLFxuXHRcdGNvbnRyYWN0RGV0YWlscyA9ICQoJy5hY3Rpb24tZGV0YWlsLWdyb3VwJyksXG5cdFx0YWNjb3VudERldGFpbHMgPSAkKCcuYWN0aW9uLWRldGFpbHMnKSxcblx0XHRhY2NvdW50RXJyb3IgPSAkKCcuanMtYWNjb3VudC1lcnJvcicpLFxuXHRcdGFsZXJ0c0J1dHRvbkNvbnRhaW5lciA9ICQoJ2EuYWxlcnRzLmpzLWZhbmN5RGlhbG9nJykucGFyZW50KCdsaS5hY3Rpb24nKTtcblxuXHRTdXBwb3J0LkhlbHBlcnMgPSB7XG5cblx0XHQvLyBDaGVjayBpZiB0aGUgYm1jTWV0YSBhbmQgYm1jTWV0YS5zdXBwb3J0IGV4aXN0XG5cdFx0Ly8gVXNlZCB0byBhc3N1bWUgb3RoZXIgZnVuY3Rpb25hbGl0eSBiYXNlZCBvbiB0aGUgZXhpc3RhbmNlIG9mIHRoaXMgaW5pdGlhbCBiYXNlIHNldHVwXG5cdFx0Ym1jU3VwcG9ydExvYWRlZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAodHlwZW9mIGJtY01ldGEgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBibWNNZXRhLnN1cHBvcnQgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0sXG5cblx0XHQvLyBDaGVjayB0byBzZWUgaWYgZW5hYmxlQWxlcnRzIGlzIHRydWVcblx0XHRibWNBbGVydHNFbmFibGVkOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICh0eXBlb2YgYm1jTWV0YS5zdXBwb3J0LmVuYWJsZUFsZXJ0cyAhPT0gJ3VuZGVmaW5lZCcgJiYgYm1jTWV0YS5zdXBwb3J0LmVuYWJsZUFsZXJ0cyA9PSB0cnVlKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0U3VwcG9ydC5IZWxwZXJzLmhpZGVBbGVydHNCdXR0b24oKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9LFxuXG5cdFx0aGlkZUFsZXJ0c0J1dHRvbjogZnVuY3Rpb24oKSB7XG5cdFx0XHQkKGFsZXJ0c0J1dHRvbkNvbnRhaW5lcikuaGlkZSgpO1xuXHRcdH0sXG5cdFx0c2hvd0FsZXJ0c0J1dHRvbjogZnVuY3Rpb24oKSB7XG5cdFx0XHQkKGFsZXJ0c0J1dHRvbkNvbnRhaW5lcikuc2hvdygpO1xuXHRcdH0sXG5cblx0XHRpc0F1dGhlbnRpY2F0ZWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHR5cGVvZiBibWNNZXRhICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBibWNNZXRhLnVzZXIgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIGJtY01ldGEudXNlci5pc1N1cHBvcnRBdXRoZW50aWNhdGVkICE9PSBcInVuZGVmaW5lZFwiICYmIGJtY01ldGEudXNlci5pc1N1cHBvcnRBdXRoZW50aWNhdGVkO1xuXHRcdH0sXG5cblx0XHRpc09uU3VwcG9ydExhbmRpbmdQYWdlOiBmdW5jdGlvbigpIHtcblxuXHRcdFx0aWYgKFN1cHBvcnQuSGVscGVycy5ibWNTdXBwb3J0TG9hZGVkKClcblx0XHRcdFx0JiYgdHlwZW9mIGJtY01ldGEucGFnZSAhPT0gJ3VuZGVmaW5lZCdcblx0XHRcdFx0JiYgdHlwZW9mIGJtY01ldGEucGFnZS5sb25nTmFtZSA9PT0gJ3N0cmluZycpIHtcblxuXHRcdFx0XHQvL3ZhciBwYXRoQ2hlY2sgPSAvc3VwcG9ydC4qc3VwcG9ydC1jZW50cmFsLztcblx0XHRcdFx0dmFyIHBhdGhDaGVjayA9IC9zdXBwb3J0LzsgLy9EWFAtODEyXG5cdFx0XHRcdFxuXHRcdFx0XHQvLyBtYXRjaGVzIHBhdGggc3RyaW5nIHdpdGggc3VwcG9ydCBhbmQgc3VwcG9ydCBjZW50cmFsIGluIGl0XG5cdFx0XHRcdC8vIGV4YW1wbGVzOlxuXHRcdFx0XHQvLyBcInN1cHBvcnQ6c3VwcG9ydC1jZW50cmFsXCIgb3IgXCJzdXBwb3J0OnJlZzpzdXBwb3J0LWNlbnRyYWxcIlxuXHRcdFx0XHRpZiAoYm1jTWV0YS5wYWdlLmxvbmdOYW1lLm1hdGNoKHBhdGhDaGVjaykgIT09IG51bGwpIHtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBjYXRjaC1hbGwgZGVmYXVsdFxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBnZXRBY2NvdW50RXJyb3JNZXNzYWdlXG5cdFx0ICogQHBhcmFtICB7c3RyaW5nfSBlcnJvclR5cGUgLSAnaXNzdWUnXG5cdFx0ICogQHBhcmFtICB7c3RyaW5nfSBlcnJvckNvZGUgZXJyb3JDb2RlIChsaWtlbHkgcHVsbGVkIGZyb20gYWpheCByZXNwb25zZSlcblx0XHQgKiBAcmV0dXJuIHtzdHJpbmcgfCB1bmRlZmluZWR9IFJldHVybnMgbWFwcGVkIHN0cmluZyBvciB1bmRlZmluZWQgaWYgbm9uZSBmb3VuZCBpbiB1bmRlZmluZWRcblx0XHQgKi9cblx0XHRnZXRBY2NvdW50RXJyb3JNZXNzYWdlOiBmdW5jdGlvbihlcnJvclR5cGUsIGVycm9yQ29kZSkge1xuXHRcdFx0Ly8gbWFwIGVycm9yVHlwZSB0byBjb3JyZWN0IGVycm9yR3JvdXAsIGVycm9yR3JvdXAgaXMgdXNlZCBhcyB0aGUgaW5kZXggb24gYm1jTWV0YS5zdXBwb3J0LmVycm9yTWVzc2FnZXNcblx0XHRcdGlmIChlcnJvclR5cGUgPT0gJ2lzc3VlJykge1xuXHRcdFx0XHR2YXIgZXJyb3JHcm91cCA9ICdjYXNlRXJyb3JNZXNzYWdlcyc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1VzZSB2YWxpZCBlcnJvclR5cGUgd2hlbiBhY2NvdW50RXJyb3InKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gZGV0ZXJtaW5lIGFwcHJvcHJpYXRlIGVycm9yIG1lc3NhZ2UgYmFzZWQgb24gaW5kZXhlc1xuXHRcdFx0Ly8gdW5kZWZpbmVkIGlmIG1hcHBlZCB2YWx1ZSBub3QgZm91bmRcblx0XHRcdHZhciBlcnJvck1lc3NhZ2UgPSBTdXBwb3J0LkhlbHBlcnMuYm1jU3VwcG9ydExvYWRlZCgpXG5cdFx0XHRcdFx0XHRcdFx0JiYgYm1jTWV0YS5zdXBwb3J0W2Vycm9yR3JvdXBdICE9PSB1bmRlZmluZWRcblx0XHRcdFx0XHRcdFx0XHQmJiBibWNNZXRhLnN1cHBvcnRbZXJyb3JHcm91cF1bZXJyb3JDb2RlXSAhPT0gdW5kZWZpbmVkXG5cdFx0XHRcdFx0XHRcdFx0PyBibWNNZXRhLnN1cHBvcnRbZXJyb3JHcm91cF1bZXJyb3JDb2RlXSA6IHVuZGVmaW5lZDtcblxuXHRcdFx0cmV0dXJuIGVycm9yTWVzc2FnZTtcblx0XHR9LFxuXG5cdFx0YWNjb3VudEVycm9yOiBmdW5jdGlvbihlcnJvclR5cGUsIGVycm9yQ29kZSkge1xuXHRcdFx0Ly8gcmVzZXQgaGlkaW5nIG9mIGNvbnRhaW5lciwgc2hvdyBuZXcgZXJyb3Jcblx0XHRcdFN1cHBvcnQuQ29udHJvbHMuYWN0aW9ucy5yZXNldExvYWRBY2NvdW50RXJyb3IoKTtcblxuXHRcdFx0dmFyIGVycm9yTWVzc2FnZSA9IFN1cHBvcnQuSGVscGVycy5nZXRBY2NvdW50RXJyb3JNZXNzYWdlKGVycm9yVHlwZSwgZXJyb3JDb2RlKTtcblxuXHRcdFx0Ly8gZXJyb3JNZXNzYWdlIGlzIHVuZGVmaW5lZCBpZiBtYXBwZWQgbWVzc2FnZSBub3QgZm91bmRcblx0XHRcdC8vIGF0dGVtcHQgdG8gc2V0IHVzZSBERUZBVUxUX0VSUk9SX01FU1NBR0Vcblx0XHRcdGlmIChlcnJvck1lc3NhZ2UgPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdGVycm9yTWVzc2FnZSA9IFN1cHBvcnQuSGVscGVycy5nZXRBY2NvdW50RXJyb3JNZXNzYWdlKGVycm9yVHlwZSwgJ0RFRkFVTFRfRVJST1JfTUVTU0FHRScpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBzaG93L2hpZGUgc3BlY2lmaWMgY29udGFpbmVycyBiYXNlZCBvbiBlcnJvclR5cGVcblx0XHRcdGlmIChlcnJvclR5cGUgPT0gJ2lzc3VlJykge1xuXHRcdFx0XHQkKGFjY291bnREZXRhaWxzKS5zaG93KCk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIGhpZGUgb3RoZXIgY29udGFpbmVyc1xuXHRcdFx0JChpc3N1ZXNDb250YWluZXIpLmhpZGUoKTtcblxuXHRcdFx0Ly8gc2hvdyBlcnJvciBjb250YWluZXIgd2l0aCBtZXNzYWdlLCBidXQgb25seSBpZiBtZXNzYWdlIGlzIGEgbm9uLWVtcHR5IHN0cmluZ1xuXHRcdFx0Ly8gaWYgdGhlIGVycm9yTWVzc2FnZSB3YXMgcmVzb2x2ZWQgdG8gYSBtYXBwaW5nIG9mIGFuIGVtcHR5IHN0cmluZywgdGhlbiBkb24ndCBzaG93XG5cdFx0XHRpZiAodHlwZW9mIGVycm9yTWVzc2FnZSA9PT0gJ3N0cmluZycgJiYgZXJyb3JNZXNzYWdlLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0JChhY2NvdW50RXJyb3IpLnNob3coKS5odG1sKGVycm9yTWVzc2FnZSk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIFBhcnNlcyBkYXRlcyBjb21pbmcgYmFjayBmcm9tIGFqYXggcmVzcG9uc2UuIEZvciB0aGUgbGFjayBvZiBhIGJldHRlciB0ZXJtIHRoaXMgaXMgYmVpbmdcblx0XHQgKiByZWZlcnJlZCB0byBhcyBgU3VwcG9ydCBMb25nIERhdGVgLCBhbmQgaXMgYSBzdHJpbmcgYmVpbmcgbG9hZGVkIGluIHRoZSBzdGFuZGFyZCBmb3JtYXQ6XG5cdFx0ICogMjAxNS0wNC0xNFQxNDowMjoyMi4wMDBaXG5cdFx0ICogQHBhcmFtICB7U3RyaW5nfSBkYXRlU3RyaW5nIC0gRGF0ZSBmb3JtYXR0ZWQgc3RyaW5nLCBsaWtlICcyMDE1LTA0LTE0VDE0OjAyOjIyLjAwMFonXG5cdFx0ICogQHJldHVybiB7RGF0ZXxudWxsfSBudWxsIGlmIG5vIG1hdGNoZXMsIG9yIG5hdGl2ZSBqYXZhc2NyaXB0IERhdGUgb2JqZWN0XG5cdFx0ICovXG5cdFx0cGFyc2VTdXBwb3J0TG9uZ0RhdGU6IGZ1bmN0aW9uKGRhdGVTdHJpbmcpIHtcblx0XHRcdHZhciBwYXR0ZXJuID0gLyhcXGR7NH0pLShcXGR7Mn0pLShcXGR7Mn0pVChcXGR7Mn0pOihcXGR7Mn0pOihcXGR7Mn0pLihcXGR7M31cXEQpLztcblx0XHRcdHZhciBtYXRjaGVzID0gcGF0dGVybi5leGVjKGRhdGVTdHJpbmcpO1xuXG5cdFx0XHQvLyBvbiBzdWNjZXNzZnVsIG1hdGNoLCBtYXRjaFswXSB3aWxsIGJlIHRoZSBlbnRpcmUgbWF0Y2hlZCBzdHJpbmdcblx0XHRcdC8vIG1hdGNoZWQgZ3JvdXBzIGFyZSBmb2xsb3dpbmcgaW5kZXhlc1xuXHRcdFx0aWYgKG1hdGNoZXMpIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHQvLyBtb250aCBpcyByZXByZXNlbnRlZCBieSBtYXRjaGVzWzJdLCBEYXRlIGNvbnN0cnVjdG9yIGV4cGVjdHMgbW9udGggaW5kZXggZnJvbSAwIHRvIDExLlxuXHRcdFx0XHRcdHJldHVybiBuZXcgRGF0ZShtYXRjaGVzWzFdLCAocGFyc2VJbnQobWF0Y2hlc1syXSkgLSAxKSwgbWF0Y2hlc1szXSwgbWF0Y2hlc1s0XSwgbWF0Y2hlc1s1XSwgbWF0Y2hlc1s2XSk7XG5cdFx0XHRcdH0gY2F0Y2goZXJyb3IpIHtcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKCdVbmFibGUgdG8gcGFyc2VTdXBwb3J0TG9uZ0RhdGUgd2l0aCAnICsgZGF0ZVN0cmluZyArICcuIEVycm9yOlxcbiAnICsgZXJyb3IubWVzc2FnZSk7XG5cdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRwYWQ6IGZ1bmN0aW9uKG4sIHdpZHRoLCB6KSB7XG5cdFx0XHR6ID0geiB8fCAnMCc7XG5cdFx0XHRuID0gbiArICcnO1xuXHRcdFx0cmV0dXJuIG4ubGVuZ3RoID49IHdpZHRoID8gbiA6IG5ldyBBcnJheSh3aWR0aCAtIG4ubGVuZ3RoICsgMSkuam9pbih6KSArIG47XG5cdFx0fSxcblxuXHRcdC8vIFF1aWNrIGFuZCBlYXN5IGZ1bmN0aW9uIGZvciBwYWRkaW5nIG1vbnRoIGFuZCBkYXkgYW1vdW50cyB3aXRoIGxlYWRpbmcgemVyb2VzIGlmIG5lY2Vzc2FyeSAoaWU6IE1NL0REL1lZWVksIHNpbmdsZSBkaWdpdGFscyBmb3IgTU0gYW5kIEREIHNob3VsZCBoYXZlIGxlYWRpbmcgMClcblx0XHRwYWRUb1R3b0RpZ2l0czogZnVuY3Rpb24obnVtKSB7XG5cdFx0XHRyZXR1cm4gU3VwcG9ydC5IZWxwZXJzLnBhZChudW0sIDIpO1xuXHRcdH0sXG5cdFx0Z2V0VVJMV2l0aFF1ZXJ5UGFyYW06IGZ1bmN0aW9uKHVyaSwga2V5LCB2YWx1ZSkge1xuXHRcdFx0dmFyIHJlID0gbmV3IFJlZ0V4cChcIihbPyZdKVwiICsga2V5ICsgXCI9Lio/KCZ8JClcIiwgXCJpXCIpO1xuXHRcdFx0dmFyIHNlcGFyYXRvciA9IHVyaS5pbmRleE9mKCc/JykgIT09IC0xID8gXCImXCIgOiBcIj9cIjtcblxuXHRcdFx0aWYgKHVyaS5tYXRjaChyZSkpIHtcblx0XHRcdFx0cmV0dXJuIHVyaS5yZXBsYWNlKHJlLCAnJDEnICsga2V5ICsgXCI9XCIgKyB2YWx1ZSArICckMicpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHJldHVybiB1cmkgKyBzZXBhcmF0b3IgKyBrZXkgKyBcIj1cIiArIHZhbHVlO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Ly8gQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyBpZiBpdCdzIG5vdCBvbmUuIEFuIGVtcHR5IHN0cmluZyBpcyByZXR1cm5lZCBmb3IgYG51bGxgIG9yIGB1bmRlZmluZWRgIHZhbHVlcy5cblx0XHRiYXNlVG9TdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0ICByZXR1cm4gdmFsdWUgPT0gbnVsbCA/ICcnIDogKHZhbHVlICsgJycpO1xuXHRcdH0sXG5cblx0XHQvLyBDYXBpdGFsaXplcyB0aGUgZmlyc3QgY2hhcmFjdGVyIG9mIGBzdHJpbmdgLlxuXHRcdGNhcGl0YWxpemU6IGZ1bmN0aW9uKHN0cmluZykge1xuXHRcdCAgc3RyaW5nID0gU3VwcG9ydC5IZWxwZXJzLmJhc2VUb1N0cmluZyhzdHJpbmcpO1xuXHRcdCAgcmV0dXJuIHN0cmluZyAmJiAoc3RyaW5nLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyaW5nLnNsaWNlKDEpKTtcblx0XHR9LFxuXG5cdFx0bWFrZUZ1bGxOYW1lOiBmdW5jdGlvbihmaXJzdE5hbWUsIGxhc3ROYW1lKSB7XG5cdFx0XHRyZXR1cm4gU3VwcG9ydC5IZWxwZXJzLmNhcGl0YWxpemUobGFzdE5hbWUudG9Mb3dlckNhc2UoKSkgKyBcIiwgXCIgKyBTdXBwb3J0LkhlbHBlcnMuY2FwaXRhbGl6ZShmaXJzdE5hbWUudG9Mb3dlckNhc2UoKSk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIEFkZCBjbGFzcyB0byBib2R5LCB1c2VkIGJ5IGNzcyB0byBzaG93L2hpZGUgYmxvY2tzXG5cdC8vIHRoYXQgZGVwZW5kIG9uIHN1cHBvcnQgdXNlciBiZWluZyBhdXRoZW50aWNhdGVkXG5cdFN1cHBvcnQuQXV0aGVudGljYXRlZEJsb2NrcyA9IHtcblx0XHRpbml0OiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBzdXBwb3J0QXV0aGVudGljYXRlZENsYXNzID0gKFN1cHBvcnQuSGVscGVycy5pc0F1dGhlbnRpY2F0ZWQoKSkgPyAnc3VwcG9ydC1sb2dnZWQtaW4nIDogJ3N1cHBvcnQtbG9nZ2VkLW91dCc7XG5cdFx0XHQkKCdib2R5JykuYWRkQ2xhc3Moc3VwcG9ydEF1dGhlbnRpY2F0ZWRDbGFzcyk7XG5cdFx0fVxuXHR9O1xuXG5cdFN1cHBvcnQuSXNzdWVzID0ge1xuXG5cdFx0dGFibGVSb3dzU2VsZWN0b3I6ICcuanMtc3VwcG9ydC1pc3N1ZXMtcm93cycsXG5cdFx0c2hvd01vcmVTZWxlY3RvcjogJy5qcy1zdXBwb3J0LWlzc3Vlcy1zaG93LW1vcmUnLFxuXHRcdGlzc3VlVGFibGVXcmFwcGVyU2VsZWN0b3I6ICcuanMtaXNzdWUtdGFibGUtd3JhcHBlcicsXG5cdFx0aGlkZGVuQ2xhc3M6ICdoaWRkZW4nLFxuXHRcdHNob3dCYXRjaFF0eTogMTAsXG5cdFx0Ly8gc3RhdGVmdWwgc2VsZWN0b3JzIGFuZCBjbGFzc2VzXG5cdFx0bG9hZGluZ0lzc3Vlc0NvbnRhaW5lclNlbGVjdG9yOiAnLmpzLWxvYWRpbmctaXNzdWVzLWNvbnRhaW5lcicsXG5cdFx0bm9Jc3N1ZXNDb250YWluZXJTZWxlY3RvcjogJy5qcy1uby1pc3N1ZXMtY29udGFpbmVyJyxcblx0XHRoYXNJc3N1ZXNDb250YWluZXJTZWxlY3RvcjogJy5qcy1pc3N1ZXMtY29udGFpbmVyJyxcblx0XHRsb2FkaW5nRmFpbGVkSXNzdWVzQ29udGFpbmVyU2VsZWN0b3I6ICcuanMtZmFpbGVkLWxvYWRpbmctaXNzdWVzLWNvbnRhaW5lcicsXG5cdFx0aGlkZU9uSW5pdENsYXNzOiAnc3VwcG9ydC1oaWRlLXdoaWxlLWxvYWRpbmcnLFxuXG5cdFx0Z2V0TW9kdWxlU3RhdGVDb250YWluZXJTZWxlY3RvcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0bG9hZDogU3VwcG9ydC5Jc3N1ZXMubG9hZGluZ0lzc3Vlc0NvbnRhaW5lclNlbGVjdG9yLFxuXHRcdFx0XHRoYXNJc3N1ZXM6IFN1cHBvcnQuSXNzdWVzLmhhc0lzc3Vlc0NvbnRhaW5lclNlbGVjdG9yLFxuXHRcdFx0XHRub0lzc3VlczogU3VwcG9ydC5Jc3N1ZXMubm9Jc3N1ZXNDb250YWluZXJTZWxlY3Rvcixcblx0XHRcdFx0ZmFpbGVkOiBTdXBwb3J0Lklzc3Vlcy5sb2FkaW5nRmFpbGVkSXNzdWVzQ29udGFpbmVyU2VsZWN0b3Jcblx0XHRcdH07XG5cdFx0fSxcblxuXHRcdGxvYWRWaWFVcmw6IGZ1bmN0aW9uKHVybCkge1xuXG5cdFx0XHRTdXBwb3J0Lklzc3Vlcy5hY3Rpb25zLnNob3dTdGF0ZUNvbnRhaW5lcignbG9hZCcpO1xuXG5cdFx0XHQkLmdldEpTT04odXJsLCBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdGlmICh0eXBlb2YgZGF0YS5DYXNlcyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0XHR2YXIgaXNzdWVzID0gJC5tYXAoZGF0YS5DYXNlcywgU3VwcG9ydC5Jc3N1ZXMubWFwVG9Jc3N1ZUZvcm1hdClcblx0XHRcdFx0XHRcdC8vIHNvcnRzIGJ5IG1vc3QgcmVjZW50LCBkZXNjZW5kaW5nXG5cdFx0XHRcdFx0XHQuc29ydChmdW5jdGlvbihhLCBiKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChhLmxhc3RVcGRhdGVkUmF3RGF0ZSAmJlxuXHRcdFx0XHRcdFx0XHRcdGIubGFzdFVwZGF0ZWRSYXdEYXRlICYmXG5cdFx0XHRcdFx0XHRcdFx0YS5sYXN0VXBkYXRlZFJhd0RhdGUgPiBiLmxhc3RVcGRhdGVkUmF3RGF0ZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIC0xO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0aWYgKGEubGFzdFVwZGF0ZWRSYXdEYXRlICYmXG5cdFx0XHRcdFx0XHRcdFx0Yi5sYXN0VXBkYXRlZFJhd0RhdGUgJiZcblx0XHRcdFx0XHRcdFx0XHRhLmxhc3RVcGRhdGVkUmF3RGF0ZSA8IGIubGFzdFVwZGF0ZWRSYXdEYXRlKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gMTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdHJldHVybiAwO1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC8vIG9ubHkga2VlcCAyMCBpc3N1ZXMsIGFmdGVyIHNvcnRpbmdcblx0XHRcdFx0XHRcdC5zbGljZSgwLCAyMCk7XG5cblx0XHRcdFx0XHRTdXBwb3J0Lklzc3Vlcy5hY3Rpb25zLnJlbW92ZUFsbElzc3VlcygpO1xuXHRcdFx0XHRcdFN1cHBvcnQuSXNzdWVzLmxvYWRJc3N1ZXMoaXNzdWVzKTtcblx0XHRcdFx0fSBlbHNlIGlmICh0eXBlb2YgZGF0YS5lcnJvckNvZGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFN1cHBvcnQuSGVscGVycy5hY2NvdW50RXJyb3IoJ2lzc3VlJywgZGF0YS5lcnJvckNvZGUpO1xuXHRcdFx0XHRcdFN1cHBvcnQuSXNzdWVzLmFjdGlvbnMuc2hvd1N0YXRlQ29udGFpbmVyKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuZmFpbChmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdFN1cHBvcnQuSGVscGVycy5hY2NvdW50RXJyb3IoJ2lzc3VlJywgJ0RFRkFVTFRfRVJST1JfTUVTU0FHRScpO1xuXHRcdFx0XHRTdXBwb3J0Lklzc3Vlcy5hY3Rpb25zLnNob3dTdGF0ZUNvbnRhaW5lcigpO1xuXHRcdFx0fSlcblx0XHRcdC5hbHdheXMoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFN1cHBvcnQuQ29udHJvbHMuYWN0aW9ucy5maW5pc2hlZExvYWRpbmcoKTtcblx0XHRcdH0pOztcblx0XHR9LFxuXG5cdFx0Ly8gdGFrZXMgZm9ybWF0IGZyb20ganNvbiBhbmQgbWFwcyB0byBmb3JtYXQgdXNlZCBpbnRlcm5hbGx5XG5cdFx0Ly8gY2FuIHBlcmZvcm0gYW55IG90aGVyIGNsZWFuIHVwIGFzIHdlbGxcblx0XHRtYXBUb0lzc3VlRm9ybWF0OiBmdW5jdGlvbihpc3N1ZSkge1xuXG5cdFx0XHR2YXIgZnVsbE5hbWUgPSBTdXBwb3J0LkhlbHBlcnMubWFrZUZ1bGxOYW1lKGlzc3VlLkNvbnRhY3RGaXJzdE5hbWUsIGlzc3VlLkNvbnRhY3RMYXN0TmFtZSk7XG5cblx0XHRcdC8vIGxlZnRQYWQgd2l0aCB3aXRoIGV4dHJhICcwJyBpZiByZXF1aXJlZFxuXHRcdFx0dmFyIHBhZCA9IFN1cHBvcnQuSGVscGVycy5wYWRUb1R3b0RpZ2l0cztcblxuXHRcdFx0Ly8gcHJvdmlkZXMgcmF3IGpzIERhdGUgb2JqZWN0XG5cdFx0XHR2YXIgcmF3TGFzdFVwZGF0ZWQgPSBTdXBwb3J0LkhlbHBlcnMucGFyc2VTdXBwb3J0TG9uZ0RhdGUoaXNzdWUuTGFzdE1vZGlmaWVkRGF0ZSk7XG5cdFx0XHR2YXIgcmF3Q3JlYXRlZCA9IFN1cHBvcnQuSGVscGVycy5wYXJzZVN1cHBvcnRMb25nRGF0ZShpc3N1ZS5DcmVhdGVkRGF0ZSk7XG5cdFx0XHR2YXIgbW9udGhzPVsnSmFuJywnRmViJywnTWFyJywnQXByJywnTWF5JywnSnVuJywnSnVsJywnQXVnJywnU2VwJywnT2N0JywnTm92JywnRGVjJ107XG5cdFx0XHRcblx0XHRcdC8vIFwiTGFzdCBVcGRhdGVkXCIgb3V0cHV0dGVkIGZvcm1hdDogTU0vREQvWVlZWSBISDpNTVxuXHRcdFx0Lypcblx0XHRcdHZhciBmb3JtYXR0ZWRMYXN0VXBkYXRlZCA9IHBhZChyYXdMYXN0VXBkYXRlZC5nZXRNb250aCgpICsgMSkgLy8gZ2V0TW9udGgoKSByZXR1cm5zIGEgMC0xMSByYW5nZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHQrIFwiL1wiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCsgcGFkKHJhd0xhc3RVcGRhdGVkLmdldERhdGUoKSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0KyBcIi9cIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQrIHJhd0xhc3RVcGRhdGVkLmdldEZ1bGxZZWFyKCk7XG5cblx0XHRcdHZhciBmb3JtYXR0ZWRDcmVhdGVkID0gcGFkKHJhd0NyZWF0ZWQuZ2V0TW9udGgoKSArIDEpIC8vIGdldE1vbnRoKCkgcmV0dXJucyBhIDAtMTEgcmFuZ2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0KyBcIi9cIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQrIHBhZChyYXdDcmVhdGVkLmdldERhdGUoKSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0KyBcIi9cIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQrIHJhd0NyZWF0ZWQuZ2V0RnVsbFllYXIoKTtcblx0XHRcdCovXG5cdFx0XHRcblx0XHRcdFxuXHRcdFx0Ly8gXCJMYXN0IFVwZGF0ZWRcIiBvdXRwdXR0ZWQgZm9ybWF0OiBNTS9ERC9ZWVlZIEhIOk1NXG5cdFx0XHR2YXIgZm9ybWF0dGVkTGFzdFVwZGF0ZWQgPSBwYWQocmF3TGFzdFVwZGF0ZWQuZ2V0RGF0ZSgpKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHQrIFwiLVwiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCsgcGFkKG1vbnRoc1tyYXdMYXN0VXBkYXRlZC5nZXRNb250aCgpXSkgXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCsgXCItXCJcblx0XHRcdFx0XHRcdFx0XHRcdFx0KyByYXdMYXN0VXBkYXRlZC5nZXRGdWxsWWVhcigpO1xuXG5cdFx0XHR2YXIgZm9ybWF0dGVkQ3JlYXRlZCA9IHBhZChyYXdDcmVhdGVkLmdldERhdGUoKSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0KyBcIi1cIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQrIHBhZChtb250aHNbcmF3Q3JlYXRlZC5nZXRNb250aCgpXSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0KyBcIi1cIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQrIHJhd0NyZWF0ZWQuZ2V0RnVsbFllYXIoKTtcblx0XHRcdFxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0aWQ6IGlzc3VlLklkLFxuXHRcdFx0XHRjYXNlTnVtYmVyOiBpc3N1ZS5DYXNlTnVtYmVyLFxuXHRcdFx0XHRzdGF0dXM6IGlzc3VlLlN0YXR1cyxcblx0XHRcdFx0cHJvZHVjdDogaXNzdWUuUHJvZHVjdE5hbWUsXG5cdFx0XHRcdGNyZWF0ZWREYXRlOiBmb3JtYXR0ZWRDcmVhdGVkLFxuXHRcdFx0XHRsYXN0VXBkYXRlZE9yaWdpbmFsRGF0ZTogaXNzdWUuTGFzdE1vZGlmaWVkRGF0ZSxcblx0XHRcdFx0bGFzdFVwZGF0ZWRSYXdEYXRlOiByYXdMYXN0VXBkYXRlZCxcblx0XHRcdFx0bGFzdFVwZGF0ZWRGb3JtYXR0ZWREYXRlOiBmb3JtYXR0ZWRMYXN0VXBkYXRlZCxcblx0XHRcdFx0c3VtbWFyeTogaXNzdWUuU3ViamVjdCxcblx0XHRcdFx0c3VibWl0dGVyOiBmdWxsTmFtZVxuXHRcdFx0fTtcblx0XHR9LFxuXG5cdFx0bG9hZElzc3VlczogZnVuY3Rpb24oaXNzdWVzKSB7XG5cdFx0XHRpZiAoaXNzdWVzLmxlbmd0aCkge1xuXHRcdFx0XHRTdXBwb3J0Lklzc3Vlcy5hY3Rpb25zLmFkZElzc3Vlcyhpc3N1ZXMpO1xuXHRcdFx0XHRTdXBwb3J0Lklzc3Vlcy5hY3Rpb25zLnNob3dTdGF0ZUNvbnRhaW5lcignaGFzSXNzdWVzJyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRTdXBwb3J0Lklzc3Vlcy5hY3Rpb25zLnNob3dTdGF0ZUNvbnRhaW5lcignbm9Jc3N1ZXMnKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0bG9hZFNlbGVjdGVkSXNzdWU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG1hdGNoSWQgPSAkKGNvbnRyYWN0U2VsZWN0b3IpLmZpbmQoJzpzZWxlY3RlZCcpLmRhdGEoJ2NvbnRyYWN0LWlkJykgfHwgXCJcIjtcblx0XHRcdC8vIExvYWQgbG9jYWwgdGVzdCBkYXRhICBvciBnZXQgdmlhIGFqYXhcblx0XHRcdGlmICh0eXBlb2YgYm1jTWV0YSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGJtY01ldGEuY2R4TG9jYWwgIT09ICd1bmRlZmluZWQnICYmIGJtY01ldGEuY2R4TG9jYWwpIHtcblx0XHRcdFx0dGhpcy5sb2FkVmlhVXJsKCcuL3Rlc3QvJyArIG1hdGNoSWQgKyAnLmpzb24nKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMubG9hZFZpYVVybCgnL3RlbXBsYXRlcy9SZXN0R2V0U3VwcG9ydE9wZW5Jc3N1ZXM/Y29udHJhY3RJRD0nICsgbWF0Y2hJZCk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdGFjdGlvbnM6IHtcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBBZGRzIGFuIGFycmF5IG9mIGlzc3VlIG9iamVjdHNcblx0XHRcdCAqIEBwYXJhbSB7YXJyYXl9IGlzc3VlcyBhcnJheSBvZiBpc3N1ZXMgaW4gdGhlIGZvcm1hdCBzcGVjaWZpZWQgd2l0aGluIGBhZGRJc3N1ZWBcblx0XHRcdCAqL1xuXHRcdFx0YWRkSXNzdWVzOiBmdW5jdGlvbihpc3N1ZXMpIHtcblx0XHRcdFx0Ly8gc2VlIFN1cHBvcnQuSXNzdWVzLmFjdGlvbnMuYWRkSXNzdWUgZm9yIGV4cGVjdGVkIGlzc3VlIGZvcm1hdFxuXHRcdFx0XHQkLmVhY2goaXNzdWVzLCBmdW5jdGlvbihpLCBpc3N1ZSkge1xuXHRcdFx0XHRcdFN1cHBvcnQuSXNzdWVzLmFjdGlvbnMuYWRkSXNzdWUoaXNzdWUpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0sXG5cblx0XHRcdGFkZElzc3VlOiBmdW5jdGlvbihpc3N1ZSkge1xuXG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiBvdXRwdXQgZm9ybWF0OlxuXHRcdFx0XHQgKlxuXHRcdFx0XHQgKiAge1xuXHRcdFx0XHQgKiAgICAgIGlkOiBudW1iZXIsXG5cdFx0XHRcdCAqXHRcdHN1bW1hcnk6IHN0cmluZyxcblx0XHRcdFx0ICogICAgICBwcm9kdWN0OiBzdHJpbmcsXG5cdFx0XHRcdCAqICAgICAgY3JlYXRlZERhdGU6IHN0cmluZyxcblx0XHRcdFx0ICogICAgICBsYXN0VXBkYXRlZDogc3RyaW5nLFxuXHRcdFx0XHQgKiAgICAgIHN0YXR1czogc3RyaW5nLFxuXHRcdFx0XHQgKlx0XHRzdWJtaXR0ZXI6IHN0cmluZ1xuXHRcdFx0XHQgKiBcdH1cblx0XHRcdFx0ICovXG5cblx0XHRcdFx0Ly8gcHVsbCBuZWVkZWQgZmllbGRzIGZyb20gaXNzdWUgZm9yIG91dHB1dCBmb3JtYXRcblx0XHRcdFx0dmFyIGlzc3VlT3V0cHV0ID0ge1xuXHRcdFx0XHRcdGlkOiBpc3N1ZS5jYXNlTnVtYmVyLFxuXHRcdFx0XHRcdHN1bW1hcnk6IGlzc3VlLnN1bW1hcnksXG5cdFx0XHRcdFx0cHJvZHVjdDogaXNzdWUucHJvZHVjdCxcblx0XHRcdFx0XHRjcmVhdGVkRGF0ZTogaXNzdWUuY3JlYXRlZERhdGUsXG5cdFx0XHRcdFx0bGFzdFVwZGF0ZWQ6IGlzc3VlLmxhc3RVcGRhdGVkRm9ybWF0dGVkRGF0ZSxcblx0XHRcdFx0XHRzdGF0dXM6IGlzc3VlLnN0YXR1cyxcblx0XHRcdFx0XHRzdWJtaXR0ZXI6IGlzc3VlLnN1Ym1pdHRlclxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdC8vIGNlbGwgaHRtbCBtYXJrdXAgY29udGFpbmVyXG5cdFx0XHRcdHZhciBjZWxscyA9IFtdO1xuXG5cdFx0XHRcdGZvciAoa2V5IGluIGlzc3VlT3V0cHV0KSB7XG5cdFx0XHRcdFx0Ly8gSUQgbmVlZHMgdG8gYmUgbGlua2VkIHRvIHRoZSB0aWNrZXRcblx0XHRcdFx0XHRpZiAoa2V5ID09PSAnaWQnKSB7XG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mIGJtY01ldGEgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBibWNNZXRhLnN1cHBvcnQgIT09ICd1bmRlZmluZWQnKSB7XG5cblx0XHRcdFx0XHRcdFx0c3VwcG9ydEVudiA9ICh0eXBlb2YgYm1jTWV0YS5zdXBwb3J0Lmlzc3VlRW52aXJvbm1lbnQgIT09ICd1bmRlZmluZWQnKSA/IGJtY01ldGEuc3VwcG9ydC5pc3N1ZUVudmlyb25tZW50IDogXCJcIjtcblx0XHRcdFx0XHRcdFx0c3VwcG9ydFBhdGggPSAodHlwZW9mIGJtY01ldGEuc3VwcG9ydC5pc3N1ZVBhdGggIT09ICd1bmRlZmluZWQnKSA/IGJtY01ldGEuc3VwcG9ydC5pc3N1ZVBhdGggOiBcIlwiO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRjZWxscy5wdXNoKCc8dGQ+PGEgaHJlZj1cIicgKyBTdXBwb3J0Lklzc3Vlcy5idWlsZFN1cHBvcnRJc3N1ZVVybChzdXBwb3J0RW52LCBzdXBwb3J0UGF0aCwgaXNzdWUuaWQpICsgJ1wiPicgKyBpc3N1ZU91dHB1dFtrZXldICsgJzwvYT48L3RkPicpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjZWxscy5wdXNoKCc8dGQ+JyArIGlzc3VlT3V0cHV0W2tleV0gKyAnPC90ZD4nKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR2YXIgcm93ID0gJzx0ciBkYXRhLWlzc3VlLWlkPVwiJyArIGlzc3VlT3V0cHV0LmlkICsgJ1wiPicgKyBjZWxscy5qb2luKCcnKSArICc8L3RyPic7XG5cdFx0XHRcdHZhciByb3dzQ29udGFpbmVyID0gJChTdXBwb3J0Lklzc3Vlcy5pc3N1ZVRhYmxlV3JhcHBlclNlbGVjdG9yKS5maW5kKCd0YWJsZSB0Ym9keScpO1xuXHRcdFx0XHQkKHJvd3NDb250YWluZXIpLmFwcGVuZChyb3cpO1xuXHRcdFx0fSxcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBzdGF0ZSBpcyBiYXNlZCBvbiB0aGUga2V5IHByb3ZpZGVkIGJ5IHRoZSBhcnJheSByZXR1cm5lZCBmcm9tIGdldE1vZHVsZVN0YXRlQ29udGFpbmVyU2VsZWN0b3JzXG5cdFx0XHQgKi9cblx0XHRcdHNob3dTdGF0ZUNvbnRhaW5lcjogZnVuY3Rpb24oc2hvd1N0YXRlKSB7XG5cblx0XHRcdFx0dmFyIHN0YXRlcyA9IFN1cHBvcnQuSXNzdWVzLmdldE1vZHVsZVN0YXRlQ29udGFpbmVyU2VsZWN0b3JzKCk7XG5cblx0XHRcdFx0aWYgKHR5cGVvZiBzdGF0ZXNbc2hvd1N0YXRlXSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0XHQkKHN0YXRlc1tzaG93U3RhdGVdKS5mYWRlSW4oKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIGhpZGUgZXhpc3Rpbmcgc3RhdGVzXG5cdFx0XHRcdGZvciAoc3RhdGUgaW4gc3RhdGVzKSB7XG5cdFx0XHRcdFx0aWYgKHN0YXRlICE9PSBzaG93U3RhdGUpIHtcblx0XHRcdFx0XHRcdCQoc3RhdGVzW3N0YXRlXSkuaGlkZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSxcblxuXHRcdFx0cmVtb3ZlQWxsSXNzdWVzOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyIHJvd3MgPSAkKFN1cHBvcnQuSXNzdWVzLmlzc3VlVGFibGVXcmFwcGVyU2VsZWN0b3IpLmZpbmQoJ3RhYmxlIHRib2R5IHRyJyk7XG5cdFx0XHRcdHJvd3MucmVtb3ZlKCk7XG5cdFx0XHR9LFxuXG5cdFx0XHRzaG93SXNzdWVzOiBmdW5jdGlvbihhbW91bnQpIHtcblx0XHRcdFx0dmFyIGhpZGRlbklzc3VlcyA9ICQoU3VwcG9ydC5Jc3N1ZXMudGFibGVSb3dzU2VsZWN0b3IpLmZpbmQoJ3RyLmhpZGRlbicpO1xuXHRcdFx0XHR2YXIgY2FwcGVkID0gJChoaWRkZW5Jc3N1ZXMpLnNsaWNlKDAsIFN1cHBvcnQuSXNzdWVzLnNob3dCYXRjaFF0eSk7XG5cdFx0XHRcdHZhciByZW1haW5pbmcgPSBoaWRkZW5Jc3N1ZXMubGVuZ3RoIC0gY2FwcGVkLmxlbmd0aDtcblxuXHRcdFx0XHRpZiAoY2FwcGVkLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRTdXBwb3J0Lklzc3Vlcy5hY3Rpb25zLnNob3coY2FwcGVkKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRTdXBwb3J0Lklzc3Vlcy5hY3Rpb25zLnZpZXdBbGwoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFNob3dlZCBmaW5hbCBiYXRjaFxuXHRcdFx0XHRpZiAocmVtYWluaW5nIDw9IFN1cHBvcnQuSXNzdWVzLnNob3dCYXRjaFF0eSkge1xuXHRcdFx0XHRcdFN1cHBvcnQuSXNzdWVzLmFjdGlvbnMuYWxsU2hvd24oKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHNob3c6IGZ1bmN0aW9uKGVsZW1lbnRzKSB7XG5cdFx0XHRcdCQoZWxlbWVudHMpLnJlbW92ZUNsYXNzKFN1cHBvcnQuSXNzdWVzLmhpZGRlbkNsYXNzKTtcblx0XHRcdH0sXG5cdFx0XHRoaWRlOiBmdW5jdGlvbihlbGVtZW50cykge1xuXHRcdFx0XHQkKGVsZW1lbnRzKS5hZGRDbGFzcyhTdXBwb3J0Lklzc3Vlcy5oaWRkZW5DbGFzcyk7XG5cdFx0XHR9LFxuXHRcdFx0YWxsU2hvd246IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgc2hvd01vcmUgPSAkKFN1cHBvcnQuSXNzdWVzLnNob3dNb3JlU2VsZWN0b3IpO1xuXHRcdFx0XHR2YXIgbmV3TGFiZWwgPSBzaG93TW9yZS5kYXRhKCd2aWV3LWFsbC1sYWJlbCcpO1xuXHRcdFx0XHRzaG93TW9yZS5odG1sKG5ld0xhYmVsKTtcblx0XHRcdH0sXG5cdFx0XHR2aWV3QWxsOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyIHVybCA9ICQoU3VwcG9ydC5Jc3N1ZXMuc2hvd01vcmVTZWxlY3RvcikuZGF0YSgndmlldy1hbGwtdXJsJyk7XG5cdFx0XHRcdGlmICh1cmwpIHtcblx0XHRcdFx0XHRkb2N1bWVudC5sb2NhdGlvbiA9IHVybDtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblxuXHRcdFx0ZmluaXNoZWRMb2FkaW5nOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0JCgnLmpzLWFjY291bnQtZGV0YWlscy1sb2FkaW5nJykuaGlkZSgpO1xuXHRcdFx0XHQkKCcuc3VwcG9ydC1uby1pc3N1ZXMnKS5oaWRlKCkucmVtb3ZlQ2xhc3MoJ3N1cHBvcnQtaGlkZS13aGlsZS1sb2FkaW5nJyk7XG5cdFx0XHRcdCQoJy5hY3Rpb24tZGV0YWlscycpLnJlbW92ZUNsYXNzKCdzdXBwb3J0LWhpZGUtd2hpbGUtbG9hZGluZycpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRidWlsZFN1cHBvcnRJc3N1ZVVybDogZnVuY3Rpb24oc3VwcG9ydEVudiwgc3VwcG9ydFBhdGgsIGlzc3VlSUQpIHtcblx0XHRcdHJldHVybiBzdXBwb3J0RW52ICsgc3VwcG9ydFBhdGggKyBpc3N1ZUlEO1xuXHRcdH1cblx0fTtcblxuXHRTdXBwb3J0LkNvbnRyb2xzID0ge1xuXG5cdFx0YWN0aW9uczoge1xuXHRcdFx0ZmluaXNoZWRMb2FkaW5nOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0JCgnLmpzLWFjY291bnQtZGV0YWlscy1sb2FkaW5nJykuaGlkZSgpO1xuXHRcdFx0XHQkKCcuc3VwcG9ydC1uby1pc3N1ZXMnKS5oaWRlKCkucmVtb3ZlQ2xhc3MoJ3N1cHBvcnQtaGlkZS13aGlsZS1sb2FkaW5nJyk7XG5cdFx0XHRcdCQoJy5hY3Rpb24tZGV0YWlscycpLnJlbW92ZUNsYXNzKCdzdXBwb3J0LWhpZGUtd2hpbGUtbG9hZGluZycpO1xuXHRcdFx0fSxcblxuXHRcdFx0cmVzZXRMb2FkQWNjb3VudEVycm9yOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0JChhY2NvdW50RXJyb3IpLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0aXNzdWVTaG93TW9yZTogZnVuY3Rpb24oKSB7XG5cdFx0XHQkKFN1cHBvcnQuSXNzdWVzLnNob3dNb3JlU2VsZWN0b3IpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRTdXBwb3J0Lklzc3Vlcy5hY3Rpb25zLnNob3dJc3N1ZXMoU3VwcG9ydC5Jc3N1ZXMuc2hvd0JhdGNoUXR5KTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cblx0XHRsb2FkRGF0YTogZnVuY3Rpb24oKSB7XG5cdFx0XHQvLyBMb2FkIGxvY2FsIHRlc3QgZGF0YSBvciBnZXQgdmlhIGFqYXhcblx0XHRcdGlmICh0eXBlb2YgYm1jTWV0YSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGJtY01ldGEuY2R4TG9jYWwgIT09ICd1bmRlZmluZWQnICYmIGJtY01ldGEuY2R4TG9jYWwpIHtcblx0XHRcdFx0U3VwcG9ydC5Jc3N1ZXMubG9hZFZpYVVybCgnLi90ZXN0L2lzc3Vlcy5qc29uJyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRTdXBwb3J0Lklzc3Vlcy5sb2FkVmlhVXJsKCcvYmluL3N1cHBvcnRjYXNlcycpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRpbml0OiBmdW5jdGlvbigpIHtcblx0XHRcdC8vIFByZXZlbnQgaW5pdCBpZiBub3QgbG9nZ2VkIGluIG9yIG5vdCBvbiBsYW5kaW5nIHBhZ2Vcblx0XHRcdGlmICghU3VwcG9ydC5IZWxwZXJzLmlzQXV0aGVudGljYXRlZCgpIHx8ICFTdXBwb3J0LkhlbHBlcnMuaXNPblN1cHBvcnRMYW5kaW5nUGFnZSgpKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdHRoaXMuaXNzdWVTaG93TW9yZSgpO1xuXHRcdFx0dGhpcy5sb2FkRGF0YSgpO1xuXHRcdH1cblxuXHR9O1xuXG5cdFN1cHBvcnQuQWxlcnRzID0ge1xuXG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XG5cblx0XHRcdC8vIGxvY2FsIHZhcnNcblx0XHRcdHZhciBmaW5pc2hlZExvYWRpbmcsXG5cdFx0XHRcdG1lc3NhZ2VzVXJsO1xuXG5cdFx0XHQvLyBPYmplY3RzXG5cdFx0XHR0aGlzLmRpYWxvZyA9ICQoXCIjY29uZmlybVwiKTtcblx0XHRcdHRoaXMudHJpZ2dlciA9ICQoXCIuanMtZmFuY3lEaWFsb2dcIik7XG5cblx0XHRcdC8vIEFjdGlvbnNcblx0XHRcdHRoaXMuY29uZmlybUJ1dHRvbiA9IFwiQ2xvc2VcIjtcblx0XHRcdHRoaXMuY29uZmlybUNoZWNrYm94ID0gXCJEb25cXCd0IHNob3cgdGhpcyBhZ2FpblwiO1xuXG5cdFx0XHQvLyBjYWxsYmFjayB0byBoYW5kbGUgbWVzc2FnZXMsIHJlZ2FyZGxlc3Mgb2Ygc291cmNlXG5cdFx0XHQvLyBoYW5kbGVzIGNhc2UgaW4gdGhlIHNpdHVhdGlvbiB3aGVyZSB0aGVyZSBhcmUgbm8gbWVzc2FnZXNcblx0XHRcdC8vIG9yIG1lc3NhZ2VzIGRhdGEgaXMgZmFsc2V5XG5cdFx0XHRmaW5pc2hlZExvYWRpbmcgPSBmdW5jdGlvbihtZXNzYWdlcykge1xuXG5cdFx0XHRcdC8vIGhhdmUgbWVzc2FnZXNcblx0XHRcdFx0aWYgKG1lc3NhZ2VzICYmIG1lc3NhZ2VzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHQvLyBzZXRzIGdsb2JhbCBhbGVydE1lc3NhZ2VzXG5cdFx0XHRcdFx0YWxlcnRNZXNzYWdlcyA9IG1lc3NhZ2VzO1xuXG5cdFx0XHRcdFx0Ly8gQWxlcnQgYnV0dG9uXG5cdFx0XHRcdFx0dGhpcy5hbGVydEJ1dHRvbigpO1xuXHRcdFx0XHRcdC8vIENoZWNrIGNvb2tpZXNcblx0XHRcdFx0XHR0aGlzLmNoZWNrQ29va2llcyh0aGlzLm1lc3NhZ2VzKTtcblx0XHRcdFx0Ly8gZG9uJ3QgaGF2ZSBtZXNzYWdlc1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIGluIGFueSBjYXNlIHRoYXQgZG9lc24ndCByZXN1bHQgaW4gbG9hZGluZywgaGlkZSB0aGUgYWxlcnRzIGJ1dHRvblxuXHRcdFx0XHRcdHRoaXMudHJpZ2dlci5wYXJlbnQoKS5yZW1vdmUoKTtcblx0XHRcdFx0fVxuXHRcdFx0Ly8gbWFpbnRhaW4gY29udGV4dFxuXHRcdFx0fS5iaW5kKHRoaXMpO1xuXG5cdFx0XHQvLyBsb2FkIG1lc3NhZ2VzIGRhdGEgZnJvbSBibWNNZXRhIGdsb2JhbCBvYmplY3Rcblx0XHRcdC8vIHRoaXMubG9hZE1lc3NhZ2VzRnJvbUdsb2JhbChmaW5pc2hlZExvYWRpbmcpO1xuXHRcdFx0Ly9cblx0XHRcdC8vIC0tIE9SIC0tXG5cdFx0XHQvL1xuXHRcdFx0Ly8gbG9hZCBtZXNzYWdlcyBkYXRhIGZyb20gYWpheFxuXHRcdFx0Ly8gbG9hZCByZWxhdGl2ZSBVUkwgb24gYm1jLmNvbSBvciBoYXJkY29kZSBVUkwgc291cmNlIGZvciB0ZXN0aW5nIHB1cnBvc2VzXG5cdFx0XHRpZiAoIFN1cHBvcnQuSGVscGVycy5ibWNTdXBwb3J0TG9hZGVkKCkgJiYgU3VwcG9ydC5IZWxwZXJzLmJtY0FsZXJ0c0VuYWJsZWQoKSApe1xuXHRcdFx0XHQvLyBsb2NhbCBkZXZlbG9wbWVudDpcblx0XHRcdFx0aWYgKCh0eXBlb2YgYm1jTWV0YS5jZHhMb2NhbCAhPT0gJ3VuZGVmaW5lZCcpICYmIGJtY01ldGEuY2R4TG9jYWwpIHtcblx0XHRcdFx0XHRtZXNzYWdlc1VybCA9ICd0ZXN0L2FsZXJ0TWVzc2FnZXMuanNvbic7XG5cdFx0XHRcdC8vIGRldi9zdGFnZS9wcm9kOlxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmICgodHlwZW9mIGJtY01ldGEuc3VwcG9ydC5hbGVydHNVcmwgIT09ICd1bmRlZmluZWQnKSAmJiBibWNNZXRhLnN1cHBvcnQuYWxlcnRzVXJsKSB7XG5cdFx0XHRcdFx0XHRtZXNzYWdlc1VybCA9IGJtY01ldGEuc3VwcG9ydC5hbGVydHNVcmw7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG1lc3NhZ2VzVXJsID0gJy90ZW1wbGF0ZXMvU2VydmljZVN1cHBvcnRBbGVydHNKU09OJztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5sb2FkTWVzc2FnZXNGcm9tVXJsKGZpbmlzaGVkTG9hZGluZywgbWVzc2FnZXNVcmwpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHQvLyB3aWxsIHJldHJpZXZlIG1lc3NhZ2VzIGJ5IHRoZSBibWNNZXRhIGdsb2JhbFxuXHRcdC8vIGxvYWRzIG9uIG1vZHVsZSBnbG9iYWwgdmFyIGFsZXJ0TWVzc2FnZXNcblx0XHRsb2FkTWVzc2FnZXNGcm9tR2xvYmFsOiBmdW5jdGlvbihtZXNzYWdlc0hhbmRsZXIpIHtcblx0XHRcdHZhciBtZXNzYWdlcztcblxuXHRcdFx0aWYgKFN1cHBvcnQuSGVscGVycy5ibWNTdXBwb3J0TG9hZGVkKCkgJiYgdHlwZW9mIGJtY01ldGEuc3VwcG9ydC5hbGVydE1lc3NhZ2VzICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRtZXNzYWdlcyA9IGJtY01ldGEuc3VwcG9ydC5hbGVydE1lc3NhZ2VzO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodHlwZW9mIG1lc3NhZ2VzSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykgbWVzc2FnZXNIYW5kbGVyKG1lc3NhZ2VzKTtcblx0XHR9LFxuXG5cdFx0Ly8gYWxsb3dzIGZvciBhamF4aW5nIGluIG1lc3NhZ2UgZGF0YVxuXHRcdGxvYWRNZXNzYWdlc0Zyb21Vcmw6IGZ1bmN0aW9uKG1lc3NhZ2VzSGFuZGxlciwgdXJsKSB7XG5cdFx0XHQkLmFqYXgodXJsKVxuXHRcdFx0XHQuZG9uZShmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdFx0Ly8gYmFzZWQgb24gZXhhbXBsZSBqc29uLCBhc3N1bWUgcmVzcG9uc2UgcGF5bG9hZCBjb250YWlucyBkYXRhIG9uXG5cdFx0XHRcdFx0Ly8gcHJvcGVydHkgJ3N1cHBvcnRBbGVydE1lc3NhZ2VzJ1xuXHRcdFx0XHRcdGlmICh0eXBlb2YgbWVzc2FnZXNIYW5kbGVyID09PSAnZnVuY3Rpb24nKSBtZXNzYWdlc0hhbmRsZXIoZGF0YS5zdXBwb3J0QWxlcnRNZXNzYWdlcyk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5mYWlsKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGlmICh0eXBlb2YgbWVzc2FnZXNIYW5kbGVyID09PSAnZnVuY3Rpb24nKSBtZXNzYWdlc0hhbmRsZXIobnVsbCk7XG5cdFx0XHRcdH0pO1xuXHRcdH0sXG5cblx0XHRvcGVuQWxlcnQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy5mYW5jeUNvbmZpZyh0aGlzLm1lc3NhZ2VzKTtcblx0XHR9LFxuXG5cdFx0YWxlcnRCdXR0b246IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy50cmlnZ2VyLm9uKFwiY2xpY2tcIiwgJC5wcm94eSh0aGlzLm9wZW5BbGVydCwgdGhpcykpO1xuXHRcdH0sXG5cblx0XHRjaGVja0Nvb2tpZXM6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblx0XHRcdC8vIENoZWNrIGlmIGNvb2tpZXMgbWF0Y2ggSURzXG5cdFx0XHR2YXIgc2hvd0FsZXJ0ID0gZmFsc2U7XG5cdFx0XHRmb3IgKGkgPSAwOyBpIDwgYWxlcnRNZXNzYWdlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHQvLyBJZiBubyBjb29raWVzIHRoZW4gc2hvdyBhbGVydFxuXHRcdFx0XHRpZiAoJC5jb29raWUoYWxlcnRNZXNzYWdlc1tpXS5pZCkgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdHNob3dBbGVydCA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChzaG93QWxlcnQpIHtcblx0XHRcdFx0dGhpcy5vcGVuQWxlcnQoKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0ZmFuY3lDb25maWc6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblx0XHRcdCQuZmFuY3lib3godGhpcy5kaWFsb2csIHtcblx0XHRcdFx0YXV0b1dpZHRoOiBmYWxzZSxcblx0XHRcdFx0bWluSGVpZ2h0OiA0MDAsXG5cdFx0XHRcdG1heFdpZHRoOiA3NDUsXG5cdFx0XHRcdHBhZGRpbmc6IDAsXG5cdFx0XHRcdHRwbDoge1xuXHRcdFx0XHRcdHdyYXA6ICc8ZGl2IGNsYXNzPVwiZmFuY3lib3gtd3JhcCBmYW5jeWJveC1kaWFsb2dcIiB0YWJJbmRleD1cIi0xXCI+PGRpdiBjbGFzcz1cImZhbmN5Ym94LXNraW5cIj48ZGl2IGNsYXNzPVwiZmFuY3lib3gtb3V0ZXJcIj48ZGl2IGNsYXNzPVwiZmFuY3lib3gtdGl0bGVcIj5BbGVydCBOb3RpZmljYXRpb25zPC9kaXY+PGRpdiBjbGFzcz1cImZhbmN5Ym94LWlubmVyXCI+PC9kaXY+PC9kaXY+PC9kaXY+PC9kaXY+Jyxcblx0XHRcdFx0XHRlcnJvcjogJzxwIGNsYXNzPVwiZmFuY3lib3gtZXJyb3JcIj5UaGUgcmVxdWVzdGVkIGNvbnRlbnQgY2Fubm90IGJlIGxvYWRlZC48YnIvPlBsZWFzZSB0cnkgYWdhaW4gbGF0ZXIuPC9wPidcblx0XHRcdFx0fSxcblx0XHRcdFx0aGVscGVyczoge1xuXHRcdFx0XHRcdG92ZXJsYXk6IHtcblx0XHRcdFx0XHRcdGNsb3NlQ2xpY2s6IHRydWUsIC8vIGlmIHRydWUsIGZhbmN5Qm94IHdpbGwgYmUgY2xvc2VkIHdoZW4gdXNlciBjbGlja3Mgb24gdGhlIG92ZXJsYXlcblx0XHRcdFx0XHRcdHNwZWVkT3V0OiAyMDAsIC8vIGR1cmF0aW9uIG9mIGZhZGVPdXQgYW5pbWF0aW9uXG5cdFx0XHRcdFx0XHRzaG93RWFybHk6IHRydWUsIC8vIGluZGljYXRlcyBpZiBzaG91bGQgYmUgb3BlbmVkIGltbWVkaWF0ZWx5IG9yIHdhaXQgdW50aWwgdGhlIGNvbnRlbnQgaXMgcmVhZHlcblx0XHRcdFx0XHRcdGNzczoge30sIC8vIGN1c3RvbSBDU1MgcHJvcGVydGllc1xuXHRcdFx0XHRcdFx0bG9ja2VkOiB0cnVlIC8vIGlmIHRydWUsIHRoZSBjb250ZW50IHdpbGwgYmUgbG9ja2VkIGludG8gb3ZlcmxheVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0YmVmb3JlU2hvdzogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Ly8gQWRkIGNvbnRhaW5lcnNcblx0XHRcdFx0XHR0aGlzLmNvbnRlbnQuYXBwZW5kKFwiPGRpdiBjbGFzcz0nbWVzc2FnZXMnPjwvZGl2PjxkaXYgY2xhc3M9J2FjdGlvbic+PC9kaXY+XCIpO1xuXHRcdFx0XHRcdC8vIEFkZCBtZXNzYWdlc1xuXHRcdFx0XHRcdHRoaXMubWVzc2FnZXMgPSB0aGlzLmNvbnRlbnQuZmluZChcIi5tZXNzYWdlc1wiKTtcblx0XHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgYWxlcnRNZXNzYWdlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0dGhpcy5tZXNzYWdlcy5hcHBlbmQoXCI8aDMgY2xhc3M9J3RpdGxlJz5cIiArIGFsZXJ0TWVzc2FnZXNbaV0udGl0bGUgKyBcIjwvaDM+XCIpO1xuXHRcdFx0XHRcdFx0dGhpcy5tZXNzYWdlcy5hcHBlbmQoXCI8cCBjbGFzcz0nbWVzc2FnZSc+XCIgKyBhbGVydE1lc3NhZ2VzW2ldLm1lc3NhZ2UgKyBcIjwvcD5cIik7XG5cdFx0XHRcdFx0XHRpZiAoYWxlcnRNZXNzYWdlc1tpXS5saW5rKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMubWVzc2FnZXMuYXBwZW5kKCc8cCBjbGFzcz1cImxpbmtcIj48YSBocmVmPVwiJyArIGFsZXJ0TWVzc2FnZXNbaV0udXJsICsgJ1wiPicgKyBhbGVydE1lc3NhZ2VzW2ldLmxpbmsgKyAnPC9hPjwvcD4nKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly8gQWRkIG1vYmlsZSBidXR0b25cblx0XHRcdFx0XHR0aGlzLm1lc3NhZ2VzLmFwcGVuZCgnPHAgc3R5bGU9XCJ0ZXh0LWFsaWduOnJpZ2h0XCI+PGlucHV0IHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBhY3Rpb24tYnV0dG9uXCIgdmFsdWU9XCInICsgU3VwcG9ydC5BbGVydHMuY29uZmlybUJ1dHRvbiArICdcIi8+PC9wPicpO1xuXHRcdFx0XHRcdC8vIEFkZCBjb250cm9sc1xuXHRcdFx0XHRcdHRoaXMuY29udGVudC5maW5kKFwiLmFjdGlvblwiKS5hcHBlbmQoJzxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYWN0aW9uLWJ1dHRvblwiIHZhbHVlPVwiJyArIFN1cHBvcnQuQWxlcnRzLmNvbmZpcm1CdXR0b24gKyAnXCIvPjxsYWJlbCBjbGFzcz1cImFjdGlvbi1jaGVja2JveFwiPjxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiAvPicgKyBTdXBwb3J0LkFsZXJ0cy5jb25maXJtQ2hlY2tib3ggKyAnPC9sYWJlbD4nKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0YWZ0ZXJTaG93OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR2YXIgYWxlcnRCID0gdGhpcy5jb250ZW50LmZpbmQoXCIuYWN0aW9uLWJ1dHRvblwiKSxcblx0XHRcdFx0XHRcdGFjdGlvbkIgPSB0aGlzLmNvbnRlbnQuZmluZChcIi5hY3Rpb24gLmFjdGlvbi1idXR0b25cIiksXG5cdFx0XHRcdFx0XHRhbGVydEMgPSB0aGlzLmNvbnRlbnQuZmluZChcIi5hY3Rpb24tY2hlY2tib3ggaW5wdXRcIiksXG5cdFx0XHRcdFx0XHRhbGVydFggPSAkKCcuZmFuY3lib3gtZGlhbG9nIC5mYW5jeWJveC1jbG9zZScpO1xuXHRcdFx0XHRcdGNsb3NlRGlhbG9nID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQvLyBDcmVhdGUgY29va2llIGlmIGNoZWNrYm94IGlzIGNoZWNrZWRcblx0XHRcdFx0XHRcdGlmIChhbGVydEMuaXMoJzpjaGVja2VkJykpIHtcblx0XHRcdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGFsZXJ0TWVzc2FnZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHQkLmNvb2tpZShhbGVydE1lc3NhZ2VzW2ldLmlkLCBhbGVydE1lc3NhZ2VzW2ldLmlkLCB7XG5cdFx0XHRcdFx0XHRcdFx0XHRleHBpcmVzOiAzNjUsXG5cdFx0XHRcdFx0XHRcdFx0XHRwYXRoOiBcIi9cIixcblx0XHRcdFx0XHRcdFx0XHRcdGRvbWFpbjogXCIuYm1jLmNvbVwiXG5cdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdCQuZmFuY3lib3guY2xvc2UoKTtcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdC8vIENoZWNrIGlmIHRleHQgb3ZlcmZsb3dzIG1lc3NhZ2UgY29udGFpbmVyXG5cdFx0XHRcdFx0aWYgKHRoaXMubWVzc2FnZXNbMF0uc2Nyb2xsSGVpZ2h0ID4gdGhpcy5tZXNzYWdlcy5pbm5lckhlaWdodCgpKSB7XG5cdFx0XHRcdFx0XHRhY3Rpb25CLnByb3AoXCJkaXNhYmxlZFwiLCB0cnVlKTtcblx0XHRcdFx0XHRcdHRoaXMubWVzc2FnZXMuYmluZCgnc2Nyb2xsJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdGlmICgkKHRoaXMpWzBdLnNjcm9sbEhlaWdodCAtICQodGhpcykuc2Nyb2xsVG9wKCkgPD0gJCh0aGlzKS5pbm5lckhlaWdodCgpKSB7XG5cdFx0XHRcdFx0XHRcdFx0YWN0aW9uQi5wcm9wKFwiZGlzYWJsZWRcIiwgZmFsc2UpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly8gQ2xvc2UgZGlhbG9nIHdoZW4gYnV0dG9ucyBhcmUgY2xpY2tlZFxuXHRcdFx0XHRcdGFsZXJ0Qi5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0Y2xvc2VEaWFsb2coKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRhbGVydFgub24oXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGNsb3NlRGlhbG9nKCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGFmdGVyQ2xvc2U6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdC8vIFJlbW92ZSBkaWFsb2cgY29udGVudFxuXHRcdFx0XHRcdHRoaXMuY29udGVudC5odG1sKFwiXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH07XG5cblx0U3VwcG9ydC5HZXR0aW5nU3RhcnRlZENhcm91c2VsID0ge1xuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0JCgnLnN1cHBvcnQtZ2V0dGluZy1zdGFydGVkLXRvcGljcy5jYXJvdXNlbCAudG9waWNzJykub3dsQ2Fyb3VzZWwoe1xuXHRcdFx0XHRpdGVtczogMSxcblx0XHRcdFx0bmF2OiBmYWxzZVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9O1xuXG5cdFN1cHBvcnQuVG9nZ2xlU2VhcmNoQXJlYXMgPSB7XG5cblx0XHRzZWFyY2hBcmVhc1NlbGVjdG9yOiAnLmpzLXN1cHBvcnQtc2VhcmNoLWFyZWEnLFxuXHRcdHRvZ2dsZUFjdGlvblNlbGVjdG9yOiAnLmpzLXN1cHBvcnQtc2VhcmNoLXRvZ2dsZScsXG5cdFx0dG9nZ2xlQWN0aW9uTGFiZWxTZWxlY3RvcjogJy5qcy1zdXBwb3J0LXNlYXJjaC10b2dnbGUnLFxuXHRcdHRvZ2dsZUxhYmVsVGV4dDoge1xuXHRcdFx0ZXhwYW5kOiAnTW9yZSBSZXNvdXJjZXMnLFxuXHRcdFx0Y29sbGFwc2U6ICdDb2xsYXBzZSdcblx0XHR9LFxuXHRcdHRvZ2dsYWJsZUFyZWFzOiBudWxsLFxuXHRcdGVsZW1lbnRzU2hvd246IGZhbHNlLFxuXHRcdGhpZGVMYXN0UXR5OiA0LFxuXG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XG5cblx0XHRcdC8vIG9ubHkgaW5pdGlhbGl6ZSBpZiAuanMtc3VwcG9ydC1zZWFyY2gtdG9nZ2xlLWV4dHJhIGV4aXN0c1xuXHRcdFx0aWYgKCQoJy5qcy1zdXBwb3J0LXNlYXJjaC10b2dnbGUtZXh0cmEnKS5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTRVRVUFxuXHRcdFx0dGhpcy5maW5kVG9nZ2xhYmxlRWxlbWVudHMoKTtcblx0XHRcdHRoaXMuYWRkSGFuZGxlcnMoKTtcblxuXHRcdFx0Ly8gSU5JVElBTCBBQ1RJT05TXG5cdFx0XHR0aGlzLmFjdGlvbnMuaGlkZSh0aGlzLmhlbHBlcnMuaGlkZUVsZW1lbnRzSW5zdGFudCk7XG5cdFx0XHR0aGlzLmFjdGlvbnMudXBkYXRlTGFiZWwodGhpcy50b2dnbGVMYWJlbFRleHQuZXhwYW5kKTtcblx0XHR9LFxuXG5cdFx0aGVscGVyczoge1xuXHRcdFx0c2hvd0VsZW1lbnRzRmFkZTogZnVuY3Rpb24oZWxlbWVudHMpIHtcblx0XHRcdFx0cmV0dXJuICQoZWxlbWVudHMpLmZhZGVJbigpO1xuXHRcdFx0fSxcblx0XHRcdHNob3dFbGVtZW50c0luc3RhbnQ6IGZ1bmN0aW9uKGVsZW1lbnRzKSB7XG5cdFx0XHRcdHJldHVybiAkKGVsZW1lbnRzKS5zaG93KCk7XG5cdFx0XHR9LFxuXHRcdFx0aGlkZUVsZW1lbnRzRmFkZTogZnVuY3Rpb24oZWxlbWVudHMpIHtcblx0XHRcdFx0cmV0dXJuICQoZWxlbWVudHMpLmZhZGVPdXQoKTtcblx0XHRcdH0sXG5cdFx0XHRoaWRlRWxlbWVudHNJbnN0YW50OiBmdW5jdGlvbihlbGVtZW50cykge1xuXHRcdFx0XHRyZXR1cm4gJChlbGVtZW50cykuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRmaW5kVG9nZ2xhYmxlRWxlbWVudHM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHNlYXJjaEFyZWFzID0gJCh0aGlzLnNlYXJjaEFyZWFzU2VsZWN0b3IpO1xuXHRcdFx0dmFyIHNsaWNlRnJvbSA9IHNlYXJjaEFyZWFzLmxlbmd0aCAtIHRoaXMuaGlkZUxhc3RRdHk7XG5cdFx0XHR2YXIgc2xpY2VUbyA9IHNlYXJjaEFyZWFzLmxlbmd0aDtcblx0XHRcdHRoaXMudG9nZ2xhYmxlQXJlYXMgPSBzZWFyY2hBcmVhcy5zbGljZShzbGljZUZyb20sIHNsaWNlVG8pO1xuXHRcdH0sXG5cblx0XHRhY3Rpb25zOiB7XG5cdFx0XHR0b2dnbGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoU3VwcG9ydC5Ub2dnbGVTZWFyY2hBcmVhcy5lbGVtZW50c1Nob3duKSB7XG5cdFx0XHRcdFx0dGhpcy5oaWRlKFN1cHBvcnQuVG9nZ2xlU2VhcmNoQXJlYXMuaGVscGVycy5oaWRlRWxlbWVudHNGYWRlKTtcblx0XHRcdFx0XHR0aGlzLnVwZGF0ZUxhYmVsKFN1cHBvcnQuVG9nZ2xlU2VhcmNoQXJlYXMudG9nZ2xlTGFiZWxUZXh0LmV4cGFuZCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5zaG93KFN1cHBvcnQuVG9nZ2xlU2VhcmNoQXJlYXMuaGVscGVycy5zaG93RWxlbWVudHNGYWRlKTtcblx0XHRcdFx0XHR0aGlzLnVwZGF0ZUxhYmVsKFN1cHBvcnQuVG9nZ2xlU2VhcmNoQXJlYXMudG9nZ2xlTGFiZWxUZXh0LmNvbGxhcHNlKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHNob3c6IGZ1bmN0aW9uKGVsZW1lbnRzSGFuZGxlcikge1xuXHRcdFx0XHRpZiAodHlwZW9mIGVsZW1lbnRzSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdGVsZW1lbnRzSGFuZGxlcigkKFN1cHBvcnQuVG9nZ2xlU2VhcmNoQXJlYXMudG9nZ2xhYmxlQXJlYXMpKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdFN1cHBvcnQuVG9nZ2xlU2VhcmNoQXJlYXMuZWxlbWVudHNTaG93biA9IHRydWU7XG5cdFx0XHR9LFxuXHRcdFx0aGlkZTogZnVuY3Rpb24oZWxlbWVudHNIYW5kbGVyKSB7XG5cdFx0XHRcdGlmICh0eXBlb2YgZWxlbWVudHNIYW5kbGVyID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0ZWxlbWVudHNIYW5kbGVyKCQoU3VwcG9ydC5Ub2dnbGVTZWFyY2hBcmVhcy50b2dnbGFibGVBcmVhcykpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0U3VwcG9ydC5Ub2dnbGVTZWFyY2hBcmVhcy5lbGVtZW50c1Nob3duID0gZmFsc2U7XG5cdFx0XHR9LFxuXHRcdFx0dXBkYXRlTGFiZWw6IGZ1bmN0aW9uKHRleHQpIHtcblx0XHRcdFx0JChTdXBwb3J0LlRvZ2dsZVNlYXJjaEFyZWFzLnRvZ2dsZUFjdGlvbkxhYmVsU2VsZWN0b3IpLmh0bWwodGV4dCk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXG5cdFx0YWRkSGFuZGxlcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0JCh0aGlzLnRvZ2dsZUFjdGlvblNlbGVjdG9yKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0dGhpcy5hY3Rpb25zLnRvZ2dsZSgpO1xuXHRcdFx0fS5iaW5kKHRoaXMpKTtcblx0XHR9XG5cdH07XG5cblx0U3VwcG9ydC5NZW51ID0ge1xuXG5cdFx0ZGVza3RvcEJyZWFrcG9pbnQ6IDk2MCxcblxuXHRcdC8vIHRvdWNoSGFuZGxlcnMgcmVxdWlyZSBhIGBjbGlja2AgdG8gdHJpZ2dlciBhIG1lbnVcblx0XHR0b3VjaEhhbmRsZXJzOiBmdW5jdGlvbihhZGFwdGVyKSB7XG5cdFx0XHR2YXIgbWVudSA9IGFkYXB0ZXIubWVudTtcblx0XHRcdCQobWVudS5zdWJNZW51VHJpZ2dlclNlbGVjdG9yKS5vbih7XG5cdFx0XHRcdCdjbGljayc6IGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0XHRpZiAoISQobWVudS5zdWJNZW51U2VsZWN0b3IpLmhhcygkKGUudGFyZ2V0KSkpIHtcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dmFyIHN1Yk1lbnUgPSBtZW51LmZpbmRNZW51RnJvbVRhcmdldChlLnRhcmdldCk7XG5cblx0XHRcdFx0XHRpZiAoc3ViTWVudS5oYXNDbGFzcyhtZW51LmV4cGFuZGVkQ2xhc3MpKSB7XG5cdFx0XHRcdFx0XHRtZW51LmNvbGxhcHNlTWVudShzdWJNZW51KTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bWVudS5jb2xsYXBzZUFsbFN1Yk1lbnVzKCk7XG5cdFx0XHRcdFx0XHRtZW51LmV4cGFuZE1lbnUoc3ViTWVudSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0Ly8gIG5vVG91Y2hIYW5kbGVycyBhc3N1bWVzIGEgbW91c2UsIGFuZCB1c2VzIGEgYGhvdmVyYCB0byB0cmlnZ2VyIGEgbWVudVxuXHRcdG5vVG91Y2hIYW5kbGVyczogZnVuY3Rpb24oYWRhcHRlcikge1xuXHRcdFx0dmFyIG1lbnUgPSBhZGFwdGVyLm1lbnU7XG5cdFx0XHQkKG1lbnUuc3ViTWVudVRyaWdnZXJTZWxlY3Rvcikub24oe1xuXHRcdFx0XHQnbW91c2VlbnRlcic6IGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0XHRtZW51LmNvbGxhcHNlQWxsU3ViTWVudXMoKTtcblx0XHRcdFx0XHR2YXIgc3ViTWVudSA9IG1lbnUuZmluZE1lbnVGcm9tVGFyZ2V0KGUudGFyZ2V0KTtcblx0XHRcdFx0XHRtZW51LmV4cGFuZE1lbnUoc3ViTWVudSk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdCdtb3VzZWxlYXZlJzogZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRcdG1lbnUuY29sbGFwc2VBbGxTdWJNZW51cygpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0Ly8gUmVnaXN0ZXIgY2xpY2tzIHRoYXQgaGFwcGVuIG91dHNpZGUgdGhlIG1lbnUsIGFuZCBkaXNtaXNzIHRoZSBtZW51XG5cdFx0Y29sbGFwc2VPdXRzaWRlSGFuZGxlcjogZnVuY3Rpb24oYWRhcHRlcikge1xuXHRcdFx0dmFyIG1lbnUgPSBhZGFwdGVyLm1lbnU7XG5cdFx0XHR2YXIgbWVudUVsZW1lbnQgPSAkKG1lbnUubWVudUVsZW1lbnQpO1xuXG5cdFx0XHQkKCdib2R5Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRpZiAoISQoZS50YXJnZXQpLnBhcmVudHMoKS5hZGRCYWNrKCkuaXMobWVudUVsZW1lbnQpKSB7XG5cdFx0XHRcdFx0bWVudS5jb2xsYXBzZUFsbFN1Yk1lbnVzKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0sXG5cblx0XHQvLyBib3RoIGB0b3VjaEhhbmRsZXJzYCBhbmQgYG5vVG91Y2hIYW5kbGVyc2AgdXNlIHRoZSBzYW1lXG5cdFx0Ly8gZWxlbWVudCB0byBhdHRhY2ggaGFuZGxlcnMgdG8sIHRoZXJlZm9yZSBjYW4gdXNlIHRoZSBzYW1lXG5cdFx0Ly8gZnVuY3Rpb24gdG8gcmVtb3ZlIHRoZSBoYW5kbGVyc1xuXHRcdGRlc3RvcnlIYW5kbGVyczogZnVuY3Rpb24oYWRhcHRlcikge1xuXHRcdFx0dmFyIG1lbnUgPSBhZGFwdGVyLm1lbnU7XG5cdFx0XHQkKG1lbnUuc3ViTWVudVRyaWdnZXJTZWxlY3Rvcikub2ZmKCk7XG5cdFx0fSxcblxuXHRcdGdldE1lbnU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gZ2VuZXJhdGUgbWVudSBiYXNlZCBvbiBzZWxlY3RvclxuXHRcdFx0dmFyIG1lbnUgPSBtZW51anMuZ2VuZXJhdGVNZW51KHtcblx0XHRcdFx0bWVudUVsZW1lbnQ6ICQoJy5zdXBwb3J0LW1lbnUnKVxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBtZW51O1xuXHRcdH0sXG5cblx0XHRnZXRBZGFwdGVyczogZnVuY3Rpb24obWVudSkge1xuXHRcdFx0dmFyIHN1cHBvcnRNZW51ID0gdGhpcztcblxuXHRcdFx0Ly8gY3JlYXRlIGRlc2t0b3AgYWRhcHRlclxuXHRcdFx0dmFyIGRlc2t0b3BBZGFwdGVyID0gbWVudUFkYXB0ZXIuZ2VuZXJhdGVNZW51QWRhcHRlcihtZW51LCB7XG5cdFx0XHRcdGhhbmRsZXJzOiBbe1xuXHRcdFx0XHRcdHNldHVwOiBzdXBwb3J0TWVudS50b3VjaEhhbmRsZXJzLFxuXHRcdFx0XHRcdGRlc3Ryb3k6IHN1cHBvcnRNZW51LmRlc3RvcnlIYW5kbGVyc1xuXHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0c2V0dXA6IHN1cHBvcnRNZW51LmNvbGxhcHNlT3V0c2lkZUhhbmRsZXIsXG5cdFx0XHRcdFx0ZGVzdHJveTogc3VwcG9ydE1lbnUuZGVzdG9yeUhhbmRsZXJzXG5cdFx0XHRcdH1dLFxuXHRcdFx0XHRpbml0OiBmdW5jdGlvbihhZGFwdGVyKSB7XG5cdFx0XHRcdFx0JChhZGFwdGVyLm1lbnUubWVudUVsZW1lbnQpLmFkZENsYXNzKCdkZXNrdG9wJyk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHRlYXJkb3duOiBmdW5jdGlvbihhZGFwdGVyKSB7XG5cdFx0XHRcdFx0JChhZGFwdGVyLm1lbnUubWVudUVsZW1lbnQpLnJlbW92ZUNsYXNzKCdkZXNrdG9wJyk7XG5cdFx0XHRcdFx0YWRhcHRlci5tZW51LmNvbGxhcHNlQWxsU3ViTWVudXMoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdC8vIGNyZWF0ZSBtb2JpbGUgYWRhcHRlclxuXHRcdFx0Ly8gbW9iaWxlQWRhcHRlciBzdGFydGluZyBwb2ludCBpcyBhIGNvcHkgb2YgZGVza3RvcCBhZGFwdGVyXG5cdFx0XHR2YXIgbW9iaWxlQWRhcHRlciA9IG1lbnVBZGFwdGVyLmdlbmVyYXRlTWVudUFkYXB0ZXIobWVudSwge1xuXHRcdFx0XHRoYW5kbGVyczogW3tcblx0XHRcdFx0XHRzZXR1cDogc3VwcG9ydE1lbnUudG91Y2hIYW5kbGVycyxcblx0XHRcdFx0XHRkZXN0cm95OiBmdW5jdGlvbihhZGFwdGVyKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gc3VwcG9ydE1lbnUuZGVzdG9yeUhhbmRsZXJzKGFkYXB0ZXIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fV0sIC8vIGFzc3VtZSBubyBob3ZlciBpbnRlcmFjdGlvbnNcblx0XHRcdFx0aW5pdDogZnVuY3Rpb24oYWRhcHRlcikge1xuXHRcdFx0XHRcdCQoYWRhcHRlci5tZW51Lm1lbnVFbGVtZW50KS5hZGRDbGFzcygnbW9iaWxlJyk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHRlYXJkb3duOiBmdW5jdGlvbihhZGFwdGVyKSB7XG5cdFx0XHRcdFx0JChhZGFwdGVyLm1lbnUubWVudUVsZW1lbnQpLnJlbW92ZUNsYXNzKCdtb2JpbGUnKTtcblx0XHRcdFx0XHRhZGFwdGVyLm1lbnUuY29sbGFwc2VBbGxTdWJNZW51cygpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0dmFyIGFsbEFkYXB0ZXJzID0ge1xuXHRcdFx0XHRtb2JpbGU6IG1vYmlsZUFkYXB0ZXIsXG5cdFx0XHRcdGRlc2t0b3A6IGRlc2t0b3BBZGFwdGVyXG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuIGFsbEFkYXB0ZXJzO1xuXHRcdH0sXG5cblx0XHRnZXRBZGFwdGVyTWFuYWdlcjogZnVuY3Rpb24obWVudSwgYWRhcHRlcnMpIHtcblx0XHRcdHZhciBhZGFwdGVyTWFuYWdlciA9IGdlbmVyYXRlTWVudUFkYXB0ZXJNYW5hZ2VyKCk7XG5cdFx0XHRyZXR1cm4gYWRhcHRlck1hbmFnZXI7XG5cdFx0fSxcblxuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG1lbnUgPSB0aGlzLmdldE1lbnUoKTtcblx0XHRcdHZhciBhZGFwdGVycyA9IHRoaXMuZ2V0QWRhcHRlcnMobWVudSk7XG5cdFx0XHR2YXIgYWRhcHRlck1hbmFnZXIgPSB0aGlzLmdldEFkYXB0ZXJNYW5hZ2VyKG1lbnUsIGFkYXB0ZXJzKTtcblxuXHRcdFx0dmFyIGlzRGVza3RvcCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQvLyBpbiBjYXNlIG1lZGlhIHF1ZXJpZXMgYXJlbid0IHN1cHBvcnRlZCBieSB0aGUgYnJvd3NlciwgdGhlbiBkZWZhdWx0IHRvIHVzaW5nIHRoZSB3aWR0aCBvZiB0aGUgd2luZG93XG5cdFx0XHRcdHJldHVybiBNb2Rlcm5penIubXEoJyhtaW4td2lkdGg6ICcgKyBTdXBwb3J0Lk1lbnUuZGVza3RvcEJyZWFrcG9pbnQgKyAncHgpJykgfHwgJCh3aW5kb3cpLndpZHRoKCkgPj0gU3VwcG9ydC5NZW51LmRlc2t0b3BCcmVha3BvaW50O1xuXHRcdFx0fTtcblx0XHRcdHZhciBpc01vYmlsZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gIWlzRGVza3RvcCgpO1xuXHRcdFx0fTtcblxuXHRcdFx0Ly8gQWRkIGFkYXB0ZXIgZm9yIHZhcmlvdXMgY29uZGl0aW9ucywgb24gdGhlIGFkYXB0ZXIgbWFuYWdlclxuXHRcdFx0YWRhcHRlck1hbmFnZXIuYWRkQ29uZGl0aW9uKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gaXNEZXNrdG9wKCk7XG5cdFx0XHR9LCBhZGFwdGVycy5kZXNrdG9wKTtcblxuXHRcdFx0YWRhcHRlck1hbmFnZXIuYWRkQ29uZGl0aW9uKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gaXNNb2JpbGUoKTtcblx0XHRcdH0sIGFkYXB0ZXJzLm1vYmlsZSk7XG5cblx0XHRcdGFkYXB0ZXJNYW5hZ2VyLmluaXQoKTtcblx0XHR9XG5cdH07XG5cblx0U3VwcG9ydC5Nb2JpbGVUb2dnbGVIZWFkZXIgPSB7XG5cblx0XHRiYXNlSGVpZ2h0OiBudWxsLFxuXHRcdG1heEhlaWdodDogMTUwMCxcblx0XHRicmVha3BvaW50VG9nZ2xlOiA5NjAsXG5cblx0XHRhY3Rpb25zOiB7XG5cdFx0XHRvcGVuOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0JCgnLnN1cHBvcnQtaGVhZGVyJykuYWRkQ2xhc3MoJ2V4cGFuZGVkJyk7XG5cdFx0XHRcdCQoJy5zdXBwb3J0LWhlYWRlcicpLmNzcygnbWF4LWhlaWdodCcsICcxMjAwcHgnKTtcblx0XHRcdH0sXG5cdFx0XHRjbG9zZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHRoaXMuc2V0SGVpZ2h0QXNCYXNlSGVpZ2h0KCk7XG5cdFx0XHR9LFxuXHRcdFx0c2V0SGVpZ2h0QXNCYXNlSGVpZ2h0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0JCgnLnN1cHBvcnQtaGVhZGVyJykuY3NzKCdtYXgtaGVpZ2h0JywgU3VwcG9ydC5Nb2JpbGVUb2dnbGVIZWFkZXIuYmFzZUhlaWdodCArICdweCcpO1xuXG5cdFx0XHRcdC8vIGJ5IGRlZmF1bHQgb3RoZXIgYnJvd3NlcnMgd2lsbCB0cmlnZ2VyIGNsb3NlIG9uIGFkZEhhbmRsZXJzIGF0IHRoZSBlbmQgb2YgdGhlIGNzcyB0cmFuc2l0aW9uXG5cdFx0XHRcdC8vIGllOCB3aWxsIG5ldmVyIHRyaWdnZXIgdGhlIGVuZCBjc3MgdHJhbnNpdGlvbiBldmVudCBhcyBpdCBkb2Vzbid0IHN1cHBvcnQgdHJhbnNpdGlvbnNcblx0XHRcdFx0aWYgKCQoJ2h0bWwnKS5oYXNDbGFzcygnb2xkaWUnKSkge1xuXHRcdFx0XHRcdCQoJy5zdXBwb3J0LWhlYWRlcicpLnRyaWdnZXIoJ3RyYW5zaXRpb25lbmQnKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGFwcGx5SWZNb2JpbGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQvLyBpZiBkZXNrdG9wLCByZW1vdmUgbWF4LWhlaWdodCBhbmQgZXhwYW5kZWQgY2xhc3Ncblx0XHRcdFx0Ly8gaW4gY2FzZSBtZWRpYSBxdWVyaWVzIGFyZW4ndCBzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIsIHRoZW4gZGVmYXVsdCB0byB1c2luZyB0aGUgd2lkdGggb2YgdGhlIHdpbmRvd1xuXHRcdFx0XHR2YXIgaXNEZXNrdG9wID0gTW9kZXJuaXpyLm1xKCcobWluLXdpZHRoOiAnICsgU3VwcG9ydC5Nb2JpbGVUb2dnbGVIZWFkZXIuYnJlYWtwb2ludFRvZ2dsZSArICdweCknKSB8fCAkKHdpbmRvdykud2lkdGgoKSA+PSBTdXBwb3J0Lk1lbnUuZGVza3RvcEJyZWFrcG9pbnQ7XG5cdFx0XHRcdGlmIChpc0Rlc2t0b3ApIHtcblx0XHRcdFx0XHQkKCcuc3VwcG9ydC1oZWFkZXInKS5jc3MoJ21heC1oZWlnaHQnLCAnJyk7XG5cdFx0XHRcdFx0JCgnLnN1cHBvcnQtaGVhZGVyJykucmVtb3ZlQ2xhc3MoJ2V4cGFuZGVkJyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aWYgKCQoJy5zdXBwb3J0LWhlYWRlcicpLmhhc0NsYXNzKCdleHBhbmRlZCcpKSB7XG5cdFx0XHRcdFx0XHR0aGlzLm9wZW4oKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dGhpcy5jbG9zZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRjYWxjQmFzZUhlaWdodDogZnVuY3Rpb24oKSB7XG5cdFx0XHQvLyBpZiB0aGUgaGVpZ2h0IHNob3VsZCBiZSBkZXRlcm1pbmVkIGR5bmFtaWNhbGx5XG5cdFx0XHQvLyB0aGlzLmJhc2VIZWlnaHQgPSAkKCcubG9nby1iYXItY29udGFpbmVyJykuaGVpZ2h0KCk7XG5cblx0XHRcdHRoaXMuYmFzZUhlaWdodCA9IDkwO1xuXHRcdH0sXG5cblx0XHRhZGRIYW5kbGVyczogZnVuY3Rpb24oKSB7XG5cblx0XHRcdCQoJy5qcy10b2dnbGUtb3Blbi1oZWFkZXInKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKCQoJy5zdXBwb3J0LWhlYWRlcicpLmhhc0NsYXNzKCdleHBhbmRlZCcpKSB7XG5cdFx0XHRcdFx0U3VwcG9ydC5Nb2JpbGVUb2dnbGVIZWFkZXIuYWN0aW9ucy5jbG9zZSgpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFN1cHBvcnQuTW9iaWxlVG9nZ2xlSGVhZGVyLmFjdGlvbnMub3BlbigpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0JCgnLnN1cHBvcnQtaGVhZGVyJykub24oJ3RyYW5zaXRpb25lbmQgd2Via2l0VHJhbnNpdGlvbkVuZCBvVHJhbnNpdGlvbkVuZCBNU1RyYW5zaXRpb25FbmQnLCBmdW5jdGlvbigpIHtcblxuXHRcdFx0XHQvLyB0cmFuc2l0aW9uIGhhcyBlbmRlZCBhbmQgYXQgZW5kIGhlaWdodCBwb3NpdGlvblxuXHRcdFx0XHRpZiAoJCgnLnN1cHBvcnQtaGVhZGVyJykuaGVpZ2h0KCkgPT09IFN1cHBvcnQuTW9iaWxlVG9nZ2xlSGVhZGVyLmJhc2VIZWlnaHQgfHwgJCgnaHRtbCcpLmhhc0NsYXNzKCdvbGRpZScpKSB7XG5cdFx0XHRcdFx0JCgnLnN1cHBvcnQtaGVhZGVyJykucmVtb3ZlQ2xhc3MoJ2V4cGFuZGVkJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHQkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0U3VwcG9ydC5Nb2JpbGVUb2dnbGVIZWFkZXIuYWN0aW9ucy5hcHBseUlmTW9iaWxlKCk7XG5cdFx0XHR9KTtcblxuXHRcdH0sXG5cblx0XHRpbml0OiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRzZWxmLmNhbGNCYXNlSGVpZ2h0KCk7XG5cdFx0XHRcdHNlbGYuYWRkSGFuZGxlcnMoKTtcblx0XHRcdFx0c2VsZi5hY3Rpb25zLmFwcGx5SWZNb2JpbGUoKTtcblx0XHRcdH0sIDApO1xuXHRcdH1cblx0fTtcblxuXHQvLyB1c2VkIHRvIGF0dGFjaCB0aGUgY2xhc3Mgb24gbG9hZCB0byB0cmFuc2l0aW9uIHRoZSBmaXhlZCBzaWRlIGludG8gdmlld1xuXHRTdXBwb3J0LlNsaWRlSW5TdXBwb3J0Q2hhdEJ1dHRvbiA9IHtcblx0XHRpbml0OiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciAkY2hhdE5vdyA9ICQoJy5zdXBwb3J0LWNoYXQtbm93LCAuY2hhdC1ub3ctbGluaycpO1xuXHRcdFx0aWYgKCRjaGF0Tm93Lmxlbmd0aCkge1xuXHRcdFx0XHQkY2hhdE5vdy5hZGRDbGFzcygnb24tc2NyZWVuJyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gaW5pdCBlYWNoIHN1cHBvcnQgZmVhdHVyZVxuXHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdFN1cHBvcnQuQXV0aGVudGljYXRlZEJsb2Nrcy5pbml0KCk7XG5cdFx0U3VwcG9ydC5HZXR0aW5nU3RhcnRlZENhcm91c2VsLmluaXQoKTtcblx0XHRTdXBwb3J0LkNvbnRyb2xzLmluaXQoKTtcblx0XHRTdXBwb3J0LkFsZXJ0cy5pbml0KCk7XG5cdFx0U3VwcG9ydC5Ub2dnbGVTZWFyY2hBcmVhcy5pbml0KCk7XG5cdFx0U3VwcG9ydC5NZW51LmluaXQoKTtcblx0XHRTdXBwb3J0Lk1vYmlsZVRvZ2dsZUhlYWRlci5pbml0KCk7XG5cdFx0U3VwcG9ydC5TbGlkZUluU3VwcG9ydENoYXRCdXR0b24uaW5pdCgpO1xuXHR9XG5cblx0JChpbml0KTtcblxufShqUXVlcnkpKTtcbiIsInZhciBnZW5lcmF0ZU1lbnVBZGFwdGVyID0gKGZ1bmN0aW9uKCkge1xuXG5cdHZhciBhZGFwdGVyQVBJID0ge1xuXG5cdFx0bGFiZWw6ICcnLFxuXHRcdG1lbnU6IG51bGwsXG5cdFx0aW50ZXJmYWNlOiAndG91Y2gnLCAvLyBhc3N1bWUgYSB0b3VjaCBpbnRlcmZhY2UgYnkgZGVmYXVsdCwgbW9iaWxlLWZpcnN0XG5cdFx0aGFuZGxlcnM6IFtdLFxuXG5cdFx0c2V0dXBIYW5kbGVyczogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgYWRhcHRlciA9IHRoaXM7XG5cdFx0XHQkLmVhY2godGhpcy5oYW5kbGVycywgZnVuY3Rpb24oaSwgaGFuZGxlcil7XG5cdFx0XHRcdGhhbmRsZXIuc2V0dXAoYWRhcHRlcik7XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdGRlc3Ryb3lIYW5kbGVyczogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgYWRhcHRlciA9IHRoaXM7XG5cdFx0XHQkLmVhY2godGhpcy5oYW5kbGVycywgZnVuY3Rpb24oaSwgaGFuZGxlcil7XG5cdFx0XHRcdGhhbmRsZXIuZGVzdHJveShhZGFwdGVyKTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cblx0XHR0ZWFyZG93bjogZnVuY3Rpb24oYWRhcHRlcikge30sXG5cdFx0aW5pdDogZnVuY3Rpb24oYWRhcHRlcikge31cblx0fTtcblxuXHRyZXR1cm4gZnVuY3Rpb24obWVudSwgb3B0aW9ucykge1xuXG5cdFx0dmFyIGFkYXB0ZXIgPSAkLmV4dGVuZCh7fSwgYWRhcHRlckFQSSwgb3B0aW9ucywge1xuXG5cdFx0XHRtZW51OiBtZW51LFxuXG5cdFx0XHRpbml0OiBmdW5jdGlvbihpbnRlcmZhY2UpIHtcblxuXHRcdFx0XHRtZW51LmluaXQoKTtcblxuXHRcdFx0XHR0aGlzLmludGVyZmFjZSA9IGludGVyZmFjZTtcblx0XHRcdFx0dGhpcy5zZXR1cEhhbmRsZXJzKCk7XG5cblx0XHRcdFx0Ly8gZmluaXNoIHdpdGggZXhlY3V0aW5nIHRoZSBvcHRpb25zIHBhc3NlZCBpblxuXHRcdFx0XHRpZiAodHlwZW9mIG9wdGlvbnMuaW5pdCA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdG9wdGlvbnMuaW5pdCh0aGlzKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblxuXHRcdFx0dGVhcmRvd246IGZ1bmN0aW9uKCkge1xuXG5cdFx0XHRcdHRoaXMuZGVzdHJveUhhbmRsZXJzKCk7XG5cblx0XHRcdFx0aWYgKHR5cGVvZiBvcHRpb25zLnRlYXJkb3duID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0b3B0aW9ucy50ZWFyZG93bih0aGlzKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIGFkYXB0ZXI7XG5cblx0fTtcblxufSkoKTtcblxuZXhwb3J0cy5nZW5lcmF0ZU1lbnVBZGFwdGVyID0gZ2VuZXJhdGVNZW51QWRhcHRlcjtcbiIsInZhciBnZW5lcmF0ZU1lbnUgPSAoZnVuY3Rpb24oKSB7XG5cblx0dmFyIG1lbnVEZWZhdWx0ID0ge1xuXG5cdCAgbWVudUVsZW1lbnQ6ICQoJy5tZW51JyksXG5cdCAgc3ViTWVudVNlbGVjdG9yOiAnLnN1Yi1tZW51Jyxcblx0ICBleHBhbmRlZENsYXNzOiAnZXhwYW5kZWQnLFxuXHQgIHN1Yk1lbnVUcmlnZ2VyU2VsZWN0b3I6ICcuanMtc2hvdy1zdWItdHJpZ2dlcicsXG5cblx0ICBleHBhbmRNZW51OiBmdW5jdGlvbihzdWJNZW51RWxlbWVudCkge1xuXHRcdCQoc3ViTWVudUVsZW1lbnQpLmFkZENsYXNzKHRoaXMuZXhwYW5kZWRDbGFzcyk7XG5cdCAgfSxcblxuXHQgIGNvbGxhcHNlTWVudTogZnVuY3Rpb24oc3ViTWVudUVsZW1lbnQpIHtcblx0XHQkKHN1Yk1lbnVFbGVtZW50KS5yZW1vdmVDbGFzcyh0aGlzLmV4cGFuZGVkQ2xhc3MpO1xuXHQgIH0sXG5cblx0ICBjb2xsYXBzZUFsbFN1Yk1lbnVzOiBmdW5jdGlvbigpIHtcblx0ICBcdHZhciBtZW51ID0gdGhpcztcblx0XHR0aGlzLm1lbnVFbGVtZW50LmZpbmQodGhpcy5zdWJNZW51U2VsZWN0b3IpLmVhY2goZnVuY3Rpb24oaSwgZSl7XG5cdFx0ICBtZW51LmNvbGxhcHNlTWVudShlKTtcblx0XHR9KTtcblx0ICB9LFxuXG5cdCAgZmluZE1lbnVGcm9tVGFyZ2V0OiBmdW5jdGlvbih0YXJnZXQpIHtcblx0XHR2YXIgdHJpZ2dlciA9ICQodGFyZ2V0KS5wYXJlbnQodGhpcy5zdWJNZW51VHJpZ2dlclNlbGVjdG9yKS5hZGRCYWNrKHRoaXMuc3ViTWVudVRyaWdnZXJTZWxlY3Rvcik7XG5cdFx0dmFyIG1lbnUgPSB0cmlnZ2VyLmZpbmQodGhpcy5zdWJNZW51U2VsZWN0b3IpO1xuXHRcdHJldHVybiBtZW51O1xuXHQgIH0sXG5cblx0ICBpbml0OiBmdW5jdGlvbigpIHt9XG5cdH07XG5cblx0cmV0dXJuIGZ1bmN0aW9uKG9wdGlvbnMpIHtcblx0ICByZXR1cm4gJC5leHRlbmQoe30sIG1lbnVEZWZhdWx0LCBvcHRpb25zKTtcblx0fTtcbn0pKCk7XG5cbmV4cG9ydHMuZ2VuZXJhdGVNZW51ID0gIGdlbmVyYXRlTWVudTtcbiJdfQ==
