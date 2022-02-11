import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IMember } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { IUser } from '../_models/user';
import { UserParams } from '../_models/userParams';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  baseUrl = environment.baseUrl;
  members: IMember[] = [];
  memberCache = new Map();
  user !: IUser;
  userParams !: UserParams;

  constructor(private http: HttpClient, private user$: UserService) {
    this.user$.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.userParams = new UserParams(user);
    })
  }

  getUserParams() { return this.userParams; }
  setUserParams(params: UserParams) { this.userParams = params; }
  resetUserParams() { 
    this.userParams = new UserParams(this.user); 
    return this.userParams;
  }

  getMember(username: string) {
    // const member = this.members.find(el => el.username === username);
    // if (member !== undefined) return of(member);
    const member = [...this.memberCache.values()]
      .reduce((arr, element) => arr.concat(element.result), [])
      .find((member: IMember) => member.username === username);
    
    if (member) return of(member);
    return this.http.get<IMember>(this.baseUrl+'users/'+username);
  }

  updateMember(member: IMember) {
    return this.http.put(this.baseUrl+'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    )
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl+'users/set-main-photo/'+photoId, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl+'users/delete-photo/'+photoId);
  }

  addLike(username: string) {
    return this.http.post(this.baseUrl+'likes/'+username, {});
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number) {
    let httpParams = this.getPaginationHeaders(pageNumber, pageSize);
    httpParams = httpParams.append('predicate', predicate);
    return this.getPaginatedResult<Partial<IMember[]>>(this.baseUrl+'likes',httpParams);
    // return this.http.get<Partial<IMember[]>>(this.baseUrl+'likes?predicate='+predicate);
  }

  getMembers(userParams: UserParams) {
    var response = this.memberCache.get(Object.values(userParams).join('-'));
    if (response) return of(response);

    let httpParams = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);
    httpParams = httpParams.append('minAge', userParams.minAge.toString());
    httpParams = httpParams.append('maxAge', userParams.maxAge.toString());
    httpParams = httpParams.append('gender', userParams.gender);
    httpParams = httpParams.append('orderBy', userParams.orderBy);
    
    return this.getPaginatedResult<IMember[]>(this.baseUrl+'users', httpParams).pipe(
      map(res => {
        this.memberCache.set(Object.values(userParams).join('-'), res);
        return res;
      })
    );
  }

  private getPaginatedResult<T>(url: string, httpParams: HttpParams) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();

    return this.http.get<T>(url, { observe: 'response', params: httpParams }).pipe(
      map(response => {
        if (response.body) paginatedResult.result = response.body;
        const paginateInfo = response.headers.get('pagination');
        if (paginateInfo) paginatedResult.pagination = JSON.parse(paginateInfo);
        return paginatedResult;
      })
    );
  }

  private getPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return params;
  }
}
