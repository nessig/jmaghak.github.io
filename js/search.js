(function() {

  // function compare(a,b) {
  //   if (Date.parse(a.date) < Date.parse(b.date)) {
  //     return -1;
  //   }
  //   if (a.last_nom > b.last_nom) {
  //     return 1;
  //   }
  //   return 0;
  // }

  function displaySearchResults(results, store) {
    var searchResults = document.getElementById('search-results');

    if (results.length) { // Are there any results?
      var appendString = '';

      // var items = results.map(function(e) { return store[e.ref];});
      // console.log("items: ", items);
      // items.sort()

      for (var i = 0; i < results.length; i++) {  // Iterate over the results
        var item = store[results[i].ref];
        appendString += '<li><a href="' + item.url + '"><h3>' + item.title + '</h3></a>';
        if (item.date != '') {
          var s = new Date(Date.parse(item.date));
          appendString += s.toDateString();
        }
        appendString += '<p>' + item.content.substring(0, 150) + '...</p></li>';

      }

      searchResults.innerHTML = appendString;
    } else {
      searchResults.innerHTML = '<li>No results found</li>';
    }
  }

  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');

      if (pair[0] === variable) {
        return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
      }
    }
  }

  var searchTerm = getQueryVariable('query');

  if (searchTerm) {
    document.getElementById('search-box').setAttribute("value", searchTerm);

    // Initalize lunr with the fields it will be searching on. I've given title
    // a boost of 10 to indicate matches on this field are more important.
    var idx = lunr(function () {
      this.field('id');
      this.field('title', { boost: 10 });
      this.field('category');
      this.field('content');
      this.field('date');
    });

    for (var key in window.store) { // Add the data to lunr
      idx.add({
        'id': key,
        'title': window.store[key].title,
        'category': window.store[key].category,
        'content': window.store[key].content,
        'date': window.store[key].date
      });

      var results = idx.search(searchTerm); // Get lunr to perform a search
      // console.log(results);
      displaySearchResults(results, window.store); // We'll write this in the next section
    }
  }
})();
