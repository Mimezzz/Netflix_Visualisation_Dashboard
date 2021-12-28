from collections import Counter
import pandas as pd
import datetime as dt
from flask import Flask, render_template, redirect,jsonify
from flask_pymongo import PyMongo
import pymongo
import csv
import json
import pandas as pd
import requests
import json


response = requests.get('http://127.0.0.1:5000/netflixdata').json()
    # print(data)

df = pd.DataFrame.from_dict(pd.json_normalize(response), orient='columns')

df=df.drop('show_id', axis=1)

description_list=df.description

response = requests.get('http://127.0.0.1:5000/stopwords').json()
    # print(response)
stopwords=[]
for dic in response:
    for key,value in dic.items():
        stopwords.append(value)

print(stopwords)


word_list=[]
word_frequency={}

for entry in description_list:
    word_list=entry.split()
    #     print(word_list)
        
    for key in word_list:
        if key.lower() not in stopwords:
            if key not in word_frequency:
                word_frequency[key] =1

            else:
                word_frequency[key] += 1
        else:
            pass
    word_list=[]
        
print(word_frequency)

data_items = word_frequency.items()
data_list = list(data_items)
df = pd. DataFrame(data_list) 
print(df)
df.columns=['word','value']
df=df.sort_values(by='value', ascending=False)
df=df.drop([551,95])

data_30=df.head(30).to_dict(orient='records')
    # import data into mongodb
conn = "mongodb://localhost:27017"
client = pymongo.MongoClient(conn)
db=client['Netflix']

col1=db.top30
if col1.drop():
    print('Deleted')
else:
    col1=db.top30
col1.insert_many(data_30)

data_50=df.head(50).to_dict(orient='records')
col2=db.top50
if col2.drop():
    print('Deleted')
else:
    col2=db.top50
col2.insert_many(data_50)

data_100=df.head(100).to_dict(orient='records')
col3=db.top100
if col3.drop():
    print('Deleted')
else:
    col3=db.top100
col3.insert_many(data_100)

