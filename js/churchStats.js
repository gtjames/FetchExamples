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
            //  this retrieves ALL table bodies. We only care about the first one tbody[0]
            let rows = Array.from(tbody[2].getElementsByTagName('tr'));
            //            rows.forEach(tr => console.log(tr))
            rows.shift();       //  remove the header row
            let innerHTML = rows.reduce( (accum, tr) => accum + buildStat(Array.from(tr.children)), "");

            let table = document.getElementById('countries');
            table.innerHTML = innerHTML;
            document.getElementById('url').href = url;
        })
        .catch(err => console.error(err) );
}
let rowCnt = 0;
function buildStat(row) {
    rowCnt++;
    let td = row.reduce( (accum, cell) => accum + `<td>${cell.innerText}</td>`, "");
    return `<tr id='${row[0].innerText}' class="t3-theme-${rowCnt % 2 > 0 ? 'l2' : 'd3'}">${td}</tr>`;
}
