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