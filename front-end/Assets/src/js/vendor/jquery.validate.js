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
			'no_initial_space' : "^[A-z]|^[0-9]", // Not start with initial space but allow next space
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
					//fired Event2 on form submit
					if(_satellite){
						_satellite.track("form_completion");
					}
				}
				else {
					scrollToInvalid();
				}
			});
	};
}) (jQuery);