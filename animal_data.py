import requests
import pandas as pd



def query_animal_data(url, dataset, startdatetime):
    query = url + dataset + "?$where=datetime > " + startdatetime + "&$limit=10000"
    results = requests.get(query)
    results_json = results.json()
    # Convert to pandas DataFrame
    outcome_df = pd.DataFrame.from_records(results_json)
    return outcome_df

