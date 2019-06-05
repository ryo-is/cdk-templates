"""
Lambda Function runtime Python3.7
"""
import sys
import json
# from typing import Dict, Any, List
# from datetime import datetime
import boto3
# from dateutil.parser import parse

ENCODING = "utf_8"  # CSVファイルの文字コード BOM付きならutf_8_sig
DELIMITER = ";"  # CSVファイルの区切り文字

from lambda_types import LambdaDict, LambdaContext

def handler(event: LambdaDict, context: LambdaContext) -> LambdaDict:
    """
        社員マスターをputするLambdaFunction
    """
    message: str = 'Success!!'
    response_body = {
        'statusCode': 200,
        'body': json.dumps({'result': 200, 'msg': message}),
        'headers': {'Access-Control-Allow-Origin': '*'}
    }
    print(response_body)
    return response_body
