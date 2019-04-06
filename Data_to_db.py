# Imports from standard Python libraries
import requests
import json
from pprint import pprint
import pandas as pd
import datetime as dt
import numpy as np
from bs4 import BeautifulSoup as bs

# Imports from local files
from mykeys import austin_key, gkey
from dbfuncs import create_db_engine, drop_table, build_table, add_geodata
from pathnames import AustinIncome_url, austin_url, outcome_dataset, intake_dataset
from scrape_zipcodes import scrape_austin_income, zipcode_lookup, geo_lookup
from animal_data import query_animal_data


# Create the sqlite engine here with a function call. There will be multiple tables added to this db.
engine = create_db_engine("sqlite://")


# Get the income and zipcode data through a web scrape
income_df = scrape_austin_income(AustinIncome_url)

# Modify a few of the column names
chg_cols = {"Zip Code" : "ZipCode", "Avg. Income/H/hold": "HouseholdIncome", "National Rank" :"NationalRank"}
income_df.rename(inplace=True, columns = chg_cols)


# # Build the db from Pandas with this table
# # Right now, this is just in memory, not stored. Need to decide. We could just 
# # recreate every time the page is loaded.
build_table(income_df,"austin_income", engine)



# Now to get the animal outcomes data
outcome_df = query_animal_data(austin_url, outcome_dataset, "'2019-01-01T00:00:00.000'")

# And add the animal outcomes table
build_table(outcome_df,"austin_animal_outcomes", engine)

# Get the animal intake data
intake_df = query_animal_data(austin_url, intake_dataset, "'2019-01-01T00:00:00.000'")

# And build the animal intake table
build_table(intake_df,"austin_animal_intake", engine)

# Add the geodata to the animal intake data
addresses = engine.execute('select animal_id, found_location from austin_animal_intake').fetchall()[1:200]
add_geodata(addresses, engine)



# These are examples of how to get data, using dataframes

# test_df = pd.read_sql_query("SELECT * FROM austin_animal_intake WHERE zipcode == 'None'", con=engine)
# test_df

# test_df.to_csv("Resources/test_intake_data.csv")

# test2_df = pd.read_sql_query("SELECT * from austin_animal_outcomes", con=engine)

# test2_df.to_csv("Resources/test_outcomes_data.csv")


# select_str = "select i.*,  \
#                 o.age_upon_outcome, o.date_of_birth, o.datetime as outcome_datetime,    \
#                 o.outcome_subtype, o.outcome_type, o.sex_upon_outcome, m.HouseholdIncome  \
#                 from austin_animal_intake as i \
#                 left join austin_animal_outcomes as o on i.animal_id = o.animal_id \
#                 inner join austin_income as m where i.zipcode = m.ZipCode"
              
# select_df = pd.read_sql_query(select_str, con=engine)

# select_df.head()

# select_df.to_csv("Resources/fulldata.csv")

