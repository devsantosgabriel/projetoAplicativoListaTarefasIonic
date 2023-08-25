import { Component, OnInit } from '@angular/core';
import { AlertController, PopoverController, ToastController } from '@ionic/angular';
import { TarefaService } from '../services/tarefa.service';
import { PopoverComponent } from '../popover/popover.component';
import { Observable } from 'rxjs';




@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  type: string = "pending"
  public tarefas: Observable<any[]>;

  constructor(public alertController: AlertController, public tarefaService: TarefaService,
    public toastController: ToastController, public popoverController: PopoverController) { }

ngOnInit(){
  this.tarefas = this.tarefaService.getFromFirestore();
}

  async presentAlertPromptAdd() {
    const alert = await this.alertController.create({
      header: 'Adicionar tarefa',
      inputs: [
        {
          name: 'tarefa',
          type: 'text',
          placeholder: 'Tarefa'
        },
        {
          name: 'date',
          type: 'date',
          min: '2023-01-01',
          max: '2025-12-31'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Salvar',
          handler: (alertData) => {
            if (alertData.tarefa != "") {
              this.tarefaService.addTarefas(alertData.tarefa, alertData.date);
            }
            else {
              this.presentToast();
              this.presentAlertPromptAdd();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlertPromptDelete(id: number) {
    const alert = await this.alertController.create({
      header: 'Excluir tarefa',
      message: 'Deseja realmente excluir a tarefa?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Excluir',
          handler: () => {
            this.tarefaService.deleteFromFirestore(id)
          }
        }
      ]
    });

    await alert.present();
  }
  
  async presentAlertPromptUpdate(id, tarefa) {
    const alert = await this.alertController.create({
      header: 'Atualizar tarefa',
      inputs: [
        {
          name: 'tarefa',
          type: 'text',
          placeholder: 'Tarefa',
          value: tarefa.value
        },
        {
          name: 'date',
          type: 'date',
          min: '2023-01-01',
          max: '2025-12-31',
          value: tarefa.date.toDate().getFullYear() + "-" + ((tarefa.date.toDate().getMonth() + 1) < 10 ? "0" + tarefa.date.toDate().getMonth() + 1 : tarefa.date.toDate().getMonth() + 1) + "-" + ((tarefa.date.toDate().getDay() + 1) < 10 ? "0" + tarefa.date.toDate().getDay() : tarefa.date.toDate().getDay())
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Salvar',
          handler: (alertData) => {
            if (alertData.tarefa != "") {
              this.tarefaService.updateTarefas(id,alertData.tarefa, alertData.date);
            }
            else {
              this.presentToast();
              this.presentAlertPromptUpdate(id, tarefa);
            }
          }
        }
      ]
    });

    await alert.present();
  }
  async presentToast() {
    const toast = await this.toastController.create({
      message: "Preencha a tarefa!",
      duration: 2000
    });
    await toast.present();
  }
async presentPopover(ev: any){
  const popover = await this.popoverController.create({
    component: PopoverComponent,
    event: ev,
    translucent: true
  });
  return await  popover.present();
}

}
