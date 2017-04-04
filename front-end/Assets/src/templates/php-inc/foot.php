		<?php include_once 'footer.php'; ?>
		<?php include 'php-inc/modal-contact.php'; ?>
		<?php include 'php-inc/modal-country.php'; ?>
	</section><!-- / layout-wrapper -->

	<script src="includes/main.js"></script>

<?php
	if (isset($enableDTM) && $enableDTM == true) {
   		//end dtm script
		echo '<script type="text/javascript">_satellite.pageBottom();</script>';
		}
?>

</body>
</html>