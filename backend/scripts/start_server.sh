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


#!/bin/bash
cd /home/ec2-user/EduCore/backend || exit 1
export DIRECT_DATABASE_URL="$DIRECT_DATABASE_URL"
pm2 delete backend || true
pm2 start dist/main.js --name backend
pm2 save
