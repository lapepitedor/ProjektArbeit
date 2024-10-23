import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Firestore, addDoc, collection, getDocs, query, deleteDoc, updateDoc, getDoc, doc } from '@angular/fire/firestore';
import { LoginService } from 'src/app/core/service/login.service';
import { expense_categories, expense_types } from 'src/app/shared/constants/expense-constants';
import { CategoryService } from 'src/app/core/service/category.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
  categories: any[] = expense_categories;
  types: string[] = expense_types;
  categoryForm: FormGroup;
  isLoading = false;
  type: any = 'add';
  editData: any;

  userId: string = '';

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AddComponent>,
    private categoryService: CategoryService,
    private loginService:LoginService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.userId = this.loginService.getUserId();
    if (this.type == 'edit') {
      this.categoryForm.patchValue(this.editData);
    }
  }

  // Sauvegarder ou mettre à jour une catégorie via le service
  async saveCategoryEntry() {
    this.isLoading = true;
    const categoryObj = this.categoryForm.value;

    try {
      if (this.type === 'add') {
        const docRef = await this.categoryService.addCategory(
          this.userId,
          categoryObj
        );
        this.dialogRef.close(docRef.id);
      } else {
        await this.categoryService.updateCategory(
          this.userId,
          this.editData.id,
          categoryObj
        );
        this.dialogRef.close(this.editData.id);
      }
      this.showSnackBar();
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      this.isLoading = false;
    }
  }

  // Supprimer une catégorie via le service
  async deleteCategoryEntry(categoryId: string) {
    try {
      await this.categoryService.deleteCategory(this.userId, categoryId);
      this.snackBar.open('Category deleted!', 'Ok', { duration: 2000 });
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  }

  showSnackBar() {
    let message = this.type == 'add' ? 'Category saved!' : 'Category updated!';
    this.snackBar.open(message, 'Ok', { duration: 2000 });
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      this.saveCategoryEntry();
    }
  }

  clearForm() {
    this.categoryForm.reset();
  }

  getField(control: any) {
    return this.categoryForm.get(control);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
