import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PrometheusProvider } from '../../providers/prometheus/prometheus';

@Component({
  selector: 'page-datasets',
  templateUrl: 'datasets.html'
})
export class DatasetsPage implements OnInit {

  datasets: any[]


  constructor(public navCtrl: NavController, private prometheus: PrometheusProvider) {

  }

  ngOnInit(): void {
    this.prometheus.datasets.subscribe((datasets) => {
      this.datasets = datasets;
      console.log(this.datasets);
    });
  }

}
