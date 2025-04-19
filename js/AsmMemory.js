import {getRandomInt, setSeed} from './utils.js';
import {getList, getTeams} from './AsmMemoryData.js';

    let     basketball  = getList();

    let     fetch, cache, mainMemory;
    let     step, cacheBlk;
    let     binary      = false;
    let     tagBits     = 2;
    let     indexBits   = 3;
    let     blockBits   = 6;
    let     totalHits   = 0;
    let     totalMisses = 0;
    let     instCnt     = 40;
    let     max         = Math.pow(2,tagBits + indexBits + blockBits) - 1;
    
    let     setTeams    = document.getElementById('teams');
    let     hitMiss     = document.getElementById('hitMiss');
    let     bodyCache   = document.getElementById('cache');
    let     body        = document.getElementById('mem');
    let     pc          = document.getElementById('PC');
    let     studentID   = document.getElementById('studentID');
    let     checkList   = document.getElementById('teamsList');

    document.getElementById('step')      .addEventListener('click', nextStep);
    document.getElementById('reset')     .addEventListener('click', reset);
    document.getElementById('clear')     .addEventListener('click', clearCache);
    document.getElementById('sortTag')   .addEventListener('click', sortTag);
    document.getElementById('sortIndex') .addEventListener('click', sortIndex);
    document.getElementById('showMemory').addEventListener('click', showMainMemory);

    document.getElementById('tagBits')  .value = tagBits;
    document.getElementById('indexBits').value = indexBits;
    document.getElementById('blockBits').value = blockBits;
    document.getElementById('fetchCnt') .value = instCnt;
 
    let     teamSet = getTeams();
    for (let t of teamSet) {
        setTeams.innerHTML += `<li><input type='checkbox' value='${t}' />${t}</li>`;
    }

    checkList.getElementsByClassName('anchor')[0].addEventListener('click', (e) => {
        if (checkList.classList.contains('visible'))
            checkList.classList.remove('visible');
        else
            checkList.classList.add('visible');
    });
    reset();

function rebuildMainMemory() {
    let key;

    mainMemory  = {};
    for (let b of fetch) {
        key = `${b.tag} ${b.cacheIndex}`;
        if ( ! mainMemory[key])     mainMemory[key] = [];            
        mainMemory[key].push(b);

        key = `${b.bintag} ${b.cacheIndex}`;
        if ( ! mainMemory[key])     mainMemory[key] = [];    
        mainMemory[key].push(b);
    }
}

function reset() {
    fetch       = [ ];
    cache       = [ ];
    step        = -1;
    cacheBlk    = -1;
    pc.value    = 0;
    totalHits   = 0;
    totalMisses = 0;

    let id = studentID.value;
    setSeed( (id.length > 0) ? "."+id : -1 );

    binary      = document.getElementsByName('source')[0].checked;
    tagBits     = +document.getElementById('tagBits').value;
    indexBits   = +document.getElementById('indexBits').value;
    blockBits   = +document.getElementById('blockBits').value;
    instCnt     = +document.getElementById('fetchCnt').value;

    showCacheData();                //  status on the cache overhead
    
    let teams = document.querySelectorAll('input[type=checkbox]:checked');
    teams = Array.from(teams);
    teams = teams.map(t => t.value);
    basketball  = getList(teams);

    //  randomly create the addresses with their tag and index bits
    for (let i = 0; i < instCnt; i++) {
        let b     = basketball[getRandomInt(basketball.length)];
        let rnd   = getRandomInt(max);      //  both versions use the same random number
        let bintag = ('0'.repeat(tagBits)+rnd.toString(2)).slice(0-tagBits);
        let index = ("0".repeat(indexBits)+((+b.index).toString(2))).slice(0-indexBits);
        let offset = (("0".repeat(blockBits))+((+b.index).toString(2))).slice(0-blockBits)+ " - " +b.index;
        fetch.push({pc: `${i}`, 
                    bintag    : bintag,        //  random tag
                    tag       : b.tag,         //  team name
                    cacheIndex: index,         //  cache index from jersey number
                    index     : b.index,       //  player number
                    offset    : offset,        //  binary jersey number - jersey number
                    value     : b.value });    //  player name
    }

    createInstructionTable();
    clearCache();
    rebuildMainMemory();
}

function nextStep() {
    binary   = document.getElementsByName('source')[0].checked;

    let pcRow, cacheRow;
    if (step >= 0) {
        pcRow = document.getElementById('tr-'+(step+1));
        if(pcRow) 
            pcRow.classList.remove('next');

        pcRow = document.getElementById('tr-'+step);
        pcRow.classList.remove('current');
        let scrollOn = document.getElementById('scrollOn').checked;
        if (scrollOn)
            pcRow.scrollIntoView({ behavior: 'auto', block: 'start', inline: 'start' });
    }
    step = +pc.value;
    pc.value = step + 1;

    if (cacheBlk >= 0) {
        cacheRow = document.getElementById('cache-'+cacheBlk);
        cacheRow.classList.remove('current');
    }
    if (step >= instCnt)
        return;

    pcRow = document.getElementById('tr-'+step);
    pcRow.classList.add('current');
    pcRow = document.getElementById('tr-'+(step+1));    
    if (pcRow) 
        pcRow.classList.add('next');

    let block = cache.filter(c => c.index === fetch[step].cacheIndex)[0];
    cacheBlk = block.blockNum;

    cacheRow = document.getElementById(block.index+'.tag');
    cacheRow.classList.remove('Hit');
    cacheRow = document.getElementById('cache-'+cacheBlk);
    cacheRow.classList.remove('next');
    cacheRow.classList.add('current');

    if (block.tag === fetch[step].tag) {
        block.hit = 'Hit';
        totalHits++;
        document.getElementById('tr-'+step).classList.add(block.hit);
    } else {
        document.getElementById(fetch[step].cacheIndex+'.tag').innerText = fetch[step].tag;
        block.tag = fetch[step].tag;
        block.hit = 'Miss';
        totalMisses++;
    }
    hitMiss.innerText = `H: ${totalHits}/M: ${totalMisses}`;

    let value = document.getElementById(fetch[step].cacheIndex+'.value');
    let adrsOnly = document.getElementById('adrsOnly').checked;
    if (block.hit == 'Miss') {
        let rowInfo = createSpan(fetch[step], adrsOnly);
        value.innerHTML = rowInfo;
    }
    block.value = fetch[step].value;
    document.getElementById(fetch[step].cacheIndex+'.hit').innerText = block.hit + ' ' + step;
    document.getElementById(fetch[step].cacheIndex+'.hit').className = block.hit;
    try {
        document.getElementById((fetch[step].cacheIndex+fetch[step].value).replaceAll(' ','-')).className = 'found';
} catch (e) {
    console.log('Error: ', e);
    console.log('Index: ', fetch[step]);
}
    if (step+1 < instCnt) {
        let nextCacheRow = cache.filter( c => c.index === fetch[step+1].cacheIndex)[0];
        cacheRow = document.getElementById('cache-'+nextCacheRow.blockNum);
        cacheRow.classList.add('next');
        if (nextCacheRow.tag === fetch[step+1].tag) {
            cacheRow = document.getElementById(nextCacheRow.index+'.tag');
            cacheRow.classList.add('Hit');
        }
    }
}

function createSpan(req, adrsOnly) {
    let rowInfo;
    let block = mainMemory[req.tag+' '+req.cacheIndex].map(b => {
        rowInfo = b.index + ((adrsOnly) ?' '+b.value : '');
        return `<span id=${(b.cacheIndex + b.value).replaceAll(' ','-')}>${rowInfo}</span>`;
    });
    return block.join();
}

//  showMainMemory() - show the main memory blocks
export function showMainMemory() {
    let list, tag1, tag2, index;

    let memoryBlocks = document.getElementById('memoryBlocks');
    binary   = document.getElementsByName('source')[0].checked;
  
    memoryBlocks.innerHTML = '';

    if (binary) {
        for ( let key in mainMemory ) {
            if (key.split(' ').length == 2) {
                [tag1, index] = key.split(' ');

                let players = mainMemory[key].map( b => `${b.offset} ${b.value}`);
                players = players.join(', ');
                list = `<tr>
                    <td class='tag'>${tag1}</td>
                    <td class='index'>${index}</td>
                    <td class='offset'>${players}</td>
                </tr>`;
                memoryBlocks.innerHTML += list;
            }
        }
    } else {
        for ( let key in mainMemory ) {
            if (key.split(' ').length == 3) {
                [tag1, tag2, index] = key.split(' ');

                let players = mainMemory[key].map( b => `${b.index} ${b.value}`);
                players = players.join(', ');

                list = `<tr>
                    <td class='tag'>${tag1} ${tag2}</td>
                    <td class='index'>${index}</td>
                    <td class='offset'>${players}</td>
                </tr>`;
                memoryBlocks.innerHTML += list;
            }
        }
    }
}

function createInstructionTable() {
    //  create the table for memory addresses to fetch
    body.innerHTML = '';
    for (let i = 0; i < fetch.length; i++) {
        let inner = `<tr id=tr-${i}>
            <td class='step'  >${i}</td>
            <td class='tag'   >${binary ? fetch[i].bintag : fetch[i].tag}</td>
            <td class='index' >${fetch[i].cacheIndex}</td>
            <td class='offset'>${binary ? fetch[i].offset : fetch[i].index}</td>
            <td>${fetch[i].value}</td>
        </tr>`;
        body.innerHTML += inner;
    }
}

function sortTag(e) {
    let dir = (e.target.classList == 'ATOZ') ? 1 : -1
    if (binary)
        fetch.sort((a, b) => a.bintag.localeCompare(b.bintag) * dir);
    else
        fetch.sort((a, b) => a.tag.localeCompare(b.tag) * dir);
    createInstructionTable();
}

function sortIndex(e) {
    let dir = (e.target.classList == 'ATOZ') ? 1 : -1
    fetch.sort((a, b) => (+a.cacheIndex - +b.cacheIndex) * dir);
    createInstructionTable();
}

function showCacheData() { 
    let     bitsPerBlock;

    tagBits   = +document.getElementById('tagBits').value;
    blockBits = +document.getElementById('blockBits').value;
    
    bitsPerBlock = Math.pow(2, blockBits) * 8;
    document.getElementById('bitsPerBlock') .innerText = bitsPerBlock;
    document.getElementById('bitsPerOffset').innerText = blockBits;
    document.getElementById('totalBits')    .innerText = tagBits + bitsPerBlock + 1;
    document.getElementById('overhead')     .innerText = (((tagBits + 1)/bitsPerBlock)*100).toFixed(2) + ' %';
}

function clearCache() {
    let pcRow;
    cache = [];

    let numBlocks     = Math.pow(2, indexBits);
    hitMiss.innerText = 'H: 0/M: 0';
    bodyCache.innerHTML = '';
    for (let i = 0; i < numBlocks; i++) {
        let index = '0'.repeat(indexBits)+Number(i).toString(2);
        index = index.slice(0-indexBits);
        cache.push({blockNum: `${i}`, index:`${index}`, tag:'', value:'', hit:''});

        //  create the table for the cache
        let inner = `<tr id=cache-${i}>
            <td class='tag' id=${index}.tag></td>
            <td class='index' id=${index}.index>${index}</td>
            <td class='offset' id=${index}.value></td>
            <td id=${index}.hit></td>
        </tr>`;
        bodyCache.innerHTML += inner;
    }

    //  remove all formatting from instruction table
    for (let f = 0; f < fetch.length; f++) {
        pcRow = document.getElementById('tr-'+f);
        pcRow.className = '';
    }

    pc.value = 0;
    step     = 0;
    pcRow    = document.getElementById('tr-0');
    // pcRow.scrollIntoView({ behavior: 'auto', block: 'start', inline: 'start' });
}
