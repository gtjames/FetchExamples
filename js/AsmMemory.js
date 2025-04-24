import {getRandomInt, setSeed} from './utils.js';
import {getList, getTeams} from './AsmMemoryData.js';

    let     basketball  = getList();

    let     fetch, cache, mainMemory;
    let     step, cacheBlk;
    let     binary      = false;
    let     random      = false;
    let     team        = false;
    let     tagBits     = 3;
    let     indexBits   = 4;
    let     blockBits   = 5;
    let     totalHits   = 0;
    let     totalMisses = 0;
    let     totalEvict  = 0;
    let     instCnt     = 20;
    let     running     = false;
    let     teamSet     = getTeams();
    
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
    document.getElementById('runSim')    .addEventListener('click', runSimulation);

    tagBits   = localStorage.getItem('tagBits'   ) || 3;
    indexBits = localStorage.getItem('indexBits' ) || 5;
    blockBits = localStorage.getItem('blockBits' ) || 12;
    instCnt   = localStorage.getItem('instCnt'   ) || 50;

    document.getElementById('tagBits')  .value = tagBits;
    document.getElementById('indexBits').value = indexBits;
    document.getElementById('blockBits').value = blockBits;
    document.getElementById('fetchCnt') .value = instCnt;

    let i=0;
    for (let t of teamSet) {
        let chkd = JSON.parse(localStorage.getItem(`${t.replaceAll(' ','-')}`))
        setTeams.innerHTML += `<li><input id=${t.replaceAll(' ','-')} type='checkbox' value='${t}'} ${chkd?'checked':''} />${t}</li>`;
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
        key = `${b.tag} ${b.binIndex}`;
        if ( ! mainMemory[key])     mainMemory[key] = [];            
        mainMemory[key].push(b);

        if (! team)   
            continue;
        //  for random and binary, the tag is the binTag
        key = `${b.binTag} ${b.binIndex}`;
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
    team        = document.getElementsByName('source')[1].checked;
    random      = document.getElementsByName('source')[2].checked;
    tagBits     = +document.getElementById('tagBits').value;
    indexBits   = +document.getElementById('indexBits').value;
    blockBits   = +document.getElementById('blockBits').value;
    instCnt     = +document.getElementById('fetchCnt').value;
    localStorage.setItem('tagBits',   tagBits);
    localStorage.setItem('indexBits', indexBits);
    localStorage.setItem('blockBits', blockBits);
    localStorage.setItem('instCnt',   instCnt);
    localStorage.setItem('team',      team);
    localStorage.setItem('binary',    binary);
    localStorage.setItem('random',    random);
    for (let t of teamSet) {
        localStorage.setItem(`${t.replaceAll(' ','-')}`, document.getElementById(t.replaceAll(' ','-')).checked);
    }

    showCacheDetails();                //  status on the cache overhead
    
    let teams = document.querySelectorAll('input[type=checkbox]:checked');
    teams = Array.from(teams);
    teams = teams.map(t => t.value);
    basketball  = getList(teams);

    let wordLen = indexBits+blockBits
    //  randomly create the addresses with their tag and index bits
    for (let i = 0; i < instCnt; i++) {
        let b        = basketball[getRandomInt(basketball.length)];
        
        let rndTag   = getRandomInt(Math.pow(2,tagBits));        //  binTag is used for binary and random
        let binTag   = ("0".repeat(tagBits)+(rndTag.toString(2))).slice(0-tagBits);

        let rnd      = getRandomInt(Math.pow(2,wordLen));        //  used only for random
        let binStr   = ("0".repeat(wordLen)+(rnd.toString(2))).slice(0-wordLen);

        let rndIndex = binStr.substring(0, indexBits);
        let rndOffset= binStr.slice(0-blockBits) + " - " + rnd;

        let binIndex =  ("0".repeat(indexBits) + ((+b.index).toString(2))).slice(0-indexBits);
        let binOffset= (("0".repeat(blockBits) + ((+b.index).toString(2))).slice(0-blockBits)) + " - " + b.index;
        //  tag: "Cavaliers",   index:	"20",  value:  "Georges Niang"
        const keyExists = fetch.some(entry =>
            entry.tag    === (team ? b.tag : binTag) &&
            entry.index  === (random ? rndIndex  : binary ? binIndex  : b.index) &&
            entry.offset === (random ? rndOffset : binary ? binOffset : b.index)
        );

        if (!keyExists) {
            fetch.push({pc: `${i}`, 
                    tag       : team   ? b.tag     : binTag,                        //  team name or binary tag
                    index     : random ? rndIndex  : binary ? binIndex  : b.index,     //  player number
                    offset    : random ? rndOffset : binary ? binOffset : b.index,     //  binary jersey number - jersey number
                    value     : b.value,                                            //  jersey number
                    binTag    : binTag,                                             //  random tag
                    binIndex  : random ? rndIndex : binIndex,                          //  cache binary index from jersey number
                    random    : rndIndex,                                           //  random number
                });
                // <td class='offset'>${binary ? fetch[i].offset : fetch[i].index}</td>
            }
    }

    createInstructionTable();
    clearCache();
    rebuildMainMemory();
}

function createInstructionTable() {
    //  create the table for memory addresses to fetch
    body.innerHTML = '';
    for (let [i, b] of fetch.entries()) {
        let inner = `<tr id=tr-${i}>
            <td class='step'  >${i}</td>
            <td class='tag'   >${binary ? b.binTag : b.tag}</td>
            <td class='index' >${b.binIndex}</td>
            <td class='offset'>${b.offset}</td>
            <td>${b.value}</td>
        </tr>`;
        body.innerHTML += inner;
    }
}

function runSimulation() {
    if (running) {
        running = false;
        return;
    }
    document.getElementById('runSim').innerText = "Running";
    let speed = document.getElementById('speed').value || 1000;

    running = true;
    const intervalId = setInterval(() => {
        nextStep();
        document.getElementById('runSim').innerText = "PC = " + step; 
        if (pc.value >= fetch.length || !running) {
            running = false;
            document.getElementById('runSim').innerText = "Run"; 
            clearInterval(intervalId);
        }
    }, speed); // runs every 1000ms (1 second)

// // Somewhere else in your code, you change the value:
// setTimeout(() => {
//   shouldRun = false;
// }, 15000); // change value after 5 seconds
}

function nextStep() {
    let pcRow, cacheRow;
    if (step >= 0) {
        pcRow = document.getElementById('tr-'+(step+1));
        if(pcRow) 
            pcRow.classList.remove('next');

        pcRow = document.getElementById('tr-'+step);
        if(pcRow) 
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
    if (step >= fetch.length)
        return;

    pcRow = document.getElementById('tr-'+step);
    pcRow.classList.add('current');
    pcRow = document.getElementById('tr-'+(step+1));    
    if (pcRow) 
        pcRow.classList.add('next');

    let block = cache.filter(c => c.index === fetch[step].binIndex)[0];
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
        document.getElementById(fetch[step].binIndex+'.tag').innerText = fetch[step].tag;
        if (block.tag.length > 0) {
            totalEvict++;
        }
        document.getElementById(block.index+'.tag').innerText = fetch[step].tag;
        block.tag = fetch[step].tag;
        block.hit = 'Miss';
        totalMisses++;
    }
    hitMiss.innerHTML = `H: ${totalHits}<br>M: ${totalMisses}<br>E: ${totalEvict}`;

    let value = document.getElementById(fetch[step].binIndex+'.value');
    let adrsOnly = document.getElementById('adrsOnly').checked;
    if (block.hit == 'Miss') {
        let rowInfo = createSpan(fetch[step], adrsOnly);
        value.innerHTML = rowInfo;
    }
    block.value = fetch[step].value;
    document.getElementById(fetch[step].binIndex+'.hit').innerText = block.hit + ' ' + step;
    document.getElementById(fetch[step].binIndex+'.hit').className = block.hit;
    document.getElementById((fetch[step].binIndex+fetch[step].value).replaceAll(' ','-')).className = 'found';

    if (step+1 < fetch.length) {
        let nextCacheRow = cache.filter( c => c.index === fetch[step+1].binIndex)[0];
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
    let block = mainMemory[req.tag+' '+req.binIndex].map(b => {
        rowInfo = b.offset + ((adrsOnly) ?' '+b.value : '');
        return `<span id=${(b.binIndex + b.value).replaceAll(' ','-')}>${rowInfo}</span>`;
    });
    return block.join();
}

//  showMainMemory() - show the main memory blocks
export function showMainMemory() {
    let list, tag1, tag2, index;
    let players;

    let memoryBlocks = document.getElementById('memoryBlocks');

    memoryBlocks.innerHTML = '';

    if (team) {
        for ( let key in mainMemory ) {
            if (key.split(' ').length == 3) {
                [tag1, tag2, index] = key.split(' ');

                players = mainMemory[key].map( b => `${b.index} ${b.value}`);
                players = players.join(', ');

                list = `<tr>
                    <td class='tag'>${tag1} ${tag2}</td>
                    <td class='index'>${index}</td>
                    <td class='offset'>${players}</td>
                </tr>`;
                memoryBlocks.innerHTML += list;
            }
        }
    } else {
        for ( let key in mainMemory ) {
            if (key.split(' ').length == 2) {
                [tag1, index] = key.split(' ');

                players = mainMemory[key].map( b => `${b.offset} ${b.value}`);
                players = players.join(', ');
                list = `<tr>
                    <td class='tag'>${tag1}</td>
                    <td class='index'>${index}</td>
                    <td class='offset'>${players}</td>
                </tr>`;
                memoryBlocks.innerHTML += list;
            }
        }
    }
}

function sortTag(e) {
    let dir = (e.target.classList == 'ATOZ') ? 1 : -1
    if (team)
        fetch.sort((a, b) => a.tag.localeCompare(b.tag) * dir);
    else
        fetch.sort((a, b) => a.binTag.localeCompare(b.binTag) * dir);
    createInstructionTable();
}

function sortIndex(e) {
    let dir = (e.target.classList == 'ATOZ') ? 1 : -1
    fetch.sort((a, b) => (+a.binIndex - +b.binIndex) * dir);
    createInstructionTable();
}

function showCacheDetails() { 
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
    hitMiss.innerText = 'H: 0/M: 0/E: 0';
    bodyCache.innerHTML = '';
    totalEvict  = 0;
    totalHits   = 0;
    totalMisses = 0;
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