import { create } from "zustand";

export interface EmailConfig {
  smtpServer: string;
  smtpPort: number;
  senderEmail: string;
  senderPassword: string;
  useSSL: boolean;
  useTLS: boolean;
  timeout?: number;
  retryAttempts?: number;
  subject?: string;
  message?: string;
}

interface AppState {
  externalApiUrl: string;
  emailConfig: EmailConfig;
  setEmailConfig: (config: Partial<EmailConfig>) => void;
  saveSMTPConfig: (config: Partial<EmailConfig>) => Promise<void>;
}

export const useSMTPStore = create<AppState>((set, get) => ({
  externalApiUrl:
    process.env.NEXT_PUBLIC_EXTERNAL_API_URL || "http://127.0.0.1:5000",
  emailConfig: {
    smtpServer: "",
    smtpPort: 0,
    senderEmail: "",
    senderPassword: "",
    useSSL: false,
    useTLS: false,
  },
  setEmailConfig: async (config) => {
    set((state) => ({
      emailConfig: { ...state.emailConfig, ...config },
    }));
  },
  saveSMTPConfig: async (config) => {
    const { externalApiUrl } = get();
    try {
      const response = await fetch(`${externalApiUrl}/email/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          smtpServer: config.smtpServer,
          smtpPort: config.smtpPort,
          senderEmail: config.senderEmail,
          senderPassword: config.senderPassword,
          useSSL: config.useSSL,
          useTLS: config.useTLS,
        }),
      });
      const data = await response.json();
      console.log("data", data);
      console.log("response", response);
    } catch (error) {
      console.error("Error saving settings:", error);
      throw error;
    }
  },
}));
