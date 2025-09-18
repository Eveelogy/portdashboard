from flask import Flask, jsonify, send_from_directory, request
import sqlite3
import os
import docker
import json

app = Flask(__name__, static_folder='static', static_url_path='')
DB_PATH = os.path.join('/app/data', 'ports.db')

def init_db():
    """Initialize the SQLite database with the ports table"""
    # Ensure data directory exists
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS ports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            protocol TEXT,
            state TEXT,
            local_address TEXT,
            port TEXT,
            pid TEXT,
            process TEXT,
            docker_container TEXT,
            is_docker_managed BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def get_db_connection():
    """Get a database connection with row factory for easy access"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def fetch_docker_ports():
    """Fetch port information from Docker containers"""
    client = docker.from_env()
    containers = client.containers.list()
    rows = []
    for container in containers:
        ports = container.attrs['NetworkSettings']['Ports']
        for port, mappings in (ports or {}).items():
            if mappings:
                for mapping in mappings:
                    rows.append({
                        'protocol': port.split('/')[1].upper(),
                        'state': 'LISTEN',
                        'local_address': mapping.get('HostIp', '0.0.0.0'),
                        'port': mapping.get('HostPort', ''),
                        'pid': '',
                        'process': 'docker-proxy',
                        'docker_container': container.name,
                        'is_docker_managed': True
                    })
    return rows

@app.route('/api/ports')
def get_ports():
    """Get all ports from the database"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT protocol, state, local_address, port, pid, process, docker_container
        FROM ports 
        ORDER BY CAST(port AS INTEGER), protocol
    ''')
    ports = []
    for row in cursor.fetchall():
        ports.append({
            'Protocol': row['protocol'],
            'State': row['state'],
            'Local Address': row['local_address'],
            'Port': row['port'],
            'PID': row['pid'],
            'Process': row['process'],
            'Docker Container': row['docker_container']
        })
    conn.close()
    return jsonify(ports)

@app.route('/api/test')
def test_route():
    return jsonify({'status': 'test route working'})

# Endpoint to update ports.csv from Docker
@app.route('/api/update_ports', methods=['POST'])
def update_ports():
    """Update port data from Docker containers"""
    docker_ports = fetch_docker_ports()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Remove all Docker-managed entries
    cursor.execute('DELETE FROM ports WHERE is_docker_managed = 1')
    
    # Insert fresh Docker port data
    for port_data in docker_ports:
        cursor.execute('''
            INSERT INTO ports (protocol, state, local_address, port, pid, process, docker_container, is_docker_managed)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            port_data['protocol'],
            port_data['state'],
            port_data['local_address'],
            port_data['port'],
            port_data['pid'],
            port_data['process'],
            port_data['docker_container'],
            port_data['is_docker_managed']
        ))
    
    conn.commit()
    conn.close()
    
    return jsonify({'status': 'updated', 'count': len(docker_ports)})

@app.route('/api/export_db', methods=['GET'])
def export_database():
    """Export the SQLite database file"""
    try:
        return send_from_directory(
            os.path.dirname(DB_PATH), 
            os.path.basename(DB_PATH),
            as_attachment=True,
            download_name='portdashboard.db'
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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

# Ensure database exists and has initial data
def ensure_ports_db():
    """Initialize database and populate with Docker data if empty"""
    init_db()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT COUNT(*) as count FROM ports')
    count = cursor.fetchone()['count']
    
    if count == 0:
        # Database is empty, populate with Docker data
        docker_ports = fetch_docker_ports()
        for port_data in docker_ports:
            cursor.execute('''
                INSERT INTO ports (protocol, state, local_address, port, pid, process, docker_container, is_docker_managed)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                port_data['protocol'],
                port_data['state'],
                port_data['local_address'],
                port_data['port'],
                port_data['pid'],
                port_data['process'],
                port_data['docker_container'],
                port_data['is_docker_managed']
            ))
        conn.commit()
    
    conn.close()

if __name__ == '__main__':
    ensure_ports_db()
    print("Available routes:")
    for rule in app.url_map.iter_rules():
        print(f"  {rule}")
    app.run(host='0.0.0.0', port=9595)
