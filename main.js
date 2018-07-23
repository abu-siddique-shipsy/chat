// $(document).ready(function(){
// });
function showMessage(messageHTML) {
		$('.chat-body').append(messageHTML);
	}

	$(document).ready(function(){

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
			// $('#chat-user').attr("type","hidden");		
			var messageJSON = {
				chat_user: $('#chat-user').val(),
				chat_message: message
			};
			websocket.send(JSON.stringify(messageJSON));
		}
		$('#chat-icon').on('click',function(){
			if ($('#chat-div').is(":hidden")) {
				$(this).removeClass('chat-icon')	
				$('#chat-div').show('3')		
			}
			else{
				$('#chat-div').hide('3')		
			}
		});
		$('#chat-message').keyup(function (e) {
		    if (e.which == 13) {
		    	if($('chat-user').val() != ""){
		    		$('#chat-user').hide();
		    		sendMessage($(this).val(),$('chat-user').val())
		    	}
		    	else
		    		sendMessage($(this).val())
		      var current_text = '<br><div class="sent-msg"><p>'	
		      current_text += $(this).val();
		      current_text += '</p></div>';
		      $(this).val("")
		      $('.chat-body').append(current_text)

		    }
	  	});

	});