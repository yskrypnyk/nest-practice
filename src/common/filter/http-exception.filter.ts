import {ArgumentsHost, Catch, ExceptionFilter, HttpException} from '@nestjs/common';
import {Response} from "express";

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException>
    implements ExceptionFilter {
    catch(exception: T, host: ArgumentsHost) {
        const context = host.switchToHttp() //gives access to native or inflight objects
        const response = context.getResponse<Response>()

        const status = exception.getStatus() //status code
        const exceptionResponse = exception.getResponse() //response

        const error =
            typeof response === 'string'
                ? {message: exceptionResponse}
                : (exceptionResponse as object)

        response.status(status).json({
            ...error,
            timestamp: new Date().toISOString()
        })
    }
}
