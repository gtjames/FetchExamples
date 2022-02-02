//  basic utility function
//      return the square root of a number
export function sqRoot (num) {
    return Math.sqrt(num).toFixed(2);
}

//  basic fat arrow function to show it is treated like any other function that is exported
export let randNum = (max) => (Math.random() * max).toFixed(0);

//  basic simple variable
export let favNum = 343;        //  7 cubed

//  this is something fun I just picked up
//      My hate for alert messages knows no bounds
//      now I can add some input variables to the path URL to pass in to my code
//      I can retrieve the individual query values from this URL line
//          ?num=100&name=Brigham Young University-Idaho&message=today is a good day!
//      like this
//          let num = getUrlVar('num');
//          let school = getUrlVar('name')
export function getUrlVar(pathVar) {
    let vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,(m,key,value) => vars[key] = value);
    return vars[pathVar];
}
