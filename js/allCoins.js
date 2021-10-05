const urlAllCoins = "https://api.coinlore.net/api/tickers/?start=0&limit=100";
const tbody = document.getElementById("tbody");

fetch(urlAllCoins)
.then((response) => response.json())
.then((jsObject) =>{
  for(let i = 0; i < jsObject.data.length ;i++){

    //create elements
    let tr = document.createElement('tr');
    let rank = document.createElement('th');
    let icon = document.createElement('td');
    let coin = document.createElement('td');
    let price = document.createElement('td');
    let marketCap = document.createElement('td');
    let oneH = document.createElement('td');
    let tfourH = document.createElement('td');
    let link = document.createElement('td');
    let modal = document.createElement('div');

    //assign values
    rank.innerHTML = `<th scope="row">${jsObject.data[i].rank}</th>`;
    icon.innerHTML = `<td><img src="https://c1.coinlore.com/img/25x25/${jsObject.data[i].nameid}.png" alt="${jsObject.data[i].nameid}" style="width:30px;"></td>`;
    coin.innerHTML =  `<td>${jsObject.data[i].name}</td>`;
    price.innerHTML =  `<td>$ ${jsObject.data[i].price_usd}</td>`;
    marketCap.innerHTML =  `<td>$ ${parseInt(jsObject.data[i].market_cap_usd)}</td>`;
    if (parseFloat(jsObject.data[i].percent_change_1h) >= 0.0) {
      oneH.innerHTML = `<td><span class="badge text-success">${jsObject.data[i].percent_change_1h}%</td>`;
    } else {
      oneH.innerHTML = `<td><span class="badge text-danger">${jsObject.data[i].percent_change_1h}%</td>`;
    }
    if (parseFloat(jsObject.data[i].percent_change_24h) >= 0.0) {
      tfourH.innerHTML = `<td><span class="badge text-success">${jsObject.data[i].percent_change_24h}%</td>`;
    } else {
      tfourH.innerHTML = `<td><span class="badge text-danger">${jsObject.data[i].percent_change_24h}%</td>`;
    }
    link.innerHTML =  `<td><a class="btn btn-info btn-sm" data-toggle="modal" data-target="#staticBackdrop-${jsObject.data[i].rank}">More</a></td>`;

    //modal
    modal.innerHTML =
    `
    <div class="modal fade" id="staticBackdrop-${jsObject.data[i].rank}" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <img src="https://c1.coinlore.com/img/25x25/${jsObject.data[i].nameid}.png" alt="${jsObject.data[i].nameid}"  class="m-1">
            <h5 class="modal-title" >${jsObject.data[i].name}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <ul "list-group">
              <li class="list-group-item d-flex justify-content-between align-items-center list-group-item-info">
                Symbol:
                <span class="badge">${jsObject.data[i].symbol}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center list-group-item-info">
                Name:
                <span class="badge">${jsObject.data[i].name}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center list-group-item-info">
                Price in USD:
                <span class="badge">$ ${jsObject.data[i].price_usd}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center list-group-item-info">
                Change in 1H:
                <span class="badge">${jsObject.data[i].percent_change_1h} %</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center list-group-item-info">
                Change in 24H:
                <span class="badge">${jsObject.data[i].percent_change_24h} %</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center list-group-item-info">
                Change in 7D:
                <span class="badge">${jsObject.data[i].percent_change_7d} %</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center list-group-item-info">
                Price in BTC:
                <span class="badge">${jsObject.data[i].price_btc} BTC</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center list-group-item-info">
                Market Cap:
                <span class="badge">$ ${jsObject.data[i].market_cap_usd}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center list-group-item-info">
                Volume 24H:
                <span class="badge">$ ${jsObject.data[i].volume24.toFixed(2)}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center list-group-item-info">
                Circulating Supply:
                <span class="badge">${jsObject.data[i].csupply}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center list-group-item-info">
                Total Supply:
                <span class="badge">${jsObject.data[i].tsupply}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center list-group-item-info">
                Max Supply:
                <span class="badge">${jsObject.data[i].msupply}</span>
              </li>
            </ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    `;

    //adding modals to its wrapper
    document.getElementById("modals").appendChild(modal);

    //add elements to tr
    tr.appendChild(rank);
    tr.appendChild(icon);
    tr.appendChild(coin);
    tr.appendChild(price);
    tr.appendChild(marketCap);
    tr.appendChild(oneH);
    tr.appendChild(tfourH);
    tr.appendChild(link);
    

    //add tr to tbody
    tbody.appendChild(tr);
  }
})
.catch(function(err) {
  console.log('Fetch Error :', err);
});