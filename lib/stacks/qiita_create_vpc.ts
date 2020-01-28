import cdk = require("@aws-cdk/core")
import {
  DefaultInstanceTenancy,
  RouterType,
  Vpc,
  Subnet,
  CfnInternetGateway,
  CfnVPCGatewayAttachment
} from "@aws-cdk/aws-ec2"

export class CreateVPCStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const vpc = new Vpc(this, "cdk-vpc", {
      cidr: "10.0.0.0/16",
      defaultInstanceTenancy: DefaultInstanceTenancy.DEFAULT,
      enableDnsSupport: true,
      enableDnsHostnames: true,
      subnetConfiguration: []
    })

    const pubSubnet = new Subnet(this, "PublicSubnet1c", {
      availabilityZone: "us-west-2c",
      vpcId: vpc.vpcId,
      cidrBlock: "10.0.0.0/24"
    })
    new Subnet(this, "PrivateSubnet1c", {
      availabilityZone: "us-west-2c",
      vpcId: vpc.vpcId,
      cidrBlock: "10.0.1.0/24"
    })
    new Subnet(this, "PrivateSubnet1d", {
      availabilityZone: "us-west-2c",
      vpcId: vpc.vpcId,
      cidrBlock: "10.0.2.0/24"
    })

    const internetGateway = new CfnInternetGateway(this, "InternetGateway", {})
    new CfnVPCGatewayAttachment(this, "gateway", {
      vpcId: vpc.vpcId,
      internetGatewayId: internetGateway.ref
    })

    pubSubnet.addRoute("PubSubnetRoute", {
      routerType: RouterType.GATEWAY,
      routerId: internetGateway.ref
    })
  }
}
