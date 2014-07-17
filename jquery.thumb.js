/*
 * jQuery Thumb Up/Down Plugin
 * Author: Oktay Sancak
 * Date: 21.01.2009
 * Version: 0.1
 * */

jQuery.fn.thumb = function(options) {
	THUMB_ID = 0;
	THUMB_VOTE = 1;
	THUMB_CONTENT = '<img class="up" src="img/vote-arrow-up.png"/>' +
					'<span class="result"></span>' + 
			   		'<img class="down" src="img/vote-arrow-down.png"/>' +
			   		'<img class="approve" src="img/vote-accepted-on.png"/>';
	
	/* Default settings */
	settings = jQuery.extend({
		url: undefined,
		prefix: "thumb", /* Selector prefix */
		effectSpeed: 500,
		onInvalidPost: undefined, /* Invalid post event handler */
		invalidPostMessage: "Sorry, you can not submit more than one vote!",
	}, options);
	
	/* Init thumb element */
	this.append(THUMB_CONTENT);
	
	/* Set initial value */
	this.find("span").each(function(i) {
		var self = $(this);
		var thumb = self.parent();
		var id = thumb.attr("id").split("-");
		self.text(id[1]);
		thumb.attr("id", id[0]);
	});
	
	/* Catch up/down clicks */
	return this.find(".up, .down").bind("click", function() {
		var self = $(this);
		var thumb = self.parent();
		var approve = thumb.find(".approve");
		
		if (approve.is(":hidden")) {
			approve.show();
			/* Send vote */
			$.post(
				settings.url,
				{
					id: thumb.attr("id").slice(settings.prefix.length),
					vote: self.attr("class")
				},
				responseCallback
			);
		} else {
			try { /* Trigger/display invalid post warning */
				settings.onInvalidPost();
			} catch(e) {
				alert(settings.invalidPostMessage);
			}
		}
	});
	
	/* Display response */
	function responseCallback(data, statusText) {
		if (statusText == "success") {
			if (!data) return; /* Return if data is empty */
			var response = data.split(":");
			var self = $("#" + settings.prefix + response[THUMB_ID] + " span");
			var vote = parseInt(response[THUMB_VOTE]);
			self.fadeOut(settings.effectSpeed, function() {
				self.text(vote);	
			});
			self.fadeIn();
		}
	}
}