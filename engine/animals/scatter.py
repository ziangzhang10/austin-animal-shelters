import pandas as pd


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
final_df