import requests
import sys
import json

courseId = "320100"
school = "byui"
single = "0";

# Run the function
if len(sys.argv) > 2:
    school   = sys.argv[1]
    courseId = sys.argv[2]
if len(sys.argv) > 3:
    single = sys.argv[3]

# Load the JSON key file
with open('keys.json', 'r') as file:
    data = json.load(file)
    API_KEY = data[f"{school}"]
    # API_KEY = file.read()         # this is when I was just reading the file as a text file
    # API_KEY = API_KEY.rstrip("\r\n")

headers = { "Authorization": f"Bearer {API_KEY}" }

# Canvas API details
BASE_URL = f"https://{school}.instructure.com/api/v1"

# Get group categories
def getCategories(courseId):
    response = requests.get( f"{BASE_URL}/courses/{courseId}/group_categories", headers=headers )
    response.raise_for_status()
    return response.json()

# Get all groups within the specified group category
def getGroups(catId):
    response = requests.get( f"{BASE_URL}/group_categories/{catId}/groups?per_page=20", headers=headers )
    response.raise_for_status()
    return response.json()

# Get members in each group
def getGroupMembers(group_id):
    response = requests.get( f"{BASE_URL}/groups/{group_id}/users", headers=headers )
    response.raise_for_status()
    return response.json()

# Get details on a student
def getStudent(studentId, member):
    try:
        response = requests.get( f"{BASE_URL}/users/{studentId}/profile", headers=headers )
        response.raise_for_status()  # Raise an HTTPError if the response was unsuccessful
        st = response.json()
        # Get the last and first names
        lastName, rest = st['sortable_name'].split(", ")
        firstName = rest.split(" ")[0]
        # - {st['time_zone'].ljust(15)[:15]} 
        print(f"\t- {firstName.ljust(10)[:10]} {lastName.ljust(15)} {st['primary_email']} - {st['time_zone'].ljust(15)[:15]} ")

    except requests.exceptions.RequestException as e:
        # Handle any HTTP or connection errors
        print(f"\t- {member["name"]} has dropped the course")
    
# Get members not in a group
def getUnassigned(groupId):
    response = requests.get( f"{BASE_URL}/group_categories/{groupId}/users?unassigned=true", headers=headers )
    response.raise_for_status()
    members = response.json()
    for member in members:
        getStudent(member['id'], member)

# traverse from the categories in a course to the groups to the members
def listMembers(group):
    print(f"{group['name']} # in Group: {group['members_count']} ")
    members = getGroupMembers(group['id'])
    for member in members:
        getStudent(member['id'], member)

# Main code
def listTeamMembers(courseId):
    courses = getCategories(courseId)
    for course in courses:
        print(f"{course['name']} (ID: {course['id']})")
        # if we are only interestin 'U'nassigned this is the route to take
        if single == "u":
            getUnassigned(course['id'])
            break

        groups = getGroups(course['id'])
        for group in groups:
            if group['members_count'] == 0:
                continue

            if (group['members_count'] == 1 and single == "1") or single == "0":
                listMembers(group)

listTeamMembers(courseId)
