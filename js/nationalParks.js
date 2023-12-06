	let card = document.getElementById('card');
	let park = document.getElementById('park');
	document.getElementById('search').addEventListener('click', findParks);
    document.getElementById("alerts").addEventListener("click", closeModal);

    let key1 = 'g56CN1WcTJ7QfTf6FTk';
    let key2 = 'DH14cCgeeT0UPFLlXubUr';
    let key  = key1 + key2;

	let row = 0;
    let carouselList = [];

    function findParks() {
        let list = park.value;
        let URL = `https://developer.nps.gov/api/v1/parks?parkCode=${list}&api_key=${key}`;
    
        //  https://www.nps.gov/subjects/developer/api-documentation.htm
        fetch(URL)
            .then(resp => {
                resp.headers.forEach((value, key) => console.log(`${key} ==> ${value}`));
                return resp.json();
            })          //  wait for the response and convert it to JSON
            .then(parks => {
                card.innerHTML = '';
                parks.data.forEach(park => {
                    card.appendChild( buildCard(park) );
                    document.getElementById( `alert-${park.id}`).addEventListener('click', showAlerts);
                    document.getElementById(`webcam-${park.id}`).addEventListener('click', showWebcam);
                });
                parks.data.forEach((park) => {
                    carouselList[park.id] = new Carousel(park.id);
                });
            });
    }
        
    function buildCard(park) {
        row++;

        let parkTemplate = document.getElementById('parkTemplate');
		const pNode      = parkTemplate.content.cloneNode(true);
        const parkId     = pNode.querySelector('#parkId');
        const url        = pNode.querySelector('#url');
        const fullName   = pNode.querySelector('#fullName');
        const desc       = pNode.querySelector('#description');
        const carousel   = pNode.querySelector('#carousel');
        const alert      = pNode.querySelector('#alert');
        const webcam     = pNode.querySelector('#webcam');

        parkId.id           = `${park.id}`;
        parkId.className   += ` w3-theme-${row%10>5?"l":"d"}${(row%5)+1}`;
        url.href            = park.url;
        fullName.innerText  = park.fullName;
        desc.innerText      = park.description;
        alert.id            = `alert-${park.id}`;
        alert.name          = park.name;
        webcam.id           = `webcam-${park.id}`;
        webcam.name         = park.name;
        
        let cNode = buildCarousel(park);

        carousel.appendChild(cNode);
        return pNode;
    }

    function buildCarousel(park) {
        let carouselTemplate = document.getElementById('carouselTemplate');
        const cNode  = carouselTemplate.content.cloneNode(true);

        const images = cNode.querySelector('#images');
        const dots   = cNode.querySelector('#dots');
        const prev   = cNode.querySelector('#prev');
        const next   = cNode.querySelector('#next');
        
        images.id    = `images-${park.id}`
        dots.id      =   `dots-${park.id}`
        next.name    = park.id;
        prev.name    = park.id;

        park.images.forEach((img, idx, arr) => {
            let imageTemplate    = document.getElementById('imageTemplate');
            const iNode   = imageTemplate.content.cloneNode(true);
            
            const car     = iNode.querySelector('#carousel');
            const num     = iNode.querySelector('#numberText');
            const image   = iNode.querySelector('#image');
            const caption = iNode.querySelector('#caption');
    
            car.className += ` mySlides-${park.id}`;
            num.innerHTML = `${idx+1} / ${arr.length}`;
            image.src = `${img.url}`;
            image.alt = `${img.altText}`;
            caption.innerHTML = `${img.caption}`;
            images.appendChild(iNode);
        });

        for ( let idx = 0; idx < park.images.length; idx++) {
            dots.innerHTML += `<span class='dot dots-${park.id}' onclick="currentSlide(${idx}, '${park.id}')"></span>`;
        }
        return cNode;
    }

    class Carousel {
        constructor(id) {
            this.id = id;
            this.slideIndex = 0;
            this.showSlides(this.slideIndex);
        }
          
        showSlides(n) {
            let i;
            let slides = document.getElementsByClassName(`mySlides-${this.id}`);
            let dots   = document.getElementsByClassName(    `dots-${this.id}`);
            if (n == slides.length) this.slideIndex = 0;
            if (n < 0)              this.slideIndex = slides.length-1;
            for (i = 0; i < slides.length; i++) {
              slides[i].style.display = "none";  
              dots[i].className = dots[i].className.replace(" active", "");
            }
            slides[this.slideIndex].style.display = "block";  
            dots[this.slideIndex].className += " active";
        }
    }

function nextSlides(evt) {
    let carousel = carouselList[evt.name];
    carousel.showSlides(carousel.slideIndex += 1);
}
    
function prevSlides(evt) {
    let carousel = carouselList[evt.name];
    carousel.showSlides(carousel.slideIndex -= 1);
}
        
function currentSlide(n, parkId) {
    let carousel = carouselList[parkId];
    carousel.showSlides(carousel.slideIndex = n);
}

function showAlerts(evt) {
    let code = evt.target.name;
    let URL = `https://developer.nps.gov/api/v1/alerts?parkCode=${code}&api_key=${key}`;
    callAPI(URL, listAlerts, code);
}
function showWebcam(evt) {
    let code = evt.target.name;
    let URL = `https://developer.nps.gov/api/v1/webcams?parkCode=${code}&api_key=${key}`;
    callAPI(URL, listAlerts, code);
}

function callAPI(URL, render, code) {
    fetch(URL)
        .then(resp => resp.json())          //  wait for the response and convert it to JSON
        .then(parks => { render(code, parks); });
}

function closeModal() {
    document.getElementById('alerts').style.display='none';
}

//      Does double duty for webcams and alerts
function listAlerts(code, list) {
    document.getElementById('alerts').style.display = 'block';
    let rows = document.getElementById("rows");
    rows.innerHTML = '';
    let rowCnt = 0;
    list.data.forEach((alert) => {
      rowCnt++;
      rows.innerHTML += `
      <tr class="w3-theme-${rowCnt % 2 > 0 ? 'l4' : 'd1'}">
        <td><a href='${alert.url}'>${alert.title}</a></td>
        <td>${alert.description}</td>
        <td>${alert.category??alert.isStreaming}</td>
      </tr>`;
    });
    document.getElementById("parkName").innerText = code;
    document.getElementById("details").innerHTML = `<p>later</p>`;
}
