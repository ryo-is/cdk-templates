# AWS-CDK Sample Soureces

AWSCDKのサンプルコード

## サンプル

- APIGateway + Lambda
- KinesisDataStreams + Lambda
- AppSync + DynamoDB
- IoTCore + DynamoDB
- S3

## デプロイまでの流れ

1. `yarn build`: TypeScriptのコンパイル
2. `cdk synth (${StackName}) --output ./output`: (指定したStackの)CloudFormationのテンプレートファイルを書き出す。
3. `cdk diff`: 差分を確認。
4. `cdk deploy (${StackName})`: (指定したStackを)デプロイ実行

`cdk synth` を実行すれば、CloudFormationのテンプレートを確認することができるので、デプロイ実行する前に確認するほうが良い。

## ディレクトリ

### `/bin`

MainとなるTSファイル (このプロジェクトの場合は `cdk-app.ts` ) がある。

### `/lib`

CloudFormationのStackとなるTSファイル (このプロジェクトの場合は `cdk-stack.ts`) がある。基本的にこのTSファイルを編集して、Cloudformationのテンプレートに変換する。

### `/lib/services`

各サービスを作成する関数をそれぞれ分けて用意している。 `サービス名/creator.ts` 内にClassを用意しているので、StackとなるTSファイルからimportして使う。(ex: `lambda_function/creator.ts`)

### `/lambdaSoruces`

Lambdaのソースコードなど。このディレクトリをターゲットにしてZipファイル作成し、Lambdaにデプロイしている。
