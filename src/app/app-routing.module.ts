import { EmployeeDetailComponent } from './pages/employee-detail/employee-detail.component';
import { EmployeeFormComponent } from './pages/employee-form/employee-form.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: "", component: EmployeeFormComponent },
  { path: "employee", component: EmployeeDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
