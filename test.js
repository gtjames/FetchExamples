// try {
//     const response = await fetch("test.js");
//     const result = await response.json();
//     card.innerText = JSON.stringify(result);
// } catch (error) {
//     console.error(error);
// }    

// try {
//     const response = await fetch("other\findMeInPi.html");
//     const result = await response.json();
//     card.innerText = JSON.stringify(result);
// } catch (error) {
//     console.error(error);
// }
let res = {test : {name:'gary', age: 70, name:'tari', age:70}, perf:9};


let max = 1000;
let seed = 42; // Change this to your desired seed value

next10();

function seededRandom(seed, max) {
  return Math.abs(Math.floor(Math.sin(seed) * (max-1)));
}

function getNextRandom(seed, max) {
    return seededRandom(( seed == 0 ) ? (new Date()).getMilliseconds() : seed, max);
}

function next10 () {
    for (let i = 0; i < 10; i++) {
        seed = getNextRandom(seed, max);
        console.log(seed + "   " + Math.floor(seed));
    }
}