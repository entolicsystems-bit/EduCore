#!/bin/bash
cd /home/ec2-user/EduCore/backend || exit 1
npm install
pm2 restart backend || pm2 start main.js --name backend
pm2 save
