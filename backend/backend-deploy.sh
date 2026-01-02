#!/bin/bash
set -e

cd /home/ec2-user/educore-backend

npm install --omit=dev
npx prisma generate
npm run start:prod
