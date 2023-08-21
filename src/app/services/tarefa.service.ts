import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';


interface Tarefa{
  value: string
  date: Date;
  done?:boolean;
  remove?: boolean; 
}

@Injectable({
  providedIn: 'root'
})

export class TarefaService {
  
  private tarefas: Tarefa[] = []; 
  private tarefasExcluidas: Tarefa[] = [];

  constructor() { }

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
    this.setToStorage();
  }

  public delTarefas(index: number){
    this.tarefasExcluidas.splice(index,1); 
    this.setToStorage();
  }

  public delTarefasTemp(index: number){
    for(let i = 0; i < this.tarefas.length; i++){
      let removidas = this.tarefas.splice(index,1)[index];
      this.tarefasExcluidas.push(removidas) 
    } 
  }

 public restaurarTarefas(index: number){
  for(let i = 0; i < this.tarefasExcluidas.length; i++){
    let restauradas = this.tarefasExcluidas.splice(index,1)[index];
    this.tarefas.push(restauradas) 
    this.setToStorage()
  }
 }

  public updateTarefas(index: number,value: string, date: string){    
    let tarefa: Tarefa= this.tarefas[index];
    tarefa.value = value;
    date = date.replace(/-/g, "/");
    tarefa.date = new Date(date)
    this.tarefas.splice(index,1, tarefa);
    this.setToStorage();
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

}

