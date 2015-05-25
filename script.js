function $(id) { return document.getElementById(id); }

function flashcards(id,title) {
	this.id = id;

	this.current = -1; // currently show card
	this.amount = 0; // amount of card in the deck
	this.title = title;

	this.cards = new Array(); // contains the cards; even = question, odd=awnser
	this.correct = new Array(); // Array containing the questions, which have been correctly awnsered (pair 0/1 = question 1, pair 2/3 = question 2, etc.)

	// buttons to display depending on wether a question or awnser is shown
	this.fc_setButtons = function() {
		if ((this.current % 2) > 0) {
			$("fc_btn1_"+this.id).style.display="none";
			$("fc_btn2_"+this.id).style.display="inline";
			$("fc_btn3_"+this.id).style.display="inline";
		} else {
			$("fc_btn1_"+this.id).style.display="inline";
			$("fc_btn2_"+this.id).style.display="none";
			$("fc_btn3_"+this.id).style.display="none";
		}
	}

	this.fc_update = function(awnser) {
		// evaluate the given awnser
		if (awnser && this.correct.indexOf(Math.round((this.current+1)/2)) == -1) this.correct.push(Math.round((this.current+1)/2));
		
		this.current++;
	
		// search for the next card which hasn't been awnsered correctly yet
		while (this.correct.indexOf(Math.ceil((this.current+1)/2)) > -1) this.current++;
	
		// action to take as the end of the deck has been reached
		if (this.current>this.amount-1) {
			this.current=-1;
			$("fc_main"+this.id).style.display="none";
			$("fc_finish"+this.id).style.display="block";
		
			$("fc_message"+this.id).innerHTML = "You awnsered "+((this.amount/2 == this.correct.length)? "all":this.correct.length+" out of "+(this.amount/2)+" ("+Math.round((this.correct.length/(this.amount/2))*100)+"%)")+" question(s) correctly.";
			if (this.amount/2 == this.correct.length) $("fc_repeat"+this.id).style.display="none";
		}
	
		// update information which ist displayed
		this.fc_setButtons();	
		$("fc_content"+this.id).innerHTML = this.cards[this.current];
		$("fc_footer"+this.id).innerHTML = "Question "+Math.round((this.current+1)/2)+"/"+Math.floor(this.amount/2);
		
		// Scroll to top of flashcard
		var bodyRect = document.body.getBoundingClientRect(),
			elemRect = $("fc_main"+this.id).getBoundingClientRect(),
			offset   = elemRect.top - bodyRect.top;
		window.scrollTo(0, offset);
	}

	// continue learning a deck
	this.fc_continue = function() {
		this.fc_start();
		this.fc_update();
	}

	// div-display setting when starting a quiz
	this.fc_start = function (){
		$("fc_start"+this.id).style.display="none";
		$("fc_main"+this.id).style.display="block";
		$("fc_finish"+this.id).style.display="none";
	}
	
	// rename containters for the instance created, set onclick events
	this.fc_setDivs = function (){
		$("fc_start_btn").setAttribute("id", "fc_start_btn"+this.id);
		$("fc_start_btn"+this.id).setAttribute("onclick", "javascript:sets["+this.id+"].fc_start();");
		$("fc_start").setAttribute("id", "fc_start"+this.id);
		$("fc_main").setAttribute("id", "fc_main"+this.id);
		$("fc_finish").setAttribute("id", "fc_finish"+this.id);
		$("fc_content").setAttribute("id", "fc_content"+this.id);
		$("fc_footer").setAttribute("id", "fc_footer"+this.id);
		$("fc_message").setAttribute("id", "fc_message"+this.id);
		$("fc_repeat").setAttribute("id", "fc_repeat"+this.id);
		$("fc_btn1_").setAttribute("id", "fc_btn1_"+this.id);
		$("fc_btn1_"+this.id).setAttribute("onclick", "javascript:sets["+this.id+"].fc_update();");
		$("fc_btn2_").setAttribute("id", "fc_btn2_"+this.id);
		$("fc_btn2_"+this.id).setAttribute("onclick", "javascript:sets["+this.id+"].fc_update(true);");
		$("fc_btn3_").setAttribute("id", "fc_btn3_"+this.id);
		$("fc_btn3_"+this.id).setAttribute("onclick", "javascript:sets["+this.id+"].fc_update();");
		$("fc_repeat_btn").setAttribute("id", "fc_repeat_btn"+this.id);
		$("fc_repeat_btn"+this.id).setAttribute("onclick", "javascript:sets["+this.id+"].fc_continue();");
	}
}

instance=-1; // amount of quizzes on current page

var sets = new Array(); // contains the different flashcard-instances
