"""
Lambda Function runtime Python3.7
"""
import sys
# from typing import Dict, Any, List
# from datetime import datetime
# import boto3
# from dateutil.parser import parse
from lambda_types import LambdaDict, LambdaContext

def handler(event: LambdaDict, context: LambdaContext) -> LambdaDict:
    """テスト用のLambda関数(関数のタイトル)

    ここに関数の詳細な説明を記載

    Args:
        event: Lambdaに渡されるイベントオブジェクト
        context: Lambda関数自身の情報や呼び出しに関する情報が保存されたオブジェクト

    Returns:
        辞書型のオブジェクトを返す

    """
    # いろいろと出力してみる=================
    # Pythonのバージョン
    print(sys.version)
    # eventの中身
    print(event)
    # contextの中身
    print(context)

    # try:
    #     dynamodb = boto3.resource('dynamodb')
    #     table = dynamodb.Table('CDKPythonLambdaStackTable')
    #     table.put_item(
    #         Item={
    #             'ID': 'test',
    #             'record_time': datetime.now().strftime('%Y/%m/%d %H:%M:%S'),
    #         }
    #     )
    # except Exception as err:
    #     print(err)

    # 戻り値===============================
    message: str = 'Success!!'
    return {'message': message}
