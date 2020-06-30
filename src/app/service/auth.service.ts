import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private router: Router) { }

    isLoggedIn() {
        debugger
        var token = localStorage.getItem('token');
        if (token) return true;
        else return false;
    }

    logOut() {
        debugger
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        this.router.navigate(['/']);
        return true; 
    }
}
