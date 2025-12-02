import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc, query, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Solicitacao } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SolicitacaoService {
  private firestore = inject(Firestore);
  private collectionName = 'solicitacoes';

  listar(): Observable<Solicitacao[]> {
    const ref = collection(this.firestore, this.collectionName);
    const q = query(ref, orderBy('dataSolicitacao', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Solicitacao[]>;
  }

  buscarPorId(id: string): Observable<Solicitacao> {
    const ref = doc(this.firestore, this.collectionName, id);
    return docData(ref, { idField: 'id' }) as Observable<Solicitacao>;
  }

  criar(solicitacao: Omit<Solicitacao, 'id'>): Promise<any> {
    const ref = collection(this.firestore, this.collectionName);
    return addDoc(ref, solicitacao);
  }

  atualizar(id: string, solicitacao: Partial<Solicitacao>): Promise<void> {
    const ref = doc(this.firestore, this.collectionName, id);
    return updateDoc(ref, solicitacao);
  }

  excluir(id: string): Promise<void> {
    const ref = doc(this.firestore, this.collectionName, id);
    return deleteDoc(ref);
  }
}
