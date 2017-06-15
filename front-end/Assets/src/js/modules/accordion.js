/**
 * accordion.js
 * Pairs with styling found in modules/_accordion.scss
 *
 * Expects the following markup:
 * 	ul.accordion
 * 		li.accordion-item
 * 			a.accordion-item-anchor
 * 		 	div.accordion-item-content
 */

$('.accordion-item-anchor').click(function() {
	$(this).parents('.accordion-item').toggleClass('open');
});
