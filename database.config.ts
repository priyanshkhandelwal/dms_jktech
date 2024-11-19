type Connection = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
};

const connections: Record<string, Connection> = {
  default: {
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
  },
  tenant1: {
    host: '172.35.3.111',
    port: 6432,
    user: 'mstarsesdev',
    password: 'mstarsesdev@4132',
    database: 'mstarocacdose',
  },
};

export default connections;
