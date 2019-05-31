const AWS = require("aws-sdk")
const S3 = new AWS.S3()
const DDB = new AWS.DynamoDB.DocumentClient()

exports.handler = async (event) => {
  try {
    const s3Params = {
      Bucket: "convention-employee-data",
      Key: "convention_employee_master.json"
    }
    const jsonObject = await S3.getObject(s3Params).promise()
    console.log(jsonObject)
    const jsonData = JSON.parse(jsonObject.Body.toString())
    console.log(jsonData)
    const promises = []
    for (let i = 0; i < jsonData.length; i++) {
      const ddbParams = {
        TableName: "m_employeeTable",
        Item: {
          employee_number: jsonData[i].employee_number,
          name: jsonData[i].name,
          employee_group: jsonData[i].employee_group
        }
      }
      promises.push(DDB.put(ddbParams).promise())
    }
    return await Promise.all(promises)
  } catch (err) {
    console.error(err)
    throw err
  }
}
