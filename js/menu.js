let menu = document.getElementById('menu');
let menuOptions = [
    {link: 'index.html', text: '   '},
    {link: 'index.html', text: 'Examples'},
    {link: 'coins.html', text: 'Crypto'},
    {link: 'allCoins.html', text: 'Crypto Currency'},
    {link: 'covid19.html', text: 'COVID'},
    {link: 'books.html', text: 'Books'},
    {link: 'baseball.html', text: 'Baseball'},
    {link: 'basketball.html', text: 'Basketball'},
    {link: 'stars.html', text: 'Stars'},
    {link: 'weather.html', text: 'Weather'},
    {link: 'churchStats.html', text: 'Stats'}
];

for ( {link, text} of menuOptions) {
    menu.innerHTML += `
        <a id="${text}" href="${link}" class="w3-bar-item w3-button tabs">${text}</a>`;
}

function makeMeActive(tabName) {
    let tabs = document.getElementsByClassName('tabs');
    for (let tab of tabs) {
        tab.className = tab.className.replace(" w3-dark-grey", "");
    }
    document.getElementById(tabName).className += " w3-dark-grey";
}