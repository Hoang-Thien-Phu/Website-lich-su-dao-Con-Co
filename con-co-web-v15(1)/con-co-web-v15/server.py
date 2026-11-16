import os
from http.server import HTTPServer, SimpleHTTPRequestHandler

os.chdir(os.path.dirname(os.path.abspath(__file__)))
print("Mo website tai http://127.0.0.1:8000")
HTTPServer(("127.0.0.1", 8000), SimpleHTTPRequestHandler).serve_forever()
