export interface CreatingLambdaFunctionParams {
  nameValue: string;
  codeDirectory: string;
  handlerValue?: string;
  memorySizeValue?: number;
  timeoutValue?: number;
  description?: string;
  environment?: { [k: string]: any };
}
