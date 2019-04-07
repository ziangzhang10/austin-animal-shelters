from pathnames import google_geocode_url
from mykeys import gkey
import requests
from scrape_zipcodes import geo_lookup

# Get ready for sqlite

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base

# Allow us to declare column types
from sqlalchemy import Column, Integer, String, Float 

def drop_table(engine, table):
    engine.execute("drop " + table)


def create_db_engine(dbname):
    engine = create_engine(dbname, echo=False)
    return engine

def build_table(df, tablename, engine):
    df.to_sql(tablename, con=engine, if_exists="replace", dtype={col_name: String for col_name in df})

def add_geodata(addresses, engine):
    try:
        engine.execute('ALTER TABLE austin_animal_intake ADD COLUMN "lat" VARCHAR')
    except:
        print("COLUMN lat EXISTS")
    try:
        engine.execute('ALTER TABLE austin_animal_intake ADD COLUMN "long" VARCHAR')
    except:
        print("COLUMN lng EXISTS")
    try:
        engine.execute('ALTER TABLE austin_animal_intake ADD COLUMN "zipcode" VARCHAR')
    except:
        print("COLUMN zipcode EXISTS")

    for address in addresses:
    #     print(address.found_location)
        target_url = ('{0}json?address={1}&key={2}').format(google_geocode_url, address.found_location, gkey)
    #     print(target_url)
        geo_data = requests.get(target_url).json()
    #     pprint(geo_data)
        geo_result = geo_lookup(geo_data)
    #     pprint(geo_result)
    # Update the sqlite table with the new information
        if geo_result is not None:
    #         print(geo_result)
            update_str = "UPDATE austin_animal_intake SET lat= '" +  str(geo_result["lat"]) + "', long= '" + str(geo_result["lng"]) + "', zipcode= '" + geo_result["zipcode"] + "' WHERE animal_id='" + address.animal_id + "'"
    #         print(update_str)
            engine.execute(update_str)