import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template, url_for
from flask_sqlalchemy import SQLAlchemy

import sqlite3

app = Flask(__name__)


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
   """Return map."""

   # Return a list of the column names (sample names)
   return render_template("map.html")

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

@app.route("/scatter")
def scatter():
   """Return scatter plot."""
   engine = create_engine("sqlite:///db/austin_animals_db.sqlite")

   select_str = "select i.*,  \
                   o.age_upon_outcome, o.date_of_birth, o.datetime as outcome_datetime,    \
                   o.outcome_subtype, o.outcome_type, o.sex_upon_outcome, m.HouseholdIncome  \
                   from austin_animal_intake as i \
                   left join austin_animal_outcomes as o on i.animal_id = o.animal_id \
                   inner join austin_income as m where i.zipcode = m.ZipCode"

   select_df = pd.read_sql_query(select_str, con=engine)
   # Return a list of the column names (sample names)
   return select_df
   #return render_template("scatter.html")

@app.route("/update_db")
def update_db():
   update_database(sqldbpath)


#@app.route("/names")
#def names():
#    """Return a list of sample names."""
#
#    # Use Pandas to perform the sql query
#    stmt = db.session.query(Samples).statement
#    df = pd.read_sql_query(stmt, db.session.bind)
#
#    # Return a list of the column names (sample names)
#    return jsonify(list(df.columns)[2:])
#
#
#@app.route("/metadata/<sample>")
#def sample_metadata(sample):
#    """Return the MetaData for a given sample."""
#    sel = [
#        Samples_Metadata.sample,
#        Samples_Metadata.ETHNICITY,
#        Samples_Metadata.GENDER,
#        Samples_Metadata.AGE,
#        Samples_Metadata.LOCATION,
#        Samples_Metadata.BBTYPE,
#        Samples_Metadata.WFREQ,
#    ]
#
#    results = db.session.query(*sel).filter(Samples_Metadata.sample == sample).all()
#
#    # Create a dictionary entry for each row of metadata information
#    sample_metadata = {}
#    for result in results:
#        sample_metadata["sample"] = result[0]
#        sample_metadata["ETHNICITY"] = result[1]
#        sample_metadata["GENDER"] = result[2]
#        sample_metadata["AGE"] = result[3]
#        sample_metadata["LOCATION"] = result[4]
#        sample_metadata["BBTYPE"] = result[5]
#        sample_metadata["WFREQ"] = result[6]
#
#    print(sample_metadata)
#    return jsonify(sample_metadata)
#
#
#@app.route("/samples/<sample>")
#def samples(sample):
#    """Return `otu_ids`, `otu_labels`,and `sample_values`."""
#    stmt = db.session.query(Samples).statement
#    df = pd.read_sql_query(stmt, db.session.bind)
#
#    # Filter the data based on the sample number and
#    # only keep rows with values above 1
#    sample_data = df.loc[df[sample] > 1, ["otu_id", "otu_label", sample]]
#
#    # Re-order the sample data by descending order of "sample_values"
#    sample_data = sample_data.sort_values(by=sample, ascending=False)
#
#    # Format the data to send as json
#    data = {
#        "otu_ids": sample_data.otu_id.values.tolist(),
#        "sample_values": sample_data[sample].values.tolist(),
#        "otu_labels": sample_data.otu_label.tolist(),
#    }
#    return jsonify(data)
#

if __name__ == "__main__":
    app.run()
