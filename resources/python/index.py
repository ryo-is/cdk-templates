"""
Lambda Function runtime Python3.7
"""
import sys
from typing import Dict, Any, List
import datetime
from dateutil.parser import parse
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

    print(event['key1'] if 'key1' in event else 'ValueX1')
    print('実行されているLambda関数の名前: {}'.format(context.function_name))


    # Pythonでの型情報に関して===============
    count: int = 20
    print('数値型です: {}'.format(count))

    msg: str = 'こんにちは'
    print('文字列型です: {}'.format(msg))

    list_a: List[int] = [5, 12, 23]
    print('配列です: {}'.format(list_a))

    dict_a: Dict[str, str] = {'cat': 'nyaa!'}
    print('辞書型です: {}'.format(dict_a))

    none: None = None
    if none is None:
        print('Noneです: {}'.format(none))

    variable: Any = {'object': {'name': 'taro', 'age': 29}}
    print('Any型です: {}'.format(variable))


    # c標準で使えるライブラリを使ってみた=========
    # TODO: dateutilについて他の例を追加する
    now: datetime.datetime = parse('Sat Oct 11 17:13:46 UTC 2019')
    today = now.date()
    print(today)

    # 戻り値===============================
    message: str = 'Hello World'
    return {'message': message}
