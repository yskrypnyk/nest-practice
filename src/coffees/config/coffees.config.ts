import {registerAs} from "@nestjs/config"; //lets us register unnamed configuration by token

/**
 * Injection in coffees.module
 * Usage in coffees.service
 */
export default registerAs('coffees', ()=> ({
    foo:'bar'
}))