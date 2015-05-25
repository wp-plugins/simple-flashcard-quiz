<?php
/**
 * Plugin Name: Simple Flashcard Quiz
 * Description: Shortcode integration of simple flashcards
 * Version: 1.2
 * Author: Gero Gothe
 * License: GPL2
 */
 
/*  Copyright 2015  Gero Gothe  (email : gero.gothe@yahoo.de)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License, version 2, as
    published by the Free Software Foundation.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/
 
function simple_flashcard_scripts(){
	wp_enqueue_script('flashcard-script',plugins_url( 'script.js' , __FILE__ ) );
	wp_register_style( 'flashcard-style', plugins_url('style.css', __FILE__) );
	wp_enqueue_style( 'flashcard-style' );
}
 
function simple_flashcard_build($atts,$content=null){
	$content = str_replace(Array('<br />','<p>'),'',$content);
	$content = str_replace(Array('</p>'),'<br />',$content);
	$list = explode("[==]",$content);
	if (count($list)%2 != 0) $list[] = "[No awnser given by author.]";
	?>
	
	<script type="text/javascript">
		// new deck of flashcards
		instance++;
		sets.push(new flashcards(instance,"<?php echo (isset($atts['title'])? $atts['title']:'Flashcards');?>"));

		// load cards into the object
		sets[instance].amount = <?php echo count($list);?>;
		<?php for ($c=0;$c<count($list);$c++) echo "sets[instance].cards[$c] = '".str_replace(array("\r", "\n"), "",$list[$c])."';\n"; ?>
	</script>
	 
	<div id="fc_start" class="flashcard_start">
		<h3><?php echo (isset($atts['title'])? $atts['title']:'Flashcards');?></h3>
		<?php if (isset($atts['draft']) && $atts["draft"]=="yes") echo "<span style='color:red'>This topic is still in work / not completed yet.</span>";?>
		<p>This quiz contains <?php echo (count($list)/2); ?> question(s).</p>
		<input id="fc_start_btn" type="button" value="Start the quiz!">
	</div>
	
	<div id="fc_main" class="flashcard_main">
		<div class="flashcard_header"><?php echo (isset($atts['title'])? $atts['title']:'Flashcards');?></div>
		<div id="fc_content" class="flashcard_content"></div>
		<div id="fc_footer" class="flashcard_footer"></div>
		<div class="flashcard_buttons">
			<input id="fc_btn1_" type="button" value="Show awnser">
			<input id="fc_btn2_" class="flashcard_btn_correct" type="button" value="Correct">
			<input id="fc_btn3_" class="flashcard_btn_wrong" type="button" value="Wrong">
		</div>
	</div>
	
	<div id="fc_finish" class="flashcard_finish" style="display:none">
		<h3><?php echo (isset($atts['title'])? $atts['title']:'Flashcards');?></h3>
		<p id="fc_message"></p>
		<div id="fc_repeat">
			<p>Do you want to repeat the question you didn't awsner correctly?</p>
			<div>
				<input id="fc_repeat_btn" type="button" value="Yes">
			</div>
		</div>
	</div>
	 
	<script type="text/javascript">
		sets[instance].fc_setDivs(); // rename divs; necessary for multiple instances on page
		sets[instance].fc_update(); // load first card
	</script>
	 <?php
}

add_action( 'wp_enqueue_scripts', 'simple_flashcard_scripts' );
add_shortcode("flashcard", "simple_flashcard_build");

?>
