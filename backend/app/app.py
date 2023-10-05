from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash 

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:fitness123@fitness-db.cq9mmougyxan.us-east-2.rds.amazonaws.com:5432/fitness_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# Models
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(255), nullable=False)
    last_name = db.Column(db.String(255), nullable=False)
    phone_number = db.Column(db.String(15))
    username = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

    def serialize(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'phone_number': self.phone_number,
            'username': self.username
        }

class Workout(db.Model):
    __tablename__ = 'workouts'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=True)  # Adding the new name column
    date = db.Column(db.Date, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    exercise_type_id = db.Column(db.Integer, db.ForeignKey('exercise_types.id'), nullable=False)
    
    aerobic_detail = db.relationship('AerobicDetail', uselist=False, backref='workout', cascade='all, delete-orphan')
    cardio_detail = db.relationship('CardioDetail', uselist=False, backref='workout', cascade='all, delete-orphan')
    weight_training_detail = db.relationship('WeightTrainingDetail', uselist=False, backref='workout', cascade='all, delete-orphan')


    def serialize(self):
        data = {
            'id': self.id,
            'name': self.name,  # Added this line to include the name in serialization
            'date': self.date.isoformat(),
            'user_id': self.user_id,
            'exercise_type_id': self.exercise_type_id
        }

        # Append the specific exercise details based on the exercise type
        if self.exercise_type_id == 1:  # Assuming 1 corresponds to aerobic
            data['details'] = self.aerobic_detail.serialize() if self.aerobic_detail else None
        elif self.exercise_type_id == 2:  # Assuming 2 corresponds to cardio
            data['details'] = self.cardio_detail.serialize() if self.cardio_detail else None
        elif self.exercise_type_id == 3:  # Assuming 3 corresponds to weight_training
            data['details'] = self.weight_training_detail.serialize() if self.weight_training_detail else None

        return data

class ExerciseType(db.Model):
    __tablename__ = 'exercise_types'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False)

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name
        }

class AerobicDetail(db.Model):
    __tablename__ = 'aerobic_details'
    workout_id = db.Column(db.Integer, db.ForeignKey('workouts.id'), primary_key=True)
    activity_name = db.Column(db.String(255), nullable=False)
    duration = db.Column(db.Integer)
    speed = db.Column(db.Float)

    def serialize(self):
        return {
            'workout_id': self.workout_id,
            'activity_name': self.activity_name,
            'duration': self.duration,
            'speed': self.speed
        }
        
class CardioDetail(db.Model):
    __tablename__ = 'cardio_details'
    workout_id = db.Column(db.Integer, db.ForeignKey('workouts.id'), primary_key=True)
    machine_name = db.Column(db.String(255), nullable=False)
    time_duration = db.Column(db.Integer)
    distance = db.Column(db.Float)

    def serialize(self):
        return {
            'workout_id': self.workout_id,
            'machine_name': self.machine_name,
            'time_duration': self.time_duration,
            'distance': self.distance
        }

class WeightTrainingDetail(db.Model):
    __tablename__ = 'weight_training_details'
    workout_id = db.Column(db.Integer, db.ForeignKey('workouts.id'), primary_key=True)
    exercise_name = db.Column(db.String(255), nullable=False)
    reps = db.Column(db.Integer)
    sets = db.Column(db.Integer)
    weight = db.Column(db.Float)

    def serialize(self):
        return {
            'workout_id': self.workout_id,
            'exercise_name': self.exercise_name,
            'reps': self.reps,
            'sets': self.sets,
            'weight': self.weight
        }

class Weight(db.Model):
    __tablename__ = 'weight'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    weight_value = db.Column(db.Float, nullable=False)

    user = db.relationship('User', backref=db.backref('weights', lazy=True))

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'date': self.date,
            'weight_value': self.weight_value
        }

class BodyMeasurement(db.Model):
    __tablename__ = 'body_measurements'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    waist = db.Column(db.Float)
    chest = db.Column(db.Float)
    arms = db.Column(db.Float)
    legs = db.Column(db.Float)
    hip = db.Column(db.Float)

    user = db.relationship('User', backref=db.backref('body_measurements', lazy=True))

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'date': self.date,
            'waist': self.waist,
            'chest': self.chest,
            'arms': self.arms,
            'legs': self.legs,
            'hip': self.hip
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

# Routes for workouts
# # For add workout

@app.route('/api/workouts', methods=['POST'])
def add_workout():
    data = request.get_json()
    
    # Validate base fields
    name = data.get('name')
    date = data.get('date')
    user_id = data.get('user_id')
    exercise_type_id = data.get('exercise_type_id')

    if not all([name, date, user_id, exercise_type_id]):
        return jsonify({'error': 'One of the base fields is missing'}), 400

    workout = Workout(name=name, date=date, user_id=user_id, exercise_type_id=exercise_type_id)
    db.session.add(workout)
    db.session.flush()  # flush to get the id of the newly created workout

    exercise_details = data.get('exercise_details', {})
    
    if exercise_type_id == 1:  # Aerobic
        activity_name = exercise_details.get('activity_name')
        duration = exercise_details.get('duration')
        speed = exercise_details.get('speed')

        if not all([activity_name, duration, speed]):
            return jsonify({'error': 'Aerobic details are incomplete'}), 400

        aerobic_detail = AerobicDetail(workout_id=workout.id, activity_name=activity_name, duration=duration, speed=speed)
        db.session.add(aerobic_detail)

    elif exercise_type_id == 2:  # Cardio
        machine_name = exercise_details.get('machine_name')
        time_duration = exercise_details.get('time_duration')
        distance = exercise_details.get('distance')

        if not all([machine_name, time_duration, distance]):
            return jsonify({'error': 'Cardio details are incomplete'}), 400

        cardio_detail = CardioDetail(workout_id=workout.id, machine_name=machine_name, time_duration=time_duration, distance=distance)
        db.session.add(cardio_detail)

    elif exercise_type_id == 3:  # Weight Training
        exercise_name = exercise_details.get('exercise_name')
        reps = exercise_details.get('reps')
        sets = exercise_details.get('sets')
        weight = exercise_details.get('weight')

        if not all([exercise_name, reps, sets, weight]):
            return jsonify({'error': 'Weight Training details are incomplete'}), 400

        weight_training_detail = WeightTrainingDetail(workout_id=workout.id, exercise_name=exercise_name, reps=reps, sets=sets, weight=weight)
        db.session.add(weight_training_detail)

    db.session.commit()
    return jsonify({'message': 'Workout added successfully', 'workout': workout.serialize()}), 201

#For edit workout
@app.route('/api/workouts/<int:workout_id>', methods=['PUT'])
def edit_workout(workout_id):
    try:
        data = request.get_json()
        workout = Workout.query.get(workout_id)

        if not workout:
            return jsonify({'message': 'Workout not found'}), 404

        # Update the basic workout details
        workout.name = data['name']
        workout.date = data['date']

        # Depending on the previous exercise_type_id, delete the detail
        if workout.exercise_type_id != data['exercise_type_id']:
            if workout.exercise_type_id == 1 and workout.aerobic_detail:
                db.session.delete(workout.aerobic_detail)
            elif workout.exercise_type_id == 2 and workout.cardio_detail:
                db.session.delete(workout.cardio_detail)
            elif workout.exercise_type_id == 3 and workout.weight_training_detail:
                db.session.delete(workout.weight_training_detail)

            workout.exercise_type_id = data['exercise_type_id']

        # Depending on the new exercise_type_id, add or update the relevant detail table
        if data['exercise_type_id'] == 1:
            if workout.aerobic_detail:
                workout.aerobic_detail.activity_name = data['activity_name']
                workout.aerobic_detail.duration = data['duration']
                workout.aerobic_detail.speed = data['speed']
            else:
                aerobic_detail = AerobicDetail(
                    workout_id=workout.id,
                    activity_name=data['activity_name'],
                    duration=data['duration'],
                    speed=data['speed']
                )
                db.session.add(aerobic_detail)

        elif data['exercise_type_id'] == 2:
            if workout.cardio_detail:
                workout.cardio_detail.machine_name = data['machine_name']
                workout.cardio_detail.time_duration = data['time_duration']
                workout.cardio_detail.distance = data['distance']
            else:
                cardio_detail = CardioDetail(
                    workout_id=workout.id,
                    machine_name=data['machine_name'],
                    time_duration=data['time_duration'],
                    distance=data['distance']
                )
                db.session.add(cardio_detail)

        elif data['exercise_type_id'] == 3:
            if workout.weight_training_detail:
                workout.weight_training_detail.exercise_name = data['exercise_name']
                workout.weight_training_detail.reps = data['reps']
                workout.weight_training_detail.sets = data['sets']
                workout.weight_training_detail.weight = data['weight']
            else:
                weight_training_detail = WeightTrainingDetail(
                    workout_id=workout.id,
                    exercise_name=data['exercise_name'],
                    reps=data['reps'],
                    sets=data['sets'],
                    weight=data['weight']
                )
                db.session.add(weight_training_detail)

        db.session.commit()
        # Assuming `workout.serialize()` is a method that converts the workout and its details to a dictionary
        return jsonify(workout.serialize()), 200
    except Exception as e:
        print(f"Error updating workout: {e}")
        db.session.rollback()  # Make sure to rollback any changes in case of errors
        return jsonify({'message': 'Failed to update workout'}), 500

@app.route('/api/workouts/<int:workout_id>', methods=['DELETE'])
def delete_workout(workout_id):
    workout = Workout.query.get(workout_id)

    if not workout:
        return jsonify({'message': 'Workout not found'}), 404

    db.session.delete(workout)
    db.session.commit()

    return jsonify({'message': 'Workout deleted successfully'}), 200

@app.route('/api/workouts/user/<int:user_id>', methods=['GET'])
def get_workouts_by_user(user_id):
    # Retrieve workouts by user_id
    workouts = Workout.query.filter_by(user_id=user_id).all()

    # Convert workouts to dictionary including details based on exercise_type_id
    workout_data = []
    for workout in workouts:
        serialized_workout = workout.serialize()  # Assuming you have a `serialize` method on Workout model

        # Add details based on exercise type
        if workout.exercise_type_id == 1 and workout.aerobic_detail:
            serialized_workout['details'] = {
                'activity_name': workout.aerobic_detail.activity_name,
                'duration': workout.aerobic_detail.duration,
                'speed': workout.aerobic_detail.speed
            }
        elif workout.exercise_type_id == 2 and workout.cardio_detail:
            serialized_workout['details'] = {
                'machine_name': workout.cardio_detail.machine_name,
                'time_duration': workout.cardio_detail.time_duration,
                'distance': workout.cardio_detail.distance
            }
        elif workout.exercise_type_id == 3 and workout.weight_training_detail:
            serialized_workout['details'] = {
                'exercise_name': workout.weight_training_detail.exercise_name,
                'reps': workout.weight_training_detail.reps,
                'sets': workout.weight_training_detail.sets,
                'weight': workout.weight_training_detail.weight
            }
        workout_data.append(serialized_workout)

    return jsonify(workout_data), 200


# FOR WEIGHT

@app.route('/api/weight', methods=['POST'])
def add_weight():
    data = request.get_json()
    
    new_weight = Weight(
        user_id=data['user_id'],
        date=data['date'],
        weight_value=data['weight_value']
    )

    db.session.add(new_weight)
    db.session.commit()

    return jsonify({'message': 'Weight added successfully!', 'weight': new_weight.serialize()}), 201

@app.route('/api/weight/user/<int:user_id>', methods=['GET'])
def get_all_weights(user_id):
    weights = Weight.query.filter_by(user_id=user_id).all()
    return jsonify([weight.serialize() for weight in weights]), 200

@app.route('/api/weight/<int:id>', methods=['PUT'])
def update_weight(id):
    weight = Weight.query.get(id)
    
    if not weight:
        return jsonify({'message': 'Weight record not found!'}), 404

    data = request.get_json()
    if 'date' in data:
        weight.date = data['date']
    if 'weight_value' in data:
        weight.weight_value = data['weight_value']

    db.session.commit()

    return jsonify({'message': 'Weight updated successfully!', 'weight': weight.serialize()}), 200

@app.route('/api/weight/<int:id>', methods=['DELETE'])
def delete_weight(id):
    weight = Weight.query.get(id)
    
    if not weight:
        return jsonify({'message': 'Weight record not found!'}), 404

    db.session.delete(weight)
    db.session.commit()

    return jsonify({'message': 'Weight deleted successfully!'}), 200

@app.route('/api/weight/user/<int:user_id>/range', methods=['POST'])
def get_weights_in_date_range(user_id):
    data = request.get_json()
    start_date = data['start_date']
    end_date = data['end_date']

    weights = Weight.query.filter(
        and_(Weight.user_id == user_id, Weight.date.between(start_date, end_date))
    ).all()

    return jsonify([weight.serialize() for weight in weights]), 200

# FOR BODY MEASUAMENT

@app.route('/api/body_measurements', methods=['POST'])
def add_body_measurement():
    data = request.get_json()

    new_measurement = BodyMeasurement(
        user_id=data['user_id'],
        date=data['date'],
        waist=data['waist'],
        chest=data['chest'],
        arms=data['arms'],
        legs=data['legs'],
        hip=data['hip']
    )

    db.session.add(new_measurement)
    db.session.commit()

    return jsonify({'message': 'Body measurement added successfully!', 'measurement': new_measurement.serialize()}), 201

@app.route('/api/body_measurements/user/<int:user_id>', methods=['GET'])
def get_all_measurements(user_id):
    measurements = BodyMeasurement.query.filter_by(user_id=user_id).all()
    return jsonify([measurement.serialize() for measurement in measurements]), 200

@app.route('/api/body_measurements/<int:id>', methods=['PUT'])
def update_body_measurement(id):
    measurement = BodyMeasurement.query.get(id)

    if not measurement:
        return jsonify({'message': 'Body measurement record not found!'}), 404

    data = request.get_json()
    if 'date' in data:
        measurement.date = data['date']
    if 'waist' in data:
        measurement.waist = data['waist']
    if 'chest' in data:
        measurement.chest = data['chest']
    if 'arms' in data:
        measurement.arms = data['arms']
    if 'legs' in data:
        measurement.legs = data['legs']
    if 'hip' in data:
        measurement.hip = data['hip']

    db.session.commit()

    return jsonify({'message': 'Body measurement updated successfully!', 'measurement': measurement.serialize()}), 200

@app.route('/api/body_measurements/<int:id>', methods=['DELETE'])
def delete_body_measurement(id):
    measurement = BodyMeasurement.query.get(id)

    if not measurement:
        return jsonify({'message': 'Body measurement record not found!'}), 404

    db.session.delete(measurement)
    db.session.commit()

    return jsonify({'message': 'Body measurement deleted successfully!'}), 200

@app.route('/api/body_measurements/user/<int:user_id>/range', methods=['POST'])
def get_body_measurements_in_date_range(user_id):
    data = request.get_json()
    start_date = data['start_date']
    end_date = data['end_date']

    measurements = BodyMeasurement.query.filter(
        and_(BodyMeasurement.user_id == user_id, BodyMeasurement.date.between(start_date, end_date))
    ).all()

    return jsonify([measurement.serialize() for measurement in measurements]), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)



