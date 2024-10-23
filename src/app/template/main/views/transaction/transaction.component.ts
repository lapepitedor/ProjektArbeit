import { Component, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AddComponent } from './add/add.component';
// import { getDocs, collection, doc, deleteDoc } from 'firebase/firestore';

import { Firestore, addDoc, collection, getDocs, query, deleteDoc, updateDoc, getDoc, doc } from '@angular/fire/firestore';
import { LoginService } from 'src/app/core/service/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { AngularFirestore } from '@angular/fire/compat/firestore/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { TransactionService } from 'src/app/core/service/transaction.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('sorter', { static: true }) sort!: MatSort;
  @Input() displayColumns: string[] = [
    'date',
    'time',
    'amount',
    'category',
    'expense_type',
    'payment_type',
    'comments',
    'actions',
  ];

  expensesData = new MatTableDataSource<any>();

  expenseDataTable: any[] = [];
  userId: string = '';
  isLoading: boolean = false;

  constructor(
    public dialog: MatDialog,
    private loginService: LoginService,
    public afs: AngularFirestore,
    private snackBar: MatSnackBar,
    private transactionService: TransactionService
  ) {}

  ngOnInit() {
    this.userId = this.loginService.getUserId();
    this.getExpenses();
  }

  async getExpenses() {
    this.isLoading = true;
    try {
      this.expenseDataTable = await this.transactionService.getTransactions(
        this.userId
      );
      this.updateList();
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      this.isLoading = false;
    }
  }

  updateList() {
    this.expensesData = new MatTableDataSource<any>(this.expenseDataTable);
    this.expensesData.paginator = this.paginator;
    this.expensesData.sort = this.sort;
    this.isLoading = false;
  }

  ngAfterViewInit() {
    this.expensesData.sort = this.sort;
  }

  ngOnChanges(changes: any) {
    if (!changes.data.firstChange) {
      this.expensesData = new MatTableDataSource<any>(this.expenseDataTable);
      this.expensesData.paginator = this.paginator;
      this.expensesData.sort = this.sort;
    }
  }

  isDataEmpty(): boolean {
    return this.expenseDataTable.length === 0;
  }

  editData(expense: any) {
    let df = this.dialog.open(AddComponent, { autoFocus: false });
    df.componentInstance.type = 'edit';
    df.componentInstance.editData = expense;
    df.afterClosed().subscribe((result) => {
      if (result) {
        this.getExpenses();
      }
    });
  }
  async deleteExpense(expense: any) {
    try {   
      await this.transactionService.deleteTransaction(this.userId, expense.id);
      this.snackBar.open('Transaction record has been deleted.', 'ok', {
        duration: 4000,
      });
      this.getExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  }
    
  openDialogAddTransaction() {
    debugger;
    let dialog = this.dialog.open(AddComponent);
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.expenseDataTable.push(result);
        this.getExpenses();
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.expensesData.filter = filterValue.trim().toLowerCase();
     if (this.expensesData.paginator) {
       this.expensesData.paginator.firstPage();
     }
  }
}
