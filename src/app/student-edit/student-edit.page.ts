import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Student} from '../models/student';
import {ApiService} from '../services/api.service';
import {NavController, ToastController} from '@ionic/angular';


@Component({
    selector: 'app-student-edit',
    templateUrl: './student-edit.page.html',
    styleUrls: ['./student-edit.page.scss'],
})
export class StudentEditPage implements OnInit {


    id: number;
    data: Student;

    constructor(
        public activatedRoute: ActivatedRoute,
        public router: Router,
        public apiService: ApiService,
        private navController: NavController,
        public toastController: ToastController

    ) {
        this.data = new Student();
    }

    ngOnInit() {
        this.id = this.activatedRoute.snapshot.params['id'];
        this.apiService.getItem(this.id).subscribe(response => {
            this.data = response;
        });
    }

    async presentToast() {
        const toast = await this.toastController.create({
            message: 'Student Updated.',
            duration: 2500,
          showCloseButton: true,
        });
        toast.present();
    }

    update() {
        this.apiService.updateItem(this.id, this.data).subscribe(response => {
            this.navController.navigateRoot('/list');
            this.presentToast();
        });
    }
}
