$(document).ready(function(){
  var charLimit = 140;
  $('#query').on('keydown', search);
  $('#preview').on('show', populatePreview);

  function search(event) {
    var key = event.which;
    if(key != 1 && key != 13) 
      return;
    
    var queryText = $('#query').val().trim();
    $('#lastQuery').val(queryText);
    if(!queryText) 
      return;

    $('#results').empty();
    var spinner = startSpinner($('#results').get(0));
    $.get('/search', { query: queryText }, function(response) {
      spinner.stop();
      response.forEach(function(e) {
          e.oneline = [];
          for(var i = 0; i < e.matches.length; i++) {
              e.oneline.push(limitTo(e.matches[i], charLimit));
          }
      });
      $('#template').tmpl(response).appendTo('#results');
    });
  }

  function startSpinner(element) {
    return new Spinner({
      lines: 13, // The number of lines to draw
      length: 8, // The length of each line
      width: 10, // The line thickness
      radius: 40, // The radius of the inner circle
      rotate: 49, // The rotation offset
      color: '#000', // #rgb or #rrggbb
      speed: 2, // Rounds per second
      trail: 100, // Afterglow percentage
      shadow: true, // Whether to render a shadow
      hwaccel: true, // Whether to use hardware acceleration
      className: 'spinner', // The CSS class to assign to the spinner
      zIndex: 2e9, // The z-index (defaults to 2000000000)
      top: 50, // Top position relative to parent in px
      left: 'auto' // Left position relative to parent in px
    }).spin(element);
  }

  function populatePreview() {
    var id = $('#doc').val();
    $.get('/hl', { file: id, query: lastQuery() }, function(response) {
      $('#preview-content').html(response.matches[0]);
      $('#preview-title').html(id);
      $('#preview').show();
    });
  }
});

function lastQuery() { 
  return $('#lastQuery').val();
}

function updateId(id) {
  $('#doc').val(id);
}
