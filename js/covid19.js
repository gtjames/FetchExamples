let country = document.getElementById('country');
country.addEventListener('blur', selectCountry);

//  this is my button to request the COVID data
document.getElementById('getStats').addEventListener('click', getStats);

//  if the country in the input field is changed lets change the background color of that countries row
function selectCountry() {
    let row = document.getElementById(this.value);
    row.classList.toggle('selected');
}

//  the button was pushed. so make request for COVID data
function getStats() {
    fetch("https://corona-virus-world-and-india-data.p.rapidapi.com/api", {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "AIxP56HptHmshgNo3oo3eXKMlJvXp13w59gjsnNT2jFu4oqvqs",
                "x-rapidapi-host": "corona-virus-world-and-india-data.p.rapidapi.com"
            }
        })
        .then(resp => resp.json())              //  wait for the response and convert it to JSON
        .then(covid => {                        //  with the resulting JSON data do something
            console.table(covid.countries_stat);
            
            //  put a break point here to look at the data coming from the COVID API

            let innerHtml = '';

            //  need a loop here to create rows for the country data on COVID
            for (const country of covid.countries_stat) {
                innerHtml += buildRow(country);
            }

            //  get a reference to our tbody in our page
            let table = document.getElementById('countries');
            table.innerHTML = innerHtml;        //  push in our created HTML text

        }).catch(err => {   console.error(err);     });
}

let r = 0;
function buildRow(country) {
    r++;
    return `
<tr class="w3-theme-${r%2?'l1':'l3'}" id='${country.country_name}'>
    <td>${country.country_name}</td>
    <td>${country.cases}</td>
    <td>${country.deaths}</td>
    <td>${country.total_recovered}</td>
    <td>${country.new_deaths}</td>
    <td>${country.new_cases}</td>
    <td>${country.serious_critical}</td>
    <td>${country.active_cases} </td>
    <td>${country.total_cases_per_1m_population}</td>
    <td>${country.deaths_per_1m_population}</td>
    <td>${country.total_tests}</td>
    <td>${country.tests_per_1m_population}</td>
</tr>`;
}