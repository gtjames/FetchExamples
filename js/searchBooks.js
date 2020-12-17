fetch('https://www.googleapis.com/books/v1/volumes?q=harry%20potter')
.then(resp => resp.json())      //  wait for the response and convert it to JSON
.then(books => {                //  with the resulting JSON data do something
    var list = books.items.map(b => b.volumeInfo.title)
});
