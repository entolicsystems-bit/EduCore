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

cd /home/ec2-user/EduCore/backend || exit 1

echo "🔧 Received from CodeDeploy:"
export DIRECT_DATABASE_URL="${DIRECT_DATABASE_URL}"      # still keep direct
export DATABASE_URL="${DATABASE_URL}"
echo "DATABASE_URL=$DIRECT_DATABASE_URL"

export NODE_ENV=dev


# If using Prisma
echo "📦 Running Prisma migrate..."
npx prisma migrate deploy || true

pm2 delete backend >/dev/null 2>&1 || true

echo "🚀 Starting backend..."
pm2 start dist/main.js --name backend --update-env

