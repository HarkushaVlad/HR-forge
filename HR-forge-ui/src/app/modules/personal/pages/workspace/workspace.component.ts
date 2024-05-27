import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../../../services/services/employee.service';
import { PageResponseEmployeeResponse } from '../../../../services/models/page-response-employee-response';
import { EmployeeResponse } from '../../../../services/models/employee-response';
import { DepartmentResponse } from '../../../../services/models/department-response';
import { DepartmentService } from '../../../../services/services/department.service';
import { PageResponseDepartmentResponse } from '../../../../services/models/page-response-department-response';
import { PositionResponse } from '../../../../services/models/position-response';
import { PageResponsePositionResponse } from '../../../../services/models/page-response-position-response';
import { PositionService } from '../../../../services/services/position.service';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.scss',
})
export class WorkspaceComponent implements OnInit {
  employeeResponse?: PageResponseEmployeeResponse;
  departmentResponse?: PageResponseDepartmentResponse;
  positionResponse?: PageResponsePositionResponse;

  message: string | null = null;
  level: string | null = null;
  page = 0;
  size = 10;
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
    private positionService: PositionService
  ) {}

  ngOnInit(): void {
    this.changeOption({ target: { value: 'employees' } });
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

  loadEmployees(): void {
    this.isLoading = true;
    this.employeeService
      .getAllEmployees({
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
          this.message = 'Failed to load employees';
          this.level = 'error';
          this.isLoading = false;
        },
      });
  }

  loadDepartments(): void {
    this.isLoading = true;
    this.departmentService
      .getAllDepartments({
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
          this.message = 'Failed to load departments';
          this.level = 'error';
          this.isLoading = false;
        },
      });
  }

  loadPositions(): void {
    this.isLoading = true;
    this.positionService
      .getAllPositions({
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
          this.message = 'Failed to load positions';
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

  editEmployee(employee: EmployeeResponse): void {
    // Logic to handle editing employee
    console.log('Edit employee', employee);
  }

  editDepartment(department: DepartmentResponse): void {
    // Logic to handle editing employee
    console.log('Edit department', department);
  }

  editPosition(position: PositionResponse): void {
    // Logic to handle editing employee
    console.log('Edit position', position);
  }
}