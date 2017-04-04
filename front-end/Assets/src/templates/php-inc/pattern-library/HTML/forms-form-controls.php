<form action="#" class="row">
	<fieldset class="two-up">
		<h4>Text input</h4>
		<ol>
			<li>
				<label for="testinput" class="accessibility">Label for the input</label>
				<input type="text" id="testinput" placeholder="Label for the input">
			</li>
			<li>
				<label for="invalidtestinput" class="accessibility">Label for the invalid input</label>
				<input type="text" id="invalidtestinput" class="validation-error" placeholder="Label for the invalid input">
			</li>
			<li>
				<label for="password" class="accessibility">Password</label>
				<input type="password" placeholder="Password" id="password">
			</li>
			<li>
				<label for="testtextarea" class="accessibility">Label for the textarea</label>
				<textarea id="testtextarea" placeholder="Label for the textarea" cols="30" rows="5"></textarea>
			</li>
		</ol>
	</fieldset>
	<fieldset class="two-up">
		<h4>Radio buttons and checkboxes</h4>
		<ol>
			<li>
				<label for="options">Label for the radio options</label>
				<ol class="radio-list">
					<li>
						<input type="radio" name="options" id="radio-option-1" value="option 1">
						<label for="radio-option-1">Option 1</label>
					</li>
					<li>
						<input type="radio" name="options" id="radio-option-2" value="option 2">
						<label for="radio-option-2">Option 2</label>
					</li>
				</ol>
			</li>
		</ol>
		<ol>
			<li>
				<label for="checkbox">Label for the checkbox</label>
				<ol class="checkbox-list">
					<li>
						<input type="checkbox" name="checkbox" id="checkbox-option-1" value="option 1">
						<label for="checkbox-option-1">Option 1</label>
					</li>
					<li>
						<input type="checkbox" name="checkbox" id="checkbox-option-2" value="option 2">
						<label for="checkbox-option-2">Option 2</label>
					</li>
				</ol>
			</li>
		</ol>
		<h4>Selects</h4>
		<ol>
			<li>
				<select name="" id="">
					<option value="" disabled="disabled" selected="selected">Select an option</option>
					<option value="1">Option 1</option>
					<option value="2">Option 2</option>
					<option value="3">Option 3</option>
					<option value="4">Option 4</option>
					<option value="5">Option 5</option>
				</select>
			</li>
		</ol>
	</fieldset>
</form>