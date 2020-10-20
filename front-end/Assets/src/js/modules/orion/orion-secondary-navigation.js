(function($) { // Begin jQuery
    $(function() { // DOM ready      
    if($('.orion-seconday-nav').length > 0){
      $('body').addClass('orion-body');
   
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


      // Sticky nav implimentation  
        stickyNav = $(".orion-seconday-nav");
        navHeight = stickyNav.height();
        stickyNav.scrollspy({
          min: navHeight,
          max: 10000,
          onEnter: function(element, position) {
            console.log("in enter "+position.top);
            stickyNav.addClass('fixed');
            $('.layout-navigation').hide();
            $('.layout-header').hide();
          },
          onLeave: function(element, position) {
            console.log("in leave "+position.top);
            stickyNav.removeClass('fixed');
            $('.layout-navigation').show();
            $('.layout-header').show();
          }
        });


      }
    }); // end DOM ready
  })(jQuery); // end jQuery