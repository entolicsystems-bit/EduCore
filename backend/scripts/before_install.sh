# #!/bin/bash
# echo "Running BeforeInstall..."
# set -e
# rm -rf /home/ec2-user/EduCore/backend
# mkdir -p /home/ec2-user/EduCore/backend
#!/bin/bash
echo "BeforeInstall..."

pm2 delete all || true
pm2 kill || true

# keep .env safe
mv /home/ec2-user/EduCore/backend/.env /tmp/backend.env 2>/dev/null || true

rm -rf /home/ec2-user/EduCore/backend
mkdir -p /home/ec2-user/EduCore/backend




# restore env if exists
if [ -f /tmp/backend.env ]; then
  mv /tmp/backend.env /home/ec2-user/EduCore/backend/.env
  chown ec2-user:ec2-user /home/ec2-user/EduCore/backend/.env
  chmod 644 /home/ec2-user/EduCore/backend/.env
fi