$(document).ready(function(){
	chatObj = {
		'allChats' : getChats(),
		
	};
	$(document).on('click','.chat-container',function(){
		getChatDescription($(this).attr('id'));	

	});
	$('#reply').keyup(function (e) {
		    if (e.which == 13) {
		    	sendMessage($(this).val())
		    	
		      var current_text = '<br><div class="sent-msg"><p>'	
		      current_text += $(this).val();
		      current_text += '</p></div>';
		      $(this).val("")
		      $('.detailed-chat-screen').append(current_text)

		    }
	  	});
	var websocket = new WebSocket("ws://localhost:8090/php-socket.php"); 
		websocket.onopen = function(event) { 
			showMessage("<div class='chat-connection-ack'>Connection is established!</div>");		
		}
		websocket.onmessage = function(event) {
			var Data = JSON.parse(event.data);
			showMessage("<div class='"+Data.message_type+"'>"+Data.message+"</div>");
			$('#chat-message').val('');
		};
		
		websocket.onerror = function(event){
			showMessage("<div class='error'>Problem due to some Error</div>");
		};
		websocket.onclose = function(event){
			showMessage("<div class='chat-connection-ack'>Connection Closed</div>");
		}; 
		
		function sendMessage(message,user="No Name"){
			event.preventDefault();
			var messageJSON = {
				chat_message: message,
				sentBy : 1,
				to : window.resourceID
			};
			websocket.send(JSON.stringify(messageJSON));
		}

	function getChatDescription(resourceID)
	{
		window.resourceID = resourceID;
		$.ajax({
        //url: "sampleResponse.json",
        url:"http://chatback.localhost/apis.php?method=getChatDescription&ID="+resourceID,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        headers : {
        	'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
    	},
        success: function(data) {
            	fillChatDescription(data);
        	}
    	});
	}
	function fillChatDescription(chats)
	{
		console.log(chats);
		html = '<div class="got-msg">'
		var Origin = 1;
		for (var i =  0; i < chats.length ; i++) 
		{
			if (chats[i].Origin != Origin) {
				html += '</div><br>'
				Origin = !Origin
				if (Origin) 
					html += '<div class="sent-msg">';
				else
					html += '<div class="got-msg">';
				
			}
			if (chats[i].Origin) 
				html += '<p>'+chats[i].Message+'</p><br>';
			else
				html += '<p>'+chats[i].Message+'</p><br>';
		}
		$('.detailed-chat-screen').html(html);
	}
	function getChats()
	{
		$.ajax({
        //url: "sampleResponse.json",
        url:"http://chatback.localhost/apis.php?method=getChats",
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        headers : {
        	'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
    	},
        success: function(data) {
        		// console.log(data);
        		chatObj['putChatsStatus'] = putChats(data);
            	return data;
        	}
    	});
	}
	function putChats(chats)
	{
		console.log(chats);
		html = ""
		for (var i =  0; i < chats.length ; i++) 
		{
			html += '<div class="chat-container" id="'+chats[i].ResourceId+'"><div class="chat-header"><label class="chat-from">'+chats[i].Name+'</label></div><div class="chat-body"><label class="chat-message">'+chats[i].Message+'</label></div></div>';
		}
		$('.chats').html(html);
		return 1;
	}
	
});
