from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash 

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})


app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# Models
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(120), nullable=False)
    last_name = db.Column(db.String(120), nullable=False)
    phone_number = db.Column(db.String(15), unique=True, nullable=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

class Workout(db.Model):
    __tablename__ = 'workouts'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    date = db.Column(db.Date, nullable=False)
    duration = db.Column(db.Integer)  # Duration in minutes
    repetitions = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'date': self.date.isoformat(),
            'duration': self.duration,
            'repetitions': self.repetitions
        }

# Routes
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()

    # Validate data
    required_fields = ['first_name', 'last_name', 'username', 'password']
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return jsonify({'message': f"Missing fields: {', '.join(missing_fields)}"}), 400

    # Check for duplicate username
    existing_user = User.query.filter_by(username=data['username']).first()
    if existing_user:
        return jsonify({'message': 'Username already taken'}), 400

    hashed_pw = generate_password_hash(data['password'], method='sha256')
    user = User(
        first_name=data['first_name'], 
        last_name=data['last_name'], 
        phone_number=data.get('phone_number'),  # It's nullable, so we use data.get
        username=data['username'], 
        password=hashed_pw
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user and check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Logged in successfully', 'id': user.id}), 200  # Include user's ID in the response
    return jsonify({'message': 'Invalid credentials'}), 401


@app.route('/api/workouts', methods=['GET'])
def get_all_workouts():
    workouts = Workout.query.all()
    return jsonify([workout.serialize() for workout in workouts]), 200

@app.route('/api/workouts', methods=['POST'])
def add_workout():
    data = request.get_json()
    workout = Workout(
        name=data['name'],
        date=data['date'],
        duration=data['duration'],
        repetitions=data['repetitions'],
        user_id=data['user_id']
    )
    db.session.add(workout)
    db.session.commit()
    return jsonify({'message': 'Workout added successfully'}), 201

@app.route('/api/workouts/<int:user_id>', methods=['GET'])
def get_workouts(user_id):
    workouts = Workout.query.filter_by(user_id=user_id).all()
    return jsonify([workout.serialize() for workout in workouts]), 200

@app.route('/api/workouts/<int:workout_id>', methods=['PUT'])
def edit_workout(workout_id):
    data = request.get_json()
    workout = Workout.query.get(workout_id)
    if not workout:
        return jsonify({'message': 'Workout not found'}), 404

    for field, value in data.items():
        setattr(workout, field, value)

    db.session.commit()
    return jsonify({'message': 'Workout updated successfully'}), 200

@app.route('/api/workouts/<int:workout_id>', methods=['DELETE'])
def delete_workout(workout_id):
    workout = Workout.query.get(workout_id)
    if not workout:
        return jsonify({'message': 'Workout not found'}), 404

    db.session.delete(workout)
    db.session.commit()
    return jsonify({'message': 'Workout deleted successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
