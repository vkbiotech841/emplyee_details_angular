import { EmpyleeService } from './employee-service';
import { CommonService } from 'src/app/shared/services/common.service';

import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { NgbdSortableHeader, SortEvent } from './sortable.directive';
import { MySchool } from './employee-interface';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss'],
  providers: [EmpyleeService, DecimalPipe]
})
export class EmployeeDetailComponent implements OnInit {

  schoolProfiles$: Observable<MySchool[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;


  constructor(
    private utilityService: UtilityService,
    private router: Router,
    private commonService: CommonService,
    public empyleeService: EmpyleeService
  ) {
    this.schoolProfiles$ = empyleeService.schoolProfiles$;
    this.total$ = empyleeService.total$;
  }

  ngOnInit(): void {
    this.getAllEmployee();
  }

  employeeList: any[] = [];

  getAllEmployee() {
    this.commonService.getAllEmployeeList()
      .subscribe(result => {
        result.docs.forEach(doc => {
          this.employeeList.push(doc.data());
          console.log("result", this.employeeList);
        })

      }, error => {

      })
  };


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
  }

}
