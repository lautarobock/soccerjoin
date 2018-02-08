import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Platform } from './platform.service';
import { LocalStorage } from './local-storage.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [Platform, LocalStorage]
})
export class ToolsModule { }
