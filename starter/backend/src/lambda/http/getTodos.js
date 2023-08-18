import * as middy from 'middy'
import { getUserId } from '../utils.mjs'
import { getTodosLogic } from '../../businessLogic/todos.mjs'

export const handler = middy(
  async (event) => {
    const userId = getUserId(event)
    const todos = await getTodosLogic(userId)
    return {
      statusCode: 200,
      body: JSON.stringify(todos)
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
