<?php
	$pageTitle = "UI Guide";
	include_once 'php-inc/head.php';
?>

<section class="layout-full-bleed">
	<div class="layout-inner-wrap">
		<h1>Table of Contents</h1>
		<ul>
			<li><a href="#headings">Headings</a></li>
			<li><a href="#tables">Tables</a></li>
			<li><a href="#lists-forms">Lists and Forms</a></li>
			<li><a href="#buttons">Buttons</a></li>
			<li><a href="#utility-classes">Utility Classes</a></li>
			<li><a href="#body-classes">Body Classes</a></li>
			<li><a href="#media">Media</a></li>
            <li><a href="#accordion">Accordion</a></li>
            <li><a href="#fancybox">Modals with Fancybox</a></li>
		</ul>

		<div class="divider-large" id="headings">
			<h1>Level 1 heading</h1>
			<h2>Level 2 heading</h2>
			<h3>Level 3 heading</h3>
			<h4>Level 4 heading</h4>

			<h1>Level 1 heading</h1>
			<p>
				This is a paragraph of text. Some of the text may be <em>emphasised</em> and some it might even be <strong>strongly emphasised</strong>. Occasionally <q>quoted text</q> may be found within a paragraph …and of course <a href="#">a link</a> may appear at any point in the text. The average paragraph contains five or six sentences although some may contain as little or one or two while others carry on for anything up to ten sentences and beyond.
			</p>

			<h2>Level 2 heading</h2>
			<p>
				This is a paragraph of text. Some of the text may be <em>emphasised</em> and some it might even be <strong>strongly emphasised</strong>. Occasionally <q>quoted text</q> may be found within a paragraph …and of course <a href="#">a link</a> may appear at any point in the text. The average paragraph contains five or six sentences although some may contain as little or one or two while others carry on for anything up to ten sentences and beyond.
			</p>

			<h3>Level 3 heading</h3>
			<p>
				This is a paragraph of text. Some of the text may be <em>emphasised</em> and some it might even be <strong>strongly emphasised</strong>. Occasionally <q>quoted text</q> may be found within a paragraph …and of course <a href="#">a link</a> may appear at any point in the text. The average paragraph contains five or six sentences although some may contain as little or one or two while others carry on for anything up to ten sentences and beyond.
			</p>

			<h4>Level 4 heading</h4>
			<p>
				This is a paragraph of text. Some of the text may be <em>emphasised</em> and some it might even be <strong>strongly emphasised</strong>. Occasionally <q>quoted text</q> may be found within a paragraph …and of course <a href="#">a link</a> may appear at any point in the text. The average paragraph contains five or six sentences although some may contain as little or one or two while others carry on for anything up to ten sentences and beyond.
			</p>
		</div>

		<div class="divider-large" id="tables">
			<h1>Tables</h1>
			<table>
				<thead>
					<tr>
						<th>Lorem Ipsum dolor</th>
						<th>Lorem Ipsum dolor</th>
						<th>Lorem Ipsum dolor</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Mauris vestibulum auctor</td>
						<td>Mauris vestibulum auctor</td>
						<td>Mauris vestibulum auctor</td>
					</tr>
					<tr>
						<td>Mauris vestibulum auctor</td>
						<td>Mauris vestibulum auctor</td>
						<td>Mauris vestibulum auctor</td>
					</tr>
					<tr>
						<td>Mauris vestibulum auctor</td>
						<td>Mauris vestibulum auctor</td>
						<td>Mauris vestibulum auctor</td>
					</tr>
					<tr>
						<td>Mauris vestibulum auctor</td>
						<td>Mauris vestibulum auctor</td>
						<td>Mauris vestibulum auctor</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div class="divider-large" id="lists-forms">
			<div class="two-up">
				<h1>Lists</h1>
				<h2>Unordered List</h2>
				<ul>
					<li>Short Item in the list</li>
					<li>Short Item in the list</li>
					<li>Short Item in the list</li>
				</ul>
				<h2>Unordered List with Links</h2>
				<ul class="links">
					<li><a href="#">Short Item in the list</a></li>
					<li><a href="#">Short Item in the list</a></li>
					<li><a href="#">Short Item in the list</a></li>
				</ul>
				<h2>Unordered List with Arrows</h2>
				<ul class="list-arrow">
					<li>Short Item in the list</li>
					<li>Short Item in the list</li>
					<li>Short Item in the list</li>
					<li>
						Really long item in the list, Really long item in the list, Really long item in the list, Really long item in the list, Really long item in the list, Really long item in the list, Really long item in the listReally long item in the list, Really long item in the list, Really long item in the list, Really long item in the list, Really long item in the list, Really long item in the list
					</li>
				</ul>
				<h2>Ordered List:</h2>
				<ol>
					<li>Short Item in the list</li>
					<li>Short Item in the list</li>
					<li>Short Item in the list</li>
				</ol>
				<h2>Ordered List with Links:</h2>
				<ol class="links">
					<li><a href="#">Short Item in the list</a></li>
					<li><a href="#">Short Item in the list</a></li>
					<li><a href="#">Short Item in the list</a></li>
				</ol>
			</div>

			<div class="two-up">
				<h1>Form Styles</h1>
				<form action="#">
					<fieldset>
						<legend>Text Input</legend>
						<h2>Text Input</h2>
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
						<h2>Radio Buttons and Checkboxes</h2>
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
									<li>
										<input type="radio" name="options" id="radio-option-3" value="option 3">
										<label for="radio-option-3" class="validation-error">Option 3 with validation error</label>
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
									<li>
										<input type="checkbox" name="checkbox" id="checkbox-option-3" value="option-3">
										<label for="checkbox-option-3" class="validation-error">Option 3 with validation error</label>
									</li>
								</ol>
							</li>
						</ol>
						<h2>Selects</h2>
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
			</div>
		</div>

		<div class="divider-large" id="buttons">
			<h1>Buttons</h1>
			<div class="wrapper-nested">
				<div class="two-up">
					<h2>Standard Buttons</h2>
					<fieldset>
						<ol>
							<li>
								<button>Primary button</button>
								<button class="btn-small">Primary button-small</button>
							</li>
							<li>
								<a href="#" class="btn">Anchor as button</a>
								<a href="#" class="btn btn-small">Anchor as button-small</a>
							</li>
							<li>
								<button class="btn-secondary">Secondary button</button>
								<button class="btn-secondary btn-small">Secondary button-small</button>
							</li>
							<li>
								<a href="#" class="btn-secondary">Anchor as secondary button</a>
								<a href="#" class="btn-secondary btn-small">Anchor as secondary button-small</a>
							</li>
							<li class="callout-dark">
								<button class="btn-white">White button</button>
								<button class="btn-white btn-small">White button-small</button>
							</li>
							<li class="callout-dark">
								<a href="#" class="btn-white">Anchor as white button</a>
								<a href="#" class="btn-white btn-small">Anchor as white button-small</a>
							</li>
						</ol>
					</fieldset>
				</div>

				<div class="two-up">
					<h2>Full-width Buttons</h2>
					<fieldset>
						<ol>
							<li>
								<button class="btn-full-width">Primary full-width button</button>
								<button class="btn-full-width btn-small">Primary full-width button-small</button>
							</li>
							<li>
								<a href="#" class="btn btn-full-width">Anchor as full-width button</a>
								<a href="#" class="btn btn-full-width btn-small">Anchor as full-width button-small</a>
							</li>
							<li>
								<button class="btn-secondary btn-full-width">Secondary full-width button</button>
								<button class="btn-secondary btn-full-width btn-small">Secondary full-width button-small</button>
							</li>
							<li>
								<a href="#" class="btn-secondary btn-full-width">Anchor as full-width secondary button</a>
								<a href="#" class="btn-secondary btn-full-width btn-small">Anchor as secondary full-width button-small</a>
							</li>
							<li class="callout-dark">
								<button class="btn-full-width btn-white">White full-width button</button>
								<button class="btn-full-width btn-white btn-small">White full-width button-small</button>
							</li>
							<li class="callout-dark">
								<a href="#" class="btn-full-width btn-white">Anchor as full-width white button</a>
								<a href="#" class="btn-full-width btn-white btn-small">Anchor as full-width white button-small</a>
							</li>
						</ol>
					</fieldset>
				</div>

				<div class="two-up">
					<h2>Disabled Buttons</h2>
					<fieldset>
						<ol>
							<li>
								<button disabled="disabled">Primary button</button>
								<button disabled="disabled" class="btn-small">Primary button-small</button>
							</li>
							<li>
								<button disabled="disabled" class="btn-secondary">Secondary button</button>
								<button disabled="disabled" class="btn-secondary btn-small">Secondary button-small</button>
							</li>
							<li class="callout-dark">
								<button disabled="disabled" class="btn-white">White button</button>
								<button disabled="disabled" class="btn-white btn-small">White button-small</button>
							</li>
						</ol>
					</fieldset>
				</div>

				<div class="two-up">
					<h2>Loading Buttons</h2>
					<fieldset>
						<ol>
							<li>
								<button disabled="disabled" class="btn-loading">Primary button</button>
								<button disabled="disabled" class="btn-loading btn-small">Primary button-small</button>
							</li>
							<li>
								<button disabled="disabled" class="btn-secondary btn-loading">Secondary button</button>
								<button disabled="disabled" class="btn-secondary btn-loading btn-small">Secondary button-small</button>
							</li>
							<li class="callout-dark">
								<button disabled="disabled" class="btn-white btn-loading">White button</button>
								<button disabled="disabled" class="btn-white btn-loading btn-small">White button-small</button>
							</li>
						</ol>
					</fieldset>
				</div>
			</div>
		</div>

		<div class="divider-large" id="utility-classes">
			<h1>Utility Classes</h1>
			<h2 class="divider-secondary">Quick Column Layouts</h2>
			<p>Classes are available to build quick column layouts that flow naturally on all resolutions.  The classes are two-up, three-up, and four-up.  They signify how many elements will be displayed side-by-side at the highest resolution.  As in the below examples, the classes are placed on the elements for which you wish to apply the specified number of side-by-side elements.</p>
			<p><strong>NOTE:</strong> these elements must be placed in a container for the proper spacing and flow.</p>
			<h3>.two-up</h3>
			<div class="wrapper-nested">
				<div class="two-up">
					<img src="http://fpoimg.com/700x250?text=Two-Up" alt="">
				</div>
				<div class="two-up">
					<img src="http://fpoimg.com/700x250?text=Two-Up" alt="">
				</div>
				<div class="two-up">
					<img src="http://fpoimg.com/700x250?text=Two-Up" alt="">
				</div>
				<div class="two-up">
					<img src="http://fpoimg.com/700x250?text=Two-Up" alt="">
				</div>
			</div><!-- / wrapper-nested -->

			<h3>.three-up</h3>
			<div class="wrapper-nested">
				<div class="three-up">
					<img src="http://fpoimg.com/700x250?text=Three-Up" alt="">
				</div>
				<div class="three-up">
					<img src="http://fpoimg.com/700x250?text=Three-Up" alt="">
				</div>
				<div class="three-up">
					<img src="http://fpoimg.com/700x250?text=Three-Up" alt="">
				</div>
				<div class="three-up">
					<img src="http://fpoimg.com/700x250?text=Three-Up" alt="">
				</div>
				<div class="three-up">
					<img src="http://fpoimg.com/700x250?text=Three-Up" alt="">
				</div>
				<div class="three-up">
					<img src="http://fpoimg.com/700x250?text=Three-Up" alt="">
				</div>
			</div><!-- / wrapper-nested -->

			<h3>.four-up</h3>
			<div class="wrapper-nested">
				<div class="four-up">
					<img src="http://fpoimg.com/700x250?text=Four-Up" alt="">
				</div>
				<div class="four-up">
					<img src="http://fpoimg.com/700x250?text=Four-Up" alt="">
				</div>
				<div class="four-up">
					<img src="http://fpoimg.com/700x250?text=Four-Up" alt="">
				</div>
				<div class="four-up">
					<img src="http://fpoimg.com/700x250?text=Four-Up" alt="">
				</div>
				<div class="four-up">
					<img src="http://fpoimg.com/700x250?text=Four-Up" alt="">
				</div>
				<div class="four-up">
					<img src="http://fpoimg.com/700x250?text=Four-Up" alt="">
				</div>
				<div class="four-up">
					<img src="http://fpoimg.com/700x250?text=Four-Up" alt="">
				</div>
				<div class="four-up">
					<img src="http://fpoimg.com/700x250?text=Four-Up" alt="">
				</div>
			</div><!-- / wrapper-nested -->

			<div class="divider-secondary">
				<h2>.learn-more</h2>
				<a href="#" class="learn-more">The learn more class adds a caret to the end of the text.</a>
			</div>

			<div class="divider-secondary">
				<h2>Testimonials</h2>
				<p>These classes are to be used on blockquote elements.  The testimonial class applies a green background and separated borders while the additional classes add icons relevant to their content.</p>
				<h3>.testimonial</h3>
				<blockquote class="testimonial">
					<p>This is a standard testimonial class.</p>
					<a href="#" class="learn-more">This is a learn-more classed link.</a>
					<cite>This is a citation.</cite>
				</blockquote>

				<h3 class="divider-secondary">.testimonial-video</h3>
				<blockquote class="testimonial testimonial-video">
					<p>This is a testimonial-video class.  Be sure to also include the testimonial class</p>
				</blockquote>

				<h3 class="divider-secondary">.testimonial-pdf</h3>
				<blockquote class="testimonial testimonial-pdf">
					<p>This is a testimonial-pdf class.  Be sure to also include the testimonial class</p>
				</blockquote>

				<h3 class="divider-secondary">.testimonial-case-study</h3>
				<blockquote class="testimonial testimonial-case-study">
					<p>This is a testimonial-case-study class.  Be sure to also include the testimonial class</p>
				</blockquote>
			</div>

			<div class="divider-secondary">
				<h2>Link Icons</h2>
				<p>These classes, when added to text elements such as anchors and spans, add the appropriate icon to the left of the text.</p>
				<ul class="plain">
					<li><a href="#" class="link-icon-video">.link-icon-video</a></li>
					<li><a href="#" class="link-icon-pdf">.link-icon-pdf</a></li>
					<li><a href="#" class="link-icon-document">.link-icon-document</a></li>
					<li><a href="#" class="link-icon-word">.link-icon-word</a></li>
					<li><a href="#" class="link-icon-excel">.link-icon-excel</a></li>
					<li><a href="#" class="link-icon-zip">.link-icon-zip</a></li>
					<li><a href="#" class="link-icon-powerpoint">.link-icon-powerpoint</a></li>
					<li><a href="#" class="link-icon-resource-document">.link-icon-resource-document</a></li>
					<li><a href="#" class="link-icon-resource-documents">.link-icon-resource-documents</a></li>
				</ul>
			</div>
		</div><!-- / divider-large -->

		<div class="divider-large" id="body-classes">
			<h1>Body Classes</h1>
			<p>There are several different patterns of classes that can be applied to the body element.  Each of these affects the page layout or styles in a different way.</p>

			<h2>full-width</h2>
			<p>The full-width class is used to tell the document that the layout-primary content area is to span the full width of the design.</p>
			<p><a href="resources.php">Example (resources)</a></p>

			<h2>section-</h2>
			<p>The section- prefix tells the document in which section of the site the page is contained, e.g. Products, Services, etc.</p>
			<p><a href="category-strategic.php">Example (products)</a></p>

			<h2>page-</h2>
			<p>Similar to the section- prefx, the page- prefix tells the document which type of page the document is, e.g. Resources Landing, Category, etc.</p>
			<p><a href="category-strategic.php">Example (category)</a></p>
		</div><!-- / divider-large -->

		<div class="divider-large" id="helper-classes">
			<h1>Helper Classes</h1>

			<p>
				In the case html markup isn't defined within a module, these classes that can be used on generic elements to provide basic supporting functionality.
				Since these classes are a single selector, they are easily overriden, therefore these should not be used on elements with more specific classes.
				Wherever possible these properties should be absorbed into specific modules and their specific classes.
			</p>

			<h2>text-left</h2>
			<p class="text-left">
				This text will<br/>
				be left aligned.
			</p>

			<h2>text-right</h2>
			<p class="text-right">
				This text will<br/>
				be right aligned.
			</p>

			<h2>text-center</h2>
			<p class="text-center">
				This text will<br/>
				be center aligned.
			</p>
		</div><!-- / divider-large -->

		<div class="divider-large" id="media">
			<h1>Media</h1>
			<div class="wrapper-nested">
				<div class="two-up">
					<h2>Twistage Video</h2>
					<div class="video">
						<script type="text/javascript" src="http://service.twistage.com/api/script"></script>
						<script type="text/javascript">viewNode("5dc3ac4745bf1", {"server_detection": true, "width": 854, "height": 480});</script>
					</div>
				</div>
			</div><!-- / wrapper-nested -->
		</div><!-- / divider -->

        <div class="divider-large" id="accordion">
			<h1>Accordion</h1>
			<p>
				For "jump to and open" functionality, create a<br/>
				<em>&#60;span class="jump-to" id="unique-id-1" name="unique-id-1"&#62;&#60;/span&#62;</em><br/>
				element as the first item within the li.item. It's important that this span has the same name and id values for full newer and older browser support.
				On page load the native 'jump to' functionality of anchors in the browser is used to take the user to the list item, and javascript ensures the list item is expanded by default.
			</p>
			<p>
				For example, click <a href="./ui-guide.php#unique-id-1">this link</a> in a new tab or new window.
			</p>
			<div class="wrapper-nested">

				<ul class="accordion">
				   <li class="accordion-item">

						<span class="jump-to" id="unique-id-1" name="unique-id-1"></span>
				   		<a class="accordion-item-anchor" href='#'>
				   			Check Plus for DB2
				   		</a>

				         <div class="accordion-item-content">
				         <p>Ensure the consistency of your DB2 data using the range of integrity checking features offered by BMC Check Plus for DB2. Ranging from structural checks for your table spaces and indexes to detailed referential integrity checks on column data, Check Plus for DB2 provides a faster, more powerful alternative to the native DB2 utilities. And, with the Snapshot Upgrade Feature, running integrity checks won't interfere with database availability.</p>

				         <p>This product is available as a standalone or as part of the following offerings:  <a href="#">Recovery for DB2, High Speed Utilities for DB2</a>
				         </p>

				         <div class="icon-container"><a href="#" class="link-icon-pdf">.link-icon-pdf</a></div>
				        </div><!--/ content -->

				   </li>
				</ul>
				<ul class="accordion">
				   <li class="accordion-item">

						<span class="jump-to" id="unique-id-2" name="unique-id-2"></span>
				   		<a class="accordion-item-anchor" href='#'>
				   			Performance for DB2 SQL
				   		</a>

				         <div class="accordion-item-content">
					         <p>Ensure the consistency of your DB2 data using the range of integrity checking features offered by BMC Check Plus for DB2. Ranging from structural checks for your table spaces and indexes to detailed referential integrity checks on column data, Check Plus for DB2 provides a faster, more powerful alternative to the native DB2 utilities. And, with the Snapshot Upgrade Feature, running integrity checks won't interfere with database availability.</p>

					         <p>This product is available as a standalone or as part of the following offerings:  <a href="#">Recovery for DB2, High Speed Utilities for DB2</a>
					         </p>

					         <div class="icon-container"><a href="#" class="link-icon-pdf">.link-icon-pdf</a></div>
				        </div><!--/ content -->

				   </li>
				</ul>
				<ul class="accordion">
				   <li class="accordion-item">

						<span class="jump-to" id="unique-id-3" name="unique-id-3"></span>
				   		<a class="accordion-item-anchor" href='#'>
				   			High Speed Utilities for DB2
			   			</a>

				         <div class="accordion-item-content">
					         <p>Ensure the consistency of your DB2 data using the range of integrity checking features offered by BMC Check Plus for DB2. Ranging from structural checks for your table spaces and indexes to detailed referential integrity checks on column data, Check Plus for DB2 provides a faster, more powerful alternative to the native DB2 utilities. And, with the Snapshot Upgrade Feature, running integrity checks won't interfere with database availability.</p>

					         <p>This product is available as a standalone or as part of the following offerings:  <a href="#">Recovery for DB2, High Speed Utilities for DB2</a>
					         </p>

					         <div class="icon-container"><a href="#" class="link-icon-pdf">.link-icon-pdf</a></div>
				        </div><!--/ content -->

				   </li>
				</ul>
				<ul class="accordion">
				   <li class="accordion-item">

						<span class="jump-to" id="unique-id-4" name="unique-id-4"></span>
				   		<a class="accordion-item-anchor" href='#'>
							Recovery for DB2
						</a>

				         <div class="accordion-item-content">
				         <p>Ensure the consistency of your DB2 data using the range of integrity checking features offered by BMC Check Plus for DB2. Ranging from structural checks for your table spaces and indexes to detailed referential integrity checks on column data, Check Plus for DB2 provides a faster, more powerful alternative to the native DB2 utilities. And, with the Snapshot Upgrade Feature, running integrity checks won't interfere with database availability.</p>

				         <p>This product is available as a standalone or as part of the following offerings:  <a href="#">Recovery for DB2, High Speed Utilities for DB2</a>
				         </p>

				         <div class="icon-container"><a href="#" class="link-icon-pdf">.link-icon-pdf</a></div>
				        </div><!--/ content -->

				   </li>
				</ul>
				<ul class="accordion">
				   <li class="accordion-item">

						<span class="jump-to" id="unique-id-5" name="unique-id-5"></span>
   				   		<a class="accordion-item-anchor" href='#'>
							Performance for DB2 Databases
						</a>


				         <div class="accordion-item-content">
					         <p>Ensure the consistency of your DB2 data using the range of integrity checking features offered by BMC Check Plus for DB2. Ranging from structural checks for your table spaces and indexes to detailed referential integrity checks on column data, Check Plus for DB2 provides a faster, more powerful alternative to the native DB2 utilities. And, with the Snapshot Upgrade Feature, running integrity checks won't interfere with database availability.</p>

					         <p>This product is available as a standalone or as part of the following offerings:  <a href="#">Recovery for DB2, High Speed Utilities for DB2</a>
					         </p>

					         <div class="icon-container"><a href="#" class="link-icon-pdf">.link-icon-pdf</a></div>
				        </div><!--/ content -->

				   </li>
				</ul>
				<ul class="accordion">
				   <li class="accordion-item">

						<span class="jump-to" id="unique-id-6" name="unique-id-6"></span>
  				   		<a class="accordion-item-anchor" href='#'>
							Workbench for DB2
						</a>


				         <div class="accordion-item-content">
					         <p>Ensure the consistency of your DB2 data using the range of integrity checking features offered by BMC Check Plus for DB2. Ranging from structural checks for your table spaces and indexes to detailed referential integrity checks on column data, Check Plus for DB2 provides a faster, more powerful alternative to the native DB2 utilities. And, with the Snapshot Upgrade Feature, running integrity checks won't interfere with database availability.</p>

					         <p>This product is available as a standalone or as part of the following offerings:  <a href="#">Recovery for DB2, High Speed Utilities for DB2</a></p>

					         <div class="icon-container"><a href="#" class="link-icon-pdf">.link-icon-pdf</a></div>
				        </div><!--/ content -->

				   </li>
				</ul>
			</div><!-- / wrapper-nested -->
		</div>
		<div class="divider-large" id="fancybox">
			<h1>Modals with Fancybox</h1>
			<p>To display modals use the <a href="http://fancybox.net/home">fancybox jQuery plugin</a></p>
			<p>Fancybox can be used within javascript. Check out the quick <a href="http://fancybox.net/howto">How to Guide</a>, or their complete <a href="http://fancybox.net/api">API Documentation</a></p>
			<p>To make things easier, there are some classes to setup modals quickly:</p>
			<ul>
				<h2>.modal-image</h2>
				<p>Add the <pre>.modal-image</pre> class to an anchor to open an image in a modal, ie:</p>
				<a href="includes/content/sample-1440-500-3.jpg" class="modal-image">(Any content within the anchor)</a>
				<h2>.modal-iframe</h2>
				<p>Add the <pre>.modal-iframe</pre> class to an anchor to open the target url in an iframe modal, ie:</p>
				<a href="http://bmc.com" class="modal-iframe">(Any content within the anchor)</a>
				<h2>.modal-video-player</h2>
				<p>Add the <pre>.modal-video-player</pre> class to an anchor to open the target url, containing the video, in an iframe modal, ie:</p>
				<a href="//www.youtube.com/embed/KTLWge6nTN0" class="modal-video-player">(Any content within the anchor)</a>
			</ul>
		</div><!-- / divider -->
	</div><!-- / layout-inner-wrap -->
</section><!-- / layout-full-bleed -->


<?php
	include_once 'php-inc/foot.php';
?>