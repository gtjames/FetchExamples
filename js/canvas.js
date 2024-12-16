    let theKey = keys.keyCanvas;
	let studentSel  = document.getElementById('studentSel');
	let asgnQuizzes = document.getElementById('asgnQuizzes');
    let extend      = document.getElementById("extend");
    let missed      = document.getElementById("missed");
	let card        = document.getElementById('card');
	let courseList  = document.getElementById('course');
	let errMessage  = document.getElementById('errMessage');
    
    courseList                                  .addEventListener('change', setCourse);
    document.getElementById('groupsInCourse')   .addEventListener('click',  listAllGroupsForCourse);
	document.getElementById('search')           .addEventListener('click',  listModules);
    document.getElementById("close")            .addEventListener("click",  closeModal);
    document.getElementById("closeErr")         .addEventListener("click",  closeError);
    document.getElementById("setUntilDate")     .addEventListener('click',  setUntilDate);
    document.getElementById("extendUntilDate")  .addEventListener('click',  extendUntilDate);
    document.getElementById("extendUntilDates") .addEventListener('click',  extendUntilDates);
    document.getElementById("incomplete")       .addEventListener('click',  getIncomplete);

    for (c of keys.courses) {
        courseList.innerHTML += `<option value=${c.course} data-edu=${c.institution} data-token=${keys[c.institution]}>${c.name}</option>`;
    }

    let untilDate = (new Date()).toISOString().slice(0,16);
    document.getElementById('untilDate').value = untilDate;

    let row = 0;
    let course = "295338";
    let edu    = "https://byui.instructure.com/api/v1";
    let headers = { "Authorization" : `Bearer ${theKey}`, };

    let postOptions = { method: "POST", headers: headers };
    let putOptions  = { method: "PUT",  headers: headers };
    let getOptions  = { method: "GET",  headers: headers };

function setCourse(e) {
    course      = e.target.selectedOptions[0].value;
    keyCanvas   = e.target.selectedOptions[0].dataset.token;
    edu         = "https://"+e.target.selectedOptions[0].dataset.edu+".instructure.com/api/v1";
    headers.Authorization = `Bearer ${keyCanvas}`;

    postOptions = { method: "POST", headers: headers };
    putOptions  = { method: "PUT",  headers: headers };
    getOptions  = { method: "GET",  headers: headers };
}

function closeModal() {
    document.getElementById('id01').style.display='none';
    untilDate = document.getElementById('untilDate').value;
    
    let list = asgnQuizzes.querySelectorAll("option");
    list = Array.from(list);
    list = list.sort((a,b) => a.text.localeCompare(b.text));
    asgnQuizzes.innerHTML = '';
    list.forEach(o => asgnQuizzes.appendChild(o));
    asgnQuizzes.selectedIndex = 0;
}

function setUntilDate() { document.getElementById('id01').style.display='block'; }

function openError(msg) {
    document.getElementById('error').style.display='block';
    errMessage.innerText = msg;
}

function closeError() { document.getElementById('error').style.display='none'; }

async function listModules() {
		/**
curl -H 'Authorization: Bearer 10706~1r7OxhF6t3ksuV4w8HVWN6e4LYwcYuXaqLl3pC0cH9TKcll6NEYDxYOi6thAm1Z2'  https://${edu}.instructure.com/api/v1/courses/274380/modules
        */
    asgnQuizzes.innerHTML = '';
    studentSel.innerHTML = '';
    
    modules = await getFetch(`${edu}/courses/${course}/modules`);
    card.innerHTML = '';
    modules.forEach(mod => {
        row++;
        card.innerHTML += `
            <div id=${mod.id} data-url="${mod.items_url}" class="w3-col m3 l3 w3-theme-d${(row%2)*3+1} disney-card">
                <h4>${mod.name}</h4>
                <hr>
                <div style="overflow-y: scroll; height:290px;"><ul id=item${mod.id}></ul></div>
            </div>`;
    });
    let cards = document.getElementsByClassName('disney-card');
    Array.from(cards).forEach(item => getItems(item));

    const students = await getStudents();
    let map  = students.map( s => `<option data-sort="${s.name}" value=${s.id}>${s.name}</option>` );
    studentSel.innerHTML = map.join('\n');
}

async function getItems(target) {
    items = await getFetch(target.dataset.url, getOptions)
    let itemsList = document.getElementById(`item${target.id}`);
    if (itemsList !== null) {
        itemsList.innerHTML = '';
        // let cb = ;
        items.forEach(item => {
            let data = `data-id=${item.content_id} class=${item.type}`;
            let cb = `${(item.type[0] == 'A' || item.type[0] == 'Q') ? `<input type="checkbox" id=cb-${item.content_id} ${data}>` : ''} `;
            itemsList.innerHTML += `<li  id=li-${item.content_id} ${data} class=${item.type} data-url=${item.url}>${cb}<span id=title-${item.content_id} ${data}>${item.title}</span><div id=dates-${item.content_id} ${data}></div></li>`
        })
        let li = itemsList.querySelectorAll('li.Assignment, li.Quiz');
        let options = Array.from(li).map(item => {
            item.addEventListener('click', showDates);
            return option = `<option class=${item.className} value=${item.id}>${item.innerText}</option>`;
        });
        asgnQuizzes.innerHTML += options.join('\n');
    }
}

async function showDates(e) {
    let id = e.target.dataset.id;
    let dates = document.getElementById(`dates-${id}`);
    let li    = document.getElementById(`li-${id}`);

    if (dates.innerHTML.length > 0) {
        dates.innerHTML = '';
        return;
    }
    if (li === undefined) return;    
    let url = `${li.dataset.url}`;

    console.log(url);
    item = await getFetch(url, getOptions)
    dates.innerHTML = `Due: ${item.due_at}<br>Until: ${item.lock_at}`;
    dates.addEventListener('click', updateLockAt);
}

async function updateLockAt(e) {
    e.stopPropagation();

    let id = e.target.dataset.id;
    let dates = document.getElementById(`dates-${id}`);
    let li    = document.getElementById(`li-${id}`);
    let type = li.classList[0].toLowerCase();

    let arg = type + (type[0] === 'q' ? 'ze' : '') + 's';
    let url = `${edu}/courses/${course}/${arg}/${id}?${type}[lock_at]=${untilDate}:00-06:00`;
    item = await getFetch(url, putOptions)
    if (item.status === undefined)
        dates.innerHTML = `Due: ${item.due_at}<br>Until: ${item.lock_at}`;
    else
        dates.innerText = item.errors[0].message;
}

async function extendUntilDate() {
	let studentId = studentSel.options[studentSel.selectedIndex].value;
	let quizId    = asgnQuizzes.options[asgnQuizzes.selectedIndex].value;
    let type      = asgnQuizzes.options[asgnQuizzes.selectedIndex].className;
    let extendNum = document.getElementById("extend").value;
    let url, body;
    if (type[0] === 'A') {
        url  = `/${course}/assignments/${quizId}/extensions`;
        body = JSON.stringify( { "assignment_extensions": [ {"user_id": studentId, "extra_attempts": extendNum} ] });
    } else {
        url  = `/${course}/quizzes/${quizId}/extensions`;
        body = JSON.stringify( { "quiz_extensions":       [ {"user_id": studentId, "extra_time": extendNum}, ] });
        // end_at: "2023-11-24T06:59:00Z"  extra_attempts: null
    }
    url = `${edu}${url}`;
    postOptions.body = body;
    msg = await getFetch(url, postOptions)
    console.log(msg);
}

function extendUntilDates() {
    let assign  = document.querySelectorAll('input.Assignment:checked')
    Array.from(assign).forEach(a => {
        let id = a.id.substring(3);
        let url = `${edu}/courses/${course}/assignments/${id}?assignment[lock_at]=${untilDate}:00-07:00`;
        updateUntilDate(id, url);
    });

    let quizzes = document.querySelectorAll('input.Quiz:checked')
    Array.from(quizzes).forEach(a => {
        let id = a.id.substring(3);
        let url = `${edu}/courses/${course}/quizzes/${id}?quiz[lock_at]=${untilDate}:00-07:00`;
        updateUntilDate(id, url);
    });
}

async function updateUntilDate(id, url) {
    item = await getFetch(url, putOptions)
    let dates = document.getElementById(`dates-${id}`);
    let cb    = document.getElementById(`cb-${id}`);
    cb.checked = false;
    dates.innerHTML = `Due: ${item.due_at}<br>Until: ${item.lock_at}`;
    console.log(item);
}

// Step 3: Combine and display all groups for the course
async function listAllGroupsForCourse() {
    try {
        const groups = await getGroupCategories();
        
        card.innerHTML = "";
        for (const grp of groups) {
            card.innerHTML += `<h2>Group: ${grp.name} ${grp.id}`;            
            const teams = await getGroupsInCategory(grp.id);
            
            for (const team of teams) {
                if ( team.members_count == 0)  continue;
                card.innerHTML += `<h4>Team: ${team.name} ${team.id} ${team.members_count}</h4>`;
                const members = await getGroupMembers(team.id);
            
                for (const mbr of members) {
                    const s = await getStudent(mbr.id);
                    card.innerHTML += `<br> - ${s.sortable_name} ${s.primary_email} ${s.time_zone}`;
                };
            };
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
}
async function getIncomplete() {
    const resultsDiv = document.getElementById("card");
    resultsDiv.innerHTML = "<p>Loading...</p>";

    const students     = await getStudents();
    const assignments  = await getAssignments();
    const studentAssignments = 
        Object.fromEntries( students.map(student => [ student.id, { name: student.name, unsubmitted: [] } ]) );

    for (let assignment of assignments) {
        let incompletes = await getSubmissionByStatus( course, assignment['id'], 'unsubmitted' );
        for (let submission of incompletes) {
            let studentId = submission['user_id']
            if (studentAssignments[studentId] != undefined) {
                studentAssignments[studentId]["unsubmitted"].push(assignment['name'])
            }
        }
    }
    displayIncomplete(studentAssignments, resultsDiv);
}

async function getIncompleteAssignments(course, studentId, assignments) {
  const results = [];
  for (const assignment of assignments) {
    const submission = await getFetch(`${edu}/courses/${course}/assignments/${assignment.id}/submissions/${studentId}`);
    if (!submission.submitted_at) {
      results.push(assignment.name);
    }
  }
  return results;
}

async function getSubmissionByStatus(course, assignmentId, state) {
    let submissions = [];

    const submission = await getFetch(`${edu}/courses/${course}/assignments/${assignmentId}/submissions?per_page=100`, headers=headers);
    submissions = submission.filter(s => s.workflow_state == state);
    return submissions;
}  

function displayIncomplete(data, container) {
  container.innerHTML = "";
  let idx = 0;
  let count = +missed.value;
    for (var key in data) {
        const {name, unsubmitted} = data[key];
        const studentDiv = document.createElement("div");
        if (unsubmitted.length != 0) {
            if ( (count < 0 && unsubmitted.length <  Math.abs(count))
            || (count >=0 && unsubmitted.length >= count) ) {
                studentDiv.innerHTML = `<h3>${idx++} ${name}</h3>`;
                const list = document.createElement("ul");
                unsubmitted.forEach((assignment) => {
                    const item = document.createElement("li");
                    item.textContent = assignment;
                    list.appendChild(item);
                });
                studentDiv.appendChild(list);
            } else {
                // studentDiv.innerHTML += "<p>All assignments completed!</p>";
            }
        }
        container.appendChild(studentDiv);
    }
}

async function getFetch(url, options = { headers: headers }) {
    const response = await fetch(url, options );
    return response.json();
}

// Get all group categories for the course
async function getGroupCategories() {
    return await getFetch(`${edu}/courses/${course}/group_categories`);
}

// Get groups within each group category
async function getGroupsInCategory(groupCategoryId) {
    return await getFetch(`${edu}/group_categories/${groupCategoryId}/groups?per_page=20`);
}

// Get members of a specific group
async function getGroupMembers(groupId) {
    return await getFetch(`${edu}/groups/${groupId}/users`);
}

// Get student info
async function getStudent(studentId) {
    return await getFetch(`${edu}/users/${studentId}/profile`);
}

async function getStudents() {
    return await getFetch(`${edu}/courses/${course}/users?enrollment_type[]=student&per_page=100`);
}
  
async function getAssignments() {
    return await getFetch(`${edu}/courses/${course}/assignments?per_page=100`);
}

function setKey() { theKey = getKey(); }
