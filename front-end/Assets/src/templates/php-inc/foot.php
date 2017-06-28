		<?php include_once 'footer.php'; ?>
		<?php include 'modal-contact.php'; ?>
		<?php // include 'modal-country.php'; ?>
	</section><!-- / layout-wrapper -->

	<script src="Assets/dist/main.js"></script>

<?php
	if (isset($enableDTM) && $enableDTM == true) {
   		//end dtm script
		echo '<script type="text/javascript">_satellite.pageBottom();</script>';
		}
?>

</body>
</html>
