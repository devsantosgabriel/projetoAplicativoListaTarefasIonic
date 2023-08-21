import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TarefaService } from './services/tarefa.service';
import { FormsModule } from '@angular/forms';
import { PopoverComponent } from './popover/popover.component';



@NgModule({
  declarations: [AppComponent, PopoverComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, FormsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, TarefaService],
  bootstrap: [AppComponent],
})
export class AppModule {}
