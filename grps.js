const axios = require('axios');
const fs = require('fs');

// Canvas API details
const BASE_URL = 'https://byui.instructure.com/api/v1';
let API_KEY;
let single = '0';

// Load API key from 'key.txt'
try {
    API_KEY = fs.readFileSync('key.txt', 'utf8').trim();
} catch (error) {
    console.error("Error reading API key file:", error.message);
    process.exit(1);
}

// Set up headers with authorization
const headers = {
    'Authorization': `Bearer ${API_KEY}`
};

// Helper function to make GET requests with error handling
async function fetchJSON(url) {
    try {
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error.message);
        return null;
    }
}

// Step 1: Get group categories for a course
async function getCategories(courseId) {
    const url = `${BASE_URL}/courses/${courseId}/group_categories`;
    return await fetchJSON(url);
}

// Step 2: Get all groups within the specified group category
async function getGroups(catId) {
    const url = `${BASE_URL}/group_categories/${catId}/groups?per_page=20`;
    return await fetchJSON(url);
}

// Step 3: Get members in each group
async function getGroupMembers(groupId) {
    const url = `${BASE_URL}/groups/${groupId}/users`;
    return await fetchJSON(url);
}

// Fetch student profile information
async function getStudent(studentId) {
    const url = `${BASE_URL}/users/${studentId}/profile`;
    const student = await fetchJSON(url);
    if (student) {
        const [lastName, rest] = student.sortable_name.split(", ");
        const firstName = rest.split(" ")[0];
        console.log(`\t- ${firstName.padEnd(10).slice(0, 10)} ${lastName.padEnd(15)} ${student.primary_email}`);
    }
}

// Get unassigned students in a group category
async function getUnassigned(groupId) {
    const url = `${BASE_URL}/group_categories/${groupId}/users?unassigned=true`;
    const members = await fetchJSON(url);
    if (members) {
        for (const member of members) {
            await getStudent(member.id);
        }
    }
}

// List members in a group
async function listMembers(group) {
    console.log(group.name);
    const members = await getGroupMembers(group.id);
    if (members) {
        for (const member of members) {
            await getStudent(member.id);
        }
    }
}

// Main function to list team members
async function listTeamMembers(courseId) {
    const categories = await getCategories(courseId);
    if (categories) {
        for (const category of categories) {
            console.log(`${category.name} (ID: ${category.id})`);

            if (single === 'u') {
                await getUnassigned(category.id);
                break;
            }

            const groups = await getGroups(category.id);
            if (groups) {
                for (const group of groups) {
                    if (group.members_count === 0) continue;

                    if ((group.members_count === 1 && single === '1') || single === '0') {
                        await listMembers(group);
                    }
                }
            }
        }
    }
}

// Get courseId and single from command line arguments
let courseId = '320100';
if (process.argv.length > 2) courseId = process.argv[2];
if (process.argv.length > 3) single = process.argv[3];

listTeamMembers(courseId);