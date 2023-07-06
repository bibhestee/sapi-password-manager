#!/usr/bin/env bash

sudo apt install mysql-server -y
sudo usermod -d /var/lib/mysql/ mysql
sudo service mysql start
cat db_setup.sql | sudo mysql -uroot 

