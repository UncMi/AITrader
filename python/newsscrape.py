import requests
from bs4 import BeautifulSoup
import json
import re

def scrape_economic_calendar():
    url = 'https://www.babypips.com/economic-calendar?'
    response = requests.get(url)

    if response.status_code != 200:
        raise Exception(f"Failed to load page {url}")

    soup = BeautifulSoup(response.text, 'html.parser')
    events = []

    thead = soup.find('thead')
    if thead:
        date_th = thead.find('th', class_='Table-module__date___Foxsr Table-module__withDivider___CSLsc')
        if date_th:
            date = date_th.get_text(strip=True)
        else:
            date = None
    else:
        date = None

    for tr in soup.find_all('tr', id=lambda x: x and x.startswith('event')):
        currency = tr.find('td', class_=re.compile(r'Table-module__currency')).get_text(strip=True) if tr.find('td', class_=re.compile(r'Table-module__currency')) else None
        
        if currency in ["USD", "EUR"]:
            event_data = {
                'id': tr.get('id'),
                'date': date,
                 'name': tr.find('td', class_=re.compile(r'Table-module__name')).get_text(strip=True) if tr.find('td', class_=re.compile(r'Table-module__name')) else None,
                'time': tr.find('td', class_=re.compile(r'Table-module__time')).get_text(strip=True) if tr.find('td', class_=re.compile(r'Table-module__time')) else None,
                'currency': currency,
                'impact': tr.find('td', class_=re.compile(r'Table-module__impact')).get_text(strip=True) if tr.find('td', class_=re.compile(r'Table-module__impact')) else None,
                'forecast': tr.find('td', class_=re.compile(r'Table-module__forecast')).get_text(strip=True) if tr.find('td', class_=re.compile(r'Table-module__forecast')) else None,
                'previous': tr.find('td', class_=re.compile(r'Table-module__previous')).get_text(strip=True) if tr.find('td', class_=re.compile(r'Table-module__previous')) else None,
            }
            events.append(event_data)
    
    return events

if __name__ == "__main__":
    events = scrape_economic_calendar()
    print(json.dumps(events))  # Output JSON
