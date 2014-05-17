// MAP_CONTAINER


// Queries the local Database for a map
function createMapContainer(festival_map) {

    $('#header_link').unbind().bind('click', function(){
        createFestivalContainer(current_festival_id);
    });

    $('#map_page').empty().append('<div id="map_scroll_wrapper" class="scroll_wrapper"><div>');

    if(festival_map != "")
        $('#map_scroll_wrapper').append('<div id="map_scroller" class="horizontal_scroll_wrapper">' +
                '<img src="' + festival_map +'">' +
            '</div>');
    else
        $('#map_scroll_wrapper').append('<div id="map_scroller" class="padded"><p>' +
            dictionary[localStorage['language']]['map_not_available_yet'] + '</p></div>');

}
