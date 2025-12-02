import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { SinalizacaoSolicitada } from '../models/sinalizacao-solicitada.model';

@Injectable({
  providedIn: 'root'
})
export class SinalizacaoSolicitadaService {
  private firestore = inject(Firestore);
  private collectionName = 'sinalizacoesSolicitadas';

  listarPorSolicitacao(solicitacaoId: string): Observable<SinalizacaoSolicitada[]> {
    const ref = collection(this.firestore, this.collectionName);
    const q = query(ref, where('solicitacaoId', '==', solicitacaoId));
    return collectionData(q, { idField: 'id' }) as Observable<SinalizacaoSolicitada[]>;
  }

  async criar(solicitacaoId: string, item: SinalizacaoSolicitada): Promise<string> {
    const ref = collection(this.firestore, this.collectionName);
    const docRef = await addDoc(ref, { ...item, solicitacaoId });
    return docRef.id;
  }

  async atualizar(id: string, item: Partial<SinalizacaoSolicitada>): Promise<void> {
    const ref = doc(this.firestore, this.collectionName, id);
    await updateDoc(ref, item);
  }

  async excluir(id: string): Promise<void> {
    const ref = doc(this.firestore, this.collectionName, id);
    await deleteDoc(ref);
  }

  async excluirPorSolicitacao(solicitacaoId: string): Promise<void> {
    // Este método será chamado quando uma solicitação for excluída
    // para limpar as sinalizações solicitadas associadas
    const ref = collection(this.firestore, this.collectionName);
    const q = query(ref, where('solicitacaoId', '==', solicitacaoId));
    const snapshot = await import('@angular/fire/firestore').then(m => m.getDocs(q));
    const deletePromises = snapshot.docs.map(d => deleteDoc(d.ref));
    await Promise.all(deletePromises);
  }
}
