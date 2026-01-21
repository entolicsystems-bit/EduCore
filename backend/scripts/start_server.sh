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

# #!/bin/bash

# cd /home/ec2-user/EduCore/backend || exit 1

# echo "🔧 Loading env..."
# if [ -f ".env" ]; then
#   export $(grep -v '^#' .env | xargs)
# fi

# export NODE_ENV=production

# echo "Running prisma migration..."
# npx prisma migrate deploy || true

# echo "🔧 Starting backend with PM2..."
# pm2 delete backend >/dev/null 2>&1 || true
# pm2 start dist/main.js --name backend --update-env


# echo "🚀 Backend started successfully"


#!/bin/bash
sudo chown -R ec2-user:ec2-user /home/ec2-user/EduCore

cd /home/ec2-user/EduCore/backend || exit 1

echo "🔧 Received from CodeDeploy:"
echo "DIRECT_DATABASE_URL=$DIRECT_DATABASE_URL"
echo "DATABASE_URL=$DATABASE_URL"

export NODE_ENV=dev
# 1️⃣ Install dependencies on EC2 (FIXES WASM ISSUE)
npm i

# 2️⃣ Generate Prisma client on EC2
npx prisma generate
# 1️⃣ MIGRATION
echo "📦 Running Prisma migrate deploy..."
DATABASE_URL="$DIRECT_DATABASE_URL"
npx prisma migrate deploy --schema prisma/schema.prisma || {
  echo "❌ Migration failed"
  exit 1
}

# 2️⃣ RUNTIME
echo "🚀 Starting backend with Accelerate..."
# export DATABASE_URL="$DATABASE_URL"
# export DIRECT_DATABASE_URL="$DIRECT_DATABASE_URL"

pm2 delete backend >/dev/null 2>&1 || true
pm2 start dist/main.js --name backend --update-env

echo "✔ Backend started successfully (pipeline mode)"

