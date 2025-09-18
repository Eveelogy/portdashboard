from flask import Flask, jsonify, send_from_directory
import csv
import os
import docker

app = Flask(__name__, static_folder='static', static_url_path='')
PORTS_CSV = os.path.join(os.path.dirname(__file__), 'ports.csv')

def fetch_docker_ports():
    client = docker.from_env()
    containers = client.containers.list()
    rows = []
    for container in containers:
        ports = container.attrs['NetworkSettings']['Ports']
        for port, mappings in (ports or {}).items():
            if mappings:
                for mapping in mappings:
                    rows.append({
                        'Protocol': port.split('/')[1],
                        'State': 'LISTEN',
                        'Local Address': mapping.get('HostIp', ''),
                        'Port': mapping.get('HostPort', ''),
                        'PID': '',
                        'Process': 'docker-proxy',
                        'Docker Container': container.name
                    })
    return rows

@app.route('/api/ports')
def get_ports():
    ports = []
    with open(PORTS_CSV, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            ports.append(row)
    return jsonify(ports)


# Endpoint to update ports.csv from Docker
@app.route('/api/update_ports', methods=['POST'])
def update_ports():
    rows = fetch_docker_ports()
    # Read existing CSV to preserve non-docker rows
    with open(PORTS_CSV, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        existing = [row for row in reader if row.get('Docker Container')]
    # Write new CSV
    with open(PORTS_CSV, 'w', newline='') as csvfile:
        fieldnames = ['Protocol','State','Local Address','Port','PID','Process','Docker Container']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
        writer.writerows(existing)
    return jsonify({'status': 'updated', 'count': len(rows)})

# Serve the frontend
@app.route('/')
def serve_frontend():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    try:
        return send_from_directory(app.static_folder, path)
    except:
        return send_from_directory(app.static_folder, 'index.html')

# Ensure ports.csv exists or generate it from Docker
def ensure_ports_csv():
    if not os.path.exists(PORTS_CSV):
        rows = fetch_docker_ports()
        with open(PORTS_CSV, 'w', newline='') as csvfile:
            fieldnames = ['Protocol','State','Local Address','Port','PID','Process','Docker Container']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)

if __name__ == '__main__':
    ensure_ports_csv()
    print("Available routes:")
    for rule in app.url_map.iter_rules():
        print(f"  {rule}")
    app.run(host='0.0.0.0', port=9595)
