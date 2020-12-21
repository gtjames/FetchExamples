import * as DOM from "./dom.js";

//Api url of global information
const urlApi_global = "https://api.coinlore.net/api/global/";

//Api url of top10 information
const urlApi_topTen = "https://api.coinlore.net/api/tickers/?start=0&limit=10";

function showGoblobalResume() {
  //fetch API for global info
  fetch(urlApi_global)
  .then((response) => response.json())
  .then((jsObject) =>{
    //assigning values
    cryptos.innerHTML = jsObject[0].coins_count;
    activeMarkets.innerHTML = jsObject[0].active_markets;
    marketCap.innerHTML = "$ " + jsObject[0].total_mcap.toFixed(2);
    marketCapChange.innerHTML = jsObject[0].mcap_change + " %";
    btcDominance.innerHTML = `
      <div class="progress-bar progress-bar-striped progress-bar-animated bg-warning" role="progressbar" style="width: ${jsObject[0].btc_d}%;" aria-valuenow="${jsObject[0].btc_d}" aria-valuemin="0" aria-valuemax="100">
        <span class="font-weight-bold" style="color: #fff; font-size:1.1em">${jsObject[0].btc_d}%</span>
      </div>
    `;
    ethDominance.innerHTML = `
    <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: ${jsObject[0].eth_d}%;" aria-valuenow="${jsObject[0].eth_d}" aria-valuemin="0" aria-valuemax="100">
      <span  style="color: #fff;">${jsObject[0].eth_d}%</span>
    </div>
  `;
    avgPriceChange.innerHTML = jsObject[0].avg_change_percent + " %";
    //adding classes if percentages are positive or negative
    if (parseFloat(jsObject[0].mcap_change) > 0) {
      marketCapChange.classList.add("badge-success");
    } else {
      marketCapChange.classList.add("badge-danger");
    }
    if (parseFloat(jsObject[0].avg_change_percent) > 0) {
      avgPriceChange.classList.add("badge-success");
    } else {
      avgPriceChange.classList.add("badge-danger");
    }
  })
  .catch(function(err) {
    console.log('Fetch Error :', err);
  });
}

function showTop10Coins(){
//fetch API for top10 info
fetch(urlApi_topTen)
  .then((response) => response.json())
  .then((jsObject) =>{
    
    for(let i = 0; i < jsObject.data.length ;i++){
      //creating elements
      let card = document.createElement('div');
      let cardRow = document.createElement('div');
      let rankCoin = document.createElement('span');
      let imageContainer = document.createElement('div');
      let cardBodyContainer = document.createElement('div');
      let cardBody = document.createElement('div');
      let imageCoin = document.createElement('img');
      let nameCoin = document.createElement('a');
      let priceCoin = document.createElement('p');
      let change_1h = document.createElement('p');
      let change_24h = document.createElement('p');
      let marketCapCoin = document.createElement('p');
      let readMoreLink = document.createElement('a');
      let modal = document.createElement('div');

      //assigning values
      cardRow.setAttribute('class', 'row no-gutters');
      rankCoin.textContent = jsObject.data[i].rank;
      rankCoin.setAttribute('class','text-muted font-weight-bolder ml-1');
      imageContainer.setAttribute('class', 'col-md-4');
      imageCoin.setAttribute('src', 'https://www.coinlore.com/img/'+ jsObject.data[i].nameid + '.png');
      imageCoin.setAttribute('alt', 'logo of '+ jsObject.data[i].nameid);
      imageCoin.setAttribute('class', 'mx-auto d-block');
      imageCoin.setAttribute('style', 'width:100px;');
      cardBodyContainer.setAttribute('class', 'col-md-8');
      cardBodyContainer.setAttribute('class', 'card-body');
      nameCoin.innerHTML = `<a href="#" class="font-weight-bolder">${jsObject.data[i].name}</a>`;
      nameCoin.setAttribute('style', 'font-size:2em');
      priceCoin.innerHTML = `<p>Actual Price: <span class="badge badge-primary">$ ${jsObject.data[i].price_usd}</span></p>`;
      //adding classes if percentages are positive or negative
      if (parseFloat(jsObject.data[i].percent_change_1h) >= 0.0) {
        change_1h.innerHTML = `<p>1h: <span class="badge badge-success">${jsObject.data[i].percent_change_1h} %</span></p>`;
      } else {
        change_1h.innerHTML = `<p>1h: <span class="badge badge-danger">${jsObject.data[i].percent_change_1h} %</span></p>`;
      }
      if (parseFloat(jsObject.data[i].percent_change_24h) >= 0.0) {
        change_24h.innerHTML = `<p>24h: <span class="badge badge-success">${jsObject.data[i].percent_change_24h} %</span></p>`;
      } else {
        change_24h.innerHTML = `<p>24h: <span class="badge badge-danger">${jsObject.data[i].percent_change_24h} %</span></p>`;
      }
      marketCapCoin.innerHTML = `<p>Market Cap: <span class="badge badge-primary">$ ${jsObject.data[i].market_cap_usd}</span></p>`;
      readMoreLink.innerHTML = `<a href="#" class="btn btn-info" data-toggle="modal" data-target="#staticBackdrop-${jsObject.data[i].rank}">View more</a>`;

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

      //adding image to its container
      imageContainer.appendChild(imageCoin);

      //adding elements to card body
      cardBody.appendChild(nameCoin);
      cardBody.appendChild(priceCoin);
      cardBody.appendChild(change_1h);
      cardBody.appendChild(change_24h);
      cardBody.appendChild(marketCapCoin);
      cardBody.appendChild(readMoreLink);
      cardBody.appendChild(modal);

      //adding card body to its container
      cardBodyContainer.appendChild(cardBody);

      //adding elemets to card row
      cardRow.appendChild(imageContainer);
      cardRow.appendChild(cardBodyContainer);

      //adding elements to card
      card.appendChild(rankCoin);
      card.appendChild(cardRow);
      
      //set class to cards
      card.setAttribute("class","card p-1 mb-4");
      card.setAttribute("style","width: 455px;");

      //adding cards to topCoins
      document.getElementById('topCoins').appendChild(card);
    }

  })
  .catch(function(err) {
    console.log('Fetch Error :', err);
  });
}

//export
export{showGoblobalResume,showTop10Coins};