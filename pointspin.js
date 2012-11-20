/**
 *	Creates manipulates a point spinner
 *	@author Matt Stevenson / Cameron Sutter
 *	@date 11/9/12
 */
 
(function( $ ) {


	var methods = {
		init : function( options ) {
		
			var id = this.attr("id");

			$(this).data('points', {target:id});
			
			var canvas = document.getElementById(id);
			var context = canvas.getContext("2d");
			
			// draw the lines between the numbers
			context.beginPath();
			context.moveTo(40,0);
			context.lineTo(40,200);
			context.moveTo(80,0);
			context.lineTo(80,200);          
			context.stroke();
			  
			methods.drawNumbers(id, defaultNums);
			
		},
		
		set : function(number){
		
			//get id
			var id = this.attr("id");
			
			//add the number to this object's data
			var data = $(this).data('points');
			data = $.extend(data, {value:number});
			$(this).data('points', data);
			
			
			//parse the int
			var string = number.toString();
			var nums = string.split("");
			
			//convert them back to integers
			for(i in nums){
				nums[i] = parseInt(nums[i]);
			}
			
			//add zero's to fill the 3 slots if necessary
			if(string.length < 3){
				for(i = 0; i < 3 - string.length; ++i){
					//put a 0 at the beginning of the array
					nums.unshift(0);
				}
			}

	        var date = new Date();
	        var time = date.getTime();
	        var count = 0;
	
	        // calls the three number columns and then has some crazy logic passed in as the repeat val
	        methods.animate(id, time, defaultNums, score_coor[nums[0]], 1, count);
	        methods.animate(id, time, defaultNums1, score_coor[nums[1]], ((time/defaultNums.speed)/10000000000)*nums[0]/2, count);
	        methods.animate(id, time, defaultNums2, score_coor[nums[2]], ((time/defaultNums1.speed)/10000000000)*nums[1] + ((time/defaultNums.speed)/10000000000)*nums[0] * 2, count);
            
            
		},
		
		/**
		 *	###### Not functional ######
		 *	Adds a number to the current value
		 *	@author Cameron Sutter
		 *	@date 11/13/12
		 */
		add : function(number){

			//get id
			var id = this.attr("id");
			
			//add the number to this object's data
			var data = $(this).data('points');
			
			//add the increment to the current value
			var new_number = data.value + number;
			
			//save this new number back to this object's data
			data.value = new_number;
			$(this).data('points', data);
			
						
		},
		
		/**
		 *	This draws the numbers with the value in the myNumers.x and myNumbers.y
		 *
		 *  @since 11/9/12
		 *  @author  Matt Stevenson
		 */
		drawNumbers: function(id, myNumbers){

	        var canvas = document.getElementById(id);
	        var context = canvas.getContext("2d");
	        var num_separation = 40;
	        var single_num_space = 10;
	
	        context.font = 'bold 36px sans-serif';
			var num = 0;
			for(var i = 0; i < 11; i++)
			{
				if(i == 10)
				{
					num = 0;
				}
				else{
					num = i;
				}
				
	        	context.fillText(num, myNumbers.x + single_num_space, myNumbers.y - (i * num_separation) -1);
	
			}   
		},

		/**
		 *	This controls how far a number is going to move, when it will stop, and looping if it reaches 9
		 *
		 *  @since 11/9/12
		 *  @author  Matt Stevenson
		*/		
		animate: function(id, lastTime, myNumbers, score, repeat, count){
	        
	        var canvas = document.getElementById(id);
			var context = canvas.getContext("2d");
			
			// update
			var date = new Date();
			var time = date.getTime();
			var timeDiff = time - lastTime;
			
			// pixels / second
			var linearSpeed = myNumbers.speed;
			var linearDistEachFrame = linearSpeed * timeDiff / 1000;
			
			var currentX = myNumbers.x;
			var currentY = myNumbers.y;
			
			// If currentY is close to the exact position of the score and its repeated enough set the exact score val
			if(currentY < (score + 10) && currentY > (score - 10) && count >= repeat)
			{
				// if they are equal its done, if not then automatically set the exact position of the num
				if(currentY != score){
					myNumbers.y = score;
					
					lastTime = time;
					// clear
					context.clearRect(currentX, 0, 38, canvas.height);
					
					// draw
					methods.drawNumbers(id, myNumbers);
					
					// request new frame
					requestAnimFrame(function() {
						methods.animate(id, lastTime, myNumbers, score, repeat, count);
					});
				}
			}
			else{
				// increment by the linearDistance calculated above
				if(currentY < 420) {
					var newY = currentY + linearDistEachFrame;
					myNumbers.y = newY;
				}
				// continue if reaches 9
				else{
					myNumbers.y = 30;
					count++;
				
				}
				lastTime = time;
				
				// clear
				context.clearRect(currentX, 0, 38, canvas.height);
				
				// draw
				methods.drawNumbers(id, myNumbers);
				
				// request new frame
				requestAnimFrame(function() {
					methods.animate(id, lastTime, myNumbers, score, repeat, count);
				});
			}          
			
		}
		
		
		
	};



//////////////////////////////////////////////////////////////////////////
//																		//
//	Main function that is called when you do $(#).points()				//
//																		//
//////////////////////////////////////////////////////////////////////////


	$.fn.points = function( method, options ) {
	
		//set a global function for use in the rest of the plugin
		window.requestAnimFrame = (function(callback) {
	        return window.requestAnimationFrame || 
	        window.webkitRequestAnimationFrame || 
	        window.mozRequestAnimationFrame || 
	        window.oRequestAnimationFrame || 
	        window.msRequestAnimationFrame ||
	        function(callback) {
	          window.setTimeout(callback, 1000 / 60);
	        };
        })();
	
	
   		options = options || {};
   		
   		// Method calling logic
	    if ( methods[method] ) {
	    	return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
	    } else if ( typeof method === 'object' || ! method ) {
	    	return methods.init.apply( this, arguments );
	    } else {
	    	$.error( 'Method ' +  method + ' does not exist on jQuery.points' );
	    } 

	};


//////////////////////////////////////////////////////////////////////////
//																		//
//	All the config stuff starts below									//
//																		//
//////////////////////////////////////////////////////////////////////////

	var config = {
		
	};
	
	//define the different number columns
	var defaultNums = {
		x: 0,
		y: 0,
		height: 0,
		borderWidth: 5,
		speed: 500
	};
	var defaultNums1 = {
		x: 41,
		y: 0,
		height: 0,
		borderWidth: 5,
		speed: 800
	};
	var defaultNums2 = {
		x: 82,
		y: 0,
		height: 0,
		borderWidth: 5,
		speed: 1200
	};
	
	//coordinates of each score
	var score_coor = [32,72,112,152,192,232,272,312,352,392];

		
})( jQuery );