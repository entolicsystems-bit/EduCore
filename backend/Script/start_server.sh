#!/bin/bash
cd /home/ubuntu/backend-app
npm install
pm2 restart all || pm2 start index.js --name backend-app
