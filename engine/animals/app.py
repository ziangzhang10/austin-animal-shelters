import os
import numpy as np
import pandas as pd


import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template, url_for
from flask_sqlalchemy import SQLAlchemy
#from flask_bootstrap import Bootstrap

import sqlite3

app = Flask(__name__)
#Bootstrap(app) 


#################################################
# Database Setup
#################################################

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/austin_animals_db.sqlite" # for local
#app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL_1', '') # for heroku
db = SQLAlchemy(app)


# # reflect an existing database into a new model
# Base = automap_base()
# # reflect the tables
# Base.prepare(db.engine, reflect=True)

# # Save references to each table
# Samples_Metadata = Base.classes.sample_metadata
# Samples = Base.classes.samples


@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

@app.route("/map")
def map():
   return render_template("map.html")
 
#    engine = create_engine("sqlite:///db/austin_animals_db.sqlite")
#    mappy_str = "select i.*,  \
#                   o.age_upon_outcome, o.date_of_birth, o.datetime as outcome_datetime,    \
#                   o.outcome_subtype, o.outcome_type, o.sex_upon_outcome, m.HouseholdIncome  \
#                   from austin_animal_intake as i \
#                   left join austin_animal_outcomes as o on i.animal_id = o.animal_id \
#                   inner join austin_income as m where i.zipcode = m.ZipCode"
#    mappy_df = pd.read_sql_query(mappy_str, con=engine)
#   # Return a list of the column names (sample names)
#    # Return a list of the column names (sample names)
   # return jsonify(mappy_df)

@app.route("/bardata")
def bardata():
   THIS_FOLDER = os.path.dirname(os.path.abspath(__file__))
   my_file = os.path.join(THIS_FOLDER, 'static', 'csv', 'fulldata.csv')
   path_data = (my_file)
   full_data_df = pd.read_csv(path_data)
   count_data = full_data_df.groupby(['zipcode'])['animal_type'].count().reset_index()
   # creating an empty dataframe to hold our summary data for the stacked bar chart 
   data_sum = pd.DataFrame()

   # number of cases
   data_sum['number_cases'] = full_data_df.groupby(['zipcode'])['animal_type'].count()

   # number of dogs 
   dogs_df = full_data_df[full_data_df['animal_type'].str.match('Dog')]
   data_sum['dog'] = dogs_df.groupby(['zipcode'])['animal_type'].count()

   # number of cats 
   cats_df = full_data_df[full_data_df['animal_type'].str.match('Cat')]
   data_sum['cat'] = cats_df.groupby(['zipcode'])['animal_type'].count()

   # number of birds
   birds_df = full_data_df[full_data_df['animal_type'].str.match('Bird')]
   data_sum['bird'] = birds_df.groupby(['zipcode'])['animal_type'].count()

   # number of other animals
   other_df = full_data_df[full_data_df['animal_type'].str.match('Other')]
   data_sum['other'] = other_df.groupby(['zipcode'])['animal_type'].count()

   # fill the NaNs with zeros
   cases_per_zip = data_sum.fillna(0)

   # reset index 
   cases_per_zip = cases_per_zip.reset_index()
   

   # using dictionary to convert specific columns 
   convert_dict = {'zipcode': 'str', 
                  'number_cases': int,
                  'dog': int,
                  'cat': int,
                  'bird': int,
                  'other': int,
                  } 
   
   cases_per_zip = cases_per_zip.astype(convert_dict)


   # Re-order the sample data by descending order of "sample_values"
   cases_per_zip = cases_per_zip.sort_values(by=['number_cases'], ascending=False)

   results = cases_per_zip.to_json(orient='records')
   #"""Return the MetaData for a given sample."""
   # sel = [
   #      Samples_Metadata.zipcode,
   #      Samples_Metadata.number_cases,
   #      Samples_Metadata.dog,
   #      Samples_Metadata.cat,
   #      Samples_Metadata.bird,
   #      Samples_Metadata.other
   #  ]
   # results = db.session.query(*sel).filter(Samples_Metadata.zipcode == zipcode).all()
   # # Create a dictionary entry for each row of metadata information
   # sample_metadata = {}
   # for result in results:
   #      sample_metadata["zipcode"] = result[0]
   #      sample_metadata["number_cases"] = result[1]
   #      sample_metadata["dog"] = result[2]
   #      sample_metadata["cat"] = result[3]
   #      sample_metadata["bird"] = result[4]
   #      sample_metadata["other"] = result[5]

   # print(sample_metadata)
   return jsonify(results)

@app.route("/bargraph")
def bargraph():
   """Return graphs."""

   # Return a list of the column names (sample names)
   return render_template("bargraph.html")

##################
@app.route("/scatterdata")
def scattersdata():
   THIS_FOLDER = os.path.dirname(os.path.abspath(__file__))
   my_file = os.path.join(THIS_FOLDER, 'static', 'csv', 'fulldata.csv')
   path_data = (my_file)
   full_data_df = pd.read_csv(path_data)
   # code to clean data for scatter plot 
# empty dataframe to hold final data
   scatter_df = pd.DataFrame()

   columns_needed = ['breed', 'animal_type', 'date', 
            'animal_type_cum', 'ave_hsIncome','count_breed_cum']
# adding columns from full data dataframe 
   scatter_df[['breed', 'animal_type', 'date','ave_hsIncome']] = full_data_df[['breed',
                                                                            'animal_type',
                                                                            'datetime',
                                                                            'HouseholdIncome']]
# convert date dtype to datetime 
   scatter_df['date'] = pd.to_datetime(scatter_df['date'])
# sort df by breed and date 
   scatter_df.sort_values(by=['breed', 'date'], inplace=True, ascending=[True, True])
# save it into a new sorted dataframe
   sorted_df = scatter_df
# adding a cumulative count columns by breed
   sorted_df['breed_cumsum'] = sorted_df.groupby('breed').cumcount() + 1
# get rid of $ sign to do some arithmetic 
   sorted_df['ave_hsIncome'] = sorted_df['ave_hsIncome'].str.replace('$', '')
# getting rid of the (,) comma then setting column data type as float
   sorted_df['ave_hsIncome'] = sorted_df['ave_hsIncome'].str.replace(',', '').astype(float)

# calculating the cumulative mean household income by breed
   sorted_df['cum_mean'] = round((sorted_df.groupby(['breed'])['ave_hsIncome'].cumsum()) / sorted_df.breed_cumsum)

# reset index 
   sorted_df = sorted_df.reset_index()

# can't even explain this step and I'm sure no one will ever notice
   sorted_df = sorted_df[['breed','animal_type','date','ave_hsIncome','breed_cumsum','cum_mean']]

# convert 'date' column back to string
   sorted_df['date'] = sorted_df['date'].astype(str)
# get rid of 
   sorted_df['date'] = [x.split(' ')[0] for x in sorted_df['date']]
# start stop and step variables 
   start, stop, step = 5, 7, 1
# slice
   sorted_df["date"]= sorted_df["date"].str.slice(start, stop)
# save date 
# sorted_df['date'] = pd.to_datetime(sorted_df['date'])
   sorted_df2 = sorted_df

# empty list to hold dataframes for each breed
   empty = []

# loop through unique values of breed 
   for i in sorted_df2.breed.unique():
      empty.append(sorted_df2[sorted_df2['breed']==i])

# empty list to hold dataframes with dropped repeated months
# we will only keep the last corresponding cumulative month
# we also reset the index for each dataframe 
   full_list = []
   for i in empty:
      full_list.append(i.drop_duplicates(subset='date', keep='last').reset_index())
    
   for i in range(len(full_list)):
      # check if '01' is in the dataframe
      # if month of Jan '01' doesn't exist add the breed and animal type and zeros for the rest
      if full_list[i]['date'].isin(['01']).any() == True:
         pass
      else:
       # Pass the row elements as key value pairs to append() function
       # get breed string at index 0 location 1, animal type at location 2
         full_list[i] = full_list[i].append({'index': 'jan',
                                              'breed' :full_list[i].iloc[0][1] ,
                                              'animal_type':full_list[i].iloc[0][2],
                                              'date' : '01',
                                              'ave_hsIncome':0,
                                              'breed_cumsum':0, 
                                              'cum_mean':0}, 
                                             ignore_index=True)

    ## Step 3

    # Check if '02' exists
    # if exists pass, otherwise add zeros
      if full_list[i]['date'].isin(['02']).any() == True:
         pass

      else:
       # pass the new row element for month 2
       # breed at location 0 after sorting values
         full_list[i] =full_list[i].append({'index': 'feb','breed' : full_list[i].iloc[0][1] ,
                                             'animal_type':full_list[i].iloc[0][2],
                                             'date' : '02',
                                             'ave_hsIncome':0,
                                             'breed_cumsum':0,
                                            'cum_mean':0} , ignore_index=True)
    ## Step 4

    # check if '03' exists
    # if exists pass otherwise
      if full_list[i]['date'].isin(['03']).any() == True:
         pass

      else:
       # pass the new row element for month 2
       # breed at location 0 after sorting values
         full_list[i] = full_list[i].append({'index': 'mar','breed' : full_list[i].iloc[0][1] ,
                                             'animal_type':full_list[i].iloc[0][2],
                                             'date' : '03',
                                             'ave_hsIncome':0,
                                             'breed_cumsum':0,
                                             'cum_mean':0} , ignore_index=True)

        

# concat all resulting dataframes into one.
   sorted_step1 = pd.concat(full_list)

# final df
   final_data = sorted_step1[['breed','animal_type','date','ave_hsIncome','breed_cumsum','cum_mean']]

# sort by breed and date 
   final_data.sort_values(by=['breed', 'date'], inplace=True, ascending=[True, True])

# more meaningful dates
   final_df = final_data.replace({'date': {'01': 'By Jan-31-2019', '02': 'By Feb-28-2019', '03':'By Mar-31-2019'}})
   

   results = final_df.to_json(orient='records')
  
   return jsonify(results)

@app.route("/scatter")
def scatter():
   """Return graphs."""

   # Return a list of the column names (sample names)
   return render_template("scatter.html")
#################

# @app.route("/scatter")
# def scatter():
#    """Return scatter plot."""
#    engine = create_engine("sqlite:///db/austin_animals_db.sqlite")

#    select_str = "select i.*,  \
#                    o.age_upon_outcome, o.date_of_birth, o.datetime as outcome_datetime,    \
#                    o.outcome_subtype, o.outcome_type, o.sex_upon_outcome, m.HouseholdIncome  \
#                    from austin_animal_intake as i \
#                    left join austin_animal_outcomes as o on i.animal_id = o.animal_id \
#                    inner join austin_income as m where i.zipcode = m.ZipCode"

#    select_df = pd.read_sql_query(select_str, con=engine)
#    # Return a list of the column names (sample names)
#    #return select_df
#    return render_template("scatter.html")

@app.route("/update_db")
def update_db():
   update_database(sqldbpath)




if __name__ == "__main__":
    app.run()
