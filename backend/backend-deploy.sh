#!/bin/bash
set -e

cd /home/ec2-user/EduCore/backend

git pull origin feature

npm install
npm run build

pm2 restart educore-backend || pm2 start dist/main.js --name educore-backend
