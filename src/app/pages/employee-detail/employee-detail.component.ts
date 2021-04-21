
import { CommonService } from 'src/app/shared/services/common.service';

import { Component, OnInit, PipeTransform, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { NgbdSortableHeader, SortColumn, SortDirection, SortEvent } from './sortable.directive';
import { Employee } from './employee-interface';
import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';


interface SearchResult {
  employeeProfiles: Employee[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(employeeProfiles: Employee[], column: SortColumn, direction: string): Employee[] {
  if (direction === '' || column === '') {
    return employeeProfiles;
  } else {
    return [...employeeProfiles].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(schoolProfile: Employee, term: string, pipe: PipeTransform) {
  return schoolProfile.employeeId.toLowerCase().includes(term.toLowerCase())
    || schoolProfile.name.toLowerCase().includes(term.toLowerCase())
    || schoolProfile.email.toLowerCase().includes(term.toLowerCase())
    || schoolProfile.dob.toLowerCase().includes(term.toLowerCase())
    || pipe.transform(schoolProfile.password).includes(term)
    || pipe.transform(schoolProfile.confirmedPassword).includes(term)
    || schoolProfile.address.toLowerCase().includes(term.toLowerCase())
}

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss'],
  providers: [DecimalPipe]
})
export class EmployeeDetailComponent implements OnInit {

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _employeeProfiles$ = new BehaviorSubject<Employee[]>([]);
  private _employeeList$ = new BehaviorSubject<Employee[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  // employeeProfiles$: Observable<Employee[]>;
  // total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;


  constructor(
    private utilityService: UtilityService,
    private router: Router,
    private commonService: CommonService,
    private pipe: DecimalPipe,
  ) { }

  ngOnInit(): void {
    this.getAllEmployee();
  }

  employeeList: any[] = [];

  getAllEmployee() {
    this.employeeList = [];
    this.commonService.getAllEmployeeList()
      .subscribe(result => {
        result.docs.forEach(doc => {
          let newData: any = doc.data();
          newData.id = doc.id;
          this.employeeList.push(newData);
        })
        console.log("employeeList", this.employeeList);
        this.onSearch();
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
  };


  onSort({ column, direction }: SortEvent) {
    console.log("sorting started");
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = "";
      }
    });

    this.sortColumn = column;
    this.sortDirection = direction;
  };


  onSearch() {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      console.log("result", result);
      this._employeeProfiles$.next(result.employeeProfiles);
      this._total$.next(result.total);
    });

    this._search$.next();
  };


  get employeeProfiles$() {
    return this._employeeProfiles$.asObservable();
  };

  get total$() {
    return this._total$.asObservable();
  };

  get loading$() {
    return this._loading$.asObservable();
  };

  get page() {
    return this._state.page;
  };

  get pageSize() {
    return this._state.pageSize;
  };

  get searchTerm() {
    return this._state.searchTerm;
  };

  set page(page: number) {
    this._set({ page });
  };

  set pageSize(pageSize: number) {
    this._set({ pageSize });
  };

  set searchTerm(searchTerm: string) {
    this._set({ searchTerm });
  };

  set sortColumn(sortColumn: SortColumn) {
    this._set({ sortColumn });
  };

  set sortDirection(sortDirection: SortDirection) {
    this._set({ sortDirection });
  };

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

    // 1. sort
    let employeeProfiles = sort(this.employeeList, sortColumn, sortDirection);


    // 2. filter
    employeeProfiles = employeeProfiles.filter(schoolProfile => matches(schoolProfile, searchTerm, this.pipe));
    const total = employeeProfiles.length;

    // 3. paginate
    employeeProfiles = employeeProfiles.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({ employeeProfiles, total });
  };

}
