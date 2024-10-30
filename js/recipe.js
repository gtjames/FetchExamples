const url = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients?ingredients=apples%2Cflour%2Csugar&number=5&ignorePantry=true&ranking=1';
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': '498ed225bamshcd02cf5559e10edp179d21jsn59b140b93ec5',
		'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
	}
};

try {
	const response = await fetch(url, options);
	const result = await response.text();
	console.log(result);
} catch (error) {
	console.error(error);
}

const url = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/479101/information';
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': '498ed225bamshcd02cf5559e10edp179d21jsn59b140b93ec5',
		'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
	}
};

try {
	const response = await fetch(url, options);
	const result = await response.text();
	console.log(result);
} catch (error) {
	console.error(error);
}