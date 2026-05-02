from bs4 import BeautifulSoup
import requests
import json
import os

def scrape_internshala():
    print("Scraping Internshala for computer science internships...")
    url = "https://internshala.com/internships/computer-science-internship"
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
    
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        print(f"Failed to fetch internshala: {response.status_code}")
        return []
        
    soup = BeautifulSoup(response.text, 'html.parser')
    results = []
    
    # Try different possible selectors for Internshala (it changes often)
    containers = soup.select(".internship_meta")
    if not containers:
        containers = soup.select(".individual_internship")
        
    for c in containers[:50]:
        try:
            title_elem = c.select_one(".profile a") or c.select_one(".job-title-href") or c.select_one(".profile")
            company_elem = c.select_one(".company_name") or c.select_one(".company-name")
            
            if not title_elem or not company_elem:
                continue
                
            title = title_elem.text.strip()
            company = company_elem.text.strip()
            
            results.append({
                "title": title,
                "company": company,
                "skills_required": f"Computer Science Internship at {company}. Skills: programming, web development, software engineering.",
                "location": "Remote / India",
                "type": "internship"
            })
        except Exception as e:
            continue
            
    return results

if __name__ == '__main__':
    internships = scrape_internshala()
    print(f"Scraped {len(internships)} internships.")
    
    os.makedirs('data', exist_ok=True)
    
    try:
        with open('data/opportunities.json', 'r') as f:
            existing = json.load(f)
    except FileNotFoundError:
        existing = []
        
    existing_keys = {f"{e['title']}-{e['company']}" for e in existing}
    added_count = 0
    for i in internships:
        if f"{i['title']}-{i['company']}" not in existing_keys:
            existing.append(i)
            added_count += 1
            
    with open('data/opportunities.json', 'w') as f:
        json.dump(existing, f, indent=2)
        
    print(f"Added {added_count} new internships. Total opportunities: {len(existing)}")
