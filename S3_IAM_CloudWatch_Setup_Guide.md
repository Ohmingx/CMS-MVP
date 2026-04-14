# AWS Setup Guide: S3, IAM, and CloudWatch

This guide walks you through the production setup for the image upload infrastructure on your Canteen Management System.

## Section 1: S3 Setup (Image Storage)

1. **Go to AWS Console** and search for **S3**.
2. Click **Create bucket**.
3. **Bucket name**: Choose a unique name (e.g., `sewdl-canteen-images-production`).
4. **AWS Region**: Select the same region your EC2 is in (e.g., `ap-south-1`).
5. **Object Ownership**: Leave at *ACLs disabled (recommended)*.
6. **Block Public Access settings for this bucket**:
   - **UNCHECK** the box "Block *all* public access".
   - Acknowledge the warning that the bucket will become public.
7. Click **Create bucket**.
8. **Add Bucket Policy for Public Read**:
   - Open your new bucket.
   - Go to the **Permissions** tab.
   - Scroll down to **Bucket policy** and click **Edit**.
   - Paste the following JSON (replace `YOUR-BUCKET-NAME` with the name you chose):
     ```json
     {
         "Version": "2012-10-17",
         "Statement": [
             {
                 "Sid": "PublicReadGetObject",
                 "Effect": "Allow",
                 "Principal": "*",
                 "Action": "s3:GetObject",
                 "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/menu-items/*"
             }
         ]
     }
     ```
   - Click **Save changes**. *Note: Only images under the `/menu-items` folder will be public.*
9. **CORS Configuration (If necessary)**:
   - In the Permissions tab, scroll to **Cross-origin resource sharing (CORS)** and click **Edit**.
   - Since the backend uploads the images (not direct browser upload), you do NOT strictly need CORS for upload, but it's good practice. Paste this:
     ```json
     [
         {
             "AllowedHeaders": ["*"],
             "AllowedMethods": ["GET"],
             "AllowedOrigins": ["*"],
             "ExposeHeaders": []
         }
     ]
     ```
   - Click **Save changes**.

---

## Section 2: IAM Role Setup (Security)

We are securely managing credentials for your EC2 instance by attaching an IAM role. Hardcoding `AWS_ACCESS_KEY_ID` in `.env` is bad practice.

1. **Go to AWS Console** and search for **IAM**.
2. Go to **Roles** -> **Create role**.
3. Select **AWS service** -> Use case **EC2**. Click Next.
4. **Attach permissions policies**:
   - You need to create a custom policy. Click **Create policy** (opens new tab).
   - Go to **JSON** tab and paste:
     ```json
     {
         "Version": "2012-10-17",
         "Statement": [
             {
                 "Effect": "Allow",
                 "Action": [
                     "s3:PutObject",
                     "s3:GetObject"
                 ],
                 "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
             },
             {
                 "Effect": "Allow",
                 "Action": [
                     "logs:CreateLogGroup",
                     "logs:CreateLogStream",
                     "logs:PutLogEvents",
                     "logs:DescribeLogStreams"
                 ],
                 "Resource": [
                     "arn:aws:logs:*:*:*"
                 ]
             }
         ]
     }
     ```
   - Replace `YOUR-BUCKET-NAME` in the S3 resource statement.
   - Click **Next: Tags**, then **Next: Review**.
   - Name it `CanteenAppPolicy` and click **Create policy**.
5. Return to the Role creation tab, refresh the list, search for `CanteenAppPolicy`, check the box, and click **Next**.
6. **Role name**: `CanteenAppEC2Role`.
7. Click **Create role**.

---

## Section 3: EC2 Configuration

1. **Go to EC2 Console** -> **Instances**.
2. Select your running instance (13.233.73.222).
3. Click **Actions** > **Security** > **Modify IAM role**.
4. From the dropdown, select `CanteenAppEC2Role`.
5. Click **Update IAM role**.

*Your backend now automatically has S3 and CloudWatch permissions without any access keys in `.env`!*

**Backend `.env` configuration**:
Ensure these two lines are added to `/backend/.env`:
```env
AWS_REGION=ap-south-1
S3_BUCKET_NAME=YOUR-BUCKET-NAME
```
Then restart your pm2 backend: `pm2 restart backend`

---

## Section 4: CloudWatch Setup (Logging & Monitoring)

We need the CloudWatch Agent to fetch node logs and send them to the CloudWatch Console.

1. SSH into your Ubuntu instance:
   ```bash
   ssh -i your-key.pem ubuntu@13.233.73.222
   ```

2. **Download and Install CloudWatch Agent**:
   ```bash
   wget https://amazoncloudwatch-agent.s3.amazonaws.com/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
   sudo dpkg -i -E ./amazon-cloudwatch-agent.deb
   ```

3. **Configure the Agent**:
   Create a config file so it reads your PM2 logs.
   ```bash
   nano /opt/aws/amazon-cloudwatch-agent/bin/config.json
   ```
   Paste the following:
   ```json
   {
       "agent": {
           "run_as_user": "root"
       },
       "logs": {
           "logs_collected": {
               "files": {
                   "collect_list": [
                       {
                           "file_path": "/home/ubuntu/.pm2/logs/backend-out.log",
                           "log_group_name": "CanteenApp/Backend",
                           "log_stream_name": "backend-stdout",
                           "timestamp_format": "%Y-%m-%d %H:%M:%S"
                       },
                       {
                           "file_path": "/home/ubuntu/.pm2/logs/backend-error.log",
                           "log_group_name": "CanteenApp/Backend",
                           "log_stream_name": "backend-stderr",
                           "timestamp_format": "%Y-%m-%d %H:%M:%S"
                       }
                   ]
               }
           }
       },
       "metrics": {
           "metrics_collected": {
               "mem": {
                   "measurement": ["mem_used_percent"]
               },
               "cpu": {
                   "measurement": ["cpu_usage_idle"],
                   "totalcpu": true
               }
           }
       }
   }
   ```
   *(Make sure your pm2 log path perfectly matches. The default PM2 path is usually `/home/ubuntu/.pm2/logs/...`)*

4. **Start the Agent**:
   ```bash
   sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/opt/aws/amazon-cloudwatch-agent/bin/config.json -s
   ```

5. **Verify it is running**:
   ```bash
   sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -m ec2 -a status
   ```

---

## Section 5: Testing Flow

1. Go to your Admin Dashboard frontend and navigate to Menu Management.
2. Fill up details and select a food picture from your computer, then click **Add Item**.
3. **Verify S3**: Open your S3 Bucket Console, navigate to `menu-items/` folder. You and see the `.jpg/png` file uploaded.
4. **Verify Frontend**: Go to the **Student Menu View**. The image should perfectly load on the food card instead of the emoji.
5. **Check CloudWatch**: 
   - Go to AWS CloudWatch Service > **Log Groups**.
   - Search for `CanteenApp/Backend`.
   - Open the stream `backend-stdout`. You should see the nice structured logs: `{"event":"ImageUploadSuccess","imageUrl":"...","size":...}`.

If the upload fails, you will find the actual error details in `backend-stderr`!
