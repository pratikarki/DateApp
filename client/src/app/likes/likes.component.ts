import { Component, OnInit } from '@angular/core';
import { IMember } from '../_models/member';
import { IPagination } from '../_models/pagination';
import { MemberService } from '../_services/member.service';

@Component({
  selector: 'app-likes',
  templateUrl: './likes.component.html',
  styleUrls: ['./likes.component.scss']
})
export class LikesComponent implements OnInit {
  members !: Partial<IMember[]>; // with Partial, each members of IMember will be optional
  predicate = 'likedBy';
  pageNumber = 1;
  pageSize = 6;
  pagination !: IPagination | null;

  constructor(private memb$: MemberService) { }

  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes() {
    this.pagination = null;
    this.memb$.getLikes(this.predicate, this.pageNumber, this.pageSize).subscribe(res => {
      this.members = res.result;
      this.pagination = res.pagination;
    })
  }

  pageChanged(event: any) {
    this.pageNumber = event.page;
    this.loadLikes();
  }

}
