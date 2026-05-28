import http.server
import socketserver
import sys
import socket

# Base configuration
PORT = 8000
MAX_PORT_ATTEMPTS = 20
Handler = http.server.SimpleHTTPRequestHandler

def find_free_port(start_port):
    """Finds a free port starting from the start_port, trying up to MAX_PORT_ATTEMPTS times."""
    port = start_port
    for _ in range(MAX_PORT_ATTEMPTS):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(('localhost', port))
                return port
            except socket.error:
                port += 1
    return None

def main():
    global PORT
    free_port = find_free_port(PORT)
    if free_port is None:
        print("Error: Could not find any free ports to run the server.")
        sys.exit(1)
    
    PORT = free_port
    
    # Configure socket server with reuse address option
    socketserver.TCPServer.allow_reuse_address = True
    
    try:
        with socketserver.TCPServer(('0.0.0.0', PORT), Handler) as httpd:
            print("\n" + "="*50)
            print("🚀 MONSTER ENERGY WEB SERVER RUNNING")
            print("="*50)
            print(f"👉 Local Host URL: http://localhost:{PORT}")
            print(f"👉 Network URL:    http://{socket.gethostbyname(socket.gethostname())}:{PORT}")
            print("="*50)
            print("Press Ctrl+C to stop the server.\n")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping web server. Unleash the beast next time!")
        sys.exit(0)
    except Exception as e:
        print(f"An error occurred: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
