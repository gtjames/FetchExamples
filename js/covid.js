let country = document.getElementById('country');
country.addEventListener('blur', selectCountry);

document.getElementById('getStats').addEventListener('click', getStats);

function selectCountry() {
    let row = document.getElementById(this.value);
    row.classList.toggle('selected');
}

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
            console.table(covid);
            let table = document.getElementById('countries');

            covid.world_total.country_name = 'The World';
            covid.world_total.cases = covid.world_total.total_cases;
            covid.world_total.deaths = covid.world_total.total_deaths;
            covid.world_total.total_tests = "";
            covid.world_total.tests_per_1m_population = "";

            table.innerHTML = buildRow(covid.world_total);

            let innerHtml = '';
            for (const country of covid.countries_stat) {
                innerHtml += buildRow(country);
            }
            table.innerHTML += innerHtml;

        }).catch(err => {
            console.error(err);
        });
}

function buildRow(country) {
    return `
<tr id='${country.country_name}'>
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