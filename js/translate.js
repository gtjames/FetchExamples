import axios from "axios";

const options = {
  method: 'POST',
  url: 'https://lecto-translation.p.rapidapi.com/v1/translate/text',
  headers: {
    'content-type': 'application/json',
    'x-rapidapi-host': 'lecto-translation.p.rapidapi.com',
    'x-rapidapi-key': '498ed225bamshcd02cf5559e10edp179d21jsn59b140b93ec5'
  },
  data: {
    texts: ['Just try it mate.', 'What are you waiting for?'],
    to: ['hi'],
    from: 'en'
  }
};

axios.request(options).then(function (response) {
	console.log(response.data);
}).catch(function (error) {
	console.error(error);
});