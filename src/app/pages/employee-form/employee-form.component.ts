import { employee } from './../../shared/models/employee-model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {


  employeeDetail = new employee();


  employeeDetailForm: FormGroup;

  employeeId: FormControl;
  name: FormControl;
  email: FormControl;
  dob: FormControl;
  password: FormControl;
  confirmedPassword: FormControl;
  mobileNumber: FormControl;
  address: FormControl;

  isSubmited: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private utilityService: UtilityService,
    private commonService: CommonService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.initializeAndValidateForm();
  }


  initializeAndValidateForm() {
    this.employeeId = new FormControl("", [Validators.required]);
    this.name = new FormControl("", [Validators.required]);
    this.email = new FormControl("", [Validators.required, Validators.email]);
    this.dob = new FormControl("", [Validators.required]);
    this.password = new FormControl("", [Validators.required]);
    this.confirmedPassword = new FormControl("", [Validators.required]);
    this.mobileNumber = new FormControl("", [Validators.required]);
    this.address = new FormControl("", [Validators.required]);

    this.employeeDetailForm = this.formBuilder.group({
      employeeId: this.employeeId,
      name: this.name,
      email: this.email,
      dob: this.dob,
      password: this.password,
      confirmedPassword: this.confirmedPassword,
      mobileNumber: this.mobileNumber,
      address: this.address
    })
  }



  submitUserDetails() {
    this.isSubmited = true;
    if (this.password.value === this.confirmedPassword.value) {
      if (this.employeeDetailForm.invalid) {
        this.utilityService.showError("Please Fill All Mendatory(*) fields before submittion", "Try Again");
      } else {
        this.employeeDetail.employeeId = this.employeeId.value;
        this.employeeDetail.name = this.name.value;
        this.employeeDetail.email = this.email.value;
        this.employeeDetail.dob = this.dob.value;
        this.employeeDetail.password = this.password.value;
        this.employeeDetail.confirmedPassword = this.confirmedPassword.value;
        this.employeeDetail.mobileNumber = this.mobileNumber.value;
        this.employeeDetail.address = this.address.value;

        const data = this.employeeDetail;
        console.log("data", data);

        this.commonService.postData(data)
          .subscribe(result => {
            this.utilityService.showSuccess("", "Your Request for Free Trial is Successfully Submitted.");
            this.router.navigate(["/employee"]);
          }, error => {
            this.utilityService.showError("", "Something Went Wrong.");
          })
      }
    } else {
      this.utilityService.showError("Password and Confiremed password does not match.", "Please re-check password")
    }
  }

}
