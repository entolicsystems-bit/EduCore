#!/bin/bash
cd /ec2-user/EduCore/backend
npm install
pm2 restart all || pm2 start index.js --name backend-app
