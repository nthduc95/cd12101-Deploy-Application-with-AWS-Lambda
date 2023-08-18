import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import { createLogger } from '../utils/logger.mjs'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('todoAccess')
const docClient = new XAWS.DynamoDB.DocumentClient();
const todosTable = process.env.TODOS_TABLE;

export const getTodos = async (userId) => {
    logger.info('Getting all todo items')

    const result = await docClient
        .query({
            TableName: todosTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        })
        .promise()
    return result.Items
}

export const createTodo = async (newTodo) => {
    logger.info(`Creating new todo item: ${newTodo.todoId}`)
    await docClient
        .put({
            TableName: todosTable,
            Item: newTodo
        })
        .promise()
    return newTodo
}

export const updateTodo = async (userId, todoId, updateData) => {
    logger.info(`Updating a todo item: ${todoId}`)
    await docClient
        .update({
            TableName: todosTable,
            Key: { userId, todoId },
            ConditionExpression: 'attribute_exists(todoId)',
            UpdateExpression: 'set #n = :n, dueDate = :due, done = :dn',
            ExpressionAttributeNames: { '#n': 'name' },
            ExpressionAttributeValues: {
                ':n': updateData.name,
                ':due': updateData.dueDate,
                ':dn': updateData.done
            }
        })
        .promise()
}

export const deleteTodo = async (userId, todoId) => {
    await docClient
        .delete({
            TableName: todosTable,
            Key: { userId, todoId }
        })
        .promise()
}

export const saveImgUrl = async (userId, todoId, bucketName) => {
    try {
        await docClient
            .update({
                TableName: todosTable,
                Key: { userId, todoId },
                ConditionExpression: 'attribute_exists(todoId)',
                UpdateExpression: 'set attachmentUrl = :attachmentUrl',
                ExpressionAttributeValues: {
                    ':attachmentUrl': `https://${bucketName}.s3.amazonaws.com/${todoId}`
                }
            })
            .promise()
        logger.info(
            `Updating image url for a todo item: https://${bucketName}.s3.amazonaws.com/${todoId}`
        )
    } catch (error) {
        logger.error(error)
    }
}

