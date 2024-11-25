let keys;
if(keys = localStorage.getItem('keys')) {
    keys = JSON.parse(keys);
} else {
    fetch('/js/allKeys.json')
        .then(resp => resp.text())
        .then(resp => {
            keys = JSON.parse(resp);
            localStorage.setItem('keys', JSON.stringify(keys));
        });
}
