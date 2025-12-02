import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc, query, where, getDocs, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Usuario } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private firestore = inject(Firestore);
  private collectionName = 'usuarios';

  listar(): Observable<Usuario[]> {
    const ref = collection(this.firestore, this.collectionName);
    const q = query(ref);
    return collectionData(q, { idField: 'id' }) as Observable<Usuario[]>;
  }

  buscarPorId(id: string): Observable<Usuario> {
    const ref = doc(this.firestore, this.collectionName, id);
    return docData(ref, { idField: 'id' }) as Observable<Usuario>;
  }

  async buscarPorMatricula(matricula: string): Promise<Usuario | null> {
    const ref = collection(this.firestore, this.collectionName);
    const q = query(ref, where('matriculaUsuario', '==', matricula));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null;
    }
    
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Usuario;
  }

  criar(usuario: Omit<Usuario, 'id'>): Promise<any> {
    const ref = collection(this.firestore, this.collectionName);
    return addDoc(ref, usuario);
  }

  atualizar(id: string, usuario: Partial<Usuario>): Promise<void> {
    const ref = doc(this.firestore, this.collectionName, id);
    return updateDoc(ref, usuario);
  }

  excluir(id: string): Promise<void> {
    const ref = doc(this.firestore, this.collectionName, id);
    return deleteDoc(ref);
  }
}
