#!/usr/bin/env bash
sudo apt update -y
sudo apt install redis -y
sudo service redis-server start