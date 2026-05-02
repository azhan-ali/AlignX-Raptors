import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

APP_ID = os.getenv('ADZUNA_APP_ID')
APP_KEY = os.getenv('ADZUNA_APP_KEY')

def fetch_jobs():
    print("Fetching jobs from Adzuna...")
    url = "https://api.adzuna.com/v1/api/jobs/in/search/1"
    params = {
        "app_id": APP_ID, 
        "app_key": APP_KEY,
        "results_per_page": 50,
        "what": "developer",
    }
    response = requests.get(url, params=params)
    
    if response.status_code != 200:
        print(f"Error fetching data: {response.text}")
        return
        
    jobs = response.json().get('results', [])
    print(f"Fetched {len(jobs)} jobs.")
    
    cleaned = [{
        "title": j["title"],
        "company": j["company"]["display_name"],
        "skills_required": j.get("description", "")[:300],
        "location": j["location"]["display_name"],
        "type": "job"
    } for j in jobs]
    
    os.makedirs('data', exist_ok=True)
    
    try:
        with open("data/opportunities.json", "r") as f:
            existing = json.load(f)
    except FileNotFoundError:
        existing = []
        
    existing_keys = {f"{e['title']}-{e['company']}" for e in existing}
    added_count = 0
    for c in cleaned:
        if f"{c['title']}-{c['company']}" not in existing_keys:
            existing.append(c)
            added_count += 1
            
    with open("data/opportunities.json", "w") as f:
        json.dump(existing, f, indent=2)
        
    print(f"Successfully added {added_count} new opportunities. Total: {len(existing)}")

if __name__ == '__main__':
    fetch_jobs()
