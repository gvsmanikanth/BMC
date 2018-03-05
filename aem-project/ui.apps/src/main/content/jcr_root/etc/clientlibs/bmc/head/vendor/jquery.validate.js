(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
if($('#leadgen') || $('#nonleadgen'))	{
	//Add hard limits to form fields, if they are not already defined
	//if(!$('[data-type="C_Salutation1"]').attr('maxlength'))
		//$('[data-type="C_Salutation1"]').attr('maxlength', '15');
	//if(!$('[data-type="C_Title"]').attr('maxlength'))
		//$('[data-type="C_Title"]').attr('maxlength', '75');
	//if(!$('[data-type="C_Address1"]').attr('maxlength'))
		//$('[data-type="C_Address1"]').attr('maxlength', '60');
	//if(!$('[data-type="C_Address2"]').attr('maxlength'))
		//$('[data-type="C_Address2"]').attr('maxlength', '60');
	//if(!$('[data-type="C_Address3"]').attr('maxlength'))
		//$('[data-type="C_Address3"]').attr('maxlength', '60');
	//if(!$('[data-type="C_State_Prov"]').attr('maxlength'))
		//$('[data-type="C_State_Prov"]').attr('maxlength', '20');

	//if(!$('[data-type="C_Zip_Postal"]').attr('maxlength'))
		//$('[data-type="C_Zip_Postal"]').attr('maxlength', '10');
	//if(!$('[data-type="C_BusPhone"]').attr('maxlength'))
		//$('[data-type="C_BusPhone"]').attr('maxlength', '40');
	

	//Switch-on reg-ex validations, if not already defined
	//Switch-on reg-ex validations, if not already defined
	//if(!$('[data-type="first-name"]').attr('data-validation-type'))
	//	$('[data-type="C_FirstName"]').attr('data-validation-type', 'fname');
	//if(!$('[data-type="C_LastName"]').attr('data-validation-type'))
	//	$('[data-type="C_LastName"]').attr('data-validation-type', 'lname');
	//if(!$('[data-type="C_BusPhone"]').attr('data-validation-type'))
	//	$('[data-type="C_BusPhone"]').attr('data-validation-type', 'tel');
	//Milind: Commenting out this logic as we will update the FieldSet for Unsubscribe form
	//Change reg-ex validation pattern for Unsubscribe form
	/*
	if(typeof bmcMeta !== 'undefined' && bmcMeta.hasOwnProperty("form"))	{
		if(bmcMeta.form.name.toLowerCase().indexOf("unsubscribe") > -1)	{
			$('#C_EmailAddress').attr('type', 'text');
			$('#C_EmailAddress').attr('data-validation-type', 'allemails');
		}
	}
	*/
	
}	//EOC for Leadgen or NonLeadgen form	


(function($) {
	$.fn.validate = function() {
		var $this = this,
			$form = $(this),
			$inputs = $form.find('input, textarea, select'),
			$submitButton = $form.find('button[type="submit"]'),
			ajaxForm = $form.data('ajax-url') !== undefined;	// boolean that determines if a form is submitted with AJAX

		// initialize the form state
		$form.data('valid', true);
		enableLoadingState($submitButton);

		// base regex patterns; http://regex101.com/ is a good testing environment
		$this.patterns = {
			'alpha-only' : "^[^0-9 ][A-z ]+$",	//this will exclude numeric data and cannot begin with space but can have space in-between for double names
			'first-name' : "^[^0-9 ][^0-9]{0,25}$",	// this will exclude numeric data and cannot begin with space
			'last-name' : "^[^0-9 ][^0-9]{0,40}$",	// this will exclude numeric data and cannot begin with space
			'email-business' : "^[a-zA-Z][a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]*@(?!(gmail\\.[a-zA-Z0-9.]+$)|(hotmail\\.[a-zA-Z0-9.]+$)|(zoho\\.[a-zA-Z0-9.]+$)|(yandex\\.[a-zA-Z0-9.]+$)|(outlook\\.[a-zA-Z0-9.]+$)|(aim\\.[a-zA-Z0-9.]+$)|(icloud\\.[a-zA-Z0-9.]+$)|(me\\.[a-zA-Z0-9.]+$)|(mac\\.[a-zA-Z0-9.]+$)|(yahoo\\.[a-zA-Z0-9.]+$)|(mail.com$)|(inbox\\.[a-zA-Z0-9.]+$)|(gmx\\.[a-zA-Z0-9.]+$)|(myway\\.[a-zA-Z0-9.]+$)|(msn\\.[a-zA-Z0-9.]+$))[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$",
			'email-business-competitor' : "^[a-zA-Z][a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]*@(?!(gmail\\.[a-zA-Z0-9.]+$)|(hotmail\\.[a-zA-Z0-9.]+$)|(zoho\\.[a-zA-Z0-9.]+$)|(yandex\\.[a-zA-Z0-9.]+$)|(outlook\\.[a-zA-Z0-9.]+$)|(aim\\.[a-zA-Z0-9.]+$)|(icloud\\.[a-zA-Z0-9.]+$)|(me\\.[a-zA-Z0-9.]+$)|(mac\\.[a-zA-Z0-9.]+$)|(yahoo\\.[a-zA-Z0-9.]+$)|(mail.com$)|(inbox\\.[a-zA-Z0-9.]+$)|(gmx\\.[a-zA-Z0-9.]+$)|(myway\\.[a-zA-Z0-9.]+$)|(ibm.com$)|(hpe.com$)|(hp.com$)|(chef.io$)|(tripwire.com$)|(servicenow.com$)|(bmc.com$)|(msn\\.[a-zA-Z0-9.]+$))[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$",
			'email-all' : "^[a-zA-Z][a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$",
			'tel'	: "^([0-9-.+ ()]*\\d){10}[-.+ ()]*$",	// this will allow numbers, hyphens, periods, plus, space and open & close parenthesis AND at least 10 digits
		};

		function disableLoadingState($element) {
			$element
				.attr('disabled', false)
				.removeClass('btn-loading');
		}

		function enableLoadingState($element) {
			$element
				.attr('disabled', 'disabled')
				.addClass('btn-loading');
		}

		// sets an input and the form as invalid
		function setInvalid($input, radioOrCheckbox, name) {
			// apply error styles
			if ($input.parent().is('.decorator-select')) {
				$input.parent().addClass('validation-error');
			}
			else if (radioOrCheckbox) {
				$('[name="' + name + '"]').parent().find('label').addClass('validation-error');
			}
			else {
				$input.addClass('validation-error');

				//Logic to show Error hint
				var err_hint = ($input.data('error-hint') != '') ? $input.data('error-hint') : $input.attr('placeholder');
				$input.prev('label:first').text(err_hint);
			}
			
			// reset to Original Label
			$input
			.on('keyup change', function() {
			  if($input.val().length == 0)
			    $input.prev('label:first').text($input.attr('placeholder'));
			});

			// remove error styles if a value is changed
			$input
				.on('keyup change', function() {
					$(this)
						.add('label[for="' + name + '"]')
						.removeClass('validation-error')
						.parent()
						.removeClass('validation-error');

					//clears out valid all radios in groups
					if($(this).is('[type="radio"]')){
						if($(this).parents('.form-group').length){
							$(this).parents('.form-group').find('label').each(function(i){
								$(this).removeClass('validation-error');
							});
						}
					}
					//clears out individual checkboxe in groups
					if($(this).is('[type="checkbox"]')){
						$(this).next('label').removeClass('validation-error');
					}
				});

			// radios & checkboxes		

			$form
				.data('valid', false);
		}

		function scrollToForm() {
			$('html, body')
				.animate({
					scrollTop: $form.offset().top - 100
				}, 500);

			disableLoadingState($submitButton);
		}

		function scrollToInvalid() {
			$('html, body')
				.animate({
					scrollTop: $('.validation-error').offset().top - 100
				}, 500);

			disableLoadingState($submitButton);
		}
		
		// to be used for testing Unicode input
		function getLengthInBytes(str) {
		  var b = str.match(/[^\x00-\xff]/g);
		  return (str.length + (!b ? 0: b.length)); 
		}

		function submitValidAjaxForm() {
			var submittedObject = $form.serializeObject();

			// combine Topic of Interest with Comments
			submittedObject.C_Description1 = 'Topic of interest: ' + submittedObject.C_ProductInterest + '\r\nAdditional comments: ' + submittedObject.C_Description1;

			$.ajax({
				url: $form.data('ajax-url'),
				type: 'POST',
				dataType: 'HTML',
				data: submittedObject
			})
			.done(function(data) {
				$form
					.find('.validation-error')
					.remove()
					.end()
					.empty()
					.hide()
					.html('<h2>Thank you, ' + submittedObject.C_FirstName + '.</h2><p>We will be in touch soon to discuss your needs</p>')
					.fadeIn();

				scrollToForm();
			})
			// if the URL cannot be located
			.fail(function(jqXHR, textStatus, errorThrown) {
				$form
					.empty()
					.hide()
					.html('<p class="validation-error">' + errorThrown + '</p>')
					.fadeIn();

				scrollToForm();
			});
		}

		// validate each input
		$inputs
			.each(function() {
				var $input = $(this);
				if($input.get(0).getAttribute('required') != 'false'){
					var	value = $input.val(),
						required = $input.attr('required') !== undefined,
						type = $input.attr('type'),
						//Milind: Validation type gets higher precedence than type
						//validationType = (type === 'text') ? $input.data('validation-type') : type,
						validationType = ($input.data('validation-type')) ? $input.data('validation-type') : type,
					
						radioOrCheckbox = (type === 'radio' || type === 'checkbox'),
						name = $input.attr('name'),
						pattern;

					// test if the input is required
					if (required && (value === '' || value === null)) {
						setInvalid($input);
					}
					else if (required && radioOrCheckbox && $('[name="' + name + '"]').is(':checked') === false) {
						setInvalid($input, radioOrCheckbox, name);
					}

					// test the input against its regex pattern
					if (required && $this.patterns[validationType]) {
						pattern = new RegExp($this.patterns[validationType]);

						if (!pattern.test(value.toLowerCase())) {
							setInvalid($input);
						}
					}

					// test for Unicode input i.e. non-English characters
					if (type == 'text') {
						//Char length != No. of Bytes := input is Unicode
						if (value.length != getLengthInBytes(value)) {
							setInvalid($input);
						}
					}

					// test if the honeypot is filled out
					if ($input.data('input-honeypot') && $input.val() !== '') {
						setInvalid($input);
					}
				}
			})
			.promise()
			.done(function() {
				if ($form.data('valid')) {
					if (ajaxForm) {
						submitValidAjaxForm();
					}
					else {
						$form.submit();
					}
				}
				else {
					scrollToInvalid();
				}
			});
	};
}) (jQuery);
},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy92ZW5kb3IvanF1ZXJ5LnZhbGlkYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpZigkKCcjbGVhZGdlbicpIHx8ICQoJyNub25sZWFkZ2VuJykpXHR7XG5cdC8vQWRkIGhhcmQgbGltaXRzIHRvIGZvcm0gZmllbGRzLCBpZiB0aGV5IGFyZSBub3QgYWxyZWFkeSBkZWZpbmVkXG5cdC8vaWYoISQoJ1tkYXRhLXR5cGU9XCJDX1NhbHV0YXRpb24xXCJdJykuYXR0cignbWF4bGVuZ3RoJykpXG5cdFx0Ly8kKCdbZGF0YS10eXBlPVwiQ19TYWx1dGF0aW9uMVwiXScpLmF0dHIoJ21heGxlbmd0aCcsICcxNScpO1xuXHQvL2lmKCEkKCdbZGF0YS10eXBlPVwiQ19UaXRsZVwiXScpLmF0dHIoJ21heGxlbmd0aCcpKVxuXHRcdC8vJCgnW2RhdGEtdHlwZT1cIkNfVGl0bGVcIl0nKS5hdHRyKCdtYXhsZW5ndGgnLCAnNzUnKTtcblx0Ly9pZighJCgnW2RhdGEtdHlwZT1cIkNfQWRkcmVzczFcIl0nKS5hdHRyKCdtYXhsZW5ndGgnKSlcblx0XHQvLyQoJ1tkYXRhLXR5cGU9XCJDX0FkZHJlc3MxXCJdJykuYXR0cignbWF4bGVuZ3RoJywgJzYwJyk7XG5cdC8vaWYoISQoJ1tkYXRhLXR5cGU9XCJDX0FkZHJlc3MyXCJdJykuYXR0cignbWF4bGVuZ3RoJykpXG5cdFx0Ly8kKCdbZGF0YS10eXBlPVwiQ19BZGRyZXNzMlwiXScpLmF0dHIoJ21heGxlbmd0aCcsICc2MCcpO1xuXHQvL2lmKCEkKCdbZGF0YS10eXBlPVwiQ19BZGRyZXNzM1wiXScpLmF0dHIoJ21heGxlbmd0aCcpKVxuXHRcdC8vJCgnW2RhdGEtdHlwZT1cIkNfQWRkcmVzczNcIl0nKS5hdHRyKCdtYXhsZW5ndGgnLCAnNjAnKTtcblx0Ly9pZighJCgnW2RhdGEtdHlwZT1cIkNfU3RhdGVfUHJvdlwiXScpLmF0dHIoJ21heGxlbmd0aCcpKVxuXHRcdC8vJCgnW2RhdGEtdHlwZT1cIkNfU3RhdGVfUHJvdlwiXScpLmF0dHIoJ21heGxlbmd0aCcsICcyMCcpO1xuXG5cdC8vaWYoISQoJ1tkYXRhLXR5cGU9XCJDX1ppcF9Qb3N0YWxcIl0nKS5hdHRyKCdtYXhsZW5ndGgnKSlcblx0XHQvLyQoJ1tkYXRhLXR5cGU9XCJDX1ppcF9Qb3N0YWxcIl0nKS5hdHRyKCdtYXhsZW5ndGgnLCAnMTAnKTtcblx0Ly9pZighJCgnW2RhdGEtdHlwZT1cIkNfQnVzUGhvbmVcIl0nKS5hdHRyKCdtYXhsZW5ndGgnKSlcblx0XHQvLyQoJ1tkYXRhLXR5cGU9XCJDX0J1c1Bob25lXCJdJykuYXR0cignbWF4bGVuZ3RoJywgJzQwJyk7XG5cdFxuXG5cdC8vU3dpdGNoLW9uIHJlZy1leCB2YWxpZGF0aW9ucywgaWYgbm90IGFscmVhZHkgZGVmaW5lZFxuXHQvL1N3aXRjaC1vbiByZWctZXggdmFsaWRhdGlvbnMsIGlmIG5vdCBhbHJlYWR5IGRlZmluZWRcblx0Ly9pZighJCgnW2RhdGEtdHlwZT1cImZpcnN0LW5hbWVcIl0nKS5hdHRyKCdkYXRhLXZhbGlkYXRpb24tdHlwZScpKVxuXHQvL1x0JCgnW2RhdGEtdHlwZT1cIkNfRmlyc3ROYW1lXCJdJykuYXR0cignZGF0YS12YWxpZGF0aW9uLXR5cGUnLCAnZm5hbWUnKTtcblx0Ly9pZighJCgnW2RhdGEtdHlwZT1cIkNfTGFzdE5hbWVcIl0nKS5hdHRyKCdkYXRhLXZhbGlkYXRpb24tdHlwZScpKVxuXHQvL1x0JCgnW2RhdGEtdHlwZT1cIkNfTGFzdE5hbWVcIl0nKS5hdHRyKCdkYXRhLXZhbGlkYXRpb24tdHlwZScsICdsbmFtZScpO1xuXHQvL2lmKCEkKCdbZGF0YS10eXBlPVwiQ19CdXNQaG9uZVwiXScpLmF0dHIoJ2RhdGEtdmFsaWRhdGlvbi10eXBlJykpXG5cdC8vXHQkKCdbZGF0YS10eXBlPVwiQ19CdXNQaG9uZVwiXScpLmF0dHIoJ2RhdGEtdmFsaWRhdGlvbi10eXBlJywgJ3RlbCcpO1xuXHQvL01pbGluZDogQ29tbWVudGluZyBvdXQgdGhpcyBsb2dpYyBhcyB3ZSB3aWxsIHVwZGF0ZSB0aGUgRmllbGRTZXQgZm9yIFVuc3Vic2NyaWJlIGZvcm1cblx0Ly9DaGFuZ2UgcmVnLWV4IHZhbGlkYXRpb24gcGF0dGVybiBmb3IgVW5zdWJzY3JpYmUgZm9ybVxuXHQvKlxuXHRpZih0eXBlb2YgYm1jTWV0YSAhPT0gJ3VuZGVmaW5lZCcgJiYgYm1jTWV0YS5oYXNPd25Qcm9wZXJ0eShcImZvcm1cIikpXHR7XG5cdFx0aWYoYm1jTWV0YS5mb3JtLm5hbWUudG9Mb3dlckNhc2UoKS5pbmRleE9mKFwidW5zdWJzY3JpYmVcIikgPiAtMSlcdHtcblx0XHRcdCQoJyNDX0VtYWlsQWRkcmVzcycpLmF0dHIoJ3R5cGUnLCAndGV4dCcpO1xuXHRcdFx0JCgnI0NfRW1haWxBZGRyZXNzJykuYXR0cignZGF0YS12YWxpZGF0aW9uLXR5cGUnLCAnYWxsZW1haWxzJyk7XG5cdFx0fVxuXHR9XG5cdCovXG5cdFxufVx0Ly9FT0MgZm9yIExlYWRnZW4gb3IgTm9uTGVhZGdlbiBmb3JtXHRcblxuXG4oZnVuY3Rpb24oJCkge1xuXHQkLmZuLnZhbGlkYXRlID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyICR0aGlzID0gdGhpcyxcblx0XHRcdCRmb3JtID0gJCh0aGlzKSxcblx0XHRcdCRpbnB1dHMgPSAkZm9ybS5maW5kKCdpbnB1dCwgdGV4dGFyZWEsIHNlbGVjdCcpLFxuXHRcdFx0JHN1Ym1pdEJ1dHRvbiA9ICRmb3JtLmZpbmQoJ2J1dHRvblt0eXBlPVwic3VibWl0XCJdJyksXG5cdFx0XHRhamF4Rm9ybSA9ICRmb3JtLmRhdGEoJ2FqYXgtdXJsJykgIT09IHVuZGVmaW5lZDtcdC8vIGJvb2xlYW4gdGhhdCBkZXRlcm1pbmVzIGlmIGEgZm9ybSBpcyBzdWJtaXR0ZWQgd2l0aCBBSkFYXG5cblx0XHQvLyBpbml0aWFsaXplIHRoZSBmb3JtIHN0YXRlXG5cdFx0JGZvcm0uZGF0YSgndmFsaWQnLCB0cnVlKTtcblx0XHRlbmFibGVMb2FkaW5nU3RhdGUoJHN1Ym1pdEJ1dHRvbik7XG5cblx0XHQvLyBiYXNlIHJlZ2V4IHBhdHRlcm5zOyBodHRwOi8vcmVnZXgxMDEuY29tLyBpcyBhIGdvb2QgdGVzdGluZyBlbnZpcm9ubWVudFxuXHRcdCR0aGlzLnBhdHRlcm5zID0ge1xuXHRcdFx0J2FscGhhLW9ubHknIDogXCJeW14wLTkgXVtBLXogXSskXCIsXHQvL3RoaXMgd2lsbCBleGNsdWRlIG51bWVyaWMgZGF0YSBhbmQgY2Fubm90IGJlZ2luIHdpdGggc3BhY2UgYnV0IGNhbiBoYXZlIHNwYWNlIGluLWJldHdlZW4gZm9yIGRvdWJsZSBuYW1lc1xuXHRcdFx0J2ZpcnN0LW5hbWUnIDogXCJeW14wLTkgXVteMC05XXswLDI1fSRcIixcdC8vIHRoaXMgd2lsbCBleGNsdWRlIG51bWVyaWMgZGF0YSBhbmQgY2Fubm90IGJlZ2luIHdpdGggc3BhY2Vcblx0XHRcdCdsYXN0LW5hbWUnIDogXCJeW14wLTkgXVteMC05XXswLDQwfSRcIixcdC8vIHRoaXMgd2lsbCBleGNsdWRlIG51bWVyaWMgZGF0YSBhbmQgY2Fubm90IGJlZ2luIHdpdGggc3BhY2Vcblx0XHRcdCdlbWFpbC1idXNpbmVzcycgOiBcIl5bYS16QS1aXVthLXpBLVowLTkuISMkJSYnKisvPT9eX2B7fH1+LV0qQCg/IShnbWFpbFxcXFwuW2EtekEtWjAtOS5dKyQpfChob3RtYWlsXFxcXC5bYS16QS1aMC05Ll0rJCl8KHpvaG9cXFxcLlthLXpBLVowLTkuXSskKXwoeWFuZGV4XFxcXC5bYS16QS1aMC05Ll0rJCl8KG91dGxvb2tcXFxcLlthLXpBLVowLTkuXSskKXwoYWltXFxcXC5bYS16QS1aMC05Ll0rJCl8KGljbG91ZFxcXFwuW2EtekEtWjAtOS5dKyQpfChtZVxcXFwuW2EtekEtWjAtOS5dKyQpfChtYWNcXFxcLlthLXpBLVowLTkuXSskKXwoeWFob29cXFxcLlthLXpBLVowLTkuXSskKXwobWFpbC5jb20kKXwoaW5ib3hcXFxcLlthLXpBLVowLTkuXSskKXwoZ214XFxcXC5bYS16QS1aMC05Ll0rJCl8KG15d2F5XFxcXC5bYS16QS1aMC05Ll0rJCl8KG1zblxcXFwuW2EtekEtWjAtOS5dKyQpKVthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPyg/OlxcXFwuW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KSskXCIsXG5cdFx0XHQnZW1haWwtYnVzaW5lc3MtY29tcGV0aXRvcicgOiBcIl5bYS16QS1aXVthLXpBLVowLTkuISMkJSYnKisvPT9eX2B7fH1+LV0qQCg/IShnbWFpbFxcXFwuW2EtekEtWjAtOS5dKyQpfChob3RtYWlsXFxcXC5bYS16QS1aMC05Ll0rJCl8KHpvaG9cXFxcLlthLXpBLVowLTkuXSskKXwoeWFuZGV4XFxcXC5bYS16QS1aMC05Ll0rJCl8KG91dGxvb2tcXFxcLlthLXpBLVowLTkuXSskKXwoYWltXFxcXC5bYS16QS1aMC05Ll0rJCl8KGljbG91ZFxcXFwuW2EtekEtWjAtOS5dKyQpfChtZVxcXFwuW2EtekEtWjAtOS5dKyQpfChtYWNcXFxcLlthLXpBLVowLTkuXSskKXwoeWFob29cXFxcLlthLXpBLVowLTkuXSskKXwobWFpbC5jb20kKXwoaW5ib3hcXFxcLlthLXpBLVowLTkuXSskKXwoZ214XFxcXC5bYS16QS1aMC05Ll0rJCl8KG15d2F5XFxcXC5bYS16QS1aMC05Ll0rJCl8KGlibS5jb20kKXwoaHBlLmNvbSQpfChocC5jb20kKXwoY2hlZi5pbyQpfCh0cmlwd2lyZS5jb20kKXwoc2VydmljZW5vdy5jb20kKXwoYm1jLmNvbSQpfChtc25cXFxcLlthLXpBLVowLTkuXSskKSlbYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8oPzpcXFxcLlthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPykrJFwiLFxuXHRcdFx0J2VtYWlsLWFsbCcgOiBcIl5bYS16QS1aXVthLXpBLVowLTkuISMkJSYnKisvPT9eX2B7fH1+LV0qQFthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPyg/OlxcXFwuW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KSskXCIsXG5cdFx0XHQndGVsJ1x0OiBcIl4oWzAtOS0uKyAoKV0qXFxcXGQpezEwfVstLisgKCldKiRcIixcdC8vIHRoaXMgd2lsbCBhbGxvdyBudW1iZXJzLCBoeXBoZW5zLCBwZXJpb2RzLCBwbHVzLCBzcGFjZSBhbmQgb3BlbiAmIGNsb3NlIHBhcmVudGhlc2lzIEFORCBhdCBsZWFzdCAxMCBkaWdpdHNcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gZGlzYWJsZUxvYWRpbmdTdGF0ZSgkZWxlbWVudCkge1xuXHRcdFx0JGVsZW1lbnRcblx0XHRcdFx0LmF0dHIoJ2Rpc2FibGVkJywgZmFsc2UpXG5cdFx0XHRcdC5yZW1vdmVDbGFzcygnYnRuLWxvYWRpbmcnKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBlbmFibGVMb2FkaW5nU3RhdGUoJGVsZW1lbnQpIHtcblx0XHRcdCRlbGVtZW50XG5cdFx0XHRcdC5hdHRyKCdkaXNhYmxlZCcsICdkaXNhYmxlZCcpXG5cdFx0XHRcdC5hZGRDbGFzcygnYnRuLWxvYWRpbmcnKTtcblx0XHR9XG5cblx0XHQvLyBzZXRzIGFuIGlucHV0IGFuZCB0aGUgZm9ybSBhcyBpbnZhbGlkXG5cdFx0ZnVuY3Rpb24gc2V0SW52YWxpZCgkaW5wdXQsIHJhZGlvT3JDaGVja2JveCwgbmFtZSkge1xuXHRcdFx0Ly8gYXBwbHkgZXJyb3Igc3R5bGVzXG5cdFx0XHRpZiAoJGlucHV0LnBhcmVudCgpLmlzKCcuZGVjb3JhdG9yLXNlbGVjdCcpKSB7XG5cdFx0XHRcdCRpbnB1dC5wYXJlbnQoKS5hZGRDbGFzcygndmFsaWRhdGlvbi1lcnJvcicpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAocmFkaW9PckNoZWNrYm94KSB7XG5cdFx0XHRcdCQoJ1tuYW1lPVwiJyArIG5hbWUgKyAnXCJdJykucGFyZW50KCkuZmluZCgnbGFiZWwnKS5hZGRDbGFzcygndmFsaWRhdGlvbi1lcnJvcicpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdCRpbnB1dC5hZGRDbGFzcygndmFsaWRhdGlvbi1lcnJvcicpO1xuXG5cdFx0XHRcdC8vTG9naWMgdG8gc2hvdyBFcnJvciBoaW50XG5cdFx0XHRcdHZhciBlcnJfaGludCA9ICgkaW5wdXQuZGF0YSgnZXJyb3ItaGludCcpICE9ICcnKSA/ICRpbnB1dC5kYXRhKCdlcnJvci1oaW50JykgOiAkaW5wdXQuYXR0cigncGxhY2Vob2xkZXInKTtcblx0XHRcdFx0JGlucHV0LnByZXYoJ2xhYmVsOmZpcnN0JykudGV4dChlcnJfaGludCk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdC8vIHJlc2V0IHRvIE9yaWdpbmFsIExhYmVsXG5cdFx0XHQkaW5wdXRcblx0XHRcdC5vbigna2V5dXAgY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHQgIGlmKCRpbnB1dC52YWwoKS5sZW5ndGggPT0gMClcblx0XHRcdCAgICAkaW5wdXQucHJldignbGFiZWw6Zmlyc3QnKS50ZXh0KCRpbnB1dC5hdHRyKCdwbGFjZWhvbGRlcicpKTtcblx0XHRcdH0pO1xuXG5cdFx0XHQvLyByZW1vdmUgZXJyb3Igc3R5bGVzIGlmIGEgdmFsdWUgaXMgY2hhbmdlZFxuXHRcdFx0JGlucHV0XG5cdFx0XHRcdC5vbigna2V5dXAgY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JCh0aGlzKVxuXHRcdFx0XHRcdFx0LmFkZCgnbGFiZWxbZm9yPVwiJyArIG5hbWUgKyAnXCJdJylcblx0XHRcdFx0XHRcdC5yZW1vdmVDbGFzcygndmFsaWRhdGlvbi1lcnJvcicpXG5cdFx0XHRcdFx0XHQucGFyZW50KClcblx0XHRcdFx0XHRcdC5yZW1vdmVDbGFzcygndmFsaWRhdGlvbi1lcnJvcicpO1xuXG5cdFx0XHRcdFx0Ly9jbGVhcnMgb3V0IHZhbGlkIGFsbCByYWRpb3MgaW4gZ3JvdXBzXG5cdFx0XHRcdFx0aWYoJCh0aGlzKS5pcygnW3R5cGU9XCJyYWRpb1wiXScpKXtcblx0XHRcdFx0XHRcdGlmKCQodGhpcykucGFyZW50cygnLmZvcm0tZ3JvdXAnKS5sZW5ndGgpe1xuXHRcdFx0XHRcdFx0XHQkKHRoaXMpLnBhcmVudHMoJy5mb3JtLWdyb3VwJykuZmluZCgnbGFiZWwnKS5lYWNoKGZ1bmN0aW9uKGkpe1xuXHRcdFx0XHRcdFx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoJ3ZhbGlkYXRpb24tZXJyb3InKTtcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8vY2xlYXJzIG91dCBpbmRpdmlkdWFsIGNoZWNrYm94ZSBpbiBncm91cHNcblx0XHRcdFx0XHRpZigkKHRoaXMpLmlzKCdbdHlwZT1cImNoZWNrYm94XCJdJykpe1xuXHRcdFx0XHRcdFx0JCh0aGlzKS5uZXh0KCdsYWJlbCcpLnJlbW92ZUNsYXNzKCd2YWxpZGF0aW9uLWVycm9yJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0Ly8gcmFkaW9zICYgY2hlY2tib3hlc1x0XHRcblxuXHRcdFx0JGZvcm1cblx0XHRcdFx0LmRhdGEoJ3ZhbGlkJywgZmFsc2UpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHNjcm9sbFRvRm9ybSgpIHtcblx0XHRcdCQoJ2h0bWwsIGJvZHknKVxuXHRcdFx0XHQuYW5pbWF0ZSh7XG5cdFx0XHRcdFx0c2Nyb2xsVG9wOiAkZm9ybS5vZmZzZXQoKS50b3AgLSAxMDBcblx0XHRcdFx0fSwgNTAwKTtcblxuXHRcdFx0ZGlzYWJsZUxvYWRpbmdTdGF0ZSgkc3VibWl0QnV0dG9uKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzY3JvbGxUb0ludmFsaWQoKSB7XG5cdFx0XHQkKCdodG1sLCBib2R5Jylcblx0XHRcdFx0LmFuaW1hdGUoe1xuXHRcdFx0XHRcdHNjcm9sbFRvcDogJCgnLnZhbGlkYXRpb24tZXJyb3InKS5vZmZzZXQoKS50b3AgLSAxMDBcblx0XHRcdFx0fSwgNTAwKTtcblxuXHRcdFx0ZGlzYWJsZUxvYWRpbmdTdGF0ZSgkc3VibWl0QnV0dG9uKTtcblx0XHR9XG5cdFx0XG5cdFx0Ly8gdG8gYmUgdXNlZCBmb3IgdGVzdGluZyBVbmljb2RlIGlucHV0XG5cdFx0ZnVuY3Rpb24gZ2V0TGVuZ3RoSW5CeXRlcyhzdHIpIHtcblx0XHQgIHZhciBiID0gc3RyLm1hdGNoKC9bXlxceDAwLVxceGZmXS9nKTtcblx0XHQgIHJldHVybiAoc3RyLmxlbmd0aCArICghYiA/IDA6IGIubGVuZ3RoKSk7IFxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHN1Ym1pdFZhbGlkQWpheEZvcm0oKSB7XG5cdFx0XHR2YXIgc3VibWl0dGVkT2JqZWN0ID0gJGZvcm0uc2VyaWFsaXplT2JqZWN0KCk7XG5cblx0XHRcdC8vIGNvbWJpbmUgVG9waWMgb2YgSW50ZXJlc3Qgd2l0aCBDb21tZW50c1xuXHRcdFx0c3VibWl0dGVkT2JqZWN0LkNfRGVzY3JpcHRpb24xID0gJ1RvcGljIG9mIGludGVyZXN0OiAnICsgc3VibWl0dGVkT2JqZWN0LkNfUHJvZHVjdEludGVyZXN0ICsgJ1xcclxcbkFkZGl0aW9uYWwgY29tbWVudHM6ICcgKyBzdWJtaXR0ZWRPYmplY3QuQ19EZXNjcmlwdGlvbjE7XG5cblx0XHRcdCQuYWpheCh7XG5cdFx0XHRcdHVybDogJGZvcm0uZGF0YSgnYWpheC11cmwnKSxcblx0XHRcdFx0dHlwZTogJ1BPU1QnLFxuXHRcdFx0XHRkYXRhVHlwZTogJ0hUTUwnLFxuXHRcdFx0XHRkYXRhOiBzdWJtaXR0ZWRPYmplY3Rcblx0XHRcdH0pXG5cdFx0XHQuZG9uZShmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdCRmb3JtXG5cdFx0XHRcdFx0LmZpbmQoJy52YWxpZGF0aW9uLWVycm9yJylcblx0XHRcdFx0XHQucmVtb3ZlKClcblx0XHRcdFx0XHQuZW5kKClcblx0XHRcdFx0XHQuZW1wdHkoKVxuXHRcdFx0XHRcdC5oaWRlKClcblx0XHRcdFx0XHQuaHRtbCgnPGgyPlRoYW5rIHlvdSwgJyArIHN1Ym1pdHRlZE9iamVjdC5DX0ZpcnN0TmFtZSArICcuPC9oMj48cD5XZSB3aWxsIGJlIGluIHRvdWNoIHNvb24gdG8gZGlzY3VzcyB5b3VyIG5lZWRzPC9wPicpXG5cdFx0XHRcdFx0LmZhZGVJbigpO1xuXG5cdFx0XHRcdHNjcm9sbFRvRm9ybSgpO1xuXHRcdFx0fSlcblx0XHRcdC8vIGlmIHRoZSBVUkwgY2Fubm90IGJlIGxvY2F0ZWRcblx0XHRcdC5mYWlsKGZ1bmN0aW9uKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikge1xuXHRcdFx0XHQkZm9ybVxuXHRcdFx0XHRcdC5lbXB0eSgpXG5cdFx0XHRcdFx0LmhpZGUoKVxuXHRcdFx0XHRcdC5odG1sKCc8cCBjbGFzcz1cInZhbGlkYXRpb24tZXJyb3JcIj4nICsgZXJyb3JUaHJvd24gKyAnPC9wPicpXG5cdFx0XHRcdFx0LmZhZGVJbigpO1xuXG5cdFx0XHRcdHNjcm9sbFRvRm9ybSgpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0Ly8gdmFsaWRhdGUgZWFjaCBpbnB1dFxuXHRcdCRpbnB1dHNcblx0XHRcdC5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgJGlucHV0ID0gJCh0aGlzKTtcblx0XHRcdFx0aWYoJGlucHV0LmdldCgwKS5nZXRBdHRyaWJ1dGUoJ3JlcXVpcmVkJykgIT0gJ2ZhbHNlJyl7XG5cdFx0XHRcdFx0dmFyXHR2YWx1ZSA9ICRpbnB1dC52YWwoKSxcblx0XHRcdFx0XHRcdHJlcXVpcmVkID0gJGlucHV0LmF0dHIoJ3JlcXVpcmVkJykgIT09IHVuZGVmaW5lZCxcblx0XHRcdFx0XHRcdHR5cGUgPSAkaW5wdXQuYXR0cigndHlwZScpLFxuXHRcdFx0XHRcdFx0Ly9NaWxpbmQ6IFZhbGlkYXRpb24gdHlwZSBnZXRzIGhpZ2hlciBwcmVjZWRlbmNlIHRoYW4gdHlwZVxuXHRcdFx0XHRcdFx0Ly92YWxpZGF0aW9uVHlwZSA9ICh0eXBlID09PSAndGV4dCcpID8gJGlucHV0LmRhdGEoJ3ZhbGlkYXRpb24tdHlwZScpIDogdHlwZSxcblx0XHRcdFx0XHRcdHZhbGlkYXRpb25UeXBlID0gKCRpbnB1dC5kYXRhKCd2YWxpZGF0aW9uLXR5cGUnKSkgPyAkaW5wdXQuZGF0YSgndmFsaWRhdGlvbi10eXBlJykgOiB0eXBlLFxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0cmFkaW9PckNoZWNrYm94ID0gKHR5cGUgPT09ICdyYWRpbycgfHwgdHlwZSA9PT0gJ2NoZWNrYm94JyksXG5cdFx0XHRcdFx0XHRuYW1lID0gJGlucHV0LmF0dHIoJ25hbWUnKSxcblx0XHRcdFx0XHRcdHBhdHRlcm47XG5cblx0XHRcdFx0XHQvLyB0ZXN0IGlmIHRoZSBpbnB1dCBpcyByZXF1aXJlZFxuXHRcdFx0XHRcdGlmIChyZXF1aXJlZCAmJiAodmFsdWUgPT09ICcnIHx8IHZhbHVlID09PSBudWxsKSkge1xuXHRcdFx0XHRcdFx0c2V0SW52YWxpZCgkaW5wdXQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIGlmIChyZXF1aXJlZCAmJiByYWRpb09yQ2hlY2tib3ggJiYgJCgnW25hbWU9XCInICsgbmFtZSArICdcIl0nKS5pcygnOmNoZWNrZWQnKSA9PT0gZmFsc2UpIHtcblx0XHRcdFx0XHRcdHNldEludmFsaWQoJGlucHV0LCByYWRpb09yQ2hlY2tib3gsIG5hbWUpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIHRlc3QgdGhlIGlucHV0IGFnYWluc3QgaXRzIHJlZ2V4IHBhdHRlcm5cblx0XHRcdFx0XHRpZiAocmVxdWlyZWQgJiYgJHRoaXMucGF0dGVybnNbdmFsaWRhdGlvblR5cGVdKSB7XG5cdFx0XHRcdFx0XHRwYXR0ZXJuID0gbmV3IFJlZ0V4cCgkdGhpcy5wYXR0ZXJuc1t2YWxpZGF0aW9uVHlwZV0pO1xuXG5cdFx0XHRcdFx0XHRpZiAoIXBhdHRlcm4udGVzdCh2YWx1ZS50b0xvd2VyQ2FzZSgpKSkge1xuXHRcdFx0XHRcdFx0XHRzZXRJbnZhbGlkKCRpbnB1dCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gdGVzdCBmb3IgVW5pY29kZSBpbnB1dCBpLmUuIG5vbi1FbmdsaXNoIGNoYXJhY3RlcnNcblx0XHRcdFx0XHRpZiAodHlwZSA9PSAndGV4dCcpIHtcblx0XHRcdFx0XHRcdC8vQ2hhciBsZW5ndGggIT0gTm8uIG9mIEJ5dGVzIDo9IGlucHV0IGlzIFVuaWNvZGVcblx0XHRcdFx0XHRcdGlmICh2YWx1ZS5sZW5ndGggIT0gZ2V0TGVuZ3RoSW5CeXRlcyh2YWx1ZSkpIHtcblx0XHRcdFx0XHRcdFx0c2V0SW52YWxpZCgkaW5wdXQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIHRlc3QgaWYgdGhlIGhvbmV5cG90IGlzIGZpbGxlZCBvdXRcblx0XHRcdFx0XHRpZiAoJGlucHV0LmRhdGEoJ2lucHV0LWhvbmV5cG90JykgJiYgJGlucHV0LnZhbCgpICE9PSAnJykge1xuXHRcdFx0XHRcdFx0c2V0SW52YWxpZCgkaW5wdXQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5wcm9taXNlKClcblx0XHRcdC5kb25lKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoJGZvcm0uZGF0YSgndmFsaWQnKSkge1xuXHRcdFx0XHRcdGlmIChhamF4Rm9ybSkge1xuXHRcdFx0XHRcdFx0c3VibWl0VmFsaWRBamF4Rm9ybSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdCRmb3JtLnN1Ym1pdCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRzY3JvbGxUb0ludmFsaWQoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdH07XG59KSAoalF1ZXJ5KTsiXX0=
