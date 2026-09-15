import os
import pymongo
import pandas as pd
from google.oauth2 import service_account

# --- 1. CONFIGURATION ---

# MongoDB Config (Your M0 Cluster)
MONGO_URI = "mongodb+srv://raghu18divate_db_user:yIAK8so9E1IA2DPf@medicarehospitalcluster.dey9t50.mongodb.net/?retryWrites=true&w=majority&appName=medicareHospitalCluster"
MONGO_DB_NAME = "hospital_system"
MONGO_COLLECTION = "appointments" # Or "prediction_history"

# --- Path Correction (Robust) ---
# Get the absolute path to the directory this script is in (e.g., .../Backend/scripts)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Google BigQuery Config
# Look for the credentials file in the *same directory as this script*
GCP_CREDENTIALS_PATH = os.path.join(BASE_DIR, "gcp-credentials.json") # The file you downloaded
GCP_PROJECT_ID = "ai-chatbot-475804"     # Your Google Cloud Project ID (FIXED: removed trailing space)
BIGQUERY_DATASET = "hospital_data"      # The dataset you created
BIGQUERY_TABLE = "appointments"         # The new table we will create

# --- 2. AUTHENTICATION ---
try:
    # Set the environment variable for gcloud
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = GCP_CREDENTIALS_PATH
    
    # Authenticate for pandas-gbq
    credentials = service_account.Credentials.from_service_account_file(GCP_CREDENTIALS_PATH)
    print("Google Cloud authentication successful.")

except FileNotFoundError:
    print(f"ERROR: Credentials file not found at {GCP_CREDENTIALS_PATH}")
    print("Please make sure 'gcp-credentials.json' is in the same 'scripts/' directory as this file.")
    exit()
except Exception as e:
    print(f"Error during Google Cloud authentication: {e}")
    exit()


# --- 3. EXTRACT (from MongoDB) ---
try:
    print(f"Connecting to MongoDB at {MONGO_URI}...")
    client = pymongo.MongoClient(MONGO_URI)
    db = client[MONGO_DB_NAME]
    collection = db[MONGO_COLLECTION]
    
    # Fetch all data from the collection
    data = list(collection.find())
    
    if not data:
        print(f"No data found in collection '{MONGO_COLLECTION}'.")
        exit()
        
    print(f"Successfully extracted {len(data)} documents from MongoDB.")

except pymongo.errors.ConnectionFailure as e:
    print(f"ERROR: Could not connect to MongoDB. Check connection string.\n{e}")
    exit()
except Exception as e:
    print(f"Error extracting from MongoDB: {e}")
    exit()

# --- 4. TRANSFORM (with Pandas) ---
try:
    print("Transforming data with Pandas...")
    # This is the key step: flatten the nested JSON/BSON
    df = pd.json_normalize(data)
    
    # Clean up column names for BigQuery
    # (BigQuery doesn't like dots '.' or special chars in names)
    df.columns = df.columns.str.replace(r'[^A-Za-z0-9_]', '_', regex=True)

    # Convert complex objects/lists to strings, as BigQuery prefers simple types
    for col in df.columns:
        if df[col].dtype == 'object':
            # Check if the first non-null value is a list or dict
            first_val = df[col].dropna().iloc[0] if not df[col].dropna().empty else None
            if isinstance(first_val, (list, dict)):
                df[col] = df[col].astype(str)
                
    # Convert MongoDB's ObjectId to string
    if '_id' in df.columns:
        df['_id'] = df['_id'].astype(str)
    
    print("Data successfully transformed into a flat table.")
    print("\nDataFrame Head:\n", df.head())

except Exception as e:
    print(f"Error transforming data: {e}")
    exit()


# --- 5. LOAD (to BigQuery) ---
try:
    table_id = f"{BIGQUERY_DATASET}.{BIGQUERY_TABLE}"
    print(f"Loading data into BigQuery table: {GCP_PROJECT_ID}.{table_id}...")
    
    # This command creates the table (if it doesn't exist)
    # and appends your data.
    df.to_gbq(
        destination_table=table_id,
        project_id=GCP_PROJECT_ID,
        credentials=credentials,
        if_exists='replace'  # Use 'replace' to overwrite, 'append' to add
    )
    
    print("SUCCESS: Data has been loaded into BigQuery.")

except Exception as e:
    print(f"Error loading data to BigQuery: {e}")
    exit()

