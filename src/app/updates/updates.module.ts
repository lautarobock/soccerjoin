import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromptUpdateService } from './prompt-update.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [PromptUpdateService],
  declarations: []
})
export class UpdatesModule { }
