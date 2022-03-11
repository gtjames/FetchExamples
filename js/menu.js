//  dynamically create the whole menu bar including the theme drop down
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
    {link: 'Volcanoes.html', text: 'Volcanoes'},
    {link: 'disney.html', text: 'Disney'},
    {link: 'churchStats.html', text: 'Stats'},
    {link: 'translate.html', text: 'Translate'},
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
        <option value='blue'>blue</option>
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

//  get the ref to the CSS link for the theme
let css = document.getElementById('css');

//  get the ref to the theme drop down list
let theme = document.getElementById('theme');

let activeTab = document.title;

let themeColor = localStorage.getItem(activeTab);
if ( themeColor !== null)
    css.href = `https://www.w3schools.com/lib/w3-theme-${themeColor}.css`

//  Find the current theme color of the css for the page
    //  it is the text after w3-theme- and before the .css
let choice = css.href.split("w3-theme-")[1].split('.css')[0];
    //  yes we are being cheap here. We will just add a new option
    //  to the list of color themes and put the current theme at the top of the list
    //  this is faster than finding the color theme in the list and making it the selected item
theme.innerHTML = `<option value='${choice}'>${choice}</option>${theme.innerHTML}`;
    
    //  add an event listener to the drop down list
    //  when the list changes alter the css.href to be the new color theme from the drop down
theme.addEventListener('change', () => {
    css.href = `https://www.w3schools.com/lib/w3-theme-${theme.value}.css`
    localStorage.setItem(activeTab, theme.value);
} );

    //  This will change the tab color to dark grey to indicate it is the active tab
    //  first of all it will find any tab with the dark-grey class and remove it from that tab
function makeMeActive(tabName) {
    let tabs = document.getElementsByClassName('tabs');
    for (let tab of tabs) {
        tab.className = tab.className.replace(" w3-dark-grey", "");
    }
    activeTab = tabName;
    document.getElementById(tabName).className += " w3-dark-grey";
}