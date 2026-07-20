const url = 'https://ghirardelli-chocolate-cookies-desserts-recipes-db.p.rapidapi.com/api/recipes?ingredient=fudge';
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': '498ed225bamshcd02cf5559e10edp179d21jsn59b140b93ec5',
		'x-rapidapi-host': 'ghirardelli-chocolate-cookies-desserts-recipes-db.p.rapidapi.com',
		'Content-Type': 'application/json'
	}
};

try {
	const response = await fetch(url, options);
	const result = await response.json();
	console.log(result);
} catch (error) {
	console.error(error);
}