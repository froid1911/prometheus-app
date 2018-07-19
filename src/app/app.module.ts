import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { DatasetsPage } from '../pages/datasets/datasets';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PrometheusProvider } from '../providers/prometheus/prometheus';
import { WalletPage } from '../pages/wallet/wallet';
import { TransferPage } from '../pages/transfer/transfer';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { HttpModule } from '@angular/http';
@NgModule({
  declarations: [
    MyApp,
    WalletPage,
    TransferPage,
    DatasetsPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    WalletPage,
    TransferPage,
    DatasetsPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    PrometheusProvider,
    BarcodeScanner
  ]
})
export class AppModule { }
