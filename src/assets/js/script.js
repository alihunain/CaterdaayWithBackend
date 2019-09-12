	$('.slider').slick({
          slidesToShow: 1,
		  slidesToScroll: 1,
		  autoplay: true,
		  infinite:true,
		  autoplaySpeed: 2000,
		  arrows:false,
		  dots:false,
		  focusOnSelect: false,
		  speed: 1000,
		});
	

	$('.deals-slider').slick({
          slidesToShow: 3,
		  slidesToScroll: 1,
		  autoplay: true,
		  infinite:true,
		  autoplaySpeed: 2000,
		  arrows:false,
		  dots:true,
		  focusOnSelect: false,
		  speed: 700,
		  responsive: [
		  {	     
	    	breakpoint: 992,
	    	settings: {
	    		slidesToShow: 2,
	    		slidesToScroll:1
	    		}
	    	},

	    	{
	    	breakpoint: 575,
	    	settings: {
	    		slidesToShow: 1,
	    		slidesToScroll: 1	
	    		}
			}
    		]
		});

function openNav() {
  document.getElementById("mySidenav").style.width = "100%";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}
	$(document).ready(function() {
		$("#side-cart").click(function(){
		    $(".cart-menu").slideToggle();
		  });
		    $('<div class="quantity-nav"><div class="quantity-button quantity-up">+</div><div class="quantity-button quantity-down">-</div></div>').insertAfter('.cart-item-quantity input');
		    $('.cart-item-quantity').each(function() {
		      var spinner = $(this),
		        input = spinner.find('input[type="number"]'),
		        btnUp = spinner.find('.quantity-up'),
		        btnDown = spinner.find('.quantity-down'),
		        min = input.attr('min'),
		        max = input.attr('max');

		      btnUp.click(function() {
		        var oldValue = parseFloat(input.val());
		        if (oldValue >= max) {
		          var newVal = oldValue;
		        } else {
		          var newVal = oldValue + 1;
		        }
		        spinner.find("input").val(newVal);
		        spinner.find("input").trigger("change");
		      });

		      btnDown.click(function() {
		        var oldValue = parseFloat(input.val());
		        if (oldValue <= min) {
		          var newVal = oldValue;
		        } else {
		          var newVal = oldValue - 1;
		        }
		        spinner.find("input").val(newVal);
		        spinner.find("input").trigger("change");
		      });

    });
	 	$('#special-ins').click(function(){
	 		$('#special-txt').fadeToggle();	
	 	})
		var offset = 900;
		var duration = 800;
	 
		

		var chef = $('.chef-list').length;
	 
	 	
	 	$(".chef-list").slice(0, 4).show();
	    if ($(".chef-list:hidden").length != 0) {
	      $("#loadMore").show();
	    }   
	    $("#loadMore").on('click', function (e) {
	      e.preventDefault();
	      $(".chef-list:hidden").slice(0, chef).slideDown();
	      if ($(".moreBox:hidden").length == 0) {
	        $("#loadMore").fadeOut('slow');
	      }
	    });

	    $('label[for="cod"]').click(function(){
			$('label[for="cod"]').css('background','#ebebeb');
			$('label[for="cc"]').css('background','transparent');
		});
		$('label[for="cc"]').click(function(){
			$('label[for="cc"]').css('background','#ebebeb');
			$('label[for="cod"]').css('background','transparent');
		});

		// smoothscroll
		$("a[href^='#']").on('click', function (e) {
			e.preventDefault();
			var hash = this.hash;
			$('html, body').animate({
				scrollTop: ($(hash).offset().top - 60)
			}, 500, function () {
				window.location.hash = hash;
			});
		});

		Date.prototype.toDateInputValue = (function() {
		    var local = new Date(this);
		    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
		    return local.toJSON().slice(0,10);
		});

		$('#del-date').val(new Date().toDateInputValue());
		
		$(function(){     
		  var d = new Date(),        
		      h = d.getHours(),
		      m = d.getMinutes();
		  if(h < 10) h = '0' + h; 
		  if(m < 10) m = '0' + m; 
		  $('#del-time').each(function(){ 
		    $(this).attr({'value': h + ':' + m});
		  });
		});
	 });

//Counter

(function ($) {
	$.fn.countTo = function (options) {
		options = options || {};
		
		return $(this).each(function () {
			// set options for current element
			var settings = $.extend({}, $.fn.countTo.defaults, {
				from:            $(this).data('from'),
				to:              $(this).data('to'),
				speed:           $(this).data('speed'),
				refreshInterval: $(this).data('refresh-interval'),
				decimals:        $(this).data('decimals')
			}, options);
			
			// how many times to update the value, and how much to increment the value on each update
			var loops = Math.ceil(settings.speed / settings.refreshInterval),
				increment = (settings.to - settings.from) / loops;
			
			// references & variables that will change with each update
			var self = this,
				$self = $(this),
				loopCount = 0,
				value = settings.from,
				data = $self.data('countTo') || {};
			
			$self.data('countTo', data);
			
			// if an existing interval can be found, clear it first
			if (data.interval) {
				clearInterval(data.interval);
			}
			data.interval = setInterval(updateTimer, settings.refreshInterval);
			
			// initialize the element with the starting value
			render(value);
			
			function updateTimer() {
				value += increment;
				loopCount++;
				
				render(value);
				
				if (typeof(settings.onUpdate) == 'function') {
					settings.onUpdate.call(self, value);
				}
				
				if (loopCount >= loops) {
					// remove the interval
					$self.removeData('countTo');
					clearInterval(data.interval);
					value = settings.to;
					
					if (typeof(settings.onComplete) == 'function') {
						settings.onComplete.call(self, value);
					}
				}
			}
			
			function render(value) {
				var formattedValue = settings.formatter.call(self, value, settings);
				$self.html(formattedValue);
			}
		});
	};
	
	$.fn.countTo.defaults = {
		from: 0,               // the number the element should start at
		to: 0,                 // the number the element should end at
		speed: 1000,           // how long it should take to count between the target numbers
		refreshInterval: 100,  // how often the element should be updated
		decimals: 0,           // the number of decimal places to show
		formatter: formatter,  // handler for formatting the value before rendering
		onUpdate: null,        // callback method for every time the element is updated
		onComplete: null       // callback method for when the element finishes updating
	};
	
	function formatter(value, settings) {
		return value.toFixed(settings.decimals);
	}
}(jQuery));

jQuery(function ($) {
  // custom formatting example
  $('.count-number').data('countToOptions', {
	formatter: function (value, options) {
	  return value.toFixed(options.decimals).replace(/\B(?=(?:\d{3})+(?!\d))/g, ',');
	}
  });
  
  // start all the timers
  $('.timer').each(count);  
  
  function count(options) {
	var $this = $(this);
	options = $.extend({}, options || {}, $this.data('countToOptions') || {});
	$this.countTo(options);
  }
});