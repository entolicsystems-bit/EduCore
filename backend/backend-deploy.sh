#!/bin/bash
set -e

echo "Starting backend AfterDeploy script..."

cd /home/ec2-user/backend || exit 1

npm install --production
npm run build

pm2 restart all || pm2 start dist/main.js --name backend

echo "Backend deployment completed successfully"
