# AWS Capstone POC: Serverless Task Manager & File Vault

A 100% serverless web application built on AWS with automated CI/CD deployment via GitHub Actions.

---

## 1. System Architecture Overview

```text
[ User Browser (HTML / JS) ]
          │
          ▼  (HTTPS / REST JSON + CORS)
[ Amazon API Gateway ]
          │
          ▼  (Proxy Integration)
[ AWS Lambda: Capstone_code (Python 3.11) ]
          │
          ▼  (Boto3 SDK)
[ Amazon DynamoDB ]  &  [ Amazon S3 (Hosting / Vault) ]4

AWS Region: ap-south-2 (Asia Pacific - Hyderabad)

IAM User (CI/CD): Rakesh_dev

Lambda Execution Role: Capstone_code-role-4hfb4pha


Layer,AWS / Tech Service,Resource / File Name,Purpose
Frontend UI,"HTML5, CSS3, Vanilla JS","index.html, script.js",Responsive user interface & asynchronous API calls
Frontend Hosting,Amazon S3,S3 Website Bucket,Publicly serves static web assets globally
API Layer,Amazon API Gateway,CapstoneTaskAPI (HTTP API v2),Manages secure public HTTPS routing and CORS policies
Backend Compute,AWS Lambda & Python 3.11,Capstone_code (lambda_function.py),Executes core CRUD business logic serverlessly
Database,Amazon DynamoDB,TaskTable (Partition Key: taskId),Scales automatically for high-performance NoSQL storage
CI/CD Automation,GitHub Actions,.github/workflows/deploy.yml,Automates backend code testing and deployment on git push