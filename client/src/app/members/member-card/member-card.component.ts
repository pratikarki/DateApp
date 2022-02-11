import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IMember } from 'src/app/_models/member';
import { MemberService } from 'src/app/_services/member.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.scss']
})
export class MemberCardComponent implements OnInit {
  @Input() member !: IMember;

  constructor(private memb$: MemberService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  addLike(member: IMember) {
    this.memb$.addLike(member.username).subscribe(() => {
      this.toastr.success('You have liked ' + member.knownAs);
    },err => {
      (err.error === "You already liked this user")? this.toastr.info(err.error) : this.toastr.error(err.error);
    })
  }

}
