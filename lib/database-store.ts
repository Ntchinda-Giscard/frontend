import { create } from "zustand";

type ConnectionType = "odbc" | "sql";

interface ODBCSource {
  name: string;
  description: string;
}

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
  externalApiUrl: string;
  odbcConnection: ODBCConnection;
  sqlConnection: SQLConnection;
  odbcSources: ODBCSource[];
  isLoading: boolean;
  setConnectionType: (type: ConnectionType) => void;
  setODBCConnection: (connection: ODBCConnection) => void;
  setSQLConnection: (connection: SQLConnection) => void;
  getOdbcSources: () => Promise<void>;
  saveConnection: () => Promise<void>;
}

export const useConnectionStore = create<ConnectionStore>((set, get) => ({
  connectionType: "sql",
  externalApiUrl:
    process.env.NEXT_PUBLIC_EXTERNAL_API_URL || "http://127.0.0.1:5000",
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
  odbcSources: [],
  isLoading: false,

  setConnectionType: (type) => set({ connectionType: type }),
  setODBCConnection: (connection) => set({ odbcConnection: connection }),
  setSQLConnection: (connection) => set({ sqlConnection: connection }),

  getOdbcSources: async () => {
    const { externalApiUrl } = get();
    set({ isLoading: true });

    try {
      const response = await fetch(`${externalApiUrl}/odbc/odbc-sources`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des sources ODBC");
      }

      const data = await response.json();
      set({ odbcSources: data.odbc_sources || [], isLoading: false });
    } catch (error) {
      console.error("Error fetching ODBC sources:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  saveConnection: async () => {
    const { externalApiUrl, connectionType, odbcConnection, sqlConnection } =
      get();

    const payload =
      connectionType === "odbc"
        ? {
            connection_type: "odbc",
            odbc_source: odbcConnection.dsnName,
            username: odbcConnection.username,
            password: odbcConnection.password,
            host: null,
            port: null,
            database: null,
          }
        : {
            connection_type: "sql",
            odbc_source: null,
            host: sqlConnection.host,
            port: parseInt(sqlConnection.port) || null,
            database: sqlConnection.database,
            username: sqlConnection.username,
            password: sqlConnection.password,
          };

    try {
      const response = await fetch(`${externalApiUrl}/odbc/add-database`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Erreur lors de l'enregistrement");
      }

      return await response.json();
    } catch (error) {
      console.error("Error saving connection:", error);
      throw error;
    }
  },
}));
