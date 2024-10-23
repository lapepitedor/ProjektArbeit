import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { LoginService } from './login.service';
import { Category } from '../models/Category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(
    private firestore: Firestore,
    private loginService: LoginService
  ) {}

  // Retrieve a user's categories
  async getCategories(userId: string): Promise<any[]> {
    const categoriesRef = collection(
      this.firestore,
      `users/${userId}/categories`
    );
    const categoriesSnapshot = await getDocs(categoriesRef);
    return categoriesSnapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
  }

  //  Add a new category
  async addCategory(userId: string, categoryObj: any): Promise<any> {
    const categoriesRef = collection(
      this.firestore,
      `users/${userId}/categories`
    );
    return await addDoc(categoriesRef, categoryObj);
  }

  // Update an existing category
  async updateCategory(
    userId: string,
    categoryId: string,
    categoryObj: any
  ): Promise<void> {
    const categoryDocRef = doc(
      this.firestore,
      `users/${userId}/categories/${categoryId}`
    );
    return await updateDoc(categoryDocRef, categoryObj);
  }

  // Delete categorySupprimer une catégorie
  async deleteCategory(userId: string, categoryId: string): Promise<void> {
    const categoryDocRef = doc(
      this.firestore,
      `users/${userId}/categories/${categoryId}`
    );
    return await deleteDoc(categoryDocRef);
  }
}
