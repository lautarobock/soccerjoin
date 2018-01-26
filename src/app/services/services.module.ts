import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Session } from './session.service';
import { UsersService } from './users.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './auth.guard';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [],
  // exports: [Session, UsersService],
  providers: [Session, UsersService, AuthGuard]
})
export class ServicesModule { }
