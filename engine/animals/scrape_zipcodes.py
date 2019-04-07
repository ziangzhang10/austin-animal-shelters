from bs4 import BeautifulSoup as bs
from splinter import Browser
import pandas as pd
from pathnames import google_geocode_url
from mykeys import gkey
import requests

def scrape_austin_income(url):
    executable_path = {"executable_path": "chromedriver"}
    browser = Browser("chrome", **executable_path, headless=True)
    browser.visit(url)
    browser.is_element_present_by_id('ct100_ContentPlaceHolder1_final_content', wait_time=10)
    html = browser.html
    soup = bs(html, 'html.parser')
    browser.quit()
    
    incometable = soup.select_one("table:nth-of-type(16)")
    income_df = pd.read_html(str(incometable), header=0)[0]

    return(income_df)

def zipcode_lookup(address_components, formatted_address):
    found = False
    for component in address_components:
        if component["types"][0] == "postal_code":
            zipcode = component["long_name"]
            found = True
        elif formatted_address == "Austin, TX, USA":
            zipcode = "78702"
            found = True
        else:
            None
    if not found:
        zipcode = None
    return zipcode
    

def geo_lookup(geo_data):
    if geo_data["status"] == "OK":
        loc_dict = geo_data["results"][0]["geometry"]["location"]
        address_components = geo_data["results"][0]["address_components"]
        zipcode = zipcode_lookup(address_components, geo_data["results"][0]["formatted_address"])
        if zipcode is not None:
            loc_dict.update({"zipcode" : zipcode})
        else:
            target_url = ("{0}json?latlng={1},{2}&key={3}").format(google_geocode_url, str(loc_dict["lat"]), str(loc_dict["lng"]), gkey)
            zipdata = requests.get(target_url).json()
            zipcode = zipcode_lookup(zipdata["results"][0]["address_components"], "")
            if zipcode is not None:
                loc_dict.update({"zipcode" : zipcode})
            else:
                print("zipcode STILL NOT FOUND")
        return loc_dict