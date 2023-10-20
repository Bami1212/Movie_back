import { BadRequestException, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
export declare class BadRequestExceptionFilter implements ExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost): Response<any, Record<string, any>>;
}
