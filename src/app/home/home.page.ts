import { Component } from '@angular/core';
import { AlertController, PopoverController, ToastController } from '@ionic/angular';
import { TarefaService } from '../services/tarefa.service';
import { PopoverComponent } from '../popover/popover.component';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  type: string = "pending"

  constructor(public alertController: AlertController, public tarefaService: TarefaService,
    public toastController: ToastController, public popoverController: PopoverController) { }
ngOnInit(){
  this.tarefaService.getFromStorage();
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

  async presentAlertPromptDelete(index: number) {
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
            this.tarefaService.delTarefas(index);
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlertPromptDeleteTemp(index: number) {
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
            this.tarefaService.delTarefasTemp(index);
          }
        }
      ]
    });

    await alert.present();
  }
  async presentAlertPromptRestaurar(index: number) {
    const alert = await this.alertController.create({
      header: 'Restaurar tarefa',
      message: 'Deseja realmente restaurar a tarefa?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Restaurar',
          handler: () => {
            this.tarefaService.restaurarTarefas(index);
          }
        }
      ]
    });

    await alert.present();
  }
  async presentAlertPromptUpdate(index: number, tarefa: any) {
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
          value: tarefa.date.getFullYear() + "-" + ((tarefa.date.getMonth() + 1) < 10 ? "0" + tarefa.date.getMonth() + 1 : tarefa.date.getMonth() + 1) + "-" + ((tarefa.date.getDay() + 1) < 10 ? "0" + tarefa.date.getDay() : tarefa.date.getDay())
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
              this.tarefaService.updateTarefas(index, alertData.tarefa, alertData.date);
            }
            else {
              this.presentToast();
              this.presentAlertPromptUpdate(index, tarefa);
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
