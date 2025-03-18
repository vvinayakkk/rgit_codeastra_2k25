from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from twilio.rest import Client
import os
import json
import base64
import tempfile
import datetime
from io import BytesIO
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')  # Use Agg backend to avoid Tkinter issues
import seaborn as sns
import networkx as nx
import folium
import pdfkit
import markdown
from langchain.agents import AgentType, initialize_agent
from langchain_google_genai import ChatGoogleGenerativeAI
from composio_langchain import ComposioToolSet
from dotenv import load_dotenv
from supabase import create_client
import uuid

supabase_url = "https://egdbvwtvwqhqorfknmfj.supabase.co"
supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnZGJ2d3R2d3FocW9yZmtubWZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyMjA1MTQsImV4cCI6MjA1MDc5NjUxNH0.osnvEZThw50kZTZfuM1qjIMkaFeOo6bJ2A5NnM86hC0"
supabase = create_client(supabase_url, supabase_key)
BUCKET_NAME="trial"


# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Twilio configuration
TWILIO_WHATSAPP_NUMBER = "whatsapp:+14155238886"  # Twilio Sandbox Number
TWILIO_ACCOUNT_SID = 'AC402d24ad766ba5c73dd10c865bd5ba38'
TWILIO_AUTH_TOKEN = '350f91bbd17166746a271cabfabd2742'
content_sid='HXb5b62575e6e4ff6129ad7c8efe1f983e'
twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN,content_sid)

# Google API configuration
os.environ["GOOGLE_API_KEY"] = os.getenv('GOOGLE_API_KEY')

# Composio API configuration
COMPOSIO_API_KEY = 'irwfwjxhkxng4167sj48'

# Initialize LangChain components
def initialize_agent_with_tools():
    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-pro",
        temperature=0.1,
        convert_system_message_to_human=True
    )
    
    # Initialize Composio tools
    composio_toolset = ComposioToolSet(api_key=COMPOSIO_API_KEY)
    tools = composio_toolset.get_tools(actions=['GMAIL_SEND_EMAIL'])
    
    # Create agent
    return initialize_agent(
        tools,
        llm,
        agent=AgentType.STRUCTURED_CHAT_ZERO_SHOT_REACT_DESCRIPTION,
        verbose=True
    )

# Initialize the agent
agent = initialize_agent_with_tools()

def send_whatsapp_message(to_number, message):
    """Send WhatsApp message using Twilio"""
    try:
        message = twilio_client.messages.create(
            body=message,
            to=f'whatsapp:{to_number}',
            from_=f'{TWILIO_WHATSAPP_NUMBER}'
        )
        return {"success": True, "message_sid": message.sid}
    except Exception as e:
        return {"success": False, "error": str(e)}

def send_whatsapp_with_pdf(to_number, message, pdf_path):
    """Send WhatsApp message with PDF attachment using Twilio"""
    try:
        # Upload PDF to Supabase and get public URL
        unique_filename = f"{uuid.uuid4()}.pdf"
        
        # Read file content
        with open(pdf_path, 'rb') as f:
            file_content = f.read()
        
        print(f"Uploading PDF {unique_filename} ({len(file_content)} bytes) to Supabase")
        
        # Upload to Supabase storage
        try:
            supabase.storage.from_(BUCKET_NAME).upload(
                path=unique_filename,
                file=file_content,
                file_options={"content-type": "application/pdf"}
            )
            
            # Get public URL for the file
            pdf_url = supabase.storage.from_(BUCKET_NAME).get_public_url(unique_filename)
            print(f"Generated public URL: {pdf_url}")
            
            if not pdf_url:
                raise Exception("Failed to generate public URL for PDF")
            
            # Send message with media URL
            message = twilio_client.messages.create(
                body=message,
                # media_url=[pdf_url],  # Must be a list
                to=f'whatsapp:{to_number}',
                from_=f'{TWILIO_WHATSAPP_NUMBER}'
            )
            
            print(f"WhatsApp message sent with SID: {message.sid}")
            return {"success": True, "message_sid": message.sid, "media_url": pdf_url}
            
        except Exception as upload_error:
            print(f"Supabase upload error: {str(upload_error)}")
            
            # Fallback to sending message without media
            message = twilio_client.messages.create(
                body=f"{message} (Note: PDF attachment failed to upload)",
                to=f'whatsapp:{to_number}',
                from_=f'{TWILIO_WHATSAPP_NUMBER}'
            )
            return {"success": True, "message_sid": message.sid, "note": "PDF attachment failed"}
            
    except Exception as e:
        print(f"Error sending WhatsApp message: {str(e)}")
        return {"success": False, "error": str(e)}

def send_email_with_pdf(recipient, subject, content, pdf_path):
    """Send email with PDF attachment using Composio through LangChain agent"""
    try:
        result = agent.run(
            f"""
            Send an email to {recipient} with the subject '{subject}' and the following content:
            
            {content}
            
            Please attach the PDF file located at: {pdf_path}
            """
        )
        return {"success": True, "result": result}
    except Exception as e:
        return {"success": False, "error": str(e)}

def convert_markdown_to_pdf(markdown_content, css_path=None):
    """Convert markdown content to PDF with improved table support"""
    # Convert markdown to HTML
    html_content = markdown.markdown(markdown_content, extensions=['tables', 'attr_list'])
    
    # Add CSS for better styling, with enhanced table styles
    styled_html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {{
                font-family: 'Helvetica', 'Arial', sans-serif;
                line-height: 1.6;
                margin: 2em;
                color: #333;
            }}
            h1 {{
                color: #2c3e50;
                border-bottom: 2px solid #3498db;
                padding-bottom: 10px;
            }}
            h2 {{
                color: #2c3e50;
                margin-top: 1.5em;
                border-bottom: 1px solid #bdc3c7;
                padding-bottom: 5px;
            }}
            h3 {{
                color: #34495e;
            }}
            table {{
                border-collapse: collapse;
                width: 100%;
                margin: 1em 0;
                border: 1px solid #ddd;
            }}
            th, td {{
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
            }}
            th {{
                background-color: #f2f2f2;
                font-weight: bold;
            }}
            img {{
                max-width: 100%;
                display: block;
                margin: 1em auto;
            }}
            .alert {{
                background-color: #f8d7da;
                padding: 15px;
                border-left: 4px solid #d9534f;
                margin-bottom: 20px;
            }}
            .success {{
                background-color: #d4edda;
                padding: 15px;
                border-left: 4px solid #28a745;
                margin-bottom: 20px;
            }}
            .fraud {{
                color: #721c24;
                font-weight: bold;
            }}
            .legitimate {{
                color: #155724;
                font-weight: bold;
            }}
        </style>
    </head>
    <body>
        {html_content}
    </body>
    </html>
    """
    
    # Create a temporary file for the PDF
    with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as temp_file:
        pdf_path = temp_file.name
    
    # Convert HTML to PDF
    path_to_wkhtmltopdf = r'C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe'
    config = pdfkit.configuration(wkhtmltopdf=path_to_wkhtmltopdf)
    pdfkit.from_string(styled_html, pdf_path, configuration=config)
    
    return pdf_path

def create_fraud_alert_markdown(transaction_data):
    """Generate markdown for fraud alert PDF"""
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # Extract relevant data
    product_id = transaction_data.get('product_id', 'Unknown')
    seller_id = transaction_data.get('seller_id', 'Unknown')
    buyer_id = transaction_data.get('buyer_id', 'Unknown')
    transaction_id = transaction_data.get('transaction_id', 'Unknown')
    blockchain_address = transaction_data.get('blockchain_address', 'Unknown')
    fraud_details = transaction_data.get('fraud_details', {})
    fraud_score = fraud_details.get('fraud_score', 0)
    fraud_type = fraud_details.get('fraud_type', 'Unknown')
    detection_method = fraud_details.get('detection_method', 'Unknown')
    
    # Create markdown content
    # Replace the markdown table with an HTML table
    markdown_content = f"""
# 🚨 FRAUD ALERT: Transaction #{transaction_id}

<div class="alert">
This document serves as an official notification that a fraudulent transaction has been detected in your supply chain management system.
</div>

## Transaction Details

**Generated on:** {timestamp}

<table>
  <tr>
    <th>Field</th>
    <th>Value</th>
  </tr>
  <tr>
    <td>Product ID</td>
    <td>{product_id}</td>
  </tr>
  <tr>
    <td>Seller ID</td>
    <td>{seller_id}</td>
  </tr>
  <tr>
    <td>Buyer ID</td>
    <td>{buyer_id}</td>
  </tr>
  <tr>
    <td>Transaction ID</td>
    <td>{transaction_id}</td>
  </tr>
  <tr>
    <td>Blockchain Address</td>
    <td>{blockchain_address}</td>
  </tr>
</table>


## Fraud Detection Results

**Fraud Score:** {fraud_score}/100  
**Fraud Type:** {fraud_type}  
**Detection Method:** {detection_method}

## Detected Issues

{fraud_details.get('description', 'No detailed description provided.')}

## Analysis

The following anomalies were identified in this transaction:

"""
    
    # Add fraud indicators
    fraud_indicators = fraud_details.get('indicators', [])
    if fraud_indicators:
        for indicator in fraud_indicators:
            markdown_content += f"- **{indicator.get('name')}**: {indicator.get('description')}\n"
    else:
        markdown_content += "- No specific indicators provided.\n"
    
    # Add recommendations
    markdown_content += """
## Recommended Actions

1. **Immediately Halt Transaction**: Do not proceed with this transaction until further investigation.
2. **Report to Authorities**: If appropriate, report this incident to relevant authorities.
3. **Investigate Seller**: Review the seller's history and credentials.
4. **Verify Product**: Request additional verification for the product.
5. **System Audit**: Consider auditing your supply chain processes.

## Legal Notice

This alert is generated by an automated AI fraud detection system. While highly accurate, we recommend human verification before taking legal action.

---

*This is an automatically generated fraud alert. Please do not reply to this message.*
"""
    
    return markdown_content

def create_success_report_markdown(transaction_data):
    """Generate markdown for successful transaction PDF"""
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # Extract relevant data
    product_id = transaction_data.get('product_id', 'Unknown')
    product_name = transaction_data.get('product_name', 'Unknown Product')
    seller_id = transaction_data.get('seller_id', 'Unknown')
    seller_name = transaction_data.get('seller_name', 'Unknown Seller')
    buyer_id = transaction_data.get('buyer_id', 'Unknown')
    buyer_name = transaction_data.get('buyer_name', 'Unknown Buyer')
    transaction_id = transaction_data.get('transaction_id', 'Unknown')
    blockchain_address = transaction_data.get('blockchain_address', 'Unknown')
    ipfs_hash = transaction_data.get('ipfs_hash', 'Unknown')
    transaction_date = transaction_data.get('transaction_date', timestamp)
    
    # Extract compliance and route data
    compliance = transaction_data.get('compliance', {})
    route_data = transaction_data.get('route', {})
    
    # Create markdown content
    markdown_content = f"""
# ✅ Transaction Success Report: #{transaction_id}

<div class="success">
This document confirms that the transaction has been successfully validated and recorded on the blockchain.
</div>

## Transaction Details

**Generated on:** {timestamp}

| Field | Value |
|-------|-------|
| Product | {product_name} (ID: {product_id}) |
| Seller | {seller_name} (ID: {seller_id}) |
| Buyer | {buyer_name} (ID: {buyer_id}) |
| Transaction ID | {transaction_id} |
| Transaction Date | {transaction_date} |
| Blockchain Address | {blockchain_address} |
| IPFS Hash | {ipfs_hash} |

## Compliance Verification

"""
    
    # Add compliance details
    compliance_score = compliance.get('score', 0)
    compliance_status = "COMPLIANT" if compliance_score >= 80 else "PARTIALLY COMPLIANT"
    
    markdown_content += f"""
**Compliance Score:** {compliance_score}/100  
**Status:** {compliance_status}

### Compliance Checks

| Check | Status | Details |
|-------|--------|---------|
"""
    
    # Add compliance checks
    compliance_checks = compliance.get('checks', [])
    for check in compliance_checks:
        check_name = check.get('name', 'Unknown Check')
        check_status = "✅ Passed" if check.get('passed', False) else "❌ Failed"
        check_details = check.get('details', 'No details provided')
        markdown_content += f"| {check_name} | {check_status} | {check_details} |\n"
    
    # Add AI fraud detection results
    fraud_detection = transaction_data.get('fraud_detection', {})
    fraud_score = fraud_detection.get('score', 0)
    fraud_status = "LEGITIMATE" if fraud_score < 20 else "SUSPICIOUS"
    
    markdown_content += f"""
## AI Fraud Detection

**Fraud Score:** {fraud_score}/100  
**Status:** {fraud_status}

### Fraud Detection Checks

| Check | Result | Details |
|-------|--------|---------|
"""
    
    # Add fraud detection checks
    fraud_checks = fraud_detection.get('checks', [])
    for check in fraud_checks:
        check_name = check.get('name', 'Unknown Check')
        check_result = check.get('result', 'Unknown')
        check_details = check.get('details', 'No details provided')
        markdown_content += f"| {check_name} | {check_result} | {check_details} |\n"
    
    # Add blockchain verification
    blockchain_verification = transaction_data.get('blockchain_verification', {})
    blockchain_status = "VERIFIED" if blockchain_verification.get('verified', False) else "UNVERIFIED"
    
    markdown_content += f"""
## Blockchain Verification

**Status:** {blockchain_status}  
**Block Number:** {blockchain_verification.get('block_number', 'Unknown')}  
**Timestamp:** {blockchain_verification.get('timestamp', 'Unknown')}

## Shipping Route

**Origin:** {route_data.get('origin', 'Unknown')}  
**Destination:** {route_data.get('destination', 'Unknown')}  
**Estimated Delivery:** {route_data.get('estimated_delivery', 'Unknown')}

### Route Details

The shortest path from origin to destination has been calculated. Please refer to the route map in the email and WhatsApp message.

## Verification QR Code

A QR code is attached to this document for easy verification of the transaction on the blockchain.

## Legal Notice

This document serves as proof of a legitimate transaction recorded on the blockchain. It can be used for verification purposes.

---

*This is an automatically generated transaction success report. Please do not reply to this message.*
"""
    
    return markdown_content

def create_route_map(route_data):
    """Create a route map using Folium"""
    
    # Extract route points
    route_points = route_data.get('route_points', [])
    
    if not route_points or len(route_points) < 2:
        # Default route if not provided
        route_points = [
            {"name": "Origin", "lat": 40.7128, "lon": -74.0060},
            {"name": "Waypoint 1", "lat": 39.9526, "lon": -75.1652},
            {"name": "Destination", "lat": 38.9072, "lon": -77.0369}
        ]
    
    # Create a map centered on the first point
    m = folium.Map(
        location=[route_points[0]['lat'], route_points[0]['lon']],
        zoom_start=6
    )
    
    # Add markers for each point
    for point in route_points:
        folium.Marker(
            location=[point['lat'], point['lon']],
            popup=point['name'],
            icon=folium.Icon(color='blue', icon='info-sign')
        ).add_to(m)
    
    # Create a line connecting all points
    points = [(point['lat'], point['lon']) for point in route_points]
    folium.PolyLine(
        points,
        color='red',
        weight=2.5,
        opacity=1
    ).add_to(m)
    
    # Save the map to an HTML file
    with tempfile.NamedTemporaryFile(suffix='.html', delete=False) as temp_file:
        map_path = temp_file.name
        m.save(map_path)
    
    return map_path

def create_route_graph(route_data):
    """Create a graph visualization of the route"""
    
    # Extract route points
    route_points = route_data.get('route_points', [])
    
    if not route_points or len(route_points) < 2:
        # Default route if not provided
        route_points = [
            {"name": "Origin", "lat": 40.7128, "lon": -74.0060},
            {"name": "Waypoint 1", "lat": 39.9526, "lon": -75.1652},
            {"name": "Destination", "lat": 38.9072, "lon": -77.0369}
        ]
    
    # Create a directed graph
    G = nx.DiGraph()
    
    # Add nodes
    for i, point in enumerate(route_points):
        G.add_node(i, name=point['name'])
    
    # Add edges
    for i in range(len(route_points) - 1):
        # Calculate distance (simplified)
        distance = ((route_points[i]['lat'] - route_points[i+1]['lat'])**2 + 
                   (route_points[i]['lon'] - route_points[i+1]['lon'])**2)**0.5
        G.add_edge(i, i+1, weight=distance)
    
    # Create positions for nodes
    pos = {i: (point['lon'], point['lat']) for i, point in enumerate(route_points)}
    
    # Create the plot
    plt.figure(figsize=(10, 6))
    
    # Draw nodes
    nx.draw_networkx_nodes(G, pos, node_size=700, node_color='lightblue')
    
    # Draw edges
    nx.draw_networkx_edges(G, pos, width=2, arrowsize=20)
    
    # Draw labels
    labels = {i: point['name'] for i, point in enumerate(route_points)}
    nx.draw_networkx_labels(G, pos, labels, font_size=10)
    
    # Add distance labels on edges
    edge_labels = {(i, i+1): f"{((route_points[i]['lat'] - route_points[i+1]['lat'])**2 + (route_points[i]['lon'] - route_points[i+1]['lon'])**2)**0.5:.2f}" 
                  for i in range(len(route_points) - 1)}
    nx.draw_networkx_edge_labels(G, pos, edge_labels=edge_labels)
    
    plt.title("Supply Chain Route")
    plt.axis('off')
    plt.tight_layout()
    
    # Save the graph to an image file
    with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as temp_file:
        graph_path = temp_file.name
        plt.savefig(graph_path, format='png', dpi=300, bbox_inches='tight')
        plt.close()
    
    return graph_path

def create_fraud_graphs(fraud_data):
    """Create visualization graphs for the fraud report"""
    
    # Extract fraud indicators
    indicators = fraud_data.get('indicators', [])
    if not indicators:
        # Default indicators if not provided
        indicators = [
            {"name": "Transaction Speed", "score": 85, "threshold": 70},
            {"name": "Price Deviation", "score": 92, "threshold": 60},
            {"name": "Seller History", "score": 75, "threshold": 50},
            {"name": "Document Authenticity", "score": 88, "threshold": 70},
            {"name": "Blockchain Verification", "score": 95, "threshold": 80}
        ]
    
    # Create bar chart for fraud indicators
    plt.figure(figsize=(10, 6))
    
    indicator_names = [ind['name'] for ind in indicators]
    indicator_scores = [ind['score'] for ind in indicators]
    indicator_thresholds = [ind['threshold'] for ind in indicators]
    
    x = range(len(indicator_names))
    
    plt.bar(x, indicator_scores, width=0.4, label='Score', color='#FF6B6B', align='edge')
    plt.bar([i + 0.4 for i in x], indicator_thresholds, width=0.4, label='Threshold', color='#4ECB71', align='edge')
    
    plt.xlabel('Fraud Indicators')
    plt.ylabel('Score')
    plt.title('Fraud Detection Scores vs Thresholds')
    plt.xticks([i + 0.2 for i in x], indicator_names, rotation=45, ha='right')
    plt.legend()
    
    plt.tight_layout()
    
    # Save the graph to an image file
    with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as temp_file:
        indicator_chart_path = temp_file.name
        plt.savefig(indicator_chart_path, format='png', dpi=100)
        plt.close()
    
    # Create fraud score gauge chart
    fraud_score = fraud_data.get('fraud_score', 75)
    
    plt.figure(figsize=(8, 4))
    
    # Create a gauge chart
    import numpy as np
    
    # Define the gauge parameters
    theta = np.linspace(0, 180, 100)
    r = np.ones_like(theta)
    
    # Create the plot
    fig, ax = plt.subplots(figsize=(8, 4), subplot_kw={'projection': 'polar'})
    
    # Plot the gauge background
    ax.fill_between(np.radians(theta), 0, r, color='#4ECB71', alpha=0.3)
    
    # Plot the value
    value_theta = np.radians(theta[:int(fraud_score/100 * len(theta))])
    ax.fill_between(value_theta, 0, r[:len(value_theta)], color='#FF6B6B')
    
    # Set the limits
    ax.set_rlim(0, 1)
    ax.set_rorigin(-1)
    ax.set_thetamin(0)
    ax.set_thetamax(180)
    
    # Remove the grid and labels
    ax.set_yticklabels([])
    ax.set_xticklabels([])
    ax.grid(False)
    
    # Add a title and value
    ax.set_title('Fraud Score', pad=20)
    ax.text(np.radians(90), -0.15, f"{fraud_score}/100", ha='center', va='center', fontsize=16, fontweight='bold')
    
    plt.tight_layout()
    
    # Save the gauge chart to an image file
    with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as temp_file:
        gauge_chart_path = temp_file.name
        plt.savefig(gauge_chart_path, format='png', dpi=100)
        plt.close()
    
    return indicator_chart_path, gauge_chart_path

def create_compliance_graphs(compliance_data):
    """Create visualization graphs for the compliance report"""
    
    # Extract compliance checks
    checks = compliance_data.get('checks', [])
    if not checks:
        # Default checks if not provided
        checks = [
            {"name": "Document Verification", "score": 90, "weight": 0.3},
            {"name": "Product Authenticity", "score": 85, "weight": 0.3},
            {"name": "Regulatory Compliance", "score": 75, "weight": 0.2},
            {"name": "Sanctions Check", "score": 100, "weight": 0.1},
            {"name": "Environmental Standards", "score": 80, "weight": 0.1}
        ]
    
    # Create bar chart for compliance scores
    plt.figure(figsize=(10, 6))
    
    check_names = [check['name'] for check in checks]
    check_scores = [check['score'] for check in checks]
    
    bars = plt.barh(check_names, check_scores, color=['#FF6B6B' if score < 80 else '#4ECB71' for score in check_scores])
    
    plt.xlabel('Compliance Score (%)')
    plt.title('Compliance Scores by Category')
    plt.xlim(0, 100)
    
    # Add the score values at the end of each bar
    for bar in bars:
        width = bar.get_width()
        plt.text(width + 1, bar.get_y() + bar.get_height()/2, f'{width:.0f}%', va='center')
    
    plt.tight_layout()
    
    # Save the graph to an image file
    with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as temp_file:
        compliance_chart_path = temp_file.name
        plt.savefig(compliance_chart_path, format='png', dpi=100)
        plt.close()
    
    # Create pie chart for compliance components
    plt.figure(figsize=(8, 8))
    
    # Calculate weighted scores
    weighted_scores = [check['score'] * check['weight'] for check in checks]
    total_score = sum(weighted_scores)
    
    # Create labels with name and contribution
    labels = [f"{check['name']} ({check['score'] * check['weight']:.1f}%)" for check in checks]
    
    plt.pie([check['weight'] for check in checks], labels=labels, autopct='%1.1f%%',
            startangle=90, colors=['#4ECB71', '#3498db', '#f39c12', '#9b59b6', '#e74c3c'])
    
    plt.title(f'Compliance Components (Total Score: {total_score:.1f}%)')
    plt.tight_layout()
    
    # Save the pie chart to an image file
    with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as temp_file:
        pie_chart_path = temp_file.name
        plt.savefig(pie_chart_path, format='png', dpi=100)
        plt.close()
    
    return compliance_chart_path, pie_chart_path

def upload_pdf_to_supabase(pdf_path):
    """Upload PDF to Supabase and return public URL"""
    try:
        # Generate a unique filename
        unique_filename = f"{uuid.uuid4()}.pdf"
        
        # Read file content
        with open(pdf_path, 'rb') as f:
            file_content = f.read()
        
        print(f"Uploading PDF {unique_filename} ({len(file_content)} bytes)")
        
        # Upload to Supabase storage
        result = supabase.storage.from_(BUCKET_NAME).upload(
            path=unique_filename,
            file=file_content,
            file_options={"content-type": "application/pdf"}
        )
        
        print(f"Upload response: {result}")
        
        # Get public URL for the file
        file_url = supabase.storage.from_(BUCKET_NAME).get_public_url(unique_filename)
        print(f"Generated public URL: {file_url}")
        
        return file_url
    except Exception as e:
        print(f"Error uploading PDF to Supabase: {str(e)}")
        return None

@app.route('/api/fraud_alert', methods=['POST'])
def fraud_alert():
    """API endpoint for sending fraud alerts"""
    try:
        # Get data from request
        data = request.json
        if not data:
            return jsonify({"error": "Invalid request, no JSON data received"}), 400
        
        # Extract notification settings
        notification_settings = data.get('notification_settings', {})
        whatsapp_recipient = notification_settings.get('whatsapp_number', '')
        email_recipient = notification_settings.get('email', '')
        
        # Create markdown for the PDF report
        markdown_content = create_fraud_alert_markdown(data)
        
        # Convert markdown to PDF
        pdf_path = convert_markdown_to_pdf(markdown_content)
        
        # Create fraud visualization graphs
        indicator_chart_path, gauge_chart_path = create_fraud_graphs(data.get('fraud_details', {}))
        
        # Prepare response data
        response_data = {
            "status": "success",
            "notifications": {"whatsapp": None, "email": None}
        }
        
        # Prepare notification messages
        whatsapp_message = f"""
🚨 *FRAUD ALERT: Transaction #{data.get('transaction_id', 'Unknown')}*

A potentially fraudulent transaction has been detected in your supply chain management system.

*Transaction Details:*
• Product ID: {data.get('product_id', 'Unknown')}
• Seller ID: {data.get('seller_id', 'Unknown')}
• Fraud Score: {data.get('fraud_details', {}).get('fraud_score', 0)}/100
• Fraud Type: {data.get('fraud_details', {}).get('fraud_type', 'Unknown')}

*IMPORTANT: DO NOT PROCEED WITH THIS TRANSACTION*

For complete details, please check the attached PDF report.
"""
        
        email_subject = f"FRAUD ALERT: Transaction #{data.get('transaction_id', 'Unknown')}"
        email_content = f"""
<html>
<body>
<h1 style="color: #d9534f;">🚨 FRAUD ALERT: Transaction #{data.get('transaction_id', 'Unknown')}</h1>

<p>A potentially fraudulent transaction has been detected in your supply chain management system.</p>

<h2>Transaction Details:</h2>
<ul>
<li><strong>Product ID:</strong> {data.get('product_id', 'Unknown')}</li>
<li><strong>Seller ID:</strong> {data.get('seller_id', 'Unknown')}</li>
<li><strong>Buyer ID:</strong> {data.get('buyer_id', 'Unknown')}</li>
<li><strong>Transaction ID:</strong> {data.get('transaction_id', 'Unknown')}</li>
<li><strong>Fraud Score:</strong> {data.get('fraud_details', {}).get('fraud_score', 0)}/100</li>
<li><strong>Fraud Type:</strong> {data.get('fraud_details', {}).get('fraud_type', 'Unknown')}</li>
</ul>

<p style="color: #d9534f; font-weight: bold; font-size: 18px;">IMPORTANT: DO NOT PROCEED WITH THIS TRANSACTION</p>

<p>For complete details, please check the attached PDF report.</p>

<p>This is an automatically generated alert. Please do not reply to this email.</p>
</body>
</html>
"""
        
        # Send WhatsApp notification
        if whatsapp_recipient:
            whatsapp_result = send_whatsapp_with_pdf(whatsapp_recipient, whatsapp_message, pdf_path)
            response_data["notifications"]["whatsapp"] = whatsapp_result
        
        # Send email notification
        if email_recipient:
            email_result = send_email_with_pdf(email_recipient, email_subject, email_content, pdf_path)
            response_data["notifications"]["email"] = email_result
        
        # Clean up temporary files
        try:
            os.remove(pdf_path)
            os.remove(indicator_chart_path)
            os.remove(gauge_chart_path)
        except:
            pass
        
        return jsonify(response_data), 200
    
    except Exception as e:
        return jsonify({"error": str(e), "status": "failed"}), 500

# Define this route OUTSIDE of any other function, at the top level of your app
@app.route('/files/<filename>')
def serve_file(filename):
    return send_from_directory('uploads', filename)

@app.route('/api/transaction_success', methods=['POST'])
def transaction_success():
    """API endpoint for sending transaction success notifications"""
    try:
        # Get data from request
        data = request.json
        if not data:
            return jsonify({"error": "Invalid request, no JSON data received"}), 400
        
        # Extract notification settings
        notification_settings = data.get('notification_settings', {})
        whatsapp_recipient = notification_settings.get('whatsapp_number', '')
        email_recipient = notification_settings.get('email', '')
        
        # Create markdown for the PDF report
        markdown_content = create_success_report_markdown(data)
        
        # Convert markdown to PDF
        pdf_path = convert_markdown_to_pdf(markdown_content)
        
        # Create route visual
        # Create route visual
        route_map_path = create_route_map(data.get('route', {}))
        route_graph_path = create_route_graph(data.get('route', {}))
        
        # Create compliance visualization graphs
        compliance_chart_path, pie_chart_path = create_compliance_graphs(data.get('compliance', {}))
        
        # Prepare response data
        response_data = {
            "status": "success",
            "notifications": {"whatsapp": None, "email": None}
        }
        
        # Prepare notification messages
        whatsapp_message = f"""
✅ *TRANSACTION SUCCESS: #{data.get('transaction_id', 'Unknown')}*

Your transaction has been successfully validated and recorded on the blockchain.

*Transaction Details:*
• Product: {data.get('product_name', 'Unknown Product')}
• Seller: {data.get('seller_name', 'Unknown Seller')}
• Buyer: {data.get('buyer_name', 'Unknown Buyer')}
• Transaction ID: {data.get('transaction_id', 'Unknown')}
• Compliance Score: {data.get('compliance', {}).get('score', 0)}/100
• Fraud Score: {data.get('fraud_detection', {}).get('score', 0)}/100

For complete details, please check the attached PDF report.
"""
        
        email_subject = f"Transaction Success: #{data.get('transaction_id', 'Unknown')}"
        email_content = f"""
<html>
<body>
<h1 style="color: #28a745;">✅ Transaction Success: #{data.get('transaction_id', 'Unknown')}</h1>

<p>Your transaction has been successfully validated and recorded on the blockchain.</p>

<h2>Transaction Details:</h2>
<ul>
<li><strong>Product:</strong> {data.get('product_name', 'Unknown Product')} (ID: {data.get('product_id', 'Unknown')})</li>
<li><strong>Seller:</strong> {data.get('seller_name', 'Unknown Seller')} (ID: {data.get('seller_id', 'Unknown')})</li>
<li><strong>Buyer:</strong> {data.get('buyer_name', 'Unknown Buyer')} (ID: {data.get('buyer_id', 'Unknown')})</li>
<li><strong>Transaction ID:</strong> {data.get('transaction_id', 'Unknown')}</li>
<li><strong>Transaction Date:</strong> {data.get('transaction_date', datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))}</li>
<li><strong>Blockchain Address:</strong> {data.get('blockchain_address', 'Unknown')}</li>
<li><strong>Compliance Score:</strong> {data.get('compliance', {}).get('score', 0)}/100</li>
<li><strong>Fraud Score:</strong> {data.get('fraud_detection', {}).get('score', 0)}/100</li>
</ul>

<p style="color: #28a745; font-weight: bold; font-size: 18px;">Transaction Successfully Recorded on Blockchain</p>

<p>For complete details, please check the attached PDF report.</p>

<p>This is an automatically generated notification. Please do not reply to this email.</p>
</body>
</html>
"""
        
        # Send WhatsApp notification
        if whatsapp_recipient:
            whatsapp_result = send_whatsapp_with_pdf(whatsapp_recipient, whatsapp_message, pdf_path)
            response_data["notifications"]["whatsapp"] = whatsapp_result
        
        # Send email notification
        if email_recipient:
            email_result = send_email_with_pdf(email_recipient, email_subject, email_content, pdf_path)
            response_data["notifications"]["email"] = email_result
        
        # Clean up temporary files
        try:
            os.remove(pdf_path)
            os.remove(route_map_path)
            os.remove(route_graph_path)
            os.remove(compliance_chart_path)
            os.remove(pie_chart_path)
        except:
            pass
        
        return jsonify(response_data), 200
    
    except Exception as e:
        return jsonify({"error": str(e), "status": "failed"}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """API endpoint for health checks"""
    return jsonify({"status": "healthy", "timestamp": datetime.datetime.now().isoformat()}), 200

if __name__ == '__main__':
    port = int(os.getenv('PORT', 6003))
    app.run(host='0.0.0.0', port=port, debug=False)