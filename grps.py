import requests

# Canvas API details
BASE_URL = "https://byui.instructure.com"
API_KEY = "10706~XHLecHtLFD62TmkYUVKwZRW4mcHcFuKrwJzQMavzhwfDkfh8QKzPw7HnMwB9LHyR"
COURSE_ID = "295338"
GROUP_CATEGORY_ID = "310354"

headers = {
    "Authorization": f"Bearer {API_KEY}"
}

# Step 2: Get all groups within the specified group category
def get_groups():
    response = requests.get(
        f"{BASE_URL}/api/v1/group_categories/{GROUP_CATEGORY_ID}/groups",
        headers=headers
    )
    response.raise_for_status()
    return response.json()

# Step 3: Get members in each group
def get_group_members(group_id):
    response = requests.get(
        f"{BASE_URL}/api/v1/groups/{group_id}/users",
        headers=headers
    )
    response.raise_for_status()
    return response.json()

# Main code
def list_team_members():
    groups = get_groups()
    for group in groups:
        if group['members_count'] == 0:
            continue
        group_id = group['id']
        group_name = group['name']
        print(f"Team: {group_name}")
        
        members = get_group_members(group_id)
        for member in members:
            print(f"\t- {member['name']} (ID: {member['id']})")

# Run the function
list_team_members()