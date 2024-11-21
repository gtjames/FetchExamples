import {niceDate, niceTime} from './utils.js';

let theKey = keys.keyRapidAPI;
let search = document.getElementById('search');
    search.addEventListener('click', shoppingSearch);

    function shoppingSearch() {
        let searchText = document.getElementById('itemSearch').value;

        const options = {
	        method: 'GET',
	        headers: {
		        'X-RapidAPI-Key': theKey,
		        'X-RapidAPI-Host': 'bloomberg-market-and-financial-news.p.rapidapi.com'
	        }
        };
        fetch(`https://bloomberg-market-and-financial-news.p.rapidapi.com/market/auto-complete?query=${searchText}`, options)
	        .then(response => response.json())
	        .then(response => show(response))
	        .catch(err => console.error(err));
}
function show(products) {
    let tableBody = document.getElementById('list');
    let tableBody2 = document.getElementById('list2');
    //  the map function will take out attributes and merge into
    //  an array representing a TR element
    //  the final join will take these strings in the array and create one BIG string
    //  which we will put into the tableBody
    tableBody.innerHTML = products.quote.map((b,idx) => buildRow(b, idx) ).join("\n");
    let x = products.news.map((b,idx) => buildRow2(b, idx) ).join("\n");
    tableBody2.innerHTML = x;
}

//  function buildRow
//      All this function does is take our data and create a text string
//      that matches the columns needed in our table
//      since the three examples above all need to do the same thing it was
//      a convenience to put the common work into a function
function buildRow (data, index) {
    return `<tr class="w3-theme-${index%2>0?'l2':'l3'}">
                <td>${data.country}</td>
                <td>${data.currency}</td><td>${data.id}</td>
                <td>${data.exchange}</td><td>${data.name}</td>
            </tr>`;
}
 /*
card: "video"
date: 1677770467
id: "RQWFWCT0G1KZ01"
longURL: "https://www.bloomberg.com/news/videos/2023-03-02/raimondo-this-chips-bill-is-essential-for-america-video"
thumbnailImage: "https://assets.bwbx.io/images/users/iqjWHBFdfxIU/i3tsoiCnDOsM/v3/600x-1.jpg"
title: "Raimondo: This CHIPS Bill Is Essential for America"
 */
 function buildRow2 (data, index) {
    //  sometimes we get an image other times we get a video
    let media;
    if (data.card === 'video') {
        media = `${data.title}
        <a href='${data.longURL}'>
            <img src="${data.thumbnailImage}" height="150px" alt="">
            </a>`;
    }
    else {
        media = `<a href='${data.longURL}'>${data.title}</a>`;
    }
    
    return `<tr class="w3-theme-${index%2>0?'l2':'l3'}">
    <td colspan=4>${media}
    <br>${niceDate(data.date, 0)} ${niceTime(data.date, 0)}</td>
    </tr>`;
}
function setKey() { theKey = getKey(); }
