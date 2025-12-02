import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc, query } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Funcionario } from '../models';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {
  private firestore = inject(Firestore);
  private collectionName = 'funcionarios';

  listar(): Observable<Funcionario[]> {
    const ref = collection(this.firestore, this.collectionName);
    const q = query(ref);
    return (collectionData(q, { idField: 'id' }) as Observable<Funcionario[]>).pipe(
      map(funcionarios => funcionarios.sort((a, b) => 
        Number(a.matriculaFuncionario) - Number(b.matriculaFuncionario)
      ))
    );
  }

  buscarPorId(id: string): Observable<Funcionario> {
    const ref = doc(this.firestore, this.collectionName, id);
    return docData(ref, { idField: 'id' }) as Observable<Funcionario>;
  }

  criar(funcionario: Omit<Funcionario, 'id'>): Promise<any> {
    const ref = collection(this.firestore, this.collectionName);
    return addDoc(ref, funcionario);
  }

  atualizar(id: string, funcionario: Partial<Funcionario>): Promise<void> {
    const ref = doc(this.firestore, this.collectionName, id);
    return updateDoc(ref, funcionario);
  }

  excluir(id: string): Promise<void> {
    const ref = doc(this.firestore, this.collectionName, id);
    return deleteDoc(ref);
  }
}
