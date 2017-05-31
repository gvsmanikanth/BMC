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
				Support.Issues.loadViaUrl('/templates/ServiceSupportCases');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL3N1cHBvcnQuanMiLCJqcy9tb2R1bGVzL21lbnUtYWRhcHRlci5qcyIsImpzL21vZHVsZXMvbWVudS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbGhDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBtZW51anMgPSByZXF1aXJlKCcuL21lbnUnKTtcbnZhciBtZW51QWRhcHRlciA9IHJlcXVpcmUoJy4vbWVudS1hZGFwdGVyJyk7XG5cbnZhciBTdXBwb3J0ID0gU3VwcG9ydCB8fCB7fTtcblxuKGZ1bmN0aW9uKCQpIHtcblxuXHR2YXIgc3VwcG9ydEVudixcblx0XHRzdXBwb3J0UGF0aCxcblx0XHRhbGVydE1lc3NhZ2VzLFxuXHRcdGlzc3Vlc0NvbnRhaW5lciA9ICQoJy5qcy1pc3N1ZXMtY29udGFpbmVyJyksXG5cdFx0Y29udHJhY3RTZWxlY3RvciA9ICQoJy5qcy1jb250cmFjdHMtc2VsZWN0JyksXG5cdFx0Y29udHJhY3REZXRhaWxzID0gJCgnLmFjdGlvbi1kZXRhaWwtZ3JvdXAnKSxcblx0XHRhY2NvdW50RGV0YWlscyA9ICQoJy5hY3Rpb24tZGV0YWlscycpLFxuXHRcdGFjY291bnRFcnJvciA9ICQoJy5qcy1hY2NvdW50LWVycm9yJyksXG5cdFx0YWxlcnRzQnV0dG9uQ29udGFpbmVyID0gJCgnYS5hbGVydHMuanMtZmFuY3lEaWFsb2cnKS5wYXJlbnQoJ2xpLmFjdGlvbicpO1xuXG5cdFN1cHBvcnQuSGVscGVycyA9IHtcblxuXHRcdC8vIENoZWNrIGlmIHRoZSBibWNNZXRhIGFuZCBibWNNZXRhLnN1cHBvcnQgZXhpc3Rcblx0XHQvLyBVc2VkIHRvIGFzc3VtZSBvdGhlciBmdW5jdGlvbmFsaXR5IGJhc2VkIG9uIHRoZSBleGlzdGFuY2Ugb2YgdGhpcyBpbml0aWFsIGJhc2Ugc2V0dXBcblx0XHRibWNTdXBwb3J0TG9hZGVkOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICh0eXBlb2YgYm1jTWV0YSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGJtY01ldGEuc3VwcG9ydCAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSxcblxuXHRcdC8vIENoZWNrIHRvIHNlZSBpZiBlbmFibGVBbGVydHMgaXMgdHJ1ZVxuXHRcdGJtY0FsZXJ0c0VuYWJsZWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKHR5cGVvZiBibWNNZXRhLnN1cHBvcnQuZW5hYmxlQWxlcnRzICE9PSAndW5kZWZpbmVkJyAmJiBibWNNZXRhLnN1cHBvcnQuZW5hYmxlQWxlcnRzID09IHRydWUpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRTdXBwb3J0LkhlbHBlcnMuaGlkZUFsZXJ0c0J1dHRvbigpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0sXG5cblx0XHRoaWRlQWxlcnRzQnV0dG9uOiBmdW5jdGlvbigpIHtcblx0XHRcdCQoYWxlcnRzQnV0dG9uQ29udGFpbmVyKS5oaWRlKCk7XG5cdFx0fSxcblx0XHRzaG93QWxlcnRzQnV0dG9uOiBmdW5jdGlvbigpIHtcblx0XHRcdCQoYWxlcnRzQnV0dG9uQ29udGFpbmVyKS5zaG93KCk7XG5cdFx0fSxcblxuXHRcdGlzQXV0aGVudGljYXRlZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdHlwZW9mIGJtY01ldGEgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIGJtY01ldGEudXNlciAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgYm1jTWV0YS51c2VyLmlzU3VwcG9ydEF1dGhlbnRpY2F0ZWQgIT09IFwidW5kZWZpbmVkXCIgJiYgYm1jTWV0YS51c2VyLmlzU3VwcG9ydEF1dGhlbnRpY2F0ZWQ7XG5cdFx0fSxcblxuXHRcdGlzT25TdXBwb3J0TGFuZGluZ1BhZ2U6IGZ1bmN0aW9uKCkge1xuXG5cdFx0XHRpZiAoU3VwcG9ydC5IZWxwZXJzLmJtY1N1cHBvcnRMb2FkZWQoKVxuXHRcdFx0XHQmJiB0eXBlb2YgYm1jTWV0YS5wYWdlICE9PSAndW5kZWZpbmVkJ1xuXHRcdFx0XHQmJiB0eXBlb2YgYm1jTWV0YS5wYWdlLmxvbmdOYW1lID09PSAnc3RyaW5nJykge1xuXG5cdFx0XHRcdHZhciBwYXRoQ2hlY2sgPSAvc3VwcG9ydC4qc3VwcG9ydC1jZW50cmFsLztcblx0XHRcdFx0Ly8gbWF0Y2hlcyBwYXRoIHN0cmluZyB3aXRoIHN1cHBvcnQgYW5kIHN1cHBvcnQgY2VudHJhbCBpbiBpdFxuXHRcdFx0XHQvLyBleGFtcGxlczpcblx0XHRcdFx0Ly8gXCJzdXBwb3J0OnN1cHBvcnQtY2VudHJhbFwiIG9yIFwic3VwcG9ydDpyZWc6c3VwcG9ydC1jZW50cmFsXCJcblx0XHRcdFx0aWYgKGJtY01ldGEucGFnZS5sb25nTmFtZS5tYXRjaChwYXRoQ2hlY2spICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gY2F0Y2gtYWxsIGRlZmF1bHRcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogZ2V0QWNjb3VudEVycm9yTWVzc2FnZVxuXHRcdCAqIEBwYXJhbSAge3N0cmluZ30gZXJyb3JUeXBlIC0gJ2lzc3VlJ1xuXHRcdCAqIEBwYXJhbSAge3N0cmluZ30gZXJyb3JDb2RlIGVycm9yQ29kZSAobGlrZWx5IHB1bGxlZCBmcm9tIGFqYXggcmVzcG9uc2UpXG5cdFx0ICogQHJldHVybiB7c3RyaW5nIHwgdW5kZWZpbmVkfSBSZXR1cm5zIG1hcHBlZCBzdHJpbmcgb3IgdW5kZWZpbmVkIGlmIG5vbmUgZm91bmQgaW4gdW5kZWZpbmVkXG5cdFx0ICovXG5cdFx0Z2V0QWNjb3VudEVycm9yTWVzc2FnZTogZnVuY3Rpb24oZXJyb3JUeXBlLCBlcnJvckNvZGUpIHtcblx0XHRcdC8vIG1hcCBlcnJvclR5cGUgdG8gY29ycmVjdCBlcnJvckdyb3VwLCBlcnJvckdyb3VwIGlzIHVzZWQgYXMgdGhlIGluZGV4IG9uIGJtY01ldGEuc3VwcG9ydC5lcnJvck1lc3NhZ2VzXG5cdFx0XHRpZiAoZXJyb3JUeXBlID09ICdpc3N1ZScpIHtcblx0XHRcdFx0dmFyIGVycm9yR3JvdXAgPSAnY2FzZUVycm9yTWVzc2FnZXMnO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdVc2UgdmFsaWQgZXJyb3JUeXBlIHdoZW4gYWNjb3VudEVycm9yJyk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIGRldGVybWluZSBhcHByb3ByaWF0ZSBlcnJvciBtZXNzYWdlIGJhc2VkIG9uIGluZGV4ZXNcblx0XHRcdC8vIHVuZGVmaW5lZCBpZiBtYXBwZWQgdmFsdWUgbm90IGZvdW5kXG5cdFx0XHR2YXIgZXJyb3JNZXNzYWdlID0gU3VwcG9ydC5IZWxwZXJzLmJtY1N1cHBvcnRMb2FkZWQoKVxuXHRcdFx0XHRcdFx0XHRcdCYmIGJtY01ldGEuc3VwcG9ydFtlcnJvckdyb3VwXSAhPT0gdW5kZWZpbmVkXG5cdFx0XHRcdFx0XHRcdFx0JiYgYm1jTWV0YS5zdXBwb3J0W2Vycm9yR3JvdXBdW2Vycm9yQ29kZV0gIT09IHVuZGVmaW5lZFxuXHRcdFx0XHRcdFx0XHRcdD8gYm1jTWV0YS5zdXBwb3J0W2Vycm9yR3JvdXBdW2Vycm9yQ29kZV0gOiB1bmRlZmluZWQ7XG5cblx0XHRcdHJldHVybiBlcnJvck1lc3NhZ2U7XG5cdFx0fSxcblxuXHRcdGFjY291bnRFcnJvcjogZnVuY3Rpb24oZXJyb3JUeXBlLCBlcnJvckNvZGUpIHtcblx0XHRcdC8vIHJlc2V0IGhpZGluZyBvZiBjb250YWluZXIsIHNob3cgbmV3IGVycm9yXG5cdFx0XHRTdXBwb3J0LkNvbnRyb2xzLmFjdGlvbnMucmVzZXRMb2FkQWNjb3VudEVycm9yKCk7XG5cblx0XHRcdHZhciBlcnJvck1lc3NhZ2UgPSBTdXBwb3J0LkhlbHBlcnMuZ2V0QWNjb3VudEVycm9yTWVzc2FnZShlcnJvclR5cGUsIGVycm9yQ29kZSk7XG5cblx0XHRcdC8vIGVycm9yTWVzc2FnZSBpcyB1bmRlZmluZWQgaWYgbWFwcGVkIG1lc3NhZ2Ugbm90IGZvdW5kXG5cdFx0XHQvLyBhdHRlbXB0IHRvIHNldCB1c2UgREVGQVVMVF9FUlJPUl9NRVNTQUdFXG5cdFx0XHRpZiAoZXJyb3JNZXNzYWdlID09PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRlcnJvck1lc3NhZ2UgPSBTdXBwb3J0LkhlbHBlcnMuZ2V0QWNjb3VudEVycm9yTWVzc2FnZShlcnJvclR5cGUsICdERUZBVUxUX0VSUk9SX01FU1NBR0UnKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gc2hvdy9oaWRlIHNwZWNpZmljIGNvbnRhaW5lcnMgYmFzZWQgb24gZXJyb3JUeXBlXG5cdFx0XHRpZiAoZXJyb3JUeXBlID09ICdpc3N1ZScpIHtcblx0XHRcdFx0JChhY2NvdW50RGV0YWlscykuc2hvdygpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBoaWRlIG90aGVyIGNvbnRhaW5lcnNcblx0XHRcdCQoaXNzdWVzQ29udGFpbmVyKS5oaWRlKCk7XG5cblx0XHRcdC8vIHNob3cgZXJyb3IgY29udGFpbmVyIHdpdGggbWVzc2FnZSwgYnV0IG9ubHkgaWYgbWVzc2FnZSBpcyBhIG5vbi1lbXB0eSBzdHJpbmdcblx0XHRcdC8vIGlmIHRoZSBlcnJvck1lc3NhZ2Ugd2FzIHJlc29sdmVkIHRvIGEgbWFwcGluZyBvZiBhbiBlbXB0eSBzdHJpbmcsIHRoZW4gZG9uJ3Qgc2hvd1xuXHRcdFx0aWYgKHR5cGVvZiBlcnJvck1lc3NhZ2UgPT09ICdzdHJpbmcnICYmIGVycm9yTWVzc2FnZS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdCQoYWNjb3VudEVycm9yKS5zaG93KCkuaHRtbChlcnJvck1lc3NhZ2UpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBQYXJzZXMgZGF0ZXMgY29taW5nIGJhY2sgZnJvbSBhamF4IHJlc3BvbnNlLiBGb3IgdGhlIGxhY2sgb2YgYSBiZXR0ZXIgdGVybSB0aGlzIGlzIGJlaW5nXG5cdFx0ICogcmVmZXJyZWQgdG8gYXMgYFN1cHBvcnQgTG9uZyBEYXRlYCwgYW5kIGlzIGEgc3RyaW5nIGJlaW5nIGxvYWRlZCBpbiB0aGUgc3RhbmRhcmQgZm9ybWF0OlxuXHRcdCAqIDIwMTUtMDQtMTRUMTQ6MDI6MjIuMDAwWlxuXHRcdCAqIEBwYXJhbSAge1N0cmluZ30gZGF0ZVN0cmluZyAtIERhdGUgZm9ybWF0dGVkIHN0cmluZywgbGlrZSAnMjAxNS0wNC0xNFQxNDowMjoyMi4wMDBaJ1xuXHRcdCAqIEByZXR1cm4ge0RhdGV8bnVsbH0gbnVsbCBpZiBubyBtYXRjaGVzLCBvciBuYXRpdmUgamF2YXNjcmlwdCBEYXRlIG9iamVjdFxuXHRcdCAqL1xuXHRcdHBhcnNlU3VwcG9ydExvbmdEYXRlOiBmdW5jdGlvbihkYXRlU3RyaW5nKSB7XG5cdFx0XHR2YXIgcGF0dGVybiA9IC8oXFxkezR9KS0oXFxkezJ9KS0oXFxkezJ9KVQoXFxkezJ9KTooXFxkezJ9KTooXFxkezJ9KS4oXFxkezN9XFxEKS87XG5cdFx0XHR2YXIgbWF0Y2hlcyA9IHBhdHRlcm4uZXhlYyhkYXRlU3RyaW5nKTtcblxuXHRcdFx0Ly8gb24gc3VjY2Vzc2Z1bCBtYXRjaCwgbWF0Y2hbMF0gd2lsbCBiZSB0aGUgZW50aXJlIG1hdGNoZWQgc3RyaW5nXG5cdFx0XHQvLyBtYXRjaGVkIGdyb3VwcyBhcmUgZm9sbG93aW5nIGluZGV4ZXNcblx0XHRcdGlmIChtYXRjaGVzKSB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0Ly8gbW9udGggaXMgcmVwcmVzZW50ZWQgYnkgbWF0Y2hlc1syXSwgRGF0ZSBjb25zdHJ1Y3RvciBleHBlY3RzIG1vbnRoIGluZGV4IGZyb20gMCB0byAxMS5cblx0XHRcdFx0XHRyZXR1cm4gbmV3IERhdGUobWF0Y2hlc1sxXSwgKHBhcnNlSW50KG1hdGNoZXNbMl0pIC0gMSksIG1hdGNoZXNbM10sIG1hdGNoZXNbNF0sIG1hdGNoZXNbNV0sIG1hdGNoZXNbNl0pO1xuXHRcdFx0XHR9IGNhdGNoKGVycm9yKSB7XG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZygnVW5hYmxlIHRvIHBhcnNlU3VwcG9ydExvbmdEYXRlIHdpdGggJyArIGRhdGVTdHJpbmcgKyAnLiBFcnJvcjpcXG4gJyArIGVycm9yLm1lc3NhZ2UpO1xuXHRcdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0cGFkOiBmdW5jdGlvbihuLCB3aWR0aCwgeikge1xuXHRcdFx0eiA9IHogfHwgJzAnO1xuXHRcdFx0biA9IG4gKyAnJztcblx0XHRcdHJldHVybiBuLmxlbmd0aCA+PSB3aWR0aCA/IG4gOiBuZXcgQXJyYXkod2lkdGggLSBuLmxlbmd0aCArIDEpLmpvaW4oeikgKyBuO1xuXHRcdH0sXG5cblx0XHQvLyBRdWljayBhbmQgZWFzeSBmdW5jdGlvbiBmb3IgcGFkZGluZyBtb250aCBhbmQgZGF5IGFtb3VudHMgd2l0aCBsZWFkaW5nIHplcm9lcyBpZiBuZWNlc3NhcnkgKGllOiBNTS9ERC9ZWVlZLCBzaW5nbGUgZGlnaXRhbHMgZm9yIE1NIGFuZCBERCBzaG91bGQgaGF2ZSBsZWFkaW5nIDApXG5cdFx0cGFkVG9Ud29EaWdpdHM6IGZ1bmN0aW9uKG51bSkge1xuXHRcdFx0cmV0dXJuIFN1cHBvcnQuSGVscGVycy5wYWQobnVtLCAyKTtcblx0XHR9LFxuXHRcdGdldFVSTFdpdGhRdWVyeVBhcmFtOiBmdW5jdGlvbih1cmksIGtleSwgdmFsdWUpIHtcblx0XHRcdHZhciByZSA9IG5ldyBSZWdFeHAoXCIoWz8mXSlcIiArIGtleSArIFwiPS4qPygmfCQpXCIsIFwiaVwiKTtcblx0XHRcdHZhciBzZXBhcmF0b3IgPSB1cmkuaW5kZXhPZignPycpICE9PSAtMSA/IFwiJlwiIDogXCI/XCI7XG5cblx0XHRcdGlmICh1cmkubWF0Y2gocmUpKSB7XG5cdFx0XHRcdHJldHVybiB1cmkucmVwbGFjZShyZSwgJyQxJyArIGtleSArIFwiPVwiICsgdmFsdWUgKyAnJDInKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gdXJpICsgc2VwYXJhdG9yICsga2V5ICsgXCI9XCIgKyB2YWx1ZTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdC8vIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcgaWYgaXQncyBub3Qgb25lLiBBbiBlbXB0eSBzdHJpbmcgaXMgcmV0dXJuZWQgZm9yIGBudWxsYCBvciBgdW5kZWZpbmVkYCB2YWx1ZXMuXG5cdFx0YmFzZVRvU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdCAgcmV0dXJuIHZhbHVlID09IG51bGwgPyAnJyA6ICh2YWx1ZSArICcnKTtcblx0XHR9LFxuXG5cdFx0Ly8gQ2FwaXRhbGl6ZXMgdGhlIGZpcnN0IGNoYXJhY3RlciBvZiBgc3RyaW5nYC5cblx0XHRjYXBpdGFsaXplOiBmdW5jdGlvbihzdHJpbmcpIHtcblx0XHQgIHN0cmluZyA9IFN1cHBvcnQuSGVscGVycy5iYXNlVG9TdHJpbmcoc3RyaW5nKTtcblx0XHQgIHJldHVybiBzdHJpbmcgJiYgKHN0cmluZy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0cmluZy5zbGljZSgxKSk7XG5cdFx0fSxcblxuXHRcdG1ha2VGdWxsTmFtZTogZnVuY3Rpb24oZmlyc3ROYW1lLCBsYXN0TmFtZSkge1xuXHRcdFx0cmV0dXJuIFN1cHBvcnQuSGVscGVycy5jYXBpdGFsaXplKGxhc3ROYW1lLnRvTG93ZXJDYXNlKCkpICsgXCIsIFwiICsgU3VwcG9ydC5IZWxwZXJzLmNhcGl0YWxpemUoZmlyc3ROYW1lLnRvTG93ZXJDYXNlKCkpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBBZGQgY2xhc3MgdG8gYm9keSwgdXNlZCBieSBjc3MgdG8gc2hvdy9oaWRlIGJsb2Nrc1xuXHQvLyB0aGF0IGRlcGVuZCBvbiBzdXBwb3J0IHVzZXIgYmVpbmcgYXV0aGVudGljYXRlZFxuXHRTdXBwb3J0LkF1dGhlbnRpY2F0ZWRCbG9ja3MgPSB7XG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgc3VwcG9ydEF1dGhlbnRpY2F0ZWRDbGFzcyA9IChTdXBwb3J0LkhlbHBlcnMuaXNBdXRoZW50aWNhdGVkKCkpID8gJ3N1cHBvcnQtbG9nZ2VkLWluJyA6ICdzdXBwb3J0LWxvZ2dlZC1vdXQnO1xuXHRcdFx0JCgnYm9keScpLmFkZENsYXNzKHN1cHBvcnRBdXRoZW50aWNhdGVkQ2xhc3MpO1xuXHRcdH1cblx0fTtcblxuXHRTdXBwb3J0Lklzc3VlcyA9IHtcblxuXHRcdHRhYmxlUm93c1NlbGVjdG9yOiAnLmpzLXN1cHBvcnQtaXNzdWVzLXJvd3MnLFxuXHRcdHNob3dNb3JlU2VsZWN0b3I6ICcuanMtc3VwcG9ydC1pc3N1ZXMtc2hvdy1tb3JlJyxcblx0XHRpc3N1ZVRhYmxlV3JhcHBlclNlbGVjdG9yOiAnLmpzLWlzc3VlLXRhYmxlLXdyYXBwZXInLFxuXHRcdGhpZGRlbkNsYXNzOiAnaGlkZGVuJyxcblx0XHRzaG93QmF0Y2hRdHk6IDEwLFxuXHRcdC8vIHN0YXRlZnVsIHNlbGVjdG9ycyBhbmQgY2xhc3Nlc1xuXHRcdGxvYWRpbmdJc3N1ZXNDb250YWluZXJTZWxlY3RvcjogJy5qcy1sb2FkaW5nLWlzc3Vlcy1jb250YWluZXInLFxuXHRcdG5vSXNzdWVzQ29udGFpbmVyU2VsZWN0b3I6ICcuanMtbm8taXNzdWVzLWNvbnRhaW5lcicsXG5cdFx0aGFzSXNzdWVzQ29udGFpbmVyU2VsZWN0b3I6ICcuanMtaXNzdWVzLWNvbnRhaW5lcicsXG5cdFx0bG9hZGluZ0ZhaWxlZElzc3Vlc0NvbnRhaW5lclNlbGVjdG9yOiAnLmpzLWZhaWxlZC1sb2FkaW5nLWlzc3Vlcy1jb250YWluZXInLFxuXHRcdGhpZGVPbkluaXRDbGFzczogJ3N1cHBvcnQtaGlkZS13aGlsZS1sb2FkaW5nJyxcblxuXHRcdGdldE1vZHVsZVN0YXRlQ29udGFpbmVyU2VsZWN0b3JzOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGxvYWQ6IFN1cHBvcnQuSXNzdWVzLmxvYWRpbmdJc3N1ZXNDb250YWluZXJTZWxlY3Rvcixcblx0XHRcdFx0aGFzSXNzdWVzOiBTdXBwb3J0Lklzc3Vlcy5oYXNJc3N1ZXNDb250YWluZXJTZWxlY3Rvcixcblx0XHRcdFx0bm9Jc3N1ZXM6IFN1cHBvcnQuSXNzdWVzLm5vSXNzdWVzQ29udGFpbmVyU2VsZWN0b3IsXG5cdFx0XHRcdGZhaWxlZDogU3VwcG9ydC5Jc3N1ZXMubG9hZGluZ0ZhaWxlZElzc3Vlc0NvbnRhaW5lclNlbGVjdG9yXG5cdFx0XHR9O1xuXHRcdH0sXG5cblx0XHRsb2FkVmlhVXJsOiBmdW5jdGlvbih1cmwpIHtcblxuXHRcdFx0U3VwcG9ydC5Jc3N1ZXMuYWN0aW9ucy5zaG93U3RhdGVDb250YWluZXIoJ2xvYWQnKTtcblxuXHRcdFx0JC5nZXRKU09OKHVybCwgZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRpZiAodHlwZW9mIGRhdGEuQ2FzZXMgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdFx0dmFyIGlzc3VlcyA9ICQubWFwKGRhdGEuQ2FzZXMsIFN1cHBvcnQuSXNzdWVzLm1hcFRvSXNzdWVGb3JtYXQpXG5cdFx0XHRcdFx0XHQvLyBzb3J0cyBieSBtb3N0IHJlY2VudCwgZGVzY2VuZGluZ1xuXHRcdFx0XHRcdFx0LnNvcnQoZnVuY3Rpb24oYSwgYikge1xuXHRcdFx0XHRcdFx0XHRpZiAoYS5sYXN0VXBkYXRlZFJhd0RhdGUgJiZcblx0XHRcdFx0XHRcdFx0XHRiLmxhc3RVcGRhdGVkUmF3RGF0ZSAmJlxuXHRcdFx0XHRcdFx0XHRcdGEubGFzdFVwZGF0ZWRSYXdEYXRlID4gYi5sYXN0VXBkYXRlZFJhd0RhdGUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiAtMTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdGlmIChhLmxhc3RVcGRhdGVkUmF3RGF0ZSAmJlxuXHRcdFx0XHRcdFx0XHRcdGIubGFzdFVwZGF0ZWRSYXdEYXRlICYmXG5cdFx0XHRcdFx0XHRcdFx0YS5sYXN0VXBkYXRlZFJhd0RhdGUgPCBiLmxhc3RVcGRhdGVkUmF3RGF0ZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQvLyBvbmx5IGtlZXAgMjAgaXNzdWVzLCBhZnRlciBzb3J0aW5nXG5cdFx0XHRcdFx0XHQuc2xpY2UoMCwgMjApO1xuXG5cdFx0XHRcdFx0U3VwcG9ydC5Jc3N1ZXMuYWN0aW9ucy5yZW1vdmVBbGxJc3N1ZXMoKTtcblx0XHRcdFx0XHRTdXBwb3J0Lklzc3Vlcy5sb2FkSXNzdWVzKGlzc3Vlcyk7XG5cdFx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIGRhdGEuZXJyb3JDb2RlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRTdXBwb3J0LkhlbHBlcnMuYWNjb3VudEVycm9yKCdpc3N1ZScsIGRhdGEuZXJyb3JDb2RlKTtcblx0XHRcdFx0XHRTdXBwb3J0Lklzc3Vlcy5hY3Rpb25zLnNob3dTdGF0ZUNvbnRhaW5lcigpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LmZhaWwoZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRTdXBwb3J0LkhlbHBlcnMuYWNjb3VudEVycm9yKCdpc3N1ZScsICdERUZBVUxUX0VSUk9SX01FU1NBR0UnKTtcblx0XHRcdFx0U3VwcG9ydC5Jc3N1ZXMuYWN0aW9ucy5zaG93U3RhdGVDb250YWluZXIoKTtcblx0XHRcdH0pXG5cdFx0XHQuYWx3YXlzKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRTdXBwb3J0LkNvbnRyb2xzLmFjdGlvbnMuZmluaXNoZWRMb2FkaW5nKCk7XG5cdFx0XHR9KTs7XG5cdFx0fSxcblxuXHRcdC8vIHRha2VzIGZvcm1hdCBmcm9tIGpzb24gYW5kIG1hcHMgdG8gZm9ybWF0IHVzZWQgaW50ZXJuYWxseVxuXHRcdC8vIGNhbiBwZXJmb3JtIGFueSBvdGhlciBjbGVhbiB1cCBhcyB3ZWxsXG5cdFx0bWFwVG9Jc3N1ZUZvcm1hdDogZnVuY3Rpb24oaXNzdWUpIHtcblxuXHRcdFx0dmFyIGZ1bGxOYW1lID0gU3VwcG9ydC5IZWxwZXJzLm1ha2VGdWxsTmFtZShpc3N1ZS5Db250YWN0Rmlyc3ROYW1lLCBpc3N1ZS5Db250YWN0TGFzdE5hbWUpO1xuXG5cdFx0XHQvLyBsZWZ0UGFkIHdpdGggd2l0aCBleHRyYSAnMCcgaWYgcmVxdWlyZWRcblx0XHRcdHZhciBwYWQgPSBTdXBwb3J0LkhlbHBlcnMucGFkVG9Ud29EaWdpdHM7XG5cblx0XHRcdC8vIHByb3ZpZGVzIHJhdyBqcyBEYXRlIG9iamVjdFxuXHRcdFx0dmFyIHJhd0xhc3RVcGRhdGVkID0gU3VwcG9ydC5IZWxwZXJzLnBhcnNlU3VwcG9ydExvbmdEYXRlKGlzc3VlLkxhc3RNb2RpZmllZERhdGUpO1xuXHRcdFx0dmFyIHJhd0NyZWF0ZWQgPSBTdXBwb3J0LkhlbHBlcnMucGFyc2VTdXBwb3J0TG9uZ0RhdGUoaXNzdWUuQ3JlYXRlZERhdGUpO1xuXHRcdFx0dmFyIG1vbnRocz1bJ0phbicsJ0ZlYicsJ01hcicsJ0FwcicsJ01heScsJ0p1bicsJ0p1bCcsJ0F1ZycsJ1NlcCcsJ09jdCcsJ05vdicsJ0RlYyddO1xuXHRcdFx0XG5cdFx0XHQvLyBcIkxhc3QgVXBkYXRlZFwiIG91dHB1dHRlZCBmb3JtYXQ6IE1NL0REL1lZWVkgSEg6TU1cblx0XHRcdC8qXG5cdFx0XHR2YXIgZm9ybWF0dGVkTGFzdFVwZGF0ZWQgPSBwYWQocmF3TGFzdFVwZGF0ZWQuZ2V0TW9udGgoKSArIDEpIC8vIGdldE1vbnRoKCkgcmV0dXJucyBhIDAtMTEgcmFuZ2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0KyBcIi9cIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQrIHBhZChyYXdMYXN0VXBkYXRlZC5nZXREYXRlKCkpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCsgXCIvXCJcblx0XHRcdFx0XHRcdFx0XHRcdFx0KyByYXdMYXN0VXBkYXRlZC5nZXRGdWxsWWVhcigpO1xuXG5cdFx0XHR2YXIgZm9ybWF0dGVkQ3JlYXRlZCA9IHBhZChyYXdDcmVhdGVkLmdldE1vbnRoKCkgKyAxKSAvLyBnZXRNb250aCgpIHJldHVybnMgYSAwLTExIHJhbmdlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCsgXCIvXCJcblx0XHRcdFx0XHRcdFx0XHRcdFx0KyBwYWQocmF3Q3JlYXRlZC5nZXREYXRlKCkpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCsgXCIvXCJcblx0XHRcdFx0XHRcdFx0XHRcdFx0KyByYXdDcmVhdGVkLmdldEZ1bGxZZWFyKCk7XG5cdFx0XHQqL1xuXHRcdFx0XG5cdFx0XHRcblx0XHRcdC8vIFwiTGFzdCBVcGRhdGVkXCIgb3V0cHV0dGVkIGZvcm1hdDogTU0vREQvWVlZWSBISDpNTVxuXHRcdFx0dmFyIGZvcm1hdHRlZExhc3RVcGRhdGVkID0gcGFkKHJhd0xhc3RVcGRhdGVkLmdldERhdGUoKSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0KyBcIi1cIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQrIHBhZChtb250aHNbcmF3TGFzdFVwZGF0ZWQuZ2V0TW9udGgoKV0pIFxuXHRcdFx0XHRcdFx0XHRcdFx0XHQrIFwiLVwiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCsgcmF3TGFzdFVwZGF0ZWQuZ2V0RnVsbFllYXIoKTtcblxuXHRcdFx0dmFyIGZvcm1hdHRlZENyZWF0ZWQgPSBwYWQocmF3Q3JlYXRlZC5nZXREYXRlKCkpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCsgXCItXCJcblx0XHRcdFx0XHRcdFx0XHRcdFx0KyBwYWQobW9udGhzW3Jhd0NyZWF0ZWQuZ2V0TW9udGgoKV0pXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCsgXCItXCJcblx0XHRcdFx0XHRcdFx0XHRcdFx0KyByYXdDcmVhdGVkLmdldEZ1bGxZZWFyKCk7XG5cdFx0XHRcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGlkOiBpc3N1ZS5JZCxcblx0XHRcdFx0Y2FzZU51bWJlcjogaXNzdWUuQ2FzZU51bWJlcixcblx0XHRcdFx0c3RhdHVzOiBpc3N1ZS5TdGF0dXMsXG5cdFx0XHRcdHByb2R1Y3Q6IGlzc3VlLlByb2R1Y3ROYW1lLFxuXHRcdFx0XHRjcmVhdGVkRGF0ZTogZm9ybWF0dGVkQ3JlYXRlZCxcblx0XHRcdFx0bGFzdFVwZGF0ZWRPcmlnaW5hbERhdGU6IGlzc3VlLkxhc3RNb2RpZmllZERhdGUsXG5cdFx0XHRcdGxhc3RVcGRhdGVkUmF3RGF0ZTogcmF3TGFzdFVwZGF0ZWQsXG5cdFx0XHRcdGxhc3RVcGRhdGVkRm9ybWF0dGVkRGF0ZTogZm9ybWF0dGVkTGFzdFVwZGF0ZWQsXG5cdFx0XHRcdHN1bW1hcnk6IGlzc3VlLlN1YmplY3QsXG5cdFx0XHRcdHN1Ym1pdHRlcjogZnVsbE5hbWVcblx0XHRcdH07XG5cdFx0fSxcblxuXHRcdGxvYWRJc3N1ZXM6IGZ1bmN0aW9uKGlzc3Vlcykge1xuXHRcdFx0aWYgKGlzc3Vlcy5sZW5ndGgpIHtcblx0XHRcdFx0U3VwcG9ydC5Jc3N1ZXMuYWN0aW9ucy5hZGRJc3N1ZXMoaXNzdWVzKTtcblx0XHRcdFx0U3VwcG9ydC5Jc3N1ZXMuYWN0aW9ucy5zaG93U3RhdGVDb250YWluZXIoJ2hhc0lzc3VlcycpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0U3VwcG9ydC5Jc3N1ZXMuYWN0aW9ucy5zaG93U3RhdGVDb250YWluZXIoJ25vSXNzdWVzJyk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdGxvYWRTZWxlY3RlZElzc3VlOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBtYXRjaElkID0gJChjb250cmFjdFNlbGVjdG9yKS5maW5kKCc6c2VsZWN0ZWQnKS5kYXRhKCdjb250cmFjdC1pZCcpIHx8IFwiXCI7XG5cdFx0XHQvLyBMb2FkIGxvY2FsIHRlc3QgZGF0YSAgb3IgZ2V0IHZpYSBhamF4XG5cdFx0XHRpZiAodHlwZW9mIGJtY01ldGEgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBibWNNZXRhLmNkeExvY2FsICE9PSAndW5kZWZpbmVkJyAmJiBibWNNZXRhLmNkeExvY2FsKSB7XG5cdFx0XHRcdHRoaXMubG9hZFZpYVVybCgnLi90ZXN0LycgKyBtYXRjaElkICsgJy5qc29uJyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLmxvYWRWaWFVcmwoJy90ZW1wbGF0ZXMvUmVzdEdldFN1cHBvcnRPcGVuSXNzdWVzP2NvbnRyYWN0SUQ9JyArIG1hdGNoSWQpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRhY3Rpb25zOiB7XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogQWRkcyBhbiBhcnJheSBvZiBpc3N1ZSBvYmplY3RzXG5cdFx0XHQgKiBAcGFyYW0ge2FycmF5fSBpc3N1ZXMgYXJyYXkgb2YgaXNzdWVzIGluIHRoZSBmb3JtYXQgc3BlY2lmaWVkIHdpdGhpbiBgYWRkSXNzdWVgXG5cdFx0XHQgKi9cblx0XHRcdGFkZElzc3VlczogZnVuY3Rpb24oaXNzdWVzKSB7XG5cdFx0XHRcdC8vIHNlZSBTdXBwb3J0Lklzc3Vlcy5hY3Rpb25zLmFkZElzc3VlIGZvciBleHBlY3RlZCBpc3N1ZSBmb3JtYXRcblx0XHRcdFx0JC5lYWNoKGlzc3VlcywgZnVuY3Rpb24oaSwgaXNzdWUpIHtcblx0XHRcdFx0XHRTdXBwb3J0Lklzc3Vlcy5hY3Rpb25zLmFkZElzc3VlKGlzc3VlKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9LFxuXG5cdFx0XHRhZGRJc3N1ZTogZnVuY3Rpb24oaXNzdWUpIHtcblxuXHRcdFx0XHQvKipcblx0XHRcdFx0ICogb3V0cHV0IGZvcm1hdDpcblx0XHRcdFx0ICpcblx0XHRcdFx0ICogIHtcblx0XHRcdFx0ICogICAgICBpZDogbnVtYmVyLFxuXHRcdFx0XHQgKlx0XHRzdW1tYXJ5OiBzdHJpbmcsXG5cdFx0XHRcdCAqICAgICAgcHJvZHVjdDogc3RyaW5nLFxuXHRcdFx0XHQgKiAgICAgIGNyZWF0ZWREYXRlOiBzdHJpbmcsXG5cdFx0XHRcdCAqICAgICAgbGFzdFVwZGF0ZWQ6IHN0cmluZyxcblx0XHRcdFx0ICogICAgICBzdGF0dXM6IHN0cmluZyxcblx0XHRcdFx0ICpcdFx0c3VibWl0dGVyOiBzdHJpbmdcblx0XHRcdFx0ICogXHR9XG5cdFx0XHRcdCAqL1xuXG5cdFx0XHRcdC8vIHB1bGwgbmVlZGVkIGZpZWxkcyBmcm9tIGlzc3VlIGZvciBvdXRwdXQgZm9ybWF0XG5cdFx0XHRcdHZhciBpc3N1ZU91dHB1dCA9IHtcblx0XHRcdFx0XHRpZDogaXNzdWUuY2FzZU51bWJlcixcblx0XHRcdFx0XHRzdW1tYXJ5OiBpc3N1ZS5zdW1tYXJ5LFxuXHRcdFx0XHRcdHByb2R1Y3Q6IGlzc3VlLnByb2R1Y3QsXG5cdFx0XHRcdFx0Y3JlYXRlZERhdGU6IGlzc3VlLmNyZWF0ZWREYXRlLFxuXHRcdFx0XHRcdGxhc3RVcGRhdGVkOiBpc3N1ZS5sYXN0VXBkYXRlZEZvcm1hdHRlZERhdGUsXG5cdFx0XHRcdFx0c3RhdHVzOiBpc3N1ZS5zdGF0dXMsXG5cdFx0XHRcdFx0c3VibWl0dGVyOiBpc3N1ZS5zdWJtaXR0ZXJcblx0XHRcdFx0fTtcblxuXHRcdFx0XHQvLyBjZWxsIGh0bWwgbWFya3VwIGNvbnRhaW5lclxuXHRcdFx0XHR2YXIgY2VsbHMgPSBbXTtcblxuXHRcdFx0XHRmb3IgKGtleSBpbiBpc3N1ZU91dHB1dCkge1xuXHRcdFx0XHRcdC8vIElEIG5lZWRzIHRvIGJlIGxpbmtlZCB0byB0aGUgdGlja2V0XG5cdFx0XHRcdFx0aWYgKGtleSA9PT0gJ2lkJykge1xuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBibWNNZXRhICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgYm1jTWV0YS5zdXBwb3J0ICE9PSAndW5kZWZpbmVkJykge1xuXG5cdFx0XHRcdFx0XHRcdHN1cHBvcnRFbnYgPSAodHlwZW9mIGJtY01ldGEuc3VwcG9ydC5pc3N1ZUVudmlyb25tZW50ICE9PSAndW5kZWZpbmVkJykgPyBibWNNZXRhLnN1cHBvcnQuaXNzdWVFbnZpcm9ubWVudCA6IFwiXCI7XG5cdFx0XHRcdFx0XHRcdHN1cHBvcnRQYXRoID0gKHR5cGVvZiBibWNNZXRhLnN1cHBvcnQuaXNzdWVQYXRoICE9PSAndW5kZWZpbmVkJykgPyBibWNNZXRhLnN1cHBvcnQuaXNzdWVQYXRoIDogXCJcIjtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Y2VsbHMucHVzaCgnPHRkPjxhIGhyZWY9XCInICsgU3VwcG9ydC5Jc3N1ZXMuYnVpbGRTdXBwb3J0SXNzdWVVcmwoc3VwcG9ydEVudiwgc3VwcG9ydFBhdGgsIGlzc3VlLmlkKSArICdcIj4nICsgaXNzdWVPdXRwdXRba2V5XSArICc8L2E+PC90ZD4nKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y2VsbHMucHVzaCgnPHRkPicgKyBpc3N1ZU91dHB1dFtrZXldICsgJzwvdGQ+Jyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0dmFyIHJvdyA9ICc8dHIgZGF0YS1pc3N1ZS1pZD1cIicgKyBpc3N1ZU91dHB1dC5pZCArICdcIj4nICsgY2VsbHMuam9pbignJykgKyAnPC90cj4nO1xuXHRcdFx0XHR2YXIgcm93c0NvbnRhaW5lciA9ICQoU3VwcG9ydC5Jc3N1ZXMuaXNzdWVUYWJsZVdyYXBwZXJTZWxlY3RvcikuZmluZCgndGFibGUgdGJvZHknKTtcblx0XHRcdFx0JChyb3dzQ29udGFpbmVyKS5hcHBlbmQocm93KTtcblx0XHRcdH0sXG5cblx0XHRcdC8qKlxuXHRcdFx0ICogc3RhdGUgaXMgYmFzZWQgb24gdGhlIGtleSBwcm92aWRlZCBieSB0aGUgYXJyYXkgcmV0dXJuZWQgZnJvbSBnZXRNb2R1bGVTdGF0ZUNvbnRhaW5lclNlbGVjdG9yc1xuXHRcdFx0ICovXG5cdFx0XHRzaG93U3RhdGVDb250YWluZXI6IGZ1bmN0aW9uKHNob3dTdGF0ZSkge1xuXG5cdFx0XHRcdHZhciBzdGF0ZXMgPSBTdXBwb3J0Lklzc3Vlcy5nZXRNb2R1bGVTdGF0ZUNvbnRhaW5lclNlbGVjdG9ycygpO1xuXG5cdFx0XHRcdGlmICh0eXBlb2Ygc3RhdGVzW3Nob3dTdGF0ZV0gIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdFx0JChzdGF0ZXNbc2hvd1N0YXRlXSkuZmFkZUluKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBoaWRlIGV4aXN0aW5nIHN0YXRlc1xuXHRcdFx0XHRmb3IgKHN0YXRlIGluIHN0YXRlcykge1xuXHRcdFx0XHRcdGlmIChzdGF0ZSAhPT0gc2hvd1N0YXRlKSB7XG5cdFx0XHRcdFx0XHQkKHN0YXRlc1tzdGF0ZV0pLmhpZGUoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdHJlbW92ZUFsbElzc3VlczogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciByb3dzID0gJChTdXBwb3J0Lklzc3Vlcy5pc3N1ZVRhYmxlV3JhcHBlclNlbGVjdG9yKS5maW5kKCd0YWJsZSB0Ym9keSB0cicpO1xuXHRcdFx0XHRyb3dzLnJlbW92ZSgpO1xuXHRcdFx0fSxcblxuXHRcdFx0c2hvd0lzc3VlczogZnVuY3Rpb24oYW1vdW50KSB7XG5cdFx0XHRcdHZhciBoaWRkZW5Jc3N1ZXMgPSAkKFN1cHBvcnQuSXNzdWVzLnRhYmxlUm93c1NlbGVjdG9yKS5maW5kKCd0ci5oaWRkZW4nKTtcblx0XHRcdFx0dmFyIGNhcHBlZCA9ICQoaGlkZGVuSXNzdWVzKS5zbGljZSgwLCBTdXBwb3J0Lklzc3Vlcy5zaG93QmF0Y2hRdHkpO1xuXHRcdFx0XHR2YXIgcmVtYWluaW5nID0gaGlkZGVuSXNzdWVzLmxlbmd0aCAtIGNhcHBlZC5sZW5ndGg7XG5cblx0XHRcdFx0aWYgKGNhcHBlZC5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0U3VwcG9ydC5Jc3N1ZXMuYWN0aW9ucy5zaG93KGNhcHBlZCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0U3VwcG9ydC5Jc3N1ZXMuYWN0aW9ucy52aWV3QWxsKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBTaG93ZWQgZmluYWwgYmF0Y2hcblx0XHRcdFx0aWYgKHJlbWFpbmluZyA8PSBTdXBwb3J0Lklzc3Vlcy5zaG93QmF0Y2hRdHkpIHtcblx0XHRcdFx0XHRTdXBwb3J0Lklzc3Vlcy5hY3Rpb25zLmFsbFNob3duKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRzaG93OiBmdW5jdGlvbihlbGVtZW50cykge1xuXHRcdFx0XHQkKGVsZW1lbnRzKS5yZW1vdmVDbGFzcyhTdXBwb3J0Lklzc3Vlcy5oaWRkZW5DbGFzcyk7XG5cdFx0XHR9LFxuXHRcdFx0aGlkZTogZnVuY3Rpb24oZWxlbWVudHMpIHtcblx0XHRcdFx0JChlbGVtZW50cykuYWRkQ2xhc3MoU3VwcG9ydC5Jc3N1ZXMuaGlkZGVuQ2xhc3MpO1xuXHRcdFx0fSxcblx0XHRcdGFsbFNob3duOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyIHNob3dNb3JlID0gJChTdXBwb3J0Lklzc3Vlcy5zaG93TW9yZVNlbGVjdG9yKTtcblx0XHRcdFx0dmFyIG5ld0xhYmVsID0gc2hvd01vcmUuZGF0YSgndmlldy1hbGwtbGFiZWwnKTtcblx0XHRcdFx0c2hvd01vcmUuaHRtbChuZXdMYWJlbCk7XG5cdFx0XHR9LFxuXHRcdFx0dmlld0FsbDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciB1cmwgPSAkKFN1cHBvcnQuSXNzdWVzLnNob3dNb3JlU2VsZWN0b3IpLmRhdGEoJ3ZpZXctYWxsLXVybCcpO1xuXHRcdFx0XHRpZiAodXJsKSB7XG5cdFx0XHRcdFx0ZG9jdW1lbnQubG9jYXRpb24gPSB1cmw7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdGZpbmlzaGVkTG9hZGluZzogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQoJy5qcy1hY2NvdW50LWRldGFpbHMtbG9hZGluZycpLmhpZGUoKTtcblx0XHRcdFx0JCgnLnN1cHBvcnQtbm8taXNzdWVzJykuaGlkZSgpLnJlbW92ZUNsYXNzKCdzdXBwb3J0LWhpZGUtd2hpbGUtbG9hZGluZycpO1xuXHRcdFx0XHQkKCcuYWN0aW9uLWRldGFpbHMnKS5yZW1vdmVDbGFzcygnc3VwcG9ydC1oaWRlLXdoaWxlLWxvYWRpbmcnKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0YnVpbGRTdXBwb3J0SXNzdWVVcmw6IGZ1bmN0aW9uKHN1cHBvcnRFbnYsIHN1cHBvcnRQYXRoLCBpc3N1ZUlEKSB7XG5cdFx0XHRyZXR1cm4gc3VwcG9ydEVudiArIHN1cHBvcnRQYXRoICsgaXNzdWVJRDtcblx0XHR9XG5cdH07XG5cblx0U3VwcG9ydC5Db250cm9scyA9IHtcblxuXHRcdGFjdGlvbnM6IHtcblx0XHRcdGZpbmlzaGVkTG9hZGluZzogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQoJy5qcy1hY2NvdW50LWRldGFpbHMtbG9hZGluZycpLmhpZGUoKTtcblx0XHRcdFx0JCgnLnN1cHBvcnQtbm8taXNzdWVzJykuaGlkZSgpLnJlbW92ZUNsYXNzKCdzdXBwb3J0LWhpZGUtd2hpbGUtbG9hZGluZycpO1xuXHRcdFx0XHQkKCcuYWN0aW9uLWRldGFpbHMnKS5yZW1vdmVDbGFzcygnc3VwcG9ydC1oaWRlLXdoaWxlLWxvYWRpbmcnKTtcblx0XHRcdH0sXG5cblx0XHRcdHJlc2V0TG9hZEFjY291bnRFcnJvcjogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQoYWNjb3VudEVycm9yKS5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdGlzc3VlU2hvd01vcmU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0JChTdXBwb3J0Lklzc3Vlcy5zaG93TW9yZVNlbGVjdG9yKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0U3VwcG9ydC5Jc3N1ZXMuYWN0aW9ucy5zaG93SXNzdWVzKFN1cHBvcnQuSXNzdWVzLnNob3dCYXRjaFF0eSk7XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0bG9hZERhdGE6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gTG9hZCBsb2NhbCB0ZXN0IGRhdGEgb3IgZ2V0IHZpYSBhamF4XG5cdFx0XHRpZiAodHlwZW9mIGJtY01ldGEgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBibWNNZXRhLmNkeExvY2FsICE9PSAndW5kZWZpbmVkJyAmJiBibWNNZXRhLmNkeExvY2FsKSB7XG5cdFx0XHRcdFN1cHBvcnQuSXNzdWVzLmxvYWRWaWFVcmwoJy4vdGVzdC9pc3N1ZXMuanNvbicpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0U3VwcG9ydC5Jc3N1ZXMubG9hZFZpYVVybCgnL3RlbXBsYXRlcy9TZXJ2aWNlU3VwcG9ydENhc2VzJyk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gUHJldmVudCBpbml0IGlmIG5vdCBsb2dnZWQgaW4gb3Igbm90IG9uIGxhbmRpbmcgcGFnZVxuXHRcdFx0aWYgKCFTdXBwb3J0LkhlbHBlcnMuaXNBdXRoZW50aWNhdGVkKCkgfHwgIVN1cHBvcnQuSGVscGVycy5pc09uU3VwcG9ydExhbmRpbmdQYWdlKCkpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5pc3N1ZVNob3dNb3JlKCk7XG5cdFx0XHR0aGlzLmxvYWREYXRhKCk7XG5cdFx0fVxuXG5cdH07XG5cblx0U3VwcG9ydC5BbGVydHMgPSB7XG5cblx0XHRpbml0OiBmdW5jdGlvbigpIHtcblxuXHRcdFx0Ly8gbG9jYWwgdmFyc1xuXHRcdFx0dmFyIGZpbmlzaGVkTG9hZGluZyxcblx0XHRcdFx0bWVzc2FnZXNVcmw7XG5cblx0XHRcdC8vIE9iamVjdHNcblx0XHRcdHRoaXMuZGlhbG9nID0gJChcIiNjb25maXJtXCIpO1xuXHRcdFx0dGhpcy50cmlnZ2VyID0gJChcIi5qcy1mYW5jeURpYWxvZ1wiKTtcblxuXHRcdFx0Ly8gQWN0aW9uc1xuXHRcdFx0dGhpcy5jb25maXJtQnV0dG9uID0gXCJDbG9zZVwiO1xuXHRcdFx0dGhpcy5jb25maXJtQ2hlY2tib3ggPSBcIkRvblxcJ3Qgc2hvdyB0aGlzIGFnYWluXCI7XG5cblx0XHRcdC8vIGNhbGxiYWNrIHRvIGhhbmRsZSBtZXNzYWdlcywgcmVnYXJkbGVzcyBvZiBzb3VyY2Vcblx0XHRcdC8vIGhhbmRsZXMgY2FzZSBpbiB0aGUgc2l0dWF0aW9uIHdoZXJlIHRoZXJlIGFyZSBubyBtZXNzYWdlc1xuXHRcdFx0Ly8gb3IgbWVzc2FnZXMgZGF0YSBpcyBmYWxzZXlcblx0XHRcdGZpbmlzaGVkTG9hZGluZyA9IGZ1bmN0aW9uKG1lc3NhZ2VzKSB7XG5cblx0XHRcdFx0Ly8gaGF2ZSBtZXNzYWdlc1xuXHRcdFx0XHRpZiAobWVzc2FnZXMgJiYgbWVzc2FnZXMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdC8vIHNldHMgZ2xvYmFsIGFsZXJ0TWVzc2FnZXNcblx0XHRcdFx0XHRhbGVydE1lc3NhZ2VzID0gbWVzc2FnZXM7XG5cblx0XHRcdFx0XHQvLyBBbGVydCBidXR0b25cblx0XHRcdFx0XHR0aGlzLmFsZXJ0QnV0dG9uKCk7XG5cdFx0XHRcdFx0Ly8gQ2hlY2sgY29va2llc1xuXHRcdFx0XHRcdHRoaXMuY2hlY2tDb29raWVzKHRoaXMubWVzc2FnZXMpO1xuXHRcdFx0XHQvLyBkb24ndCBoYXZlIG1lc3NhZ2VzXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gaW4gYW55IGNhc2UgdGhhdCBkb2Vzbid0IHJlc3VsdCBpbiBsb2FkaW5nLCBoaWRlIHRoZSBhbGVydHMgYnV0dG9uXG5cdFx0XHRcdFx0dGhpcy50cmlnZ2VyLnBhcmVudCgpLnJlbW92ZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHQvLyBtYWludGFpbiBjb250ZXh0XG5cdFx0XHR9LmJpbmQodGhpcyk7XG5cblx0XHRcdC8vIGxvYWQgbWVzc2FnZXMgZGF0YSBmcm9tIGJtY01ldGEgZ2xvYmFsIG9iamVjdFxuXHRcdFx0Ly8gdGhpcy5sb2FkTWVzc2FnZXNGcm9tR2xvYmFsKGZpbmlzaGVkTG9hZGluZyk7XG5cdFx0XHQvL1xuXHRcdFx0Ly8gLS0gT1IgLS1cblx0XHRcdC8vXG5cdFx0XHQvLyBsb2FkIG1lc3NhZ2VzIGRhdGEgZnJvbSBhamF4XG5cdFx0XHQvLyBsb2FkIHJlbGF0aXZlIFVSTCBvbiBibWMuY29tIG9yIGhhcmRjb2RlIFVSTCBzb3VyY2UgZm9yIHRlc3RpbmcgcHVycG9zZXNcblx0XHRcdGlmICggU3VwcG9ydC5IZWxwZXJzLmJtY1N1cHBvcnRMb2FkZWQoKSAmJiBTdXBwb3J0LkhlbHBlcnMuYm1jQWxlcnRzRW5hYmxlZCgpICl7XG5cdFx0XHRcdC8vIGxvY2FsIGRldmVsb3BtZW50OlxuXHRcdFx0XHRpZiAoKHR5cGVvZiBibWNNZXRhLmNkeExvY2FsICE9PSAndW5kZWZpbmVkJykgJiYgYm1jTWV0YS5jZHhMb2NhbCkge1xuXHRcdFx0XHRcdG1lc3NhZ2VzVXJsID0gJ3Rlc3QvYWxlcnRNZXNzYWdlcy5qc29uJztcblx0XHRcdFx0Ly8gZGV2L3N0YWdlL3Byb2Q6XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aWYgKCh0eXBlb2YgYm1jTWV0YS5zdXBwb3J0LmFsZXJ0c1VybCAhPT0gJ3VuZGVmaW5lZCcpICYmIGJtY01ldGEuc3VwcG9ydC5hbGVydHNVcmwpIHtcblx0XHRcdFx0XHRcdG1lc3NhZ2VzVXJsID0gYm1jTWV0YS5zdXBwb3J0LmFsZXJ0c1VybDtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bWVzc2FnZXNVcmwgPSAnL3RlbXBsYXRlcy9TZXJ2aWNlU3VwcG9ydEFsZXJ0c0pTT04nO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLmxvYWRNZXNzYWdlc0Zyb21VcmwoZmluaXNoZWRMb2FkaW5nLCBtZXNzYWdlc1VybCk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdC8vIHdpbGwgcmV0cmlldmUgbWVzc2FnZXMgYnkgdGhlIGJtY01ldGEgZ2xvYmFsXG5cdFx0Ly8gbG9hZHMgb24gbW9kdWxlIGdsb2JhbCB2YXIgYWxlcnRNZXNzYWdlc1xuXHRcdGxvYWRNZXNzYWdlc0Zyb21HbG9iYWw6IGZ1bmN0aW9uKG1lc3NhZ2VzSGFuZGxlcikge1xuXHRcdFx0dmFyIG1lc3NhZ2VzO1xuXG5cdFx0XHRpZiAoU3VwcG9ydC5IZWxwZXJzLmJtY1N1cHBvcnRMb2FkZWQoKSAmJiB0eXBlb2YgYm1jTWV0YS5zdXBwb3J0LmFsZXJ0TWVzc2FnZXMgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdG1lc3NhZ2VzID0gYm1jTWV0YS5zdXBwb3J0LmFsZXJ0TWVzc2FnZXM7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0eXBlb2YgbWVzc2FnZXNIYW5kbGVyID09PSAnZnVuY3Rpb24nKSBtZXNzYWdlc0hhbmRsZXIobWVzc2FnZXMpO1xuXHRcdH0sXG5cblx0XHQvLyBhbGxvd3MgZm9yIGFqYXhpbmcgaW4gbWVzc2FnZSBkYXRhXG5cdFx0bG9hZE1lc3NhZ2VzRnJvbVVybDogZnVuY3Rpb24obWVzc2FnZXNIYW5kbGVyLCB1cmwpIHtcblx0XHRcdCQuYWpheCh1cmwpXG5cdFx0XHRcdC5kb25lKGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0XHQvLyBiYXNlZCBvbiBleGFtcGxlIGpzb24sIGFzc3VtZSByZXNwb25zZSBwYXlsb2FkIGNvbnRhaW5zIGRhdGEgb25cblx0XHRcdFx0XHQvLyBwcm9wZXJ0eSAnc3VwcG9ydEFsZXJ0TWVzc2FnZXMnXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBtZXNzYWdlc0hhbmRsZXIgPT09ICdmdW5jdGlvbicpIG1lc3NhZ2VzSGFuZGxlcihkYXRhLnN1cHBvcnRBbGVydE1lc3NhZ2VzKTtcblx0XHRcdFx0fSlcblx0XHRcdFx0LmZhaWwoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBtZXNzYWdlc0hhbmRsZXIgPT09ICdmdW5jdGlvbicpIG1lc3NhZ2VzSGFuZGxlcihudWxsKTtcblx0XHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdG9wZW5BbGVydDogZnVuY3Rpb24oKSB7XG5cdFx0XHR0aGlzLmZhbmN5Q29uZmlnKHRoaXMubWVzc2FnZXMpO1xuXHRcdH0sXG5cblx0XHRhbGVydEJ1dHRvbjogZnVuY3Rpb24oKSB7XG5cdFx0XHR0aGlzLnRyaWdnZXIub24oXCJjbGlja1wiLCAkLnByb3h5KHRoaXMub3BlbkFsZXJ0LCB0aGlzKSk7XG5cdFx0fSxcblxuXHRcdGNoZWNrQ29va2llczogZnVuY3Rpb24ob3B0aW9ucykge1xuXHRcdFx0Ly8gQ2hlY2sgaWYgY29va2llcyBtYXRjaCBJRHNcblx0XHRcdHZhciBzaG93QWxlcnQgPSBmYWxzZTtcblx0XHRcdGZvciAoaSA9IDA7IGkgPCBhbGVydE1lc3NhZ2VzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdC8vIElmIG5vIGNvb2tpZXMgdGhlbiBzaG93IGFsZXJ0XG5cdFx0XHRcdGlmICgkLmNvb2tpZShhbGVydE1lc3NhZ2VzW2ldLmlkKSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0c2hvd0FsZXJ0ID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKHNob3dBbGVydCkge1xuXHRcdFx0XHR0aGlzLm9wZW5BbGVydCgpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRmYW5jeUNvbmZpZzogZnVuY3Rpb24ob3B0aW9ucykge1xuXHRcdFx0JC5mYW5jeWJveCh0aGlzLmRpYWxvZywge1xuXHRcdFx0XHRhdXRvV2lkdGg6IGZhbHNlLFxuXHRcdFx0XHRtaW5IZWlnaHQ6IDQwMCxcblx0XHRcdFx0bWF4V2lkdGg6IDc0NSxcblx0XHRcdFx0cGFkZGluZzogMCxcblx0XHRcdFx0dHBsOiB7XG5cdFx0XHRcdFx0d3JhcDogJzxkaXYgY2xhc3M9XCJmYW5jeWJveC13cmFwIGZhbmN5Ym94LWRpYWxvZ1wiIHRhYkluZGV4PVwiLTFcIj48ZGl2IGNsYXNzPVwiZmFuY3lib3gtc2tpblwiPjxkaXYgY2xhc3M9XCJmYW5jeWJveC1vdXRlclwiPjxkaXYgY2xhc3M9XCJmYW5jeWJveC10aXRsZVwiPkFsZXJ0IE5vdGlmaWNhdGlvbnM8L2Rpdj48ZGl2IGNsYXNzPVwiZmFuY3lib3gtaW5uZXJcIj48L2Rpdj48L2Rpdj48L2Rpdj48L2Rpdj4nLFxuXHRcdFx0XHRcdGVycm9yOiAnPHAgY2xhc3M9XCJmYW5jeWJveC1lcnJvclwiPlRoZSByZXF1ZXN0ZWQgY29udGVudCBjYW5ub3QgYmUgbG9hZGVkLjxici8+UGxlYXNlIHRyeSBhZ2FpbiBsYXRlci48L3A+J1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRoZWxwZXJzOiB7XG5cdFx0XHRcdFx0b3ZlcmxheToge1xuXHRcdFx0XHRcdFx0Y2xvc2VDbGljazogdHJ1ZSwgLy8gaWYgdHJ1ZSwgZmFuY3lCb3ggd2lsbCBiZSBjbG9zZWQgd2hlbiB1c2VyIGNsaWNrcyBvbiB0aGUgb3ZlcmxheVxuXHRcdFx0XHRcdFx0c3BlZWRPdXQ6IDIwMCwgLy8gZHVyYXRpb24gb2YgZmFkZU91dCBhbmltYXRpb25cblx0XHRcdFx0XHRcdHNob3dFYXJseTogdHJ1ZSwgLy8gaW5kaWNhdGVzIGlmIHNob3VsZCBiZSBvcGVuZWQgaW1tZWRpYXRlbHkgb3Igd2FpdCB1bnRpbCB0aGUgY29udGVudCBpcyByZWFkeVxuXHRcdFx0XHRcdFx0Y3NzOiB7fSwgLy8gY3VzdG9tIENTUyBwcm9wZXJ0aWVzXG5cdFx0XHRcdFx0XHRsb2NrZWQ6IHRydWUgLy8gaWYgdHJ1ZSwgdGhlIGNvbnRlbnQgd2lsbCBiZSBsb2NrZWQgaW50byBvdmVybGF5XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRiZWZvcmVTaG93OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQvLyBBZGQgY29udGFpbmVyc1xuXHRcdFx0XHRcdHRoaXMuY29udGVudC5hcHBlbmQoXCI8ZGl2IGNsYXNzPSdtZXNzYWdlcyc+PC9kaXY+PGRpdiBjbGFzcz0nYWN0aW9uJz48L2Rpdj5cIik7XG5cdFx0XHRcdFx0Ly8gQWRkIG1lc3NhZ2VzXG5cdFx0XHRcdFx0dGhpcy5tZXNzYWdlcyA9IHRoaXMuY29udGVudC5maW5kKFwiLm1lc3NhZ2VzXCIpO1xuXHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBhbGVydE1lc3NhZ2VzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHR0aGlzLm1lc3NhZ2VzLmFwcGVuZChcIjxoMyBjbGFzcz0ndGl0bGUnPlwiICsgYWxlcnRNZXNzYWdlc1tpXS50aXRsZSArIFwiPC9oMz5cIik7XG5cdFx0XHRcdFx0XHR0aGlzLm1lc3NhZ2VzLmFwcGVuZChcIjxwIGNsYXNzPSdtZXNzYWdlJz5cIiArIGFsZXJ0TWVzc2FnZXNbaV0ubWVzc2FnZSArIFwiPC9wPlwiKTtcblx0XHRcdFx0XHRcdGlmIChhbGVydE1lc3NhZ2VzW2ldLmxpbmspIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5tZXNzYWdlcy5hcHBlbmQoJzxwIGNsYXNzPVwibGlua1wiPjxhIGhyZWY9XCInICsgYWxlcnRNZXNzYWdlc1tpXS51cmwgKyAnXCI+JyArIGFsZXJ0TWVzc2FnZXNbaV0ubGluayArICc8L2E+PC9wPicpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvLyBBZGQgbW9iaWxlIGJ1dHRvblxuXHRcdFx0XHRcdHRoaXMubWVzc2FnZXMuYXBwZW5kKCc8cCBzdHlsZT1cInRleHQtYWxpZ246cmlnaHRcIj48aW5wdXQgdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGFjdGlvbi1idXR0b25cIiB2YWx1ZT1cIicgKyBTdXBwb3J0LkFsZXJ0cy5jb25maXJtQnV0dG9uICsgJ1wiLz48L3A+Jyk7XG5cdFx0XHRcdFx0Ly8gQWRkIGNvbnRyb2xzXG5cdFx0XHRcdFx0dGhpcy5jb250ZW50LmZpbmQoXCIuYWN0aW9uXCIpLmFwcGVuZCgnPGlucHV0IHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBhY3Rpb24tYnV0dG9uXCIgdmFsdWU9XCInICsgU3VwcG9ydC5BbGVydHMuY29uZmlybUJ1dHRvbiArICdcIi8+PGxhYmVsIGNsYXNzPVwiYWN0aW9uLWNoZWNrYm94XCI+PGlucHV0IHR5cGU9XCJjaGVja2JveFwiIC8+JyArIFN1cHBvcnQuQWxlcnRzLmNvbmZpcm1DaGVja2JveCArICc8L2xhYmVsPicpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRhZnRlclNob3c6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHZhciBhbGVydEIgPSB0aGlzLmNvbnRlbnQuZmluZChcIi5hY3Rpb24tYnV0dG9uXCIpLFxuXHRcdFx0XHRcdFx0YWN0aW9uQiA9IHRoaXMuY29udGVudC5maW5kKFwiLmFjdGlvbiAuYWN0aW9uLWJ1dHRvblwiKSxcblx0XHRcdFx0XHRcdGFsZXJ0QyA9IHRoaXMuY29udGVudC5maW5kKFwiLmFjdGlvbi1jaGVja2JveCBpbnB1dFwiKSxcblx0XHRcdFx0XHRcdGFsZXJ0WCA9ICQoJy5mYW5jeWJveC1kaWFsb2cgLmZhbmN5Ym94LWNsb3NlJyk7XG5cdFx0XHRcdFx0Y2xvc2VEaWFsb2cgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdC8vIENyZWF0ZSBjb29raWUgaWYgY2hlY2tib3ggaXMgY2hlY2tlZFxuXHRcdFx0XHRcdFx0aWYgKGFsZXJ0Qy5pcygnOmNoZWNrZWQnKSkge1xuXHRcdFx0XHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgYWxlcnRNZXNzYWdlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdCQuY29va2llKGFsZXJ0TWVzc2FnZXNbaV0uaWQsIGFsZXJ0TWVzc2FnZXNbaV0uaWQsIHtcblx0XHRcdFx0XHRcdFx0XHRcdGV4cGlyZXM6IDM2NSxcblx0XHRcdFx0XHRcdFx0XHRcdHBhdGg6IFwiL1wiLFxuXHRcdFx0XHRcdFx0XHRcdFx0ZG9tYWluOiBcIi5ibWMuY29tXCJcblx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0JC5mYW5jeWJveC5jbG9zZSgpO1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0Ly8gQ2hlY2sgaWYgdGV4dCBvdmVyZmxvd3MgbWVzc2FnZSBjb250YWluZXJcblx0XHRcdFx0XHRpZiAodGhpcy5tZXNzYWdlc1swXS5zY3JvbGxIZWlnaHQgPiB0aGlzLm1lc3NhZ2VzLmlubmVySGVpZ2h0KCkpIHtcblx0XHRcdFx0XHRcdGFjdGlvbkIucHJvcChcImRpc2FibGVkXCIsIHRydWUpO1xuXHRcdFx0XHRcdFx0dGhpcy5tZXNzYWdlcy5iaW5kKCdzY3JvbGwnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0aWYgKCQodGhpcylbMF0uc2Nyb2xsSGVpZ2h0IC0gJCh0aGlzKS5zY3JvbGxUb3AoKSA8PSAkKHRoaXMpLmlubmVySGVpZ2h0KCkpIHtcblx0XHRcdFx0XHRcdFx0XHRhY3Rpb25CLnByb3AoXCJkaXNhYmxlZFwiLCBmYWxzZSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvLyBDbG9zZSBkaWFsb2cgd2hlbiBidXR0b25zIGFyZSBjbGlja2VkXG5cdFx0XHRcdFx0YWxlcnRCLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRjbG9zZURpYWxvZygpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGFsZXJ0WC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0Y2xvc2VEaWFsb2coKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSxcblx0XHRcdFx0YWZ0ZXJDbG9zZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Ly8gUmVtb3ZlIGRpYWxvZyBjb250ZW50XG5cdFx0XHRcdFx0dGhpcy5jb250ZW50Lmh0bWwoXCJcIik7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fTtcblxuXHRTdXBwb3J0LkdldHRpbmdTdGFydGVkQ2Fyb3VzZWwgPSB7XG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0XHQkKCcuc3VwcG9ydC1nZXR0aW5nLXN0YXJ0ZWQtdG9waWNzLmNhcm91c2VsIC50b3BpY3MnKS5vd2xDYXJvdXNlbCh7XG5cdFx0XHRcdGl0ZW1zOiAxLFxuXHRcdFx0XHRuYXY6IGZhbHNlXG5cdFx0XHR9KTtcblx0XHR9XG5cdH07XG5cblx0U3VwcG9ydC5Ub2dnbGVTZWFyY2hBcmVhcyA9IHtcblxuXHRcdHNlYXJjaEFyZWFzU2VsZWN0b3I6ICcuanMtc3VwcG9ydC1zZWFyY2gtYXJlYScsXG5cdFx0dG9nZ2xlQWN0aW9uU2VsZWN0b3I6ICcuanMtc3VwcG9ydC1zZWFyY2gtdG9nZ2xlJyxcblx0XHR0b2dnbGVBY3Rpb25MYWJlbFNlbGVjdG9yOiAnLmpzLXN1cHBvcnQtc2VhcmNoLXRvZ2dsZScsXG5cdFx0dG9nZ2xlTGFiZWxUZXh0OiB7XG5cdFx0XHRleHBhbmQ6ICdNb3JlIFJlc291cmNlcycsXG5cdFx0XHRjb2xsYXBzZTogJ0NvbGxhcHNlJ1xuXHRcdH0sXG5cdFx0dG9nZ2xhYmxlQXJlYXM6IG51bGwsXG5cdFx0ZWxlbWVudHNTaG93bjogZmFsc2UsXG5cdFx0aGlkZUxhc3RRdHk6IDQsXG5cblx0XHRpbml0OiBmdW5jdGlvbigpIHtcblxuXHRcdFx0Ly8gb25seSBpbml0aWFsaXplIGlmIC5qcy1zdXBwb3J0LXNlYXJjaC10b2dnbGUtZXh0cmEgZXhpc3RzXG5cdFx0XHRpZiAoJCgnLmpzLXN1cHBvcnQtc2VhcmNoLXRvZ2dsZS1leHRyYScpLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIFNFVFVQXG5cdFx0XHR0aGlzLmZpbmRUb2dnbGFibGVFbGVtZW50cygpO1xuXHRcdFx0dGhpcy5hZGRIYW5kbGVycygpO1xuXG5cdFx0XHQvLyBJTklUSUFMIEFDVElPTlNcblx0XHRcdHRoaXMuYWN0aW9ucy5oaWRlKHRoaXMuaGVscGVycy5oaWRlRWxlbWVudHNJbnN0YW50KTtcblx0XHRcdHRoaXMuYWN0aW9ucy51cGRhdGVMYWJlbCh0aGlzLnRvZ2dsZUxhYmVsVGV4dC5leHBhbmQpO1xuXHRcdH0sXG5cblx0XHRoZWxwZXJzOiB7XG5cdFx0XHRzaG93RWxlbWVudHNGYWRlOiBmdW5jdGlvbihlbGVtZW50cykge1xuXHRcdFx0XHRyZXR1cm4gJChlbGVtZW50cykuZmFkZUluKCk7XG5cdFx0XHR9LFxuXHRcdFx0c2hvd0VsZW1lbnRzSW5zdGFudDogZnVuY3Rpb24oZWxlbWVudHMpIHtcblx0XHRcdFx0cmV0dXJuICQoZWxlbWVudHMpLnNob3coKTtcblx0XHRcdH0sXG5cdFx0XHRoaWRlRWxlbWVudHNGYWRlOiBmdW5jdGlvbihlbGVtZW50cykge1xuXHRcdFx0XHRyZXR1cm4gJChlbGVtZW50cykuZmFkZU91dCgpO1xuXHRcdFx0fSxcblx0XHRcdGhpZGVFbGVtZW50c0luc3RhbnQ6IGZ1bmN0aW9uKGVsZW1lbnRzKSB7XG5cdFx0XHRcdHJldHVybiAkKGVsZW1lbnRzKS5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdGZpbmRUb2dnbGFibGVFbGVtZW50czogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgc2VhcmNoQXJlYXMgPSAkKHRoaXMuc2VhcmNoQXJlYXNTZWxlY3Rvcik7XG5cdFx0XHR2YXIgc2xpY2VGcm9tID0gc2VhcmNoQXJlYXMubGVuZ3RoIC0gdGhpcy5oaWRlTGFzdFF0eTtcblx0XHRcdHZhciBzbGljZVRvID0gc2VhcmNoQXJlYXMubGVuZ3RoO1xuXHRcdFx0dGhpcy50b2dnbGFibGVBcmVhcyA9IHNlYXJjaEFyZWFzLnNsaWNlKHNsaWNlRnJvbSwgc2xpY2VUbyk7XG5cdFx0fSxcblxuXHRcdGFjdGlvbnM6IHtcblx0XHRcdHRvZ2dsZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmIChTdXBwb3J0LlRvZ2dsZVNlYXJjaEFyZWFzLmVsZW1lbnRzU2hvd24pIHtcblx0XHRcdFx0XHR0aGlzLmhpZGUoU3VwcG9ydC5Ub2dnbGVTZWFyY2hBcmVhcy5oZWxwZXJzLmhpZGVFbGVtZW50c0ZhZGUpO1xuXHRcdFx0XHRcdHRoaXMudXBkYXRlTGFiZWwoU3VwcG9ydC5Ub2dnbGVTZWFyY2hBcmVhcy50b2dnbGVMYWJlbFRleHQuZXhwYW5kKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aGlzLnNob3coU3VwcG9ydC5Ub2dnbGVTZWFyY2hBcmVhcy5oZWxwZXJzLnNob3dFbGVtZW50c0ZhZGUpO1xuXHRcdFx0XHRcdHRoaXMudXBkYXRlTGFiZWwoU3VwcG9ydC5Ub2dnbGVTZWFyY2hBcmVhcy50b2dnbGVMYWJlbFRleHQuY29sbGFwc2UpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0c2hvdzogZnVuY3Rpb24oZWxlbWVudHNIYW5kbGVyKSB7XG5cdFx0XHRcdGlmICh0eXBlb2YgZWxlbWVudHNIYW5kbGVyID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0ZWxlbWVudHNIYW5kbGVyKCQoU3VwcG9ydC5Ub2dnbGVTZWFyY2hBcmVhcy50b2dnbGFibGVBcmVhcykpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0U3VwcG9ydC5Ub2dnbGVTZWFyY2hBcmVhcy5lbGVtZW50c1Nob3duID0gdHJ1ZTtcblx0XHRcdH0sXG5cdFx0XHRoaWRlOiBmdW5jdGlvbihlbGVtZW50c0hhbmRsZXIpIHtcblx0XHRcdFx0aWYgKHR5cGVvZiBlbGVtZW50c0hhbmRsZXIgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRlbGVtZW50c0hhbmRsZXIoJChTdXBwb3J0LlRvZ2dsZVNlYXJjaEFyZWFzLnRvZ2dsYWJsZUFyZWFzKSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRTdXBwb3J0LlRvZ2dsZVNlYXJjaEFyZWFzLmVsZW1lbnRzU2hvd24gPSBmYWxzZTtcblx0XHRcdH0sXG5cdFx0XHR1cGRhdGVMYWJlbDogZnVuY3Rpb24odGV4dCkge1xuXHRcdFx0XHQkKFN1cHBvcnQuVG9nZ2xlU2VhcmNoQXJlYXMudG9nZ2xlQWN0aW9uTGFiZWxTZWxlY3RvcikuaHRtbCh0ZXh0KTtcblx0XHRcdH1cblx0XHR9LFxuXG5cblx0XHRhZGRIYW5kbGVyczogZnVuY3Rpb24oKSB7XG5cdFx0XHQkKHRoaXMudG9nZ2xlQWN0aW9uU2VsZWN0b3IpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR0aGlzLmFjdGlvbnMudG9nZ2xlKCk7XG5cdFx0XHR9LmJpbmQodGhpcykpO1xuXHRcdH1cblx0fTtcblxuXHRTdXBwb3J0Lk1lbnUgPSB7XG5cblx0XHRkZXNrdG9wQnJlYWtwb2ludDogOTYwLFxuXG5cdFx0Ly8gdG91Y2hIYW5kbGVycyByZXF1aXJlIGEgYGNsaWNrYCB0byB0cmlnZ2VyIGEgbWVudVxuXHRcdHRvdWNoSGFuZGxlcnM6IGZ1bmN0aW9uKGFkYXB0ZXIpIHtcblx0XHRcdHZhciBtZW51ID0gYWRhcHRlci5tZW51O1xuXHRcdFx0JChtZW51LnN1Yk1lbnVUcmlnZ2VyU2VsZWN0b3IpLm9uKHtcblx0XHRcdFx0J2NsaWNrJzogZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRcdGlmICghJChtZW51LnN1Yk1lbnVTZWxlY3RvcikuaGFzKCQoZS50YXJnZXQpKSkge1xuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR2YXIgc3ViTWVudSA9IG1lbnUuZmluZE1lbnVGcm9tVGFyZ2V0KGUudGFyZ2V0KTtcblxuXHRcdFx0XHRcdGlmIChzdWJNZW51Lmhhc0NsYXNzKG1lbnUuZXhwYW5kZWRDbGFzcykpIHtcblx0XHRcdFx0XHRcdG1lbnUuY29sbGFwc2VNZW51KHN1Yk1lbnUpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRtZW51LmNvbGxhcHNlQWxsU3ViTWVudXMoKTtcblx0XHRcdFx0XHRcdG1lbnUuZXhwYW5kTWVudShzdWJNZW51KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0sXG5cblx0XHQvLyAgbm9Ub3VjaEhhbmRsZXJzIGFzc3VtZXMgYSBtb3VzZSwgYW5kIHVzZXMgYSBgaG92ZXJgIHRvIHRyaWdnZXIgYSBtZW51XG5cdFx0bm9Ub3VjaEhhbmRsZXJzOiBmdW5jdGlvbihhZGFwdGVyKSB7XG5cdFx0XHR2YXIgbWVudSA9IGFkYXB0ZXIubWVudTtcblx0XHRcdCQobWVudS5zdWJNZW51VHJpZ2dlclNlbGVjdG9yKS5vbih7XG5cdFx0XHRcdCdtb3VzZWVudGVyJzogZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRcdG1lbnUuY29sbGFwc2VBbGxTdWJNZW51cygpO1xuXHRcdFx0XHRcdHZhciBzdWJNZW51ID0gbWVudS5maW5kTWVudUZyb21UYXJnZXQoZS50YXJnZXQpO1xuXHRcdFx0XHRcdG1lbnUuZXhwYW5kTWVudShzdWJNZW51KTtcblx0XHRcdFx0fSxcblx0XHRcdFx0J21vdXNlbGVhdmUnOiBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdFx0bWVudS5jb2xsYXBzZUFsbFN1Yk1lbnVzKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0sXG5cblx0XHQvLyBSZWdpc3RlciBjbGlja3MgdGhhdCBoYXBwZW4gb3V0c2lkZSB0aGUgbWVudSwgYW5kIGRpc21pc3MgdGhlIG1lbnVcblx0XHRjb2xsYXBzZU91dHNpZGVIYW5kbGVyOiBmdW5jdGlvbihhZGFwdGVyKSB7XG5cdFx0XHR2YXIgbWVudSA9IGFkYXB0ZXIubWVudTtcblx0XHRcdHZhciBtZW51RWxlbWVudCA9ICQobWVudS5tZW51RWxlbWVudCk7XG5cblx0XHRcdCQoJ2JvZHknKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdGlmICghJChlLnRhcmdldCkucGFyZW50cygpLmFkZEJhY2soKS5pcyhtZW51RWxlbWVudCkpIHtcblx0XHRcdFx0XHRtZW51LmNvbGxhcHNlQWxsU3ViTWVudXMoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdC8vIGJvdGggYHRvdWNoSGFuZGxlcnNgIGFuZCBgbm9Ub3VjaEhhbmRsZXJzYCB1c2UgdGhlIHNhbWVcblx0XHQvLyBlbGVtZW50IHRvIGF0dGFjaCBoYW5kbGVycyB0bywgdGhlcmVmb3JlIGNhbiB1c2UgdGhlIHNhbWVcblx0XHQvLyBmdW5jdGlvbiB0byByZW1vdmUgdGhlIGhhbmRsZXJzXG5cdFx0ZGVzdG9yeUhhbmRsZXJzOiBmdW5jdGlvbihhZGFwdGVyKSB7XG5cdFx0XHR2YXIgbWVudSA9IGFkYXB0ZXIubWVudTtcblx0XHRcdCQobWVudS5zdWJNZW51VHJpZ2dlclNlbGVjdG9yKS5vZmYoKTtcblx0XHR9LFxuXG5cdFx0Z2V0TWVudTogZnVuY3Rpb24oKSB7XG5cdFx0XHQvLyBnZW5lcmF0ZSBtZW51IGJhc2VkIG9uIHNlbGVjdG9yXG5cdFx0XHR2YXIgbWVudSA9IG1lbnVqcy5nZW5lcmF0ZU1lbnUoe1xuXHRcdFx0XHRtZW51RWxlbWVudDogJCgnLnN1cHBvcnQtbWVudScpXG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIG1lbnU7XG5cdFx0fSxcblxuXHRcdGdldEFkYXB0ZXJzOiBmdW5jdGlvbihtZW51KSB7XG5cdFx0XHR2YXIgc3VwcG9ydE1lbnUgPSB0aGlzO1xuXG5cdFx0XHQvLyBjcmVhdGUgZGVza3RvcCBhZGFwdGVyXG5cdFx0XHR2YXIgZGVza3RvcEFkYXB0ZXIgPSBtZW51QWRhcHRlci5nZW5lcmF0ZU1lbnVBZGFwdGVyKG1lbnUsIHtcblx0XHRcdFx0aGFuZGxlcnM6IFt7XG5cdFx0XHRcdFx0c2V0dXA6IHN1cHBvcnRNZW51LnRvdWNoSGFuZGxlcnMsXG5cdFx0XHRcdFx0ZGVzdHJveTogc3VwcG9ydE1lbnUuZGVzdG9yeUhhbmRsZXJzXG5cdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRzZXR1cDogc3VwcG9ydE1lbnUuY29sbGFwc2VPdXRzaWRlSGFuZGxlcixcblx0XHRcdFx0XHRkZXN0cm95OiBzdXBwb3J0TWVudS5kZXN0b3J5SGFuZGxlcnNcblx0XHRcdFx0fV0sXG5cdFx0XHRcdGluaXQ6IGZ1bmN0aW9uKGFkYXB0ZXIpIHtcblx0XHRcdFx0XHQkKGFkYXB0ZXIubWVudS5tZW51RWxlbWVudCkuYWRkQ2xhc3MoJ2Rlc2t0b3AnKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0dGVhcmRvd246IGZ1bmN0aW9uKGFkYXB0ZXIpIHtcblx0XHRcdFx0XHQkKGFkYXB0ZXIubWVudS5tZW51RWxlbWVudCkucmVtb3ZlQ2xhc3MoJ2Rlc2t0b3AnKTtcblx0XHRcdFx0XHRhZGFwdGVyLm1lbnUuY29sbGFwc2VBbGxTdWJNZW51cygpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gY3JlYXRlIG1vYmlsZSBhZGFwdGVyXG5cdFx0XHQvLyBtb2JpbGVBZGFwdGVyIHN0YXJ0aW5nIHBvaW50IGlzIGEgY29weSBvZiBkZXNrdG9wIGFkYXB0ZXJcblx0XHRcdHZhciBtb2JpbGVBZGFwdGVyID0gbWVudUFkYXB0ZXIuZ2VuZXJhdGVNZW51QWRhcHRlcihtZW51LCB7XG5cdFx0XHRcdGhhbmRsZXJzOiBbe1xuXHRcdFx0XHRcdHNldHVwOiBzdXBwb3J0TWVudS50b3VjaEhhbmRsZXJzLFxuXHRcdFx0XHRcdGRlc3Ryb3k6IGZ1bmN0aW9uKGFkYXB0ZXIpIHtcblx0XHRcdFx0XHRcdHJldHVybiBzdXBwb3J0TWVudS5kZXN0b3J5SGFuZGxlcnMoYWRhcHRlcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XSwgLy8gYXNzdW1lIG5vIGhvdmVyIGludGVyYWN0aW9uc1xuXHRcdFx0XHRpbml0OiBmdW5jdGlvbihhZGFwdGVyKSB7XG5cdFx0XHRcdFx0JChhZGFwdGVyLm1lbnUubWVudUVsZW1lbnQpLmFkZENsYXNzKCdtb2JpbGUnKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0dGVhcmRvd246IGZ1bmN0aW9uKGFkYXB0ZXIpIHtcblx0XHRcdFx0XHQkKGFkYXB0ZXIubWVudS5tZW51RWxlbWVudCkucmVtb3ZlQ2xhc3MoJ21vYmlsZScpO1xuXHRcdFx0XHRcdGFkYXB0ZXIubWVudS5jb2xsYXBzZUFsbFN1Yk1lbnVzKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHR2YXIgYWxsQWRhcHRlcnMgPSB7XG5cdFx0XHRcdG1vYmlsZTogbW9iaWxlQWRhcHRlcixcblx0XHRcdFx0ZGVza3RvcDogZGVza3RvcEFkYXB0ZXJcblx0XHRcdH07XG5cdFx0XHRyZXR1cm4gYWxsQWRhcHRlcnM7XG5cdFx0fSxcblxuXHRcdGdldEFkYXB0ZXJNYW5hZ2VyOiBmdW5jdGlvbihtZW51LCBhZGFwdGVycykge1xuXHRcdFx0dmFyIGFkYXB0ZXJNYW5hZ2VyID0gZ2VuZXJhdGVNZW51QWRhcHRlck1hbmFnZXIoKTtcblx0XHRcdHJldHVybiBhZGFwdGVyTWFuYWdlcjtcblx0XHR9LFxuXG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbWVudSA9IHRoaXMuZ2V0TWVudSgpO1xuXHRcdFx0dmFyIGFkYXB0ZXJzID0gdGhpcy5nZXRBZGFwdGVycyhtZW51KTtcblx0XHRcdHZhciBhZGFwdGVyTWFuYWdlciA9IHRoaXMuZ2V0QWRhcHRlck1hbmFnZXIobWVudSwgYWRhcHRlcnMpO1xuXG5cdFx0XHR2YXIgaXNEZXNrdG9wID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdC8vIGluIGNhc2UgbWVkaWEgcXVlcmllcyBhcmVuJ3Qgc3VwcG9ydGVkIGJ5IHRoZSBicm93c2VyLCB0aGVuIGRlZmF1bHQgdG8gdXNpbmcgdGhlIHdpZHRoIG9mIHRoZSB3aW5kb3dcblx0XHRcdFx0cmV0dXJuIE1vZGVybml6ci5tcSgnKG1pbi13aWR0aDogJyArIFN1cHBvcnQuTWVudS5kZXNrdG9wQnJlYWtwb2ludCArICdweCknKSB8fCAkKHdpbmRvdykud2lkdGgoKSA+PSBTdXBwb3J0Lk1lbnUuZGVza3RvcEJyZWFrcG9pbnQ7XG5cdFx0XHR9O1xuXHRcdFx0dmFyIGlzTW9iaWxlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiAhaXNEZXNrdG9wKCk7XG5cdFx0XHR9O1xuXG5cdFx0XHQvLyBBZGQgYWRhcHRlciBmb3IgdmFyaW91cyBjb25kaXRpb25zLCBvbiB0aGUgYWRhcHRlciBtYW5hZ2VyXG5cdFx0XHRhZGFwdGVyTWFuYWdlci5hZGRDb25kaXRpb24oZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBpc0Rlc2t0b3AoKTtcblx0XHRcdH0sIGFkYXB0ZXJzLmRlc2t0b3ApO1xuXG5cdFx0XHRhZGFwdGVyTWFuYWdlci5hZGRDb25kaXRpb24oZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBpc01vYmlsZSgpO1xuXHRcdFx0fSwgYWRhcHRlcnMubW9iaWxlKTtcblxuXHRcdFx0YWRhcHRlck1hbmFnZXIuaW5pdCgpO1xuXHRcdH1cblx0fTtcblxuXHRTdXBwb3J0Lk1vYmlsZVRvZ2dsZUhlYWRlciA9IHtcblxuXHRcdGJhc2VIZWlnaHQ6IG51bGwsXG5cdFx0bWF4SGVpZ2h0OiAxNTAwLFxuXHRcdGJyZWFrcG9pbnRUb2dnbGU6IDk2MCxcblxuXHRcdGFjdGlvbnM6IHtcblx0XHRcdG9wZW46IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkKCcuc3VwcG9ydC1oZWFkZXInKS5hZGRDbGFzcygnZXhwYW5kZWQnKTtcblx0XHRcdFx0JCgnLnN1cHBvcnQtaGVhZGVyJykuY3NzKCdtYXgtaGVpZ2h0JywgJzEyMDBweCcpO1xuXHRcdFx0fSxcblx0XHRcdGNsb3NlOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0dGhpcy5zZXRIZWlnaHRBc0Jhc2VIZWlnaHQoKTtcblx0XHRcdH0sXG5cdFx0XHRzZXRIZWlnaHRBc0Jhc2VIZWlnaHQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkKCcuc3VwcG9ydC1oZWFkZXInKS5jc3MoJ21heC1oZWlnaHQnLCBTdXBwb3J0Lk1vYmlsZVRvZ2dsZUhlYWRlci5iYXNlSGVpZ2h0ICsgJ3B4Jyk7XG5cblx0XHRcdFx0Ly8gYnkgZGVmYXVsdCBvdGhlciBicm93c2VycyB3aWxsIHRyaWdnZXIgY2xvc2Ugb24gYWRkSGFuZGxlcnMgYXQgdGhlIGVuZCBvZiB0aGUgY3NzIHRyYW5zaXRpb25cblx0XHRcdFx0Ly8gaWU4IHdpbGwgbmV2ZXIgdHJpZ2dlciB0aGUgZW5kIGNzcyB0cmFuc2l0aW9uIGV2ZW50IGFzIGl0IGRvZXNuJ3Qgc3VwcG9ydCB0cmFuc2l0aW9uc1xuXHRcdFx0XHRpZiAoJCgnaHRtbCcpLmhhc0NsYXNzKCdvbGRpZScpKSB7XG5cdFx0XHRcdFx0JCgnLnN1cHBvcnQtaGVhZGVyJykudHJpZ2dlcigndHJhbnNpdGlvbmVuZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0YXBwbHlJZk1vYmlsZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdC8vIGlmIGRlc2t0b3AsIHJlbW92ZSBtYXgtaGVpZ2h0IGFuZCBleHBhbmRlZCBjbGFzc1xuXHRcdFx0XHQvLyBpbiBjYXNlIG1lZGlhIHF1ZXJpZXMgYXJlbid0IHN1cHBvcnRlZCBieSB0aGUgYnJvd3NlciwgdGhlbiBkZWZhdWx0IHRvIHVzaW5nIHRoZSB3aWR0aCBvZiB0aGUgd2luZG93XG5cdFx0XHRcdHZhciBpc0Rlc2t0b3AgPSBNb2Rlcm5penIubXEoJyhtaW4td2lkdGg6ICcgKyBTdXBwb3J0Lk1vYmlsZVRvZ2dsZUhlYWRlci5icmVha3BvaW50VG9nZ2xlICsgJ3B4KScpIHx8ICQod2luZG93KS53aWR0aCgpID49IFN1cHBvcnQuTWVudS5kZXNrdG9wQnJlYWtwb2ludDtcblx0XHRcdFx0aWYgKGlzRGVza3RvcCkge1xuXHRcdFx0XHRcdCQoJy5zdXBwb3J0LWhlYWRlcicpLmNzcygnbWF4LWhlaWdodCcsICcnKTtcblx0XHRcdFx0XHQkKCcuc3VwcG9ydC1oZWFkZXInKS5yZW1vdmVDbGFzcygnZXhwYW5kZWQnKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAoJCgnLnN1cHBvcnQtaGVhZGVyJykuaGFzQ2xhc3MoJ2V4cGFuZGVkJykpIHtcblx0XHRcdFx0XHRcdHRoaXMub3BlbigpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR0aGlzLmNsb3NlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdGNhbGNCYXNlSGVpZ2h0OiBmdW5jdGlvbigpIHtcblx0XHRcdC8vIGlmIHRoZSBoZWlnaHQgc2hvdWxkIGJlIGRldGVybWluZWQgZHluYW1pY2FsbHlcblx0XHRcdC8vIHRoaXMuYmFzZUhlaWdodCA9ICQoJy5sb2dvLWJhci1jb250YWluZXInKS5oZWlnaHQoKTtcblxuXHRcdFx0dGhpcy5iYXNlSGVpZ2h0ID0gOTA7XG5cdFx0fSxcblxuXHRcdGFkZEhhbmRsZXJzOiBmdW5jdGlvbigpIHtcblxuXHRcdFx0JCgnLmpzLXRvZ2dsZS1vcGVuLWhlYWRlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoJCgnLnN1cHBvcnQtaGVhZGVyJykuaGFzQ2xhc3MoJ2V4cGFuZGVkJykpIHtcblx0XHRcdFx0XHRTdXBwb3J0Lk1vYmlsZVRvZ2dsZUhlYWRlci5hY3Rpb25zLmNsb3NlKCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0U3VwcG9ydC5Nb2JpbGVUb2dnbGVIZWFkZXIuYWN0aW9ucy5vcGVuKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHQkKCcuc3VwcG9ydC1oZWFkZXInKS5vbigndHJhbnNpdGlvbmVuZCB3ZWJraXRUcmFuc2l0aW9uRW5kIG9UcmFuc2l0aW9uRW5kIE1TVHJhbnNpdGlvbkVuZCcsIGZ1bmN0aW9uKCkge1xuXG5cdFx0XHRcdC8vIHRyYW5zaXRpb24gaGFzIGVuZGVkIGFuZCBhdCBlbmQgaGVpZ2h0IHBvc2l0aW9uXG5cdFx0XHRcdGlmICgkKCcuc3VwcG9ydC1oZWFkZXInKS5oZWlnaHQoKSA9PT0gU3VwcG9ydC5Nb2JpbGVUb2dnbGVIZWFkZXIuYmFzZUhlaWdodCB8fCAkKCdodG1sJykuaGFzQ2xhc3MoJ29sZGllJykpIHtcblx0XHRcdFx0XHQkKCcuc3VwcG9ydC1oZWFkZXInKS5yZW1vdmVDbGFzcygnZXhwYW5kZWQnKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdCQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRTdXBwb3J0Lk1vYmlsZVRvZ2dsZUhlYWRlci5hY3Rpb25zLmFwcGx5SWZNb2JpbGUoKTtcblx0XHRcdH0pO1xuXG5cdFx0fSxcblxuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0d2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHNlbGYuY2FsY0Jhc2VIZWlnaHQoKTtcblx0XHRcdFx0c2VsZi5hZGRIYW5kbGVycygpO1xuXHRcdFx0XHRzZWxmLmFjdGlvbnMuYXBwbHlJZk1vYmlsZSgpO1xuXHRcdFx0fSwgMCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIHVzZWQgdG8gYXR0YWNoIHRoZSBjbGFzcyBvbiBsb2FkIHRvIHRyYW5zaXRpb24gdGhlIGZpeGVkIHNpZGUgaW50byB2aWV3XG5cdFN1cHBvcnQuU2xpZGVJblN1cHBvcnRDaGF0QnV0dG9uID0ge1xuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyICRjaGF0Tm93ID0gJCgnLnN1cHBvcnQtY2hhdC1ub3csIC5jaGF0LW5vdy1saW5rJyk7XG5cdFx0XHRpZiAoJGNoYXROb3cubGVuZ3RoKSB7XG5cdFx0XHRcdCRjaGF0Tm93LmFkZENsYXNzKCdvbi1zY3JlZW4nKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyBpbml0IGVhY2ggc3VwcG9ydCBmZWF0dXJlXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0U3VwcG9ydC5BdXRoZW50aWNhdGVkQmxvY2tzLmluaXQoKTtcblx0XHRTdXBwb3J0LkdldHRpbmdTdGFydGVkQ2Fyb3VzZWwuaW5pdCgpO1xuXHRcdFN1cHBvcnQuQ29udHJvbHMuaW5pdCgpO1xuXHRcdFN1cHBvcnQuQWxlcnRzLmluaXQoKTtcblx0XHRTdXBwb3J0LlRvZ2dsZVNlYXJjaEFyZWFzLmluaXQoKTtcblx0XHRTdXBwb3J0Lk1lbnUuaW5pdCgpO1xuXHRcdFN1cHBvcnQuTW9iaWxlVG9nZ2xlSGVhZGVyLmluaXQoKTtcblx0XHRTdXBwb3J0LlNsaWRlSW5TdXBwb3J0Q2hhdEJ1dHRvbi5pbml0KCk7XG5cdH1cblxuXHQkKGluaXQpO1xuXG59KGpRdWVyeSkpO1xuIiwidmFyIGdlbmVyYXRlTWVudUFkYXB0ZXIgPSAoZnVuY3Rpb24oKSB7XG5cblx0dmFyIGFkYXB0ZXJBUEkgPSB7XG5cblx0XHRsYWJlbDogJycsXG5cdFx0bWVudTogbnVsbCxcblx0XHRpbnRlcmZhY2U6ICd0b3VjaCcsIC8vIGFzc3VtZSBhIHRvdWNoIGludGVyZmFjZSBieSBkZWZhdWx0LCBtb2JpbGUtZmlyc3Rcblx0XHRoYW5kbGVyczogW10sXG5cblx0XHRzZXR1cEhhbmRsZXJzOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBhZGFwdGVyID0gdGhpcztcblx0XHRcdCQuZWFjaCh0aGlzLmhhbmRsZXJzLCBmdW5jdGlvbihpLCBoYW5kbGVyKXtcblx0XHRcdFx0aGFuZGxlci5zZXR1cChhZGFwdGVyKTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0ZGVzdHJveUhhbmRsZXJzOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBhZGFwdGVyID0gdGhpcztcblx0XHRcdCQuZWFjaCh0aGlzLmhhbmRsZXJzLCBmdW5jdGlvbihpLCBoYW5kbGVyKXtcblx0XHRcdFx0aGFuZGxlci5kZXN0cm95KGFkYXB0ZXIpO1xuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdHRlYXJkb3duOiBmdW5jdGlvbihhZGFwdGVyKSB7fSxcblx0XHRpbml0OiBmdW5jdGlvbihhZGFwdGVyKSB7fVxuXHR9O1xuXG5cdHJldHVybiBmdW5jdGlvbihtZW51LCBvcHRpb25zKSB7XG5cblx0XHR2YXIgYWRhcHRlciA9ICQuZXh0ZW5kKHt9LCBhZGFwdGVyQVBJLCBvcHRpb25zLCB7XG5cblx0XHRcdG1lbnU6IG1lbnUsXG5cblx0XHRcdGluaXQ6IGZ1bmN0aW9uKGludGVyZmFjZSkge1xuXG5cdFx0XHRcdG1lbnUuaW5pdCgpO1xuXG5cdFx0XHRcdHRoaXMuaW50ZXJmYWNlID0gaW50ZXJmYWNlO1xuXHRcdFx0XHR0aGlzLnNldHVwSGFuZGxlcnMoKTtcblxuXHRcdFx0XHQvLyBmaW5pc2ggd2l0aCBleGVjdXRpbmcgdGhlIG9wdGlvbnMgcGFzc2VkIGluXG5cdFx0XHRcdGlmICh0eXBlb2Ygb3B0aW9ucy5pbml0ID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0b3B0aW9ucy5pbml0KHRoaXMpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHR0ZWFyZG93bjogZnVuY3Rpb24oKSB7XG5cblx0XHRcdFx0dGhpcy5kZXN0cm95SGFuZGxlcnMoKTtcblxuXHRcdFx0XHRpZiAodHlwZW9mIG9wdGlvbnMudGVhcmRvd24gPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRvcHRpb25zLnRlYXJkb3duKHRoaXMpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gYWRhcHRlcjtcblxuXHR9O1xuXG59KSgpO1xuXG5leHBvcnRzLmdlbmVyYXRlTWVudUFkYXB0ZXIgPSBnZW5lcmF0ZU1lbnVBZGFwdGVyO1xuIiwidmFyIGdlbmVyYXRlTWVudSA9IChmdW5jdGlvbigpIHtcblxuXHR2YXIgbWVudURlZmF1bHQgPSB7XG5cblx0ICBtZW51RWxlbWVudDogJCgnLm1lbnUnKSxcblx0ICBzdWJNZW51U2VsZWN0b3I6ICcuc3ViLW1lbnUnLFxuXHQgIGV4cGFuZGVkQ2xhc3M6ICdleHBhbmRlZCcsXG5cdCAgc3ViTWVudVRyaWdnZXJTZWxlY3RvcjogJy5qcy1zaG93LXN1Yi10cmlnZ2VyJyxcblxuXHQgIGV4cGFuZE1lbnU6IGZ1bmN0aW9uKHN1Yk1lbnVFbGVtZW50KSB7XG5cdFx0JChzdWJNZW51RWxlbWVudCkuYWRkQ2xhc3ModGhpcy5leHBhbmRlZENsYXNzKTtcblx0ICB9LFxuXG5cdCAgY29sbGFwc2VNZW51OiBmdW5jdGlvbihzdWJNZW51RWxlbWVudCkge1xuXHRcdCQoc3ViTWVudUVsZW1lbnQpLnJlbW92ZUNsYXNzKHRoaXMuZXhwYW5kZWRDbGFzcyk7XG5cdCAgfSxcblxuXHQgIGNvbGxhcHNlQWxsU3ViTWVudXM6IGZ1bmN0aW9uKCkge1xuXHQgIFx0dmFyIG1lbnUgPSB0aGlzO1xuXHRcdHRoaXMubWVudUVsZW1lbnQuZmluZCh0aGlzLnN1Yk1lbnVTZWxlY3RvcikuZWFjaChmdW5jdGlvbihpLCBlKXtcblx0XHQgIG1lbnUuY29sbGFwc2VNZW51KGUpO1xuXHRcdH0pO1xuXHQgIH0sXG5cblx0ICBmaW5kTWVudUZyb21UYXJnZXQ6IGZ1bmN0aW9uKHRhcmdldCkge1xuXHRcdHZhciB0cmlnZ2VyID0gJCh0YXJnZXQpLnBhcmVudCh0aGlzLnN1Yk1lbnVUcmlnZ2VyU2VsZWN0b3IpLmFkZEJhY2sodGhpcy5zdWJNZW51VHJpZ2dlclNlbGVjdG9yKTtcblx0XHR2YXIgbWVudSA9IHRyaWdnZXIuZmluZCh0aGlzLnN1Yk1lbnVTZWxlY3Rvcik7XG5cdFx0cmV0dXJuIG1lbnU7XG5cdCAgfSxcblxuXHQgIGluaXQ6IGZ1bmN0aW9uKCkge31cblx0fTtcblxuXHRyZXR1cm4gZnVuY3Rpb24ob3B0aW9ucykge1xuXHQgIHJldHVybiAkLmV4dGVuZCh7fSwgbWVudURlZmF1bHQsIG9wdGlvbnMpO1xuXHR9O1xufSkoKTtcblxuZXhwb3J0cy5nZW5lcmF0ZU1lbnUgPSAgZ2VuZXJhdGVNZW51O1xuIl19
