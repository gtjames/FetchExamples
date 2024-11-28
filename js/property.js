let theKey = keys.keyRapidAPI;
document.getElementById("search").addEventListener('click', getProperties)

const url = 'https://realty-in-us.p.rapidapi.com/properties/v3/list';
const options = {
	method: 'POST',
	headers: {
		'x-rapidapi-key': theKey,
		'x-rapidapi-host': 'realty-in-us.p.rapidapi.com',
		'Content-Type': 'application/json'
	},
	body: {
		limit: 200,
		offset: 0,
		postal_code: '76060',
		status: [
			'for_sale',
			'ready_to_build'
		],
		sort: {
			direction: 'desc',
			field: 'list_date'
		}
	}
};

// Step 1: Get all group categories for the course
async function getProperties() {
	try {
		const response = await fetch(url, options);
		const result = await response.json();
		console.log(result);
        document.body.innerText = result;
	} catch (error) {
		console.error(error);
	}
}

function setKey() { theKey = getKey(); }
