import { Component, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AddComponent } from './add/add.component';
import { collection, getDocs, deleteDoc,  doc } from '@angular/fire/firestore';
import { LoginService } from 'src/app/core/service/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Category } from 'src/app/core/models/Category';
import { CategoryService } from 'src/app/core/service/category.service';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('sorter', { static: true }) sort!: MatSort;
  @Input() displayColumns: string[] = ['name', 'actions'];

  categoriesData = new MatTableDataSource<Category>();
  categoryDataTable: Category[] = [];
  isLoading: boolean = false;
  userId: string = '';

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private categoryService: CategoryService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.userId = this.loginService.getUserId();
    this.getCategories();
  }

  async getCategories() {
    this.isLoading = true;

    this.categoryDataTable = await this.categoryService.getCategories(
      this.userId
    );

    this.updateList();
  }

  updateList() {
    this.categoriesData = new MatTableDataSource<any>(
      this.categoryDataTable
    );
    this.categoriesData.paginator = this.paginator;
    this.categoriesData.sort = this.sort;
    this.isLoading = false;
  }

  ngAfterViewInit() {
    this.categoriesData.sort = this.sort;
  }

  ngOnChanges(changes: any) {
    if (!changes.data.firstChange) {
      this.categoriesData = new MatTableDataSource<Category>(
        this.categoryDataTable
      );
      this.categoriesData.paginator = this.paginator;
      this.categoriesData.sort = this.sort;
    }
  }

  isDataEmpty(): boolean {
    return this.categoryDataTable.length === 0;
  }

  editData(category: Category) {
  
    let df = this.dialog.open(AddComponent, { autoFocus: false });
    df.componentInstance.type = 'edit';
    df.componentInstance.editData = category;
    df.afterClosed().subscribe((result) => {
      if (result) {
       
        this.getCategories();
      }
    });
  }

 
  async deleteCategory(category: any) {
    debugger
    try {
   
      await this.categoryService.deleteCategory(this.userId, category.id);     
      this.snackBar.open('Category deleted!', 'Ok', { duration: 2000 });
       this.getCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  }

  addCategory() {
    let df = this.dialog.open(AddComponent);
    df.afterClosed().subscribe((result) => {
      if (result) {
        this.categoryDataTable.push(result);
        this.getCategories();
      }
    });
  }


}