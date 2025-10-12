import { Request, Response, NextFunction } from 'express'

interface CustomError extends Error {
  statusCode?: number
  errors?: unknown
}

export const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Erreur interne du serveur'

  console.error('❌ Erreur:', err)

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      errors: err.errors,
    }),
  })
}

export default errorHandler

