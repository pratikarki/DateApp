import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { IMember } from 'src/app/_models/member';
import { IUser } from 'src/app/_models/user';
import { MemberService } from 'src/app/_services/member.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.scss']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm !: NgForm;
  member !: IMember;
  user !: IUser;
  @HostListener('window:beforeunload', ['$event']) unloadNotif($event: any) {
    if (this.editForm.dirty) $event.returnValue = true;
  }

  constructor(private user$: UserService, private memb$: MemberService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.user$.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.loadMember();
    });
  }

  loadMember() {
    this.memb$.getMember(this.user.username).subscribe(member => {
      this.member = member;
    })
  }

  updateMember() {
    this.memb$.updateMember(this.member).subscribe(() => {
      this.toastr.success('Profile updated successfully');
      this.editForm.reset(this.member);
    })
  }
}
