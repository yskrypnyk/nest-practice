import {SetMetadata} from "@nestjs/common";

export const IS_PUBLIC_KEY = 'isPublic'
/** Creating a custom decorator */
//used in coffee.controller @Get
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)