import { Component, ElementRef, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('filePicker') filePicker: ElementRef;
  displayData = null;

  constructor(private alertController: AlertController) {}


  selectFile = () => this.filePicker.nativeElement.click();

  async fileSelected(event) {
    if (event?.target?.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        const result = reader.result.toString();
        const format = result.split(';')[0].split('/')[1];
        this.displayData = null;
        this.displayData = {
          format,
          name: moment().unix(),
          item: result,
        };
        this.validateFormat();
      };
    }
  }

  private async validateFormat() {
    if (!['png', 'jpg', 'jpeg', 'pdf'].includes(this.displayData.format)) {
      await this.handleAlertMessage(
        'Invalid',
        'File format is not supported, supported format (\'png\', \'jpg\', \'jpeg\', \'pdf\')',
        () => {
          this.displayData = null;
        },
        'dismiss'
      );
      return;
    }
  }

  private async handleAlertMessage(
    title: string,
    message: string,
    callback: () => void,
    cbTitle: string = 'OK'
  ) {
    const alert = await this.alertController.create({
      header: title, message,
      backdropDismiss : false,
      buttons: [ { text: cbTitle,  handler: _ => { callback(); } } ]
    });

    await alert.present();
  }
}
