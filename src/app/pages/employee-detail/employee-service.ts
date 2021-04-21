import { CommonService } from 'src/app/shared/services/common.service';

import { Injectable, PipeTransform } from '@angular/core';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { SortColumn, SortDirection } from './sortable.directive';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { DecimalPipe } from '@angular/common';

import { MySchool } from './employee-interface';
import { SchoolProfileCollection } from './employee-collection';



interface SearchResult {
    schoolProfiles: MySchool[];
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

function sort(schoolProfiles: MySchool[], column: SortColumn, direction: string): MySchool[] {
    if (direction === '' || column === '') {
        return schoolProfiles;
    } else {
        return [...schoolProfiles].sort((a, b) => {
            const res = compare(a[column], b[column]);
            return direction === 'asc' ? res : -res;
        });
    }
}

function matches(schoolProfile: MySchool, term: string, pipe: PipeTransform) {
    return schoolProfile.employeeId.toLowerCase().includes(term.toLowerCase())
        || schoolProfile.name.toLowerCase().includes(term.toLowerCase())
        || schoolProfile.email.toLowerCase().includes(term.toLowerCase())
        || schoolProfile.dob.toLowerCase().includes(term.toLowerCase())
        || pipe.transform(schoolProfile.password).includes(term)
        || pipe.transform(schoolProfile.confirmedPassword).includes(term)
        || schoolProfile.address.toLowerCase().includes(term.toLowerCase())
}

@Injectable({
    providedIn: 'root'
})


export class EmpyleeService {

    SchoolProfileCollection1: any[] = [
        {
            employeeId: "001",
            name: 'vikram',
            email: 'vkbiotech841@gmail.com',
            dob: '01-09-2000',
            password: '123',
            confirmedPassword: '123',
            mobileNumber: '9130113900',
            address: 'Gola band road'
        },
        {
            employeeId: "002",
            name: 'kumar',
            email: 'vkbiotech841@gmail.com',
            dob: '01-09-2000',
            password: '123',
            confirmedPassword: '123',
            mobileNumber: '9130113900',
            address: 'Gola band road'
        },
        {
            employeeId: "003",
            name: 'ricky',
            email: 'vkbiotech841@gmail.com',
            dob: '01-09-2000',
            password: '123',
            confirmedPassword: '123',
            mobileNumber: '9130113900',
            address: 'Gola band road'
        },
    ];

    private _loading$ = new BehaviorSubject<boolean>(true);
    private _search$ = new Subject<void>();
    private _schoolProfiles$ = new BehaviorSubject<MySchool[]>([]);
    private _total$ = new BehaviorSubject<number>(0);

    private _state: State = {
        page: 1,
        pageSize: 10,
        searchTerm: '',
        sortColumn: '',
        sortDirection: ''
    };

    constructor(
        private pipe: DecimalPipe,
        private commonService: CommonService
    ) {
        this.getAllEmployee();

    }

    //////////////////////////////////////
    employeeList: any[] = [];

    getAllEmployee() {
        this.commonService.getAllEmployeeList()
            .subscribe(result => {
                result.docs.forEach(doc => {
                    this.employeeList.push(doc.data());
                })
                console.log("result", this.employeeList);

                this._search$.pipe(
                    tap(() => this._loading$.next(true)),
                    debounceTime(200),
                    switchMap(() => this._search()),
                    delay(200),
                    tap(() => this._loading$.next(false))
                ).subscribe(result => {
                    this._schoolProfiles$.next(result.schoolProfiles);
                    this._total$.next(result.total);
                });

                this._search$.next();

            }, error => {

            })
    };

    //////////////////////////////////////

    get schoolProfiles$() {
        return this._schoolProfiles$.asObservable();
    }
    get total$() {
        return this._total$.asObservable();
    }
    get loading$() {
        return this._loading$.asObservable();
    }

    get page() {
        return this._state.page;
    }
    get pageSize() {
        return this._state.pageSize;
    }
    get searchTerm() {
        return this._state.searchTerm;
    }

    set page(page: number) {
        this._set({ page });
    }
    set pageSize(pageSize: number) {
        this._set({ pageSize });
    }
    set searchTerm(searchTerm: string) {
        this._set({ searchTerm });
    }
    set sortColumn(sortColumn: SortColumn) {
        this._set({ sortColumn });
    }
    set sortDirection(sortDirection: SortDirection) {
        this._set({ sortDirection });
    }

    private _set(patch: Partial<State>) {
        Object.assign(this._state, patch);
        this._search$.next();
    }

    private _search(): Observable<SearchResult> {
        const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

        // 1. sort
        // let schoolProfiles = sort(SchoolProfileCollection, sortColumn, sortDirection);
        let schoolProfiles = sort(this.employeeList, sortColumn, sortDirection);


        // 2. filter
        schoolProfiles = schoolProfiles.filter(schoolProfile => matches(schoolProfile, searchTerm, this.pipe));
        const total = schoolProfiles.length;

        // 3. paginate
        schoolProfiles = schoolProfiles.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
        return of({ schoolProfiles, total });
    }
}
