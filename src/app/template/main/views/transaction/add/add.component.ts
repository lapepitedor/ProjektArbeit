import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { LoginService } from 'src/app/core/service/login.service';
import { expense_types } from 'src/app/shared/constants/expense-constants';
import { CategoryService } from 'src/app/core/service/category.service';
import { TransactionService } from 'src/app/core/service/transaction.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
  categories: any[] = [];
  types: string[] = expense_types;
  expenseForm: FormGroup;
  isLoading = false;
  type: any = 'add';
  editData: any;

  userId: string = '';

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AddComponent>,
    private categoryService: CategoryService,
    private transactionService: TransactionService
  ) {
    this.expenseForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]],
      date: ['', Validators.required],
      time: [''],
      category: ['', Validators.required],
      payment_type: ['', Validators.required],
      expense_type: ['', Validators.required],
      comments: [''],
    });
  }

  ngOnInit() {
    this.userId = this.loginService.getUserId();

  
    this.getCategories().then(() => {
      // Patcher les données dans le formulaire seulement après avoir chargé les catégories
      if (this.type === 'edit' && this.editData) {
        this.patchEditData();
      }
    });
  }

  async getCategories() {
    this.isLoading = true;
    try {
      this.categories = await this.categoryService.getCategories(this.userId);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
    this.isLoading = false;
  }

  async saveExpenseEntry() {
    this.isLoading = true;
    const transactionObj = this.expenseForm.value;
    if (typeof transactionObj.date !== 'string') {
      transactionObj.date = transactionObj.date.toDateString();
      transactionObj['dateinMili'] = new Date(transactionObj.date).getTime();
    }

    console.log('transactionObj', transactionObj);
    try {
      if (this.type === 'add') {
        const docRef = await this.transactionService.addTransaction(
          this.userId,
          transactionObj
        );
        this.dialogRef.close(docRef.id);
      } else {
        await this.transactionService.updateTransaction(
          this.userId,
          this.editData.id,
          transactionObj
        );
        this.dialogRef.close(this.editData.id);
      }
      this.showSnackBar();
    } catch (error) {
      console.error('Error saving expense:', error);
    } finally {
      this.isLoading = false;
    }
  }

  // Nouvelle méthode pour patcher les données de l'édition
  patchEditData() {
    this.expenseForm.patchValue(this.editData);
    let date = new Date(this.editData.date);
    this.expenseForm.get('date')?.setValue(date);
    this.expenseForm.get('category')?.setValue(this.editData.category); // Assurez-vous que la catégorie est correctement définie
  }

  showSnackBar() {
    let message =
      this.type == 'add' ? 'Transaction saved!' : 'Transaction updated!';
    this.snackBar.open(message, 'Ok', { duration: 2000 });
  }

  onSubmit() {
    if (this.expenseForm.valid) {
      this.saveExpenseEntry();
    }
  }

  clearForm() {
    this.expenseForm.reset();
  }

  getField(control: any) {
    return this.expenseForm.get(control);
  }

  formatAmount() {
    const amountControl = this.expenseForm.get('amount');

    if (this.expenseForm.get('amount') !== null) {
      if (typeof this.expenseForm.get('amount') !== 'string') {
        const rounded = this.expenseForm.get('amount')?.value.toFixed(2);
        this.expenseForm.get('amount')?.setValue(parseFloat(rounded));
      }
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
