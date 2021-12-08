let menu = document.getElementById('menu');
let menuOptions = [
    {link: 'index.html', text: 'Examples'},
    {link: 'orig-allCoins.html', text: 'Orig Bit Coins'},
    {link: 'coins.html', text: 'Crypto'},
    {link: 'allCoins.html', text: 'Crypto Currency'},
    {link: 'covid19.html', text: 'COVID'},
    {link: 'books.html', text: 'Books'},
    {link: 'news.html', text: 'News'},
    {link: 'baseball.html', text: 'Baseball'},
    {link: 'basketball.html', text: 'Basketball'},
    {link: 'stars.html', text: 'Stars'},
    {link: 'weather.html', text: 'Weather'},
    {link: 'art.html', text: 'World Art'},
    {link: 'disney.html', text: 'Disney'},
    {link: 'churchStats.html', text: 'Stats'}
];

for ( {link, text} of menuOptions) {
    menu.innerHTML += `
        <a id="${text}" href="${link}" class="w3-bar-item w3-button tabs">${text}</a>`;
}

menu.innerHTML += `
    <select id="theme">
        <option value='red'>red</option>
        <option value='pink'>pink</option>
        <option value='purple'>purple</option>
        <option value='deep-purple'>deep-purple</option>
        <option value='indigo'>indigo</option>
        <option value='ble'>blue</option>
        <option value='light-blue'>light-blue</option>
        <option value='cyan'>cyan</option>
        <option value='teal'>teal</option>
        <option value='green'>green</option>
        <option value='light-green'>light-green</option>
        <option value='lime'>lime</option>
        <option value='khaki'>khaki</option>
        <option value='yellow'>yellow</option>
        <option value='amber'>amber</option>
        <option value='orange'>orange</option>
        <option value='deep-orange'>deep-orange</option>
        <option value='blue-grey'>blue-grey</option>
        <option value='brown'>brown</option>
        <option value='grey'>grey</option>
        <option value='dark-grey'>dark-grey</option>
        <option value='black'>black</option>
        <option value='w3schools'>w3schools</option>
    </select>
    `;

let css = document.getElementById('css');
let theme = document.getElementById('theme');
theme.addEventListener('change', () => css.href = `https://www.w3schools.com/lib/w3-theme-${theme.value}.css` );

function makeMeActive(tabName) {
    let tabs = document.getElementsByClassName('tabs');
    for (let tab of tabs) {
        tab.className = tab.className.replace(" w3-dark-grey", "");
    }
    document.getElementById(tabName).className += " w3-dark-grey";
}