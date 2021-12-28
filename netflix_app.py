from flask import Flask, render_template, jsonify, redirect
from flask_pymongo import PyMongo
import pymongo
from bson import json_util 
import csv
import json 
import pandas as pd
from bson.json_util import loads, dumps
import os


# Create an instance of Flask
app = Flask(__name__)

# setup mongo connection
conn = "mongodb://localhost:27017"
client = pymongo.MongoClient(conn)

db=client['Netflix']

# connect to mongo db and collection



# Route to render index.html template using data from Mongo
@app.route("/")
def index():

    df=pd.read_csv('data/netflix.csv')
    print(df)
    data=df.to_dict(orient = 'records')
    col=db.netflix_data

    if col.drop():
        print('Deleted')
    else:
        col=db.netflix_data
    db.netflix_data.insert_many(data)
    # To get all data
    # netflix_data = list(netflix_visualisation.find())


    # Return template and data
    return render_template("index.html")
    # return "Welcome homepage"

@app.route('/filterindex.html')
def filterindex():
    return render_template('filterindex.html')

@app.route("/netflixdata")
def get_netflix_data():
    col=db.netflix_data
    data=col.find()
    list1=[]
    for x in data:
        del x['_id']
        list1.append(x)

    return jsonify(list1)
   
@app.route('/stopwords')
def get_stopwords():
    # add stopwords data
    df=pd.read_csv('data/stopwords.csv')
    data=df.to_dict(orient = 'records')
    col=db.stopwords

    if col.drop():
        print('Deleted')
    else:
        col=db.stopwords

    col.insert_many(data)
    data=col.find()
    list=[]
    for x in data:
        del x['_id']
        list.append(x)
    return jsonify(list)

@app.route('/top30') 
    
def get_top30():
    data=db.top30.find()
    list=[]
    for x in data:
        del x['_id']
        list.append(x)
    return jsonify(list)

@app.route('/top50')
def get_top50():
    data=db.top50.find()
    list=[]
    for x in data:
        del x['_id']
        list.append(x)
    return jsonify(list)

@app.route('/top100')
def get_top100():
    data=db.top100.find()
    list=[]
    for x in data:
        del x['_id']
        list.append(x)
    return jsonify(list)

@app.route("/year")
def year():
    # get data you need for year
    # To get all data
    
    col = db.netflix_visualisation_data
    netflix_data = list(col.find())
    jsonify_netflix_data = json.loads(json_util.dumps(netflix_data))
    # print(json.dumps(jsonify_netflix_data))
    
    # Return template and data
    return json.dumps(jsonify_netflix_data, allow_nan=False)

@app.route('/map')
def mapdata():
    df=pd.read_csv('data/streaming-platforms.csv')
    data=df.to_dict(orient = 'records')
    col=db.streaming
    if col.drop():
        print('Deleted')
    else:
        col=db.streaming

    col.insert_many(data)
    data=col.find()
    list=[]
    for x in data:
        del x['_id']
        list.append(x)
    return jsonify(list)

   

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)

    