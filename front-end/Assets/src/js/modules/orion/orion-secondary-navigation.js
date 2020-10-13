(function($) { // Begin jQuery
    $(function() { // DOM ready
      // If a link has a dropdown, add sub menu toggle.
      $('.orion-seconday-nav .nav-wrap ul li a:not(:only-child)').click(function(e) {
        $(this).siblings('.nav-dropdown').toggle();
        $(this).toggleClass('dropdownSelected');
        // Close one dropdown when selecting another
        $('.orion-seconday-nav .nav-dropdown').not($(this).siblings()).hide();
        e.stopPropagation();
      });
      // Clicking away from dropdown will remove the dropdown class
      $('html').click(function() {
        $('.nav-dropdown').hide();
        $(this).find('.dropdownSelected').removeClass("dropdownSelected");
      });
      // Toggle open and close nav styles on click
      $('.orion-seconday-nav  #nav-toggle').click(function() {
        $('.orion-seconday-nav .nav-wrap ul').slideToggle();
        $('.orion-seconday-nav .nav-wrap .nav-cta').slideToggle();

      });
      // Hamburger to X toggle
      $('.orion-seconday-nav  #nav-toggle').on('click', function() {
        this.classList.toggle('active');
      });
    }); // end DOM ready
  })(jQuery); // end jQuery