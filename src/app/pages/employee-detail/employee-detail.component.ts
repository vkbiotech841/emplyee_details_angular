import { EmpyleeService } from './employee-service';
import { CommonService } from 'src/app/shared/services/common.service';

import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { NgbdSortableHeader, SortEvent } from './sortable.directive';
import { Employee } from './employee-interface';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss'],
  providers: [EmpyleeService, DecimalPipe]
})
export class EmployeeDetailComponent implements OnInit {

  employeeProfiles$: Observable<Employee[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;


  constructor(
    private utilityService: UtilityService,
    private router: Router,
    private commonService: CommonService,
    public empyleeService: EmpyleeService
  ) {
    this.employeeProfiles$ = empyleeService.employeeProfiles$;
    this.total$ = empyleeService.total$;
    console.log("this.employeeProfiles$", this.employeeProfiles$);
  }

  ngOnInit(): void {
    this.getAllEmployee();
  }

  employeeList: any[] = [];

  getAllEmployee() {
    this.commonService.getAllEmployeeList()
      .subscribe(result => {
        result.docs.forEach(doc => {
          let newData: any = doc.data();
          newData.id = doc.id;
          this.employeeList.push(newData);
        })
        console.log("result", this.employeeList);


      }, error => {

      })
  };



  deleteEmployeeById(index) {
    let id = this.employeeList[index].id;
    this.commonService.deleteEmployeeById(id)
      .then(result => {
        this.getAllEmployee();
        this.utilityService.showSuccess("Deleted", "You have successfully deleted an employee");
      })
      .catch(error => {
        this.utilityService.showError(error, "Something Went Wrong!");
      })
  }


  onSort({ column, direction }: SortEvent) {
    console.log("sorting started");
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = "";
      }
    });

    this.empyleeService.sortColumn = column;
    this.empyleeService.sortDirection = direction;
  };

}
