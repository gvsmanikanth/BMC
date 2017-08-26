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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy92ZW5kb3IvanF1ZXJ5LnZhbGlkYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpZigkKCcjbGVhZGdlbicpIHx8ICQoJyNub25sZWFkZ2VuJykpXHR7XHJcblx0Ly9BZGQgaGFyZCBsaW1pdHMgdG8gZm9ybSBmaWVsZHMsIGlmIHRoZXkgYXJlIG5vdCBhbHJlYWR5IGRlZmluZWRcclxuXHQvL2lmKCEkKCdbZGF0YS10eXBlPVwiQ19TYWx1dGF0aW9uMVwiXScpLmF0dHIoJ21heGxlbmd0aCcpKVxyXG5cdFx0Ly8kKCdbZGF0YS10eXBlPVwiQ19TYWx1dGF0aW9uMVwiXScpLmF0dHIoJ21heGxlbmd0aCcsICcxNScpO1xyXG5cdC8vaWYoISQoJ1tkYXRhLXR5cGU9XCJDX1RpdGxlXCJdJykuYXR0cignbWF4bGVuZ3RoJykpXHJcblx0XHQvLyQoJ1tkYXRhLXR5cGU9XCJDX1RpdGxlXCJdJykuYXR0cignbWF4bGVuZ3RoJywgJzc1Jyk7XHJcblx0Ly9pZighJCgnW2RhdGEtdHlwZT1cIkNfQWRkcmVzczFcIl0nKS5hdHRyKCdtYXhsZW5ndGgnKSlcclxuXHRcdC8vJCgnW2RhdGEtdHlwZT1cIkNfQWRkcmVzczFcIl0nKS5hdHRyKCdtYXhsZW5ndGgnLCAnNjAnKTtcclxuXHQvL2lmKCEkKCdbZGF0YS10eXBlPVwiQ19BZGRyZXNzMlwiXScpLmF0dHIoJ21heGxlbmd0aCcpKVxyXG5cdFx0Ly8kKCdbZGF0YS10eXBlPVwiQ19BZGRyZXNzMlwiXScpLmF0dHIoJ21heGxlbmd0aCcsICc2MCcpO1xyXG5cdC8vaWYoISQoJ1tkYXRhLXR5cGU9XCJDX0FkZHJlc3MzXCJdJykuYXR0cignbWF4bGVuZ3RoJykpXHJcblx0XHQvLyQoJ1tkYXRhLXR5cGU9XCJDX0FkZHJlc3MzXCJdJykuYXR0cignbWF4bGVuZ3RoJywgJzYwJyk7XHJcblx0Ly9pZighJCgnW2RhdGEtdHlwZT1cIkNfU3RhdGVfUHJvdlwiXScpLmF0dHIoJ21heGxlbmd0aCcpKVxyXG5cdFx0Ly8kKCdbZGF0YS10eXBlPVwiQ19TdGF0ZV9Qcm92XCJdJykuYXR0cignbWF4bGVuZ3RoJywgJzIwJyk7XHJcblxyXG5cdC8vaWYoISQoJ1tkYXRhLXR5cGU9XCJDX1ppcF9Qb3N0YWxcIl0nKS5hdHRyKCdtYXhsZW5ndGgnKSlcclxuXHRcdC8vJCgnW2RhdGEtdHlwZT1cIkNfWmlwX1Bvc3RhbFwiXScpLmF0dHIoJ21heGxlbmd0aCcsICcxMCcpO1xyXG5cdC8vaWYoISQoJ1tkYXRhLXR5cGU9XCJDX0J1c1Bob25lXCJdJykuYXR0cignbWF4bGVuZ3RoJykpXHJcblx0XHQvLyQoJ1tkYXRhLXR5cGU9XCJDX0J1c1Bob25lXCJdJykuYXR0cignbWF4bGVuZ3RoJywgJzQwJyk7XHJcblx0XHJcblxyXG5cdC8vU3dpdGNoLW9uIHJlZy1leCB2YWxpZGF0aW9ucywgaWYgbm90IGFscmVhZHkgZGVmaW5lZFxyXG5cdC8vU3dpdGNoLW9uIHJlZy1leCB2YWxpZGF0aW9ucywgaWYgbm90IGFscmVhZHkgZGVmaW5lZFxyXG5cdC8vaWYoISQoJ1tkYXRhLXR5cGU9XCJmaXJzdC1uYW1lXCJdJykuYXR0cignZGF0YS12YWxpZGF0aW9uLXR5cGUnKSlcclxuXHQvL1x0JCgnW2RhdGEtdHlwZT1cIkNfRmlyc3ROYW1lXCJdJykuYXR0cignZGF0YS12YWxpZGF0aW9uLXR5cGUnLCAnZm5hbWUnKTtcclxuXHQvL2lmKCEkKCdbZGF0YS10eXBlPVwiQ19MYXN0TmFtZVwiXScpLmF0dHIoJ2RhdGEtdmFsaWRhdGlvbi10eXBlJykpXHJcblx0Ly9cdCQoJ1tkYXRhLXR5cGU9XCJDX0xhc3ROYW1lXCJdJykuYXR0cignZGF0YS12YWxpZGF0aW9uLXR5cGUnLCAnbG5hbWUnKTtcclxuXHQvL2lmKCEkKCdbZGF0YS10eXBlPVwiQ19CdXNQaG9uZVwiXScpLmF0dHIoJ2RhdGEtdmFsaWRhdGlvbi10eXBlJykpXHJcblx0Ly9cdCQoJ1tkYXRhLXR5cGU9XCJDX0J1c1Bob25lXCJdJykuYXR0cignZGF0YS12YWxpZGF0aW9uLXR5cGUnLCAndGVsJyk7XHJcblx0Ly9NaWxpbmQ6IENvbW1lbnRpbmcgb3V0IHRoaXMgbG9naWMgYXMgd2Ugd2lsbCB1cGRhdGUgdGhlIEZpZWxkU2V0IGZvciBVbnN1YnNjcmliZSBmb3JtXHJcblx0Ly9DaGFuZ2UgcmVnLWV4IHZhbGlkYXRpb24gcGF0dGVybiBmb3IgVW5zdWJzY3JpYmUgZm9ybVxyXG5cdC8qXHJcblx0aWYodHlwZW9mIGJtY01ldGEgIT09ICd1bmRlZmluZWQnICYmIGJtY01ldGEuaGFzT3duUHJvcGVydHkoXCJmb3JtXCIpKVx0e1xyXG5cdFx0aWYoYm1jTWV0YS5mb3JtLm5hbWUudG9Mb3dlckNhc2UoKS5pbmRleE9mKFwidW5zdWJzY3JpYmVcIikgPiAtMSlcdHtcclxuXHRcdFx0JCgnI0NfRW1haWxBZGRyZXNzJykuYXR0cigndHlwZScsICd0ZXh0Jyk7XHJcblx0XHRcdCQoJyNDX0VtYWlsQWRkcmVzcycpLmF0dHIoJ2RhdGEtdmFsaWRhdGlvbi10eXBlJywgJ2FsbGVtYWlscycpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHQqL1xyXG5cdFxyXG59XHQvL0VPQyBmb3IgTGVhZGdlbiBvciBOb25MZWFkZ2VuIGZvcm1cdFxyXG5cclxuXHJcbihmdW5jdGlvbigkKSB7XHJcblx0JC5mbi52YWxpZGF0ZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyICR0aGlzID0gdGhpcyxcclxuXHRcdFx0JGZvcm0gPSAkKHRoaXMpLFxyXG5cdFx0XHQkaW5wdXRzID0gJGZvcm0uZmluZCgnaW5wdXQsIHRleHRhcmVhLCBzZWxlY3QnKSxcclxuXHRcdFx0JHN1Ym1pdEJ1dHRvbiA9ICRmb3JtLmZpbmQoJ2J1dHRvblt0eXBlPVwic3VibWl0XCJdJyksXHJcblx0XHRcdGFqYXhGb3JtID0gJGZvcm0uZGF0YSgnYWpheC11cmwnKSAhPT0gdW5kZWZpbmVkO1x0Ly8gYm9vbGVhbiB0aGF0IGRldGVybWluZXMgaWYgYSBmb3JtIGlzIHN1Ym1pdHRlZCB3aXRoIEFKQVhcclxuXHJcblx0XHQvLyBpbml0aWFsaXplIHRoZSBmb3JtIHN0YXRlXHJcblx0XHQkZm9ybS5kYXRhKCd2YWxpZCcsIHRydWUpO1xyXG5cdFx0ZW5hYmxlTG9hZGluZ1N0YXRlKCRzdWJtaXRCdXR0b24pO1xyXG5cclxuXHRcdC8vIGJhc2UgcmVnZXggcGF0dGVybnM7IGh0dHA6Ly9yZWdleDEwMS5jb20vIGlzIGEgZ29vZCB0ZXN0aW5nIGVudmlyb25tZW50XHJcblx0XHQkdGhpcy5wYXR0ZXJucyA9IHtcclxuXHRcdFx0J2FscGhhLW9ubHknIDogXCJeW14wLTkgXVtBLXogXSskXCIsXHQvL3RoaXMgd2lsbCBleGNsdWRlIG51bWVyaWMgZGF0YSBhbmQgY2Fubm90IGJlZ2luIHdpdGggc3BhY2UgYnV0IGNhbiBoYXZlIHNwYWNlIGluLWJldHdlZW4gZm9yIGRvdWJsZSBuYW1lc1xyXG5cdFx0XHQnZmlyc3QtbmFtZScgOiBcIl5bXjAtOSBdW14wLTldezAsMjV9JFwiLFx0Ly8gdGhpcyB3aWxsIGV4Y2x1ZGUgbnVtZXJpYyBkYXRhIGFuZCBjYW5ub3QgYmVnaW4gd2l0aCBzcGFjZVxyXG5cdFx0XHQnbGFzdC1uYW1lJyA6IFwiXlteMC05IF1bXjAtOV17MCw0MH0kXCIsXHQvLyB0aGlzIHdpbGwgZXhjbHVkZSBudW1lcmljIGRhdGEgYW5kIGNhbm5vdCBiZWdpbiB3aXRoIHNwYWNlXHJcblx0XHRcdCdlbWFpbC1idXNpbmVzcycgOiBcIl5bYS16QS1aXVthLXpBLVowLTkuISMkJSYnKisvPT9eX2B7fH1+LV0qQCg/IShnbWFpbFxcXFwuW2EtekEtWjAtOS5dKyQpfChob3RtYWlsXFxcXC5bYS16QS1aMC05Ll0rJCl8KHpvaG9cXFxcLlthLXpBLVowLTkuXSskKXwoeWFuZGV4XFxcXC5bYS16QS1aMC05Ll0rJCl8KG91dGxvb2tcXFxcLlthLXpBLVowLTkuXSskKXwoYWltXFxcXC5bYS16QS1aMC05Ll0rJCl8KGljbG91ZFxcXFwuW2EtekEtWjAtOS5dKyQpfChtZVxcXFwuW2EtekEtWjAtOS5dKyQpfChtYWNcXFxcLlthLXpBLVowLTkuXSskKXwoeWFob29cXFxcLlthLXpBLVowLTkuXSskKXwobWFpbC5jb20kKXwoaW5ib3hcXFxcLlthLXpBLVowLTkuXSskKXwoZ214XFxcXC5bYS16QS1aMC05Ll0rJCl8KG15d2F5XFxcXC5bYS16QS1aMC05Ll0rJCl8KG1zblxcXFwuW2EtekEtWjAtOS5dKyQpKVthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPyg/OlxcXFwuW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KSskXCIsXHJcblx0XHRcdCdlbWFpbC1idXNpbmVzcy1jb21wZXRpdG9yJyA6IFwiXlthLXpBLVpdW2EtekEtWjAtOS4hIyQlJicqKy89P15fYHt8fX4tXSpAKD8hKGdtYWlsXFxcXC5bYS16QS1aMC05Ll0rJCl8KGhvdG1haWxcXFxcLlthLXpBLVowLTkuXSskKXwoem9ob1xcXFwuW2EtekEtWjAtOS5dKyQpfCh5YW5kZXhcXFxcLlthLXpBLVowLTkuXSskKXwob3V0bG9va1xcXFwuW2EtekEtWjAtOS5dKyQpfChhaW1cXFxcLlthLXpBLVowLTkuXSskKXwoaWNsb3VkXFxcXC5bYS16QS1aMC05Ll0rJCl8KG1lXFxcXC5bYS16QS1aMC05Ll0rJCl8KG1hY1xcXFwuW2EtekEtWjAtOS5dKyQpfCh5YWhvb1xcXFwuW2EtekEtWjAtOS5dKyQpfChtYWlsLmNvbSQpfChpbmJveFxcXFwuW2EtekEtWjAtOS5dKyQpfChnbXhcXFxcLlthLXpBLVowLTkuXSskKXwobXl3YXlcXFxcLlthLXpBLVowLTkuXSskKXwoaWJtLmNvbSQpfChocGUuY29tJCl8KGhwLmNvbSQpfChjaGVmLmlvJCl8KHRyaXB3aXJlLmNvbSQpfChzZXJ2aWNlbm93LmNvbSQpfChibWMuY29tJCl8KG1zblxcXFwuW2EtekEtWjAtOS5dKyQpKVthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPyg/OlxcXFwuW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KSskXCIsXHJcblx0XHRcdCdlbWFpbC1hbGwnIDogXCJeW2EtekEtWl1bYS16QS1aMC05LiEjJCUmJyorLz0/Xl9ge3x9fi1dKkBbYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8oPzpcXFxcLlthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPykrJFwiLFxyXG5cdFx0XHQndGVsJ1x0OiBcIl4oWzAtOS0uKyAoKV0qXFxcXGQpezEwfVstLisgKCldKiRcIixcdC8vIHRoaXMgd2lsbCBhbGxvdyBudW1iZXJzLCBoeXBoZW5zLCBwZXJpb2RzLCBwbHVzLCBzcGFjZSBhbmQgb3BlbiAmIGNsb3NlIHBhcmVudGhlc2lzIEFORCBhdCBsZWFzdCAxMCBkaWdpdHNcclxuXHRcdH07XHJcblxyXG5cdFx0ZnVuY3Rpb24gZGlzYWJsZUxvYWRpbmdTdGF0ZSgkZWxlbWVudCkge1xyXG5cdFx0XHQkZWxlbWVudFxyXG5cdFx0XHRcdC5hdHRyKCdkaXNhYmxlZCcsIGZhbHNlKVxyXG5cdFx0XHRcdC5yZW1vdmVDbGFzcygnYnRuLWxvYWRpbmcnKTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBlbmFibGVMb2FkaW5nU3RhdGUoJGVsZW1lbnQpIHtcclxuXHRcdFx0JGVsZW1lbnRcclxuXHRcdFx0XHQuYXR0cignZGlzYWJsZWQnLCAnZGlzYWJsZWQnKVxyXG5cdFx0XHRcdC5hZGRDbGFzcygnYnRuLWxvYWRpbmcnKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXRzIGFuIGlucHV0IGFuZCB0aGUgZm9ybSBhcyBpbnZhbGlkXHJcblx0XHRmdW5jdGlvbiBzZXRJbnZhbGlkKCRpbnB1dCwgcmFkaW9PckNoZWNrYm94LCBuYW1lKSB7XHJcblx0XHRcdC8vIGFwcGx5IGVycm9yIHN0eWxlc1xyXG5cdFx0XHRpZiAoJGlucHV0LnBhcmVudCgpLmlzKCcuZGVjb3JhdG9yLXNlbGVjdCcpKSB7XHJcblx0XHRcdFx0JGlucHV0LnBhcmVudCgpLmFkZENsYXNzKCd2YWxpZGF0aW9uLWVycm9yJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAocmFkaW9PckNoZWNrYm94KSB7XHJcblx0XHRcdFx0JCgnW25hbWU9XCInICsgbmFtZSArICdcIl0nKS5wYXJlbnQoKS5maW5kKCdsYWJlbCcpLmFkZENsYXNzKCd2YWxpZGF0aW9uLWVycm9yJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0JGlucHV0LmFkZENsYXNzKCd2YWxpZGF0aW9uLWVycm9yJyk7XHJcblxyXG5cdFx0XHRcdC8vTG9naWMgdG8gc2hvdyBFcnJvciBoaW50XHJcblx0XHRcdFx0dmFyIGVycl9oaW50ID0gKCRpbnB1dC5kYXRhKCdlcnJvci1oaW50JykgIT0gJycpID8gJGlucHV0LmRhdGEoJ2Vycm9yLWhpbnQnKSA6ICRpbnB1dC5hdHRyKCdwbGFjZWhvbGRlcicpO1xyXG5cdFx0XHRcdCRpbnB1dC5wcmV2KCdsYWJlbDpmaXJzdCcpLnRleHQoZXJyX2hpbnQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHQvLyByZXNldCB0byBPcmlnaW5hbCBMYWJlbFxyXG5cdFx0XHQkaW5wdXRcclxuXHRcdFx0Lm9uKCdrZXl1cCBjaGFuZ2UnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0ICBpZigkaW5wdXQudmFsKCkubGVuZ3RoID09IDApXHJcblx0XHRcdCAgICAkaW5wdXQucHJldignbGFiZWw6Zmlyc3QnKS50ZXh0KCRpbnB1dC5hdHRyKCdwbGFjZWhvbGRlcicpKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQvLyByZW1vdmUgZXJyb3Igc3R5bGVzIGlmIGEgdmFsdWUgaXMgY2hhbmdlZFxyXG5cdFx0XHQkaW5wdXRcclxuXHRcdFx0XHQub24oJ2tleXVwIGNoYW5nZScsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0JCh0aGlzKVxyXG5cdFx0XHRcdFx0XHQuYWRkKCdsYWJlbFtmb3I9XCInICsgbmFtZSArICdcIl0nKVxyXG5cdFx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoJ3ZhbGlkYXRpb24tZXJyb3InKVxyXG5cdFx0XHRcdFx0XHQucGFyZW50KClcclxuXHRcdFx0XHRcdFx0LnJlbW92ZUNsYXNzKCd2YWxpZGF0aW9uLWVycm9yJyk7XHJcblxyXG5cdFx0XHRcdFx0Ly9jbGVhcnMgb3V0IHZhbGlkIGFsbCByYWRpb3MgaW4gZ3JvdXBzXHJcblx0XHRcdFx0XHRpZigkKHRoaXMpLmlzKCdbdHlwZT1cInJhZGlvXCJdJykpe1xyXG5cdFx0XHRcdFx0XHRpZigkKHRoaXMpLnBhcmVudHMoJy5mb3JtLWdyb3VwJykubGVuZ3RoKXtcclxuXHRcdFx0XHRcdFx0XHQkKHRoaXMpLnBhcmVudHMoJy5mb3JtLWdyb3VwJykuZmluZCgnbGFiZWwnKS5lYWNoKGZ1bmN0aW9uKGkpe1xyXG5cdFx0XHRcdFx0XHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcygndmFsaWRhdGlvbi1lcnJvcicpO1xyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQvL2NsZWFycyBvdXQgaW5kaXZpZHVhbCBjaGVja2JveGUgaW4gZ3JvdXBzXHJcblx0XHRcdFx0XHRpZigkKHRoaXMpLmlzKCdbdHlwZT1cImNoZWNrYm94XCJdJykpe1xyXG5cdFx0XHRcdFx0XHQkKHRoaXMpLm5leHQoJ2xhYmVsJykucmVtb3ZlQ2xhc3MoJ3ZhbGlkYXRpb24tZXJyb3InKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdC8vIHJhZGlvcyAmIGNoZWNrYm94ZXNcdFx0XHJcblxyXG5cdFx0XHQkZm9ybVxyXG5cdFx0XHRcdC5kYXRhKCd2YWxpZCcsIGZhbHNlKTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBzY3JvbGxUb0Zvcm0oKSB7XHJcblx0XHRcdCQoJ2h0bWwsIGJvZHknKVxyXG5cdFx0XHRcdC5hbmltYXRlKHtcclxuXHRcdFx0XHRcdHNjcm9sbFRvcDogJGZvcm0ub2Zmc2V0KCkudG9wIC0gMTAwXHJcblx0XHRcdFx0fSwgNTAwKTtcclxuXHJcblx0XHRcdGRpc2FibGVMb2FkaW5nU3RhdGUoJHN1Ym1pdEJ1dHRvbik7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gc2Nyb2xsVG9JbnZhbGlkKCkge1xyXG5cdFx0XHQkKCdodG1sLCBib2R5JylcclxuXHRcdFx0XHQuYW5pbWF0ZSh7XHJcblx0XHRcdFx0XHRzY3JvbGxUb3A6ICQoJy52YWxpZGF0aW9uLWVycm9yJykub2Zmc2V0KCkudG9wIC0gMTAwXHJcblx0XHRcdFx0fSwgNTAwKTtcclxuXHJcblx0XHRcdGRpc2FibGVMb2FkaW5nU3RhdGUoJHN1Ym1pdEJ1dHRvbik7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vIHRvIGJlIHVzZWQgZm9yIHRlc3RpbmcgVW5pY29kZSBpbnB1dFxyXG5cdFx0ZnVuY3Rpb24gZ2V0TGVuZ3RoSW5CeXRlcyhzdHIpIHtcclxuXHRcdCAgdmFyIGIgPSBzdHIubWF0Y2goL1teXFx4MDAtXFx4ZmZdL2cpO1xyXG5cdFx0ICByZXR1cm4gKHN0ci5sZW5ndGggKyAoIWIgPyAwOiBiLmxlbmd0aCkpOyBcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBzdWJtaXRWYWxpZEFqYXhGb3JtKCkge1xyXG5cdFx0XHR2YXIgc3VibWl0dGVkT2JqZWN0ID0gJGZvcm0uc2VyaWFsaXplT2JqZWN0KCk7XHJcblxyXG5cdFx0XHQvLyBjb21iaW5lIFRvcGljIG9mIEludGVyZXN0IHdpdGggQ29tbWVudHNcclxuXHRcdFx0c3VibWl0dGVkT2JqZWN0LkNfRGVzY3JpcHRpb24xID0gJ1RvcGljIG9mIGludGVyZXN0OiAnICsgc3VibWl0dGVkT2JqZWN0LkNfUHJvZHVjdEludGVyZXN0ICsgJ1xcclxcbkFkZGl0aW9uYWwgY29tbWVudHM6ICcgKyBzdWJtaXR0ZWRPYmplY3QuQ19EZXNjcmlwdGlvbjE7XHJcblxyXG5cdFx0XHQkLmFqYXgoe1xyXG5cdFx0XHRcdHVybDogJGZvcm0uZGF0YSgnYWpheC11cmwnKSxcclxuXHRcdFx0XHR0eXBlOiAnUE9TVCcsXHJcblx0XHRcdFx0ZGF0YVR5cGU6ICdIVE1MJyxcclxuXHRcdFx0XHRkYXRhOiBzdWJtaXR0ZWRPYmplY3RcclxuXHRcdFx0fSlcclxuXHRcdFx0LmRvbmUoZnVuY3Rpb24oZGF0YSkge1xyXG5cdFx0XHRcdCRmb3JtXHJcblx0XHRcdFx0XHQuZmluZCgnLnZhbGlkYXRpb24tZXJyb3InKVxyXG5cdFx0XHRcdFx0LnJlbW92ZSgpXHJcblx0XHRcdFx0XHQuZW5kKClcclxuXHRcdFx0XHRcdC5lbXB0eSgpXHJcblx0XHRcdFx0XHQuaGlkZSgpXHJcblx0XHRcdFx0XHQuaHRtbCgnPGgyPlRoYW5rIHlvdSwgJyArIHN1Ym1pdHRlZE9iamVjdC5DX0ZpcnN0TmFtZSArICcuPC9oMj48cD5XZSB3aWxsIGJlIGluIHRvdWNoIHNvb24gdG8gZGlzY3VzcyB5b3VyIG5lZWRzPC9wPicpXHJcblx0XHRcdFx0XHQuZmFkZUluKCk7XHJcblxyXG5cdFx0XHRcdHNjcm9sbFRvRm9ybSgpO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHQvLyBpZiB0aGUgVVJMIGNhbm5vdCBiZSBsb2NhdGVkXHJcblx0XHRcdC5mYWlsKGZ1bmN0aW9uKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikge1xyXG5cdFx0XHRcdCRmb3JtXHJcblx0XHRcdFx0XHQuZW1wdHkoKVxyXG5cdFx0XHRcdFx0LmhpZGUoKVxyXG5cdFx0XHRcdFx0Lmh0bWwoJzxwIGNsYXNzPVwidmFsaWRhdGlvbi1lcnJvclwiPicgKyBlcnJvclRocm93biArICc8L3A+JylcclxuXHRcdFx0XHRcdC5mYWRlSW4oKTtcclxuXHJcblx0XHRcdFx0c2Nyb2xsVG9Gb3JtKCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHZhbGlkYXRlIGVhY2ggaW5wdXRcclxuXHRcdCRpbnB1dHNcclxuXHRcdFx0LmVhY2goZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyICRpbnB1dCA9ICQodGhpcyk7XHJcblx0XHRcdFx0aWYoJGlucHV0LmdldCgwKS5nZXRBdHRyaWJ1dGUoJ3JlcXVpcmVkJykgIT0gJ2ZhbHNlJyl7XHJcblx0XHRcdFx0XHR2YXJcdHZhbHVlID0gJGlucHV0LnZhbCgpLFxyXG5cdFx0XHRcdFx0XHRyZXF1aXJlZCA9ICRpbnB1dC5hdHRyKCdyZXF1aXJlZCcpICE9PSB1bmRlZmluZWQsXHJcblx0XHRcdFx0XHRcdHR5cGUgPSAkaW5wdXQuYXR0cigndHlwZScpLFxyXG5cdFx0XHRcdFx0XHQvL01pbGluZDogVmFsaWRhdGlvbiB0eXBlIGdldHMgaGlnaGVyIHByZWNlZGVuY2UgdGhhbiB0eXBlXHJcblx0XHRcdFx0XHRcdC8vdmFsaWRhdGlvblR5cGUgPSAodHlwZSA9PT0gJ3RleHQnKSA/ICRpbnB1dC5kYXRhKCd2YWxpZGF0aW9uLXR5cGUnKSA6IHR5cGUsXHJcblx0XHRcdFx0XHRcdHZhbGlkYXRpb25UeXBlID0gKCRpbnB1dC5kYXRhKCd2YWxpZGF0aW9uLXR5cGUnKSkgPyAkaW5wdXQuZGF0YSgndmFsaWRhdGlvbi10eXBlJykgOiB0eXBlLFxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdHJhZGlvT3JDaGVja2JveCA9ICh0eXBlID09PSAncmFkaW8nIHx8IHR5cGUgPT09ICdjaGVja2JveCcpLFxyXG5cdFx0XHRcdFx0XHRuYW1lID0gJGlucHV0LmF0dHIoJ25hbWUnKSxcclxuXHRcdFx0XHRcdFx0cGF0dGVybjtcclxuXHJcblx0XHRcdFx0XHQvLyB0ZXN0IGlmIHRoZSBpbnB1dCBpcyByZXF1aXJlZFxyXG5cdFx0XHRcdFx0aWYgKHJlcXVpcmVkICYmICh2YWx1ZSA9PT0gJycgfHwgdmFsdWUgPT09IG51bGwpKSB7XHJcblx0XHRcdFx0XHRcdHNldEludmFsaWQoJGlucHV0KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2UgaWYgKHJlcXVpcmVkICYmIHJhZGlvT3JDaGVja2JveCAmJiAkKCdbbmFtZT1cIicgKyBuYW1lICsgJ1wiXScpLmlzKCc6Y2hlY2tlZCcpID09PSBmYWxzZSkge1xyXG5cdFx0XHRcdFx0XHRzZXRJbnZhbGlkKCRpbnB1dCwgcmFkaW9PckNoZWNrYm94LCBuYW1lKTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHQvLyB0ZXN0IHRoZSBpbnB1dCBhZ2FpbnN0IGl0cyByZWdleCBwYXR0ZXJuXHJcblx0XHRcdFx0XHRpZiAocmVxdWlyZWQgJiYgJHRoaXMucGF0dGVybnNbdmFsaWRhdGlvblR5cGVdKSB7XHJcblx0XHRcdFx0XHRcdHBhdHRlcm4gPSBuZXcgUmVnRXhwKCR0aGlzLnBhdHRlcm5zW3ZhbGlkYXRpb25UeXBlXSk7XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAoIXBhdHRlcm4udGVzdCh2YWx1ZS50b0xvd2VyQ2FzZSgpKSkge1xyXG5cdFx0XHRcdFx0XHRcdHNldEludmFsaWQoJGlucHV0KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdC8vIHRlc3QgZm9yIFVuaWNvZGUgaW5wdXQgaS5lLiBub24tRW5nbGlzaCBjaGFyYWN0ZXJzXHJcblx0XHRcdFx0XHRpZiAodHlwZSA9PSAndGV4dCcpIHtcclxuXHRcdFx0XHRcdFx0Ly9DaGFyIGxlbmd0aCAhPSBOby4gb2YgQnl0ZXMgOj0gaW5wdXQgaXMgVW5pY29kZVxyXG5cdFx0XHRcdFx0XHRpZiAodmFsdWUubGVuZ3RoICE9IGdldExlbmd0aEluQnl0ZXModmFsdWUpKSB7XHJcblx0XHRcdFx0XHRcdFx0c2V0SW52YWxpZCgkaW5wdXQpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0Ly8gdGVzdCBpZiB0aGUgaG9uZXlwb3QgaXMgZmlsbGVkIG91dFxyXG5cdFx0XHRcdFx0aWYgKCRpbnB1dC5kYXRhKCdpbnB1dC1ob25leXBvdCcpICYmICRpbnB1dC52YWwoKSAhPT0gJycpIHtcclxuXHRcdFx0XHRcdFx0c2V0SW52YWxpZCgkaW5wdXQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdFx0LnByb21pc2UoKVxyXG5cdFx0XHQuZG9uZShmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRpZiAoJGZvcm0uZGF0YSgndmFsaWQnKSkge1xyXG5cdFx0XHRcdFx0aWYgKGFqYXhGb3JtKSB7XHJcblx0XHRcdFx0XHRcdHN1Ym1pdFZhbGlkQWpheEZvcm0oKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHQkZm9ybS5zdWJtaXQoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRzY3JvbGxUb0ludmFsaWQoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdH07XHJcbn0pIChqUXVlcnkpOyJdfQ==
