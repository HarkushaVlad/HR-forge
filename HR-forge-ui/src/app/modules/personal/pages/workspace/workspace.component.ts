import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from '../../../../services/services/employee.service';
import { PageResponseEmployeeResponse } from '../../../../services/models/page-response-employee-response';
import { DepartmentService } from '../../../../services/services/department.service';
import { PageResponseDepartmentResponse } from '../../../../services/models/page-response-department-response';
import { PageResponsePositionResponse } from '../../../../services/models/page-response-position-response';
import { PositionService } from '../../../../services/services/position.service';
import { TokenService } from '../../../../services/token/token.service';
import { EmployeeEditComponent } from '../../components/employee-edit/employee-edit.component';
import { DepartmentEditComponent } from '../../components/department-edit/department-edit.component';
import { PositionEditComponent } from '../../components/position-edit/position-edit.component';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.scss',
})
export class WorkspaceComponent implements OnInit {
  employeeResponse?: PageResponseEmployeeResponse;
  departmentResponse?: PageResponseDepartmentResponse;
  positionResponse?: PageResponsePositionResponse;

  @ViewChild(EmployeeEditComponent)
  employeeEditComponent!: EmployeeEditComponent;

  @ViewChild(DepartmentEditComponent)
  departmentEditComponent!: DepartmentEditComponent;

  @ViewChild(PositionEditComponent)
  positionEditComponent!: PositionEditComponent;

  isAdmin = false;
  message: string | null = null;
  level: string | null = null;
  page = 0;
  size = 10;
  searchTerm: string = '';
  sortField = 'firstName';
  sortDirection = 'ASC';
  sortFields: string[] = [];
  pages: number[] = [];
  isLastPage = false;

  selectedOption: 'employees' | 'positions' | 'departments' = 'employees';
  isLoading: boolean = true;

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private positionService: PositionService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.changeOption({ target: { value: 'employees' } });
    this.isAdmin = this.isAdmin = this.tokenService.checkIsAdmin();
  }

  loadData(): void {
    if (this.selectedOption === 'employees') {
      this.loadEmployees();
    }
    if (this.selectedOption === 'departments') {
      this.loadDepartments();
    }
    if (this.selectedOption === 'positions') {
      this.loadPositions();
    }
  }

  changeOption(event: any): void {
    this.selectedOption = event.target.value;
    this.page = 0;
    this.searchTerm = '';
    this.updateSortFields();
    this.loadData();
  }

  updateSortFields(): void {
    if (this.selectedOption === 'employees') {
      this.sortFields = [
        'departmentName',
        'firstName',
        'hireDate',
        'lastName',
        'positionName',
        'salary',
      ];
      this.sortField = 'firstName';
    } else if (this.selectedOption === 'departments') {
      this.sortFields = ['description', 'name'];
      this.sortField = 'name';
    } else if (this.selectedOption === 'positions') {
      this.sortFields = ['description', 'name'];
      this.sortField = 'name';
    }
  }

  onSortChange(): void {
    this.loadData();
  }

  search(page: number = 0): void {
    this.page = page;
    this.loadData();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.search();
  }

  successUpdate(): void {
    this.search(this.page);
    this.employeeEditComponent.close();
    this.departmentEditComponent.close();
    this.positionEditComponent.close();
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.employeeService
      .getAllEmployees({
        query: this.searchTerm,
        page: this.page,
        size: this.size,
        sortField: this.sortField,
        sortDirection: this.sortDirection,
      })
      .subscribe({
        next: (response) => {
          this.employeeResponse = response;
          this.pages = Array(response.totalPages ?? 0)
            .fill(0)
            .map((x, i) => i);
          this.isLastPage = this.page === (response.totalPages ?? 0) - 1;
          this.isLoading = false;
        },
        error: () => {
          this.message = 'Не вдалося завантажити робітників';
          this.level = 'error';
          this.isLoading = false;
        },
      });
  }

  loadDepartments(): void {
    this.isLoading = true;
    this.departmentService
      .getAllDepartments({
        name: this.searchTerm,
        page: this.page,
        size: this.size,
        sortField: this.sortField,
        sortDirection: this.sortDirection,
      })
      .subscribe({
        next: (response) => {
          this.departmentResponse = response;
          this.pages = Array(response.totalPages ?? 0)
            .fill(0)
            .map((x, i) => i);
          this.isLastPage = this.page === (response.totalPages ?? 0) - 1;
          this.isLoading = false;
        },
        error: () => {
          this.message = 'Не вдалося завантажити департаменти';
          this.level = 'error';
          this.isLoading = false;
        },
      });
  }

  loadPositions(): void {
    this.isLoading = true;
    this.positionService
      .getAllPositions({
        name: this.searchTerm,
        page: this.page,
        size: this.size,
        sortField: this.sortField,
        sortDirection: this.sortDirection,
      })
      .subscribe({
        next: (response) => {
          this.positionResponse = response;
          this.pages = Array(response.totalPages ?? 0)
            .fill(0)
            .map((x, i) => i);
          this.isLastPage = this.page === (response.totalPages ?? 0) - 1;
          this.isLoading = false;
        },
        error: () => {
          this.message = 'Не вдалося завантажити посади';
          this.level = 'error';
          this.isLoading = false;
        },
      });
  }

  goToFirstPage(): void {
    this.page = 0;
    this.loadData();
  }

  goToPreviousPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadData();
    }
  }

  goToPage(pageIndex: number): void {
    this.page = pageIndex;
    this.loadData();
  }

  goToNextPage(): void {
    if (!this.isLastPage) {
      this.page++;
      this.loadData();
    }
  }

  goToLastPage(): void {
    this.page = this.pages.length - 1;
    this.loadData();
  }
}
