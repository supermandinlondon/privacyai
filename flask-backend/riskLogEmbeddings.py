# To start server for developmen run: $env:FLASK_APP = "app" and then run flask run --host=0.0.0.0 --port=5001


import sys
import os
import numpy as np
import csv
import openai
import pinecone
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS, cross_origin
import traceback

from dotenv import load_dotenv
import string
import json

load_dotenv()

# Index name for Pinecone, but this should be updated to a better approach after development
INDEX_NAME = "risklog"

# Flask server that receives the prompt text from the frontend
app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "http://localhost:3000"}})

# Endpoint that the front end will send the prompt text to
@app.route('/api/query_embeddings', methods=['POST'])

def query_embeddings():
    print("Recveived request from frontend")  
    try:
        data = request.get_json()
        prompt = data['prompt']
        print("Received prompt from frontend:", prompt)  # Log the prompt received

        # Query the Pinecone index with the prompt
        results = search_index(prompt)
        response = make_response(jsonify(results))
        print("Sending response to frontend:", results)  # Log the response being sent
        # Response headers to allow CORS (was running into issues with this previously)
        response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'

        return response
    except Exception as e:
        print(traceback.format_exc())
        return make_response(jsonify({"error": str(e)}), 500)

# Begin querying the Pinecone index by first creating the query embedding from OpenAI
def search_index(prompt, top_k=5):
    MODEL = "text-embedding-ada-002"
    
    # Set the OpenAI API key
    print("OPENAI_API_KEY:", os.getenv("OPENAI_API_KEY"))
    openai.api_key = os.getenv("OPENAI_API_KEY")
    
    # Send the prompt to OpenAI to create the query embedding
    xq = openai.Embedding.create(input=prompt, engine=MODEL)['data'][0]['embedding']
    print("Query embedding")

    # Initialize Pinecone client
    api_key = os.getenv("PINECONE_API_KEY")
    pinecone.init(api_key=api_key, environment="us-east-1-aws")
    print("Pinecone initialized")

    # Define the Pincone index to search
    index = pinecone.Index(INDEX_NAME)
    print("Pinecone index object search")

    # Query the pinecone index, returning the top k most similar results
    res = index.query(queries=[xq], top_k=top_k, include_metadata=True)
    print("Query sent...")
    print("Pinecone query response:", res)
    

    # Format the results as a list of strings that can be returned to the frontend
    formatted_results = [
        f"{index + 1}. {match['metadata']['observation']} [{match['metadata']['principle']}]. This has a {match['metadata']['ds_harm']} Data Subject Harm and {match['metadata']['c_harm']} Controller Harm."
        for index, match in enumerate(res['results'][0]['matches'])
    ]

    # Deinitialize Pinecone
    pinecone.init()

    #send results back to frontend
    return formatted_results


# Main function
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001, debug=True)
