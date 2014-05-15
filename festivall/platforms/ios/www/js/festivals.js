// FESTIVALS_CONTAINER


// Queries the local Database for all festivals
function createFestivalsContainer(){

    db.transaction(function queryFestivals(tx) {
        tx.executeSql('SELECT FESTIVALS.*, MIN(DAYS.date) as first_day ' +
            'FROM DAYS INNER JOIN FESTIVALS ' +
            'ON FESTIVALS.id = DAYS.festival_id ' +
            'WHERE FESTIVALS.country_id=' + localStorage['country_id'] + ' ' +
            'GROUP BY DAYS.festival_id ' +
            'ORDER BY first_day', [], queryFestivalsSuccess, errorQueryCB);
    }, errorCB, successCB);
}


// Callback for the festivals query
function queryFestivalsSuccess(tx, results) {
    //Create festivals container after insertions
    if(localStorage["firstRun"] == "true"){
        localStorage.setItem("firstRun", "false");
        $('#installer').removeClass('visible');
    }
    incrementHistory("#festivals");
    $('#festivals_buttons').empty();

    var festivals_length = results.rows.length;
    var festivals = results.rows;

    var ended_festivals = [];
    for (var i=0; i<festivals_length; i++){
        var festival = festivals.item(i);
        checkIfAfterFestival(festival.id, ended_festivals, i, festivals_length);
    }

    appendCountryToFestivals(festivals.item(0).country_id);
}

function checkIfAfterFestival(festival_id, ended_festivals, i, festivals_length){
    var current_time = new Date().getTime();
    db.transaction(function (tx) {
        tx.executeSql('SELECT *, FESTIVALS.id AS id, DAYS.id as day_id ' +
            'FROM FESTIVALS INNER JOIN DAYS ON FESTIVALS.ID = DAYS.FESTIVAL_ID ' +
            'WHERE FESTIVALS.ID='+festival_id, [], function(tx,results){
            var closing_time = getLastDayClosingTime(results.rows);
            var festival = results.rows.item(0);

            if (current_time > closing_time)
                ended_festivals.push(festival);
            else
                addFestivalToList(festival, i, festivals_length);

            //add ended festivals
            if(i >= festivals_length-1 && ended_festivals.length > 0){
                //meter linha
                $('#festivals_buttons').append('<br><div id="festivals_line_break">' + dictionary[localStorage['language']]['finished'] + '</div>');
                for(var j = 0; j < ended_festivals.length; j++)
                    addFestivalToList(ended_festivals[j]);

            }
        }, errorQueryCB);
    }, errorCB, successCB);

}

function addFestivalToList(festival){
    $('#festivals_buttons').append('' +
        '<li id="festival_' + festival.id +'" class="item">' +
        '<a href="#"><img class="festival_logo_img" src="' + festival.logo + '"></a>' +
        '</li>');

    $('#festival_'+festival.id).unbind().bind('click', function() {
        createFestivalContainer(this.id.replace("festival_", ""));
    });
}

function appendCountryToFestivals(country_id){
    db.transaction(function queryFestivalsCountry(tx) {
        tx.executeSql('SELECT COUNTRIES.* FROM COUNTRIES WHERE COUNTRIES.id=' + country_id,
            [], queryFestivalsCountrySuccess, errorQueryCB);
    }, errorCB, successCB);

}

// Callback for the festivals query
function queryFestivalsCountrySuccess(tx, results) {
    var festivals_country = results.rows.item(0);
    $('#festivals_country_title span').text(festivals_country.name);
    $('#festivals_country_flag').attr('src', festivals_country.flag);

    changeContainers('#festivals', '', '');
}