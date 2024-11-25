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

function showJobs(jobs) {
    let arHtml = jobs.data.map((j,idx) =>
        `<tr class="w3-theme-${idx%2>0?'l2':'l3'}">
            <td id=${j.job_id} class="drillDown"><img src=${j.employer_logo} height='120px' alt=""></td>
            <td><a href=${j.employer_website}>${j.employer_name}</a></td>
            <td><a href=${j.job_apply_link}>Apply at</a></td>
            <td>${j.job_title}</td>
            <td>${j.job_description}</td>
            <td>${j.job_location}</td>
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
}
function setKey() { theKey = getKey(); }

    /*
job_id:"Qfh4-9t8uBZRRETpAAAAAA=="
employer_name:"Nabu Casa"
employer_logo:null
employer_website:null
employer_company_type:null
employer_linkedin:null
job_publisher:"Taro"
job_employment_type:"FULLTIME"
job_title:"Node.js Developer"
job_apply_link:"https://www.jointaro.com/jobs/nabu-casa/nodejs-developer/?utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic"
job_apply_quality_score:0.5409
job_description:"Nabu Casa is hiring a Node.js Developer to work on Home Assistant Cloud services, focusing on scalable and privacy-oriented features."
job_is_remote:false
job_posted_at_datetime_utc:"2024-09-04T00:04:12.000Z"
job_state:"NY"
job_latitude:40.712776
job_longitude:-74.005974
job_google_link:"https://www.google.com/search?gl=us&hl=en&rciv=jb&q=node.js+developer+in+new-york,usa&start=0&udm=8#vhid=vt%3D20/docid%3DQfh4-9t8uBZRRETpAAAAAA%3D%3D&vssid=jobs-detail-viewer"
job_required_skills:null
job_experience_in_place_of_education:false
job_min_salary:null
job_max_salary:null


const url = 'https://jsearch.p.rapidapi.com/job-details?job_id=chWcnzoDOfJF5kYSAAAAAA%3D%3D&extended_publisher_details=false';
};
*/
