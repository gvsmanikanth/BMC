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
				$('label[for="' + name + '"]').addClass('validation-error');
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
				});

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
					else if (required && radioOrCheckbox && $('[name="' + name + '"]:checked').length === 0) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy92ZW5kb3IvanF1ZXJ5LnZhbGlkYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpZigkKCcjbGVhZGdlbicpIHx8ICQoJyNub25sZWFkZ2VuJykpXHR7XHJcblx0Ly9BZGQgaGFyZCBsaW1pdHMgdG8gZm9ybSBmaWVsZHMsIGlmIHRoZXkgYXJlIG5vdCBhbHJlYWR5IGRlZmluZWRcclxuXHQvL2lmKCEkKCdbZGF0YS10eXBlPVwiQ19TYWx1dGF0aW9uMVwiXScpLmF0dHIoJ21heGxlbmd0aCcpKVxyXG5cdFx0Ly8kKCdbZGF0YS10eXBlPVwiQ19TYWx1dGF0aW9uMVwiXScpLmF0dHIoJ21heGxlbmd0aCcsICcxNScpO1xyXG5cdC8vaWYoISQoJ1tkYXRhLXR5cGU9XCJDX1RpdGxlXCJdJykuYXR0cignbWF4bGVuZ3RoJykpXHJcblx0XHQvLyQoJ1tkYXRhLXR5cGU9XCJDX1RpdGxlXCJdJykuYXR0cignbWF4bGVuZ3RoJywgJzc1Jyk7XHJcblx0Ly9pZighJCgnW2RhdGEtdHlwZT1cIkNfQWRkcmVzczFcIl0nKS5hdHRyKCdtYXhsZW5ndGgnKSlcclxuXHRcdC8vJCgnW2RhdGEtdHlwZT1cIkNfQWRkcmVzczFcIl0nKS5hdHRyKCdtYXhsZW5ndGgnLCAnNjAnKTtcclxuXHQvL2lmKCEkKCdbZGF0YS10eXBlPVwiQ19BZGRyZXNzMlwiXScpLmF0dHIoJ21heGxlbmd0aCcpKVxyXG5cdFx0Ly8kKCdbZGF0YS10eXBlPVwiQ19BZGRyZXNzMlwiXScpLmF0dHIoJ21heGxlbmd0aCcsICc2MCcpO1xyXG5cdC8vaWYoISQoJ1tkYXRhLXR5cGU9XCJDX0FkZHJlc3MzXCJdJykuYXR0cignbWF4bGVuZ3RoJykpXHJcblx0XHQvLyQoJ1tkYXRhLXR5cGU9XCJDX0FkZHJlc3MzXCJdJykuYXR0cignbWF4bGVuZ3RoJywgJzYwJyk7XHJcblx0Ly9pZighJCgnW2RhdGEtdHlwZT1cIkNfU3RhdGVfUHJvdlwiXScpLmF0dHIoJ21heGxlbmd0aCcpKVxyXG5cdFx0Ly8kKCdbZGF0YS10eXBlPVwiQ19TdGF0ZV9Qcm92XCJdJykuYXR0cignbWF4bGVuZ3RoJywgJzIwJyk7XHJcblxyXG5cdC8vaWYoISQoJ1tkYXRhLXR5cGU9XCJDX1ppcF9Qb3N0YWxcIl0nKS5hdHRyKCdtYXhsZW5ndGgnKSlcclxuXHRcdC8vJCgnW2RhdGEtdHlwZT1cIkNfWmlwX1Bvc3RhbFwiXScpLmF0dHIoJ21heGxlbmd0aCcsICcxMCcpO1xyXG5cdC8vaWYoISQoJ1tkYXRhLXR5cGU9XCJDX0J1c1Bob25lXCJdJykuYXR0cignbWF4bGVuZ3RoJykpXHJcblx0XHQvLyQoJ1tkYXRhLXR5cGU9XCJDX0J1c1Bob25lXCJdJykuYXR0cignbWF4bGVuZ3RoJywgJzQwJyk7XHJcblx0XHJcblxyXG5cdC8vU3dpdGNoLW9uIHJlZy1leCB2YWxpZGF0aW9ucywgaWYgbm90IGFscmVhZHkgZGVmaW5lZFxyXG5cdC8vU3dpdGNoLW9uIHJlZy1leCB2YWxpZGF0aW9ucywgaWYgbm90IGFscmVhZHkgZGVmaW5lZFxyXG5cdC8vaWYoISQoJ1tkYXRhLXR5cGU9XCJmaXJzdC1uYW1lXCJdJykuYXR0cignZGF0YS12YWxpZGF0aW9uLXR5cGUnKSlcclxuXHQvL1x0JCgnW2RhdGEtdHlwZT1cIkNfRmlyc3ROYW1lXCJdJykuYXR0cignZGF0YS12YWxpZGF0aW9uLXR5cGUnLCAnZm5hbWUnKTtcclxuXHQvL2lmKCEkKCdbZGF0YS10eXBlPVwiQ19MYXN0TmFtZVwiXScpLmF0dHIoJ2RhdGEtdmFsaWRhdGlvbi10eXBlJykpXHJcblx0Ly9cdCQoJ1tkYXRhLXR5cGU9XCJDX0xhc3ROYW1lXCJdJykuYXR0cignZGF0YS12YWxpZGF0aW9uLXR5cGUnLCAnbG5hbWUnKTtcclxuXHQvL2lmKCEkKCdbZGF0YS10eXBlPVwiQ19CdXNQaG9uZVwiXScpLmF0dHIoJ2RhdGEtdmFsaWRhdGlvbi10eXBlJykpXHJcblx0Ly9cdCQoJ1tkYXRhLXR5cGU9XCJDX0J1c1Bob25lXCJdJykuYXR0cignZGF0YS12YWxpZGF0aW9uLXR5cGUnLCAndGVsJyk7XHJcblx0Ly9NaWxpbmQ6IENvbW1lbnRpbmcgb3V0IHRoaXMgbG9naWMgYXMgd2Ugd2lsbCB1cGRhdGUgdGhlIEZpZWxkU2V0IGZvciBVbnN1YnNjcmliZSBmb3JtXHJcblx0Ly9DaGFuZ2UgcmVnLWV4IHZhbGlkYXRpb24gcGF0dGVybiBmb3IgVW5zdWJzY3JpYmUgZm9ybVxyXG5cdC8qXHJcblx0aWYodHlwZW9mIGJtY01ldGEgIT09ICd1bmRlZmluZWQnICYmIGJtY01ldGEuaGFzT3duUHJvcGVydHkoXCJmb3JtXCIpKVx0e1xyXG5cdFx0aWYoYm1jTWV0YS5mb3JtLm5hbWUudG9Mb3dlckNhc2UoKS5pbmRleE9mKFwidW5zdWJzY3JpYmVcIikgPiAtMSlcdHtcclxuXHRcdFx0JCgnI0NfRW1haWxBZGRyZXNzJykuYXR0cigndHlwZScsICd0ZXh0Jyk7XHJcblx0XHRcdCQoJyNDX0VtYWlsQWRkcmVzcycpLmF0dHIoJ2RhdGEtdmFsaWRhdGlvbi10eXBlJywgJ2FsbGVtYWlscycpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHQqL1xyXG5cdFxyXG59XHQvL0VPQyBmb3IgTGVhZGdlbiBvciBOb25MZWFkZ2VuIGZvcm1cdFxyXG5cclxuXHJcbihmdW5jdGlvbigkKSB7XHJcblx0JC5mbi52YWxpZGF0ZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyICR0aGlzID0gdGhpcyxcclxuXHRcdFx0JGZvcm0gPSAkKHRoaXMpLFxyXG5cdFx0XHQkaW5wdXRzID0gJGZvcm0uZmluZCgnaW5wdXQsIHRleHRhcmVhLCBzZWxlY3QnKSxcclxuXHRcdFx0JHN1Ym1pdEJ1dHRvbiA9ICRmb3JtLmZpbmQoJ2J1dHRvblt0eXBlPVwic3VibWl0XCJdJyksXHJcblx0XHRcdGFqYXhGb3JtID0gJGZvcm0uZGF0YSgnYWpheC11cmwnKSAhPT0gdW5kZWZpbmVkO1x0Ly8gYm9vbGVhbiB0aGF0IGRldGVybWluZXMgaWYgYSBmb3JtIGlzIHN1Ym1pdHRlZCB3aXRoIEFKQVhcclxuXHJcblx0XHQvLyBpbml0aWFsaXplIHRoZSBmb3JtIHN0YXRlXHJcblx0XHQkZm9ybS5kYXRhKCd2YWxpZCcsIHRydWUpO1xyXG5cdFx0ZW5hYmxlTG9hZGluZ1N0YXRlKCRzdWJtaXRCdXR0b24pO1xyXG5cclxuXHRcdC8vIGJhc2UgcmVnZXggcGF0dGVybnM7IGh0dHA6Ly9yZWdleDEwMS5jb20vIGlzIGEgZ29vZCB0ZXN0aW5nIGVudmlyb25tZW50XHJcblx0XHQkdGhpcy5wYXR0ZXJucyA9IHtcclxuXHRcdFx0J2FscGhhLW9ubHknIDogXCJeW14wLTkgXVtBLXogXSskXCIsXHQvL3RoaXMgd2lsbCBleGNsdWRlIG51bWVyaWMgZGF0YSBhbmQgY2Fubm90IGJlZ2luIHdpdGggc3BhY2UgYnV0IGNhbiBoYXZlIHNwYWNlIGluLWJldHdlZW4gZm9yIGRvdWJsZSBuYW1lc1xyXG5cdFx0XHQnZmlyc3QtbmFtZScgOiBcIl5bXjAtOSBdW14wLTldezAsMjV9JFwiLFx0Ly8gdGhpcyB3aWxsIGV4Y2x1ZGUgbnVtZXJpYyBkYXRhIGFuZCBjYW5ub3QgYmVnaW4gd2l0aCBzcGFjZVxyXG5cdFx0XHQnbGFzdC1uYW1lJyA6IFwiXlteMC05IF1bXjAtOV17MCw0MH0kXCIsXHQvLyB0aGlzIHdpbGwgZXhjbHVkZSBudW1lcmljIGRhdGEgYW5kIGNhbm5vdCBiZWdpbiB3aXRoIHNwYWNlXHJcblx0XHRcdCdlbWFpbC1idXNpbmVzcycgOiBcIl5bYS16QS1aXVthLXpBLVowLTkuISMkJSYnKisvPT9eX2B7fH1+LV0qQCg/IShnbWFpbFxcXFwuW2EtekEtWjAtOS5dKyQpfChob3RtYWlsXFxcXC5bYS16QS1aMC05Ll0rJCl8KHpvaG9cXFxcLlthLXpBLVowLTkuXSskKXwoeWFuZGV4XFxcXC5bYS16QS1aMC05Ll0rJCl8KG91dGxvb2tcXFxcLlthLXpBLVowLTkuXSskKXwoYWltXFxcXC5bYS16QS1aMC05Ll0rJCl8KGljbG91ZFxcXFwuW2EtekEtWjAtOS5dKyQpfChtZVxcXFwuW2EtekEtWjAtOS5dKyQpfChtYWNcXFxcLlthLXpBLVowLTkuXSskKXwoeWFob29cXFxcLlthLXpBLVowLTkuXSskKXwobWFpbC5jb20kKXwoaW5ib3hcXFxcLlthLXpBLVowLTkuXSskKXwoZ214XFxcXC5bYS16QS1aMC05Ll0rJCl8KG15d2F5XFxcXC5bYS16QS1aMC05Ll0rJCl8KG1zblxcXFwuW2EtekEtWjAtOS5dKyQpKVthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPyg/OlxcXFwuW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KSskXCIsXHJcblx0XHRcdCdlbWFpbC1idXNpbmVzcy1jb21wZXRpdG9yJyA6IFwiXlthLXpBLVpdW2EtekEtWjAtOS4hIyQlJicqKy89P15fYHt8fX4tXSpAKD8hKGdtYWlsXFxcXC5bYS16QS1aMC05Ll0rJCl8KGhvdG1haWxcXFxcLlthLXpBLVowLTkuXSskKXwoem9ob1xcXFwuW2EtekEtWjAtOS5dKyQpfCh5YW5kZXhcXFxcLlthLXpBLVowLTkuXSskKXwob3V0bG9va1xcXFwuW2EtekEtWjAtOS5dKyQpfChhaW1cXFxcLlthLXpBLVowLTkuXSskKXwoaWNsb3VkXFxcXC5bYS16QS1aMC05Ll0rJCl8KG1lXFxcXC5bYS16QS1aMC05Ll0rJCl8KG1hY1xcXFwuW2EtekEtWjAtOS5dKyQpfCh5YWhvb1xcXFwuW2EtekEtWjAtOS5dKyQpfChtYWlsLmNvbSQpfChpbmJveFxcXFwuW2EtekEtWjAtOS5dKyQpfChnbXhcXFxcLlthLXpBLVowLTkuXSskKXwobXl3YXlcXFxcLlthLXpBLVowLTkuXSskKXwoaWJtLmNvbSQpfChocGUuY29tJCl8KGhwLmNvbSQpfChjaGVmLmlvJCl8KHRyaXB3aXJlLmNvbSQpfChzZXJ2aWNlbm93LmNvbSQpfChibWMuY29tJCl8KG1zblxcXFwuW2EtekEtWjAtOS5dKyQpKVthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPyg/OlxcXFwuW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KSskXCIsXHJcblx0XHRcdCdlbWFpbC1hbGwnIDogXCJeW2EtekEtWl1bYS16QS1aMC05LiEjJCUmJyorLz0/Xl9ge3x9fi1dKkBbYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8oPzpcXFxcLlthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPykrJFwiLFxyXG5cdFx0XHQndGVsJ1x0OiBcIl4oWzAtOS0uKyAoKV0qXFxcXGQpezEwfVstLisgKCldKiRcIixcdC8vIHRoaXMgd2lsbCBhbGxvdyBudW1iZXJzLCBoeXBoZW5zLCBwZXJpb2RzLCBwbHVzLCBzcGFjZSBhbmQgb3BlbiAmIGNsb3NlIHBhcmVudGhlc2lzIEFORCBhdCBsZWFzdCAxMCBkaWdpdHNcclxuXHRcdH07XHJcblxyXG5cdFx0ZnVuY3Rpb24gZGlzYWJsZUxvYWRpbmdTdGF0ZSgkZWxlbWVudCkge1xyXG5cdFx0XHQkZWxlbWVudFxyXG5cdFx0XHRcdC5hdHRyKCdkaXNhYmxlZCcsIGZhbHNlKVxyXG5cdFx0XHRcdC5yZW1vdmVDbGFzcygnYnRuLWxvYWRpbmcnKTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBlbmFibGVMb2FkaW5nU3RhdGUoJGVsZW1lbnQpIHtcclxuXHRcdFx0JGVsZW1lbnRcclxuXHRcdFx0XHQuYXR0cignZGlzYWJsZWQnLCAnZGlzYWJsZWQnKVxyXG5cdFx0XHRcdC5hZGRDbGFzcygnYnRuLWxvYWRpbmcnKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXRzIGFuIGlucHV0IGFuZCB0aGUgZm9ybSBhcyBpbnZhbGlkXHJcblx0XHRmdW5jdGlvbiBzZXRJbnZhbGlkKCRpbnB1dCwgcmFkaW9PckNoZWNrYm94LCBuYW1lKSB7XHJcblx0XHRcdC8vIGFwcGx5IGVycm9yIHN0eWxlc1xyXG5cdFx0XHRpZiAoJGlucHV0LnBhcmVudCgpLmlzKCcuZGVjb3JhdG9yLXNlbGVjdCcpKSB7XHJcblx0XHRcdFx0JGlucHV0LnBhcmVudCgpLmFkZENsYXNzKCd2YWxpZGF0aW9uLWVycm9yJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAocmFkaW9PckNoZWNrYm94KSB7XHJcblx0XHRcdFx0JCgnbGFiZWxbZm9yPVwiJyArIG5hbWUgKyAnXCJdJykuYWRkQ2xhc3MoJ3ZhbGlkYXRpb24tZXJyb3InKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHQkaW5wdXQuYWRkQ2xhc3MoJ3ZhbGlkYXRpb24tZXJyb3InKTtcclxuXHJcblx0XHRcdFx0Ly9Mb2dpYyB0byBzaG93IEVycm9yIGhpbnRcclxuXHRcdFx0XHR2YXIgZXJyX2hpbnQgPSAoJGlucHV0LmRhdGEoJ2Vycm9yLWhpbnQnKSAhPSAnJykgPyAkaW5wdXQuZGF0YSgnZXJyb3ItaGludCcpIDogJGlucHV0LmF0dHIoJ3BsYWNlaG9sZGVyJyk7XHJcblx0XHRcdFx0JGlucHV0LnByZXYoJ2xhYmVsOmZpcnN0JykudGV4dChlcnJfaGludCk7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdC8vIHJlc2V0IHRvIE9yaWdpbmFsIExhYmVsXHJcbiAgICAgICRpbnB1dFxyXG4gICAgICAgIC5vbigna2V5dXAgY2hhbmdlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBpZigkaW5wdXQudmFsKCkubGVuZ3RoID09IDApXHJcbiAgICAgICAgICAgICRpbnB1dC5wcmV2KCdsYWJlbDpmaXJzdCcpLnRleHQoJGlucHV0LmF0dHIoJ3BsYWNlaG9sZGVyJykpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuXHRcdFx0Ly8gcmVtb3ZlIGVycm9yIHN0eWxlcyBpZiBhIHZhbHVlIGlzIGNoYW5nZWRcclxuXHRcdFx0JGlucHV0XHJcblx0XHRcdFx0Lm9uKCdrZXl1cCBjaGFuZ2UnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdCQodGhpcylcclxuXHRcdFx0XHRcdFx0LmFkZCgnbGFiZWxbZm9yPVwiJyArIG5hbWUgKyAnXCJdJylcclxuXHRcdFx0XHRcdFx0LnJlbW92ZUNsYXNzKCd2YWxpZGF0aW9uLWVycm9yJylcclxuXHRcdFx0XHRcdFx0LnBhcmVudCgpXHJcblx0XHRcdFx0XHRcdC5yZW1vdmVDbGFzcygndmFsaWRhdGlvbi1lcnJvcicpO1xyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0JGZvcm1cclxuXHRcdFx0XHQuZGF0YSgndmFsaWQnLCBmYWxzZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gc2Nyb2xsVG9Gb3JtKCkge1xyXG5cdFx0XHQkKCdodG1sLCBib2R5JylcclxuXHRcdFx0XHQuYW5pbWF0ZSh7XHJcblx0XHRcdFx0XHRzY3JvbGxUb3A6ICRmb3JtLm9mZnNldCgpLnRvcCAtIDEwMFxyXG5cdFx0XHRcdH0sIDUwMCk7XHJcblxyXG5cdFx0XHRkaXNhYmxlTG9hZGluZ1N0YXRlKCRzdWJtaXRCdXR0b24pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIHNjcm9sbFRvSW52YWxpZCgpIHtcclxuXHRcdFx0JCgnaHRtbCwgYm9keScpXHJcblx0XHRcdFx0LmFuaW1hdGUoe1xyXG5cdFx0XHRcdFx0c2Nyb2xsVG9wOiAkKCcudmFsaWRhdGlvbi1lcnJvcicpLm9mZnNldCgpLnRvcCAtIDEwMFxyXG5cdFx0XHRcdH0sIDUwMCk7XHJcblxyXG5cdFx0XHRkaXNhYmxlTG9hZGluZ1N0YXRlKCRzdWJtaXRCdXR0b24pO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyB0byBiZSB1c2VkIGZvciB0ZXN0aW5nIFVuaWNvZGUgaW5wdXRcclxuXHRcdGZ1bmN0aW9uIGdldExlbmd0aEluQnl0ZXMoc3RyKSB7XHJcblx0XHQgIHZhciBiID0gc3RyLm1hdGNoKC9bXlxceDAwLVxceGZmXS9nKTtcclxuXHRcdCAgcmV0dXJuIChzdHIubGVuZ3RoICsgKCFiID8gMDogYi5sZW5ndGgpKTsgXHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gc3VibWl0VmFsaWRBamF4Rm9ybSgpIHtcclxuXHRcdFx0dmFyIHN1Ym1pdHRlZE9iamVjdCA9ICRmb3JtLnNlcmlhbGl6ZU9iamVjdCgpO1xyXG5cclxuXHRcdFx0Ly8gY29tYmluZSBUb3BpYyBvZiBJbnRlcmVzdCB3aXRoIENvbW1lbnRzXHJcblx0XHRcdHN1Ym1pdHRlZE9iamVjdC5DX0Rlc2NyaXB0aW9uMSA9ICdUb3BpYyBvZiBpbnRlcmVzdDogJyArIHN1Ym1pdHRlZE9iamVjdC5DX1Byb2R1Y3RJbnRlcmVzdCArICdcXHJcXG5BZGRpdGlvbmFsIGNvbW1lbnRzOiAnICsgc3VibWl0dGVkT2JqZWN0LkNfRGVzY3JpcHRpb24xO1xyXG5cclxuXHRcdFx0JC5hamF4KHtcclxuXHRcdFx0XHR1cmw6ICRmb3JtLmRhdGEoJ2FqYXgtdXJsJyksXHJcblx0XHRcdFx0dHlwZTogJ1BPU1QnLFxyXG5cdFx0XHRcdGRhdGFUeXBlOiAnSFRNTCcsXHJcblx0XHRcdFx0ZGF0YTogc3VibWl0dGVkT2JqZWN0XHJcblx0XHRcdH0pXHJcblx0XHRcdC5kb25lKGZ1bmN0aW9uKGRhdGEpIHtcclxuXHRcdFx0XHQkZm9ybVxyXG5cdFx0XHRcdFx0LmZpbmQoJy52YWxpZGF0aW9uLWVycm9yJylcclxuXHRcdFx0XHRcdC5yZW1vdmUoKVxyXG5cdFx0XHRcdFx0LmVuZCgpXHJcblx0XHRcdFx0XHQuZW1wdHkoKVxyXG5cdFx0XHRcdFx0LmhpZGUoKVxyXG5cdFx0XHRcdFx0Lmh0bWwoJzxoMj5UaGFuayB5b3UsICcgKyBzdWJtaXR0ZWRPYmplY3QuQ19GaXJzdE5hbWUgKyAnLjwvaDI+PHA+V2Ugd2lsbCBiZSBpbiB0b3VjaCBzb29uIHRvIGRpc2N1c3MgeW91ciBuZWVkczwvcD4nKVxyXG5cdFx0XHRcdFx0LmZhZGVJbigpO1xyXG5cclxuXHRcdFx0XHRzY3JvbGxUb0Zvcm0oKTtcclxuXHRcdFx0fSlcclxuXHRcdFx0Ly8gaWYgdGhlIFVSTCBjYW5ub3QgYmUgbG9jYXRlZFxyXG5cdFx0XHQuZmFpbChmdW5jdGlvbihqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pIHtcclxuXHRcdFx0XHQkZm9ybVxyXG5cdFx0XHRcdFx0LmVtcHR5KClcclxuXHRcdFx0XHRcdC5oaWRlKClcclxuXHRcdFx0XHRcdC5odG1sKCc8cCBjbGFzcz1cInZhbGlkYXRpb24tZXJyb3JcIj4nICsgZXJyb3JUaHJvd24gKyAnPC9wPicpXHJcblx0XHRcdFx0XHQuZmFkZUluKCk7XHJcblxyXG5cdFx0XHRcdHNjcm9sbFRvRm9ybSgpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyB2YWxpZGF0ZSBlYWNoIGlucHV0XHJcblx0XHQkaW5wdXRzXHJcblx0XHRcdC5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciAkaW5wdXQgPSAkKHRoaXMpO1xyXG5cdFx0XHRcdGlmKCRpbnB1dC5nZXQoMCkuZ2V0QXR0cmlidXRlKCdyZXF1aXJlZCcpICE9ICdmYWxzZScpe1xyXG5cdFx0XHRcdFx0dmFyXHR2YWx1ZSA9ICRpbnB1dC52YWwoKSxcclxuXHRcdFx0XHRcdFx0cmVxdWlyZWQgPSAkaW5wdXQuYXR0cigncmVxdWlyZWQnKSAhPT0gdW5kZWZpbmVkLFxyXG5cdFx0XHRcdFx0XHR0eXBlID0gJGlucHV0LmF0dHIoJ3R5cGUnKSxcclxuXHRcdFx0XHRcdFx0Ly9NaWxpbmQ6IFZhbGlkYXRpb24gdHlwZSBnZXRzIGhpZ2hlciBwcmVjZWRlbmNlIHRoYW4gdHlwZVxyXG5cdFx0XHRcdFx0XHQvL3ZhbGlkYXRpb25UeXBlID0gKHR5cGUgPT09ICd0ZXh0JykgPyAkaW5wdXQuZGF0YSgndmFsaWRhdGlvbi10eXBlJykgOiB0eXBlLFxyXG5cdFx0XHRcdFx0XHR2YWxpZGF0aW9uVHlwZSA9ICgkaW5wdXQuZGF0YSgndmFsaWRhdGlvbi10eXBlJykpID8gJGlucHV0LmRhdGEoJ3ZhbGlkYXRpb24tdHlwZScpIDogdHlwZSxcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRyYWRpb09yQ2hlY2tib3ggPSAodHlwZSA9PT0gJ3JhZGlvJyB8fCB0eXBlID09PSAnY2hlY2tib3gnKSxcclxuXHRcdFx0XHRcdFx0bmFtZSA9ICRpbnB1dC5hdHRyKCduYW1lJyksXHJcblx0XHRcdFx0XHRcdHBhdHRlcm47XHJcblxyXG5cdFx0XHRcdFx0Ly8gdGVzdCBpZiB0aGUgaW5wdXQgaXMgcmVxdWlyZWRcclxuXHRcdFx0XHRcdGlmIChyZXF1aXJlZCAmJiAodmFsdWUgPT09ICcnIHx8IHZhbHVlID09PSBudWxsKSkge1xyXG5cdFx0XHRcdFx0XHRzZXRJbnZhbGlkKCRpbnB1dCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIGlmIChyZXF1aXJlZCAmJiByYWRpb09yQ2hlY2tib3ggJiYgJCgnW25hbWU9XCInICsgbmFtZSArICdcIl06Y2hlY2tlZCcpLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0XHRcdFx0XHRzZXRJbnZhbGlkKCRpbnB1dCwgcmFkaW9PckNoZWNrYm94LCBuYW1lKTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHQvLyB0ZXN0IHRoZSBpbnB1dCBhZ2FpbnN0IGl0cyByZWdleCBwYXR0ZXJuXHJcblx0XHRcdFx0XHRpZiAocmVxdWlyZWQgJiYgJHRoaXMucGF0dGVybnNbdmFsaWRhdGlvblR5cGVdKSB7XHJcblx0XHRcdFx0XHRcdHBhdHRlcm4gPSBuZXcgUmVnRXhwKCR0aGlzLnBhdHRlcm5zW3ZhbGlkYXRpb25UeXBlXSk7XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAoIXBhdHRlcm4udGVzdCh2YWx1ZS50b0xvd2VyQ2FzZSgpKSkge1xyXG5cdFx0XHRcdFx0XHRcdHNldEludmFsaWQoJGlucHV0KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdC8vIHRlc3QgZm9yIFVuaWNvZGUgaW5wdXQgaS5lLiBub24tRW5nbGlzaCBjaGFyYWN0ZXJzXHJcblx0XHRcdFx0XHRpZiAodHlwZSA9PSAndGV4dCcpIHtcclxuXHRcdFx0XHRcdFx0Ly9DaGFyIGxlbmd0aCAhPSBOby4gb2YgQnl0ZXMgOj0gaW5wdXQgaXMgVW5pY29kZVxyXG5cdFx0XHRcdFx0XHRpZiAodmFsdWUubGVuZ3RoICE9IGdldExlbmd0aEluQnl0ZXModmFsdWUpKSB7XHJcblx0XHRcdFx0XHRcdFx0c2V0SW52YWxpZCgkaW5wdXQpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0Ly8gdGVzdCBpZiB0aGUgaG9uZXlwb3QgaXMgZmlsbGVkIG91dFxyXG5cdFx0XHRcdFx0aWYgKCRpbnB1dC5kYXRhKCdpbnB1dC1ob25leXBvdCcpICYmICRpbnB1dC52YWwoKSAhPT0gJycpIHtcclxuXHRcdFx0XHRcdFx0c2V0SW52YWxpZCgkaW5wdXQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdFx0LnByb21pc2UoKVxyXG5cdFx0XHQuZG9uZShmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRpZiAoJGZvcm0uZGF0YSgndmFsaWQnKSkge1xyXG5cdFx0XHRcdFx0aWYgKGFqYXhGb3JtKSB7XHJcblx0XHRcdFx0XHRcdHN1Ym1pdFZhbGlkQWpheEZvcm0oKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHQkZm9ybS5zdWJtaXQoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRzY3JvbGxUb0ludmFsaWQoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdH07XHJcbn0pIChqUXVlcnkpOyJdfQ==
