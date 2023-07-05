#!/usr/bin/bash

sudo apt install mysql-server -y
sudo usermod -d /var/lib/mysql/ mysql
sudo service mysql start
sudo service mysql status
cat db_setup.sql | sudo mysql -uroot 

