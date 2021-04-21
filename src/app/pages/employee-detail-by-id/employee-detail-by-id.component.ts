import { CommonService } from 'src/app/shared/services/common.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-employee-detail-by-id',
  templateUrl: './employee-detail-by-id.component.html',
  styleUrls: ['./employee-detail-by-id.component.scss']
})
export class EmployeeDetailByIdComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.getEmployeeDetailId();
  }

  id: any;
  getEmployeeDetailId() {
    this.activatedRoute.params.subscribe(params => {
      this.id = params.id;
    });
    this.loadEmployeeDetailData();
  };


  loadEmployeeDetailData() {
    this.commonService.getEmployeeById(this.id)
      .subscribe(result => {
        console.log("singleEmployee", result.data());

      }, error => {

      })
  }
}
