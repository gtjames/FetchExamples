let theKey = keys.keyRapidAPI;
document.getElementById("search").addEventListener('click', find);
let searchTerm = document.getElementById("searchTerm");
let rows  = document.getElementById("rows");

document.getElementById("id01").addEventListener("click", closeModal);
function closeModal() {
    document.getElementById('id01').style.display='none';
}

let row = 0;

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': theKey,
		'x-rapidapi-host': 'yahoo-finance15.p.rapidapi.com'
	}
};

function requestData(url, func, opt) {
	fetch(url, opt)
	.then(response => response.json())
	.then(result => func(result))
	.catch (error => {
		console.error(error);
	});
}

function find() {
	rows.innerText = '';
	let term = searchTerm.value;
	requestData(`https://yahoo-finance15.p.rapidapi.com/api/v1/markets/search?search=${term}`, list, options);
}

function list(movies) {
	movies.body.forEach(m => {
		row++;                  //  use the row # to let us alternate the colors of the row
		let tr = `
		<tr id=${m.symbol} onclick=getDetails(this) class="w3-theme-l${(row%5)+1}">
		<td>${m.symbol}</td>
		<td>${m.industryDisp}</td>
		<td>${m.sector}</td>
		<td>${m.longname}</td>
		<td>${m.typeDisp}</td>
		</tr>`;
		rows.innerHTML += tr;

	// exchDisp: "NEO"
	// index: "quotes"
		// industry: "Consumer Electronics"
		// industryDisp: "Consumer Electronics"
		// longname: "Apple Inc."
// quoteType: "EQUITY"
// score: 20011
		// sector: "Technology"
		// sectorDisp: "Technology"
		// shortname: "APPLE CDR (CAD HEDGED)"
		// symbol: "AAPL.NE"
// typeDisp: "Equity"
	});
}

function getDetails(e) {
	let symbol = e.id;
	console.log(symbol);
	requestData(`https://yahoo-finance15.p.rapidapi.com/api/v1/markets/quote?ticker=${symbol}&type=STOCKS`, details, options);
}

function details(movie) {
    document.getElementById('id01').style.display='block';
    let rows = document.querySelector('#daily');
    let title = document.getElementById('title');
	title.innerText = movie.body.companyName
	rows.innerHTML = `
	<tr><td>Company Name</td><td>${movie.body.companyName}</td></tr>
	<tr><td>52 Week High Low</td><td>${movie.body.keyStats.fiftyTwoWeekHighLow.value}</td></tr>
	<tr><td>Last Sale Price</td><td>${movie.body.primaryData.lastSalePrice}</td></tr>
	<tr><td>Last Trade</td><td>${movie.body.primaryData.lastTradeTimestamp}</td></tr>
	<tr><td>Net Change</td><td>${movie.body.primaryData.netChange}</td></tr>
	<tr><td>$ageChange</td><td>${movie.body.primaryData.percentageChange}</td></tr>
	<tr><td>Volume</td><td>${movie.body.primaryData.volume}</td></tr>
`;

// assetClass: "STOCKS"
// 			companyName: "Microsoft Corporation Common Stock"
// exchange: "NASDAQ-GS"
// keyStats:
// 	dayrange: {label: "High/Low:", value: "NA"}
// 			fiftyTwoWeekHighLow: {label: "52 Week Range:", value: "344.79 - 500.76"}
// marketStatus: "Closed"
// primaryData: Object
// 	askPrice: "N/A"
// 	askSize: "N/A"
// 	bidPrice: "N/A"
// 	bidSize: "N/A"
// 	currency: null
// 	deltaIndicator: "down"
// 	isRealTime: false
// 	lastSalePrice: "$496.62"
// 	lastTradeTimestamp: "Jul 9, 2025"
// 	netChange: "-1.10"
// 	percentageChange: "-0.22%"
// 	volume: "11,846,586"
// secondaryData: null
// stockType: "Common Stock"
// symbol: "MSFT"
}
function setKey() { theKey = getKey(); }
