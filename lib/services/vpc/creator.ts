import cdk = require("@aws-cdk/core")
import {
  Vpc,
  VpcProps,
  SubnetProps,
  Subnet,
  CfnInternetGateway,
  CfnVPCGatewayAttachment
} from "@aws-cdk/aws-ec2"

export class VPCCreator {
  public static createVPC(
    self: cdk.Construct,
    id: string,
    vpcProps: VpcProps
  ): Vpc {
    return new Vpc(self, id, vpcProps)
  }

  public static createSubnet(
    self: cdk.Construct,
    id: string,
    subnetProps: SubnetProps
  ): Subnet {
    return new Subnet(self, id, subnetProps)
  }

  public static createInternetGateway(
    self: cdk.Construct,
    gwID: string,
    attID: string,
    vpcID: string
  ): CfnInternetGateway {
    const internetGateway = new CfnInternetGateway(self, gwID, {})
    new CfnVPCGatewayAttachment(self, attID, {
      vpcId: vpcID,
      internetGatewayId: internetGateway.ref
    })
    return internetGateway
  }
}
