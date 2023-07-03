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
    return res.headers.get('Authorization')


if __name__ == "__main__":
    signup()
    token = signin()
