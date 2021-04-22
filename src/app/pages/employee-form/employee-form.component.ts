import { employee } from './../../shared/models/employee-model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import { UtilityService } from 'src/app/shared/services/utility.service';


// Form Validation pattern
export function patternValidator(pattern: RegExp): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const forbidden = !pattern.test(control.value);;
    return forbidden ? { 'pattern': { value: control.value } } : null;
  };
}

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

  isLoading: boolean = false;



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
    this.password = new FormControl("",
      [
        Validators.required,
        Validators.minLength(8),
        patternValidator(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"))
      ]
    );
    this.confirmedPassword = new FormControl("",
      [
        Validators.required,
        Validators.minLength(8),
        patternValidator(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"))
      ]
    );
    this.mobileNumber = new FormControl("", [Validators.required, Validators.minLength(10)]);
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
    this.isLoading = true;
    if (this.password.value === this.confirmedPassword.value) {
      if (this.employeeDetailForm.invalid) {
        this.utilityService.showError("Please Fill All Mendatory(*) fields before submittion", "Try Again");
        this.isLoading = false;
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
        const newData = JSON.parse(JSON.stringify(data));

        this.commonService.createEmployee(newData)
          .then(result => {
            console.log("id", result.id);
            this.employeeDetailForm.reset();
            this.isLoading = false;
            this.utilityService.showSuccess("", "Your Request for Free Trial is Successfully Submitted.");
            this.router.navigate(["/employee"]);
          })
          .catch(error => {
            this.utilityService.showError(error, "Something Went Wrong.");
            this.isLoading = false;
          }
          )
          .finally(() => {
            this.isLoading = false;
          }
          )
      }
    } else {
      this.utilityService.showError("Password and Confiremed password does not match.", "Please re-check password");
      this.isLoading = false;
    }
  };



}
