import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';

import { Firestore, addDoc, collection, getDocs, query, deleteDoc, updateDoc, getDoc, doc } from '@angular/fire/firestore';
import { LoginService } from 'src/app/core/service/login.service';
import { expense_categories, expense_types } from 'src/app/shared/constants/expense-constants';

@Component({
    selector: 'app-add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit
{
    categories: any[] = expense_categories;
    types: string[] = expense_types;
    categoryForm: FormGroup;
    isLoading = false;
    type: any = 'add'
    editData: any;

    userId: string = ''

    constructor(
        private fb: FormBuilder,
        private loginService: LoginService,
        private snackBar: MatSnackBar,
        private dialogRef: MatDialogRef<AddComponent>,
        private afs: AngularFirestore
    )
    {
        this.categoryForm = this.fb.group({
            name: ['', [Validators.required]],
        });
    }

    ngOnInit()
    {
        // this.categories = this.loginService.getCurrentCategories();
        this.userId = this.loginService.getUserId();
        console.log("categories", this.categories);
        if (this.type == 'edit')
        {
            this.categoryForm.patchValue(this.editData);
        }
    }

    updateExpenseCategories(category: string)
    {
        this.categories = this.loginService.getCurrentCategories();
    }

    async saveExpenseEntry()
    {
        this.isLoading = true;
        const categoryObj = this.categoryForm.value;

        console.log("categoryObj", categoryObj);
        let docRef;

        if (this.type == 'add')
        {
            docRef = await addDoc(collection(this.afs.firestore, `users/${this.userId}/categories`), categoryObj);
        }
        else
        {
            docRef = doc(this.afs.firestore, `users/${this.userId}/categories/${this.editData.id}`);
            await updateDoc(docRef, categoryObj);
        }

        console.log("Document written with ID: ", docRef.id);
        this.showSnackBar()

        this.dialogRef.close(docRef.id);
    }

    showSnackBar()
    {
        let message = this.type == 'add' ? "Category saved!" : "Category updated!"
        this.snackBar.open(message, 'Ok', { duration: 2000 });
    }

    onSubmit()
    {
        if (this.categoryForm.valid)
        {
            this.saveExpenseEntry();
        }
    }

    clearForm()
    {
        this.categoryForm.reset();
    }

    getField(control: any)
    {
        return this.categoryForm.get(control)
    }

    closeDialog(): void
    {
        this.dialogRef.close();
    }

}
