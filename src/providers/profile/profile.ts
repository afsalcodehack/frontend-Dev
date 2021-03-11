import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class ProfileProvider{
 
    constructor(public http: HttpClient ){}

    getAllCountry(): Observable<any> {
        return this.http.get('https://admin.picllary.com/country/');
    }

    getCities(): Observable<any> {
        return this.http.get('https://admin.picllary.com/city/');
    }

    getIntrests(): Observable<any> {
        return this.http.get('https://admin.picllary.com/tags/');
    }

    saveProfile(profileDetails): Observable<any> {
        return this.http.patch('https://admin.picllary.com/auth/users/me/', profileDetails)
    }
    
    getUserProfile(): Observable<any>{
        return this.http.get('https://admin.picllary.com/auth/users/me/');
    }

}