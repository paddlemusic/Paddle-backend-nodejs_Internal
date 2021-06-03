#!/bin/bash
set -x
chown -R ubuntu:ubuntu /home/ubuntu/paddle-backend/

echo  "***Installing npm package ***" >> /tmp/paddle-backend-api-prod_deploy_logs
echo >> /tmp/paddle-backend-api-prod_deploys_logs
runuser -l ubuntu -c 'cd /home/ubuntu/paddle-backend && npm install'
runuser -l ubuntu -c 'cd /home/ubuntu/paddle-backend && npm install --unsafe-perm'
sleep 10
echo "***starting paddle0-backend-admin-api-prod application ***" >> /tmp/paddle-backend-api-prod_deploy_logs
runuser -l ubuntu -c 'cd /home/ubuntu/paddle-backend && sudo pm2 start app/server.js --name paddle0  --silent' >> /tmp/paddle-backend-api-prod_deploy_logs

s1=`pm2 status | grep -we paddle0 | awk '{print $12}'`
sleep 5
s2=`pm2 status | grep -we paddle0 | awk '{print $12}'`
if [ $s1 == $s2 ]
then
echo "BUILD SUCCESSFUL" >> /tmp/paddle-backend-api-prod_deploy_logs
echo >> /tmp/paddle-backend-api-prod_deploy_logs
else
echo "Node process is restarting" >> /tmp/paddle-backend-api-prod_deploy_logs
echo >> /tmp/paddle-backend-api-prod_deploy_logs
fi