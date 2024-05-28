import {getRandomInt, setSeed} from './utils.js';
import {getList, getTeams} from './AsmMemoryData.js';

    let     max         = Math.pow(2,32);
    let     basketball  = getList();

    let     fetch, cache, mainMemory, mainMemoryA;
    let     step, cacheBlk;
    let     instCnt;
    let     numBlocks;
    let     binary = false;
    let     tagBits = 2;
    let     indexBits = 3;
    let     checkList = document.getElementById('teamsList');
    let     teamSet = getTeams();
    let     set = document.getElementById('teams')

    let     bodyCache   = document.getElementById('cache');
    let     body        = document.getElementById('mem');
    let     pc          = document.getElementById('PC');
    let     studentID   = document.getElementById('studentID');

    document.getElementById('step').addEventListener('click', nextStep);
    document.getElementById('reset').addEventListener('click', reset);
    document.getElementById('clear').addEventListener('click', clearCache);
    document.getElementById('sortTag').addEventListener('click', sortTag);
    document.getElementById('sortIndex').addEventListener('click', sortIndex);
    document.getElementById('showMemory').addEventListener('click', showMainMemory);

    document.getElementById('tagBits').value   = tagBits;
    document.getElementById('indexBits').value = indexBits;
    document.getElementById('fetchCnt').value  = 40;
 
    for (let t of teamSet) {
        set.innerHTML += `<li><input type='checkbox' value='${t}' />${t}</li>`;
        // set.innerHTML += `<li><input type='checkbox' value='${t}' ${set.innerHTML.length > 0 ?'checked':''} />${t}</li>`;
    }

    checkList.getElementsByClassName('anchor')[0].onclick = function(evt) {
    if (checkList.classList.contains('visible'))
        checkList.classList.remove('visible');
    else
        checkList.classList.add('visible');
    }
    reset();
    rebuildMainMemory();

function sortTag(e) {
    let dir = (e.target.classList == 'ATOZ') ? 1 : -1
    fetch.sort((a, b) => a.tag.localeCompare(b.tag) * dir);
    createInstructionTable();
}

function sortIndex(e) {
    let dir = (e.target.classList == 'ATOZ') ? 1 : -1
    fetch.sort((a, b) => (+a.index - +b.index) * dir);
    createInstructionTable();
}

function rebuildMainMemory() {
    mainMemory  = {};
    mainMemoryA = {};
    let len = 0
    if (binary) {
        for (let b of fetch) {
            if ( ! mainMemory[b.tag+' '+b.index])       mainMemory[b.tag +' '+b.index] = [];
            let value = `<span id=${(b.index + b.value).replaceAll(' ','-')}>${b.value}</span>`;
            mainMemory[b.tag+' '+b.index].push(value);
        }
    } else {
        for (let b of basketball) {
            let index = (+b.index+1024).toString(2).substr(11-indexBits);

            if ( ! mainMemory[b.tag+' '+index])         mainMemory[b.tag +' '+index] = [];
            let value = `<span id=${(index + b.value).replaceAll(' ','-')}>${b.index} ${b.value}, </span>`;
            mainMemory[b.tag+' '+index].push(value);
            if ( ! mainMemoryA[b.tag+' '+index])         mainMemoryA[b.tag +' '+index] = [];
            value = `<span id=${(index + b.value).replaceAll(' ','-')}>${b.index}, </span>`;
            mainMemoryA[b.tag+' '+index].push(value);
        }
    }
}

function showCacheData() { 
    let     bitsPerBlock;

    tagBits   = +document.getElementById('tagBits').value;
    indexBits = +document.getElementById('indexBits').value;

    bitsPerBlock = Math.pow(2, 32 - indexBits - tagBits) * 8;
    document.getElementById('bitsPerBlock').innerText = bitsPerBlock;
    document.getElementById('bitsPerOffset').innerText = 32 - tagBits - indexBits;
    document.getElementById('totalBits').innerText    = tagBits + bitsPerBlock + 1;
    document.getElementById('overhead').innerText     = (((tagBits + 1)/bitsPerBlock)*100).toFixed(2) + ' %';
}

function clearCache() {
    let pcRow;
    cache = [];
    bodyCache.innerHTML = '';
    for (let i = 0; i < numBlocks; i++) {
        let index = '0000000000000000'+Number(i).toString(2);
        index = index.substr(index.length-indexBits, indexBits);
        cache.push({blockNum: `${i}`, index:`${index}`, tag:'', value:'', hit:''});

        let inner = `<tr id=cache-${i}><td class='tag' id=${index}.tag></td><td class='index' id=${index}.index>${index}</td><td class='offset' id=${index}.value></td><td id=${index}.hit></td></tr>`;
        bodyCache.innerHTML += inner;
    }

    if (step >= 0 && step < instCnt) { 
        pcRow = document.getElementById('tr-'+(step+1));
        pcRow.classList.remove('next');

        pcRow = document.getElementById('tr-'+step);
        pcRow.classList.remove('current');
    }
    for (let f = 0; f < fetch.length; f++) {
        pcRow = document.getElementById('tr-'+f);
        pcRow.className = '';
    }
    pc.value    = 0;
    step        = 0;
    pcRow = document.getElementById('tr-0');
    pcRow.scrollIntoView({ behavior: 'auto', block: 'start', inline: 'start' });
}

function reset() {
    fetch       = [ ];
    cache       = [ ];
    step        = -1;
    cacheBlk    = -1;
    pc.value    = 0;

    let id = studentID.value;
    setSeed( (id.length > 0) ? "."+id : -1 );

    showCacheData();
    binary      = document.getElementsByName('source')[0].checked;
    tagBits     = +document.getElementById('tagBits').value;
    indexBits   = +document.getElementById('indexBits').value;
    instCnt     = +document.getElementById('fetchCnt').value;
    
    numBlocks   = Math.pow(2, indexBits);

    //  randomly create the addresses with their tag and index bits
    if (binary) {
        for (let i = 0; i < instCnt; i++) {
            let adrs = '00000000000000000000000000000000'+getRandomInt(max).toString(2);
            adrs = adrs.substring(adrs.length-32);
            let tag   = adrs.substring(0, tagBits);
            let index = adrs.substring(tagBits, tagBits + indexBits);
            let value = adrs.substring(tagBits + indexBits);
            let b     = basketball[getRandomInt(basketball.length)];
            adrs      = `<span class='offset'>${value}</span>`;         //  <span class='tag'>&ensp;${tag}&ensp;</span><span class='index'>&ensp;${index}&ensp;</span>
            fetch.push({pc: `${i}`, tag: `${tag}`, index: `${index}`, adrs: `${adrs}`, value:`${b.value}` });
        }
    } else {
        let teams = document.querySelectorAll('input[type=checkbox]:checked');
        teams = Array.from(teams);
        teams = teams.map(t => t.value);
        basketball  = getList(teams);

        for (let i = 0; i < instCnt; i++) {
            let rand = getRandomInt(basketball.length);
            let b     = basketball[rand];
            let tag   = b.tag;
            let index = (+b.index+1024).toString(2).substr(11-indexBits);
            let adrs  = b.index;
            let value = b.value;
            fetch.push({pc: `${i}`, tag: `${tag}`, index: `${index}`, adrs: `${adrs}`, value:`${value}` });
        }
    }
    createInstructionTable();
    clearCache();
    rebuildMainMemory();
}

function createInstructionTable() {
    //  create the table for memory addresses to fetch
    body.innerHTML = '';
    for (let i = 0; i < fetch.length; i++) {
        let inner = `<tr id=tr-${i}>
            <td class='step'  >${i}</td>
            <td class='tag'   >${fetch[i].tag}</td>
            <td class='index' >${fetch[i].index}</td>
            <td class='offset'>${fetch[i].adrs}</td>
            <td>${fetch[i].value}</td>
        </tr>`;
        body.innerHTML += inner;
    }
}

function nextStep() {
    let pcRow, cacheRow;
    if (step >= 0) {
        pcRow = document.getElementById('tr-'+(step+1));
        if(pcRow) pcRow.classList.remove('next');

        pcRow = document.getElementById('tr-'+step);
        pcRow.classList.remove('current');
        pcRow.scrollIntoView({ behavior: 'auto', block: 'start', inline: 'start' });
    }
    step = +pc.value;
    pc.value = step + 1;

    if (cacheBlk >= 0) {
        cacheRow = document.getElementById('cache-'+cacheBlk);
        cacheRow.classList.remove('current');
    }

    pcRow = document.getElementById('tr-'+step);
    pcRow.classList.add('current');
    pcRow = document.getElementById('tr-'+(step+1));
    if (pcRow) pcRow.classList.add('next');

    let block = cache.filter(c => c.index === fetch[step].index)[0];
    cacheBlk = block.blockNum;

    cacheRow = document.getElementById(block.index+'.tag');
    cacheRow.classList.remove('Hit');
    cacheRow = document.getElementById('cache-'+cacheBlk);
    cacheRow.classList.remove('next');
    cacheRow.classList.add('current');

    if (block.tag === fetch[step].tag) {
        block.hit = 'Hit';
        document.getElementById('tr-'+step).classList.add(block.hit);
    } else {
        document.getElementById(fetch[step].index+'.tag').innerText = fetch[step].tag;
        block.tag = fetch[step].tag;
        block.hit = 'Miss';
    }

    let value = document.getElementById(fetch[step].index+'.value');
    let adrsOnly = document.getElementById('adrsOnly').checked;
    if (block.hit == 'Miss') {
        let rowInfo;
        if (adrsOnly && ! binary)
            rowInfo = mainMemoryA[fetch[step].tag+' '+fetch[step].index].join(' ');
        else
            rowInfo = mainMemory[fetch[step].tag+' '+fetch[step].index].join(' ');
        value.innerHTML = rowInfo;
    }
    block.value = fetch[step].value;
    document.getElementById((fetch[step].index+fetch[step].value).replaceAll(' ','-')).className = 'found';

    document.getElementById(fetch[step].index+'.hit').innerText = block.hit + ' ' + step;
    document.getElementById(fetch[step].index+'.hit').className = block.hit;

    if (step+1 < instCnt) {
        let nextCacheRow = cache.filter( c => c.index === fetch[step+1].index)[0];
        cacheRow = document.getElementById('cache-'+nextCacheRow.blockNum);
        cacheRow.classList.add('next');
        if (nextCacheRow.tag === fetch[step+1].tag) {
            cacheRow = document.getElementById(nextCacheRow.index+'.tag');
            cacheRow.classList.add('Hit');
        }
    }
}

//      Does double duty for webcams and alerts
export function showMainMemory() {
  let memoryBlocks = document.getElementById('memoryBlocks');
  
  memoryBlocks.innerHTML = '';

  for ( let key in mainMemory) {
    let tag1, tag2, index;
    let start = '0'.repeat(32-tagBits-indexBits);
    let end   = '1'.repeat(32-tagBits-indexBits);
    tag2 = '';
    if(binary)
      [tag1, index] = key.split(' ');
    else
      [tag1, tag2, index] = key.split(' ');
      memoryBlocks.innerHTML += `<tr id=${key}><td class='tag'>${tag1 + ' ' + tag2}</td><td class='index'>${index}</td><td class='offset'>${mainMemory[key].join(' ')}</td></tr>`;
      //  <td> <table><tr><td>${start}</td></tr><tr><td class='offset'>${mainMemory[key]}</td></tr><tr><td>${end}</td>   </tr></table> </td></tr>`;          
  }
}
