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

				var pathCheck = /support.*support-central/;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL3N1cHBvcnQuanMiLCJqcy9tb2R1bGVzL21lbnUtYWRhcHRlci5qcyIsImpzL21vZHVsZXMvbWVudS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbGhDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBtZW51anMgPSByZXF1aXJlKCcuL21lbnUnKTtcbnZhciBtZW51QWRhcHRlciA9IHJlcXVpcmUoJy4vbWVudS1hZGFwdGVyJyk7XG5cbnZhciBTdXBwb3J0ID0gU3VwcG9ydCB8fCB7fTtcblxuKGZ1bmN0aW9uKCQpIHtcblxuXHR2YXIgc3VwcG9ydEVudixcblx0XHRzdXBwb3J0UGF0aCxcblx0XHRhbGVydE1lc3NhZ2VzLFxuXHRcdGlzc3Vlc0NvbnRhaW5lciA9ICQoJy5qcy1pc3N1ZXMtY29udGFpbmVyJyksXG5cdFx0Y29udHJhY3RTZWxlY3RvciA9ICQoJy5qcy1jb250cmFjdHMtc2VsZWN0JyksXG5cdFx0Y29udHJhY3REZXRhaWxzID0gJCgnLmFjdGlvbi1kZXRhaWwtZ3JvdXAnKSxcblx0XHRhY2NvdW50RGV0YWlscyA9ICQoJy5hY3Rpb24tZGV0YWlscycpLFxuXHRcdGFjY291bnRFcnJvciA9ICQoJy5qcy1hY2NvdW50LWVycm9yJyksXG5cdFx0YWxlcnRzQnV0dG9uQ29udGFpbmVyID0gJCgnYS5hbGVydHMuanMtZmFuY3lEaWFsb2cnKS5wYXJlbnQoJ2xpLmFjdGlvbicpO1xuXG5cdFN1cHBvcnQuSGVscGVycyA9IHtcblxuXHRcdC8vIENoZWNrIGlmIHRoZSBibWNNZXRhIGFuZCBibWNNZXRhLnN1cHBvcnQgZXhpc3Rcblx0XHQvLyBVc2VkIHRvIGFzc3VtZSBvdGhlciBmdW5jdGlvbmFsaXR5IGJhc2VkIG9uIHRoZSBleGlzdGFuY2Ugb2YgdGhpcyBpbml0aWFsIGJhc2Ugc2V0dXBcblx0XHRibWNTdXBwb3J0TG9hZGVkOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICh0eXBlb2YgYm1jTWV0YSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGJtY01ldGEuc3VwcG9ydCAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSxcblxuXHRcdC8vIENoZWNrIHRvIHNlZSBpZiBlbmFibGVBbGVydHMgaXMgdHJ1ZVxuXHRcdGJtY0FsZXJ0c0VuYWJsZWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKHR5cGVvZiBibWNNZXRhLnN1cHBvcnQuZW5hYmxlQWxlcnRzICE9PSAndW5kZWZpbmVkJyAmJiBibWNNZXRhLnN1cHBvcnQuZW5hYmxlQWxlcnRzID09IHRydWUpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRTdXBwb3J0LkhlbHBlcnMuaGlkZUFsZXJ0c0J1dHRvbigpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0sXG5cblx0XHRoaWRlQWxlcnRzQnV0dG9uOiBmdW5jdGlvbigpIHtcblx0XHRcdCQoYWxlcnRzQnV0dG9uQ29udGFpbmVyKS5oaWRlKCk7XG5cdFx0fSxcblx0XHRzaG93QWxlcnRzQnV0dG9uOiBmdW5jdGlvbigpIHtcblx0XHRcdCQoYWxlcnRzQnV0dG9uQ29udGFpbmVyKS5zaG93KCk7XG5cdFx0fSxcblxuXHRcdGlzQXV0aGVudGljYXRlZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdHlwZW9mIGJtY01ldGEgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIGJtY01ldGEudXNlciAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgYm1jTWV0YS51c2VyLmlzU3VwcG9ydEF1dGhlbnRpY2F0ZWQgIT09IFwidW5kZWZpbmVkXCIgJiYgYm1jTWV0YS51c2VyLmlzU3VwcG9ydEF1dGhlbnRpY2F0ZWQ7XG5cdFx0fSxcblxuXHRcdGlzT25TdXBwb3J0TGFuZGluZ1BhZ2U6IGZ1bmN0aW9uKCkge1xuXG5cdFx0XHRpZiAoU3VwcG9ydC5IZWxwZXJzLmJtY1N1cHBvcnRMb2FkZWQoKVxuXHRcdFx0XHQmJiB0eXBlb2YgYm1jTWV0YS5wYWdlICE9PSAndW5kZWZpbmVkJ1xuXHRcdFx0XHQmJiB0eXBlb2YgYm1jTWV0YS5wYWdlLmxvbmdOYW1lID09PSAnc3RyaW5nJykge1xuXG5cdFx0XHRcdHZhciBwYXRoQ2hlY2sgPSAvc3VwcG9ydC4qc3VwcG9ydC1jZW50cmFsLztcblx0XHRcdFx0Ly8gbWF0Y2hlcyBwYXRoIHN0cmluZyB3aXRoIHN1cHBvcnQgYW5kIHN1cHBvcnQgY2VudHJhbCBpbiBpdFxuXHRcdFx0XHQvLyBleGFtcGxlczpcblx0XHRcdFx0Ly8gXCJzdXBwb3J0OnN1cHBvcnQtY2VudHJhbFwiIG9yIFwic3VwcG9ydDpyZWc6c3VwcG9ydC1jZW50cmFsXCJcblx0XHRcdFx0aWYgKGJtY01ldGEucGFnZS5sb25nTmFtZS5tYXRjaChwYXRoQ2hlY2spICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gY2F0Y2gtYWxsIGRlZmF1bHRcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogZ2V0QWNjb3VudEVycm9yTWVzc2FnZVxuXHRcdCAqIEBwYXJhbSAge3N0cmluZ30gZXJyb3JUeXBlIC0gJ2lzc3VlJ1xuXHRcdCAqIEBwYXJhbSAge3N0cmluZ30gZXJyb3JDb2RlIGVycm9yQ29kZSAobGlrZWx5IHB1bGxlZCBmcm9tIGFqYXggcmVzcG9uc2UpXG5cdFx0ICogQHJldHVybiB7c3RyaW5nIHwgdW5kZWZpbmVkfSBSZXR1cm5zIG1hcHBlZCBzdHJpbmcgb3IgdW5kZWZpbmVkIGlmIG5vbmUgZm91bmQgaW4gdW5kZWZpbmVkXG5cdFx0ICovXG5cdFx0Z2V0QWNjb3VudEVycm9yTWVzc2FnZTogZnVuY3Rpb24oZXJyb3JUeXBlLCBlcnJvckNvZGUpIHtcblx0XHRcdC8vIG1hcCBlcnJvclR5cGUgdG8gY29ycmVjdCBlcnJvckdyb3VwLCBlcnJvckdyb3VwIGlzIHVzZWQgYXMgdGhlIGluZGV4IG9uIGJtY01ldGEuc3VwcG9ydC5lcnJvck1lc3NhZ2VzXG5cdFx0XHRpZiAoZXJyb3JUeXBlID09ICdpc3N1ZScpIHtcblx0XHRcdFx0dmFyIGVycm9yR3JvdXAgPSAnY2FzZUVycm9yTWVzc2FnZXMnO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdVc2UgdmFsaWQgZXJyb3JUeXBlIHdoZW4gYWNjb3VudEVycm9yJyk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIGRldGVybWluZSBhcHByb3ByaWF0ZSBlcnJvciBtZXNzYWdlIGJhc2VkIG9uIGluZGV4ZXNcblx0XHRcdC8vIHVuZGVmaW5lZCBpZiBtYXBwZWQgdmFsdWUgbm90IGZvdW5kXG5cdFx0XHR2YXIgZXJyb3JNZXNzYWdlID0gU3VwcG9ydC5IZWxwZXJzLmJtY1N1cHBvcnRMb2FkZWQoKVxuXHRcdFx0XHRcdFx0XHRcdCYmIGJtY01ldGEuc3VwcG9ydFtlcnJvckdyb3VwXSAhPT0gdW5kZWZpbmVkXG5cdFx0XHRcdFx0XHRcdFx0JiYgYm1jTWV0YS5zdXBwb3J0W2Vycm9yR3JvdXBdW2Vycm9yQ29kZV0gIT09IHVuZGVmaW5lZFxuXHRcdFx0XHRcdFx0XHRcdD8gYm1jTWV0YS5zdXBwb3J0W2Vycm9yR3JvdXBdW2Vycm9yQ29kZV0gOiB1bmRlZmluZWQ7XG5cblx0XHRcdHJldHVybiBlcnJvck1lc3NhZ2U7XG5cdFx0fSxcblxuXHRcdGFjY291bnRFcnJvcjogZnVuY3Rpb24oZXJyb3JUeXBlLCBlcnJvckNvZGUpIHtcblx0XHRcdC8vIHJlc2V0IGhpZGluZyBvZiBjb250YWluZXIsIHNob3cgbmV3IGVycm9yXG5cdFx0XHRTdXBwb3J0LkNvbnRyb2xzLmFjdGlvbnMucmVzZXRMb2FkQWNjb3VudEVycm9yKCk7XG5cblx0XHRcdHZhciBlcnJvck1lc3NhZ2UgPSBTdXBwb3J0LkhlbHBlcnMuZ2V0QWNjb3VudEVycm9yTWVzc2FnZShlcnJvclR5cGUsIGVycm9yQ29kZSk7XG5cblx0XHRcdC8vIGVycm9yTWVzc2FnZSBpcyB1bmRlZmluZWQgaWYgbWFwcGVkIG1lc3NhZ2Ugbm90IGZvdW5kXG5cdFx0XHQvLyBhdHRlbXB0IHRvIHNldCB1c2UgREVGQVVMVF9FUlJPUl9NRVNTQUdFXG5cdFx0XHRpZiAoZXJyb3JNZXNzYWdlID09PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRlcnJvck1lc3NhZ2UgPSBTdXBwb3J0LkhlbHBlcnMuZ2V0QWNjb3VudEVycm9yTWVzc2FnZShlcnJvclR5cGUsICdERUZBVUxUX0VSUk9SX01FU1NBR0UnKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gc2hvdy9oaWRlIHNwZWNpZmljIGNvbnRhaW5lcnMgYmFzZWQgb24gZXJyb3JUeXBlXG5cdFx0XHRpZiAoZXJyb3JUeXBlID09ICdpc3N1ZScpIHtcblx0XHRcdFx0JChhY2NvdW50RGV0YWlscykuc2hvdygpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBoaWRlIG90aGVyIGNvbnRhaW5lcnNcblx0XHRcdCQoaXNzdWVzQ29udGFpbmVyKS5oaWRlKCk7XG5cblx0XHRcdC8vIHNob3cgZXJyb3IgY29udGFpbmVyIHdpdGggbWVzc2FnZSwgYnV0IG9ubHkgaWYgbWVzc2FnZSBpcyBhIG5vbi1lbXB0eSBzdHJpbmdcblx0XHRcdC8vIGlmIHRoZSBlcnJvck1lc3NhZ2Ugd2FzIHJlc29sdmVkIHRvIGEgbWFwcGluZyBvZiBhbiBlbXB0eSBzdHJpbmcsIHRoZW4gZG9uJ3Qgc2hvd1xuXHRcdFx0aWYgKHR5cGVvZiBlcnJvck1lc3NhZ2UgPT09ICdzdHJpbmcnICYmIGVycm9yTWVzc2FnZS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdCQoYWNjb3VudEVycm9yKS5zaG93KCkuaHRtbChlcnJvck1lc3NhZ2UpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBQYXJzZXMgZGF0ZXMgY29taW5nIGJhY2sgZnJvbSBhamF4IHJlc3BvbnNlLiBGb3IgdGhlIGxhY2sgb2YgYSBiZXR0ZXIgdGVybSB0aGlzIGlzIGJlaW5nXG5cdFx0ICogcmVmZXJyZWQgdG8gYXMgYFN1cHBvcnQgTG9uZyBEYXRlYCwgYW5kIGlzIGEgc3RyaW5nIGJlaW5nIGxvYWRlZCBpbiB0aGUgc3RhbmRhcmQgZm9ybWF0OlxuXHRcdCAqIDIwMTUtMDQtMTRUMTQ6MDI6MjIuMDAwWlxuXHRcdCAqIEBwYXJhbSAge1N0cmluZ30gZGF0ZVN0cmluZyAtIERhdGUgZm9ybWF0dGVkIHN0cmluZywgbGlrZSAnMjAxNS0wNC0xNFQxNDowMjoyMi4wMDBaJ1xuXHRcdCAqIEByZXR1cm4ge0RhdGV8bnVsbH0gbnVsbCBpZiBubyBtYXRjaGVzLCBvciBuYXRpdmUgamF2YXNjcmlwdCBEYXRlIG9iamVjdFxuXHRcdCAqL1xuXHRcdHBhcnNlU3VwcG9ydExvbmdEYXRlOiBmdW5jdGlvbihkYXRlU3RyaW5nKSB7XG5cdFx0XHR2YXIgcGF0dGVybiA9IC8oXFxkezR9KS0oXFxkezJ9KS0oXFxkezJ9KVQoXFxkezJ9KTooXFxkezJ9KTooXFxkezJ9KS4oXFxkezN9XFxEKS87XG5cdFx0XHR2YXIgbWF0Y2hlcyA9IHBhdHRlcm4uZXhlYyhkYXRlU3RyaW5nKTtcblxuXHRcdFx0Ly8gb24gc3VjY2Vzc2Z1bCBtYXRjaCwgbWF0Y2hbMF0gd2lsbCBiZSB0aGUgZW50aXJlIG1hdGNoZWQgc3RyaW5nXG5cdFx0XHQvLyBtYXRjaGVkIGdyb3VwcyBhcmUgZm9sbG93aW5nIGluZGV4ZXNcblx0XHRcdGlmIChtYXRjaGVzKSB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0Ly8gbW9udGggaXMgcmVwcmVzZW50ZWQgYnkgbWF0Y2hlc1syXSwgRGF0ZSBjb25zdHJ1Y3RvciBleHBlY3RzIG1vbnRoIGluZGV4IGZyb20gMCB0byAxMS5cblx0XHRcdFx0XHRyZXR1cm4gbmV3IERhdGUobWF0Y2hlc1sxXSwgKHBhcnNlSW50KG1hdGNoZXNbMl0pIC0gMSksIG1hdGNoZXNbM10sIG1hdGNoZXNbNF0sIG1hdGNoZXNbNV0sIG1hdGNoZXNbNl0pO1xuXHRcdFx0XHR9IGNhdGNoKGVycm9yKSB7XG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZygnVW5hYmxlIHRvIHBhcnNlU3VwcG9ydExvbmdEYXRlIHdpdGggJyArIGRhdGVTdHJpbmcgKyAnLiBFcnJvcjpcXG4gJyArIGVycm9yLm1lc3NhZ2UpO1xuXHRcdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0cGFkOiBmdW5jdGlvbihuLCB3aWR0aCwgeikge1xuXHRcdFx0eiA9IHogfHwgJzAnO1xuXHRcdFx0biA9IG4gKyAnJztcblx0XHRcdHJldHVybiBuLmxlbmd0aCA+PSB3aWR0aCA/IG4gOiBuZXcgQXJyYXkod2lkdGggLSBuLmxlbmd0aCArIDEpLmpvaW4oeikgKyBuO1xuXHRcdH0sXG5cblx0XHQvLyBRdWljayBhbmQgZWFzeSBmdW5jdGlvbiBmb3IgcGFkZGluZyBtb250aCBhbmQgZGF5IGFtb3VudHMgd2l0aCBsZWFkaW5nIHplcm9lcyBpZiBuZWNlc3NhcnkgKGllOiBNTS9ERC9ZWVlZLCBzaW5nbGUgZGlnaXRhbHMgZm9yIE1NIGFuZCBERCBzaG91bGQgaGF2ZSBsZWFkaW5nIDApXG5cdFx0cGFkVG9Ud29EaWdpdHM6IGZ1bmN0aW9uKG51bSkge1xuXHRcdFx0cmV0dXJuIFN1cHBvcnQuSGVscGVycy5wYWQobnVtLCAyKTtcblx0XHR9LFxuXHRcdGdldFVSTFdpdGhRdWVyeVBhcmFtOiBmdW5jdGlvbih1cmksIGtleSwgdmFsdWUpIHtcblx0XHRcdHZhciByZSA9IG5ldyBSZWdFeHAoXCIoWz8mXSlcIiArIGtleSArIFwiPS4qPygmfCQpXCIsIFwiaVwiKTtcblx0XHRcdHZhciBzZXBhcmF0b3IgPSB1cmkuaW5kZXhPZignPycpICE9PSAtMSA/IFwiJlwiIDogXCI/XCI7XG5cblx0XHRcdGlmICh1cmkubWF0Y2gocmUpKSB7XG5cdFx0XHRcdHJldHVybiB1cmkucmVwbGFjZShyZSwgJyQxJyArIGtleSArIFwiPVwiICsgdmFsdWUgKyAnJDInKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gdXJpICsgc2VwYXJhdG9yICsga2V5ICsgXCI9XCIgKyB2YWx1ZTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdC8vIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcgaWYgaXQncyBub3Qgb25lLiBBbiBlbXB0eSBzdHJpbmcgaXMgcmV0dXJuZWQgZm9yIGBudWxsYCBvciBgdW5kZWZpbmVkYCB2YWx1ZXMuXG5cdFx0YmFzZVRvU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdCAgcmV0dXJuIHZhbHVlID09IG51bGwgPyAnJyA6ICh2YWx1ZSArICcnKTtcblx0XHR9LFxuXG5cdFx0Ly8gQ2FwaXRhbGl6ZXMgdGhlIGZpcnN0IGNoYXJhY3RlciBvZiBgc3RyaW5nYC5cblx0XHRjYXBpdGFsaXplOiBmdW5jdGlvbihzdHJpbmcpIHtcblx0XHQgIHN0cmluZyA9IFN1cHBvcnQuSGVscGVycy5iYXNlVG9TdHJpbmcoc3RyaW5nKTtcblx0XHQgIHJldHVybiBzdHJpbmcgJiYgKHN0cmluZy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0cmluZy5zbGljZSgxKSk7XG5cdFx0fSxcblxuXHRcdG1ha2VGdWxsTmFtZTogZnVuY3Rpb24oZmlyc3ROYW1lLCBsYXN0TmFtZSkge1xuXHRcdFx0cmV0dXJuIFN1cHBvcnQuSGVscGVycy5jYXBpdGFsaXplKGxhc3ROYW1lLnRvTG93ZXJDYXNlKCkpICsgXCIsIFwiICsgU3VwcG9ydC5IZWxwZXJzLmNhcGl0YWxpemUoZmlyc3ROYW1lLnRvTG93ZXJDYXNlKCkpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBBZGQgY2xhc3MgdG8gYm9keSwgdXNlZCBieSBjc3MgdG8gc2hvdy9oaWRlIGJsb2Nrc1xuXHQvLyB0aGF0IGRlcGVuZCBvbiBzdXBwb3J0IHVzZXIgYmVpbmcgYXV0aGVudGljYXRlZFxuXHRTdXBwb3J0LkF1dGhlbnRpY2F0ZWRCbG9ja3MgPSB7XG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgc3VwcG9ydEF1dGhlbnRpY2F0ZWRDbGFzcyA9IChTdXBwb3J0LkhlbHBlcnMuaXNBdXRoZW50aWNhdGVkKCkpID8gJ3N1cHBvcnQtbG9nZ2VkLWluJyA6ICdzdXBwb3J0LWxvZ2dlZC1vdXQnO1xuXHRcdFx0JCgnYm9keScpLmFkZENsYXNzKHN1cHBvcnRBdXRoZW50aWNhdGVkQ2xhc3MpO1xuXHRcdH1cblx0fTtcblxuXHRTdXBwb3J0Lklzc3VlcyA9IHtcblxuXHRcdHRhYmxlUm93c1NlbGVjdG9yOiAnLmpzLXN1cHBvcnQtaXNzdWVzLXJvd3MnLFxuXHRcdHNob3dNb3JlU2VsZWN0b3I6ICcuanMtc3VwcG9ydC1pc3N1ZXMtc2hvdy1tb3JlJyxcblx0XHRpc3N1ZVRhYmxlV3JhcHBlclNlbGVjdG9yOiAnLmpzLWlzc3VlLXRhYmxlLXdyYXBwZXInLFxuXHRcdGhpZGRlbkNsYXNzOiAnaGlkZGVuJyxcblx0XHRzaG93QmF0Y2hRdHk6IDEwLFxuXHRcdC8vIHN0YXRlZnVsIHNlbGVjdG9ycyBhbmQgY2xhc3Nlc1xuXHRcdGxvYWRpbmdJc3N1ZXNDb250YWluZXJTZWxlY3RvcjogJy5qcy1sb2FkaW5nLWlzc3Vlcy1jb250YWluZXInLFxuXHRcdG5vSXNzdWVzQ29udGFpbmVyU2VsZWN0b3I6ICcuanMtbm8taXNzdWVzLWNvbnRhaW5lcicsXG5cdFx0aGFzSXNzdWVzQ29udGFpbmVyU2VsZWN0b3I6ICcuanMtaXNzdWVzLWNvbnRhaW5lcicsXG5cdFx0bG9hZGluZ0ZhaWxlZElzc3Vlc0NvbnRhaW5lclNlbGVjdG9yOiAnLmpzLWZhaWxlZC1sb2FkaW5nLWlzc3Vlcy1jb250YWluZXInLFxuXHRcdGhpZGVPbkluaXRDbGFzczogJ3N1cHBvcnQtaGlkZS13aGlsZS1sb2FkaW5nJyxcblxuXHRcdGdldE1vZHVsZVN0YXRlQ29udGFpbmVyU2VsZWN0b3JzOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGxvYWQ6IFN1cHBvcnQuSXNzdWVzLmxvYWRpbmdJc3N1ZXNDb250YWluZXJTZWxlY3Rvcixcblx0XHRcdFx0aGFzSXNzdWVzOiBTdXBwb3J0Lklzc3Vlcy5oYXNJc3N1ZXNDb250YWluZXJTZWxlY3Rvcixcblx0XHRcdFx0bm9Jc3N1ZXM6IFN1cHBvcnQuSXNzdWVzLm5vSXNzdWVzQ29udGFpbmVyU2VsZWN0b3IsXG5cdFx0XHRcdGZhaWxlZDogU3VwcG9ydC5Jc3N1ZXMubG9hZGluZ0ZhaWxlZElzc3Vlc0NvbnRhaW5lclNlbGVjdG9yXG5cdFx0XHR9O1xuXHRcdH0sXG5cblx0XHRsb2FkVmlhVXJsOiBmdW5jdGlvbih1cmwpIHtcblxuXHRcdFx0U3VwcG9ydC5Jc3N1ZXMuYWN0aW9ucy5zaG93U3RhdGVDb250YWluZXIoJ2xvYWQnKTtcblxuXHRcdFx0JC5nZXRKU09OKHVybCwgZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRpZiAodHlwZW9mIGRhdGEuQ2FzZXMgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdFx0dmFyIGlzc3VlcyA9ICQubWFwKGRhdGEuQ2FzZXMsIFN1cHBvcnQuSXNzdWVzLm1hcFRvSXNzdWVGb3JtYXQpXG5cdFx0XHRcdFx0XHQvLyBzb3J0cyBieSBtb3N0IHJlY2VudCwgZGVzY2VuZGluZ1xuXHRcdFx0XHRcdFx0LnNvcnQoZnVuY3Rpb24oYSwgYikge1xuXHRcdFx0XHRcdFx0XHRpZiAoYS5sYXN0VXBkYXRlZFJhd0RhdGUgJiZcblx0XHRcdFx0XHRcdFx0XHRiLmxhc3RVcGRhdGVkUmF3RGF0ZSAmJlxuXHRcdFx0XHRcdFx0XHRcdGEubGFzdFVwZGF0ZWRSYXdEYXRlID4gYi5sYXN0VXBkYXRlZFJhd0RhdGUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiAtMTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdGlmIChhLmxhc3RVcGRhdGVkUmF3RGF0ZSAmJlxuXHRcdFx0XHRcdFx0XHRcdGIubGFzdFVwZGF0ZWRSYXdEYXRlICYmXG5cdFx0XHRcdFx0XHRcdFx0YS5sYXN0VXBkYXRlZFJhd0RhdGUgPCBiLmxhc3RVcGRhdGVkUmF3RGF0ZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQvLyBvbmx5IGtlZXAgMjAgaXNzdWVzLCBhZnRlciBzb3J0aW5nXG5cdFx0XHRcdFx0XHQuc2xpY2UoMCwgMjApO1xuXG5cdFx0XHRcdFx0U3VwcG9ydC5Jc3N1ZXMuYWN0aW9ucy5yZW1vdmVBbGxJc3N1ZXMoKTtcblx0XHRcdFx0XHRTdXBwb3J0Lklzc3Vlcy5sb2FkSXNzdWVzKGlzc3Vlcyk7XG5cdFx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIGRhdGEuZXJyb3JDb2RlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRTdXBwb3J0LkhlbHBlcnMuYWNjb3VudEVycm9yKCdpc3N1ZScsIGRhdGEuZXJyb3JDb2RlKTtcblx0XHRcdFx0XHRTdXBwb3J0Lklzc3Vlcy5hY3Rpb25zLnNob3dTdGF0ZUNvbnRhaW5lcigpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LmZhaWwoZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRTdXBwb3J0LkhlbHBlcnMuYWNjb3VudEVycm9yKCdpc3N1ZScsICdERUZBVUxUX0VSUk9SX01FU1NBR0UnKTtcblx0XHRcdFx0U3VwcG9ydC5Jc3N1ZXMuYWN0aW9ucy5zaG93U3RhdGVDb250YWluZXIoKTtcblx0XHRcdH0pXG5cdFx0XHQuYWx3YXlzKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRTdXBwb3J0LkNvbnRyb2xzLmFjdGlvbnMuZmluaXNoZWRMb2FkaW5nKCk7XG5cdFx0XHR9KTs7XG5cdFx0fSxcblxuXHRcdC8vIHRha2VzIGZvcm1hdCBmcm9tIGpzb24gYW5kIG1hcHMgdG8gZm9ybWF0IHVzZWQgaW50ZXJuYWxseVxuXHRcdC8vIGNhbiBwZXJmb3JtIGFueSBvdGhlciBjbGVhbiB1cCBhcyB3ZWxsXG5cdFx0bWFwVG9Jc3N1ZUZvcm1hdDogZnVuY3Rpb24oaXNzdWUpIHtcblxuXHRcdFx0dmFyIGZ1bGxOYW1lID0gU3VwcG9ydC5IZWxwZXJzLm1ha2VGdWxsTmFtZShpc3N1ZS5Db250YWN0Rmlyc3ROYW1lLCBpc3N1ZS5Db250YWN0TGFzdE5hbWUpO1xuXG5cdFx0XHQvLyBsZWZ0UGFkIHdpdGggd2l0aCBleHRyYSAnMCcgaWYgcmVxdWlyZWRcblx0XHRcdHZhciBwYWQgPSBTdXBwb3J0LkhlbHBlcnMucGFkVG9Ud29EaWdpdHM7XG5cblx0XHRcdC8vIHByb3ZpZGVzIHJhdyBqcyBEYXRlIG9iamVjdFxuXHRcdFx0dmFyIHJhd0xhc3RVcGRhdGVkID0gU3VwcG9ydC5IZWxwZXJzLnBhcnNlU3VwcG9ydExvbmdEYXRlKGlzc3VlLkxhc3RNb2RpZmllZERhdGUpO1xuXHRcdFx0dmFyIHJhd0NyZWF0ZWQgPSBTdXBwb3J0LkhlbHBlcnMucGFyc2VTdXBwb3J0TG9uZ0RhdGUoaXNzdWUuQ3JlYXRlZERhdGUpO1xuXHRcdFx0dmFyIG1vbnRocz1bJ0phbicsJ0ZlYicsJ01hcicsJ0FwcicsJ01heScsJ0p1bicsJ0p1bCcsJ0F1ZycsJ1NlcCcsJ09jdCcsJ05vdicsJ0RlYyddO1xuXHRcdFx0XG5cdFx0XHQvLyBcIkxhc3QgVXBkYXRlZFwiIG91dHB1dHRlZCBmb3JtYXQ6IE1NL0REL1lZWVkgSEg6TU1cblx0XHRcdC8qXG5cdFx0XHR2YXIgZm9ybWF0dGVkTGFzdFVwZGF0ZWQgPSBwYWQocmF3TGFzdFVwZGF0ZWQuZ2V0TW9udGgoKSArIDEpIC8vIGdldE1vbnRoKCkgcmV0dXJucyBhIDAtMTEgcmFuZ2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0KyBcIi9cIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQrIHBhZChyYXdMYXN0VXBkYXRlZC5nZXREYXRlKCkpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCsgXCIvXCJcblx0XHRcdFx0XHRcdFx0XHRcdFx0KyByYXdMYXN0VXBkYXRlZC5nZXRGdWxsWWVhcigpO1xuXG5cdFx0XHR2YXIgZm9ybWF0dGVkQ3JlYXRlZCA9IHBhZChyYXdDcmVhdGVkLmdldE1vbnRoKCkgKyAxKSAvLyBnZXRNb250aCgpIHJldHVybnMgYSAwLTExIHJhbmdlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCsgXCIvXCJcblx0XHRcdFx0XHRcdFx0XHRcdFx0KyBwYWQocmF3Q3JlYXRlZC5nZXREYXRlKCkpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCsgXCIvXCJcblx0XHRcdFx0XHRcdFx0XHRcdFx0KyByYXdDcmVhdGVkLmdldEZ1bGxZZWFyKCk7XG5cdFx0XHQqL1xuXHRcdFx0XG5cdFx0XHRcblx0XHRcdC8vIFwiTGFzdCBVcGRhdGVkXCIgb3V0cHV0dGVkIGZvcm1hdDogTU0vREQvWVlZWSBISDpNTVxuXHRcdFx0dmFyIGZvcm1hdHRlZExhc3RVcGRhdGVkID0gcGFkKHJhd0xhc3RVcGRhdGVkLmdldERhdGUoKSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0KyBcIi1cIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQrIHBhZChtb250aHNbcmF3TGFzdFVwZGF0ZWQuZ2V0TW9udGgoKV0pIFxuXHRcdFx0XHRcdFx0XHRcdFx0XHQrIFwiLVwiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCsgcmF3TGFzdFVwZGF0ZWQuZ2V0RnVsbFllYXIoKTtcblxuXHRcdFx0dmFyIGZvcm1hdHRlZENyZWF0ZWQgPSBwYWQocmF3Q3JlYXRlZC5nZXREYXRlKCkpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCsgXCItXCJcblx0XHRcdFx0XHRcdFx0XHRcdFx0KyBwYWQobW9udGhzW3Jhd0NyZWF0ZWQuZ2V0TW9udGgoKV0pXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCsgXCItXCJcblx0XHRcdFx0XHRcdFx0XHRcdFx0KyByYXdDcmVhdGVkLmdldEZ1bGxZZWFyKCk7XG5cdFx0XHRcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGlkOiBpc3N1ZS5JZCxcblx0XHRcdFx0Y2FzZU51bWJlcjogaXNzdWUuQ2FzZU51bWJlcixcblx0XHRcdFx0c3RhdHVzOiBpc3N1ZS5TdGF0dXMsXG5cdFx0XHRcdHByb2R1Y3Q6IGlzc3VlLlByb2R1Y3ROYW1lLFxuXHRcdFx0XHRjcmVhdGVkRGF0ZTogZm9ybWF0dGVkQ3JlYXRlZCxcblx0XHRcdFx0bGFzdFVwZGF0ZWRPcmlnaW5hbERhdGU6IGlzc3VlLkxhc3RNb2RpZmllZERhdGUsXG5cdFx0XHRcdGxhc3RVcGRhdGVkUmF3RGF0ZTogcmF3TGFzdFVwZGF0ZWQsXG5cdFx0XHRcdGxhc3RVcGRhdGVkRm9ybWF0dGVkRGF0ZTogZm9ybWF0dGVkTGFzdFVwZGF0ZWQsXG5cdFx0XHRcdHN1bW1hcnk6IGlzc3VlLlN1YmplY3QsXG5cdFx0XHRcdHN1Ym1pdHRlcjogZnVsbE5hbWVcblx0XHRcdH07XG5cdFx0fSxcblxuXHRcdGxvYWRJc3N1ZXM6IGZ1bmN0aW9uKGlzc3Vlcykge1xuXHRcdFx0aWYgKGlzc3Vlcy5sZW5ndGgpIHtcblx0XHRcdFx0U3VwcG9ydC5Jc3N1ZXMuYWN0aW9ucy5hZGRJc3N1ZXMoaXNzdWVzKTtcblx0XHRcdFx0U3VwcG9ydC5Jc3N1ZXMuYWN0aW9ucy5zaG93U3RhdGVDb250YWluZXIoJ2hhc0lzc3VlcycpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0U3VwcG9ydC5Jc3N1ZXMuYWN0aW9ucy5zaG93U3RhdGVDb250YWluZXIoJ25vSXNzdWVzJyk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdGxvYWRTZWxlY3RlZElzc3VlOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBtYXRjaElkID0gJChjb250cmFjdFNlbGVjdG9yKS5maW5kKCc6c2VsZWN0ZWQnKS5kYXRhKCdjb250cmFjdC1pZCcpIHx8IFwiXCI7XG5cdFx0XHQvLyBMb2FkIGxvY2FsIHRlc3QgZGF0YSAgb3IgZ2V0IHZpYSBhamF4XG5cdFx0XHRpZiAodHlwZW9mIGJtY01ldGEgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBibWNNZXRhLmNkeExvY2FsICE9PSAndW5kZWZpbmVkJyAmJiBibWNNZXRhLmNkeExvY2FsKSB7XG5cdFx0XHRcdHRoaXMubG9hZFZpYVVybCgnLi90ZXN0LycgKyBtYXRjaElkICsgJy5qc29uJyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLmxvYWRWaWFVcmwoJy90ZW1wbGF0ZXMvUmVzdEdldFN1cHBvcnRPcGVuSXNzdWVzP2NvbnRyYWN0SUQ9JyArIG1hdGNoSWQpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRhY3Rpb25zOiB7XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogQWRkcyBhbiBhcnJheSBvZiBpc3N1ZSBvYmplY3RzXG5cdFx0XHQgKiBAcGFyYW0ge2FycmF5fSBpc3N1ZXMgYXJyYXkgb2YgaXNzdWVzIGluIHRoZSBmb3JtYXQgc3BlY2lmaWVkIHdpdGhpbiBgYWRkSXNzdWVgXG5cdFx0XHQgKi9cblx0XHRcdGFkZElzc3VlczogZnVuY3Rpb24oaXNzdWVzKSB7XG5cdFx0XHRcdC8vIHNlZSBTdXBwb3J0Lklzc3Vlcy5hY3Rpb25zLmFkZElzc3VlIGZvciBleHBlY3RlZCBpc3N1ZSBmb3JtYXRcblx0XHRcdFx0JC5lYWNoKGlzc3VlcywgZnVuY3Rpb24oaSwgaXNzdWUpIHtcblx0XHRcdFx0XHRTdXBwb3J0Lklzc3Vlcy5hY3Rpb25zLmFkZElzc3VlKGlzc3VlKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9LFxuXG5cdFx0XHRhZGRJc3N1ZTogZnVuY3Rpb24oaXNzdWUpIHtcblxuXHRcdFx0XHQvKipcblx0XHRcdFx0ICogb3V0cHV0IGZvcm1hdDpcblx0XHRcdFx0ICpcblx0XHRcdFx0ICogIHtcblx0XHRcdFx0ICogICAgICBpZDogbnVtYmVyLFxuXHRcdFx0XHQgKlx0XHRzdW1tYXJ5OiBzdHJpbmcsXG5cdFx0XHRcdCAqICAgICAgcHJvZHVjdDogc3RyaW5nLFxuXHRcdFx0XHQgKiAgICAgIGNyZWF0ZWREYXRlOiBzdHJpbmcsXG5cdFx0XHRcdCAqICAgICAgbGFzdFVwZGF0ZWQ6IHN0cmluZyxcblx0XHRcdFx0ICogICAgICBzdGF0dXM6IHN0cmluZyxcblx0XHRcdFx0ICpcdFx0c3VibWl0dGVyOiBzdHJpbmdcblx0XHRcdFx0ICogXHR9XG5cdFx0XHRcdCAqL1xuXG5cdFx0XHRcdC8vIHB1bGwgbmVlZGVkIGZpZWxkcyBmcm9tIGlzc3VlIGZvciBvdXRwdXQgZm9ybWF0XG5cdFx0XHRcdHZhciBpc3N1ZU91dHB1dCA9IHtcblx0XHRcdFx0XHRpZDogaXNzdWUuY2FzZU51bWJlcixcblx0XHRcdFx0XHRzdW1tYXJ5OiBpc3N1ZS5zdW1tYXJ5LFxuXHRcdFx0XHRcdHByb2R1Y3Q6IGlzc3VlLnByb2R1Y3QsXG5cdFx0XHRcdFx0Y3JlYXRlZERhdGU6IGlzc3VlLmNyZWF0ZWREYXRlLFxuXHRcdFx0XHRcdGxhc3RVcGRhdGVkOiBpc3N1ZS5sYXN0VXBkYXRlZEZvcm1hdHRlZERhdGUsXG5cdFx0XHRcdFx0c3RhdHVzOiBpc3N1ZS5zdGF0dXMsXG5cdFx0XHRcdFx0c3VibWl0dGVyOiBpc3N1ZS5zdWJtaXR0ZXJcblx0XHRcdFx0fTtcblxuXHRcdFx0XHQvLyBjZWxsIGh0bWwgbWFya3VwIGNvbnRhaW5lclxuXHRcdFx0XHR2YXIgY2VsbHMgPSBbXTtcblxuXHRcdFx0XHRmb3IgKGtleSBpbiBpc3N1ZU91dHB1dCkge1xuXHRcdFx0XHRcdC8vIElEIG5lZWRzIHRvIGJlIGxpbmtlZCB0byB0aGUgdGlja2V0XG5cdFx0XHRcdFx0aWYgKGtleSA9PT0gJ2lkJykge1xuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBibWNNZXRhICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgYm1jTWV0YS5zdXBwb3J0ICE9PSAndW5kZWZpbmVkJykge1xuXG5cdFx0XHRcdFx0XHRcdHN1cHBvcnRFbnYgPSAodHlwZW9mIGJtY01ldGEuc3VwcG9ydC5pc3N1ZUVudmlyb25tZW50ICE9PSAndW5kZWZpbmVkJykgPyBibWNNZXRhLnN1cHBvcnQuaXNzdWVFbnZpcm9ubWVudCA6IFwiXCI7XG5cdFx0XHRcdFx0XHRcdHN1cHBvcnRQYXRoID0gKHR5cGVvZiBibWNNZXRhLnN1cHBvcnQuaXNzdWVQYXRoICE9PSAndW5kZWZpbmVkJykgPyBibWNNZXRhLnN1cHBvcnQuaXNzdWVQYXRoIDogXCJcIjtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Y2VsbHMucHVzaCgnPHRkPjxhIGhyZWY9XCInICsgU3VwcG9ydC5Jc3N1ZXMuYnVpbGRTdXBwb3J0SXNzdWVVcmwoc3VwcG9ydEVudiwgc3VwcG9ydFBhdGgsIGlzc3VlLmlkKSArICdcIj4nICsgaXNzdWVPdXRwdXRba2V5XSArICc8L2E+PC90ZD4nKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y2VsbHMucHVzaCgnPHRkPicgKyBpc3N1ZU91dHB1dFtrZXldICsgJzwvdGQ+Jyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0dmFyIHJvdyA9ICc8dHIgZGF0YS1pc3N1ZS1pZD1cIicgKyBpc3N1ZU91dHB1dC5pZCArICdcIj4nICsgY2VsbHMuam9pbignJykgKyAnPC90cj4nO1xuXHRcdFx0XHR2YXIgcm93c0NvbnRhaW5lciA9ICQoU3VwcG9ydC5Jc3N1ZXMuaXNzdWVUYWJsZVdyYXBwZXJTZWxlY3RvcikuZmluZCgndGFibGUgdGJvZHknKTtcblx0XHRcdFx0JChyb3dzQ29udGFpbmVyKS5hcHBlbmQocm93KTtcblx0XHRcdH0sXG5cblx0XHRcdC8qKlxuXHRcdFx0ICogc3RhdGUgaXMgYmFzZWQgb24gdGhlIGtleSBwcm92aWRlZCBieSB0aGUgYXJyYXkgcmV0dXJuZWQgZnJvbSBnZXRNb2R1bGVTdGF0ZUNvbnRhaW5lclNlbGVjdG9yc1xuXHRcdFx0ICovXG5cdFx0XHRzaG93U3RhdGVDb250YWluZXI6IGZ1bmN0aW9uKHNob3dTdGF0ZSkge1xuXG5cdFx0XHRcdHZhciBzdGF0ZXMgPSBTdXBwb3J0Lklzc3Vlcy5nZXRNb2R1bGVTdGF0ZUNvbnRhaW5lclNlbGVjdG9ycygpO1xuXG5cdFx0XHRcdGlmICh0eXBlb2Ygc3RhdGVzW3Nob3dTdGF0ZV0gIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdFx0JChzdGF0ZXNbc2hvd1N0YXRlXSkuZmFkZUluKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBoaWRlIGV4aXN0aW5nIHN0YXRlc1xuXHRcdFx0XHRmb3IgKHN0YXRlIGluIHN0YXRlcykge1xuXHRcdFx0XHRcdGlmIChzdGF0ZSAhPT0gc2hvd1N0YXRlKSB7XG5cdFx0XHRcdFx0XHQkKHN0YXRlc1tzdGF0ZV0pLmhpZGUoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdHJlbW92ZUFsbElzc3VlczogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciByb3dzID0gJChTdXBwb3J0Lklzc3Vlcy5pc3N1ZVRhYmxlV3JhcHBlclNlbGVjdG9yKS5maW5kKCd0YWJsZSB0Ym9keSB0cicpO1xuXHRcdFx0XHRyb3dzLnJlbW92ZSgpO1xuXHRcdFx0fSxcblxuXHRcdFx0c2hvd0lzc3VlczogZnVuY3Rpb24oYW1vdW50KSB7XG5cdFx0XHRcdHZhciBoaWRkZW5Jc3N1ZXMgPSAkKFN1cHBvcnQuSXNzdWVzLnRhYmxlUm93c1NlbGVjdG9yKS5maW5kKCd0ci5oaWRkZW4nKTtcblx0XHRcdFx0dmFyIGNhcHBlZCA9ICQoaGlkZGVuSXNzdWVzKS5zbGljZSgwLCBTdXBwb3J0Lklzc3Vlcy5zaG93QmF0Y2hRdHkpO1xuXHRcdFx0XHR2YXIgcmVtYWluaW5nID0gaGlkZGVuSXNzdWVzLmxlbmd0aCAtIGNhcHBlZC5sZW5ndGg7XG5cblx0XHRcdFx0aWYgKGNhcHBlZC5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0U3VwcG9ydC5Jc3N1ZXMuYWN0aW9ucy5zaG93KGNhcHBlZCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0U3VwcG9ydC5Jc3N1ZXMuYWN0aW9ucy52aWV3QWxsKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBTaG93ZWQgZmluYWwgYmF0Y2hcblx0XHRcdFx0aWYgKHJlbWFpbmluZyA8PSBTdXBwb3J0Lklzc3Vlcy5zaG93QmF0Y2hRdHkpIHtcblx0XHRcdFx0XHRTdXBwb3J0Lklzc3Vlcy5hY3Rpb25zLmFsbFNob3duKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRzaG93OiBmdW5jdGlvbihlbGVtZW50cykge1xuXHRcdFx0XHQkKGVsZW1lbnRzKS5yZW1vdmVDbGFzcyhTdXBwb3J0Lklzc3Vlcy5oaWRkZW5DbGFzcyk7XG5cdFx0XHR9LFxuXHRcdFx0aGlkZTogZnVuY3Rpb24oZWxlbWVudHMpIHtcblx0XHRcdFx0JChlbGVtZW50cykuYWRkQ2xhc3MoU3VwcG9ydC5Jc3N1ZXMuaGlkZGVuQ2xhc3MpO1xuXHRcdFx0fSxcblx0XHRcdGFsbFNob3duOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyIHNob3dNb3JlID0gJChTdXBwb3J0Lklzc3Vlcy5zaG93TW9yZVNlbGVjdG9yKTtcblx0XHRcdFx0dmFyIG5ld0xhYmVsID0gc2hvd01vcmUuZGF0YSgndmlldy1hbGwtbGFiZWwnKTtcblx0XHRcdFx0c2hvd01vcmUuaHRtbChuZXdMYWJlbCk7XG5cdFx0XHR9LFxuXHRcdFx0dmlld0FsbDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciB1cmwgPSAkKFN1cHBvcnQuSXNzdWVzLnNob3dNb3JlU2VsZWN0b3IpLmRhdGEoJ3ZpZXctYWxsLXVybCcpO1xuXHRcdFx0XHRpZiAodXJsKSB7XG5cdFx0XHRcdFx0ZG9jdW1lbnQubG9jYXRpb24gPSB1cmw7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdGZpbmlzaGVkTG9hZGluZzogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQoJy5qcy1hY2NvdW50LWRldGFpbHMtbG9hZGluZycpLmhpZGUoKTtcblx0XHRcdFx0JCgnLnN1cHBvcnQtbm8taXNzdWVzJykuaGlkZSgpLnJlbW92ZUNsYXNzKCdzdXBwb3J0LWhpZGUtd2hpbGUtbG9hZGluZycpO1xuXHRcdFx0XHQkKCcuYWN0aW9uLWRldGFpbHMnKS5yZW1vdmVDbGFzcygnc3VwcG9ydC1oaWRlLXdoaWxlLWxvYWRpbmcnKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0YnVpbGRTdXBwb3J0SXNzdWVVcmw6IGZ1bmN0aW9uKHN1cHBvcnRFbnYsIHN1cHBvcnRQYXRoLCBpc3N1ZUlEKSB7XG5cdFx0XHRyZXR1cm4gc3VwcG9ydEVudiArIHN1cHBvcnRQYXRoICsgaXNzdWVJRDtcblx0XHR9XG5cdH07XG5cblx0U3VwcG9ydC5Db250cm9scyA9IHtcblxuXHRcdGFjdGlvbnM6IHtcblx0XHRcdGZpbmlzaGVkTG9hZGluZzogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQoJy5qcy1hY2NvdW50LWRldGFpbHMtbG9hZGluZycpLmhpZGUoKTtcblx0XHRcdFx0JCgnLnN1cHBvcnQtbm8taXNzdWVzJykuaGlkZSgpLnJlbW92ZUNsYXNzKCdzdXBwb3J0LWhpZGUtd2hpbGUtbG9hZGluZycpO1xuXHRcdFx0XHQkKCcuYWN0aW9uLWRldGFpbHMnKS5yZW1vdmVDbGFzcygnc3VwcG9ydC1oaWRlLXdoaWxlLWxvYWRpbmcnKTtcblx0XHRcdH0sXG5cblx0XHRcdHJlc2V0TG9hZEFjY291bnRFcnJvcjogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQoYWNjb3VudEVycm9yKS5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdGlzc3VlU2hvd01vcmU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0JChTdXBwb3J0Lklzc3Vlcy5zaG93TW9yZVNlbGVjdG9yKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0U3VwcG9ydC5Jc3N1ZXMuYWN0aW9ucy5zaG93SXNzdWVzKFN1cHBvcnQuSXNzdWVzLnNob3dCYXRjaFF0eSk7XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0bG9hZERhdGE6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gTG9hZCBsb2NhbCB0ZXN0IGRhdGEgb3IgZ2V0IHZpYSBhamF4XG5cdFx0XHRpZiAodHlwZW9mIGJtY01ldGEgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBibWNNZXRhLmNkeExvY2FsICE9PSAndW5kZWZpbmVkJyAmJiBibWNNZXRhLmNkeExvY2FsKSB7XG5cdFx0XHRcdFN1cHBvcnQuSXNzdWVzLmxvYWRWaWFVcmwoJy4vdGVzdC9pc3N1ZXMuanNvbicpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0U3VwcG9ydC5Jc3N1ZXMubG9hZFZpYVVybCgnL2Jpbi9zdXBwb3J0Y2FzZXMnKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0XHQvLyBQcmV2ZW50IGluaXQgaWYgbm90IGxvZ2dlZCBpbiBvciBub3Qgb24gbGFuZGluZyBwYWdlXG5cdFx0XHRpZiAoIVN1cHBvcnQuSGVscGVycy5pc0F1dGhlbnRpY2F0ZWQoKSB8fCAhU3VwcG9ydC5IZWxwZXJzLmlzT25TdXBwb3J0TGFuZGluZ1BhZ2UoKSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHR0aGlzLmlzc3VlU2hvd01vcmUoKTtcblx0XHRcdHRoaXMubG9hZERhdGEoKTtcblx0XHR9XG5cblx0fTtcblxuXHRTdXBwb3J0LkFsZXJ0cyA9IHtcblxuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xuXG5cdFx0XHQvLyBsb2NhbCB2YXJzXG5cdFx0XHR2YXIgZmluaXNoZWRMb2FkaW5nLFxuXHRcdFx0XHRtZXNzYWdlc1VybDtcblxuXHRcdFx0Ly8gT2JqZWN0c1xuXHRcdFx0dGhpcy5kaWFsb2cgPSAkKFwiI2NvbmZpcm1cIik7XG5cdFx0XHR0aGlzLnRyaWdnZXIgPSAkKFwiLmpzLWZhbmN5RGlhbG9nXCIpO1xuXG5cdFx0XHQvLyBBY3Rpb25zXG5cdFx0XHR0aGlzLmNvbmZpcm1CdXR0b24gPSBcIkNsb3NlXCI7XG5cdFx0XHR0aGlzLmNvbmZpcm1DaGVja2JveCA9IFwiRG9uXFwndCBzaG93IHRoaXMgYWdhaW5cIjtcblxuXHRcdFx0Ly8gY2FsbGJhY2sgdG8gaGFuZGxlIG1lc3NhZ2VzLCByZWdhcmRsZXNzIG9mIHNvdXJjZVxuXHRcdFx0Ly8gaGFuZGxlcyBjYXNlIGluIHRoZSBzaXR1YXRpb24gd2hlcmUgdGhlcmUgYXJlIG5vIG1lc3NhZ2VzXG5cdFx0XHQvLyBvciBtZXNzYWdlcyBkYXRhIGlzIGZhbHNleVxuXHRcdFx0ZmluaXNoZWRMb2FkaW5nID0gZnVuY3Rpb24obWVzc2FnZXMpIHtcblxuXHRcdFx0XHQvLyBoYXZlIG1lc3NhZ2VzXG5cdFx0XHRcdGlmIChtZXNzYWdlcyAmJiBtZXNzYWdlcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0Ly8gc2V0cyBnbG9iYWwgYWxlcnRNZXNzYWdlc1xuXHRcdFx0XHRcdGFsZXJ0TWVzc2FnZXMgPSBtZXNzYWdlcztcblxuXHRcdFx0XHRcdC8vIEFsZXJ0IGJ1dHRvblxuXHRcdFx0XHRcdHRoaXMuYWxlcnRCdXR0b24oKTtcblx0XHRcdFx0XHQvLyBDaGVjayBjb29raWVzXG5cdFx0XHRcdFx0dGhpcy5jaGVja0Nvb2tpZXModGhpcy5tZXNzYWdlcyk7XG5cdFx0XHRcdC8vIGRvbid0IGhhdmUgbWVzc2FnZXNcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyBpbiBhbnkgY2FzZSB0aGF0IGRvZXNuJ3QgcmVzdWx0IGluIGxvYWRpbmcsIGhpZGUgdGhlIGFsZXJ0cyBidXR0b25cblx0XHRcdFx0XHR0aGlzLnRyaWdnZXIucGFyZW50KCkucmVtb3ZlKCk7XG5cdFx0XHRcdH1cblx0XHRcdC8vIG1haW50YWluIGNvbnRleHRcblx0XHRcdH0uYmluZCh0aGlzKTtcblxuXHRcdFx0Ly8gbG9hZCBtZXNzYWdlcyBkYXRhIGZyb20gYm1jTWV0YSBnbG9iYWwgb2JqZWN0XG5cdFx0XHQvLyB0aGlzLmxvYWRNZXNzYWdlc0Zyb21HbG9iYWwoZmluaXNoZWRMb2FkaW5nKTtcblx0XHRcdC8vXG5cdFx0XHQvLyAtLSBPUiAtLVxuXHRcdFx0Ly9cblx0XHRcdC8vIGxvYWQgbWVzc2FnZXMgZGF0YSBmcm9tIGFqYXhcblx0XHRcdC8vIGxvYWQgcmVsYXRpdmUgVVJMIG9uIGJtYy5jb20gb3IgaGFyZGNvZGUgVVJMIHNvdXJjZSBmb3IgdGVzdGluZyBwdXJwb3Nlc1xuXHRcdFx0aWYgKCBTdXBwb3J0LkhlbHBlcnMuYm1jU3VwcG9ydExvYWRlZCgpICYmIFN1cHBvcnQuSGVscGVycy5ibWNBbGVydHNFbmFibGVkKCkgKXtcblx0XHRcdFx0Ly8gbG9jYWwgZGV2ZWxvcG1lbnQ6XG5cdFx0XHRcdGlmICgodHlwZW9mIGJtY01ldGEuY2R4TG9jYWwgIT09ICd1bmRlZmluZWQnKSAmJiBibWNNZXRhLmNkeExvY2FsKSB7XG5cdFx0XHRcdFx0bWVzc2FnZXNVcmwgPSAndGVzdC9hbGVydE1lc3NhZ2VzLmpzb24nO1xuXHRcdFx0XHQvLyBkZXYvc3RhZ2UvcHJvZDpcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAoKHR5cGVvZiBibWNNZXRhLnN1cHBvcnQuYWxlcnRzVXJsICE9PSAndW5kZWZpbmVkJykgJiYgYm1jTWV0YS5zdXBwb3J0LmFsZXJ0c1VybCkge1xuXHRcdFx0XHRcdFx0bWVzc2FnZXNVcmwgPSBibWNNZXRhLnN1cHBvcnQuYWxlcnRzVXJsO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRtZXNzYWdlc1VybCA9ICcvdGVtcGxhdGVzL1NlcnZpY2VTdXBwb3J0QWxlcnRzSlNPTic7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMubG9hZE1lc3NhZ2VzRnJvbVVybChmaW5pc2hlZExvYWRpbmcsIG1lc3NhZ2VzVXJsKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0Ly8gd2lsbCByZXRyaWV2ZSBtZXNzYWdlcyBieSB0aGUgYm1jTWV0YSBnbG9iYWxcblx0XHQvLyBsb2FkcyBvbiBtb2R1bGUgZ2xvYmFsIHZhciBhbGVydE1lc3NhZ2VzXG5cdFx0bG9hZE1lc3NhZ2VzRnJvbUdsb2JhbDogZnVuY3Rpb24obWVzc2FnZXNIYW5kbGVyKSB7XG5cdFx0XHR2YXIgbWVzc2FnZXM7XG5cblx0XHRcdGlmIChTdXBwb3J0LkhlbHBlcnMuYm1jU3VwcG9ydExvYWRlZCgpICYmIHR5cGVvZiBibWNNZXRhLnN1cHBvcnQuYWxlcnRNZXNzYWdlcyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0bWVzc2FnZXMgPSBibWNNZXRhLnN1cHBvcnQuYWxlcnRNZXNzYWdlcztcblx0XHRcdH1cblxuXHRcdFx0aWYgKHR5cGVvZiBtZXNzYWdlc0hhbmRsZXIgPT09ICdmdW5jdGlvbicpIG1lc3NhZ2VzSGFuZGxlcihtZXNzYWdlcyk7XG5cdFx0fSxcblxuXHRcdC8vIGFsbG93cyBmb3IgYWpheGluZyBpbiBtZXNzYWdlIGRhdGFcblx0XHRsb2FkTWVzc2FnZXNGcm9tVXJsOiBmdW5jdGlvbihtZXNzYWdlc0hhbmRsZXIsIHVybCkge1xuXHRcdFx0JC5hamF4KHVybClcblx0XHRcdFx0LmRvbmUoZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRcdC8vIGJhc2VkIG9uIGV4YW1wbGUganNvbiwgYXNzdW1lIHJlc3BvbnNlIHBheWxvYWQgY29udGFpbnMgZGF0YSBvblxuXHRcdFx0XHRcdC8vIHByb3BlcnR5ICdzdXBwb3J0QWxlcnRNZXNzYWdlcydcblx0XHRcdFx0XHRpZiAodHlwZW9mIG1lc3NhZ2VzSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykgbWVzc2FnZXNIYW5kbGVyKGRhdGEuc3VwcG9ydEFsZXJ0TWVzc2FnZXMpO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQuZmFpbChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRpZiAodHlwZW9mIG1lc3NhZ2VzSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykgbWVzc2FnZXNIYW5kbGVyKG51bGwpO1xuXHRcdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0b3BlbkFsZXJ0OiBmdW5jdGlvbigpIHtcblx0XHRcdHRoaXMuZmFuY3lDb25maWcodGhpcy5tZXNzYWdlcyk7XG5cdFx0fSxcblxuXHRcdGFsZXJ0QnV0dG9uOiBmdW5jdGlvbigpIHtcblx0XHRcdHRoaXMudHJpZ2dlci5vbihcImNsaWNrXCIsICQucHJveHkodGhpcy5vcGVuQWxlcnQsIHRoaXMpKTtcblx0XHR9LFxuXG5cdFx0Y2hlY2tDb29raWVzOiBmdW5jdGlvbihvcHRpb25zKSB7XG5cdFx0XHQvLyBDaGVjayBpZiBjb29raWVzIG1hdGNoIElEc1xuXHRcdFx0dmFyIHNob3dBbGVydCA9IGZhbHNlO1xuXHRcdFx0Zm9yIChpID0gMDsgaSA8IGFsZXJ0TWVzc2FnZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0Ly8gSWYgbm8gY29va2llcyB0aGVuIHNob3cgYWxlcnRcblx0XHRcdFx0aWYgKCQuY29va2llKGFsZXJ0TWVzc2FnZXNbaV0uaWQpID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRzaG93QWxlcnQgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAoc2hvd0FsZXJ0KSB7XG5cdFx0XHRcdHRoaXMub3BlbkFsZXJ0KCk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdGZhbmN5Q29uZmlnOiBmdW5jdGlvbihvcHRpb25zKSB7XG5cdFx0XHQkLmZhbmN5Ym94KHRoaXMuZGlhbG9nLCB7XG5cdFx0XHRcdGF1dG9XaWR0aDogZmFsc2UsXG5cdFx0XHRcdG1pbkhlaWdodDogNDAwLFxuXHRcdFx0XHRtYXhXaWR0aDogNzQ1LFxuXHRcdFx0XHRwYWRkaW5nOiAwLFxuXHRcdFx0XHR0cGw6IHtcblx0XHRcdFx0XHR3cmFwOiAnPGRpdiBjbGFzcz1cImZhbmN5Ym94LXdyYXAgZmFuY3lib3gtZGlhbG9nXCIgdGFiSW5kZXg9XCItMVwiPjxkaXYgY2xhc3M9XCJmYW5jeWJveC1za2luXCI+PGRpdiBjbGFzcz1cImZhbmN5Ym94LW91dGVyXCI+PGRpdiBjbGFzcz1cImZhbmN5Ym94LXRpdGxlXCI+QWxlcnQgTm90aWZpY2F0aW9uczwvZGl2PjxkaXYgY2xhc3M9XCJmYW5jeWJveC1pbm5lclwiPjwvZGl2PjwvZGl2PjwvZGl2PjwvZGl2PicsXG5cdFx0XHRcdFx0ZXJyb3I6ICc8cCBjbGFzcz1cImZhbmN5Ym94LWVycm9yXCI+VGhlIHJlcXVlc3RlZCBjb250ZW50IGNhbm5vdCBiZSBsb2FkZWQuPGJyLz5QbGVhc2UgdHJ5IGFnYWluIGxhdGVyLjwvcD4nXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGhlbHBlcnM6IHtcblx0XHRcdFx0XHRvdmVybGF5OiB7XG5cdFx0XHRcdFx0XHRjbG9zZUNsaWNrOiB0cnVlLCAvLyBpZiB0cnVlLCBmYW5jeUJveCB3aWxsIGJlIGNsb3NlZCB3aGVuIHVzZXIgY2xpY2tzIG9uIHRoZSBvdmVybGF5XG5cdFx0XHRcdFx0XHRzcGVlZE91dDogMjAwLCAvLyBkdXJhdGlvbiBvZiBmYWRlT3V0IGFuaW1hdGlvblxuXHRcdFx0XHRcdFx0c2hvd0Vhcmx5OiB0cnVlLCAvLyBpbmRpY2F0ZXMgaWYgc2hvdWxkIGJlIG9wZW5lZCBpbW1lZGlhdGVseSBvciB3YWl0IHVudGlsIHRoZSBjb250ZW50IGlzIHJlYWR5XG5cdFx0XHRcdFx0XHRjc3M6IHt9LCAvLyBjdXN0b20gQ1NTIHByb3BlcnRpZXNcblx0XHRcdFx0XHRcdGxvY2tlZDogdHJ1ZSAvLyBpZiB0cnVlLCB0aGUgY29udGVudCB3aWxsIGJlIGxvY2tlZCBpbnRvIG92ZXJsYXlcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGJlZm9yZVNob3c6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdC8vIEFkZCBjb250YWluZXJzXG5cdFx0XHRcdFx0dGhpcy5jb250ZW50LmFwcGVuZChcIjxkaXYgY2xhc3M9J21lc3NhZ2VzJz48L2Rpdj48ZGl2IGNsYXNzPSdhY3Rpb24nPjwvZGl2PlwiKTtcblx0XHRcdFx0XHQvLyBBZGQgbWVzc2FnZXNcblx0XHRcdFx0XHR0aGlzLm1lc3NhZ2VzID0gdGhpcy5jb250ZW50LmZpbmQoXCIubWVzc2FnZXNcIik7XG5cdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGFsZXJ0TWVzc2FnZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdHRoaXMubWVzc2FnZXMuYXBwZW5kKFwiPGgzIGNsYXNzPSd0aXRsZSc+XCIgKyBhbGVydE1lc3NhZ2VzW2ldLnRpdGxlICsgXCI8L2gzPlwiKTtcblx0XHRcdFx0XHRcdHRoaXMubWVzc2FnZXMuYXBwZW5kKFwiPHAgY2xhc3M9J21lc3NhZ2UnPlwiICsgYWxlcnRNZXNzYWdlc1tpXS5tZXNzYWdlICsgXCI8L3A+XCIpO1xuXHRcdFx0XHRcdFx0aWYgKGFsZXJ0TWVzc2FnZXNbaV0ubGluaykge1xuXHRcdFx0XHRcdFx0XHR0aGlzLm1lc3NhZ2VzLmFwcGVuZCgnPHAgY2xhc3M9XCJsaW5rXCI+PGEgaHJlZj1cIicgKyBhbGVydE1lc3NhZ2VzW2ldLnVybCArICdcIj4nICsgYWxlcnRNZXNzYWdlc1tpXS5saW5rICsgJzwvYT48L3A+Jyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8vIEFkZCBtb2JpbGUgYnV0dG9uXG5cdFx0XHRcdFx0dGhpcy5tZXNzYWdlcy5hcHBlbmQoJzxwIHN0eWxlPVwidGV4dC1hbGlnbjpyaWdodFwiPjxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYWN0aW9uLWJ1dHRvblwiIHZhbHVlPVwiJyArIFN1cHBvcnQuQWxlcnRzLmNvbmZpcm1CdXR0b24gKyAnXCIvPjwvcD4nKTtcblx0XHRcdFx0XHQvLyBBZGQgY29udHJvbHNcblx0XHRcdFx0XHR0aGlzLmNvbnRlbnQuZmluZChcIi5hY3Rpb25cIikuYXBwZW5kKCc8aW5wdXQgdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGFjdGlvbi1idXR0b25cIiB2YWx1ZT1cIicgKyBTdXBwb3J0LkFsZXJ0cy5jb25maXJtQnV0dG9uICsgJ1wiLz48bGFiZWwgY2xhc3M9XCJhY3Rpb24tY2hlY2tib3hcIj48aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgLz4nICsgU3VwcG9ydC5BbGVydHMuY29uZmlybUNoZWNrYm94ICsgJzwvbGFiZWw+Jyk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGFmdGVyU2hvdzogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dmFyIGFsZXJ0QiA9IHRoaXMuY29udGVudC5maW5kKFwiLmFjdGlvbi1idXR0b25cIiksXG5cdFx0XHRcdFx0XHRhY3Rpb25CID0gdGhpcy5jb250ZW50LmZpbmQoXCIuYWN0aW9uIC5hY3Rpb24tYnV0dG9uXCIpLFxuXHRcdFx0XHRcdFx0YWxlcnRDID0gdGhpcy5jb250ZW50LmZpbmQoXCIuYWN0aW9uLWNoZWNrYm94IGlucHV0XCIpLFxuXHRcdFx0XHRcdFx0YWxlcnRYID0gJCgnLmZhbmN5Ym94LWRpYWxvZyAuZmFuY3lib3gtY2xvc2UnKTtcblx0XHRcdFx0XHRjbG9zZURpYWxvZyA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0Ly8gQ3JlYXRlIGNvb2tpZSBpZiBjaGVja2JveCBpcyBjaGVja2VkXG5cdFx0XHRcdFx0XHRpZiAoYWxlcnRDLmlzKCc6Y2hlY2tlZCcpKSB7XG5cdFx0XHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBhbGVydE1lc3NhZ2VzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0JC5jb29raWUoYWxlcnRNZXNzYWdlc1tpXS5pZCwgYWxlcnRNZXNzYWdlc1tpXS5pZCwge1xuXHRcdFx0XHRcdFx0XHRcdFx0ZXhwaXJlczogMzY1LFxuXHRcdFx0XHRcdFx0XHRcdFx0cGF0aDogXCIvXCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRkb21haW46IFwiLmJtYy5jb21cIlxuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQkLmZhbmN5Ym94LmNsb3NlKCk7XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHQvLyBDaGVjayBpZiB0ZXh0IG92ZXJmbG93cyBtZXNzYWdlIGNvbnRhaW5lclxuXHRcdFx0XHRcdGlmICh0aGlzLm1lc3NhZ2VzWzBdLnNjcm9sbEhlaWdodCA+IHRoaXMubWVzc2FnZXMuaW5uZXJIZWlnaHQoKSkge1xuXHRcdFx0XHRcdFx0YWN0aW9uQi5wcm9wKFwiZGlzYWJsZWRcIiwgdHJ1ZSk7XG5cdFx0XHRcdFx0XHR0aGlzLm1lc3NhZ2VzLmJpbmQoJ3Njcm9sbCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRpZiAoJCh0aGlzKVswXS5zY3JvbGxIZWlnaHQgLSAkKHRoaXMpLnNjcm9sbFRvcCgpIDw9ICQodGhpcykuaW5uZXJIZWlnaHQoKSkge1xuXHRcdFx0XHRcdFx0XHRcdGFjdGlvbkIucHJvcChcImRpc2FibGVkXCIsIGZhbHNlKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8vIENsb3NlIGRpYWxvZyB3aGVuIGJ1dHRvbnMgYXJlIGNsaWNrZWRcblx0XHRcdFx0XHRhbGVydEIub24oXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGNsb3NlRGlhbG9nKCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0YWxlcnRYLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRjbG9zZURpYWxvZygpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRhZnRlckNsb3NlOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQvLyBSZW1vdmUgZGlhbG9nIGNvbnRlbnRcblx0XHRcdFx0XHR0aGlzLmNvbnRlbnQuaHRtbChcIlwiKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9O1xuXG5cdFN1cHBvcnQuR2V0dGluZ1N0YXJ0ZWRDYXJvdXNlbCA9IHtcblx0XHRpbml0OiBmdW5jdGlvbigpIHtcblx0XHRcdCQoJy5zdXBwb3J0LWdldHRpbmctc3RhcnRlZC10b3BpY3MuY2Fyb3VzZWwgLnRvcGljcycpLm93bENhcm91c2VsKHtcblx0XHRcdFx0aXRlbXM6IDEsXG5cdFx0XHRcdG5hdjogZmFsc2Vcblx0XHRcdH0pO1xuXHRcdH1cblx0fTtcblxuXHRTdXBwb3J0LlRvZ2dsZVNlYXJjaEFyZWFzID0ge1xuXG5cdFx0c2VhcmNoQXJlYXNTZWxlY3RvcjogJy5qcy1zdXBwb3J0LXNlYXJjaC1hcmVhJyxcblx0XHR0b2dnbGVBY3Rpb25TZWxlY3RvcjogJy5qcy1zdXBwb3J0LXNlYXJjaC10b2dnbGUnLFxuXHRcdHRvZ2dsZUFjdGlvbkxhYmVsU2VsZWN0b3I6ICcuanMtc3VwcG9ydC1zZWFyY2gtdG9nZ2xlJyxcblx0XHR0b2dnbGVMYWJlbFRleHQ6IHtcblx0XHRcdGV4cGFuZDogJ01vcmUgUmVzb3VyY2VzJyxcblx0XHRcdGNvbGxhcHNlOiAnQ29sbGFwc2UnXG5cdFx0fSxcblx0XHR0b2dnbGFibGVBcmVhczogbnVsbCxcblx0XHRlbGVtZW50c1Nob3duOiBmYWxzZSxcblx0XHRoaWRlTGFzdFF0eTogNCxcblxuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xuXG5cdFx0XHQvLyBvbmx5IGluaXRpYWxpemUgaWYgLmpzLXN1cHBvcnQtc2VhcmNoLXRvZ2dsZS1leHRyYSBleGlzdHNcblx0XHRcdGlmICgkKCcuanMtc3VwcG9ydC1zZWFyY2gtdG9nZ2xlLWV4dHJhJykubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU0VUVVBcblx0XHRcdHRoaXMuZmluZFRvZ2dsYWJsZUVsZW1lbnRzKCk7XG5cdFx0XHR0aGlzLmFkZEhhbmRsZXJzKCk7XG5cblx0XHRcdC8vIElOSVRJQUwgQUNUSU9OU1xuXHRcdFx0dGhpcy5hY3Rpb25zLmhpZGUodGhpcy5oZWxwZXJzLmhpZGVFbGVtZW50c0luc3RhbnQpO1xuXHRcdFx0dGhpcy5hY3Rpb25zLnVwZGF0ZUxhYmVsKHRoaXMudG9nZ2xlTGFiZWxUZXh0LmV4cGFuZCk7XG5cdFx0fSxcblxuXHRcdGhlbHBlcnM6IHtcblx0XHRcdHNob3dFbGVtZW50c0ZhZGU6IGZ1bmN0aW9uKGVsZW1lbnRzKSB7XG5cdFx0XHRcdHJldHVybiAkKGVsZW1lbnRzKS5mYWRlSW4oKTtcblx0XHRcdH0sXG5cdFx0XHRzaG93RWxlbWVudHNJbnN0YW50OiBmdW5jdGlvbihlbGVtZW50cykge1xuXHRcdFx0XHRyZXR1cm4gJChlbGVtZW50cykuc2hvdygpO1xuXHRcdFx0fSxcblx0XHRcdGhpZGVFbGVtZW50c0ZhZGU6IGZ1bmN0aW9uKGVsZW1lbnRzKSB7XG5cdFx0XHRcdHJldHVybiAkKGVsZW1lbnRzKS5mYWRlT3V0KCk7XG5cdFx0XHR9LFxuXHRcdFx0aGlkZUVsZW1lbnRzSW5zdGFudDogZnVuY3Rpb24oZWxlbWVudHMpIHtcblx0XHRcdFx0cmV0dXJuICQoZWxlbWVudHMpLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0ZmluZFRvZ2dsYWJsZUVsZW1lbnRzOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBzZWFyY2hBcmVhcyA9ICQodGhpcy5zZWFyY2hBcmVhc1NlbGVjdG9yKTtcblx0XHRcdHZhciBzbGljZUZyb20gPSBzZWFyY2hBcmVhcy5sZW5ndGggLSB0aGlzLmhpZGVMYXN0UXR5O1xuXHRcdFx0dmFyIHNsaWNlVG8gPSBzZWFyY2hBcmVhcy5sZW5ndGg7XG5cdFx0XHR0aGlzLnRvZ2dsYWJsZUFyZWFzID0gc2VhcmNoQXJlYXMuc2xpY2Uoc2xpY2VGcm9tLCBzbGljZVRvKTtcblx0XHR9LFxuXG5cdFx0YWN0aW9uczoge1xuXHRcdFx0dG9nZ2xlOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKFN1cHBvcnQuVG9nZ2xlU2VhcmNoQXJlYXMuZWxlbWVudHNTaG93bikge1xuXHRcdFx0XHRcdHRoaXMuaGlkZShTdXBwb3J0LlRvZ2dsZVNlYXJjaEFyZWFzLmhlbHBlcnMuaGlkZUVsZW1lbnRzRmFkZSk7XG5cdFx0XHRcdFx0dGhpcy51cGRhdGVMYWJlbChTdXBwb3J0LlRvZ2dsZVNlYXJjaEFyZWFzLnRvZ2dsZUxhYmVsVGV4dC5leHBhbmQpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuc2hvdyhTdXBwb3J0LlRvZ2dsZVNlYXJjaEFyZWFzLmhlbHBlcnMuc2hvd0VsZW1lbnRzRmFkZSk7XG5cdFx0XHRcdFx0dGhpcy51cGRhdGVMYWJlbChTdXBwb3J0LlRvZ2dsZVNlYXJjaEFyZWFzLnRvZ2dsZUxhYmVsVGV4dC5jb2xsYXBzZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRzaG93OiBmdW5jdGlvbihlbGVtZW50c0hhbmRsZXIpIHtcblx0XHRcdFx0aWYgKHR5cGVvZiBlbGVtZW50c0hhbmRsZXIgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRlbGVtZW50c0hhbmRsZXIoJChTdXBwb3J0LlRvZ2dsZVNlYXJjaEFyZWFzLnRvZ2dsYWJsZUFyZWFzKSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRTdXBwb3J0LlRvZ2dsZVNlYXJjaEFyZWFzLmVsZW1lbnRzU2hvd24gPSB0cnVlO1xuXHRcdFx0fSxcblx0XHRcdGhpZGU6IGZ1bmN0aW9uKGVsZW1lbnRzSGFuZGxlcikge1xuXHRcdFx0XHRpZiAodHlwZW9mIGVsZW1lbnRzSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdGVsZW1lbnRzSGFuZGxlcigkKFN1cHBvcnQuVG9nZ2xlU2VhcmNoQXJlYXMudG9nZ2xhYmxlQXJlYXMpKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdFN1cHBvcnQuVG9nZ2xlU2VhcmNoQXJlYXMuZWxlbWVudHNTaG93biA9IGZhbHNlO1xuXHRcdFx0fSxcblx0XHRcdHVwZGF0ZUxhYmVsOiBmdW5jdGlvbih0ZXh0KSB7XG5cdFx0XHRcdCQoU3VwcG9ydC5Ub2dnbGVTZWFyY2hBcmVhcy50b2dnbGVBY3Rpb25MYWJlbFNlbGVjdG9yKS5odG1sKHRleHQpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblxuXHRcdGFkZEhhbmRsZXJzOiBmdW5jdGlvbigpIHtcblx0XHRcdCQodGhpcy50b2dnbGVBY3Rpb25TZWxlY3Rvcikub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHRoaXMuYWN0aW9ucy50b2dnbGUoKTtcblx0XHRcdH0uYmluZCh0aGlzKSk7XG5cdFx0fVxuXHR9O1xuXG5cdFN1cHBvcnQuTWVudSA9IHtcblxuXHRcdGRlc2t0b3BCcmVha3BvaW50OiA5NjAsXG5cblx0XHQvLyB0b3VjaEhhbmRsZXJzIHJlcXVpcmUgYSBgY2xpY2tgIHRvIHRyaWdnZXIgYSBtZW51XG5cdFx0dG91Y2hIYW5kbGVyczogZnVuY3Rpb24oYWRhcHRlcikge1xuXHRcdFx0dmFyIG1lbnUgPSBhZGFwdGVyLm1lbnU7XG5cdFx0XHQkKG1lbnUuc3ViTWVudVRyaWdnZXJTZWxlY3Rvcikub24oe1xuXHRcdFx0XHQnY2xpY2snOiBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdFx0aWYgKCEkKG1lbnUuc3ViTWVudVNlbGVjdG9yKS5oYXMoJChlLnRhcmdldCkpKSB7XG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHZhciBzdWJNZW51ID0gbWVudS5maW5kTWVudUZyb21UYXJnZXQoZS50YXJnZXQpO1xuXG5cdFx0XHRcdFx0aWYgKHN1Yk1lbnUuaGFzQ2xhc3MobWVudS5leHBhbmRlZENsYXNzKSkge1xuXHRcdFx0XHRcdFx0bWVudS5jb2xsYXBzZU1lbnUoc3ViTWVudSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG1lbnUuY29sbGFwc2VBbGxTdWJNZW51cygpO1xuXHRcdFx0XHRcdFx0bWVudS5leHBhbmRNZW51KHN1Yk1lbnUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdC8vICBub1RvdWNoSGFuZGxlcnMgYXNzdW1lcyBhIG1vdXNlLCBhbmQgdXNlcyBhIGBob3ZlcmAgdG8gdHJpZ2dlciBhIG1lbnVcblx0XHRub1RvdWNoSGFuZGxlcnM6IGZ1bmN0aW9uKGFkYXB0ZXIpIHtcblx0XHRcdHZhciBtZW51ID0gYWRhcHRlci5tZW51O1xuXHRcdFx0JChtZW51LnN1Yk1lbnVUcmlnZ2VyU2VsZWN0b3IpLm9uKHtcblx0XHRcdFx0J21vdXNlZW50ZXInOiBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdFx0bWVudS5jb2xsYXBzZUFsbFN1Yk1lbnVzKCk7XG5cdFx0XHRcdFx0dmFyIHN1Yk1lbnUgPSBtZW51LmZpbmRNZW51RnJvbVRhcmdldChlLnRhcmdldCk7XG5cdFx0XHRcdFx0bWVudS5leHBhbmRNZW51KHN1Yk1lbnUpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHQnbW91c2VsZWF2ZSc6IGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0XHRtZW51LmNvbGxhcHNlQWxsU3ViTWVudXMoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdC8vIFJlZ2lzdGVyIGNsaWNrcyB0aGF0IGhhcHBlbiBvdXRzaWRlIHRoZSBtZW51LCBhbmQgZGlzbWlzcyB0aGUgbWVudVxuXHRcdGNvbGxhcHNlT3V0c2lkZUhhbmRsZXI6IGZ1bmN0aW9uKGFkYXB0ZXIpIHtcblx0XHRcdHZhciBtZW51ID0gYWRhcHRlci5tZW51O1xuXHRcdFx0dmFyIG1lbnVFbGVtZW50ID0gJChtZW51Lm1lbnVFbGVtZW50KTtcblxuXHRcdFx0JCgnYm9keScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0aWYgKCEkKGUudGFyZ2V0KS5wYXJlbnRzKCkuYWRkQmFjaygpLmlzKG1lbnVFbGVtZW50KSkge1xuXHRcdFx0XHRcdG1lbnUuY29sbGFwc2VBbGxTdWJNZW51cygpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0Ly8gYm90aCBgdG91Y2hIYW5kbGVyc2AgYW5kIGBub1RvdWNoSGFuZGxlcnNgIHVzZSB0aGUgc2FtZVxuXHRcdC8vIGVsZW1lbnQgdG8gYXR0YWNoIGhhbmRsZXJzIHRvLCB0aGVyZWZvcmUgY2FuIHVzZSB0aGUgc2FtZVxuXHRcdC8vIGZ1bmN0aW9uIHRvIHJlbW92ZSB0aGUgaGFuZGxlcnNcblx0XHRkZXN0b3J5SGFuZGxlcnM6IGZ1bmN0aW9uKGFkYXB0ZXIpIHtcblx0XHRcdHZhciBtZW51ID0gYWRhcHRlci5tZW51O1xuXHRcdFx0JChtZW51LnN1Yk1lbnVUcmlnZ2VyU2VsZWN0b3IpLm9mZigpO1xuXHRcdH0sXG5cblx0XHRnZXRNZW51OiBmdW5jdGlvbigpIHtcblx0XHRcdC8vIGdlbmVyYXRlIG1lbnUgYmFzZWQgb24gc2VsZWN0b3Jcblx0XHRcdHZhciBtZW51ID0gbWVudWpzLmdlbmVyYXRlTWVudSh7XG5cdFx0XHRcdG1lbnVFbGVtZW50OiAkKCcuc3VwcG9ydC1tZW51Jylcblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gbWVudTtcblx0XHR9LFxuXG5cdFx0Z2V0QWRhcHRlcnM6IGZ1bmN0aW9uKG1lbnUpIHtcblx0XHRcdHZhciBzdXBwb3J0TWVudSA9IHRoaXM7XG5cblx0XHRcdC8vIGNyZWF0ZSBkZXNrdG9wIGFkYXB0ZXJcblx0XHRcdHZhciBkZXNrdG9wQWRhcHRlciA9IG1lbnVBZGFwdGVyLmdlbmVyYXRlTWVudUFkYXB0ZXIobWVudSwge1xuXHRcdFx0XHRoYW5kbGVyczogW3tcblx0XHRcdFx0XHRzZXR1cDogc3VwcG9ydE1lbnUudG91Y2hIYW5kbGVycyxcblx0XHRcdFx0XHRkZXN0cm95OiBzdXBwb3J0TWVudS5kZXN0b3J5SGFuZGxlcnNcblx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdHNldHVwOiBzdXBwb3J0TWVudS5jb2xsYXBzZU91dHNpZGVIYW5kbGVyLFxuXHRcdFx0XHRcdGRlc3Ryb3k6IHN1cHBvcnRNZW51LmRlc3RvcnlIYW5kbGVyc1xuXHRcdFx0XHR9XSxcblx0XHRcdFx0aW5pdDogZnVuY3Rpb24oYWRhcHRlcikge1xuXHRcdFx0XHRcdCQoYWRhcHRlci5tZW51Lm1lbnVFbGVtZW50KS5hZGRDbGFzcygnZGVza3RvcCcpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR0ZWFyZG93bjogZnVuY3Rpb24oYWRhcHRlcikge1xuXHRcdFx0XHRcdCQoYWRhcHRlci5tZW51Lm1lbnVFbGVtZW50KS5yZW1vdmVDbGFzcygnZGVza3RvcCcpO1xuXHRcdFx0XHRcdGFkYXB0ZXIubWVudS5jb2xsYXBzZUFsbFN1Yk1lbnVzKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBjcmVhdGUgbW9iaWxlIGFkYXB0ZXJcblx0XHRcdC8vIG1vYmlsZUFkYXB0ZXIgc3RhcnRpbmcgcG9pbnQgaXMgYSBjb3B5IG9mIGRlc2t0b3AgYWRhcHRlclxuXHRcdFx0dmFyIG1vYmlsZUFkYXB0ZXIgPSBtZW51QWRhcHRlci5nZW5lcmF0ZU1lbnVBZGFwdGVyKG1lbnUsIHtcblx0XHRcdFx0aGFuZGxlcnM6IFt7XG5cdFx0XHRcdFx0c2V0dXA6IHN1cHBvcnRNZW51LnRvdWNoSGFuZGxlcnMsXG5cdFx0XHRcdFx0ZGVzdHJveTogZnVuY3Rpb24oYWRhcHRlcikge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHN1cHBvcnRNZW51LmRlc3RvcnlIYW5kbGVycyhhZGFwdGVyKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1dLCAvLyBhc3N1bWUgbm8gaG92ZXIgaW50ZXJhY3Rpb25zXG5cdFx0XHRcdGluaXQ6IGZ1bmN0aW9uKGFkYXB0ZXIpIHtcblx0XHRcdFx0XHQkKGFkYXB0ZXIubWVudS5tZW51RWxlbWVudCkuYWRkQ2xhc3MoJ21vYmlsZScpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR0ZWFyZG93bjogZnVuY3Rpb24oYWRhcHRlcikge1xuXHRcdFx0XHRcdCQoYWRhcHRlci5tZW51Lm1lbnVFbGVtZW50KS5yZW1vdmVDbGFzcygnbW9iaWxlJyk7XG5cdFx0XHRcdFx0YWRhcHRlci5tZW51LmNvbGxhcHNlQWxsU3ViTWVudXMoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdHZhciBhbGxBZGFwdGVycyA9IHtcblx0XHRcdFx0bW9iaWxlOiBtb2JpbGVBZGFwdGVyLFxuXHRcdFx0XHRkZXNrdG9wOiBkZXNrdG9wQWRhcHRlclxuXHRcdFx0fTtcblx0XHRcdHJldHVybiBhbGxBZGFwdGVycztcblx0XHR9LFxuXG5cdFx0Z2V0QWRhcHRlck1hbmFnZXI6IGZ1bmN0aW9uKG1lbnUsIGFkYXB0ZXJzKSB7XG5cdFx0XHR2YXIgYWRhcHRlck1hbmFnZXIgPSBnZW5lcmF0ZU1lbnVBZGFwdGVyTWFuYWdlcigpO1xuXHRcdFx0cmV0dXJuIGFkYXB0ZXJNYW5hZ2VyO1xuXHRcdH0sXG5cblx0XHRpbml0OiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBtZW51ID0gdGhpcy5nZXRNZW51KCk7XG5cdFx0XHR2YXIgYWRhcHRlcnMgPSB0aGlzLmdldEFkYXB0ZXJzKG1lbnUpO1xuXHRcdFx0dmFyIGFkYXB0ZXJNYW5hZ2VyID0gdGhpcy5nZXRBZGFwdGVyTWFuYWdlcihtZW51LCBhZGFwdGVycyk7XG5cblx0XHRcdHZhciBpc0Rlc2t0b3AgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0Ly8gaW4gY2FzZSBtZWRpYSBxdWVyaWVzIGFyZW4ndCBzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIsIHRoZW4gZGVmYXVsdCB0byB1c2luZyB0aGUgd2lkdGggb2YgdGhlIHdpbmRvd1xuXHRcdFx0XHRyZXR1cm4gTW9kZXJuaXpyLm1xKCcobWluLXdpZHRoOiAnICsgU3VwcG9ydC5NZW51LmRlc2t0b3BCcmVha3BvaW50ICsgJ3B4KScpIHx8ICQod2luZG93KS53aWR0aCgpID49IFN1cHBvcnQuTWVudS5kZXNrdG9wQnJlYWtwb2ludDtcblx0XHRcdH07XG5cdFx0XHR2YXIgaXNNb2JpbGUgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuICFpc0Rlc2t0b3AoKTtcblx0XHRcdH07XG5cblx0XHRcdC8vIEFkZCBhZGFwdGVyIGZvciB2YXJpb3VzIGNvbmRpdGlvbnMsIG9uIHRoZSBhZGFwdGVyIG1hbmFnZXJcblx0XHRcdGFkYXB0ZXJNYW5hZ2VyLmFkZENvbmRpdGlvbihmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIGlzRGVza3RvcCgpO1xuXHRcdFx0fSwgYWRhcHRlcnMuZGVza3RvcCk7XG5cblx0XHRcdGFkYXB0ZXJNYW5hZ2VyLmFkZENvbmRpdGlvbihmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIGlzTW9iaWxlKCk7XG5cdFx0XHR9LCBhZGFwdGVycy5tb2JpbGUpO1xuXG5cdFx0XHRhZGFwdGVyTWFuYWdlci5pbml0KCk7XG5cdFx0fVxuXHR9O1xuXG5cdFN1cHBvcnQuTW9iaWxlVG9nZ2xlSGVhZGVyID0ge1xuXG5cdFx0YmFzZUhlaWdodDogbnVsbCxcblx0XHRtYXhIZWlnaHQ6IDE1MDAsXG5cdFx0YnJlYWtwb2ludFRvZ2dsZTogOTYwLFxuXG5cdFx0YWN0aW9uczoge1xuXHRcdFx0b3BlbjogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQoJy5zdXBwb3J0LWhlYWRlcicpLmFkZENsYXNzKCdleHBhbmRlZCcpO1xuXHRcdFx0XHQkKCcuc3VwcG9ydC1oZWFkZXInKS5jc3MoJ21heC1oZWlnaHQnLCAnMTIwMHB4Jyk7XG5cdFx0XHR9LFxuXHRcdFx0Y2xvc2U6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR0aGlzLnNldEhlaWdodEFzQmFzZUhlaWdodCgpO1xuXHRcdFx0fSxcblx0XHRcdHNldEhlaWdodEFzQmFzZUhlaWdodDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQoJy5zdXBwb3J0LWhlYWRlcicpLmNzcygnbWF4LWhlaWdodCcsIFN1cHBvcnQuTW9iaWxlVG9nZ2xlSGVhZGVyLmJhc2VIZWlnaHQgKyAncHgnKTtcblxuXHRcdFx0XHQvLyBieSBkZWZhdWx0IG90aGVyIGJyb3dzZXJzIHdpbGwgdHJpZ2dlciBjbG9zZSBvbiBhZGRIYW5kbGVycyBhdCB0aGUgZW5kIG9mIHRoZSBjc3MgdHJhbnNpdGlvblxuXHRcdFx0XHQvLyBpZTggd2lsbCBuZXZlciB0cmlnZ2VyIHRoZSBlbmQgY3NzIHRyYW5zaXRpb24gZXZlbnQgYXMgaXQgZG9lc24ndCBzdXBwb3J0IHRyYW5zaXRpb25zXG5cdFx0XHRcdGlmICgkKCdodG1sJykuaGFzQ2xhc3MoJ29sZGllJykpIHtcblx0XHRcdFx0XHQkKCcuc3VwcG9ydC1oZWFkZXInKS50cmlnZ2VyKCd0cmFuc2l0aW9uZW5kJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRhcHBseUlmTW9iaWxlOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0Ly8gaWYgZGVza3RvcCwgcmVtb3ZlIG1heC1oZWlnaHQgYW5kIGV4cGFuZGVkIGNsYXNzXG5cdFx0XHRcdC8vIGluIGNhc2UgbWVkaWEgcXVlcmllcyBhcmVuJ3Qgc3VwcG9ydGVkIGJ5IHRoZSBicm93c2VyLCB0aGVuIGRlZmF1bHQgdG8gdXNpbmcgdGhlIHdpZHRoIG9mIHRoZSB3aW5kb3dcblx0XHRcdFx0dmFyIGlzRGVza3RvcCA9IE1vZGVybml6ci5tcSgnKG1pbi13aWR0aDogJyArIFN1cHBvcnQuTW9iaWxlVG9nZ2xlSGVhZGVyLmJyZWFrcG9pbnRUb2dnbGUgKyAncHgpJykgfHwgJCh3aW5kb3cpLndpZHRoKCkgPj0gU3VwcG9ydC5NZW51LmRlc2t0b3BCcmVha3BvaW50O1xuXHRcdFx0XHRpZiAoaXNEZXNrdG9wKSB7XG5cdFx0XHRcdFx0JCgnLnN1cHBvcnQtaGVhZGVyJykuY3NzKCdtYXgtaGVpZ2h0JywgJycpO1xuXHRcdFx0XHRcdCQoJy5zdXBwb3J0LWhlYWRlcicpLnJlbW92ZUNsYXNzKCdleHBhbmRlZCcpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmICgkKCcuc3VwcG9ydC1oZWFkZXInKS5oYXNDbGFzcygnZXhwYW5kZWQnKSkge1xuXHRcdFx0XHRcdFx0dGhpcy5vcGVuKCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRoaXMuY2xvc2UoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0Y2FsY0Jhc2VIZWlnaHQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gaWYgdGhlIGhlaWdodCBzaG91bGQgYmUgZGV0ZXJtaW5lZCBkeW5hbWljYWxseVxuXHRcdFx0Ly8gdGhpcy5iYXNlSGVpZ2h0ID0gJCgnLmxvZ28tYmFyLWNvbnRhaW5lcicpLmhlaWdodCgpO1xuXG5cdFx0XHR0aGlzLmJhc2VIZWlnaHQgPSA5MDtcblx0XHR9LFxuXG5cdFx0YWRkSGFuZGxlcnM6IGZ1bmN0aW9uKCkge1xuXG5cdFx0XHQkKCcuanMtdG9nZ2xlLW9wZW4taGVhZGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmICgkKCcuc3VwcG9ydC1oZWFkZXInKS5oYXNDbGFzcygnZXhwYW5kZWQnKSkge1xuXHRcdFx0XHRcdFN1cHBvcnQuTW9iaWxlVG9nZ2xlSGVhZGVyLmFjdGlvbnMuY2xvc2UoKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRTdXBwb3J0Lk1vYmlsZVRvZ2dsZUhlYWRlci5hY3Rpb25zLm9wZW4oKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdCQoJy5zdXBwb3J0LWhlYWRlcicpLm9uKCd0cmFuc2l0aW9uZW5kIHdlYmtpdFRyYW5zaXRpb25FbmQgb1RyYW5zaXRpb25FbmQgTVNUcmFuc2l0aW9uRW5kJywgZnVuY3Rpb24oKSB7XG5cblx0XHRcdFx0Ly8gdHJhbnNpdGlvbiBoYXMgZW5kZWQgYW5kIGF0IGVuZCBoZWlnaHQgcG9zaXRpb25cblx0XHRcdFx0aWYgKCQoJy5zdXBwb3J0LWhlYWRlcicpLmhlaWdodCgpID09PSBTdXBwb3J0Lk1vYmlsZVRvZ2dsZUhlYWRlci5iYXNlSGVpZ2h0IHx8ICQoJ2h0bWwnKS5oYXNDbGFzcygnb2xkaWUnKSkge1xuXHRcdFx0XHRcdCQoJy5zdXBwb3J0LWhlYWRlcicpLnJlbW92ZUNsYXNzKCdleHBhbmRlZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0JCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdFN1cHBvcnQuTW9iaWxlVG9nZ2xlSGVhZGVyLmFjdGlvbnMuYXBwbHlJZk1vYmlsZSgpO1xuXHRcdFx0fSk7XG5cblx0XHR9LFxuXG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHR3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0c2VsZi5jYWxjQmFzZUhlaWdodCgpO1xuXHRcdFx0XHRzZWxmLmFkZEhhbmRsZXJzKCk7XG5cdFx0XHRcdHNlbGYuYWN0aW9ucy5hcHBseUlmTW9iaWxlKCk7XG5cdFx0XHR9LCAwKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gdXNlZCB0byBhdHRhY2ggdGhlIGNsYXNzIG9uIGxvYWQgdG8gdHJhbnNpdGlvbiB0aGUgZml4ZWQgc2lkZSBpbnRvIHZpZXdcblx0U3VwcG9ydC5TbGlkZUluU3VwcG9ydENoYXRCdXR0b24gPSB7XG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgJGNoYXROb3cgPSAkKCcuc3VwcG9ydC1jaGF0LW5vdywgLmNoYXQtbm93LWxpbmsnKTtcblx0XHRcdGlmICgkY2hhdE5vdy5sZW5ndGgpIHtcblx0XHRcdFx0JGNoYXROb3cuYWRkQ2xhc3MoJ29uLXNjcmVlbicpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIGluaXQgZWFjaCBzdXBwb3J0IGZlYXR1cmVcblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRTdXBwb3J0LkF1dGhlbnRpY2F0ZWRCbG9ja3MuaW5pdCgpO1xuXHRcdFN1cHBvcnQuR2V0dGluZ1N0YXJ0ZWRDYXJvdXNlbC5pbml0KCk7XG5cdFx0U3VwcG9ydC5Db250cm9scy5pbml0KCk7XG5cdFx0U3VwcG9ydC5BbGVydHMuaW5pdCgpO1xuXHRcdFN1cHBvcnQuVG9nZ2xlU2VhcmNoQXJlYXMuaW5pdCgpO1xuXHRcdFN1cHBvcnQuTWVudS5pbml0KCk7XG5cdFx0U3VwcG9ydC5Nb2JpbGVUb2dnbGVIZWFkZXIuaW5pdCgpO1xuXHRcdFN1cHBvcnQuU2xpZGVJblN1cHBvcnRDaGF0QnV0dG9uLmluaXQoKTtcblx0fVxuXG5cdCQoaW5pdCk7XG5cbn0oalF1ZXJ5KSk7XG4iLCJ2YXIgZ2VuZXJhdGVNZW51QWRhcHRlciA9IChmdW5jdGlvbigpIHtcblxuXHR2YXIgYWRhcHRlckFQSSA9IHtcblxuXHRcdGxhYmVsOiAnJyxcblx0XHRtZW51OiBudWxsLFxuXHRcdGludGVyZmFjZTogJ3RvdWNoJywgLy8gYXNzdW1lIGEgdG91Y2ggaW50ZXJmYWNlIGJ5IGRlZmF1bHQsIG1vYmlsZS1maXJzdFxuXHRcdGhhbmRsZXJzOiBbXSxcblxuXHRcdHNldHVwSGFuZGxlcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGFkYXB0ZXIgPSB0aGlzO1xuXHRcdFx0JC5lYWNoKHRoaXMuaGFuZGxlcnMsIGZ1bmN0aW9uKGksIGhhbmRsZXIpe1xuXHRcdFx0XHRoYW5kbGVyLnNldHVwKGFkYXB0ZXIpO1xuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHRkZXN0cm95SGFuZGxlcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGFkYXB0ZXIgPSB0aGlzO1xuXHRcdFx0JC5lYWNoKHRoaXMuaGFuZGxlcnMsIGZ1bmN0aW9uKGksIGhhbmRsZXIpe1xuXHRcdFx0XHRoYW5kbGVyLmRlc3Ryb3koYWRhcHRlcik7XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0dGVhcmRvd246IGZ1bmN0aW9uKGFkYXB0ZXIpIHt9LFxuXHRcdGluaXQ6IGZ1bmN0aW9uKGFkYXB0ZXIpIHt9XG5cdH07XG5cblx0cmV0dXJuIGZ1bmN0aW9uKG1lbnUsIG9wdGlvbnMpIHtcblxuXHRcdHZhciBhZGFwdGVyID0gJC5leHRlbmQoe30sIGFkYXB0ZXJBUEksIG9wdGlvbnMsIHtcblxuXHRcdFx0bWVudTogbWVudSxcblxuXHRcdFx0aW5pdDogZnVuY3Rpb24oaW50ZXJmYWNlKSB7XG5cblx0XHRcdFx0bWVudS5pbml0KCk7XG5cblx0XHRcdFx0dGhpcy5pbnRlcmZhY2UgPSBpbnRlcmZhY2U7XG5cdFx0XHRcdHRoaXMuc2V0dXBIYW5kbGVycygpO1xuXG5cdFx0XHRcdC8vIGZpbmlzaCB3aXRoIGV4ZWN1dGluZyB0aGUgb3B0aW9ucyBwYXNzZWQgaW5cblx0XHRcdFx0aWYgKHR5cGVvZiBvcHRpb25zLmluaXQgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRvcHRpb25zLmluaXQodGhpcyk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdHRlYXJkb3duOiBmdW5jdGlvbigpIHtcblxuXHRcdFx0XHR0aGlzLmRlc3Ryb3lIYW5kbGVycygpO1xuXG5cdFx0XHRcdGlmICh0eXBlb2Ygb3B0aW9ucy50ZWFyZG93biA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdG9wdGlvbnMudGVhcmRvd24odGhpcyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHJldHVybiBhZGFwdGVyO1xuXG5cdH07XG5cbn0pKCk7XG5cbmV4cG9ydHMuZ2VuZXJhdGVNZW51QWRhcHRlciA9IGdlbmVyYXRlTWVudUFkYXB0ZXI7XG4iLCJ2YXIgZ2VuZXJhdGVNZW51ID0gKGZ1bmN0aW9uKCkge1xuXG5cdHZhciBtZW51RGVmYXVsdCA9IHtcblxuXHQgIG1lbnVFbGVtZW50OiAkKCcubWVudScpLFxuXHQgIHN1Yk1lbnVTZWxlY3RvcjogJy5zdWItbWVudScsXG5cdCAgZXhwYW5kZWRDbGFzczogJ2V4cGFuZGVkJyxcblx0ICBzdWJNZW51VHJpZ2dlclNlbGVjdG9yOiAnLmpzLXNob3ctc3ViLXRyaWdnZXInLFxuXG5cdCAgZXhwYW5kTWVudTogZnVuY3Rpb24oc3ViTWVudUVsZW1lbnQpIHtcblx0XHQkKHN1Yk1lbnVFbGVtZW50KS5hZGRDbGFzcyh0aGlzLmV4cGFuZGVkQ2xhc3MpO1xuXHQgIH0sXG5cblx0ICBjb2xsYXBzZU1lbnU6IGZ1bmN0aW9uKHN1Yk1lbnVFbGVtZW50KSB7XG5cdFx0JChzdWJNZW51RWxlbWVudCkucmVtb3ZlQ2xhc3ModGhpcy5leHBhbmRlZENsYXNzKTtcblx0ICB9LFxuXG5cdCAgY29sbGFwc2VBbGxTdWJNZW51czogZnVuY3Rpb24oKSB7XG5cdCAgXHR2YXIgbWVudSA9IHRoaXM7XG5cdFx0dGhpcy5tZW51RWxlbWVudC5maW5kKHRoaXMuc3ViTWVudVNlbGVjdG9yKS5lYWNoKGZ1bmN0aW9uKGksIGUpe1xuXHRcdCAgbWVudS5jb2xsYXBzZU1lbnUoZSk7XG5cdFx0fSk7XG5cdCAgfSxcblxuXHQgIGZpbmRNZW51RnJvbVRhcmdldDogZnVuY3Rpb24odGFyZ2V0KSB7XG5cdFx0dmFyIHRyaWdnZXIgPSAkKHRhcmdldCkucGFyZW50KHRoaXMuc3ViTWVudVRyaWdnZXJTZWxlY3RvcikuYWRkQmFjayh0aGlzLnN1Yk1lbnVUcmlnZ2VyU2VsZWN0b3IpO1xuXHRcdHZhciBtZW51ID0gdHJpZ2dlci5maW5kKHRoaXMuc3ViTWVudVNlbGVjdG9yKTtcblx0XHRyZXR1cm4gbWVudTtcblx0ICB9LFxuXG5cdCAgaW5pdDogZnVuY3Rpb24oKSB7fVxuXHR9O1xuXG5cdHJldHVybiBmdW5jdGlvbihvcHRpb25zKSB7XG5cdCAgcmV0dXJuICQuZXh0ZW5kKHt9LCBtZW51RGVmYXVsdCwgb3B0aW9ucyk7XG5cdH07XG59KSgpO1xuXG5leHBvcnRzLmdlbmVyYXRlTWVudSA9ICBnZW5lcmF0ZU1lbnU7XG4iXX0=
