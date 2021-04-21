import { CommonService } from 'src/app/shared/services/common.service';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss']
})
export class EmployeeDetailComponent implements OnInit {



  constructor(
    private utilityService: UtilityService,
    private router: Router,
    private commonService: CommonService
  ) { }

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

}
