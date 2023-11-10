from flask import Flask, jsonify, request, abort
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash 
from sqlalchemy.dialects.postgresql import ENUM
from datetime import datetime, timedelta, date
from sqlalchemy import and_, or_
from apscheduler.schedulers.background import BackgroundScheduler
import logging
import requests

logging.basicConfig(level=logging.INFO)


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

# Enum type for goal metric
GoalMetrics = ENUM('Duration', 'Sessions', name='goal_metrics', create_type=True)

class Goal(db.Model):
    __tablename__ = 'goals'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    exercise_type_id = db.Column(db.Integer, db.ForeignKey('exercise_types.id'), nullable=False)
    goal_metric = db.Column(GoalMetrics, nullable=False)
    goal_value = db.Column(db.Float, nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    auto_continue = db.Column(db.Boolean, default=False)

    user = db.relationship('User', backref=db.backref('goals', lazy=True))
    exercise_type = db.relationship('ExerciseType', backref=db.backref('goals', lazy=True))

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'exercise_type_id': self.exercise_type_id,
            'goal_metric': self.goal_metric,
            'goal_value': self.goal_value,
            'start_date': self.start_date,
            'end_date': self.end_date,
            'auto_continue': self.auto_continue
        }

class Food(db.Model):
    __tablename__ = 'foods'
    food_id = db.Column(db.Integer, primary_key=True)
    food_name = db.Column(db.String(255), nullable=False)
    calories_per_100g = db.Column(db.Integer, nullable=False)

    def serialize(self):
        return {
            'food_id': self.food_id,
            'food_name': self.food_name,
            'calories_per_100g': self.calories_per_100g
        }

class FoodLog(db.Model):
    __tablename__ = 'food_log'
    log_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    daily_total_calories = db.Column(db.Integer, nullable=False)
    log_date = db.Column(db.Date, default=db.func.current_date())

    user = db.relationship('User', backref=db.backref('food_logs', cascade='all, delete'))

    def serialize(self):
        return {
            'log_id': self.log_id,
            'user_id': self.user_id,
            'daily_total_calories': self.daily_total_calories,
            'log_date': self.log_date.isoformat() if self.log_date else None
        }

class UserBMI(db.Model):
    __tablename__ = 'user_bmi'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    weight_lbs = db.Column(db.Float, nullable=False)  # weight in pounds
    height_in = db.Column(db.Float, nullable=False)   # height in inches
    bmi_value = db.Column(db.Float, nullable=False)
    bmi_status = db.Column(db.String(50), nullable=False)  # e.g., Underweight, Healthy Weight, etc.
    date_recorded = db.Column(db.Date, default=db.func.current_date())
    
    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'weight_lbs': self.weight_lbs,
            'height_in': self.height_in,
            'bmi_value': self.bmi_value,
            'bmi_status': self.bmi_status,
            'date_recorded': self.date_recorded
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


# FOR GOAL IMPLEMENT
@app.route('/api/goals', methods=['POST'])
def set_goal():
    data = request.get_json()

    # Convert the date strings to date objects
    start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
    end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date()

    # Check for overlapping goals of the same exercise type using the date objects
    overlapping_goal = Goal.query.filter(
        Goal.user_id == data['user_id'],
        Goal.exercise_type_id == data['exercise_type_id'],
        or_(
            and_(Goal.start_date <= end_date, Goal.start_date >= start_date),
            and_(Goal.end_date >= start_date, Goal.end_date <= end_date),
            and_(Goal.start_date <= start_date, Goal.end_date >= end_date)
        )
    ).first()

    if overlapping_goal:
        return jsonify({'message': 'There is an overlapping goal for the given period!'}), 400

    # Create the goal if no overlaps
    # goal = Goal(
    #     user_id=data['user_id'],
    #     exercise_type_id=data['exercise_type_id'],
    #     goal_metric=data['goal_metric'],
    #     goal_value=data['goal_value'],
    #     start_date=data['start_date'],
    #     end_date=data['end_date']
    # )
    goal = Goal(
    user_id=data['user_id'],
    exercise_type_id=data['exercise_type_id'],
    goal_metric=data['goal_metric'],
    goal_value=data['goal_value'],
    start_date=start_date,   # use parsed date
    end_date=end_date        # use parsed date
    )

    goal.auto_continue = data.get('auto_continue', False);
    db.session.add(goal)
    db.session.commit()
    return jsonify({'message': 'Goal set successfully!'}), 201

@app.route('/api/goals/<int:goal_id>', methods=['PUT'])
def update_goal(goal_id):
    data = request.get_json()

    # Check if start_date and end_date are in data before converting
    start_date = None
    end_date = None
    if 'start_date' in data:
        start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
    if 'end_date' in data:
        end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date()

    existing_goal = Goal.query.get(goal_id)
    if not existing_goal:
        return jsonify({'message': 'Goal not found!'}), 404

    if start_date and end_date:
        # Check for overlapping goals other than the one being updated
        overlapping_goal = Goal.query.filter(
            Goal.id != goal_id,
            Goal.user_id == data['user_id'],
            Goal.exercise_type_id == data['exercise_type_id'],
            or_(
                and_(Goal.start_date <= end_date, Goal.start_date >= start_date),
                and_(Goal.end_date >= start_date, Goal.end_date <= end_date),
                and_(Goal.start_date <= start_date, Goal.end_date >= end_date)
            )
        ).first()
        if overlapping_goal:
            return jsonify({'message': 'There is an overlapping goal for the given period!'}), 400

    # Update the goal details
    if 'user_id' in data:
        existing_goal.user_id = data['user_id']
    if 'exercise_type_id' in data:
        existing_goal.exercise_type_id = data['exercise_type_id']
    if 'goal_metric' in data:
        existing_goal.goal_metric = data['goal_metric']
    if 'goal_value' in data:
        existing_goal.goal_value = data['goal_value']
    if start_date:
        existing_goal.start_date = start_date
    if end_date:
        existing_goal.end_date = end_date
    if 'auto_continue' in data:
        existing_goal.auto_continue = data['auto_continue']

    db.session.commit()
    return jsonify({'message': 'Goal updated successfully!'}), 200

def auto_continue_goals():
    print("auto_continue_goals started")  # Debug 

    # Fetching all goals from the database
    goals = Goal.query.all()

    current_date = date.today()
    print(f"Current date: {current_date}")  # Debug 

    for goal in goals:
        if goal.end_date <= current_date:
            print(f"Goal {goal.id} end_date: {goal.end_date}")  # Debug 
            if goal.auto_continue:
                # Logic to create a new goal with a new start_date and end_date
                new_start_date = goal.end_date + timedelta(days=1)
                new_end_date = new_start_date + timedelta(days=7)  # assuming a week-long goal, adjust as needed

                # Constructing the new goal
                new_goal = Goal(
                    user_id=goal.user_id,
                    exercise_type_id=goal.exercise_type_id,
                    goal_metric=goal.goal_metric,
                    goal_value=goal.goal_value,
                    start_date=new_start_date,
                    end_date=new_end_date,
                    auto_continue=True  # retain the auto-continue property
                )

                # Add the new goal to the session
                db.session.add(new_goal)

    # Commit the changes to the database
    db.session.commit()

    print("auto_continue_goals finished")  # Debug 

# Initialize the scheduler and add the job
scheduler = BackgroundScheduler()
scheduler.add_job(auto_continue_goals, 'interval', weeks=1)

@app.before_first_request
def initialize_scheduler():
    if not scheduler.running:
        logging.info("Starting scheduler...")
        scheduler.start()
        logging.info("Scheduler started.")

@app.route('/api/debug/run-auto-continue')
def debug_auto_continue():
    auto_continue_goals()  
    return "Function executed", 200

@app.route('/api/goals/<int:goal_id>/toggle-auto-continue', methods=['PUT'])
def toggle_auto_continue(goal_id):
    goal = Goal.query.get(goal_id)
    if not goal:
        return jsonify({'message': 'Goal not found!'}), 404

    # Toggle the auto_continue value
    goal.auto_continue = not goal.auto_continue
    db.session.commit()

    # If the auto_continue is now set to True, optionally call your auto_continue_goals function.
    if goal.auto_continue:
        auto_continue_goals()

    return jsonify({'message': 'Goal auto_continue status updated successfully!'}), 200


# FOR WORKOUT LOG

@app.route('/api/goals/<int:user_id>', methods=['GET'])
def get_goals(user_id):
    all_goals = request.args.get('all') == 'true'
    current_date = datetime.today().date()
    
    query = Goal.query.filter(Goal.user_id == user_id)
    if not all_goals:
        query = query.filter(Goal.start_date <= current_date, Goal.end_date >= current_date)
    
    goals = query.all()
    return jsonify([goal.serialize() for goal in goals])

def get_active_goal(user_id, exercise_type_id):
    try:
        # Fetch the active goals for the user
        response = requests.get(f'http://localhost:5000/api/goals/{user_id}?all=false')
        goals = response.json()
        # Filter the goals based on exercise type
        for goal in goals:
            if goal['exercise_type_id'] == exercise_type_id:
                return goal
        return None
    except Exception as e:
        print("Error fetching active goal:", e)
        return None

@app.route('/api/progress/<int:user_id>', methods=['GET'])
def get_progress(user_id):
    # Fetch the active goals for the user by exercise type
    aerobic_goal = get_active_goal(user_id, 1)
    cardio_goal = get_active_goal(user_id, 2)
    weight_goal = get_active_goal(user_id, 3)

    # Initialize empty lists for workouts related to the goals
    aerobic_workouts = []
    cardio_workouts = []
    weight_workouts = []

    # Fetch the workouts based on the goal's start and end date for each exercise type
    if aerobic_goal:
        aerobic_workouts = Workout.query.filter(
            Workout.user_id == user_id, 
            Workout.date >= aerobic_goal['start_date'],  # Access values using keys
            Workout.date <= aerobic_goal['end_date'],    # Access values using keys
            Workout.exercise_type_id == 1
        ).all()

    if cardio_goal:
        cardio_workouts = Workout.query.filter(
            Workout.user_id == user_id, 
            Workout.date >= cardio_goal['start_date'],  # Access values using keys
            Workout.date <= cardio_goal['end_date'],    # Access values using keys
            Workout.exercise_type_id == 2
        ).all()

    if weight_goal:
        weight_workouts = Workout.query.filter(
            Workout.user_id == user_id, 
            Workout.date >= weight_goal['start_date'],  # Access values using keys
            Workout.date <= weight_goal['end_date'],    # Access values using keys
            Workout.exercise_type_id == 3
        ).all()

    # Calculate the progress based on the fetched workouts
    aerobic_duration = sum([workout.aerobic_detail.duration for workout in aerobic_workouts])
    cardio_sessions = len(cardio_workouts)
    weight_sessions = len(weight_workouts)

    return jsonify({
        'aerobic_duration': aerobic_duration,
        'cardio_sessions': cardio_sessions,
        'weight_sessions': weight_sessions
    })


@app.route('/api/completion/<int:user_id>', methods=['GET'])
def get_completion(user_id):
    try:
        # Fetch user's active goals
        aerobic_goal = get_active_goal(user_id, 1)
        cardio_goal = get_active_goal(user_id, 2)
        weight_goal = get_active_goal(user_id, 3)

        # Fetch user's progress for this week
        progress_data = get_progress(user_id).get_json()

        # Extract progress values
        aerobic_duration = progress_data['aerobic_duration']
        cardio_sessions = progress_data['cardio_sessions']
        weight_sessions = progress_data['weight_sessions']

        # Calculate completion percentages
        aerobic_completion = round((aerobic_duration / (aerobic_goal['goal_value'] if aerobic_goal else 1)) * 100, 1)
        cardio_completion = round((cardio_sessions / (cardio_goal['goal_value'] if cardio_goal else 1)) * 100, 1)
        weight_completion = round((weight_sessions / (weight_goal['goal_value'] if weight_goal else 1)) * 100, 1)

        return jsonify({
            'aerobic_completion': min(100, aerobic_completion),  # Cap completion at 100%
            'cardio_completion': min(100, cardio_completion),  # Cap completion at 100%
            'weight_completion': min(100, weight_completion)   # Cap completion at 100%
        }), 200

    except Exception as e:
        return jsonify({'message': 'Error calculating completion: ' + str(e)}), 500


@app.route('/api/goals/<int:goal_id>', methods=['DELETE'])
def delete_goal(goal_id):
    goal = Goal.query.get(goal_id)
    if not goal:
        return jsonify({'message': 'Goal not found!'}), 404
    db.session.delete(goal)
    db.session.commit()
    return jsonify({'message': 'Goal deleted successfully!'}), 200


# FOR NUTRITION

@app.route('/api/add_bmi_lbs_in', methods=['POST'])
def add_bmi():
    if not request.is_json:
        abort(400, description="Request body must be JSON")

    data = request.get_json()

    print("Data received:", data)  # <- here you print the incoming data immediately after receiving it

    # Ensure necessary data is present
    if not all(key in data for key in ['user_id', 'weight_lbs', 'height_in']):
        abort(400, description="Missing required fields in JSON data")

    try:
        user_id = int(data['user_id'])
        weight_lbs = float(data['weight_lbs'])
        height_in = float(data['height_in'])
    except ValueError:
        abort(400, description="Invalid value format in JSON data")

    # Calculate BMI
    bmi_value = (weight_lbs / (height_in*height_in*12*12)) * 703

    print(f"Calculated BMI value: {bmi_value}")  # <- print the calculated BMI

    # Determine BMI status
    if bmi_value < 18.5:
        bmi_status = "Underweight"
    elif 18.5 <= bmi_value <= 24.9:
        bmi_status = "Healthy Weight"
    elif 25.0 <= bmi_value <= 29.9:
        bmi_status = "Overweight"
    else:
        bmi_status = "Obesity"

    print(f"Assigned BMI status: {bmi_status}")  # <- print the BMI status

    new_bmi = UserBMI(
        user_id=user_id,
        weight_lbs=weight_lbs,
        height_in=height_in,
        bmi_value=bmi_value,
        bmi_status=bmi_status
    )

    try:
        db.session.add(new_bmi)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Error during DB operations: {e}")  # <- print any error during DB operations
        abort(500, description=f"Database error: {e}")

    print("Data successfully saved to DB.")  # <- print after successful save

    return jsonify(new_bmi.serialize())

@app.route('/api/get_bmi_by_user/<int:user_id>', methods=['GET'])
def get_bmi_by_user(user_id):
    bmi_records = UserBMI.query.filter_by(user_id=user_id).all()
    return jsonify([record.serialize() for record in bmi_records])

@app.route('/api/get_all_foods', methods=['GET'])
def get_all_foods():
    foods = Food.query.all()
    return jsonify([food.serialize() for food in foods])

@app.route('/api/log_user_food', methods=['POST'])
def log_user_food():
    user_id = request.json.get('user_id')
    entries = request.json.get('entries')
    today = date.today()

    total_calories = sum([(entry['calories_per_100g'] * entry['quantity_g']) / 100 for entry in entries])

    existing_log = FoodLog.query.filter_by(user_id=user_id, log_date=today).first()
    if existing_log:
        existing_log.daily_total_calories += total_calories
    else:
        new_log = FoodLog(user_id=user_id, daily_total_calories=total_calories)
        db.session.add(new_log)
    db.session.commit()

    return jsonify({"message": "Entries logged successfully!"})

@app.route('/api/get_todays_calories/<int:user_id>', methods=['GET'])
def get_todays_calories(user_id):
    today = date.today()
    formatted_date = today.strftime('%m-%d-%Y')
    log = FoodLog.query.filter_by(user_id=user_id, log_date=today).first()
    total_calories = log.daily_total_calories if log else 0
    return jsonify({'Date': formatted_date, 'Total Calories': total_calories})

@app.route('/api/get_all_food_logs/<int:user_id>', methods=['GET'])
def get_all_food_logs(user_id):
    logs = FoodLog.query.filter_by(user_id=user_id).all()
    return jsonify([log.serialize() for log in logs])

@app.route('/api/update_user_food', methods=['POST'])
def update_user_food():
    user_id = request.json.get('user_id')
    food_id = request.json.get('food_id')
    new_quantity = request.json.get('new_quantity')
    today = date.today()

    log_entry = FoodLog.query.filter_by(user_id=user_id, log_date=today, food_id=food_id).first()
    if log_entry:
        log_entry.quantity = new_quantity
        db.session.commit()
        return jsonify({"message": "Entry updated successfully!"})
    else:
        return jsonify({"message": "No entry found for today."}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)
