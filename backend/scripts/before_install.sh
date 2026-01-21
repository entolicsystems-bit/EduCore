# #!/bin/bash
# echo "Running BeforeInstall..."
# set -e
# rm -rf /home/ec2-user/EduCore/backend
# mkdir -p /home/ec2-user/EduCore/backend
#!/bin/bash
echo "BeforeInstall..."
# keep .env safe
mv /home/ec2-user/EduCore/backend/.env /tmp/backend.env 2>/dev/null || true

rm -rf /home/ec2-user/EduCore/backend
mkdir -p /home/ec2-user/EduCore/backend




# restore env
mv /tmp/backend.env /home/ec2-user/EduCore/backend/.env 2>/dev/null || true
chown ec2-user:ec2-user .env
chmod 644 .env
