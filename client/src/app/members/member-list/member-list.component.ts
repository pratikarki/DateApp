import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { IMember } from 'src/app/_models/member';
import { IPagination } from 'src/app/_models/pagination';
import { IUser } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { MemberService } from 'src/app/_services/member.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {
  members !: IMember[];
  pagination !: IPagination;
  userParams !: UserParams;
  user !: IUser;
  genderList = ['male', 'female'];

  constructor(private memb$: MemberService) {
    this.userParams = memb$.getUserParams();
  }

  ngOnInit(): void {
    this.loadMembers();
  }
  
  loadMembers() {
    this.memb$.setUserParams(this.userParams);
    this.memb$.getMembers(this.userParams).subscribe(response => {
      this.members = response.result;
      this.pagination = response.pagination;
    });
  }

  resetFilters() {
    this.userParams = this.memb$.resetUserParams();
    this.loadMembers();
  }

  pageChanged(event: any) {
    this.userParams.pageNumber = event.page;
    this.memb$.setUserParams(this.userParams);
    this.loadMembers();
  }

}
