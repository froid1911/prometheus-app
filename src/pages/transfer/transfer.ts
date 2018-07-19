import { Component, OnInit } from '@angular/core';
import { QRScanner } from '@ionic-native/qr-scanner';
import { PrometheusProvider } from '../../providers/prometheus/prometheus';
import { AlertController, NavController } from 'ionic-angular';
import { DatasetsPage } from '../datasets/datasets';

@Component({
  selector: 'page-transfer',
  templateUrl: 'transfer.html'
})
export class TransferPage implements OnInit {

  tx: any;

  constructor(
    public qrScanner: QRScanner,
    private prometheus: PrometheusProvider,
    private alertCtrl: AlertController,
    private navCtrl: NavController) {

  }

  ngOnInit() {
    this.scanQR();
  }

  protected scanQR() {
    this.qrScanner.prepare().then((instance) => {
      console.log(instance);
      if (!instance.authorized) {
        return alert('Please authorize the App to access your Camera.')
      }

      this.qrScanner.scan().subscribe((qrcode) => {
        // decode string
        this.tx = this.prometheus.readQRCodeString(qrcode);
        console.log(this.tx);
        this.qrScanner.hide();
        this.showTxConfirmAlert();
      })
    })
  }

  private showTxConfirmAlert() {
    this.alertCtrl.create({
      title: "Confirm Transaction",
      subTitle: "Receiver: " + this.tx.to + ", Value: " + this.tx.value,
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log(this.tx);
            console.log('Saved clicked');
          }
        }
      ]
    })
  }

  protected showTxConfirmModal() {

  }

}
