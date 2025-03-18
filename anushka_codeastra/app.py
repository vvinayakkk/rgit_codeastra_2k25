from flask import Flask, request, jsonify
from flask_cors import CORS
import pymongo
from bson.json_util import dumps
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# MongoDB connection
try:
    client = pymongo.MongoClient("mongodb+srv://anushkashendge22:hpawKlAnejS3FpRD@cluster0.9sesw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    db = client.get_database("product_db")  # Use/create a database named product_db
    product_listings = db.product_listings  # Access collection named product_listings
    
    # Test the connection
    client.server_info()
    print("Connected to MongoDB successfully!")
except pymongo.errors.ConnectionFailure as e:
    print(f"Could not connect to MongoDB: {e}")
except pymongo.errors.ConfigurationError as e:
    print(f"MongoDB configuration error: {e}")
except Exception as e:
    print(f"An error occurred: {e}")

@app.route('/api/products', methods=['GET'])
def get_products():
    try:
        products = list(product_listings.find({}))
        return dumps(products), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/products', methods=['POST'])
def add_product():
    try:
        product_data = request.json
        
        # Basic validation
        if not product_data:
            return jsonify({"error": "No data provided"}), 400
            
        # Insert the product into MongoDB
        result = product_listings.insert_one(product_data)
        
        return jsonify({
            "message": "Product added successfully",
            "product_id": str(result.inserted_id)
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/products/<product_id>', methods=['PUT'])
def update_product(product_id):
    try:
        product_data = request.json
        
        # Basic validation
        if not product_data:
            return jsonify({"error": "No data provided"}), 400
            
        # Update the product in MongoDB
        result = product_listings.update_one(
            {"_id": pymongo.ObjectId(product_id)},
            {"$set": product_data}
        )
        
        if result.matched_count == 0:
            return jsonify({"error": "Product not found"}), 404
            
        return jsonify({
            "message": "Product updated successfully",
            "modified_count": result.modified_count
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/products/<product_id>', methods=['DELETE'])
def delete_product(product_id):
    try:
        
        # Delete the product from MongoDB
        result = product_listings.delete_one({"_id": pymongo.ObjectId(product_id)})
        
        if result.deleted_count == 0:
            return jsonify({"error": "Product not found"}), 404
            
        return jsonify({
            "message": "Product deleted successfully",
            "deleted_count": result.deleted_count
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/products/<sender_id>', methods=['GET'])
def get_products_by_sender(sender_id):
    try:
        collection = db.Sample_data
        # Query the collection for data with the provided sender_id
        query_results = collection.find({"sender_id": sender_id})
        
        # Convert MongoDB objects to Python dictionaries
        products = []
        for item in query_results:
            # Convert ObjectId to string for JSON serialization
            item['_id'] = str(item['_id'])
            products.append(item)
        
        # Return results
        if products:
            return jsonify({
                "status": "success",
                "count": len(products),
                "data": products
            }), 200
        else:
            return jsonify({
                "status": "error",
                "message": f"No data found for sender_id: {sender_id}"
            }), 404
            
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/api/transports', methods=['POST'])
def add_transport():
    """
    API endpoint to add transport data to the transport_listing collection
    """
    try:
        transport_data = request.get_json()
        result = db.transport_listing.insert_one(transport_data)
        
        return jsonify({
            "message": "Transport data added successfully",
            "id": str(result.inserted_id),
            "success": True
        }), 201
        
    except Exception as e:
        return jsonify({
            "message": "Error adding transport data to database",
            "error": str(e)
        }), 500

# Optional: Get all transport listings
@app.route('/api/transports', methods=['GET'])
def get_transports():
    try:
        # Retrieve all transport listings (with optional limit)
        limit = int(request.args.get('limit', 100))
        transports = list(db.transport_listing.find().limit(limit))
        
        # Convert ObjectId to string for JSON serialization
        for transport in transports:
            transport['_id'] = str(transport['_id'])
        
        return jsonify({
            "success": True,
            "count": len(transports),
            "data": transports
        }), 200
        
    except Exception as e:
        return jsonify({
            "message": "Error retrieving transport data",
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=7000)