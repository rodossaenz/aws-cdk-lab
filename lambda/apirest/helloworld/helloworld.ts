var jwt = require('jsonwebtoken');

export const handler = async (event: any = {}): Promise<any> => {
    
    console.log("Starting hello handler.");

    const jwtHeaders = event.headers['Authorization'];
    const decoded = jwt.decode(jwtHeaders);
    var memberStatus = 'Free';
    
    if(decoded.hasOwnProperty("custom:member_status")){
        memberStatus = decoded["custom:member_status"];
    }

    var responseBody = {
        "sampleVal1": "Hello API!",
        "member_status": memberStatus
    };

    const response = {
        "statusCode": 200,
        "headers": {
            "demo_header": "value-test-1"
        },
        "body": responseBody,
        "isBase64Encoded": false
    };

    return response;
}