import cdk = require("@aws-cdk/core")
import { DefaultInstanceTenancy, RouterType } from "@aws-cdk/aws-ec2"

import { VPCCreator } from "../services/vpc/creator"

export class CreateVPCStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const vpc = VPCCreator.createVPC(this, "cdk-vpc", {
      cidr: "10.0.0.0/16",
      defaultInstanceTenancy: DefaultInstanceTenancy.DEFAULT,
      enableDnsSupport: true,
      enableDnsHostnames: true,
      subnetConfiguration: []
    })

    const pubSubnet = VPCCreator.createSubnet(this, "PublicSubnet1c", {
      availabilityZone: "us-west-2c",
      vpcId: vpc.vpcId,
      cidrBlock: "10.0.0.0/24"
    })

    VPCCreator.createSubnet(this, "PrivateSubnet1c", {
      availabilityZone: "us-west-2c",
      vpcId: vpc.vpcId,
      cidrBlock: "10.0.1.0/24"
    })

    VPCCreator.createSubnet(this, "PrivateSubnet1d", {
      availabilityZone: "us-west-2d",
      vpcId: vpc.vpcId,
      cidrBlock: "10.0.2.0/24"
    })

    const internetGateway = VPCCreator.createInternetGateway(
      this,
      "InternetGateway",
      "Gateway",
      vpc.vpcId
    )

    pubSubnet.addRoute("PubSubnetRoute", {
      routerType: RouterType.GATEWAY,
      routerId: internetGateway.ref
    })
  }
}
