import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { Member } from 'src/app/_models/member';
import { MemberService } from 'src/app/_services/member.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.scss']
})
export class MemberDetailComponent implements OnInit {
  member !: Member;
  galleryOptions !: NgxGalleryOptions[];
  galleryImages !: NgxGalleryImage[];

  constructor(private memb$: MemberService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadMember();

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ]
  }

  getImages(): NgxGalleryImage[] {
    const urls = [];
    for (const photo of this.member.photos) {
      urls.push({
        small: photo?.url,
        medium: photo?.url,
        big: photo?.url
      })
    }
    return urls;
  }

  loadMember() {
    const username = this.route.snapshot.paramMap.get('username');
    if (username) this.memb$.getMember(username).subscribe(member => {
      this.member = member;
      this.galleryImages = this.getImages();
    });
  }

}
