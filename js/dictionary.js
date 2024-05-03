let search = document.getElementById('search');
search.addEventListener('click', wordSearch);

async function  wordSearch() {
    let word = document.getElementById('wordSearch').value;

    fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${keyDictionary}`)
        .then(response => response.json())
        .then(response => show(response))
        .catch(err => console.error(err));
}

function show(word) {
    let tableBody = document.getElementById('list');
    tableBody.innerHTML = '';
    let color = 0;

    for (let w of word) {
        let row = `<tr class="w3-theme-${color%2>0?'l2':'l3'}">`;
        color++;
    
        try {
            row += `<td>${w.date}<br>
            ${(w.fl === undefined) ? '' : w.fl}<br>
            ${(w.et === undefined) ? '' : w.et[0][1]}</td>`;
            let td ='';

            td ='<td>';
            if (w.dros !== undefined) {
                if (w.dros.length > 10) {
                    td += '<select>';
                    for(let d of w.dros) {
                        td +=`<option>${d.drp}: ${d.def[0].sseq[0][0][1].dt[0][1]}</option>`
                    }
                    td += '</select>';
                }
                else {
                    for(let d of w.dros)    td +=`${d.drp}: ${d.def[0].sseq[0][0][1].dt[0][1]}<br>`
                }
            }
            row += td+'</td>';
            td ='<td>';
            if (w.meta.stems !== undefined) {
                if (w.meta.stems.length > 10) {
                    td += '<select>';
                    for(let s of w.meta.stems)  td +=`<option>${s}</option>`
                    td += '</select>';
                } else {
                    for(let s of w.meta.stems)  td +=`${s}<br>`
                }
            }
            row += td+'</td>';
            
            td ='<td>';
            for(let sd of w.shortdef)
                td += `${sd}<br>`
            row += td+'</td>';
            
            td ='<td>';
            if (w.def !== undefined) {
                for(let d of w.def) {
                    td += (d.vd === undefined) ? '' : `${d.vd}:<br>`
                    for(let s of d.sseq[0])
                        td += `${s[1].dt[0][1]} ${(s[1].dt[1] === undefined) ? '' : s[1].dt[1][1].t}<br>`
                }
            }
            row += td+'</td>';
            row = row
                .replaceAll('{bc}','')
                .replaceAll('{it}','<em>')
                .replaceAll('{/it}','</em>')
                .replaceAll('{ds||t|1|}','')
                .replaceAll('{ds||1||}','')
                .replaceAll('{ds||1|a|}','')
                .replaceAll('{ds||1||}','')
                .replaceAll('{ds|i|1','')
                .replaceAll('{sx|','')
                .replaceAll('||}',"");
            tableBody.innerHTML += row+'</tr>';
        }
        catch (exception) {
            console.log('stopped')
            console.log(exception)
            tableBody.innerHTML += row+`</tr><tr>${exception}</tr>`;
        }
    }
}
