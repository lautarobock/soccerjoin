import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromptUpdateService } from './prompt-update.service';
import { ToolsModule } from '../tools/tools.module';

@NgModule({
  imports: [
    CommonModule,
    ToolsModule
  ],
  providers: [PromptUpdateService],
  declarations: []
})
export class UpdatesModule { }
