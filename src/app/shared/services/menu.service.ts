import { Injectable } from '@angular/core';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  db = getFirestore();
  pizzasCollection = collection(this.db, 'pizzas')

  constructor() { }

  getPizzas(): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      getDocs(this.pizzasCollection)
        .then((snapshot) => {
          const pizzas = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id
          }));
          resolve(pizzas);
        })
        .catch((err) => {
          console.error(err.message);
          reject(err);
        });
    });
  }

  addPizza(
    name: string,
    hasSauce: boolean,
    price: number,
    description: string
    ){
    addDoc(this.pizzasCollection,{
      name: name,
      hasSauce: hasSauce,
      price: price,
      description: description
    })
    .then(() => window.location.reload())
  }

  deletePizza(id: string){
    const docRef = doc(this.db, "pizzas", id)
    deleteDoc(docRef)
    .then(() => window.location.reload())
    .catch((error) => {
      window.alert(error.message)
    })
  }

  /*
  getDocs(){
    getDocs(this.colRef)
    .then((snapshot) => {
      let books = []
      snapshot.docs.forEach((doc) => {
        books.push({
          ...doc.data(),
          id: doc.id
        })
      })
      console.log(books)
  })
  .catch(err =>{
    console.log(err.message)
  })
  }  

  addBook(title: string, author: string){
    addDoc(this.colRef,{
      title: title,
      author: author
    })
  }

  deleteBook(id: string){
    const docRef = doc(this.db, "books", id)
    deleteDoc(docRef)
    .then(() => {
      console.log("Done")
    })
    .catch((error) => {
      console.log(error);
    })
  }

  */

}
