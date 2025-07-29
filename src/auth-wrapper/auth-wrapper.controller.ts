import { Body, Controller, Post } from '@nestjs/common';
import { AuthWrapperService } from './auth-wrapper.service';

@Controller('auth')
export class AuthWrapperController {
    constructor(private readonly authSErvice: AuthWrapperService) {}

    @Post("signup")
    signup(@Body() payload) {
        return this.authSErvice.signup(payload)
    }

    @Post("login")
    login(@Body() payload) {
        return this.authSErvice.login(payload)
    }

    @Post("logout")
    logout(@Body() payload) {
        return this.authSErvice.logout(payload)
    }

    @Post("verify-email")
    verifyEmail(@Body() payload) {
        return this.authSErvice.verifyEmail(payload)
    }
}
