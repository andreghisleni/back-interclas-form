import fs from 'fs';
import handlebars from 'handlebars';

import {
  IParseMailTemplateDTO,
  IParseMailFileDTO,
  IParseMailHtmlDTO,
} from '../dtos/IParseMailTemplateDTO';
import { IMailTemplateProvider } from '../models/IMailTemplateProvider';

export class HandlebarsMailTemplateProvider implements IMailTemplateProvider {
  public async parse(data: IParseMailTemplateDTO): Promise<string> {
    const { variables } = data;

    let templateContent = '';

    if ((data as IParseMailFileDTO).file) {
      const { file } = data as IParseMailFileDTO;

      templateContent = await fs.promises.readFile(file, {
        encoding: 'utf-8',
      });
    } else if ((data as IParseMailHtmlDTO).html) {
      const { html } = data as IParseMailHtmlDTO;

      templateContent = html;
    }

    const parseTemplate = handlebars.compile(templateContent);

    return parseTemplate(variables);
  }
}
