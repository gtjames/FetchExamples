document.getElementById('getChurchStats').addEventListener('click', getChurchStats);
//  the button was pushed. so make request for the Nearby Stars
function getChurchStats() {
    let url = "https://en.wikipedia.org/wiki/The_Church_of_Jesus_Christ_of_Latter-day_Saints_membership_statistics";
    fetch(url)
        .then(resp => resp.text())
        .then(html => {
            // Initialize the DOM parser
            let parser = new DOMParser();

            // Parse the text
            let doc = parser.parseFromString(html, "text/html");

            // You can now even select part of that html as you would in the regular DOM
            // Example:
            let tbody =  doc.getElementsByTagName('tbody');
            //  this retrieves ALL table bodies. We only care about the first one tbody[1]
            dataByCongregations (Array.from(tbody[1].getElementsByTagName('tr')), document.getElementById('congregations') )
            dataByGrowth        (Array.from(tbody[2].getElementsByTagName('tr')), document.getElementById('growth') )
            document.getElementById('url').href = url;
        })
        .catch(err => console.error(err) );
}

function dataByCongregations(rows, table) {
    rows.shift();       //  remove the header row
    rows.shift();       //  remove the header row
    let innerHTML = rows.reduce( (accum, tr) => accum + buildStat(Array.from(tr.children)), "");
    table.innerHTML = innerHTML;
}

function dataByGrowth(rows, table) {
    rows.shift();       //  remove the header row
    let innerHTML = rows.reduce( (accum, tr) => accum + buildStat(Array.from(tr.children)), "");
    table.innerHTML = innerHTML;    
}

let rowCnt = 0;         //  this variable lets me set the style of the row
function buildStat(row) {
    rowCnt++;           //  if the row is odd I use the light2 style dark3 style for even
    let td = row.reduce( (accum, cell) => accum + `<td>${cell.innerText}</td>`, "");
    return `<tr id='${row[0].innerText}' class="t3-theme-${rowCnt % 2 > 0 ? 'l2' : 'd3'}">${td}</tr>`;
}
