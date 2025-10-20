import { create } from "zustand";

type ConnectionType = "odbc" | "sql";

interface ODBCConnection {
  dsnName: string;
  username: string;
  password: string;
}

interface SQLConnection {
  host: string;
  port: string;
  database: string;
  username: string;
  password: string;
}

interface ConnectionStore {
  connectionType: ConnectionType;
  odbcConnection: ODBCConnection;
  sqlConnection: SQLConnection;
  setConnectionType: (type: ConnectionType) => void;
  setODBCConnection: (connection: ODBCConnection) => void;
  setSQLConnection: (connection: SQLConnection) => void;
}

export const useConnectionStore = create<ConnectionStore>((set) => ({
  connectionType: "sql",
  odbcConnection: {
    dsnName: "",
    username: "",
    password: "",
  },
  sqlConnection: {
    host: "",
    port: "",
    database: "",
    username: "",
    password: "",
  },
  setConnectionType: (type) => set({ connectionType: type }),
  setODBCConnection: (connection) => set({ odbcConnection: connection }),
  setSQLConnection: (connection) => set({ sqlConnection: connection }),
}));
