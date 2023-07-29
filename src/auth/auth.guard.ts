import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService){}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();    
    try{
      const cookie = request.cookies['jwt'];
      //console.log(cookie);
      const status = await this.jwtService.verify(cookie);
      //console.log('gopal2');
      return status;
    }catch(e){
      console.log(e.message);
      return false;
    }    
  }

}
