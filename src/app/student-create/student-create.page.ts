import { Component, OnInit } from '@angular/core';
import { Student } from '../models/student';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-student-create',
  templateUrl: './student-create.page.html',
  styleUrls: ['./student-create.page.scss'],
})
export class StudentCreatePage implements OnInit {

  data: Student

  constructor(
      public apiService: ApiService,
      public router: Router,
      public toastController: ToastController,
  ) {
    this.data = new Student();
  }

  ngOnInit() {
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Student Saved.',
      duration: 2500,
      showCloseButton: true,

    });
    toast.present();
  }
  submitForm() {
    this.apiService.createItem(this.data).subscribe((response) => {
      this.presentToast();
      this.router.navigate(['list']);
    });

  }

}
