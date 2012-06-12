$(document).ready(function(){
  $('#query').on('keydown', search);

  function search(event) {
    var key = event.which;
    if(key != 1 && key != 13) 
      return;
    
    var queryText = $('#query').val().trim();
    if(!queryText) 
      return;

    $('#results').empty();
    var spinner = startSpinner($('#results').get(0));
    $.get('/search', { query: queryText }, function(response) {
      spinner.stop();
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
});

