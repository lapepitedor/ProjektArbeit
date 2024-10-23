import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Expense } from 'src/app/core/models/expense-model';
import { AuthService } from 'src/app/core/service/auth.service';
import { LoginService } from 'src/app/core/service/login.service';
import { collection, getDocs, query, where } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  cardConfig: any[] = [
    {
      label: 'Income',
      count: 0,
      type: 'income',
      class: 'col-md-3 col-sm-12 col-12 mb-4 cards',
      color: '#2196f3',
    },
    {
      label: 'Expenses',
      count: 0,
      type: 'expense',
      class: 'col-md-3 col-sm-12 col-12 mb-4 cards',
      color: '#ffa4b4',
    },
    {
      label: 'Balance',
      count: 0,
      type: 'balance',
      class: 'col-md-3 col-sm-12 col-12 mb-4 cards',
      color: '#77ff77',
    },
    {
      label: 'Transactions',
      count: 0,
      type: 'transactions',
      class: 'col-md-3 col-sm-12 col-12 mb-4 cards',
      color: '#21def1',
    },
  ];

  expenseDataChart: { name: string; y: number; value: string }[] = [];
  expenseDataTable: Expense[] = [];
  expenseDataTBar: Expense[] = [];
  metrics: {
    color?: string;
    value: string | number;
    metricTitle: string;
    icon?: string;
  }[] = [];

  isLoadingExpenses = true;
  isDataReady = false;
  date = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  );
  categoryDate = new Date();
  categories!: string[];

  private expenses!: Subscription;

  transitions: any[] = [];

  userId: any = null;

  balanceAmt: any = 0;
  incomeAmt: any = 0;
  expenseAmt: any = 0;

  startDate: any = null;
  endDate: any = null;

  constructor(
    public authService: AuthService,
    public afs: AngularFirestore,
    private loginService: LoginService
  ) {
    this.loginService.userIdSetAnnounced$.subscribe((category) => {
      this.getUserExpenses();
    });

    this.userId = this.loginService.getUserId();

    let date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth();
    this.startDate = new Date(y, m, 1);
    this.endDate = new Date(y, m + 1, 0);
  }

  ngOnInit() {
    this.getUserExpenses();
  }

  getUserExpenses() {
    this.subToExpensesChange();
  }

  private subToExpensesChange() {
    const userId = this.loginService.getUserId();
    this.isLoadingExpenses = true;

    if (userId) {
      this.getExpenses();
    } else {
      this.isLoadingExpenses = false;
    }
  }

  private async getExpenses() {
    this.isLoadingExpenses = true;
    if (this.startDate && this.endDate) {
      const q = query(
        collection(this.afs.firestore, `users/${this.userId}/expenses`),
        where('dateinMili', '>', this.startDate.getTime()),
        where('dateinMili', '<', this.endDate.getTime())
      );

      let list = await getDocs(q);
      let result = [];
      result = list.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      this.transitions = result;

      this.filterData(this.transitions);
    }
  }

  checkDate(e: Date, prop: string) {
    (this as any)[prop] = e;
  }

  valueChanged(event: any) {
    this.getExpenses();
  }

  parseData(snapsShots: any) {
    const data: any = [];
    snapsShots.forEach((snapshot: any) => {
      const expense = snapshot.payload.exportVal();
      expense.id = snapshot.key;
      data.push(expense);
    });
    return data;
  }

  filterData(snapshots: any) {
    this.isLoadingExpenses = true;
    const parsedData = snapshots;

    const firstDate = new Date(
      Math.min.apply(
        null,
        parsedData.map((e: any) => new Date(e.date))
      )
    );
    const lastDate = new Date(
      Math.max.apply(
        null,
        parsedData.map((e: any) => new Date(e.date))
      )
    );

    const numOfEntries = parsedData.length;
    const getTotal = this.getTotal(parsedData);
    const totalAmount = getTotal.categorySum;

    this.cardConfig[0].count = getTotal.incomeAmt;
    this.cardConfig[1].count = getTotal.expenseAmt;
    this.cardConfig[2].count = getTotal.balanceAmt;
    this.cardConfig[3].count = numOfEntries;

    this.metrics = [
      // {
      //   color: 'money-icon',
      //   value: firstDate.toDateString().slice(3, 15),
      //   metricTitle: 'First Expense Date',
      //   icon: 'today',
      // },
      // {
      //   color: 'money-icon',
      //   value: lastDate.toDateString().slice(3, 15),
      //   metricTitle: 'Latest Expense Date',
      //   icon: 'today',
      // },
      // {
      //   color: 'money-icon',
      //   value: numOfEntries,
      //   metricTitle: 'Number of Expenses',
      //   icon: 'receipt',
      // },
      // {
      //   color: 'money-icon',
      //   value: totalAmount,
      //   metricTitle: 'Total Amount of Categories',
      //   icon: 'attach_money',
      // },
    ];

    this.categories = parsedData
      .map((item: any) => item.category)
      .filter(
        (value: any, index: any, self: any) => self.indexOf(value) === index
      );

    const pieData = [];

    for (const category of this.categories) {
      let categorySum = 0;
      for (const value of parsedData) {
        if (value.category === category) {
          categorySum += value.amount;
        }
      }
      const dataObj = {
        name: category,
        y: categorySum,
        value: categorySum.toFixed(2),
      };
      pieData.push(dataObj);
    }

    this.expenseDataChart = pieData;
    this.expenseDataTable = parsedData;
    this.expenseDataTBar = parsedData.map((item: any) => ({
      name: item.name,
      value: Number(item.amount),
    }));

    this.isDataReady = true;
    this.isLoadingExpenses = false;
  }

  getTotal(expenses: any): any {
    let incomeAmt = 0;
    let expenseAmt = 0;
    let categorySum = 0;
    let balanceAmt = 0;
    for (const expense of expenses) {
      if (expense.expense_type == 'Income') {
        incomeAmt += expense.amount;
      } else if (expense.expense_type == 'Expense') {
        expenseAmt += expense.amount;
      }

      categorySum += expense.amount;
    }
    balanceAmt = incomeAmt - expenseAmt;

    return {
      categorySum: categorySum.toFixed(2),
      balanceAmt: balanceAmt.toFixed(2),
      incomeAmt: incomeAmt.toFixed(2),
      expenseAmt: expenseAmt.toFixed(2),
    };
  }

  getCategoryTotals(expenses: Expense[]) {
    const categories = expenses
      .map((item) => item.category)
      .filter((value, index, self) => self.indexOf(value) === index);
    const totals = [];

    for (const category of categories) {
      let categorySum = 0;
      for (const value of expenses) {
        if (value.category === category) {
          categorySum += value.amount as number;
        }
      }
      const dataObj = { name: category, amount: categorySum.toFixed(2) };
      totals.push(dataObj);
    }
    return totals.toString();
  }

  ngOnDestroy() {
    if (this.expenses) {
      this.expenses.unsubscribe();
    }
  }
}
