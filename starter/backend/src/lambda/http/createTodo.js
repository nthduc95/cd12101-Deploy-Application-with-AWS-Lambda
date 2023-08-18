import * as middy from 'middy'
import { getUserId } from '../utils.mjs'
import { createTodoLogic } from '../../businessLogic/todos.mjs'

export const handler = middy(
  async (event) => {
    const newTodo = JSON.parse(event.body)
    const userId = getUserId(event)
    const todo = await createTodoLogic(userId, newTodo)
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(todo)
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
