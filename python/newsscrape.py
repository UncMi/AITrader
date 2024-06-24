import requests
from bs4 import BeautifulSoup
import json
import re
from datetime import datetime, timedelta
import pytz

def scrape_economic_calendar():
    url = 'https://www.babypips.com/economic-calendar?'
    response = requests.get(url)

    if response.status_code != 200:
        raise Exception(f"Failed to load page {url}")

    soup = BeautifulSoup(response.text, 'html.parser')
    events = []

    # Get current time in GMT+3
    gmt3 = pytz.timezone('Etc/GMT-3')
    current_time_gmt3 = datetime.now(gmt3)

    # Find all theads to get dates for each table
    all_theads = soup.find_all('thead')

    # Iterate through each thead to get date information
    for thead in all_theads:
        date_th = thead.find('th', class_='Table-module__date___Foxsr Table-module__withDivider___CSLsc')
        if date_th:
            date_str = date_th.get_text(strip=True)
            # Parse the date (assuming it's in the format 'MonDD')
            date = datetime.strptime(date_str, '%b%d').replace(year=current_time_gmt3.year)
        else:
            date = None

        # Find all trs (events) for this specific table (thead)
        for tr in thead.find_next_sibling('tbody').find_all('tr', id=lambda x: x and x.startswith('event')):
            currency = tr.find('td', class_=re.compile(r'Table-module__currency')).get_text(strip=True) if tr.find('td', class_=re.compile(r'Table-module__currency')) else None

            if currency in ["USD", "EUR"]:
                time_str = tr.find('td', class_=re.compile(r'Table-module__time')).get_text(strip=True) if tr.find('td', class_=re.compile(r'Table-module__time')) else None

                if time_str and time_str != 'All Day':
                    # Parse event time
                    event_time = datetime.strptime(time_str, '%H:%M').time()
                    # Combine date and time
                    event_datetime = datetime.combine(date.date(), event_time)

                    # Convert event datetime to GMT+3
                    event_datetime_gmt3 = gmt3.localize(event_datetime)

                    # Compare with current time in GMT+3
                    if event_datetime_gmt3 > current_time_gmt3:
                        event_data = {
                            'id': tr.get('id'),
                            'date': date_str,
                            'name': tr.find('td', class_=re.compile(r'Table-module__name')).get_text(strip=True) if tr.find('td', class_=re.compile(r'Table-module__name')) else None,
                            'time': time_str,
                            'currency': currency,
                            'impact': tr.find('td', class_=re.compile(r'Table-module__impact')).get_text(strip=True) if tr.find('td', class_=re.compile(r'Table-module__impact')) else None,
                            'forecast': tr.find('td', class_=re.compile(r'Table-module__forecast')).get_text(strip=True) if tr.find('td', class_=re.compile(r'Table-module__forecast')) else None,
                            'previous': tr.find('td', class_=re.compile(r'Table-module__previous')).get_text(strip=True) if tr.find('td', class_=re.compile(r'Table-module__previous')) else None,
                        }
                        events.append(event_data)

    return events

if __name__ == "__main__":
    events = scrape_economic_calendar()
    print(json.dumps(events, indent=2))  # Output JSON
