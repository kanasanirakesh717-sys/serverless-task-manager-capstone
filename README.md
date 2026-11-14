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