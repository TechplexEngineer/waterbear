/* =============================================================================
    Document   : PluginSelector.js
    Description:
        Provides the user inrervace for the plugin selector. Ensures that the
		user can only select one language and any number of plugins for that
		language.
============================================================================= */ 


$(document).ready(function(e){
	
	//When the user changes ther selection:
	//1. Make sure its valid
	//2. Remove invalid selections
	$('.language input').change(function() {
								
		//set the parent radio button when a checkbox in the group is checked
		$(this).parent().parent().siblings('div.header').find('input:radio').attr("checked", true);
		//list of checks 
		var $localchecks = $(this).parent('li').parent('ul').children('li').find('input');
		// uncheck all checkboxes except the ones in the current language div
		$('.modal-body .language input:checkbox').not($localchecks).attr("checked", false);
	});
	
	//When the user thinks they are ready:
	//1. Compile a list of plugins
	//2. Ensure user has selected at least one plugin 
	//3. Send them to the IDE
	$('.go_btn').click(function(){
		var plugins = "";
		$("form.language input:checked").each(function(){
			plugins += $(this).val()+"|";
		});
								
		//no plugins selected (error)
		if(plugins.length <= 0)
		{
			var $errormsg = $(".plugin_selection_error.alert");
			//We'll show an inline message ("You must choose at least one plugin.");
			$errormsg.show().addClass("in");
			//Just incase they want to close the error.
			$errormsg.find('.close').click(function(){
				$errormsg.hide();
			});
			//Lets close it for them after a bit:
			$errormsg.fadeOut(7500);
		}
		else // chop off the last pipe symbol, and send the user to the IDE
		{
			plugins = plugins.substring(0, plugins.length-1);
			window.location = "ide.html?plugins="+plugins;
		}
	});
							
});