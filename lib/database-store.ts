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
  database: string;
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
  isSaving: boolean;
  setConnectionType: (type: ConnectionType) => void;
  setODBCConnection: (connection: ODBCConnection) => void;
  setSQLConnection: (connection: SQLConnection) => void;
  updateODBCField: (field: keyof ODBCConnection, value: string) => void;
  updateSQLField: (field: keyof SQLConnection, value: string) => void;
  getOdbcSources: () => Promise<void>;
  loadExistingConnection: () => Promise<void>;
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
    database: "",
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
  isSaving: false,

  setConnectionType: (type) => set({ connectionType: type }),
  setODBCConnection: (connection) => set({ odbcConnection: connection }),
  setSQLConnection: (connection) => set({ sqlConnection: connection }),

  updateODBCField: (field, value) => {
    const { odbcConnection } = get();
    set({
      odbcConnection: {
        ...odbcConnection,
        [field]: value,
      },
    });
  },

  updateSQLField: (field, value) => {
    const { sqlConnection } = get();
    set({
      sqlConnection: {
        ...sqlConnection,
        [field]: value,
      },
    });
  },

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

  loadExistingConnection: async () => {
    const { externalApiUrl } = get();
    set({ isLoading: true });

    try {
      const response = await fetch(`${externalApiUrl}/odbc/get-database`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        set({ isLoading: false });
        return; // No existing connection, that's okay
      }

      const data = await response.json();

      if (data.server) {
        const server = data.server;

        // Set connection type
        const connType = server.connection_type as ConnectionType;

        // Update all state in a single set call
        if (connType === "odbc") {
          set({
            connectionType: connType,
            odbcConnection: {
              dsnName: server.odbc_source || "",
              username: server.username || "",
              password: server.password || "",
              database: server.database || "",
            },
            isLoading: false,
          });
        } else {
          set({
            connectionType: connType,
            sqlConnection: {
              host: server.host || "",
              port: server.port?.toString() || "",
              database: server.database || "",
              username: server.username || "",
              password: server.password || "",
            },
            isLoading: false,
          });
        }
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error("Error loading existing connection:", error);
      set({ isLoading: false });
    }
  },

  saveConnection: async () => {
    const { externalApiUrl, connectionType, odbcConnection, sqlConnection } =
      get();

    set({ isSaving: true });

    const payload =
      connectionType === "odbc"
        ? {
            connection_type: "odbc",
            odbc_source: odbcConnection.dsnName,
            username: odbcConnection.username,
            password: odbcConnection.password,
            host: null,
            port: null,
            database: odbcConnection.database,
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

      set({ isSaving: false });
      return await response.json();
    } catch (error) {
      console.error("Error saving connection:", error);
      set({ isSaving: false });
      throw error;
    }
  },
}));
