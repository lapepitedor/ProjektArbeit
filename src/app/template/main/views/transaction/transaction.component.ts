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

@Component({
    selector: 'app-transaction',
    templateUrl: './transaction.component.html',
    styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent
{
    @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
    @ViewChild('sorter', { static: true }) sort!: MatSort;
    @Input() displayColumns: string[] = ['date', 'time', 'amount', 'category', 'expense_type', 'payment_type', 'comments', 'actions'];

    expensesData = new MatTableDataSource<any>();

    expenseDataTable: any[] = [];
    userId: string = '';
    isLoading: boolean = false;

    constructor(public dialog: MatDialog, private loginService: LoginService, public afs: AngularFirestore, private snackBar: MatSnackBar) { }

    ngOnInit()
    {
        this.userId = this.loginService.getUserId();
        this.getExpenses();
        console.log("user id::", this.loginService.getUserId());
    }
    async getExpenses()
    {
        this.isLoading = true;
        let list = await getDocs(collection(this.afs.firestore, `users/${this.userId}/expenses`));
        console.log(list.docs);

        // this.parseData(list.docs);
        let result = []
        result = list.docs.map((d) => ({
            id: d.id,
            ...d.data()
        }))
        console.log('>>> expenses with static id', result);
        this.expenseDataTable = result
        this.updateList();
    }
    updateList()
    {
        this.expensesData = new MatTableDataSource<any>(this.expenseDataTable);
        this.expensesData.paginator = this.paginator;
        this.expensesData.sort = this.sort;
        this.isLoading = false;
    }



    ngAfterViewInit()
    {
        this.expensesData.sort = this.sort;
    }

    ngOnChanges(changes: any)
    {
        if (!changes.data.firstChange)
        {
            this.expensesData = new MatTableDataSource<any>(this.expenseDataTable);
            this.expensesData.paginator = this.paginator;
            this.expensesData.sort = this.sort;
        }
    }

    isDataEmpty(): boolean
    {
        return this.expenseDataTable.length === 0;
    }

    editData(expense: any)
    {
        let df = this.dialog.open(AddComponent, { autoFocus: false });
        df.componentInstance.type = 'edit';
        df.componentInstance.editData = expense;
        df.afterClosed().subscribe(result =>
        {
            if (result)
            {
                this.getExpenses();
            }
        })
    }

    async deleteExpense(expense: any)
    {
        const expenseDocRef = doc(this.afs.firestore, `users/${this.userId}/expenses/${expense.id}`);
        await deleteDoc(expenseDocRef);
        this.snackBar.open("Transaction record has been deleted.", 'ok', { duration: 4000 });
        this.getExpenses();
    }

    addTransaction()
    {
        let df = this.dialog.open(AddComponent);
        df.afterClosed().subscribe(result =>
        {
            if (result)
            {
                this.expenseDataTable.push(result);
                this.getExpenses();
            }
        })
    }

    applyFilter(event: Event)
    {
        const filterValue = (event.target as HTMLInputElement).value;
        this.expensesData.filter = filterValue.trim().toLowerCase();
    }
}
