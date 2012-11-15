(function($){

// ----------------------
// UI Chrome Section
// ----------------------

//This will show the current workspaces blocks
function showBlocks() {
	$('.workspace:visible .scripts_workspace').show();
	$('.workspace:visible .scripts_text_view').hide();
}
$('.toggle_blocks').on('click', showBlocks);
//This will show the current workspaces script
function showScript(){
	$('.workspace:visible .scripts_text_view').show();
	$('.workspace:visible .scripts_workspace').hide();
	updateScriptsView();
}

$('.toggle_scripts').on('click', showScript);

// ----------------------
// Utility Section
// ----------------------


// Expose this to dragging and saving functionality
function showWorkspace(){
    $('.workspace:visible .scripts_text_view').hide();
    $('.workspace:visible .scripts_workspace').show();
}
window.showWorkspace = showWorkspace;

function updateScriptsView(){
    var blocks = $('.workspace:visible .scripts_workspace > .wrapper');
    var view = $('.workspace:visible .scripts_text_view');
    blocks.writeScript(view);
}
window.updateScriptsView = updateScriptsView;

function runScripts(event){
    $('.stage')[0].scrollIntoView();
    var blocks = $('.workspace:visible .scripts_workspace > .wrapper');
    $('.stage').replaceWith('<div class="stage"><script>' + blocks.wrapScript() + '</script></div>');
}
$('.runScripts').click(runScripts);

// Context Menu
//
// 'this' is the object matching the selector
// key is the key in the items object
// opt is the context menu object itself

function cloneCommand(key, opt){
    console.info('cloneCommand(%s, %o)', key, opt);
}

function editCommand(key, opt){
    console.info('editCommand(%s, %o)', key, opt);
}

function expandCommand(key, opt){
    console.info('expandCommand(%s, %o)', key, opt);
}

function collapseCommand(key, opt){
    console.info('collapseCommand(%s, %o)', key, opt);
}

function cutBlockCommand(key, opt){
    console.info('cutBlockCommand(%o, %s, %o)', this, key, opt);
    var view = this.closest('.wrapper');
    pasteboard = view.data('model');
    // Remove it programatically, and trigger the right events:
    removeFromScriptEvent(view);
    view.remove();
}

function copyBlockCommand(key, opt){
    console.info('copyBlockCommand(%s, %o)', key, opt);
    pasteboard = this.closest('.wrapper').data('model').clone();
}

function copySubscriptCommand(key, opt){
    console.info('copySubscriptCommand(%s, %o)', key, opt);
    pasteboard = this.closest('.wrapper').data('model').clone(true);
}

function pasteCommand(key, opt){
    console.info('pasteCommand(%s, %o)', key, opt);
    if (pasteboard){
        this.append(pasteboard.view());
        addToScriptEvent(this, pasteboard.view());
    }
}

function pasteExpressionCommand(key, opt){
    console.info('pasteExpressionCommand(%s, %o)', key, opt);
    if (pasteboard && pasteboard.blocktype === 'expression'){
        this.hide();
        pasteCommand.call(this.parent(), key, opt);
    }
}

function pasteStepCommand(key, opt){
    console.info('pasteStepCommand(%s, %o)', key, opt);
    if (pasteboard && pasteboard.blocktype !== 'expression'){
        if (this.find('> .wrapper').length){
            console.log('already has a child element');
        }else{
            pasteCommand.call(this, key, opt);
        }
    }
}

function cancelCommand(key, opt){
    console.info('cancelCommand(%s, %o)', key, opt);
}

var pasteboard = null;

// $.contextMenu({
//     selector: '.scripts_workspace .block',
//     items: {
//         //clone: {'name': 'Clone', icon: 'add', callback: cloneCommand},
//         //edit: {'name': 'Edit', icon: 'edit', callback: editCommand},
//         //expand: {'name': 'Expand', callback: expandCommand},
//         //collapse: {'name': 'Collapse', callback: collapseCommand},
//         cut: {'name': 'Cut block', icon: 'cut', callback: cutBlockCommand},
//         copy: {'name': 'Copy block', icon: 'copy', callback: copyBlockCommand},
//         copySubscript: {'name': 'Copy subscript', callback: copySubscriptCommand},
//         //paste: {'name': 'Paste', icon: 'paste', callback: pasteCommand},
//         cancel: {'name': 'Cancel', callback: cancelCommand}
//     }
// });
// 
// $.contextMenu({
//    selector: '.scripts_workspace',
//    items: {
//        paste: {'name': 'Paste', icon: 'paste', callback: pasteCommand},
//        cancel: {'name': 'Cancel', callback: cancelCommand}
//    } 
// });
// 
// $.contextMenu({
//     selector: '.scripts_workspace .value > input',
//     items: {
//         paste: {'name': 'Paste', icon: 'paste', callback: pasteExpressionCommand},
//         cancel: {'name': 'Cancel', callback: cancelCommand}
//     }
// });
// 
// $.contextMenu({
//     selector: '.scripts_workspace .contained',
//     items: {
//         paste: {'name': 'Paste', icon: 'paste', callback: pasteStepCommand},
//         cancel: {'name': 'Cancel', callback: cancelCommand}
//     }
// });
// 

// TODO: add event handler to enable/disable, hide/show items based on state of block

// Handle Context menu for touch devices:
// Test drawn from modernizr

function is_touch_device() {
  return !!('ontouchstart' in window);
}

if (is_touch_device()){
    $.tappable({
        container: '.blockmenu, .workspace',
        selector: '.block',
        callback: function(){
            console.info('long tap detected');
            console.info(this);
            this.contextMenu();
        },
        touchDelay: 150
    });
}


// Build the Blocks menu, this is a public method
function menu (title, specs, show){
	var group = title.toLowerCase().split(/\s+/).join('_'); //add words with underscores

	var button = $("<button type=\"button\" class=\"btn btn-mini\" data-name=\""+group+"\">"+title+"</button>");
	$("#block_menu .jump_menu").append(button); //append buttons here

	var innerMenu = $("#block_menu .block_menu"); //append blocks here

	var section = $("<div class=\"group "+group+"\"><div class=\"block_header "+group+"\">"+title+"</div></div>");

	specs.forEach(function(spec, idx){
		spec.group = group;
		spec.isTemplateBlock = true;
		section.append(Block(spec).view());
	});

	innerMenu.append(section);
}

window.menu = menu;

})(jQuery);

