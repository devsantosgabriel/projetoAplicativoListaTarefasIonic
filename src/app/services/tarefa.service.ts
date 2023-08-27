import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { AngularFirestore } from '@angular/fire/compat/firestore';


interface Tarefa{
  value: string
  date: Date;
  done:boolean;
}

@Injectable({
  providedIn: 'root'
})

export class TarefaService {
  
  private tarefas: Tarefa[] = []; 
  private collectionName : string = 'Tarefa';

  constructor(private firestore: AngularFirestore) { }

  public getTarefas(): Tarefa[]{
    return this.tarefas;
  } 

 
  public addTarefas(value: string, date: string){
    date = date.replace(/-/g, "/")
    let tarefa: Tarefa = {value: value, date: new Date(date), done: false};
    this.tarefas.push(tarefa);
    this.addFireStore(tarefa);
    this.setToStorage();
  }

  public delTarefas(index: number){
    this.tarefas.splice(index,1); 
    this.setToStorage();
  }

  public updateTarefas(id: number,value: string, date: string, done: boolean){    
    let tarefa: Tarefa;
    if(date != ""){
      date = date.replace(/-/g, "/");
      tarefa = {value: value, date: new Date(date), done: done};
    }else
    tarefa = {value: value,date: new Date(date), done: done}; 
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

