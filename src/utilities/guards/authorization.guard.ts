import { CanActivate, ExecutionContext, mixin, UnauthorizedException } from "@nestjs/common";

export const AuthorizationGuard =(allowedRoles: string[])=>{
    class RolesGuardMixin implements CanActivate{
        canActivate(context: ExecutionContext): boolean {  const request = context.switchToHttp().getRequest();
            const userRole = request?.user?.role; 
        
            if (userRole && allowedRoles?.some(role => userRole.includes(role))) {
              return true;
            }
        
            throw new UnauthorizedException('You are not authorized to perform this action');
        }
    }
    const guard = mixin(RolesGuardMixin)
    return guard;
}

