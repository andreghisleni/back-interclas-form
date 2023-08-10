import { getFileUrl } from '@utils/getFileUrl';
import { inject, injectable } from 'tsyringe';

import { IExcelGeneratorProvider } from '@shared/container/providers/ExcelGeneratorProvider/models/IExcelGeneratorProvider';
import { IStorageProvider } from '@shared/container/providers/StorageProvider/models/IStorageProvider';

import {
  IInscription,
  IInscriptionsRepository,
} from '../repositories/IInscriptionsRepository';

@injectable()
export class ExportToExcelService {
  constructor(
    @inject('InscriptionsRepository')
    private inscriptionsRepository: IInscriptionsRepository,

    @inject('ExcelGeneratorProvider')
    private excelGeneratorProvider: IExcelGeneratorProvider,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) { } // eslint-disable-line
  public async execute(): Promise<IInscription[]> {
    const inscriptions = await this.inscriptionsRepository.findAll();

    const data = inscriptions.map(inscription => {
      const totalPioneiros = inscription.members.filter(
        member => member.member_type.name === 'pioneiro',
      ).length;
      const totalSeniors = inscription.members.filter(
        member => member.member_type.name === 'senior',
      ).length;
      const totalMestres = inscription.members.filter(
        member => member.member_type.name === 'mestre',
      ).length;
      const totalMotoristas = inscription.members.filter(
        member => member.member_type.name === 'motorista',
      ).length;

      const totalValue =
        totalPioneiros * 100 +
        totalSeniors * 100 +
        totalMestres * 100 +
        totalMotoristas * 90;

      return {
        'Nome do Clã': inscription.cla_name,
        'Grupo escoteiro': `${inscription.scout_group_name} - ${inscription.scout_group_number}/${inscription.scout_group_state}`,
        Cidade: inscription.scout_group_city,
        Distrito: inscription.scout_group_district_name,
        Responsavel: inscription.responsable_name,
        'E-mail': inscription.responsable_email,
        Telefone: inscription.responsable_phone,
        'Total de inscritos': inscription.members.length,
        'Total pioneiros': totalPioneiros,
        'Total seniors': totalSeniors,
        'Total mestres': totalMestres,
        'Total motoristas': totalMotoristas,
        'Valor total': totalValue,
        'Comprovante de pagamento': getFileUrl(inscription.receipt_file) || '',
      };
    });

    const fileName = await this.excelGeneratorProvider.generate({
      fileName: `${new Date().getTime()}-inscriptions.xlsx`,
      sheets: [
        {
          name: 'Clãs inscritos',
          data,
        },
      ],
    });

    await this.storageProvider.saveFile(fileName);

    return inscriptions;
  }
}
