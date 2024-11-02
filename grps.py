import requests
import sys

# Canvas API details
BASE_URL = "https://byui.instructure.com/api/v1"
# Open the file in read mode
with open('key.txt', 'r') as file:
    # Read the contents of the file
    API_KEY = file.read()
    API_KEY = API_KEY.rstrip("\r\n")

headers = {
    "Authorization": f"Bearer {API_KEY}"
}

def get_categories(courseId):
    response = requests.get( f"{BASE_URL}/courses/{courseId}/group_categories", headers=headers )
    response.raise_for_status()
    return response.json()

# Step 2: Get all groups within the specified group category
def get_groups(catId):
    response = requests.get( f"{BASE_URL}/group_categories/{catId}/groups?per_page=20", headers=headers )
    response.raise_for_status()
    return response.json()

# Step 3: Get members in each group
def get_group_members(group_id):
    response = requests.get( f"{BASE_URL}/groups/{group_id}/users", headers=headers )
    response.raise_for_status()
    return response.json()

def getStudent(studentId):
    response = requests.get( f"{BASE_URL}/users/{studentId}/profile", headers=headers )
    response.raise_for_status()
    return response.json()

# Main code
def list_team_members(courseId):
    courses = get_categories(courseId)
    for course in courses:
        print(f"{course['name']} (ID: {course['id']})")
        
        groups = get_groups(course['id'])
        for group in groups:
            if group['members_count'] == 0:
                continue
            print(f"{group['name']}")

            members = get_group_members(group['id'])
            for member in members:
                st = getStudent(member['id'])
                # Split by comma to get lastName and the rest of the name
                lastName, rest = st['sortable_name'].split(", ")
                # Split the rest by space to get firstName and ignore middle names
                firstName = rest.split(" ")[0]
                print(f"\t- {lastName.ljust(15)}, {firstName.ljust(10)[:10]} - {st['time_zone'].ljust(15)[:15]} {st['primary_email']}")

# Run the function
courseId = "320100"
if len(sys.argv) > 1:
    courseId = sys.argv[1]

list_team_members(courseId)
