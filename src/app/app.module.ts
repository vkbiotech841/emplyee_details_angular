import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmployeeFormComponent } from './pages/employee-form/employee-form.component';
import { EmployeeDetailComponent } from './pages/employee-detail/employee-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    EmployeeFormComponent,
    EmployeeDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
