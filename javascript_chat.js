		(function(){
			var getNode = function(selector) { 
				console.log(document.querySelector(selector));
				return document.querySelector(selector);
			}

			//Get required nodes
			var status = getNode('.chat-status span'),
				messages = getNode('.chat-message'),
				textarea = getNode('.chat-textarea'),
				chatName = getNode('.chat-name'),
				statusDefault = status.textContent;


			var setStatus = function(s) {
				status.textContent = s;

				if ( s !== statusDefault){
					var delay = setTimeout(function() {
						setStatus(statusDefault);
						clearInterval(delay);
					}, 3000);
				}
			};

			setStatus('Testing');

			try{
				var socket = io.connect('http://127.0.0.1:8083');
			}catch(e){
				//Set status to warn user

			}

			if(socket !== undefined){
				//listen for output
				socket.on('output', function(data) { 
					if ( data.length ) {
						for ( var i = 0; i < data.length; i++ ){
							var message = document.createElement('div');
							message.setAttribute('class', 'chat-message');
							message.textContent = data[i].name + ': ' + data[i].message;

							//Append
							messages.appendChild(message);
							messages.insertBefore(message, messages.firstChild);
						}
					}
				});

				//Listen for status
				socket.on('status', function(data){
					setStatus((typeof data === 'object') ? data.message : data);

					if (data.clear === true){
						textarea.value = '';
					}
				});

				//Listen for keydown
				textarea.addEventListener('keydown', function(event){
					var self = this,
						name = chatName.value;

					if (event.which === 13 && event.shiftKey === false){
						// console.log('send !');
						socket.emit('input', {
							name: name, 
							message: self.value
						});
					}

				});
			}

		})();
