#!/bin/bash
set -x
echo "** paddle-backend-api-prod process status **" >> /tmp/paddle-backend-api-prod_deploy_logs
runuser -l ubuntu -c 'sudo pm2 status' | grep -wo paddle0
if [  $? -ne 0 ];
then
    echo "############################## pm2 not running #################################" >> /tmp/paddle-backend-api-prod_deploy_logs
else
    echo "############################## pm2 already running Deleting ####################" >> /tmp/paddle-backend-api-prod_deploy_logs
     runuser -l ubuntu -c 'sudo pm2 delete paddle0'
fi

rm -rf /home/ubuntu/paddle-backend

if [ ! -d /home/ubuntu/paddle-backend ]; then
runuser -l ubuntu -c 'mkdir -p /home/ubuntu/paddle-backend' >> /tmp/paddle-backend-prod_deploy_logs
fi