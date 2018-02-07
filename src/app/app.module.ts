import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent, ToolbarService } from './app.component';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';

import { MatSidenavModule, MatToolbarModule, MatButtonModule, MatListModule, MatIconModule } from '@angular/material';
import { FooterComponent } from './home/footer/footer.component';

import { ServicesModule } from './services/services.module';
import { ScreensModule } from './screens/screens.module';
import { UpdatesModule } from './updates/updates.module';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'my-app' }),
    MatSidenavModule,
    MatToolbarModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production
    }),
    HttpClientModule,
    BrowserAnimationsModule,
    ServicesModule,
    ScreensModule,
    UpdatesModule,
    RouterModule.forRoot([
      // { path: '', component: HomeComponent, pathMatch: 'full' }
    ], {useHash: false})
  ],
  providers: [ToolbarService],
  bootstrap: [AppComponent]
})
export class AppModule { }
