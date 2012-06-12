$(document).ready(function(){
  $('#search').on('click', search);
  $('#query').on('keydown', search);

  function search(event) {
    var key = event.which;
    if(key != 1 && key != 13) 
      return;
    
    var queryText = $('#query').val();
    if(!queryText) 
      return;
    
    $.get('/search', { query: queryText }, displayResults);
  }

  function displayResults(response) {
    $('#template').tmpl(response).appendTo('#results');
  }
});

/*
var search = function(e) {
  lastSearch = queryField[0].value.trim();
  ws.send(lastSearch);
  location.hash = lastSearch;
}

if (location.hash) {
  queryField[0].value = location.hash.substring(1);
  setTimeout(search, 500);
}

queryField.keyup(function() {
  clearTimeout(searchTimeout);
  lastSearch !== this.value &&
        this.value.trim() &&
        (searchTimeout = setTimeout(search, 500));
});
*/
