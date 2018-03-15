var categories = [];
var invites = [
	{
		colorIndex: 1,
		tasks: [{
			desc: "test",
			fractions: [],
			numHours: "10",
			title: "hello there",
			type: 0,
		}],
		title: "shared list",
		status: 0,
	}
];


var catMgr = {
	load : function(){
		$.ajax({
			url : 'getCats',
			method : 'POST',
			complete : function(req, status){
				if(req.responseJSON.success){
					categories = req.responseJSON.categories;
					catUI.init();
					catUI.render();
				}else{
					auth.logout();
				}
			}
		});
	},

	save : function() {
		$.ajax({
			url : 'setCats',
			// data : JSON.stringify(categories),
			data : { categories : JSON.stringify(categories)},
			method : 'POST',
			success : function(recvData){
				$('#save').html('All saved');
			}
		});
	},


	keyHitWaits : 0,

	requestSave : function() {
		var self = this;
		self.keyHitWaits++;
		$('#save').html('Changes pending');
		setTimeout(function(){
			self.keyHitWaits--;
			if(self.keyHitWaits == 0)
				self.save();
		}, 1000);
	}
};

$(document).ready(function(){
	authUI.init();
	$('#save').on('click', catMgr.save);
	auth.init(catMgr.load);	
	window.onresize = function() {
		// console.log($('nav'));
	}
});

function touchHandler(event)
{
    var touches = event.changedTouches,
        first = touches[0],
        type = "";

         switch(event.type)
    {
        case "touchstart": type = "mousedown"; break;
        case "touchmove":  type="mousemove"; break;        
        case "touchend":   type="mouseup"; break;
        default: return;
    }

    // initMouseEvent(type, canBubble, cancelable, view, clickCount,
    //                screenX, screenY, clientX, clientY, ctrlKey,
    //                altKey, shiftKey, metaKey, button, relatedTarget);

    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1,
                              first.screenX, first.screenY,
                              first.clientX, first.clientY, false,
                              false, false, false, 0/*left*/, null);

                                                                                 first.target.dispatchEvent(simulatedEvent);
    // event.preventDefault();
}


    document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", touchHandler, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true);    
