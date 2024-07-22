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

export interface Category
{
    id?: string;
    name: string;
}

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent
{
    @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
    @ViewChild('sorter', { static: true }) sort!: MatSort;
    @Input() displayColumns: string[] = ['name','actions'];

    categoriesData = new MatTableDataSource<Category>();

    // categoriesData = new MatTableDataSource<any>();

    categoryDataTable: any[] = [];
    userId: string = '';
    isLoading: boolean = false;

    constructor(public dialog: MatDialog, private loginService: LoginService, public afs: AngularFirestore, private snackBar: MatSnackBar) { }

    ngOnInit()
    {
        this.userId = this.loginService.getUserId();
        this.getCategories();
        console.log("user id::", this.loginService.getUserId());

    }
    async getCategories()
    {
        this.isLoading = true;
        let list = await getDocs(collection(this.afs.firestore, `users/${this.userId}/categories`));
        console.log(list.docs);

        // this.parseData(list.docs);
        let result = []
        result = list.docs.map((d) => ({
            id: d.id,
            ...d.data()
        }))
        console.log('>>> categories with static id', result);
        this.categoryDataTable = result
        this.updateList();
    }
    updateList()
    {
        this.categoriesData = new MatTableDataSource<any>(this.categoryDataTable);
        this.categoriesData.paginator = this.paginator;
        this.categoriesData.sort = this.sort;
        this.isLoading = false;
    }



    ngAfterViewInit()
    {
        this.categoriesData.sort = this.sort;
    }

    ngOnChanges(changes: any)
    {
        if (!changes.data.firstChange)
        {
            this.categoriesData = new MatTableDataSource<any>(this.categoryDataTable);
            this.categoriesData.paginator = this.paginator;
            this.categoriesData.sort = this.sort;
        }
    }

    isDataEmpty(): boolean
    {
        return this.categoryDataTable.length === 0;
    }

    editData(category: any)
    {
        let df = this.dialog.open(AddComponent, { autoFocus: false });
        df.componentInstance.type = 'edit';
        df.componentInstance.editData = category;
        df.afterClosed().subscribe(result =>
        {
            if (result)
            {
                this.getCategories();
            }
        })
    }

    async deleteCategory(category: any)
    {
        const categoryDocRef = doc(this.afs.firestore, `users/${this.userId}/categories/${category.id}`);
        await deleteDoc(categoryDocRef);
        this.snackBar.open("Category record has been deleted.", 'ok', { duration: 4000 });
        this.getCategories();
    }

    addCategory()
    {
        let df = this.dialog.open(AddComponent);
        df.afterClosed().subscribe(result =>
        {
            if (result)
            {
                this.categoryDataTable.push(result);
                this.getCategories();
            }
        })
    }
}