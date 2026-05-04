import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

APP_ID = os.getenv('ADZUNA_APP_ID')
APP_KEY = os.getenv('ADZUNA_APP_KEY')

# Keyword map: profile skills/domain → better Adzuna search keywords
DOMAIN_KEYWORDS = {
    "machine learning": ["machine learning engineer", "ml engineer", "data scientist", "ai engineer"],
    "ml": ["machine learning engineer", "ai engineer", "nlp engineer"],
    "data science": ["data scientist", "data analyst", "data engineer"],
    "web": ["web developer", "frontend developer", "full stack developer"],
    "frontend": ["react developer", "frontend engineer", "ui developer"],
    "backend": ["backend developer", "python developer", "node.js developer"],
    "full stack": ["full stack developer", "mern developer", "web engineer"],
    "android": ["android developer", "mobile developer", "kotlin developer"],
    "ios": ["ios developer", "swift developer", "mobile engineer"],
    "devops": ["devops engineer", "cloud engineer", "site reliability engineer"],
    "cybersecurity": ["security engineer", "cybersecurity analyst", "ethical hacker"],
    "blockchain": ["blockchain developer", "web3 developer", "solidity developer"],
    "game": ["game developer", "unity developer", "unreal engine developer"],
    "cloud": ["cloud engineer", "aws developer", "azure engineer"],
}

SKILL_KEYWORDS = {
    "python": "python developer",
    "react": "react developer",
    "node": "nodejs developer",
    "java": "java developer",
    "flutter": "flutter developer",
    "django": "django developer",
    "fastapi": "backend python developer",
    "tensorflow": "machine learning engineer",
    "pytorch": "deep learning engineer",
    "sql": "database developer",
    "aws": "cloud engineer",
    "docker": "devops engineer",
    "kubernetes": "devops cloud engineer",
    "next.js": "nextjs frontend developer",
    "typescript": "typescript developer",
    "c++": "c++ developer",
    "rust": "rust developer",
    "golang": "golang developer",
}


def build_search_keywords(profile: dict) -> list[str]:
    """Build profile-specific search keywords for Adzuna API."""
    keywords = []
    skills = [s.lower() for s in profile.get("skills", [])]
    domain = profile.get("domain", "").lower()
    goal = profile.get("goal", "internship").lower()

    # Domain-based keywords
    for key, vals in DOMAIN_KEYWORDS.items():
        if key in domain:
            keywords.extend(vals[:2])
            break

    # Skill-based keywords
    for skill in skills[:4]:
        for sk, kw in SKILL_KEYWORDS.items():
            if sk in skill:
                keywords.append(kw)
                break

    # Fallback
    if not keywords:
        if "internship" in goal:
            keywords = ["software engineering internship", "developer internship"]
        else:
            keywords = ["software developer", "software engineer"]

    # Deduplicate
    seen = set()
    unique = []
    for k in keywords:
        if k not in seen:
            seen.add(k)
            unique.append(k)

    return unique[:3]


def fetch_jobs_for_profile(profile: dict) -> list[dict]:
    """Fetch live jobs from Adzuna based on the user's actual profile."""
    keywords = build_search_keywords(profile)
    all_jobs = []
    seen_keys = set()

    for keyword in keywords:
        try:
            url = "https://api.adzuna.com/v1/api/jobs/in/search/1"
            params = {
                "app_id": APP_ID,
                "app_key": APP_KEY,
                "results_per_page": 20,
                "what": keyword,
                "content-type": "application/json",
            }
            response = requests.get(url, params=params, timeout=10)
            if response.status_code != 200:
                print(f"[Adzuna] Error for '{keyword}': {response.status_code}")
                continue

            jobs = response.json().get("results", [])
            for j in jobs:
                key = f"{j.get('title','')}-{j.get('company',{}).get('display_name','')}"
                if key in seen_keys:
                    continue
                seen_keys.add(key)
                all_jobs.append({
                    "title": j.get("title", ""),
                    "company": j.get("company", {}).get("display_name", "Unknown"),
                    "skills_required": j.get("description", "")[:400],
                    "location": j.get("location", {}).get("display_name", "India"),
                    "type": "job",
                    "url": j.get("redirect_url", ""),
                    "salary_min": j.get("salary_min"),
                    "salary_max": j.get("salary_max"),
                    "search_keyword": keyword,
                })
        except Exception as e:
            print(f"[Adzuna] Failed for keyword '{keyword}': {e}")

    print(f"[Adzuna] Fetched {len(all_jobs)} live jobs for profile: {keywords}")
    return all_jobs


def fetch_internshala_for_profile(profile: dict) -> list[dict]:
    """Fetch profile-specific internships from Internshala."""
    skills = [s.lower() for s in profile.get("skills", [])]
    domain = profile.get("domain", "").lower()

    # Map to Internshala category slugs
    category_map = {
        "python": "python",
        "react": "web-development",
        "machine learning": "machine-learning",
        "ml": "machine-learning",
        "data science": "data-science",
        "web": "web-development",
        "android": "android-development",
        "flutter": "app-development",
        "java": "java",
        "blockchain": "blockchain",
        "cloud": "cloud-computing",
        "devops": "devops",
        "ai": "artificial-intelligence",
    }

    slug = "computer-science"  # default
    for key, val in category_map.items():
        if key in domain or any(key in s for s in skills):
            slug = val
            break

    try:
        url = f"https://internshala.com/internships/{slug}-internship"
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
        resp = requests.get(url, headers=headers, timeout=8)
        if resp.status_code != 200:
            return []

        from bs4 import BeautifulSoup
        soup = BeautifulSoup(resp.text, "html.parser")
        results = []
        containers = soup.select(".internship_meta") or soup.select(".individual_internship")

        for c in containers[:20]:
            try:
                title_elem = c.select_one(".profile a") or c.select_one(".job-title-href") or c.select_one(".profile")
                company_elem = c.select_one(".company_name") or c.select_one(".company-name")
                if not title_elem or not company_elem:
                    continue
                title = title_elem.text.strip()
                company = company_elem.text.strip()
                stipend_elem = c.select_one(".stipend")
                stipend = stipend_elem.text.strip() if stipend_elem else ""
                results.append({
                    "title": title,
                    "company": company,
                    "skills_required": f"{slug.replace('-', ' ').title()} internship. Skills: {', '.join(skills[:5]) or 'programming, software development'}.",
                    "location": "Remote / India",
                    "type": "internship",
                    "stipend": stipend,
                    "url": url,
                    "search_keyword": slug,
                })
            except Exception:
                continue

        print(f"[Internshala] Fetched {len(results)} internships for slug: {slug}")
        return results
    except Exception as e:
        print(f"[Internshala] Failed: {e}")
        return []


def fetch_all_for_profile(profile: dict) -> list[dict]:
    """Fetch live, profile-specific data from both sources."""
    jobs = fetch_jobs_for_profile(profile)
    internships = fetch_internshala_for_profile(profile)
    all_opps = jobs + internships
    print(f"[fetch_all] Total live opportunities: {len(all_opps)}")
    return all_opps


# Legacy function for backward compat
def fetch_jobs():
    """Original static fetch — kept for manual seeding."""
    print("Fetching generic jobs from Adzuna...")
    url = "https://api.adzuna.com/v1/api/jobs/in/search/1"
    params = {"app_id": APP_ID, "app_key": APP_KEY, "results_per_page": 50, "what": "developer"}
    response = requests.get(url, params=params)
    if response.status_code != 200:
        print(f"Error: {response.text}")
        return
    jobs = response.json().get('results', [])
    cleaned = [{"title": j["title"], "company": j["company"]["display_name"], "skills_required": j.get("description", "")[:300], "location": j["location"]["display_name"], "type": "job"} for j in jobs]
    os.makedirs('data', exist_ok=True)
    try:
        with open("data/opportunities.json", "r") as f:
            existing = json.load(f)
    except FileNotFoundError:
        existing = []
    existing_keys = {f"{e['title']}-{e['company']}" for e in existing}
    for c in cleaned:
        if f"{c['title']}-{c['company']}" not in existing_keys:
            existing.append(c)
    with open("data/opportunities.json", "w") as f:
        json.dump(existing, f, indent=2)
    print(f"Done. Total: {len(existing)}")


if __name__ == '__main__':
    fetch_jobs()
