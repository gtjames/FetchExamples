fetch("https://google-translate1.p.rapidapi.com/language/translate/v2/detect", {
	"method": "POST",
	"headers": {
		"content-type": "application/x-www-form-urlencoded",
		"accept-encoding": "application/gzip",
		"x-rapidapi-host": "google-translate1.p.rapidapi.com",
		"x-rapidapi-key": "498ed225bamshcd02cf5559e10edp179d21jsn59b140b93ec5"
	},
	"body": {
		"q": "English is hard, but detectably so"
	}
})
	.then(response => {
		console.log(response);
	})
	.catch(err => {
		console.error(err);
	});