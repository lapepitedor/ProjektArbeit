import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Firestore, addDoc, collection, getDocs, query, deleteDoc, updateDoc, getDoc, doc } from '@angular/fire/firestore';
import { LoginService } from 'src/app/core/service/login.service';
import { expense_types } from 'src/app/shared/constants/expense-constants';

@Component({
    selector: 'app-add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit
{
    categories: any[] = [];
    types: string[] = expense_types;
    expenseForm: FormGroup;
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
        this.expenseForm = this.fb.group({
            amount: ['', [Validators.required, Validators.min(1)]],
            date: ['', Validators.required],
            time: [''],
            category: ['', Validators.required],
            payment_type: ['', Validators.required],
            expense_type: ['', Validators.required],
            comments: ['']
        });

        
    }

    ngOnInit()
    {      
        this.userId = this.loginService.getUserId();
    
        this.getCategories();

        if (this.type == 'edit')
        {
            this.expenseForm.patchValue(this.editData);
            let date = new Date(this.editData.date);
            this.expenseForm.get('date')?.setValue(date);
        }
    }

    // updateExpenseCategories(category: string)
    // {
    //     debugger
    //     this.categories = this.loginService.getCurrentCategories();
    // }

    async getCategories()
    {
        this.isLoading = true;
        let list = await getDocs(collection(this.afs.firestore, `users/${this.userId}/categories`));
        console.log(list.docs);
      
        let result = []
        result = list.docs.map((d) => ({
            id: d.id,
            ...d.data()
        }))

        this.categories = result;

        this.isLoading = false;
    }

    async saveExpenseEntry()
    {
        this.isLoading = true;
        const expenseObj = this.expenseForm.value;
        if (typeof expenseObj.date !== 'string')
        {
            expenseObj.date = expenseObj.date.toDateString();
            expenseObj['dateinMili'] = new Date(expenseObj.date).getTime();
        }

        console.log("expenseObj", expenseObj);
        let docRef;

        if (this.type == 'add')
        {
            docRef = await addDoc(collection(this.afs.firestore, `users/${this.userId}/expenses`), expenseObj);
        }
        else
        {
            docRef = doc(this.afs.firestore, `users/${this.userId}/expenses/${this.editData.id}`);
            await updateDoc(docRef, expenseObj);
        }

        this.showSnackBar()

        this.dialogRef.close(docRef.id);
    }

    showSnackBar()
    {
        let message =
          this.type == 'add' ? 'Transaction saved!' : 'Transaction updated!';
        this.snackBar.open(message, 'Ok', { duration: 2000 });
    }

    onSubmit()
    {
        if (this.expenseForm.valid)
        {
            this.saveExpenseEntry();
        }
    }

    clearForm()
    {
        this.expenseForm.reset();
    }

    getField(control: any)
    {
        return this.expenseForm.get(control)
    }

    formatAmount()
    {
        const amountControl = this.expenseForm.get('amount');

        if (this.expenseForm.get('amount') !== null)
        {
            if (typeof this.expenseForm.get('amount') !== 'string')
            {
                const rounded = this.expenseForm.get('amount')?.value.toFixed(2);
                this.expenseForm.get('amount')?.setValue(parseFloat(rounded));
            }
        }
    }


    closeDialog(): void
    {
        this.dialogRef.close();
    }

}
