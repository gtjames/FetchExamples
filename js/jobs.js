    let theKey = keys.keyRapidAPI;

    let search = document.getElementById('search');
    search.addEventListener('click', jobSearch);
    let tableBody = document.getElementById('resultList');

    const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key':   `${theKey}`,
		'x-rapidapi-host': 'jsearch.p.rapidapi.com'
	    }
    };

    document.getElementById("details").addEventListener("click", closeModal);
    function closeModal() {
        document.getElementById('details').style.display='none';
    }

function jobSearch() {
    let searchText = document.getElementById('searchTerm').value;
    fetch(`https://jsearch.p.rapidapi.com/search?query=${searchText}&page=1&num_pages=1&country=us&date_posted=all`, options)
        .then(resp => resp.json())          //  wait for the response and convert it to JSON
        .then(jobs => showJobs(jobs));
}
// job_posted_at: "5 days ago"
// job_salary_string: null

function showJobs(jobs) {
    let arHtml = jobs.data.map((j,idx) =>
        `<tr class="w3-theme-${idx%2>0?'l2':'l3'}">
            <td id=${j.job_id} class="drillDown"><img src=${j.employer_logo} height='120px' alt=""></td>
            <td>${j.employer_name}</td>
            <td><a href=${j.apply_options[0].apply_link} target="_blank" rel="noopener noreferrer">${j.apply_options[0].publisher}</a></td>
            <td>${j.job_title}</td>
            <td>${j.job_benefits?.map(b => `<span class="w3-tag w3-blue">${b}</span>`).join(' ')}</td>
            <td>${j.job_description}</td>
            <td>${j.job_location}${j.job_is_remote ? ' (Remote)' : ''}</td>
        </tr>`
    );
    let txt = arHtml.join("\n")
    tableBody.innerHTML = txt;
    let jobDetail = document.getElementsByClassName('drillDown');
    Array.from(jobDetail)
        .forEach((jd,idx) => jd.addEventListener('click', () =>
            jobDetails(jobs.data[idx])));
}

function jobDetails(job) {
    // let job = JSON.parse(data);

    document.getElementById('details').style.display='block';
    let qual = document.querySelector('#qualifications');
    let bene = document.querySelector('#benefits');
    let resp = document.querySelector('#responsibilities');
    let title = document.getElementById('title');
	title.innerText = job.job_title
	qual.innerText = `${job.job_highlights.Qualifications}`;
	bene.innerText = `${job.job_highlights.Benefits}`;
	resp.innerText = `${job.job_highlights.Responsibilities}`;

    fetch(`https://jsearch.p.rapidapi.com/job-details?job_id=${job.job_id}&extended_publisher_details=false`, options)
    .then(resp => resp.json())          //  wait for the response and convert it to JSON
    .then(jobs => showJobDetails(jobs));
}

function showJobDetails(details) {
    console.log(JSON.stringify(details));
    alert(`Job Details: ${JSON.stringify(details)}`);
}

function setKey() { theKey = getKey(); }
