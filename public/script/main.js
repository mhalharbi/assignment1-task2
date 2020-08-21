$(document).ready(function(){ 
    // set song upload modal 
    $('.modal').modal();
    $('#uploadSonge').click(function() {
    event.preventDefault(); 
    var file = $('#songs-input')[0].files[0];
    let formData = new FormData();
    if (file.length === 0) {
        alert('Select a song to upload.');
        return false;
    }   
    // prepare song object
    formData.append('artist_name', $("#artist_name").val());   
    formData.append('description', $("#description").val());   
    formData.append('file', file);  
    uploadFiles(formData); 
    }); 

    function uploadFiles(formData) {  // call api to upload song       
        $.ajax({
            url: '/upload_song',
            method: 'POST',
            type: 'POST',
            data : formData,
            processData: false,
            contentType: false, 
        }).done(handleSuccess).fail(function (xhr, status) {
            alert(status); // success 
        });
    }

    getSongs();  // reterive songs

    $('#songbtn').click(function() { // reterive songs after update
        getSongs();
    });

    //  audio player controls
    $("#stop").click(function () {    
            $("#player").trigger('pause');   
    }); 
    
    $("#next").click(function () {    
        playNext();   
    }); 

    $("#previous").click(function () {    
        playPrev();      
    });  

    // get slected song item
    $('ul').on('click','li.collection-item',function(e){
        var $this = $(this);   
        playlistItemClick($this);    
        });
  });

  function handleSuccess(data) {
    if (data.length > 0) {
        var html = '';
        alert('Song uploaded!');
        reset_update_songs();   // update song list      
    } else {
        alert('No images were uploaded.')
    }
}

function reset_update_songs() { // reset upload modal
    $("#artist_name").val('');
    $("#description").val('');
    $("#filename").val('');  
    //songs
}    

// helper functions
function playlistItemClick(clickedElement) { 
    $('li.collection-item').removeClass('active');
    clickedElement.addClass('active');
    $("#player").attr("src",clickedElement.attr("data-ogg")).trigger("play");   
    $("#songinfo").text(clickedElement.attr("data-info")); 
    }

 function playNext() {
    var selected =  $('li.collection-item.active') 
     if (selected && selected.next()) {
        playlistItemClick(selected.next());
    } 
}

function playPrev() {
    var selected =  $('li.collection-item.active') 
        if (selected && selected.prev()) {
        playlistItemClick(selected.prev());
    } 
} 

function getSongs() {  
    $('#playlist').empty(); // clear the list
    $('#songlist').append('<li><a class="subheader">Songs</a></li>') 
    $.get('/songs', function(songs) { // call backend api 
        songs.forEach((song)=> { // add to the list
            $('#playlist').append('<li class="collection-item" data-info = "' +song.song.artist_name + '" data-ogg="uploads/' + song.song.filenamecar + '">' + song.song.description + '<author> by (' + song.song.artist_name + '</author> )</li> ')            
        }); 
        $('#playlist li:first').addClass( "collection-item active" );
    });
}
