import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import {LoadingController, AlertController, ToastController} from '@ionic/angular';


@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.page.html',
  styleUrls: ['./student-list.page.scss'],
})
export class StudentListPage implements OnInit {

  studentsData: any;

  constructor(
      public apiService: ApiService,
      public alertController: AlertController,
      public toastController: ToastController,
  ) {
    this.studentsData = [];
  }
  pager: any = {};
  pagedItems: any[];
  ngOnInit() {
  }
  ionViewWillEnter() {
    this.getAllStudents();
  }

  getAllStudents() {
    document.getElementById('skeleton').style.display = 'block';
    document.getElementById('data').style.display = 'none';
    this.apiService.getList().subscribe(response => {
      this.studentsData = response;
      this.setPage(1);
      // console.log(response)
      document.getElementById('skeleton').style.display = 'none';
      document.getElementById('data').style.display = 'block';
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
  async presentConfirm(item) {
    const alert = await this.alertController.create({
      header: 'Are Your Sure?',
      message: '<p>Delete Student <strong>' + item.name + '</strong> Data ?</p>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: (blah) => {
            // console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            this.apiService.deleteItem(item.id).subscribe(Response => {
              this.getAllStudents();
              this.presentToast();
            });
          }
        }
      ]
    });
    alert.present();
  }

  delete(item) {
      this.presentConfirm(item);
  }
  setPage(page: number) {
    // get pager object from service
    this.pager = this.getPager(this.studentsData.length, page);
    // get current page of items
    this.pagedItems = this.studentsData.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
  getPager(totalItems: number, currentPage: number = 1, pageSize: number = 20) {
    // calculate total pages
    let totalPages = Math.ceil(totalItems / pageSize);

    // ensure current page isn't out of range
    if (currentPage < 1) {
      currentPage = 1;
    } else if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    let startPage: number, endPage: number;
    if (totalPages <= 10) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 10 total pages so calculate start and end pages
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }

    // calculate start and end item indexes
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

    // return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };
  }
}
