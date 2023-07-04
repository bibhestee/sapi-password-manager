-- create database 
-- create a user and password
-- grants necessary permissions on sapi

select plugin_name, plugin_status from information_schema.plugins where plugin_name like 'validate%';
install plugin validate_password soname 'validate_password.so';
SET GLOBAL validate_password.policy=LOW;
CREATE DATABASE IF NOT EXISTS sapi_db;
CREATE USER IF NOT EXISTS 'sapi'@'localhost' IDENTIFIED BY 'sapi_v1.0';
GRANT ALL PRIVILEGES ON sapi_db.* TO 'sapi'@'localhost';
GRANT SELECT ON performance_schema.* TO 'sapi'@'localhost';
FLUSH PRIVILEGES;
