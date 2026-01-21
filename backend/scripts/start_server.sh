# #!/bin/bash
# cd /home/ec2-user/EduCore/backend || exit 1
# npm install
# # npx prisma generate
# pm2 restart backend || pm2 start main.js --name backend
# pm2 save
# cd /home/ec2-user/EduCore/backend
# npm ci --omit=dev
# npx prisma generate
# pm2 restart backend || pm2 start dist/main.js --name backend
# pm2 save


# #!/bin/bash
# cd /home/ec2-user/EduCore/backend || exit 1
# export $(grep -v '^#' .env | xargs)
# export DIRECT_DATABASE_URL="$DIRECT_DATABASE_URL"
# pm2 delete backend || true
# pm2 start dist/main.js --name backend
# pm2 save

#!/bin/bash


# Move into backend (very important for Prisma + env resolution)
cd /home/ec2-user/EduCore/backend || exit 1

echo "🔧 Loading environment variables..."

# Load .env into current shell
if [ -f ".env" ]; then
  export $(grep -v '^#' .env | xargs)
else
  echo "⚠️ .env file not found at backend folder"
fi

# Mandatory runtime vars
export NODE_ENV=dev
export DIRECT_DATABASE_URL="$DIRECT_DATABASE_URL"

echo "🔧 Environment loaded"
echo "DIRECT_DATABASE_URL=$DIRECT_DATABASE_URL"

# Restart backend with updated environment
echo "🚀 Starting PM2 application..."

pm2 delete backend >/dev/null 2>&1 || true

pm2 start dist/main.js --name backend --update-env

# Persist environment for reboot or codedeploy restart
pm2 save

echo "✅ Backend started successfully"
