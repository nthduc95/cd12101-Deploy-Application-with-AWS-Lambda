import * as middy from 'middy'
import { getUserId } from '../utils.mjs'
import { saveImgUrl } from '../../dataLayer/todosAccess.mjs'
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'


const XAWS = AWSXRay.captureAWS(AWS)

const bucketName = process.env.S3_BUCKET
const urlExpiration = Number(process.env.SIGNED_URL_EXPIRATION)
const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})


export const handler = middy(
  async (event) => {
    const todoId = event.pathParameters.todoId

    logger.info('Generating upload URL:', {
      todoId
    })
    const userId = getUserId(event)

    const uploadUrl = s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: todoId,
      Expires: urlExpiration
    })
    logger.info('Generating upload URL:', {
      todoId,
      uploadUrl
    })

    await saveImgUrl(userId, todoId, bucketName)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        uploadUrl: uploadUrl
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)