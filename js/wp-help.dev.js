(function($) {
	$(function() {
// ==========================================================
		var api = {
			p: function(i) {
				return $('#cws-wp-help-' + i);
			},
			init: function() {
				// Clicking the source API URI
				data.apiURL.click( function(){
					this.select();
				});

				// Clicking the "Save Changes" button
				data.saveButton.click( function() {
					api.saveSettings();
				});

				// Clicking the "Settings" button
				data.settingsButton.click( function(e) {
					e.preventDefault();
					api.revealSettings( true ); // true = autofocus on the h2 with no highlighting
				});

				// Doubleclick the h2
				data.h2.display.text.dblclick( function(){
					api.revealSettings();
					data.h2.edit.input.focus();
				});
				
				// Doubleclick the h3
				data.h3.display.text.dblclick( function(){
					api.revealSettings();
					data.h3.edit.input.focus();
				});

				// Monitor for "return" presses in our text inputs
				data.returnMonitor.bind( 'keydown', function(e) {
					if ( 13 == e.which ) {
						$( this ).blur();
						api.saveSettings();
					}
				});

				// Send h2 updates to the menu item as we type
				data.h2.edit.input.bind( 'keyup', function() {
					data.menu.text( $( this ).val() );
				});
			},
			fadeOutIn: function(first, second) {
				first.fadeOut( 150, function() {
					second.fadeIn( 150 );
				});
			},
			hideShow: function(hide, show) {
				hide.hide();
				show.show();
			},
			revealSettings: function(autofocus) {
				$([ data.h2, data.h3 ]).each( function() {
					api.hideShow( this.display.wrap, this.edit.wrap );					
				});
				api.fadeOutIn( data.doc, data.settings );
				if ( autofocus ) {
					(function(h2) {
						h2.focus().val( h2.val() );
					})(data.h2.edit.input);
				}
			},
			saveSettings: function() {
				api.clearError();
				$([ data.h2, data.h3 ]).each( function() {
					this.display.text.text( this.edit.input.val() );
				});
				$.post( ajaxurl, {
					action: 'cws_wp_help_settings',
					nonce: $('#_cws_wp_help_nonce').val(),
					h2: data.h2.edit.input.val(),
					h3: data.h3.edit.input.val(),
					slurp_url: data.slurp.val()
				}, function(result) {
					result = $.parseJSON( result );
					data.slurp.val( result.slurp_url );
					if ( result.error ) {
						api.error( result.error );
						data.slurp.focus();
					} else {
						api.hideSettings();
					}
				});
			},
			hideSettings: function() {
				$([ data.h2, data.h3 ]).each( function() {
					api.hideShow( this.edit.wrap, this.display.wrap );
				});
				api.fadeOutIn( data.settings, data.doc );
			},
			clearError: function(){
				data.slurpError.html('').hide();
			},
			error: function(msg){
				data.slurpError.html( '<p>' + msg + '</p>' ).fadeIn(150);
			}
		};

		var data = {
			h2: {
				edit: {
					input: api.p( 'h2-label' ),
					wrap: api.p( 'h2-label-wrap' )
				},
				display: {
					text: $('.wrap h2:first'),
					wrap: $('.wrap h2:first'),
				}
			},
			h3: {
				edit: {
					input: api.p( 'listing-label' ),
					wrap: api.p( 'listing-labels' )
				},
				display: {
					text: api.p( 'listing h3 i' ),
					wrap: api.p( 'listing h3' )
				}
			},
			settingsButton: api.p( 'settings-on' ),
			menu: $( '#adminmenu a.current' ),
			doc: api.p( 'document' ),
			settings: api.p( 'settings' ),
			apiURL: api.p( 'api-url' ),
			slurp: api.p( 'slurp-url' ),
			slurpError: api.p( 'slurp-error' ),
			saveButton: api.p( 'settings-save' ),
			returnMonitor: $( '.wrap input[type="text"]' ),
		};

		// Bootstrap everything
		api.init();
// ==========================================================
	});
})(jQuery);