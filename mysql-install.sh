#!/bin/bash

sudo apt install mysql-server -y
sudo service mysql start
sudo service mysql status
cat db_setup.sql | sudo mysql -uroot 

