import {reveal, close, clear, removeAllErrors, toEngineering} from './AsmUtils.js';
import {getRandomInt, getRandom, setSeed} from './utils.js';

  let totCycles   = document.getElementById('TotalCycles');
  let totInst     = document.getElementById('TotalInstructions');

  let wtdCPI      = document.getElementById('WeightedCPI');
  let runTime     = document.getElementById(`runTime`);
  let instr       = document.getElementById('Instruction');
  let cps         = document.getElementById(`cps`);
  let cpsUnits    = document.getElementById(`cpsUnits`);
  let spc         = document.getElementById(`spc`);
  let spcUnits    = document.getElementById(`spcUnits`);
  let perfPanel   = document.getElementById('comparePerf');
  let revealOn    = document.getElementById('revealOn');
  let revealBtn   = document.getElementById('reveal');
  let cpi1        = document.getElementById('cpi1');
  let studentID   = document.getElementById('studentID');
  let trials      = document.getElementById('trials');

  
    document.getElementById('reset'  ).addEventListener('click', reset);
    document.getElementById('submit' ).addEventListener('click', submit);
    document.getElementById('reveal' ).addEventListener('click', reveal);
    document.getElementById('comparePerf').addEventListener('click', nextPerformance);
    document.getElementById('save'   ).addEventListener('click', save);
    document.getElementById('restore').addEventListener('click', restoreList);
    revealBtn.parentElement.addEventListener('dblclick', () => revealBtn.disabled = false);

  let types =['Add', 'Multiply', 'Branch', 'Floating Pt'];
  let totalInstructions;
  let totalCycles;
  let typeCPI;
  let numInstructions;
  let numCycles;
  let pctOfCycles;
  let remainingPct;
  let WeightedCPI;
  let CPUTime;
  let performancePanel = 0;

  reset();

function submit() {
    for (let i = 0; i < 4; i++) {
        close(`NumCycles${i}`,  true, 0, true);
        close(`pctCycles${i}`,  true, 0, true);
        close(`PartialCPI${i}`, true, 0, true);
    }
    close('TotalCycles',  true,  0,     true );
    close('WeightedCPI',  true,  0,     true );
    close('cps',          false, 0.05,  true );
    close('spc',          false, 0.05,  true );
    close('cpsUnits',     true,  0,     false);
    close('spcUnits',     true,  0,     false);

    close('cpiX',         true,  0,     true);
    close('cpiY',         true,  0,     true);
    close('cyclesX',      false, 0.05,  true);
    close('cyclesY',      false, 0.05,  true);
    close('timeX',        false, 0.05,  true);
    close('timeY',        false, 0.05,  true);
    close('rateX',        false, 0.05,  true);
    close('rateXUnits',   true,  0,     false);
    close('rateY',        false, 0.05,  true);
    close('rateYUnits',   true,  0,     false);
    close('clockX',       false, 0.05,  true);
    close('clockXUnits',  true,  0,     false);
    close('clockY',       false, 0.05,  true);
    close('clockYUnits',  true,  0,     false);
}

function reset() {
    let id = studentID.value;
    document.getElementById(`reveal`).disabled = (id.length > 0);
    if (id.length != 0)       revealOn.checked = false;
    setSeed( (id.length > 0) ? "."+id : -1 );

    totalInstructions;
    totalCycles = 0;
    WeightedCPI = 0;
    remainingPct = 100;
    typeCPI = [];
    numInstructions = [];
    numCycles = [];
    pctOfCycles = [];
    CPUTime = (getRandom(.001)+0.0002).toFixed(6);
    instr.innerHTML = '';
  
    totalCycles       = 0;
    totalInstructions = getRandomInt(100) * 21000_0;
    for (let i = 0; i < 4; i++) {
        let pct = (getRandomInt(5) + 4 ) * 5;
        if (pct > remainingPct) pct = remainingPct;
        if (i == 3)
        pct = remainingPct;
        remainingPct -= pct;
        pctOfCycles[i] = pct;

        typeCPI[i]         = (pct) ? getRandomInt((i+.25) * 2.5) + 1 : 0;
        numInstructions[i] = (typeCPI[i] != 0) ? totalInstructions * pctOfCycles[i] / 100 : 0;
        numCycles[i]       = numInstructions[i] * typeCPI[i];

        WeightedCPI       += pctOfCycles[i] * typeCPI[i];
        totalCycles       += numCycles[i];
    }

    for (let i = 0; i < 4; i++) {
        instr.innerHTML += `<tr class='flex'>
            <td id='InstrType${i}'          class='instr'  data-answer='${types[i]}'>${types[i]}</td>
            <td id='NumInstr${i}'           class='given'  data-answer='${numInstructions[i].toLocaleString('en-US')}'>${numInstructions[i].toLocaleString('en-US')}</td>
            <td> <input id='pctCycles${i}'  class='small'  data-answer=${pctOfCycles[i]}>% </td>
            <td id='InstrCPI${i}'           class='given'  data-answer='${typeCPI[i]}'>${typeCPI[i]}</td>
            <td> <input id='NumCycles${i}'  class='medium' data-answer=${numCycles[i].toLocaleString('en-US')}> </td>
            <td> <input id='PartialCPI${i}' class='small'  data-answer=${(pctOfCycles[i]*typeCPI[i]/100).toFixed(2)}> </td>
        </tr>`;
    }
  
    totInst.innerText           = totalInstructions.toLocaleString('en-US');
    totInst.dataset.answer      = totalInstructions.toLocaleString('en-US');
    totCycles.dataset.answer    = totalCycles.toLocaleString('en-US');
    wtdCPI.dataset.answer       = (WeightedCPI/100).toFixed(2);
    runTime.innerText           = CPUTime;
    runTime.dataset.answer      = CPUTime;
    [cps.dataset.answer, cpsUnits.dataset.answer] = toEngineering(totalCycles / CPUTime);
    [spc.dataset.answer, spcUnits.dataset.answer] = toEngineering(CPUTime / totalCycles);
    spc.dataset.result  = CPUTime / totalCycles;

    performance(performancePanel);
    removeAllErrors();
    clear();
    if (revealOn.checked)   reveal();
}

function nextPerformance() {
    performancePanel = (performancePanel+1)%4;
    performance(performancePanel);
    if (revealOn.checked)   reveal();
}

function performance(panel) {
    let compare     = document.getElementById('compare');
    let performance = document.getElementById('performanceTemplate' + panel);
    const pNode     = performance.content.cloneNode(true);

    let instrXY     = document.querySelector('#instrXY');
    let cpuX        = document.querySelector('#cpuX');
    let cpuY        = document.querySelector('#cpuY');
    let cpiX        = pNode.querySelector('#cpiX');
    let cpiY        = pNode.querySelector('#cpiY');
    let cyclesX     = pNode.querySelector('#cyclesX');
    let cyclesY     = pNode.querySelector('#cyclesY');
    let rateX       = pNode.querySelector('#rateX');
    let rateY       = pNode.querySelector('#rateY');
    let rateXUnits  = pNode.querySelector('#rateXUnits');
    let rateYUnits  = pNode.querySelector('#rateYUnits');
    let timeX       = pNode.querySelector(`#timeX`);
    let timeY       = pNode.querySelector(`#timeY`);
    let clockX      = pNode.querySelector(`#clockX`);
    let clockY      = pNode.querySelector(`#clockY`);
    let clockXUnits = pNode.querySelector(`#clockXUnits`);
    let clockYUnits = pNode.querySelector(`#clockYUnits`);

    let XYinstr     = getRandomInt(100) * 210_000;
    let Xcpi        = getRandomInt(6) / 2 + 1;
    let Ycpi        = getRandomInt(6) / 2 + 1;
    if (cpi1.checked) {
        Xcpi = Ycpi = 1;
    }
    let Xcycles     = XYinstr * Xcpi;
    let Ycycles     = XYinstr * Ycpi;
    let Xtime       = getRandom(0.001)+0.0002;
    let Ytime       = getRandom(0.001)+0.0002;

    instrXY.innerText = instrXY.dataset.answer = XYinstr.toLocaleString('en-US');

    switch (panel) {
        case    0:
            perfPanel.innerText     = "Find CPI";
            cpiX.dataset.answer     = Xcpi;
            cpiY.dataset.answer     = Ycpi;
            setCycles(cyclesX, Xcycles, cyclesY, Ycycles);
            setTime(timeX, Xtime, timeY, Ytime);
            setRateAndCycle(rateX, Xcycles / Xtime, rateY, Ycycles / Ytime, clockX, Xtime  / Xcycles, clockY, Ytime  / Ycycles);
            break;
        case    1:
            perfPanel.innerText = "Find Cycles";
            setCPI(cpiX, Xcpi, cpiY, Ycpi);
            cyclesX.dataset.answer      = Xcycles.toLocaleString('en-US');
            cyclesY.dataset.answer      = Ycycles.toLocaleString('en-US');
            setTime(timeX, Xtime, timeY, Ytime);
            setRateAndCycle(rateX, Xcycles / Xtime, rateY, Ycycles / Ytime, clockX, Xtime  / Xcycles, clockY, Ytime  / Ycycles);
            break;
        case    2:
            perfPanel.innerText = "Find Run Time";
            setCPI(cpiX, Xcpi, cpiY, Ycpi);
            setCycles(cyclesX, Xcycles, cyclesY, Ycycles);
            timeX.dataset.answer       = Xtime.toFixed(6);
            timeY.dataset.answer       = Ytime.toFixed(6);
            setRateAndCycle(rateX, Xcycles / Xtime, rateY, Ycycles / Ytime, clockX, Xtime  / Xcycles, clockY, Ytime  / Ycycles);
            break;
        case    3:
            perfPanel.innerText = "Find CPU Rate";
            setCPI(cpiX, Xcpi, cpiY, Ycpi);
            setCycles(cyclesX, Xcycles, cyclesY, Ycycles);
            setTime(timeX, Xtime, timeY, Ytime);
            [rateX.dataset.answer, rateXUnits.dataset.answer]   = toEngineering(Xcycles / Xtime);
            [rateY.dataset.answer, rateYUnits.dataset.answer]   = toEngineering(Ycycles / Ytime);
            [clockX.dataset.answer, clockXUnits.dataset.answer] = toEngineering(Xtime  / Xcycles);
            [clockY.dataset.answer, clockYUnits.dataset.answer] = toEngineering(Ytime  / Ycycles)
            break;
    }
    fastOrSlow();
    function fastOrSlow() {
        cpuX.classList = cpiX.classList = timeX.classList = rateX.classList = clockX.classList = '';
        cpuY.classList = cpiY.classList = timeY.classList = rateY.classList = clockY.classList = '';
        cpiX.classList.add  (Xcpi < Ycpi     ? 'fast' : Xcpi == Ycpi ? 'x' : 'slow');
        cpiY.classList.add  (Ycpi < Xcpi     ? 'fast' : Ycpi == Xcpi ? 'x' : 'slow');
        timeX.classList.add ((Xtime < Ytime) ? 'fast' : 'slow');
        timeY.classList.add ((Ytime < Xtime) ? 'fast' : 'slow');   
        rateX.classList.add ((Xcycles / Xtime > Ycycles / Ytime) ? 'fast':'slow');   
        rateY.classList.add ((Xcycles / Xtime < Ycycles / Ytime) ? 'fast':'slow');   
        clockX.classList.add((Xcycles / Xtime > Ycycles / Ytime) ? 'fast':'slow');   
        clockY.classList.add((Xcycles / Xtime < Ycycles / Ytime) ? 'fast':'slow');   

        cpuX.classList.add ((Xtime < Ytime) ? 'fast' : 'slow');
        cpuY.classList.add ((Ytime < Xtime) ? 'fast' : 'slow');   
    }

    compare.innerHTML = "";
    compare.appendChild( pNode );
}

function setCPI(cpiX, Xcpi, cpiY, Ycpi) {
    cpiX.innerText      = cpiX.dataset.answer = Xcpi;
    cpiY.innerText      = cpiY.dataset.answer = Ycpi;
}

function setCycles(cyclesX, Xcycles, cyclesY, Ycycles) {
    cyclesX.innerText   = cyclesX.dataset.answer = Xcycles.toLocaleString('en-US');
    cyclesY.innerText   = cyclesY.dataset.answer = Ycycles.toLocaleString('en-US');
}

function setTime(timeX, Xtime, timeY, Ytime) {
    timeX.innerText     = timeX.dataset.answer = Xtime.toFixed(6);
    timeY.innerText     = timeY.dataset.answer = Ytime.toFixed(6);
}

function setRateAndCycle(rateX, Xrate, rateY, Yrate, clockX, Xclock, clockY, Yclock) {
    rateX.innerText     = rateX.dataset.answer  = toEngineering(Xrate).join(' ');
    rateY.innerText     = rateY.dataset.answer  = toEngineering(Yrate).join(' ');
    clockX.innerText    = clockX.dataset.answer = toEngineering(Xclock).join(' ');
    clockY.innerText    = clockY.dataset.answer = toEngineering(Yclock).join(' ');
}

function save () {
    let res = JSON.parse(localStorage.getItem('res')) ?? [];
    let inputs = document.querySelectorAll('[data-answer]');
    let results = {};
    results.performancePanel = performancePanel;
    results.attrs = Array.from(inputs).map(i => {
        return {id: i.id, answer: i.dataset.answer, value: (i.tagName === "INPUT") ? i.value : ""};
    });
    res.push(results);
    localStorage.setItem('res',   JSON.stringify(res));
}

function deleteView (e) {
    let id = +e.target.id;
    let res          = JSON.parse(localStorage.getItem('res'));
    res.splice(id, 1);
    localStorage.setItem('res',   JSON.stringify(res));
    restoreList();
}

function restore (e) {
    let id  = +e.target.id;
    let res = JSON.parse(localStorage.getItem('res'));
    clear();
    performancePanel = res[id].performancePanel
    performance(performancePanel);
    res[id].attrs.forEach(r => {
        let ref = document.getElementById(r.id);
        ref.dataset.answer = r.answer;
        if (ref.tagName === "INPUT") {
            ref.value = r.value;
        } 
        if (ref.tagName === "TD") {
            ref.innerText = r.answer;
        }
    });
}

function restoreList () {
    let res          = JSON.parse(localStorage.getItem('res'));
    trials.innerHTML = '';

    res.forEach((r,index) => {
        trials.innerHTML += `<tr> <td>${index}</td> <td>${r.attrs[24].answer}</td> <td>${r.attrs[26].answer}</td><td id=${index} class='delete'>Delete</td><td id=${index} class='restore'>Restore</td> </tr>`;
        // r.attrs.forEach((x, i) => trials.innerHTML += `
        //     <tr id=${index}>
        //         <td class='tag'>${index} ${i}</td>
        //         <td class='tag'>${x.id}</td>
        //         <td class='index'>${x.answer}</td>
        //         <td>${x.value}</td>
        //     </tr>`
        // );
    });
    document.querySelectorAll('.restore').forEach(d => d.addEventListener('click', restore));
    document.querySelectorAll('.delete').forEach(d => d.addEventListener('click', deleteView));
}
