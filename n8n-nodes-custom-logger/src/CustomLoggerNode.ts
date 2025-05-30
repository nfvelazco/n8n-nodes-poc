import { INodeType, INodeTypeDescription, INodeExecutionData, IExecuteFunctions } from 'n8n-workflow';
import { Client } from 'pg';

export class CustomLoggerNode implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Custom Logger',
    name: 'customLogger',
    group: ['transform'],
    version: 1,
    description: 'Inserta logs customizados en PostgreSQL',
    defaults: {
      name: 'Custom Logger',
      color: '#00b894',
    },
    inputs: ['main' as any],
    outputs: ['main' as any],
    credentials: [
      {
        name: 'postgres',
        required: false,
        testedBy: 'testPostgresConnection',
      },
    ],
    properties: [
      {
        displayName: 'Status Code',
        name: 'status_code',
        type: 'number',
        default: 200,
        description: 'Código de estado del log',
      },
      {
        displayName: 'Message',
        name: 'message',
        type: 'string',
        default: '',
        description: 'Mensaje opcional',
        required: false,
      },
      {
        displayName: 'Origin',
        name: 'origin',
        type: 'string',
        default: '',
        description: 'Origen del log (ej: nombre del workflow)',
        required: false,
      },
      {
        displayName: 'PostgreSQL Config (opcional)',
        name: 'pgConfig',
        type: 'collection',
        placeholder: 'Agregar configuración',
        default: {},
        options: [
          {
            displayName: 'Host',
            name: 'host',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Port',
            name: 'port',
            type: 'number',
            default: 5432,
          },
          {
            displayName: 'User',
            name: 'user',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Password',
            name: 'password',
            type: 'string',
            typeOptions: { password: true },
            default: '',
          },
          {
            displayName: 'Database',
            name: 'database',
            type: 'string',
            default: '',
          },
        ],
        required: false,
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const results: INodeExecutionData[] = [];

    // Obtener configuración de conexión
    let pgConfig = this.getNodeParameter('pgConfig', 0, {}) as any;
    if (Object.keys(pgConfig).length === 0) {
      // Usar credenciales de n8n si no se provee configuración directa
      const creds = await this.getCredentials('postgres');
      pgConfig = {
        host: creds.host,
        port: creds.port,
        user: creds.user,
        password: creds.password,
        database: creds.database,
      };
    }

    const client = new Client(pgConfig);
    await client.connect();

    for (let i = 0; i < items.length; i++) {
      const status_code = this.getNodeParameter('status_code', i) as number;
      const message = this.getNodeParameter('message', i, '') as string;
      const origin = this.getNodeParameter('origin', i, '') as string;
      const data = items[i].json;
      let insertResult;
      try {
        insertResult = await client.query(
          'INSERT INTO custom_logs (status_code, data, message, origin) VALUES ($1, $2, $3, $4) RETURNING id',
          [status_code, data, message, origin]
        );
        results.push({
          json: {
            success: true,
            id: insertResult.rows[0].id,
            status_code,
            message,
            origin,
            data,
          },
        });
      } catch (error: any) {
        results.push({
          json: {
            success: false,
            error: error.message,
            status_code,
            message,
            origin,
            data,
          },
        });
      }
    }
    await client.end();
    return [results];
  }
}

export default CustomLoggerNode;
