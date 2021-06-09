let menu = document.getElementById('menu');
let menuOptions = [
    {link: 'coins.html', text: 'Crypto'},
    {link: 'allCoins.html', text: 'Crypto Currency'},
    {link: 'covid19.html', text: 'COVID 19'},
    {link: 'realEstate.html', text: 'Real Estate'},
    {link: 'smithsonian.html', text: 'Smithsonian'},
    {link: 'books.html', text: 'Books'},
    {link: 'baseball.html', text: 'Baseball'},
    {link: 'basketball.html', text: 'Basketball'},
    {link: 'stars.html', text: 'Stars'},
    {link: 'weather.html', text: 'Weather'},
    {link: 'churchStats.html', text: 'Membership Stats'}
]
for ( {link, text} of menuOptions) {
    menu.innerHTML += `
    <li class="nav-item" id="${text}" >
        <a class="nav-link" href="${link}">${text}</a>
    </li>`;
}

function makeMeActive(id) {
    document.getElementById(id).classList.toggle('active');
}