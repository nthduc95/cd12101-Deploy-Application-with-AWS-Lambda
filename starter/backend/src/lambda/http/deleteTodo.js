import * as middy from 'middy'
import { getUserId } from '../utils.mjs'
import { deleteTodoLogic } from '../../businessLogic/todos.mjs'

export const handler = middy(
  async (event) => {
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)

    await deleteTodoLogic(userId, todoId)

    return {
      statusCode: 202,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({})
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
