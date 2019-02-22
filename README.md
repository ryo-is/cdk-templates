# AWS-CDK Sample Soureces

AWSCDKのサンプルコード

## 対応リソース

* LambdaFunction
* APIGateway
* DynamoDB

## デプロイまでの流れ

1. `yarn build`: TypeScriptのコンパイル
2. `cdk deploy`: デプロイ実行

`cdk synth` を実行すれば、CloudFormationのテンプレートを確認することができるので、デプロイ実行する前に確認するほうが良い。

## ディレクトリ

### `/bin`
MainとなるTSファイル (このプロジェクトの場合は `cdk-demo.ts` ) がある。

### `/lib`
CloudFormationのStackとなるTSファイル (このプロジェクトの場合は `cdk-demo-stack.ts`) がある。基本的にこのTSファイルを編集して、Cloudformationのテンプレートに変換する。

### `/lib/services`
各サービスを作成する関数をそれぞれ分けて用意している。 `サービス名/creator.ts` 内にClassを用意しているので、StackとなるTSファイルからimportして使う。(ex: `lambda_function/creator.ts`)

### `resources`
Lambdaのソースコードなど。このディレクトリをターゲットにしてZipファイル作成し、Lambdaにデプロイしている。

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
