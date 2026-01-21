# #!/bin/bash
# echo "Running BeforeInstall..."
# set -e
# rm -rf /home/ec2-user/EduCore/backend
# mkdir -p /home/ec2-user/EduCore/backend
#!/bin/bash
echo "Running BeforeInstall..."
set -e

# ensure folder exists
mkdir -p /home/ec2-user/EduCore/backend

# delete everything except .env
find /home/ec2-user/EduCore/backend \
  -mindepth 1 \
  ! -name ".env" \
  -exec rm -rf {} +

