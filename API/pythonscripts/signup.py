#!/usr/bin/env python3
import requests

def signup():
    data = {
            'username': 'Bola', 'email': 'bola@gmail.com', 'password': 'Bola2001',
            }
    header = {'Content-Type': 'application/json'}
    res = requests.post('http://localhost:3002/api/v1/signup', headers=header, json=data)
    print(res.json())

def signin():
    data = {'email': 'bola@gmail.com', 'password': 'Bola2001'}
    header = {'Content-Type': 'application/json'}
    res = requests.post('http://localhost:3002/api/v1/signin', headers=header, json=data);
    print(res.headers.get('Authorization'))
    print(res.json())

    print("\ntest limiter\n")
    params = {"api_key": "sapi_$2b$05$LjJX5ggbsmT6iBpqy15rVOnbDb47eqcwJ1.NU.rrewOBx9XLPxnTi"} 
    res = requests.get('http://localhost:3002/api/v1/testlimiter', headers=header, json=data, params=params)
    print(res);
    print(res.json())
    return res.headers.get('Authorization')

def generate_key(token):
    header = {'Content-Type': 'application/json', "authorization": token}
    res = requests.get('http://localhost:3002/api/v1/api-key/generate', headers=header);
    print(res)
    print(res.json())


if __name__ == "__main__":
    signup()
    token = signin()
    #generate_key(token)
