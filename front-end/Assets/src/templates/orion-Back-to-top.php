<?php
	$pageTitle = 'orion Back to Top Example';
	$bodyClass = '';
	include 'php-inc/head.php';
?>
<style>
#backtotop {
  display: none;
  position: fixed;
  bottom: 20px;
  right: 30px;
  z-index: 99;
  border: none;
  outline: none;
  cursor: pointer;
}</style>


<a onclick="backtotopFunction()" id="backtotop" title="Go to top"><img src="Assets/src/img/orion/back-to-top.svg"></a>

<div style="background-color:black;color:white;padding:30px">Scroll Down</div>
<div style="background-color:lightgrey;padding:30px 30px 2500px">scroll to top Example 
  <strong>when the user starts to scroll the page</strong>.</div>

<script>
//Get the button
var mybutton = document.getElementById("backtotop");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function backtotopFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
</script>

<?php include 'php-inc/foot.php'; ?>