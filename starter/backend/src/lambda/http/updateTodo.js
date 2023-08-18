import * as middy from 'middy'
import { getUserId } from '../utils.mjs'
import { updateTodoLogic } from '../../businessLogic/todos.mjs'

export const handler = middy(
  async (event) => {
    const todoId = event.pathParameters.todoId
    const updatedTodo = JSON.parse(event.body)
    const userId = getUserId(event)
    const todo = await updateTodoLogic(userId, todoId, updatedTodo)
    return {
      statusCode: 200,
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
