import json
import boto3
import uuid

# Explicitly bind to us-east-1 where your TaskTable lives
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
table = dynamodb.Table('TaskTable')

def lambda_handler(event, context):
    print("Received event: ", json.dumps(event))
    
    # Extract HTTP method supporting both HTTP API v2 and REST API v1 payloads
    request_context = event.get('requestContext', {})
    http_info = request_context.get('http', {})
    http_method = http_info.get('method') or event.get('httpMethod', 'GET')
    
    # Standard CORS headers
    headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,GET,POST,DELETE"
    }
    
    # Handle CORS preflight OPTIONS requests
    if http_method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps('CORS preflight check passed')
        }
        
    try:
        # GET: Read/List all tasks from DynamoDB
        if http_method == 'GET':
            response = table.scan()
            items = response.get('Items', [])
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps(items)
            }
            
        # POST: Create a new task in DynamoDB
        elif http_method == 'POST':
            body_str = event.get('body', '{}')
            body = json.loads(body_str) if body_str else {}
            task_id = str(uuid.uuid4())[:8]
            task_title = body.get('title', 'Untitled Task')
            
            item = {
                'taskid': task_id,  # FIXED: Matches lowercase partition key 'taskid'
                'title': task_title,
                'status': 'Pending'
            }
            
            table.put_item(Item=item)
            return {
                'statusCode': 201,
                'headers': headers,
                'body': json.dumps({'message': 'Task created successfully!', 'task': item})
            }
            
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }
print("Successfully deployed via GitHub Actions CI/CD pipeline!!")