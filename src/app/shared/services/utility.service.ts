import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(
    private toastrService: ToastrService
  ) { }

  /////////////////// ngx-toastr services start here //////////////////////////
  showSuccess(title?, message?, time?) {
    this.toastrService.success(title, message, {
      timeOut: time || 3000,
      // progressBar: true,
      positionClass: 'toast-top-right'
    });
  };

  showError(title?, message?, time?) {
    this.toastrService.error(title, message, {
      timeOut: time || 3000,
      // progressBar: true,
      positionClass: 'toast-top-right'
    });
  };

  showInfo(title?, message?, time?) {
    this.toastrService.info(title, message, {
      timeOut: time || 3000,
      // progressBar: true,
      positionClass: 'toast-top-center'
    });
  };

  showWarning(title?, message?, time?) {
    this.toastrService.warning(title, message, {
      timeOut: time || 3000,
      // progressBar: true,
      positionClass: 'toast-top-center'
    });
  };

  /////////////////// ngx-toastr services ends here //////////////////////////
}
