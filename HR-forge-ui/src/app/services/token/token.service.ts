import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { EmployeeResponse } from '../models/employee-response';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  set token(token: string) {
    localStorage.setItem('token', token);
  }

  get token() {
    return localStorage.getItem('token') as string;
  }

  getAuthorities(): string[] {
    const token = this.token;
    if (!token) return [];
    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.authorities || [];
    } catch (e) {
      console.error('Error decoding token:', e);
      return [];
    }
  }

  private isTokenExpired(): boolean {
    if (!this.token) {
      this.token = this.token;
    }
    if (!this.token) {
      return true;
    }

    const decodedTokenExp = jwtDecode(this.token).exp;

    if (decodedTokenExp === undefined) {
      return true;
    } else {
      const expirationDate = decodedTokenExp * 1000;
      return expirationDate < Date.now();
    }
  }

  isTokenValid(): boolean {
    const isValid =
      this.token !== null && this.token !== undefined && !this.isTokenExpired();
    if (isValid) {
      return true;
    } else {
      this.removeToken();
      return false;
    }
  }

  removeToken() {
    localStorage.removeItem('token');
  }

  checkIsAdmin(): boolean {
    const authorities = this.getAuthorities();
    return authorities.includes('Системний адміністратор');
  }

  checkIsOwn(employee: EmployeeResponse): boolean {
    const decodedTokenEmail = jwtDecode(this.token).sub;
    return employee.email === decodedTokenEmail;
  }
}
