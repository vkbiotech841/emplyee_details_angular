import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";

import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore, DocumentChangeType, DocumentData, DocumentReference } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private http: HttpClient,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
  ) { }


  createEmployee(employeeDetails) {
    const data = employeeDetails;
    return this.firestore
      .collection("employee")
      .add(data);
  };

  getAllEmployeeList() {
    return this.firestore
      .collection("employee")
      .get()
  };

  getEmployeeById(id: string) {
    return this.firestore
      .collection("employee")
      .doc(id)
      .get()
  };


  deleteEmployeeById(id: string) {
    return this.firestore
      .collection("employee")
      .doc(id)
      .delete()
  }





  newData: any;
  postData(data: any): Observable<any> {
    this.newData = data;
    return of(this.newData)
  };

  getData(): Observable<any> {
    console.log("return data", this.newData);
    return of(this.newData);
  }


}
