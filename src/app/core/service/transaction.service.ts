import { Injectable } from '@angular/core';
import { Expense } from '../models/expense-model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { deleteDoc, Firestore, getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(private firestore: Firestore) {}

  async addTransaction(userId: string, transactionObj: any): Promise<any> {
    const DocRef = collection(this.firestore, `users/${userId}/expenses`);
    return await addDoc(DocRef, transactionObj);
  }

  async updateTransaction(userId: string, transactionId: string,transactionObj: any): Promise<void> {
    const DocRef = doc( this.firestore, `users/${userId}/expenses/${transactionId}`);
    return await updateDoc(DocRef, transactionObj);
  }

  async getTransactions(userId: string): Promise<any[]> {
    const DocRef = collection(this.firestore, `users/${userId}/expenses`);
    const transactionSnapshot = await getDocs(DocRef);
    return transactionSnapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
  }

  async deleteTransaction(userId: string, transactionId: string): Promise<void> {
    const DocRef = doc( this.firestore, `users/${userId}/expenses/${transactionId}`);
    return await deleteDoc(DocRef);
  }
}
