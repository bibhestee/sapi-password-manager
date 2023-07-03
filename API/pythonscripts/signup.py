#!/usr/bin/env python3
import requests

def signup():
    data = {
            'username': 'Helen', 'email': 'Abiola@gmail.com', 'password': 'Abiola',
            }
    header = {'Content-Type': 'application/json'}
    res = requests.post('http://localhost:3002/api/v1/signup', headers=header, json=data)
    print(res.json())
if __name__ == "__main__":
    signup()