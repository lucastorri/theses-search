$(document).ready(function() {

  var charLimit = 100;
  var fadeInOutTime = 8000;
  $('#query').on('keydown', search);
  $('#preview').on('show', preparePreview);
	$('#no-results').hide();
  $('#thesis-date').datepicker().on('changeDate', function() {
    $(this).datepicker('hide');
  }).click(function() {
    $(this).datepicker('show');
  });
  $('#thesis-upload').ajaxForm({
    beforeSend: resetUploadStatus,
    uploadProgress: updateUploadStatus,
    success: thesisSubmited,
    error: uploadError
  });

  $('#query').val(location.hash.replace(/^#/, ''));
  search({which: 1});
  
  function search(event) {
    var key = event.which;
    if(key != 1 && key != 13) 
      return;

    $('#no-results').fadeOut();
    var queryText = $('#query').val().trim();
    $('#lastQuery').val(queryText);
    if(!queryText) 
      return;

    location.hash = queryText;
    $('#results').empty();
    var spinner = startSpinner($('#results').get(0));
    $.get('/search', { query: queryText }, function(response) {
      var postFix = 0;
      setResponseStatus(response);
      $(response).each(function(i, doc) {
          doc.uniqueId = 'unique' + (postFix++);
          doc.name = doc.metadata.title || doc.id;

          $.get('/snippets', { id: doc.id, query: queryText }, function(snippets) {
            var snippet = snippets[0];
            snippet.uniqueId = doc.uniqueId;
            snippet.snipets = [];
            $(snippet.matches).each(function(i, match) {
              snippet.snipets.push({
                oneline: limitTo(match, charLimit),
                full: match.trim()
              });
            });
            $('#accordion' + doc.uniqueId).empty();
            $('#matches-template').tmpl(snippet).appendTo('#accordion' + doc.uniqueId);
          });
      });
      spinner.stop();
      console.log(response);
      $('#doc-template').tmpl(response).appendTo('#results');
      $('.doc-preview').click(populatePreview);
      animateSnippetLoad();
      $('.ttip').tooltip()
      $('.doc-info').popover()
    });
  }

  function animateSnippetLoad() {
    var dots = 0;
    var t = setInterval(function() {
      var l = $('.snippet-loading');
      if (l.length == 0) {
        clearTimeout(t);
      }
      l.each(function(i, e) {
        $(e).html(new Array(dots + 1).join('.'));
      });
      dots = (dots + 1) % 4;
    }, 400); 
  }

	function setResponseStatus(response) {
    var notice = $('#no-results');
    var results = response.length;
    notice.empty();
    if(results > 0) {
      notice.addClass('label-success');
      notice.removeClass('label-inverse');
      notice.html(results + ' result' + (results==1 ? '' : 's') + ' found');
    }
    else {
      notice.addClass('label-inverse');
      notice.removeClass('label-success');
      notice.html('No results found');
    }
    notice.fadeIn();
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

  function startLoadingSpinner(element) {
    return new Spinner({
      lines: 7, // The number of lines to draw
      length: 2, // The length of each line
      width: 8, // The line thickness
      radius: 7, // The radius of the inner circle
      rotate: 0, // The rotation offset
      color: '#000', // #rgb or #rrggbb
      speed: 1, // Rounds per second
      trail: 70, // Afterglow percentage
      shadow: false, // Whether to render a shadow
      hwaccel: true, // Whether to use hardware acceleration
      className: 'spinner'
    }).spin(element); 
  }

  var previewSpinner;

  function preparePreview() {
    var previewContent = $('#preview-content');
    previewSpinner = startLoadingSpinner(previewContent.empty()[0]);
  }

  function populatePreview() {
    var e = $(this);
    $('#preview-title').html(e.data('name'));
    $.get('/hl', { file: e.data('id'), query: lastQuery() }, function(response) {
      $('#preview-content').html(response[0].matches[0]);
      previewSpinner.stop();
      $('#preview').show();
    });
  }

  function resetUploadStatus() {
    $('#upload-progress').show();
    $('#upload-progress .bar').width(0).show();
    $('#thesis-submit').addClass('disabled')
    $('#upload-error').hide();
  }

  function updateUploadStatus(e, position, total, percent) {
    $('#upload-progress .bar').width(percent + '%');
  }

  function uploadError() {
    $('#upload-progress').fadeOut();
    var error = $('#upload-error');
    error.fadeIn();
    $('#thesis-submit').removeClass('disabled')
    setTimeout(function() {
      error.fadeOut();
    }, fadeInOutTime);
  }

  function thesisSubmited() {
    $('#upload-progress .bar').width('100%');
    $("#upload").modal('hide');
    var status = $('#upload-status');
    status.fadeIn();
    $('#thesis-upload').resetForm();
    $('#thesis-submit').removeClass('disabled');
    $('#upload-progress').hide();
    setTimeout(function() {
      status.fadeOut();
    }, fadeInOutTime);
  }

  function lastQuery() { 
    return $('#lastQuery').val();
  }

  $("#open-upload").click(function () {
    $('#upload-status').hide();
    $('#upload-error').hide();
    $("#upload").show();
  });
});