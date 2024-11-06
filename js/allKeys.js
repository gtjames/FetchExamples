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
// let keyCanvas       =   '10706~XHLecHtLFD62TmkYUVKwZRW4mcHcFuKrwJzQMavzhwfDkfh8QKzPw7HnMwB9LHyR'

// let keyDictionary   =   '3f979797-60ca-48d8-a9e8-10d05fdd77f8';
// let keyGoogleMaps   =   'AIzaSyAnfQpXQJx_S10A-5wyuRPZGlBpXhKD7zk';
// let keyNASA         =   'Aw0TZ7aE7e6WJnh4t7plOXEk1xdbCg45NMqfUX42';
// let keyNatlParks    =   'g56CN1WcTJ7QfTf6FTkDH14cCgeeT0UPFLlXubUr';
// let keyNews         =   '04ea6452dc4a86b9ee13f2ab289bdc38';
// let keyOmdb         =   '2c791b47';
// let keyOpenWX       =   'd069f3bb4cdfd9920b9ce2c73df016f8';
// let keyWebcams      =   'vAu65qnE3oXk3CtPQbI7YX9JURUOjdfb';
// let keyWorldArt     =   'gperglagenti';
// //	used by multiple apps
// let keyRapidAPI     =   '498ed225bamshcd02cf5559e10edp179d21jsn59b140b93ec5';

// let courses = [
//     {course: "309418", institution: "byui", name: "WDD 330-F24-B1" },
//     {course: "320100", institution: "byui", name: "WDD 330-F24-B2" },
//     {course: "295338", institution: "byui", name: "WDD 330-S24" },
//     {course: "280438", institution: "byui", name: "WDD 330-W24" },
//     {course: "8630",   institution: "byui", name: "Test" },
//     {course: "274380", institution: "byui", name: "WDD 330-F23" },
//     {course: "99424",  institution: "unt",  name: "CSCE 2610-W23" },
//     {course: "91018",  institution: "unt",  name: "CSCE 3420-S24" },
//     {course: "110652", institution: "unt",  name: "CSCE 3600-W24" },
//     {course: "110534", institution: "unt",  name: "CSCE 1015-W24" },
//     {course: "110XXX", institution: "unt",  name: "CSCE 1015-W24" },
// ];

// let keys = {
//     byui: "10706~XHLecHtLFD62TmkYUVKwZRW4mcHcFuKrwJzQMavzhwfDkfh8QKzPw7HnMwB9LHyR",
//     unt:   "9082~2eACOSJfc50T8CF0xuxjgPzihp0QW6qS9MkMMAhM3vvLmN1S4LLa4A3Bsd1c3Ko2"
// }