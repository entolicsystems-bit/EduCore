#!/bin/bash
set -e

echo "🚀 Backend deployment started"

cd /home/ec2-user/EduCore/backend

echo "📦 Installing dependencies"
npm install --omit=dev

echo "🧬 Generating Prisma client"
npx prisma generate

echo "♻️ Restarting backend service"
pm2 restart backend || pm2 start dist/main.js --name backend

echo "✅ Backend deployment completed"
exit 0

