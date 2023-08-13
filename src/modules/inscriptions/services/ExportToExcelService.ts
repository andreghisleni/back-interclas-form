import { getFileUrl } from '@utils/getFileUrl';
import { inject, injectable } from 'tsyringe';

import { IExcelGeneratorProvider } from '@shared/container/providers/ExcelGeneratorProvider/models/IExcelGeneratorProvider';
import { IStorageProvider } from '@shared/container/providers/StorageProvider/models/IStorageProvider';

import { IInscriptionsRepository } from '../repositories/IInscriptionsRepository';
import { IMembersRepository } from '../repositories/IMembersRepository';

interface IResponse {
  fileUrl: string;
}

@injectable()
export class ExportToExcelService {
  constructor(
    @inject('InscriptionsRepository')
    private inscriptionsRepository: IInscriptionsRepository,

    @inject('MembersRepository')
    private membersRepository: IMembersRepository,

    @inject('ExcelGeneratorProvider')
    private excelGeneratorProvider: IExcelGeneratorProvider,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) { } // eslint-disable-line
  public async execute(): Promise<IResponse> {
    const inscriptions = await this.inscriptionsRepository.findAll();
    const members = await this.membersRepository.findAll();

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

    const dataMembers = members.map(member => {
      return {
        Nome: member.name,
        Tipo: member.member_type.label,
        Registro: member.register || '',
        'Nome do Clã': member.inscription.cla_name,
        'Grupo escoteiro': `${member.inscription.scout_group_name} - ${member.inscription.scout_group_number}/${member.inscription.scout_group_state}`,
        Função: member.function || '',
        'Pode auxiliar em?': member.can_assist_in || '',
        'Restrições alimentares': member.alimentation_restrictions,
        'Restrições medicas': member.health_restrictions,
        'Vai chegar no sábado de manhã?': member.arrive_for_lunch
          ? 'Sim'
          : 'Não',
      };
    });

    const fileName = await this.excelGeneratorProvider.generate({
      fileName: `${new Date().getTime()}-inscriptions.xlsx`,
      sheets: [
        {
          name: 'Clãs inscritos',
          data,
        },
        {
          name: 'Membros inscritos',
          data: dataMembers,
        },
      ],
    });

    await this.storageProvider.saveFile(fileName);

    return {
      fileUrl: getFileUrl(fileName) || '',
    };
  }
}
