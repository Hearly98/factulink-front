import { Component, inject } from '@angular/core';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { DestroyRef } from '@angular/core';
import { type ChartData } from 'chart.js';
import { ColComponent, RowComponent } from '@coreui/angular';
import { ButtonDirective } from '@coreui/angular';
import { DropdownComponent } from '@coreui/angular';
import { DropdownItemDirective } from '@coreui/angular';
import { DropdownMenuDirective } from '@coreui/angular';
import { DropdownToggleDirective } from '@coreui/angular';
import { TemplateIdDirective } from '@coreui/angular';
import { WidgetStatAComponent } from '@coreui/angular';
import { getStyle } from '@coreui/utils';
import { IconDirective } from '@coreui/icons-angular';

@Component({
  selector: 'app-dashboard',
  imports: [
    ChartjsComponent,
    RowComponent,
    ColComponent,
    IconDirective,
    RowComponent,
    TemplateIdDirective,
    WidgetStatAComponent,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  readonly #destroyRef = inject(DestroyRef);
  #timeoutID: ReturnType<typeof setTimeout> | undefined = undefined;

  constructor() {
    this.#destroyRef.onDestroy(() => {
      clearTimeout(this.#timeoutID);
    });
  }

  dataWidget: any = {};
  optionsWidget: any = {};

  labels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
    'January',
    'February',
    'March',
    'April',
  ];

  datasets = [
    {
      label: 'My First dataset',
      backgroundColor: 'transparent',
      borderColor: 'rgba(255,255,255,.55)',
      pointBackgroundColor: getStyle('--cui-primary'),
      pointHoverBorderColor: getStyle('--cui-primary'),
      data: [65, 59, 84, 84, 51, 55, 40],
    },
  ];

  optionsDefault = {
    plugins: {
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: true,
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          display: false,
        },
      },
      y: {
        min: 30,
        max: 89,
        display: false,
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
    },
    elements: {
      line: {
        borderWidth: 1,
        tension: 0.4,
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
  };

  ngOnInit(): void {
    this.dataWidget = {
      labels: this.labels.slice(0, 7),
      datasets: this.datasets,
    };
    this.optionsWidget = this.optionsDefault;
  }
  data: ChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'My First dataset',
        backgroundColor: 'rgba(220, 220, 220, 0.2)',
        borderColor: 'rgba(220, 220, 220, 1)',
        pointBackgroundColor: 'rgba(220, 220, 220, 1)',
        pointBorderColor: '#fff',
        data: [40, 20, 12, 39, 10, 80, 40],
      },
      {
        label: 'My Second dataset',
        backgroundColor: 'rgba(151, 187, 205, 0.2)',
        borderColor: 'rgba(151, 187, 205, 1)',
        pointBackgroundColor: 'rgba(151, 187, 205, 1)',
        pointBorderColor: '#fff',
        data: [50, 12, 28, 29, 7, 25, 60],
      },
    ],
  };

  handleChartRef($chartRef: any) {
    if ($chartRef) {
      console.log('handleChartRef', $chartRef);
      this.#timeoutID = setTimeout(() => {
        this.data?.labels?.push('August');
        this.data?.datasets[0].data.push(60);
        this.data?.datasets[1].data.push(20);
        $chartRef?.update();
        this.#timeoutID = undefined;
      }, 3000);
    }
  }
}
