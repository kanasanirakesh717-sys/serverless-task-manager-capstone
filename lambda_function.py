import json
import boto3
import os
import uuid

dynamodb = boto3.resource('dynamodb')
TABLE_NAME = os.environ.get('DYNAMODB_TABLE', 'TasksTable')
table = dynamodb.Table(TABLE_NAME)

def lambda_handler(event, context):
    print("Received event:", json.dumps(event))
    
    # Support both HTTP API v2 and REST API v1 event payloads
    http_method = (
        event.get('requestContext', {}).get('http', {}).get('method') or 
        event.get('httpMethod')
    )
    
    headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE",
        "Access-Control-Allow-Headers": "Content-Type"
    }

    try:
        if http_method == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps('Preflight check successful')
            }
            
        elif http_method == 'GET':
            response = table.scan()
            items = response.get('Items', [])
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps(items)
            }
            
        elif http_method == 'POST':
            body_data = event.get('body', '{}')
            body = json.loads(body_data) if body_data else {}
            title = body.get('title')
            
            if not title:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Task title is required'})
                }
                
            item = {
                'id': str(uuid.uuid4()),
                'title': title,
                'status': 'Pending'
            }
            
            table.put_item(Item=item)
            return {
                'statusCode': 201,
                'headers': headers,
                'body': json.dumps({'message': 'Task created successfully', 'item': item})
            }
            
        else:
            return {
                'statusCode': 405,
                'headers': headers,
                'body': json.dumps({'error': f'Method {http_method} not allowed'})
            }
            
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }