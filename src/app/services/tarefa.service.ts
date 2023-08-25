import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { AngularFirestore } from '@angular/fire/compat/firestore';


interface Tarefa{
  value: string
  date: Date;
  done:boolean;
  remove?: boolean; 
}

@Injectable({
  providedIn: 'root'
})

export class TarefaService {
  
  private tarefas: Tarefa[] = []; 
  private tarefasExcluidas: Tarefa[] = [];
  private collectionName : string = 'Tarefa';

  constructor(private firestore: AngularFirestore) { }

  public getTarefas(): Tarefa[]{
    return this.tarefas;
  } 

  public getTarefasExcluidas(): Tarefa[]{
    return this.tarefasExcluidas;
  }

  public addTarefas(value: string, date: string){
    date = date.replace(/-/g, "/")
    let tarefa: Tarefa = {value: value, date: new Date(date), done: false, remove: false};
    this.tarefas.push(tarefa);
    this.addFireStore(tarefa);
    this.setToStorage();
  }

  public delTarefas(index: number){
    this.tarefasExcluidas.splice(index,1); 
    this.setToStorage();
  }

  public updateTarefas(id: number,value: string, date: string){    
    let tarefa: Tarefa;
    tarefa.value = value;
    date = date.replace(/-/g, "/");
    tarefa.date = new Date(date)
    this.updateFromFirestore(id, tarefa)
  }

  public async setToStorage(){
    await Preferences.set({
      key: 'chave',
      value: JSON.stringify(this.tarefas)
    });
  }

  public async getFromStorage() {
    const storedData = await Preferences.get({key: 'chave'});
    if (storedData.value) {
      this.tarefas = JSON.parse(storedData.value);
    }else{
      this.tarefas = [] 
    }
  }

  public addFireStore (record: Tarefa){
    return this.firestore.collection(this.collectionName).add(record)
  }

  public getFromFirestore(){
    return this.firestore.collection(this.collectionName).valueChanges({idField: 'id'})
  }

  public updateFromFirestore(recordId, record: Tarefa){
    return this.firestore.doc(this.collectionName + "/" + recordId).update(record)
  }

  public updateTarefaDone(id, tarefa){
    tarefa.done = !tarefa.done
    this.updateFromFirestore(id, tarefa)
  }

  public deleteFromFirestore(recordId){
    return this.firestore.doc(this.collectionName + "/" + recordId).delete()
  }
}

