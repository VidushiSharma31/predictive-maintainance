"""
Predictive Maintenance Inference Module
Uses hardcoded threshold values for RUL prediction and Failure Type classification
"""

import numpy as np
import json
import random

# Hardcoded threshold values for predictions
THRESHOLDS = {
    'high_vibration': 0.35,
    'high_temp': 320,
    'high_speed': 3500,
    'high_torque': 55,
    'high_op_hours': 5000,
    'critical_rul': 50,
    'warning_rul': 150,
    'base_rul': 500
}

def generate_random_sensor_data(machine_type='H'):
    """
    Generate random sensor data for simulation
    
    Args:
        machine_type (str): Machine type ('H', 'M', or 'L')
    
    Returns:
        dict: Dictionary containing sensor readings
    """
    # Generate realistic sensor values based on machine type
    if machine_type == 'H':  # High-performance machine
        air_temp = np.random.uniform(295, 310)  # K
        process_temp = np.random.uniform(305, 320)  # K
        rotational_speed = np.random.uniform(2500, 3500)  # rpm
        torque = np.random.uniform(40, 65)  # Nm
        vibration = np.random.uniform(0.1, 0.3)  # mm/s
        operational_hours = np.random.uniform(500, 2000)  # hours
    elif machine_type == 'M':  # Medium-performance machine
        air_temp = np.random.uniform(298, 312)  # K
        process_temp = np.random.uniform(308, 323)  # K
        rotational_speed = np.random.uniform(1500, 2500)  # rpm
        torque = np.random.uniform(25, 45)  # Nm
        vibration = np.random.uniform(0.15, 0.35)  # mm/s
        operational_hours = np.random.uniform(300, 1500)  # hours
    else:  # 'L' - Low-performance machine
        air_temp = np.random.uniform(300, 315)  # K
        process_temp = np.random.uniform(310, 325)  # K
        rotational_speed = np.random.uniform(500, 1500)  # rpm
        torque = np.random.uniform(10, 30)  # Nm
        vibration = np.random.uniform(0.2, 0.4)  # mm/s
        operational_hours = np.random.uniform(100, 1000)  # hours
    
    return {
        'Air temperature [K]': round(air_temp, 2),
        'Process temperature [K]': round(process_temp, 2),
        'Rotational speed [rpm]': round(rotational_speed, 2),
        'Torque [Nm]': round(torque, 2),
        'Vibration Levels': round(vibration, 3),
        'Operational Hours': round(operational_hours, 2),
        'Type': machine_type
    }

def predict_rul_and_failure(sensor_data):
    """
    Predict RUL and Failure Type based on sensor data using hardcoded thresholds
    
    Args:
        sensor_data (dict): Dictionary of sensor readings
    
    Returns:
        dict: Prediction results with RUL, failure type, and confidence
    """
    try:
        # Extract sensor values
        air_temp = sensor_data.get('Air temperature [K]', 300)
        process_temp = sensor_data.get('Process temperature [K]', 310)
        rot_speed = sensor_data.get('Rotational speed [rpm]', 2000)
        torque = sensor_data.get('Torque [Nm]', 35)
        vibration = sensor_data.get('Vibration Levels', 0.25)
        op_hours = sensor_data.get('Operational Hours', 1000)
        
        # Calculate RUL using threshold-based factors
        avg_temp = (air_temp + process_temp) / 2
        temp_factor = 0.7 if avg_temp > THRESHOLDS['high_temp'] else 1.0
        vibration_factor = 0.6 if vibration > THRESHOLDS['high_vibration'] else 1.0
        hours_factor = 1.0 - (op_hours / THRESHOLDS['high_op_hours'])
        speed_factor = 0.8 if rot_speed > THRESHOLDS['high_speed'] else 1.0
        
        predicted_rul = max(10, THRESHOLDS['base_rul'] * temp_factor * vibration_factor * hours_factor * speed_factor)
        
        # Determine failure type using threshold logic
        failure_type = 'No Failure Detected'
        failure_confidence = 5 + random.random() * 15
        
        if vibration > THRESHOLDS['high_vibration']:
            failure_type = 'Bearing Wear'
            failure_confidence = 85 + random.random() * 10
        elif process_temp > THRESHOLDS['high_temp']:
            failure_type = 'Overheating'
            failure_confidence = 75 + random.random() * 15
        elif rot_speed > THRESHOLDS['high_speed'] and torque > 50:
            failure_type = 'Lubrication Degradation'
            failure_confidence = 70 + random.random() * 20
        elif torque > THRESHOLDS['high_torque']:
            failure_type = 'Power Transmission Failure'
            failure_confidence = 65 + random.random() * 25
        
        # Determine alert status
        alert_status = 'CRITICAL' if predicted_rul < THRESHOLDS['critical_rul'] else \
                      'WARNING' if predicted_rul < THRESHOLDS['warning_rul'] else 'HEALTHY'
        
        return {
            'error': None,
            'rul': round(predicted_rul, 2),
            'failure_type': failure_type,
            'confidence': round(failure_confidence, 2),
            'alert_status': alert_status,
            'sensor_data': sensor_data
        }
    
    except Exception as e:
        return {
            'error': str(e),
            'rul': None,
            'failure_type': None,
            'confidence': None,
            'alert_status': None
        }

def run_simulation(machine_type='H'):
    """
    Run complete simulation: generate data and predict using thresholds
    
    Args:
        machine_type (str): Machine type ('H', 'M', or 'L')
    
    Returns:
        dict: Simulation results including predictions
    """
    # Generate random sensor data
    sensor_data = generate_random_sensor_data(machine_type)
    
    # Make predictions using threshold-based logic
    predictions = predict_rul_and_failure(sensor_data)
    predictions['success'] = predictions['error'] is None
    
    return predictions

if __name__ == "__main__":
    # Test the inference module
    print("Testing Predictive Maintenance ML Inference...")
    print("\n" + "="*50)
    
    for machine_type in ['H', 'M', 'L']:
        print(f"\nSimulation for Machine Type: {machine_type}")
        result = run_simulation(machine_type)
        print(json.dumps(result, indent=2))
