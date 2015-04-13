;(function ( $, window, document, undefined ) {  
  
// --- BEGIN PLUGIN ---
  
    var // plugin name
        pluginName = 'pinly',
        // key using in $.data()
        dataKey = 'plugin_' + pluginName;
 
    
    
    // Adds pinly input fields
    var _BuildDataModel = function ( obj, numberOfFields, inputName ) {
      var pinly_input;

      
       for ( i = 0; i < numberOfFields; i++ ) {
         pinly_input = $( '<input type="number" class="' + inputName + '" pattern="[0-9]*" value="0" min="0" max="9" alt="Your browser does not support javascript">' );
          
          obj.addClass( 'pinly-wrap' )
             .append( pinly_input );         
       }
    };

     // Private: determine if key pressed was 
   var _ValidateInput = function ( obj, max, e ) {   
      if( isNaN( String.fromCharCode( e.charCode ) ) || obj.val().length === max ) {
          e.preventDefault();
          return false;
        } else {
          return true;
        }
   }; 
  
     // Private get pin & post
     var _ProcessPIN = function ( obj, selector, max, login_success ) {
       var PIN = '';
       
         $.each( $( '.' + selector, obj ), function(){
           PIN += $( this ).val();
         });  
          
          
         // If PIN value is max number of inputs then hide keyboard(mobile) & POST data
         if ( PIN.length === max ) { 
            // Check PIN     
        login_success( PIN );
  
     }
     };
  
  
  
    // Plugin settings/options
    var Plugin = function ( element, options ) {
        this.element = element;
        
        this.options = {
            num_inputs    : 4,
            input_name    : 'pinly-point',
            login_success : function(){}
        };
        
        /*
         * Initialization
         */
        
        this.init( options );
    };
 
    Plugin.prototype = {
        // initialize options
        init: function ( options ) {
            $.extend( this.options, options );
            var obj,
              charStatus, 
              t, 
              plugin = this;
              
             // Add pinly elements to DOM
             _BuildDataModel( plugin.element, plugin.options.num_inputs, plugin.options.input_name );


       // Capture user interactions
         $( '.' + plugin.options.input_name, plugin.element ).on({
            keyup: function( e ) {
                    obj = $( this );
                    
                  // Prevent default actions for backspace & tab bubbling after keypress
                  if ( charStatus === true && e.which === 9 ) { 
                    e.preventDefault();
                    
                  } else if ( charStatus === true && e.which === 8 ) {
                    e.preventDefault();
                      
                      // Move backwards if backspace pressed on pinly 
                      if ( obj.prev().hasClass( plugin.options.input_name ) ) 
                  obj.val( '0' ).prev().focus();
                      
                    } else if ( charStatus === true ) {
                      
                      // Move forward if key is valid (i.e. a number)
                      if ( obj.next().hasClass( plugin.options.input_name ) ) 
                  obj.next().focus();

                      // Update PIN
                      _ProcessPIN( plugin.element, plugin.options.input_name, plugin.options.num_inputs, plugin.options.login_success );
                      
                    }
         
            },
              
            keypress: function( e ) {      
                     obj = $( this );
                    
                       // Space & enter are also not valid so we need to prevent their behaviours
                       if ( e.which === 13 || e.which === 32 ) {
                         e.preventDefault();
                         charStatus = false;
                    
                       } else {
                  charStatus = _ValidateInput( obj, 1, e );                    
                       } 
            },
            
                  // On focus set the value to null and select so that input can be achieved
            focus: function() {
                    $( this ).addClass( 'pinly-highlight' )
                         .val( '' );
            },
        
                  // When focus is lost and value is null reset to 0
            focusout: function () {
              $( this ).removeClass( 'pinly-highlight' );
              
              if ( $( this ).val() === '' )
                $( this ).val( '0' );        
            }         
          });
          
        // Listen for pinly custom events fired after PIN is validated
        plugin.element.on({
          pinlyFail : function ( e ) {
            $( '.pinly-point', plugin.element ).addClass( 'pinly-highlight' );
          },
          
          pinlySuccess : function ( e ) {
            // Remove keyboard on mobile
          document.activeElement.blur(); 
          
          $( '.pinly-point' ).addClass( 'pinly-accepted' )
                         .fadeOut( 600 );
          }
        });         

        }, // </init>
        

    };
 
    /*
     * Plugin wrapper, preventing against multiple instantiations and
     * return plugin instance.
     */
    $.fn[ pluginName ] = function ( options ) {
 
        var plugin = this.data( dataKey );
 
        // has plugin instantiated ?
        if ( plugin instanceof Plugin ) {
            // if have options arguments, call plugin.init() again
            if ( typeof options !== 'undefined' ) {
                plugin.init( options );
            }
        } else {
            plugin = new Plugin( this, options );
            this.data( dataKey, plugin );
        }
        
        return plugin;
    };
 
}( jQuery, window, document ));