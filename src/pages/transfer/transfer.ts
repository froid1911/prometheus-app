import { Component, OnInit } from '@angular/core';
import { PrometheusProvider } from '../../providers/prometheus/prometheus';
import { AlertController, LoadingController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@Component({
  selector: 'page-transfer',
  templateUrl: 'transfer.html'
})
export class TransferPage {

  tx: any;
  receipt: any;
  disableQRButton = false;
  loadingView: any;
  constructor(
    public barcodeScanner: BarcodeScanner,
    private prometheus: PrometheusProvider,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController) {

  }

  ngOnInit() {
    this.scanQR();
    this.loadingView = this.loadingCtrl.create({
      content: 'Bitte warten. Transaction wird gemined.',
    });
  }

  scanQR() {
    this.receipt = false;
    this.barcodeScanner.scan({
      preferFrontCamera: false,
      showFlipCameraButton: true,
      showTorchButton: true,
    }).then((barcodeData) => {

      this.tx = this.prometheus.readQRCodeString(barcodeData.text);
      console.log(this.tx);
      this.disableQRButton = true;
      this.showTxConfirmAlert();

    })
  }

  private showTxConfirmAlert() {
    const alert = this.alertCtrl.create({
      title: "Confirm Transaction",
      subTitle: "Receiver: " + this.tx.to + ", Value: " + this.tx.value,
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            this.disableQRButton = false;
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirm',
          handler: data => {
            this.loadingView.present();
            this.prometheus.transfer(this.tx.argsDefaults[0].value, parseInt(this.tx.argsDefaults[1].value))
              .then((receipt) => {
                this.disableQRButton = false;
                this.receipt = receipt;
                this.loadingView.dismiss();
              }).catch(console.error);
          }
        }
      ]
    });

    alert.present();
  }

  protected showTxConfirmModal() {

  }

}
