import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { IMember } from 'src/app/_models/member';
import { IPhoto } from 'src/app/_models/photo';
import { IUser } from 'src/app/_models/user';
import { MemberService } from 'src/app/_services/member.service';
import { SpinnerService } from 'src/app/_services/spinner.service';
import { UserService } from 'src/app/_services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.scss']
})
export class PhotoEditorComponent implements OnInit {
  @Input() member !: IMember;
  uploader !: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.baseUrl;
  user !: IUser;

  constructor(
    private user$: UserService, 
    private memb$: MemberService, 
    private toastr: ToastrService,
    private spin$: SpinnerService
  ) { }

  ngOnInit(): void {
    this.user$.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
    this.initializeUploader();
  }

  fileOverBase(event: any) {
    this.hasBaseDropZoneOver = event;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo',
      authToken: 'Bearer ' + this.user.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    })

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = true;
    }
    this.uploader.onBeforeUploadItem = (file) => {
      file.withCredentials = false;
      this.spin$.start();
    }
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) this.member.photos.push(JSON.parse(response));
      this.spin$.stop();
    }
    this.uploader.onCompleteAll = () => {
      this.toastr.success('Photos added successfully');
    }
  }

  setMainPhoto(photo: IPhoto) {
    this.memb$.setMainPhoto(photo.id).subscribe(() => {
      this.user.photoUrl = photo.url;
      this.user$.setCurrentUser(this.user);
      this.member.photoUrl = photo.url;
      this.member.photos.forEach(el => {
        if (el.isMain) el.isMain = false;
        if (el.id === photo.id) el.isMain = true;
      })
      this.toastr.success('DP updated successfully');
    })
  }

  deletePhoto(photoId: number) {
    this.memb$.deletePhoto(photoId).subscribe(() => {
      this.member.photos = this.member.photos.filter(el => el.id !== photoId);
      this.toastr.success('Photo deleted successfully');
    })
  }
}
