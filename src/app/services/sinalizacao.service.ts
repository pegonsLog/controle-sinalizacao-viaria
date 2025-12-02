import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc, query, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Sinalizacao } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SinalizacaoService {
  private firestore = inject(Firestore);
  private collectionName = 'sinalizacoes';

  listar(): Observable<Sinalizacao[]> {
    const ref = collection(this.firestore, this.collectionName);
    const q = query(ref, orderBy('nomeSinalizacao', 'asc'));
    return collectionData(q, { idField: 'id' }) as Observable<Sinalizacao[]>;
  }

  buscarPorId(id: string): Observable<Sinalizacao> {
    const ref = doc(this.firestore, this.collectionName, id);
    return docData(ref, { idField: 'id' }) as Observable<Sinalizacao>;
  }

  criar(sinalizacao: Omit<Sinalizacao, 'id'>): Promise<any> {
    const ref = collection(this.firestore, this.collectionName);
    return addDoc(ref, sinalizacao);
  }

  atualizar(id: string, sinalizacao: Partial<Sinalizacao>): Promise<void> {
    const ref = doc(this.firestore, this.collectionName, id);
    return updateDoc(ref, sinalizacao);
  }

  excluir(id: string): Promise<void> {
    const ref = doc(this.firestore, this.collectionName, id);
    return deleteDoc(ref);
  }
}
