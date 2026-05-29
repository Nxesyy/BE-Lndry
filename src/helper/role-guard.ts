import { CanActivate, ExecutionContext, Injectable, SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";


@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) { }
    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>(`Roles`, context.getHandler())
        if (!roles) return true

        const request = context.switchToHttp().getRequest()
        const user = request.user
        return roles.includes(user?.role)
    }
}

export const Roles = (...Roles: string[]) => {
    return SetMetadata(`Roles`, Roles)
}