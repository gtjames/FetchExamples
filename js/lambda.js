	let apiURL = 'https://4e4alkz5p2.execute-api.us-east-1.amazonaws.com/items';
	let rows = document.getElementById("rows");

	window.addEventListener("load", () => getQuoteList());

	let quote   = document.getElementById("quote");
	let speaker = document.getElementById("speaker");
	document.getElementById("save").addEventListener("click", () => createQuote());

	let row = 0;

	function getQuoteList() {
		//fetch API for global info
		fetch(apiURL, {} )
			.then(response => response.json())
			.then(quotes => {
				rows.innerHTML = '';        //  clear the page
				quotes.forEach(q => {
					row++;                  //  use the row # to let us alternate the colors of the row
					//  Note the id for the Delete and Update TDs. We need a unique id in order to attach an
					//  specific event handlers for the Update and Delete requests
					let tr = `
                    <tr class="w3-theme-${row % 2 > 0 ?"l2":"l3"}">
                        <td>${(new Date(+q.id)).toString().substring(4,24)}</td>
                        <td>${q.speaker}</td>
                        <td>${q.quote}</td>
                        <td id="D${q.id}">Delete</td>
                        <td id="U${q.id}">Update</td>
                    </tr>`;
					rows.innerHTML += tr;
				});
				quotes.forEach(q => {
					let ref = document.getElementById("D"+q.id);                //  get reference to the Delete 'button'
					ref.addEventListener('click', () => deleteQuote(q.id));     //  add the deleteQuote event listener
					//  or let's get fancy and do it in one line
					document.getElementById("U"+q.id).addEventListener('click', () => updateQuote(q.id));
				});
			})
			.catch(err => console.log('Fetch Error :', err) );
	}

	function createQuote() {
		rows.innerHTML = '';            //  empty out the list
		fetch(apiURL, {
			method: 'PUT',
			body: JSON.stringify({ id: new Date().getTime(), quote: quote.value, speaker: speaker.value })
		})
        .then(response => response.text())
        .then((x) => {
            console.log(x);
            getQuoteList()
        })
        .catch(err => console.log('Fetch Error :', err) );
	}

	//  To delete a document in the DynamoDB table
	//      id is required to identify the document
	function deleteQuote(id) {
		fetch(`${apiURL}/${id}`, { method: 'DELETE' })
		.then(response => response.json())		    //	this is totally unnecessary. Just here to see the response object
		.then(resp => getQuoteList())               //  refresh the list of documents in the table
		.catch(err => console.log('Fetch Error :', err) );
	}

	//  To update a document in the DynamoDB table
    //      id is required to identify the document
    //      quote (or any other attribute that needs to be changed) and the new value
	function updateQuote(id) {
		fetch(`${apiURL}/${id}`, {
			method: 'POST',
			body: JSON.stringify({ quote: quote.value, speaker: speaker.value })
		})
        .then(response => response.text())
        .then(resp => getQuoteList() )
        .catch(err => console.log('Fetch Error :', err) );
	}
