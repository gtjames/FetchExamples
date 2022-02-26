/*
When the page loads
    Get list of pokemon types.
    filter out types with no pokemon (shadow and unknown)
    render type list out (need type name and url to get all pokemon of that type)
    attach a listener to respond to a click on the type.
        when clicked it should pull the type url and retrieve the data
        render the list of pokemon
        style the clicked type as active


*/

let volcanoes = [];

  
  // create simple html markup to display a list
  function renderTypesList(list) {
    volcanoes = list
    const element = document.getElementById("typeList");
    element.innerHTML = '';
    let map = volcanoes.map(v => v.Type);
    const types = new Set([...map]);

    // how did we know that we needed to look at list.results?  we looked at the data returned from the API!
    types.forEach((type) => {
      const li = `<li data-url='${type}'>${type}</li>`;
      // our data contains the url we need to use to grab the pokemon of that type. We can embed it into our element using the data- prefix
      element.innerHTML += li;
    });
  }

//   "Year": 2015,
//   "Location": "Sumatra",
//   "Country": "Indonesia",
//   "Elevation": 2460,
//   "Type": "Stratovolcano",
//   "Deaths": 1
  
  function renderTypeList(list) {
    const element = document.getElementById("pokeList");
    element.innerHTML = "";
    list.forEach((item) => {
      element.innerHTML += `<li data-url=${JSON.stringify(item)}>"${item.Name}</li>`;
    });
  }
  
  function setActive(type) {
    // use querySelectorAll to get all of the type li elements
    const allTypes = document.querySelectorAll(".types > li");
    allTypes.forEach((item) => {
      // check to see if this is the one to make active
      if (item.dataset.url === type) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  }
  
  function typeClickedHandler(event) {
    // note the difference between event.target and event.currentTarget in this case.
    console.log(event.target);
    console.log("current:", event.currentTarget);
    const selectedType = event.target;
  
    // when we built the type list we embedded the url in the element, we can retrieve that through element.dataset
    const type = selectedType.dataset.url;
    // highlight the selected type. we have to remove any other active classes at the same time so let's pull this out into a function. We know the url will be unique...so we will send that as an identifier
    setActive(type);
    // then we call our getData function sending it the url we want, and the action we would like to have happen when the data is ready    
    let vol = volcanoes.filter((v) => v.Type === type);
    
    renderTypeList(vol);
  }
  
  // keep things from happening until the DOM is ready
  // another alternative would be to add 'defer' to our script element
  window.addEventListener("load", function () {
    //get and display the list of types

  fetch('https://raw.githubusercontent.com/gtjames/HOF/master/volcanos.json')
  .then(resp => resp.json())
  .then(resp => {
    renderTypesList(resp);
    // watch for a click on a type and display the list of pokemon for that type
    document
      .getElementById("typeList")
      .addEventListener("click", typeClickedHandler);
  })
});
  